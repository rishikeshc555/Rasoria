import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]); // We will store past orders here
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check if user is logged in
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/auth"); // If not logged in, kick them back to the login page
      return;
    }
    
    setUser(JSON.parse(storedUser));

    // 2. Placeholder: Here is where we will fetch their actual orders from the backend later!
    // For now, we'll use some dummy data so you can see how the UI looks.
    setOrders([
      { _id: "ORD-1029", date: "2026-03-25", total: 1098, status: "Delivered" },
      { _id: "ORD-1030", date: "2026-03-28", total: 499, status: "Processing" },
    ]);
    
    setLoading(false);
  }, [navigate]);

  if (loading) return <div className="pt-32 text-center text-xl">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-4xl font-serif font-bold text-gray-800">
            Welcome back, <span className="text-orange-600">{user?.name.split(" ")[0]}</span>!
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
                          <td className="p-3 text-sm font-medium text-gray-800">{order._id}</td>
                          <td className="p-3 text-sm text-gray-600">{order.date}</td>
                          <td className="p-3 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-3 text-sm font-medium text-gray-800">₹{order.total}</td>
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