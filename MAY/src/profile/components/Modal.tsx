import React, { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode; // render nội dung bên trong modal
}

export const Modal = ({ open, onClose, children }: ModalProps) => {
  // đóng bằng ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* ===== OVERLAY ===== */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 w-full max-w-lg mx-4 rounded-2xl bg-white p-6 shadow-xl animate-scaleIn">

        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-black text-lg"
        >
          ✕
        </button>

        {children}
      </div>
    </div>
  );
};