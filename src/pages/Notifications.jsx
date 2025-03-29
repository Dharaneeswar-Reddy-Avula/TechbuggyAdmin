import React, { useState, useEffect } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import axios from "axios";
const API_URL = "https://backteg.onrender.com/api";
import { ToastContainer, toast } from "react-toastify";
import { ImBin } from "react-icons/im";
import { MdEditNotifications } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { Link } from "react-router-dom";
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
  });
  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/notifications`);
      setNotifications(data);
    } catch (error) {
      toast.error("Error in fetching the notifications");
      console.error(
        "Error fetching events:",
        error.response?.data || error.message
      );
    }
  };
  useEffect(() => {
    fetchNotifications();
  }, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.description) {
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toLocaleString(),
        },
      ]);

      setFormData({
        title: "",
        description: "",
        link: "",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id)); // Update state immediately
      toast.success("Notification deleted successfully");
    } catch (error) {
      toast.error("Failed to delete the notification");
      console.error(
        "Error deleting notification:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-3 md:px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Notifications</h1>
        <div className="flex justify-between  mb-[10px]">
          <div className="flex items-center"> 
          <input type="text" className="w-[250px] rounded-md p-2 outline-none" placeholder="search"/>
          <CiSearch className="ml-[-25px] text-lg"/>

          </div>
          <span
            className="bg-[#2664eb] px-2 py-1 rounded-md text-white font-semibold flex items-center gap-1 mb-[10px] cursor-pointer"
            onClick={() => {
              setVisible(true);
            }}
          >
            <FaPlus />
            Create Notification
          </span>
        </div>

        <div
          className={`bg-white shadow-md rounded-lg p-4 md:p-6 mb-8 ${
            visible ? "block" : "hidden"
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-4 ">
            <span
              className={`flex justify-end text-xl ${
                visible ? "visible" : "hidden"
              }`}
              onClick={() => {
                setVisible(false);
              }}
            >
              <IoCloseSharp />
            </span>
            <div>
              <label
                htmlFor="title"
                className="block text-md font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md  outline-gray-200 shadow-sm  p-2 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter notification title"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-md font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 outline-gray-200 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter notification description"
                required
              />
            </div>

            <div>
              <label
                htmlFor="link"
                className="block text-md font-medium text-gray-700"
              >
                Link (Optional)
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="mt-1 block w-full p-2 outline-gray-200 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="https://example.com"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200"
            >
              Create Notification
            </button>
          </form>
        </div>

        {/* Notifications List */}
        <div className="shadow-md rounded-lg p-3 md:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Active Notifications
          </h2>
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No notifications available
            </p>
          ) : (
            <div className="space-y-4">

              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border border-gray-200 rounded-md p-2 md:p-2 hover:shadow-md transition duration-200"
                >
                  <div className="flex flex-col md:flex-row justify-between items-center cursor-pointer">
                    <div className="grid grid-cols-3 gap-4 items-center">
                      <h3 className="text-lg font-medium text-gray-900">{notification.title}</h3>
                      <p className=" text-gray-600 truncate">{notification.description}</p>
                      {notification.link && (
                        <Link
                          to={notification.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 text-indigo-600 hover:text-indigo-800 text-sm"
                        >
                          {notification.link}
                        </Link>
                      )}
                     
                    </div>
                    <div className='flex  mt-2 gap-2'>
                    <button
                            className="text-blue-500 text-3xl  px-3 py-1 rounded hover:scale-[1.2] ml-[20px]">
                          <MdEditNotifications />
                          </button>
                    <button
                            className="text-red-500 text-2xl px-3 py-1 rounded hover:scale-[1.2] cursor-pointer"
                            onClick={() => handleDelete(notification._id)}
                          >
<ImBin />
</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            // <div className="overflow-x-auto">
            //   <table className="min-w-full  ">
            //     <thead className="">
            //       <tr>
            //         <th className=" px-4 py-2">ID</th>
            //         <th className=" px-4 py-2">Name</th>
            //         <th className=" px-4 py-2">Update</th>
            //         <th className=" px-4 py-2">Delete</th>
            //       </tr>
            //     </thead>
            //     <tbody className="">
            //       {notifications.length > 0 ? (
            //         notifications.map((notification) => (
            //           <tr
            //             key={notification._id}
            //             className="bg-white transition mb-[5px]"
            //           >
            //             <td className=" px-4 py-2">
            //               {notification.title}
            //             </td>
            //             <td className=" px-4 py-2">
            //               {notification.description}
            //             </td>
            //             <td className=" px-4 py-2  text-2xl">
            //               <button
            //                 className="text-blue-500  px-3 py-1 rounded hover:scale-[1.2] ml-[20px]">
            //               <MdEditNotifications />

            //               </button>
            //             </td>
            //             <td className=" px-4 py-2 flex justify-center text-2xl">
            //               <button
            //                 className="text-red-500  px-3 py-1 rounded hover:scale-[1.2]"
            //                 onClick={() => handleDelete(notification._id)}
            //               >
            //                 <MdDelete />
            //               </button>
            //             </td>
            //           </tr>
            //         ))
            //       ) : (
            //         <tr>
            //           <td
            //             colSpan="4"
            //             className=" px-4 py-2 text-center"
            //           >
            //             No users registered yet.
            //           </td>
            //         </tr>
            //       )}
            //     </tbody>
            //   </table>
            // </div>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Notifications;
