import React from "react";
import { SidebarTrigger } from "./ui/sidebar";

const AdminHeader = () => {
  return (
    <div className="flex items-center justify-between p-2 border-b border-gray-400">
      {/* Sidebar Trigger */}
      <div className="flex items-center">
        <SidebarTrigger className="-ml-1" />
        <span className="ml-3 text-xl font-semibold font-mono">
          Admin Panel
        </span>
      </div>

      {/* Search Bar */}
      <div className="relative flex items-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-64 px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="button"
          className="absolute right-2 flex items-center justify-center w-6 h-6 text-gray-500 hover:text-green-500"
        >
          {/* Search Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m2.85-6.15a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
