// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import SubscriptionCard from "../Components/SubscriptionCard";
// import AddSubscriptionModal from "../Components/AddSubscriptionModal";

// const Subscription = () => {
//   const [subscriptions, setSubscriptions] = useState([]);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [editData, setEditData] = useState(null);

//   const token = useSelector((state) => state.auth.token);
//   const fetchSubscriptions = async () => {
//     try {
//       const res = await axios.get("http://localhost:8009/api/subscriptions", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setSubscriptions(res.data);
//     } catch (err) {
//       console.error("Error fetching subscriptions:", err);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       fetchSubscriptions();
//     }
//   }, [token]);

//   const handleAddOrUpdate = async (formData) => {
//     try {
//       if (!token) {
//         console.error("Admin token not found.");
//         return;
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       };

//       if (editData) {
//         // Update existing subscription
//         await axios.put(
//           `http://localhost:8009/api/subscriptions/${editData._id}`,
//           formData,
//           config
//         );
//       } else {
//         // Create new subscription
//         await axios.post(
//           "http://localhost:8009/api/subscriptions/create",
//           formData,
//           config
//         );
//       }
//       fetchSubscriptions();
//       setEditData(null);
//       setModalOpen(false);
//     } catch (err) {
//       console.error("Error saving subscription:", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     try {
//       if (!token) {
//         console.error("Admin token not found.");
//         return;
//       }

//       await axios.delete(`http://localhost:8009/api/subscriptions/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       fetchSubscriptions();
//     } catch (err) {
//       console.error("Error deleting subscription:", err);
//     }
//   };

//   return (
//     <div className="text-dark p-4">
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={() => {
//             setEditData(null);
//             setModalOpen(true);
//           }}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           + Add Subscription Plan
//         </button>
//       </div>

//       <div className="flex flex-wrap gap-6">
//         {subscriptions.map((plan) => (
//           <SubscriptionCard
//             key={plan._id}
//             plan={plan}
//             onEdit={(plan) => {
//               setEditData(plan);
//               setModalOpen(true);
//             }}
//             onDelete={handleDelete}
//           />
//         ))}
//       </div>

//       <AddSubscriptionModal
//         isOpen={isModalOpen}
//         onClose={() => {
//           setModalOpen(false);
//           setEditData(null);
//         }}
//         onSubmit={handleAddOrUpdate}
//         initialData={editData}
//       />
//     </div>
//   );
// };

// export default Subscription;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import SubscriptionCard from "../Components/SubscriptionCard";
import AddSubscriptionModal from "../Components/AddSubscriptionModal";

const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ Add loading state

  const token = useSelector((state) => state.auth.token);

  const fetchSubscriptions = async () => {
    setLoading(true); // ✅ Start loading
    try {
      const res = await axios.get("http://localhost:8009/api/subscriptions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubscriptions(res.data);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  useEffect(() => {
    if (token) {
      fetchSubscriptions();
    }
  }, [token]);

  const handleAddOrUpdate = async (formData) => {
    try {
      if (!token) {
        console.error("Admin token not found.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      if (editData) {
        await axios.put(
          `http://localhost:8009/api/subscriptions/${editData._id}`,
          formData,
          config
        );
      } else {
        await axios.post(
          "http://localhost:8009/api/subscriptions/create",
          formData,
          config
        );
      }
      fetchSubscriptions();
      setEditData(null);
      setModalOpen(false);
    } catch (err) {
      console.error("Error saving subscription:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!token) {
        console.error("Admin token not found.");
        return;
      }

      await axios.delete(`http://localhost:8009/api/subscriptions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSubscriptions();
    } catch (err) {
      console.error("Error deleting subscription:", err);
    }
  };

  return (
    <div className="text-dark p-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setEditData(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Subscription Plan
        </button>
      </div>

      {/* ✅ Show loading */}
      {loading ? (
<div className="flex flex-col items-center justify-center gap-4 py-8">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
        <p className="text-blue-600 text-sm font-medium animate-pulse">Loading Subscriptions, please wait...</p>
      </div>      ) : (
        <div className="flex flex-wrap gap-6">
          {subscriptions.map((plan) => (
            <SubscriptionCard
              key={plan._id}
              plan={plan}
              onEdit={(plan) => {
                setEditData(plan);
                setModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AddSubscriptionModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={handleAddOrUpdate}
        initialData={editData}
      />
    </div>
  );
};

export default Subscription;
