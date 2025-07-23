import React from "react";

const SubscriptionModal = ({ isOpen, onClose, onConfirm, planName }) => {
  if (!isOpen) return null;

  const isFree = planName === "Free";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#111] rounded-lg shadow-xl p-6 w-full max-w-md text-center">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          {isFree ? "Free Plan Info" : "Confirm Subscription"}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          {isFree
            ? "You are currently on the Free plan. Enjoy your learning journey!"
            : `Are you sure you want to subscribe to the ${planName} plan?`}
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400"
          >
            {isFree ? "Close" : "Cancel"}
          </button>

          {!isFree && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
