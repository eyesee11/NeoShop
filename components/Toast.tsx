"use client";

import { useEffect } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-gradient-to-r from-green-300 to-emerald-300",
          icon: "✅",
          title: "Success!",
        };
      case "error":
        return {
          bg: "bg-gradient-to-r from-red-300 to-pink-300",
          icon: "❌",
          title: "Error!",
        };
      case "warning":
        return {
          bg: "bg-gradient-to-r from-yellow-300 to-orange-300",
          icon: "⚠️",
          title: "Warning!",
        };
      case "info":
        return {
          bg: "bg-gradient-to-r from-blue-300 to-purple-300",
          icon: "ℹ️",
          title: "Info",
        };
    }
  };

  const styles = getStyles();

  return (
    <div
      className={`fixed top-20 right-4 z-50 min-w-[320px] max-w-md border-4 border-black p-4 ${styles.bg} shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] animate-slide-in`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl flex-shrink-0">{styles.icon}</span>
        <div className="flex-1">
          <h3 className="font-black uppercase text-lg mb-1">{styles.title}</h3>
          <p className="font-bold text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 border-black bg-white hover:bg-gray-100 font-black transition-all"
        >
          ✕
        </button>
      </div>
      {/* Progress bar */}
      <div className="mt-3 h-2 bg-black/20 border-2 border-black overflow-hidden">
        <div
          className="h-full bg-black animate-progress"
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
}
