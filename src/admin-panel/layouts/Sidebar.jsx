import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmationModal from "../../shared/components/ConfirmationModal";
import { useLogoutMutation } from "../../redux/api/authApi";
import { HiDocumentPlus } from "react-icons/hi2";

const navItems = [
  {
    name: "Dashboard",
    icon: "/Icons/dashboard%20icon.svg",
    path: "/dashboard",
  },
  { name: "Users", icon: "/Icons/user%20icon.svg", path: "/users" },
  {
    name: "Application Requests",
    icon: "/Icons/application%20icon.svg",
    path: "/requests",
  },
  { name: "Document", icon: HiDocumentPlus, path: "/document" },
  { name: "Services", icon: "/Icons/service%20icon.svg", path: "/services" },
  { name: "Payments", icon: "/Icons/payment%20icon.svg", path: "/payments" },
];

export default function Sidebar({ onNavigate }) {
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logout().unwrap();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Session expired, logging out");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user_data");
      navigate("/login");
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#041A40] flex flex-col items-center pt-2 pb-4 lg:pb-6 z-20 rounded-2xl">
      <div className="w-full flex flex-col items-center">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-[80px] lg:w-[90px] py-2 lg:py-3 rounded-2xl transition-all ${
                isActive ? "text-[#F97316]" : "text-white hover:bg-white/10"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {typeof item.icon === "string" ? (
                  <img
                    src={item.icon}
                    alt={item.name}
                    className={`w-6 h-6 lg:w-8 lg:h-8 mb-1 lg:mb-2 object-contain transition-all ${
                      isActive ? "sidebar-icon-active" : ""
                    }`}
                  />
                ) : (
                  <item.icon
                    className={`w-6 h-6 lg:w-8 lg:h-8 mb-1 lg:mb-2 ${
                      isActive ? "text-[#F97316]" : "text-white"
                    }`}
                  />
                )}
                <span className="text-[10px] lg:text-xs text-center leading-snug font-bold px-1">
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      <button
        onClick={() => setIsLogoutModalOpen(true)}
        className="mt-auto bg-[#3C506C] hover:bg-[#50637f] p-3 lg:p-4 rounded-2xl transition-colors shrink-0"
        title="Logout"
      >
        <img
          src="/Icons/logout%20icon.svg"
          alt="Logout"
          className="w-5 h-5 lg:w-6 lg:h-6 object-contain"
        />
      </button>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        title="Log Out"
        message="Are you sure you want to log out of the admin panel?"
        confirmText="Log Out"
        onConfirm={handleLogoutConfirm}
        onCancel={() => setIsLogoutModalOpen(false)}
        isLoading={isLoggingOut}
      />
    </div>
  );
}
