// src/pages/admin/Users.jsx or wherever your Users component is located
import { Users as UsersIcon, Ban, Download, Loader2, Delete, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatCard from "../../../shared/components/StatCard";
import Button from "../../../shared/components/Button";
import SearchInput from "../../../shared/components/SearchInput";
import Table from "../../../shared/components/Table";
import {
  useGetAllUsersQuery,
  useUserBlockMutation,
  useUserDeleteMutation,
} from "../../../redux/api/usersApi";
import { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify"; // If you're using react-toastify

export default function Users() {
  const navigate = useNavigate();
  const { data, isLoading, isError, error, refetch } = useGetAllUsersQuery();
  const [userBlock] = useUserBlockMutation();
  const [userDelete] = useUserDeleteMutation();
  const [blockingId, setBlockingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const users = data?.users || [];

  // ============ WEBSOCKET INTEGRATION ============
  const [wsConnected, setWsConnected] = useState(false);
  const [lastLoginEvent, setLastLoginEvent] = useState(null);

  // Connect to WebSocket
  useEffect(() => {
    // Use environment variable or fallback
    const WS_URL = import.meta.env.REACT_APP_ADMIN_WS_URL || 'ws://localhost:5000/ws';

    console.log('🔌 Connecting to admin WebSocket...');
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('✅ Admin WebSocket connected');
      setWsConnected(true);

      // Optionally send authentication if needed
      const token = localStorage.getItem('adminToken');
      if (token) {
        ws.send(JSON.stringify({
          type: 'AUTH',
          token: token
        }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('📩 WebSocket message received:', message);

        if (message.type === 'USER_LOGGED_IN') {
          console.log('🔔 New user login detected!', message.data);
          setLastLoginEvent(message.data);

          // Show notification
          const userName = message.data?.name || 'User';
          toast.success(`🔔 ${userName} just logged in!`, {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          // Refetch users list to show updated data
          refetch();
        }
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('❌ WebSocket error:', error);
      setWsConnected(false);
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      setWsConnected(false);

      // Auto-reconnect after 5 seconds
      const reconnectTimer = setTimeout(() => {
        console.log('🔄 Attempting to reconnect WebSocket...');
      }, 5000);

      return () => clearTimeout(reconnectTimer);
    };

    // Cleanup on component unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close(1000, 'Component unmounted');
      }
    };
  }, [refetch]); // Reconnect if refetch function changes

  // Optional: Show connection status toast
  useEffect(() => {
    if (wsConnected) {
      console.log('✅ Real-time updates active');
    } else {
      console.log('⚠️ Real-time updates disabled - refresh manually');
    }
  }, [wsConnected]);
  // ============ END WEBSOCKET INTEGRATION ============

  // Newest user pehle dikhane ke liye
  const sortedUsers = [...users].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    try {
      setDeletingId(id);
      const res = await userDelete(id).unwrap();

      console.log(res);
      toast.success(res.message || "User deleted successfully");
      refetch(); // Refetch after deletion
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const handleUserBlock = async (id) => {
    try {
      setBlockingId(id);
      await userBlock(id).unwrap();
      toast.success("User status updated successfully");
      refetch(); // Refetch after block/unblock
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "Failed to update user status");
    } finally {
      setBlockingId(null);
    }
  };

  const columns = [
    "User Name",
    "Address",
    "Joined On",
    "Applications",
    "Status",
    "Actions",
  ];

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleExport = () => {
    const exportData = filterUser.map((user) => ({
      Name: user.name || "N/A",
      Mobile: user.mobileNumber || user.phone || "N/A",
      Address: user.address || "N/A",
      Taluka: user.taluka || "N/A",
      District: user.district || "N/A",
      Applications: user.applicationCount || 0,
      Status: user.isBlock ? "Blocked" : "Active",
      JoinedOn: formatDate(user.createdAt),
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    XLSX.writeFile(workbook, "Users.xlsx");
    toast.success("Users exported successfully!");
  };

  const activeSortedUsers = [...users]
    .filter((user) => !user.isDeleted)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filterUser = activeSortedUsers.filter((user) => {
    return (user.name || "").toLowerCase().includes(search.toLowerCase());
  });

  // Pagination calculations
  const totalPages = Math.ceil(filterUser.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const paginatedUsers = filterUser.slice(indexOfFirstUser, indexOfLastUser);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const delta = 1; // how many pages to show around current page
    const range = [];
    const rangeWithDots = [];
    let lastPage;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((page) => {
      if (lastPage) {
        if (page - lastPage === 2) {
          rangeWithDots.push(lastPage + 1);
        } else if (page - lastPage > 2) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(page);
      lastPage = page;
    });

    return rangeWithDots;
  };

  const renderRow = (user, idx) => {
    const id = user._id || user.id;
    const name = user.name || "Unnamed";
    const phone = user.mobileNumber || user.phone || "N/A";
    const initials =
      name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase() || "US";
    const joinedOn = formatDate(user.createdAt || user.joinedOn);
    const applications = user.applicationCount || 0;
    const isActive = !user.isBlock;
    const isDeleted = user.isDeleted;
    const address1 = user.address || "Not Provided";
    const address2 = [user.taluka, user.district].filter(Boolean).join(", ");
    const isRowBlocking = blockingId === id;
    const isRowDeleting = deletingId === id;

    // Check if this user just logged in (for highlighting)
    const isJustLoggedIn = lastLoginEvent && lastLoginEvent.userId === id;

    if (isDeleted) return null;

    return (
      <tr
        key={id}
        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${idx === users.length - 1 ? "border-none" : ""
          } ${isJustLoggedIn ? "bg-green-50 animate-pulse" : ""}`}
      >
        {/* User Info */}
        <td className="px-6 py-4 font-bold flex items-center space-x-3 whitespace-nowrap">
          <div className="w-10 h-10 bg-[#041A40] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
            {initials}
          </div>
          <div>
            <div className="text-gray-900">
              {name}
              {isJustLoggedIn && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Just Logged In 🟢
                </span>
              )}
            </div>
            <div className="text-gray-400 font-normal">{phone}</div>
          </div>
        </td>

        {/* Address */}
        <td className="px-6 py-4">
          <div className="text-gray-700 font-bold whitespace-nowrap">
            {address1}
          </div>
          <div className="text-gray-700 font-bold whitespace-nowrap">
            {address2}
          </div>
        </td>

        {/* Joined On */}
        <td className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">
          {joinedOn}
        </td>

        {/* Applications */}
        <td className="px-6 py-4">
          <span className="px-3.5 py-1 bg-[#FF8303] rounded-full inline-flex items-center justify-center text-white font-bold text-xs">
            {applications}
          </span>
        </td>

        {/* Status Toggle */}
        <td className="px-6 py-4">
          <button
            onClick={() => handleUserBlock(id)}
            disabled={isRowBlocking}
            className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none border-2 ${isActive
              ? "bg-[#FF8303] border-[#FF8303]"
              : "bg-gray-100 border-gray-300"
              } ${isRowBlocking ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            <span
              className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full transition-transform duration-200 flex items-center justify-center ${isActive
                ? "bg-white translate-x-6 text-[#FF8303]"
                : "bg-gray-400 translate-x-0 text-white"
                }`}
            >
              {isRowBlocking && (
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
              )}
            </span>
          </button>
        </td>

        {/* Actions */}
        <td className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/users/${id}`)}
              className="text-[#041A40] transition-transform hover:scale-110 focus:outline-none"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-[18px] h-[18px]"
              >
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
            </button>
            <button
              onClick={() => handleDeleteUser(id)}
              disabled={isRowDeleting}
              className="text-red-600 transition-transform hover:scale-110 focus:outline-none disabled:opacity-50"
            >
              {isRowDeleting ? (
                <Loader2 className="w-[18px] h-[18px] animate-spin text-red-600" />
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-[18px] h-[18px]"
                >
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
              )}
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const renderMobileCard = (user, idx) => {
    const id = user._id || user.id;
    const name = user.name || "Unnamed";
    const phone = user.mobileNumber || user.phone || "N/A";
    const initials =
      name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase() || "US";
    const joinedOn = formatDate(user.createdAt || user.joinedOn);
    const applications =
      user.applications !== undefined ? user.applications : 0;
    const isActive = !user.isBlock;
    const address1 = user.addressLine1 || user.address || "Not Provided";
    const address2 = user.addressLine2 || "";
    const isRowBlocking = blockingId === id;
    const isRowDeleting = deletingId === id;

    // Check if this user just logged in
    const isJustLoggedIn = lastLoginEvent && lastLoginEvent.userId === id;

    return (
      <div
        key={id}
        className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-4 ${isJustLoggedIn ? "border-green-500 border-2 bg-green-50" : ""
          }`}
      >
        {/* Header: User Info & Status */}
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#041A40] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initials}
            </div>
            <div>
              <div className="text-gray-900 font-bold text-base leading-tight">
                {name}
                {isJustLoggedIn && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    🟢 Just In
                  </span>
                )}
              </div>
              <div className="text-gray-400 text-xs font-normal mt-0.5">
                {phone}
              </div>
            </div>
          </div>
          <button
            onClick={() => handleUserBlock(id)}
            disabled={isRowBlocking}
            className={`w-12 h-6 shrink-0 rounded-full relative transition-colors duration-200 focus:outline-none border-2 ${isActive
              ? "bg-[#FF8303] border-[#FF8303]"
              : "bg-gray-100 border-gray-300"
              } ${isRowBlocking ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            <span
              className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full transition-transform duration-200 flex items-center justify-center ${isActive
                ? "bg-white translate-x-6 text-[#FF8303]"
                : "bg-gray-400 translate-x-0 text-white"
                }`}
            >
              {isRowBlocking && (
                <Loader2 className="w-2.5 h-2.5 animate-spin" />
              )}
            </span>
          </button>
        </div>

        {/* Details: Address */}
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
            Address
          </p>
          <div className="text-gray-700 text-sm font-bold">{address1}</div>
          <div className="text-gray-700 text-sm font-bold">{address2}</div>
        </div>

        {/* Details: Joined On & Applications */}
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
              Joined On
            </p>
            <p className="text-gray-800 text-sm font-bold">{joinedOn}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">
              Applications
            </p>
            <span className="px-3.5 py-1 bg-[#FF8303] rounded-full inline-flex items-center justify-center text-white font-bold text-xs">
              {applications}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-6 pt-3 border-t border-gray-100">
          <button
            onClick={() => navigate(`/users/${id}`)}
            className="text-[#041A40] transition-transform active:scale-95 focus:outline-none flex flex-col items-center"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 mb-1"
            >
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
            <span className="text-[10px] font-bold">View</span>
          </button>
          <button className="text-[#FF8303] transition-transform active:scale-95 focus:outline-none flex flex-col items-center">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-5 h-5 mb-1"
            >
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
            <span className="text-[10px] font-bold">Edit</span>
          </button>
          <button
            onClick={() => handleDeleteUser(id)}
            disabled={isRowDeleting}
            className="text-red-600 transition-transform active:scale-95 focus:outline-none flex flex-col items-center disabled:opacity-50"
          >
            {isRowDeleting ? (
              <Loader2 className="w-5 h-5 mb-1 animate-spin text-red-600" />
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 mb-1"
              >
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            )}
            <span className="text-[10px] font-bold">Delete</span>
          </button>
        </div>
      </div>
    );
  };

  const totalUsersCount = users.filter((user) => user.isDeleted === false).length;
  const totalUserBlockCount = users.filter((user) => user.isBlock === true).length;
  const totalUserDeleteCount = users.filter((user) => user.isDeleted === true).length;

  return (
    <div className="w-auto lg:-mx-4 xl:-mx-8 space-y-6">
      {/* Header Section with WebSocket Status */}
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#041A40] mb-1">Manage Users</h1>
            <p className="text-gray-600 font-bold text-sm">
              Manage citizen accounts, verifications and access.
            </p>
          </div>
          {/* WebSocket Status Indicator */}
          <div className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-full">
            <span
              className={`inline-block w-2 h-2 rounded-full ${wsConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
            />
            <span className="text-xs font-bold text-gray-700">
              {wsConnected ? "Live Updates" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Stat Cards & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end space-y-6 md:space-y-0">
        <div className="flex flex-col gap-4 w-full flex-wrap md:flex-row md:gap-4 md:w-auto">
          <div className="w-full md:w-[200px]">
            <StatCard
              title="Total Users"
              value={totalUsersCount.toString()}
              icon={UsersIcon}
              iconBgColor="bg-[#FF8303]"
              trend=""
              trendText="Total active accounts"
            />
          </div>
          <div className="w-full md:w-[200px]">
            <StatCard
              title="Blocked Users"
              value={totalUserBlockCount}
              icon={Ban}
              iconBgColor="bg-red-500"
              trend=""
              trendText="Suspended accounts"
            />
          </div>
          <div className="w-full md:w-[200px]">
            <StatCard
              title="Deleted Users"
              value={totalUserDeleteCount}
              icon={UserX}
              iconBgColor="bg-red-500"
              trend=""
              trendText="Deleted accounts"
            />
          </div>
        </div>

        {/* Export Button */}
        <Button icon={Download} onClick={handleExport}>
          Export
        </Button>
      </div>

      {/* Table Section */}
      <div
        className="rounded-3xl p-6 shadow-sm border border-slate-100"
        style={{ backgroundColor: "#D9D9D938" }}
      >
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-[#041A40]">All Users</h2>
            {lastLoginEvent && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                New login: {lastLoginEvent.name}
              </span>
            )}
          </div>
          <SearchInput
            placeholder="Search user"
            showFilter={false}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF8303]" />
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-10 font-bold">
            {error.data?.message || error?.message || 'Failed to load users. Please try again.'}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-500 py-10 font-bold">
            No users found.
          </div>
        ) : (
          <Table
            columns={columns}
            data={paginatedUsers}
            renderRow={renderRow}
            renderMobileCard={renderMobileCard}
          />
        )}
      </div>

      {!isLoading && !isError && filterUser.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
          <p className="text-sm text-gray-500 font-bold">
            Showing {indexOfFirstUser + 1}-
            {Math.min(indexOfLastUser, filterUser.length)} of{" "}
            {filterUser.length} users
          </p>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold text-[#041A40] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Prev
            </button>

            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span
                  key={`dots-${idx}`}
                  className="px-2 text-sm font-bold text-gray-400 select-none"
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold ${currentPage === page
                    ? "bg-[#FF8303] text-white"
                    : "border border-gray-200 text-[#041A40] hover:bg-gray-100"
                    }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-bold text-[#041A40] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}