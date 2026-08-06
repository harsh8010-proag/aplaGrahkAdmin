import { Users as UsersIcon, Ban, Download, Loader2, UserX, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import StatCard from "../../../shared/components/StatCard";
import Button from "../../../shared/components/Button";
import SearchInput from "../../../shared/components/SearchInput";
import Table from "../../../shared/components/Table";
import {
  useGetAllUsersQuery,
  useUserBlockMutation,
  useUserDeleteMutation,
} from "../../../redux/api/usersApi";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";

export default function Users() {
  const navigate = useNavigate();
  const { data, isLoading, isFetching, isError, error, refetch } = useGetAllUsersQuery();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };
  const [userBlock] = useUserBlockMutation();
  const [userDelete] = useUserDeleteMutation();
  const [blockingId, setBlockingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");
  const [userTab, setUserTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    refetch();
  }, [refetch]);

  const users = data?.users || [];

  const sortedUsers = useMemo(
    () => [...users].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [users],
  );

  const tabFilteredUsers = useMemo(() => {
    switch (userTab) {
      case "Active":  return sortedUsers.filter((u) => !u.isDeleted && !u.isBlock);
      case "Blocked": return sortedUsers.filter((u) => !u.isDeleted && u.isBlock);
      case "Deleted": return sortedUsers.filter((u) => u.isDeleted);
      default:        return sortedUsers.filter((u) => !u.isDeleted); // "All" hides deleted
    }
  }, [sortedUsers, userTab]);

  const filterUser = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();
    if (!searchTerm) return tabFilteredUsers;
    return tabFilteredUsers.filter((user) => {
      const name = (user.name || "").toLowerCase();
      const mobile = (user.mobileNumber || user.phone || "").toString().toLowerCase();
      return name.includes(searchTerm) || mobile.includes(searchTerm);
    });
  }, [tabFilteredUsers, search]);

  const totalPages = Math.max(1, Math.ceil(filterUser.length / usersPerPage));
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const paginatedUsers = filterUser.slice(indexOfFirstUser, indexOfLastUser);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      setDeletingId(id);
      const res = await userDelete(id).unwrap();
      toast.success(res.message || "User deleted successfully");
      refetch();
    } catch (err) {
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
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update user status");
    } finally {
      setBlockingId(null);
    }
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const columns = ["User Name", "Address", "Joined On", "Applications", "Status", "Actions"];

  const renderRow = (user, idx) => {
    const id = user._id || user.id;
    const name = user.name || "Unnamed";
    const phone = user.mobileNumber || user.phone || "N/A";
    const initials =
      name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "US";
    const joinedOn = formatDate(user.createdAt || user.joinedOn);
    const applications = user.applicationCount || 0;
    const isActive = !user.isBlock;
    const isDeleted = user.isDeleted;
    const address1 = user.address || "Not Provided";
    const address2 = [user.taluka, user.district].filter(Boolean).join(", ");
    const isRowBlocking = blockingId === id;
    const isRowDeleting = deletingId === id;

    // Deleted tab shows deleted users with a visual indicator — don't skip

    return (
      <tr
        key={id}
        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${isDeleted ? "opacity-60" : ""} ${idx === users.length - 1 ? "border-none" : ""}`}
      >
        <td className="px-6 py-4 font-bold flex items-center space-x-3 whitespace-nowrap">
          <div className="w-10 h-10 bg-[#041A40] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
            {initials}
          </div>
          <div>
            <div className="text-gray-900">{name}</div>
            <div className="text-gray-400 font-normal">{phone}</div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-gray-700 font-bold whitespace-nowrap">{address1}</div>
          <div className="text-gray-700 font-bold whitespace-nowrap">{address2}</div>
        </td>
        <td className="px-6 py-4 font-bold text-gray-700 whitespace-nowrap">{joinedOn}</td>
        <td className="px-6 py-4">
          <span className="px-3.5 py-1 bg-[#FF8303] rounded-full inline-flex items-center justify-center text-white font-bold text-xs">
            {applications}
          </span>
        </td>
        <td className="px-6 py-4">
          <button
            onClick={() => handleUserBlock(id)}
            disabled={isRowBlocking}
            className={`w-12 h-6 rounded-full relative transition-colors duration-200 focus:outline-none border-2 ${isActive ? "bg-[#FF8303] border-[#FF8303]" : "bg-gray-100 border-gray-300"} ${isRowBlocking ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            <span
              className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full transition-transform duration-200 flex items-center justify-center ${isActive ? "bg-white translate-x-6 text-[#FF8303]" : "bg-gray-400 translate-x-0 text-white"}`}
            >
              {isRowBlocking && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
            </span>
          </button>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/users/${id}`)}
              className="text-[#041A40] transition-transform hover:scale-110 focus:outline-none"
            >
              View
            </button>
            <button
              onClick={() => handleDeleteUser(id)}
              disabled={isRowDeleting}
              className="text-red-600 transition-transform hover:scale-110 focus:outline-none disabled:opacity-50"
            >
              {isRowDeleting ? <Loader2 className="w-[18px] h-[18px] animate-spin text-red-600" /> : "Delete"}
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const renderMobileCard = (user) => {
    const id = user._id || user.id;
    const name = user.name || "Unnamed";
    const phone = user.mobileNumber || user.phone || "N/A";
    const initials =
      name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() || "US";
    const joinedOn = formatDate(user.createdAt || user.joinedOn);
    const applications = user.applicationCount || 0;
    const isActive = !user.isBlock;
    const address1 = user.addressLine1 || user.address || "Not Provided";
    const address2 = user.addressLine2 || "";
    const isRowBlocking = blockingId === id;
    const isRowDeleting = deletingId === id;

    return (
      <div key={id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#041A40] rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initials}
            </div>
            <div>
              <div className="text-gray-900 font-bold text-base leading-tight">{name}</div>
              <div className="text-gray-400 text-xs font-normal mt-0.5">{phone}</div>
            </div>
          </div>
          <button
            onClick={() => handleUserBlock(id)}
            disabled={isRowBlocking}
            className={`w-12 h-6 shrink-0 rounded-full relative transition-colors duration-200 focus:outline-none border-2 ${isActive ? "bg-[#FF8303] border-[#FF8303]" : "bg-gray-100 border-gray-300"} ${isRowBlocking ? "opacity-75 cursor-not-allowed" : ""}`}
          >
            <span
              className={`absolute top-[2px] left-[2px] w-4 h-4 rounded-full transition-transform duration-200 flex items-center justify-center ${isActive ? "bg-white translate-x-6 text-[#FF8303]" : "bg-gray-400 translate-x-0 text-white"}`}
            >
              {isRowBlocking && <Loader2 className="w-2.5 h-2.5 animate-spin" />}
            </span>
          </button>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Address</p>
          <div className="text-gray-700 text-sm font-bold">{address1}</div>
          <div className="text-gray-700 text-sm font-bold">{address2}</div>
        </div>
        <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Joined On</p>
            <p className="text-gray-800 text-sm font-bold">{joinedOn}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Applications</p>
            <span className="px-3.5 py-1 bg-[#FF8303] rounded-full inline-flex items-center justify-center text-white font-bold text-xs">{applications}</span>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-6 pt-3 border-t border-gray-100">
          <button onClick={() => navigate(`/users/${id}`)} className="text-[#041A40]">View</button>
          <button
            onClick={() => handleDeleteUser(id)}
            disabled={isRowDeleting}
            className="text-red-600 disabled:opacity-50"
          >
            {isRowDeleting ? <Loader2 className="w-5 h-5 animate-spin text-red-600" /> : "Delete"}
          </button>
        </div>
      </div>
    );
  };

  const totalUsersCount   = users.filter((u) => !u.isDeleted).length;
  const activeUsersCount  = users.filter((u) => !u.isDeleted && !u.isBlock).length;
  const totalUserBlockCount  = users.filter((u) => u.isBlock === true && !u.isDeleted).length;
  const totalUserDeleteCount = users.filter((u) => u.isDeleted === true).length;

  const userTabs = [
    { label: "All Users", value: "All",     count: totalUsersCount,      color: "#041A40", bg: "#E1F5FE" },
    { label: "Active",    value: "Active",  count: activeUsersCount,     color: "#16A34A", bg: "#DCFCE7" },
    { label: "Blocked",   value: "Blocked", count: totalUserBlockCount,  color: "#EF4444", bg: "#FEE2E2" },
    { label: "Deleted",   value: "Deleted", count: totalUserDeleteCount, color: "#6B7280", bg: "#F3F4F6" },
  ];

  return (
    <div className="w-auto lg:-mx-4 xl:-mx-8 space-y-6">
      <div>
        <div className="flex justify-between items-start gap-3">
          <div>
            <h1 className="text-3xl font-bold text-[#041A40] mb-1">Manage Users</h1>
            <p className="text-gray-600 font-bold text-sm">Manage citizen accounts, verifications and access.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end space-y-6 md:space-y-0">
        <div className="flex flex-col gap-4 w-full flex-wrap md:flex-row md:gap-4 md:w-auto">
          <div className="w-full md:w-[200px]">
            <StatCard title="Total Users" value={totalUsersCount.toString()} icon={UsersIcon} iconBgColor="bg-[#FF8303]" trend="" trendText="Total active accounts" />
          </div>
          <div className="w-full md:w-[200px]">
            <StatCard title="Blocked Users" value={totalUserBlockCount} icon={Ban} iconBgColor="bg-red-500" trend="" trendText="Suspended accounts" />
          </div>
          <div className="w-full md:w-[200px]">
            <StatCard title="Deleted Users" value={totalUserDeleteCount} icon={UserX} iconBgColor="bg-red-500" trend="" trendText="Deleted accounts" />
          </div>
        </div>
        <Button icon={Download} onClick={handleExport}>
          Export
        </Button>
      </div>

      <div className="rounded-3xl p-6 shadow-sm border border-slate-100" style={{ backgroundColor: "#D9D9D938" }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
          <h2 className="text-xl font-bold text-[#041A40]">All Users</h2>
          <div className="flex items-center gap-2">
            <SearchInput
              placeholder="Search by name or mobile number..."
              showFilter={false}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isFetching}
              title="Refresh"
              className="p-2.5 bg-gray-50 border border-gray-200 rounded-full text-gray-600 hover:bg-gray-100 hover:border-[#FF8303] hover:text-[#FF8303] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF8303]/20 shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing || isFetching ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {userTabs.map((tab) => {
            const isActive = userTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => { setUserTab(tab.value); setCurrentPage(1); }}
                className="px-4 py-2 rounded-full text-sm font-bold transition-all border"
                style={isActive
                  ? { backgroundColor: tab.bg, color: tab.color, borderColor: tab.color }
                  : { backgroundColor: "white", color: "#6B7280", borderColor: "#E5E7EB" }
                }
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#FF8303]" />
          </div>
        ) : isError ? (
          <div className="text-center text-red-500 py-10 font-bold">
            {error?.data?.message || error?.message || "Failed to load users. Please try again."}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center text-gray-500 py-10 font-bold">No users found.</div>
        ) : filterUser.length === 0 ? (
          <div className="text-center text-gray-500 py-10 font-bold">
            {search ? `No users found matching "${search}"` : `No ${userTab.toLowerCase()} users.`}
          </div>
        ) : (
          <Table columns={columns} data={paginatedUsers} renderRow={renderRow} renderMobileCard={renderMobileCard} />
        )}
      </div>

      {!isLoading && !isError && filterUser.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
          <p className="text-sm text-gray-500 font-bold">
            Showing {indexOfFirstUser + 1}–{Math.min(indexOfLastUser, filterUser.length)} of {filterUser.length} users
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              {/* Previous */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-[#FF8303] hover:text-[#FF8303] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show first, last, current and 1 neighbour on each side
                  return (
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1
                  );
                })
                .reduce((acc, page, idx, arr) => {
                  if (idx > 0 && arr[idx - 1] !== page - 1) {
                    acc.push("...");
                  }
                  acc.push(page);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === "..." ? (
                    <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm font-bold">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => setCurrentPage(item)}
                      className={`w-9 h-9 rounded-full text-sm font-bold transition-colors border ${
                        currentPage === item
                          ? "bg-[#FF8303] text-white border-[#FF8303] shadow-sm"
                          : "bg-white text-gray-600 border-gray-200 hover:border-[#FF8303] hover:text-[#FF8303]"
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

              {/* Next */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-200 bg-white text-gray-600 hover:border-[#FF8303] hover:text-[#FF8303] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
