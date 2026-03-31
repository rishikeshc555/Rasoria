import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client"; // <-- 1. Import Socket.io client

// 2. Initialize socket connection OUTSIDE the component
const socket = io("https://rasoria-api.onrender.com");

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]); 
  const [loading, setLoading] = useState(true);

  // --- FETCH ORDERS ON LOAD ---
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/auth"); 
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    // 3. The REAL fetch logic replaces the dummy data
    const fetchUserOrders = async () => {
      try {
        // Grab the ID from your session storage user object
        const userId = parsedUser._id || parsedUser.id; 
        
        const response = await fetch(`https://rasoria-api.onrender.com/api/orders/user/${userId}`);
        const data = await response.json();

        if (data.success) {
          setOrders(data.orders);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [navigate]);

  // --- SOCKET.IO REAL-TIME LISTENER ---
  useEffect(() => {
    // 4. Listen for the exact event name the backend shouts
    socket.on("orderStatusUpdated", (updatedOrder) => {
      // Update the React state instantly!
      setOrders((prevOrders) => 
        prevOrders.map((order) => 
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    // Cleanup the listener when leaving the page
    return () => {
      socket.off("orderStatusUpdated");
    };
  }, []);

  if (loading) return <div className="pt-32 text-center text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-serif font-bold text-gray-800">
            Welcome back, <span className="text-orange-600">{user?.name?.split(" ")[0]}</span>!
          </h2>
          <p className="text-gray-600 mt-2 text-lg">Manage your account and view your order history.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Account Info */}
          <div className="col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Account Details</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-800">{user?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-medium text-gray-800">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium capitalize text-gray-800">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order History */}
          <div className="col-span-1 md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Recent Orders</h3>
              
              {orders.length === 0 ? (
                <p className="text-gray-500 py-4">You haven't placed any orders yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-600 text-sm">
                        <th className="p-3 border-b font-medium">Order ID</th>
                        <th className="p-3 border-b font-medium">Date</th>
                        <th className="p-3 border-b font-medium">Status</th>
                        <th className="p-3 border-b font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id} className="border-b hover:bg-gray-50 transition">
                          {/* Slicing the ID so it's readable instead of a massive 24 character string */}
                          <td className="p-3 text-sm font-medium text-gray-800">
                            ...{order._id.slice(-6).toUpperCase()}
                          </td>
                          {/* Formatting the MongoDB createdAt timestamp to a clean date string */}
                          <td className="p-3 text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                              order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          {/* Changed from order.total to order.totalAmount to match DB Schema */}
                          <td className="p-3 text-sm font-medium text-gray-800">₹{order.totalAmount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;