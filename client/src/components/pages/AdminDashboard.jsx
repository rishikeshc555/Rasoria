import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import toast from "react-hot-toast";
import { io } from "socket.io-client"; // <-- STAGE 4: Import Socket.io client

// <-- STAGE 4: Initialize socket connection OUTSIDE the component
const socket = io("https://rasoria-api.onrender.com", {
  withCredentials: true,
  transports: ["websocket", "polling"]
});

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null); 
  
  const navigate = useNavigate(); 

  useEffect(() => {
    // --- SECURITY CHECK START ---
    const storedUser = sessionStorage.getItem("user");

    if (!storedUser) {
      toast.error("Please log in to access the dashboard.");
      navigate("/auth");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    if (parsedUser.role !== "admin") {
      toast.error("Access Denied: Restaurant Staff Only");
      navigate("/dashboard"); 
      return;
    }

    setAdminUser(parsedUser); 
    // --- SECURITY CHECK END ---

    // If they pass the security check, fetch the live orders!
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const response = await fetch("https://rasoria-api.onrender.com/api/orders");
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- STAGE 4: SOCKET.IO REAL-TIME LISTENER FOR NEW ORDERS ---
  useEffect(() => {
    // Listen for the "newOrderReceived" event broadcasted by the backend
    socket.on("newOrderReceived", (newOrder) => {
      
      // 1. Play the notification sound from the public folder
      const audio = new Audio("/notification.mp3"); 
      audio.play().catch(err => console.log("Audio play blocked by browser:", err));

      // 2. Show a sleek pop-up notification
      toast.success(`New Order Received! ₹${newOrder.totalAmount}`, {
        icon: '🔔',
        duration: 5000,
        style: {
          border: '1px solid #f97316',
          padding: '16px',
          color: '#713f12',
          background: '#fff7ed',
        },
      });

      // 3. Update the React state instantly to push the new order to the TOP of the list
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
    });

    // Cleanup listener when the admin navigates away from the page
    return () => {
      socket.off("newOrderReceived");
    };
  }, []);
  // --- END STAGE 4 ADDITIONS ---

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`https://rasoria-api.onrender.com/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success(`Order updated to ${newStatus}`);
      } else {
        toast.error("Failed to update status. Please try again.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("An error occurred while updating the status.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Preparing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Out for Delivery":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 pt-28"> 
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-brown-900">Restaurant Dashboard</h1>
            {adminUser && (
              <p className="text-gray-600 mt-1">
                Logged in as: <span className="font-bold text-orange-600">{adminUser.name}</span>
              </p>
            )}
          </div>
          <button 
              onClick={() => {
                console.log("Attempting to play audio...");
                const audio = new Audio("/notification.mp3");
                audio.play()
                  .then(() => console.log("Audio played successfully!"))
                  .catch(err => console.error("Audio block error:", err));
              }} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Test Notification Sound
            </button>
          <button 
            onClick={() => navigate("/")} 
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            Back to Website
          </button>
        </div>

        {/* ORDER LIST */}
        {isLoading ? (
          <p className="text-center text-gray-600 text-xl">Loading live orders...</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <p className="text-gray-500 text-xl">No orders yet. Waiting for hungry customers!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-600 relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between mb-4 pb-4 border-b border-gray-100">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{order.customerName || "Customer"}</h2>
                    <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold border cursor-pointer outline-none transition-colors duration-300 shadow-sm ${getStatusColor(order.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                    <p className="text-2xl font-bold text-brown-900 mt-3">₹{order.totalAmount}</p>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-700 mb-2">Order Items:</h3>
                    <ul className="space-y-1">
                      {order.items.map((item, index) => (
                        <li key={index} className="text-gray-600 flex justify-between bg-gray-50 px-3 py-2 rounded">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="font-medium">₹{item.price * item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-700 mb-2">Customer Details:</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      {/* Using fallback strings to prevent crashes if a field is missing on older orders */}
                      <p><span className="font-medium">Email:</span> {order.email || "N/A"}</p>
                      <p><span className="font-medium">Phone:</span> {order.deliveryAddress?.phone || order.phone || "N/A"}</p>
                      <p><span className="font-medium">Address:</span> {order.deliveryAddress ? `${order.deliveryAddress.street}, ${order.deliveryAddress.city}` : (order.address || "N/A")}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;