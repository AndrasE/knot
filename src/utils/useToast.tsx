import React, { useState, useEffect } from "react";

// The Toast component remains the same
export type ToastType = "success" | "error";

export type ToastState = {
  message: string;
  type: ToastType;
};

export const Toast: React.FC<{
  toast: ToastState | null;
  isVisible: boolean;
}> = ({ toast, isVisible }) => {
  if (!toast) return null;

  const bgColor =
    toast.type === "success"
      ? "bg-green-300 text-green-900"
      : toast.type === "error"
      ? "bg-red-400 text-white"
      : "bg-gray-700 text-white";

  return (
    <div
      className={`fixed left-1/2 bottom-8 transform -translate-x-1/2
        w-auto max-w-[calc(100vw-2rem)] 
        px-4 py-3 rounded-lg shadow-lg z-50 
        transition-all duration-500 ease-in-out
        text-center
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        ${bgColor}`}>
      <div>{toast.message}</div>
    </div>
  );
};

// ✅ Refactored Hook
// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const [toastContent, setToastContent] = useState<ToastState | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (toastContent) {
      requestAnimationFrame(() => setIsVisible(true));

      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setToastContent(null), 500); // Wait for fade-out
      }, 3000);

      return () => clearTimeout(hideTimer);
    }
  }, [toastContent]);

  const showToast = (message: string, type: ToastState["type"]) => {
    setToastContent({ message, type });
  };

  // 👉 Return the props needed for the Toast component
  return { showToast, toastProps: { toast: toastContent, isVisible } };
}
