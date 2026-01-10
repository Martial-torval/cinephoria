"use client";
import { ReactNode } from "react";

interface CenteredModalProps {
  children: ReactNode;
  onClose: () => void;
}

export default function CenteredModal({
  children,
  onClose,
}: CenteredModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
