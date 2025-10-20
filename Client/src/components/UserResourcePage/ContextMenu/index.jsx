// components/UserResourcePage/ContextMenu/index.jsx
import React, { useEffect, useRef } from "react";
import { Download, Edit2 } from "lucide-react";

export default function ContextMenu({ x, y, onClose, onRename, onDownload }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
      style={{
        top: `${y}px`,
        left: `${x}px`,
      }}
    >
      <div className="py-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRename();
            onClose();
          }}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
        >
          <Edit2 className="h-4 w-4" />
          <span>Đổi tên</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
            onClose();
          }}
          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition-colors hover:bg-green-50 hover:text-green-700"
        >
          <Download className="h-4 w-4" />
          <span>Tải xuống</span>
        </button>
      </div>
    </div>
  );
}
