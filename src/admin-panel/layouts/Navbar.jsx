import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { FiLogOut } from "react-icons/fi";
import { useGetAdminQuery } from "../../redux/api/authApi";
import DynamicInputModal from "../../shared/models/addServiceModel";

export default function Navbar({ onLogoClick }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { data: adminData } = useGetAdminQuery();

  const handleLogoClick = (e) => {
    // On mobile (< 768px), toggle sidebar instead of navigating
    if (window.innerWidth < 768 && onLogoClick) {
      e.preventDefault();
      onLogoClick();
    }
  };

  const addField = () => {
    setFields([...fields, ""]);
  };

  const handleChange = (index, value) => {
    const updatedFields = [...fields];
    updatedFields[index] = value;
    setFields(updatedFields);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token"); 
    localStorage.removeItem("user_data")
    navigate("/login", { replace: true });
  };

  return (
    <header className="py-4 bg-white flex items-center px-4 md:px-6 z-30 sticky top-0">
      <Link to="/dashboard" onClick={handleLogoClick}>
        <img
          src="/Logo/Logo.svg"
          alt="Aapla Grahak Logo"
          className="h-12 md:h-16 object-contain mr-4 md:mr-6"
        />
      </Link>

      <div className="flex-1 flex items-center justify-between bg-gray-100 rounded-xl px-3 md:px-4 py-2 border border-gray-200 shadow-sm">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#FF8303] hover:bg-[#e67400] text-white 
          w-12 h-12 md:w-auto md:h-auto
          md:px-5 md:py-2 
          rounded-full font-bold shadow-sm shadow-orange-500/20 
          transition-all active:scale-95 
          flex items-center justify-center text-sm md:text-base"
        >
          <span className="text-2xl md:text-lg leading-none md:mr-1">+</span>

          <span className="hidden md:inline">Quick Add Service</span>
        </button>

        <div className="relative group flex items-center space-x-2 md:space-x-3 pl-2 md:pl-4 cursor-pointer">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-[#041A40] rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm uppercase">
            {adminData?.admin?.name?.substring(0, 2) ||
              adminData?.admin?.email?.substring(0, 2) ||
              "AD"}
          </div>

          <div className="hidden sm:block pr-2">
            <div className="font-bold text-[#041A40] text-sm leading-tight">
              {adminData?.admin?.name ||
                adminData?.admin?.email?.split("@")[0] ||
                "Administrator"}
            </div>
            <div className="text-gray-500 text-xs font-bold">
              {adminData?.admin?.email || "Admin"}
            </div>
          </div>

          {/* Dropdown */}
         
        </div>
      </div>

      {isModalOpen && (
        <DynamicInputModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </header>
  );
}
