// app/managergudang/stockbarang/components/NotificationCards.tsx
import { Notification } from "@/types/stock";

interface NotificationCardsProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
}

export default function NotificationCards({
  notifications,
  onNotificationClick,
}: NotificationCardsProps) {
  const getPriorityColor = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return "bg-red-100 hover:bg-red-200 border-red-300";
      case "medium":
        return "bg-yellow-100 hover:bg-yellow-200 border-yellow-300";
      case "low":
        return "bg-gray-200 hover:bg-gray-300 border-gray-300";
    }
  };

  const getPriorityIcon = (priority: "high" | "medium" | "low") => {
    switch (priority) {
      case "high":
        return (
          <svg
            className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      case "medium":
        return (
          <svg
            className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "low":
        return (
          <svg
            className="w-6 h-6 text-gray-600 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        );
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 space-y-3 z-40 max-w-sm">
      {notifications.map((notif) => (
        <button
          key={notif.id}
          onClick={() => onNotificationClick(notif)}
          className={`${getPriorityColor(
            notif.priority
          )} rounded-lg px-4 py-3 shadow-lg transition-all text-left w-full block border-2`}
        >
          <div className="flex items-start gap-3">
            {getPriorityIcon(notif.priority)}
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">
                {notif.itemName}
              </p>
              <p className="text-xs text-gray-700 mt-1 leading-relaxed">
                {notif.message}
              </p>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 bg-white bg-opacity-60 rounded text-xs font-medium">
                  {notif.category.toUpperCase()}
                </span>
                <span className="px-2 py-0.5 bg-white bg-opacity-60 rounded text-xs font-medium">
                  {notif.status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}