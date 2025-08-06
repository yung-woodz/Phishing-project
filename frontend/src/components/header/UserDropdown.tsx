"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { useAuth } from "@/context/AuthContext";
import { UserCircleIcon } from "@/icons";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  const handleLogout = async () => {
    await logout(); // Llama a logout del contexto (que llama al service)
    router.push("/signin"); // Redirige a la página de login
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="flex items-center">
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
          <Image width={44} height={44} src="/images/user/owner.jpg" alt="User" />
        </span>
        <span className="block mr-1 font-medium text-theme-sm text-gray-700 dark:text-white/80">
          {user?.nombreCompleto || "Usuario"}
        </span>
        {/* ícono de flecha */}
        <svg
          className={`stroke-gray-500 dark:text-white/80 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown isOpen={isOpen} onClose={closeDropdown} className="absolute right-0 mt-4 w-64 p-3 rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <div className="mb-3">
          <p className="font-medium text-gray-700 dark:text-white/80">{user?.nombreCompleto}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>

        <ul className="border-t pt-3">
          {/* Sign Out button */}
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm font-medium text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              Sign out
            </button>
          </li>
        </ul>
      </Dropdown>
    </div>
  );
}
