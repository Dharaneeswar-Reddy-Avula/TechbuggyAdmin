const SubscriptionCard = ({ plan, onEdit, onDelete }) => {
  const gradientBg = plan.isPopular
    ? "bg-gradient-to-br from-purple-500 via-pink-500 to-red-400 dark:from-purple-700 dark:via-pink-700 dark:to-red-600"
    : "bg-gradient-to-br from-blue-400 to-cyan-400 dark:from-blue-600 dark:to-cyan-600";

  return (
    <div
      className={`rounded-2xl shadow-xl text-white dark:text-white p-6 relative ${gradientBg} transition-all duration-300 w-[250px] flex flex-col justify-between`}
    >
      {plan.isPopular && (
        <div className="absolute top-3 right-3 bg-yellow-300 text-black font-semibold text-xs px-2 py-1 rounded-full shadow">
          POPULAR
        </div>
      )}

      <h2 className="text-2xl font-bold mb-1">{plan.name}</h2>
      <div>
      <p className="text-md mb-4 font-medium text-white/90">
        ₹{plan.price} / {plan.billingCycle}
      </p>

      <ul className="space-y-2 mb-5">
        {plan.features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm text-white/90">
            <i className="bi bi-check-circle-fill text-lime-300"></i>
            {feature}
          </li>
        ))}
      </ul>
</div>
      <div className="flex  gap-2">
        <button
          className="px-4 py-1 bg-white text-black text-sm rounded-md hover:bg-gray-200 transition"
          onClick={() => onEdit(plan)}
        >
          Edit
        </button>
        <button
          className="px-4 py-1 bg-black text-white text-sm border border-white rounded-md hover:bg-red-600 transition"
          onClick={() => onDelete(plan._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
export default SubscriptionCard