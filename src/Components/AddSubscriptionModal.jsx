import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

const AddSubscriptionModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    durationInDays: "",
    billingCycle: "yearly",
    features: [""],
    isPopular: false,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        price: initialData.price || "",
        durationInDays: initialData.durationInDays || "",
        billingCycle: initialData.billingCycle || "yearly",
        features: initialData.features?.length ? initialData.features : [""],
        isPopular: initialData.isPopular || false,
      });
    }
  }, [initialData]);

  const handleFeatureChange = (index, value) => {
    const updated = [...form.features];
    updated[index] = value;
    setForm({ ...form, features: updated });
  };

  const addFeature = () => {
    setForm({ ...form, features: [...form.features, ""] });
  };

  const removeFeature = (index) => {
    const updated = form.features.filter((_, i) => i !== index);
    setForm({ ...form, features: updated });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4 overflow-y-auto">
      <div className={`bg-white  ${initialData ?"mt-52":""} dark:bg-gray-900 dark:text-white rounded-xl shadow-lg w-full max-w-xl`}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">
            {initialData ? "Edit Subscription Plan" : "Add Subscription Plan"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <input
            type="text"
            placeholder="Plan Name"
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Duration in Days"
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400"
            value={form.durationInDays}
            onChange={(e) => setForm({ ...form, durationInDays: e.target.value })}
            required
          />

          <select
            value={form.billingCycle}
            onChange={(e) => setForm({ ...form, billingCycle: e.target.value })}
            className="w-full p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>

          {/* Features */}
          <div>
            <label className="font-semibold mb-1 block">Features:</label>
            {form.features.map((feature, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:placeholder-gray-400"
                  placeholder={`Feature ${index + 1}`}
                  required
                />
                {form.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <IoMdClose />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              + Add Another Feature
            </button>
          </div>

          {/* Popular */}
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.isPopular}
              onChange={(e) =>
                setForm({ ...form, isPopular: e.target.checked })
              }
              className="accent-blue-600"
            />
            Mark as Popular
          </label>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-black dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              {initialData ? "Update Plan" : "Add Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;
