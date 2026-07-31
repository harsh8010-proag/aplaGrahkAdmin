import React, { useMemo, useState, useEffect } from "react";
import { Eye, Mail, MessageSquareText, Phone, RefreshCw, Ticket, User2, X } from "lucide-react";
import { useGetAllContactsQuery, useUpdateContactStatusMutation } from "../../../redux/api/contactsApi";
import Button from "../../../shared/components/Button";
import SearchInput from "../../../shared/components/SearchInput";
import Table from "../../../shared/components/Table";

const badgeStyles = {
  Pending: "bg-[#FFEDD5] text-[#F97316]",
  "In Progress": "bg-[#DBEAFE] text-[#2563EB]",
  Resolved: "bg-[#DCFCE7] text-[#16A34A]",
};

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  return isNaN(d) ? "-" : d.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

export default function Support() {
  const { data, isLoading, isFetching, refetch } = useGetAllContactsQuery();
  const [updateContactStatus] = useUpdateContactStatusMutation();
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 5;

  const contacts = data?.contacts || [];
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) => {
      const ticket = getTicketId(c);
      return [
        ticket,
        c.fullName,
        c.mobileNumber,
        c.email,
        c.subject,
        c.message,
        c.status,
      ].some((v) => String(v || "").toLowerCase().includes(q));
    });
  }, [contacts, search]);

  const totalPages = Math.ceil(filtered.length / ticketsPerPage) || 1;
  const indexOfLast = currentPage * ticketsPerPage;
  const indexOfFirst = indexOfLast - ticketsPerPage;
  const paginatedContacts = filtered.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };


  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let lastPage;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    range.forEach((page) => {
      if (lastPage) {
        if (page - lastPage === 2) rangeWithDots.push(lastPage + 1);
        else if (page - lastPage > 2) rangeWithDots.push("...");
      }
      rangeWithDots.push(page);
      lastPage = page;
    });

    return rangeWithDots;
  };
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);


  const getTicketId = (ticket) =>
    `#${ticket?._id?.slice(-6).toUpperCase() || "TKT"}`;



  const stats = [
    { title: "Total Tickets", value: contacts.length, icon: Ticket },
    { title: "Pending", value: contacts.filter((c) => c.status === "Pending").length, icon: RefreshCw },
    { title: "In Progress", value: contacts.filter((c) => c.status === "In Progress").length, icon: MessageSquareText },
    { title: "Resolved", value: contacts.filter((c) => c.status === "Resolved").length, icon: User2 },
  ];

  const handleStatus = async (contactId, status) => {
    try {
      setUpdatingId(contactId);
      await updateContactStatus({ contactId, status }).unwrap();

    } finally {
      setUpdatingId(null);
      setSelectedContact(null)
    }
  };

  const columns = ["Ticket ID", "User", "Subject", "Message", "Status", "Created", "Action"];

  const renderRow = (contact) => {
    const ticketId = getTicketId(contact);
    return (
      <tr key={contact._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 font-black text-[#041A40] whitespace-nowrap">{ticketId}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#041A40] text-white flex items-center justify-center font-bold">
              {String(contact.fullName || "U").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-gray-900">{contact.fullName}</div>
              <div className="text-xs text-gray-400 flex items-center gap-1"><Phone size={12} /> {contact.mobileNumber}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 font-semibold text-gray-700 whitespace-nowrap">{contact.subject ? `${contact.subject.slice(0, 12)}....` : "-"}</td>
        <td className="px-6 py-4 text-gray-600 max-w-[280px]">
          <div className="truncate" title={contact.message || "-"}> {contact.message ? `${contact.message.slice(0, 12)}....` : "-"}</div>
          {contact.email && (
            <div className="text-xs text-gray-400 flex items-center gap-1 mt-1"><Mail size={12} /> {contact.email}</div>
          )}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          {updatingId === contact._id ? (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
              <RefreshCw size={12} className="animate-spin" />
              Updating...
            </span>
          ) : (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeStyles[contact.status] || "bg-gray-100 text-gray-500"}`}>
              {contact.status}
            </span>
          )}
        </td>
        <td className="px-6 py-4 font-semibold text-gray-500 whitespace-nowrap">{formatDate(contact.createdAt)}</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <button
            type="button"
            onClick={() => setSelectedContact(contact)}
            className="w-9 h-9 rounded-full bg-[#E1F5FE] text-[#041A40] flex items-center justify-center hover:bg-[#cdeefd] transition-colors"
            title="View details"
          >
            <Eye size={16} />
          </button>
        </td>
      </tr>
    );
  };

  const renderMobileCard = (contact) => {
    const ticketId = getTicketId(contact);
    return (
      <div key={contact._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-black text-[#F97316]">{ticketId}</div>
            <div className="text-lg font-black text-[#041A40] mt-1">{contact.fullName}</div>
            <div className="text-sm text-gray-500 flex items-center gap-2 mt-1"><Phone size={14} /> {contact.mobileNumber}</div>
          </div>
          {updatingId === contact._id ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
              <RefreshCw size={12} className="animate-spin" /> Updating
            </span>
          ) : (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeStyles[contact.status] || "bg-gray-100 text-gray-500"}`}>
              {contact.status}
            </span>
          )}
        </div>
        <div>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Subject</div>
          <div className="font-semibold text-gray-800">{contact.subject ? `${contact.subject.slice(0, 12)}....` : "-"}</div>
        </div>
        <div>
          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Message</div>
          <div className="text-sm text-gray-600 leading-relaxed">{contact.message ? `${contact.message.slice(0, 12)}....` : "-"}</div>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button onClick={() => handleStatus(contact._id, "Pending")} disabled={updatingId === contact._id} className="px-3 py-2 rounded-xl bg-[#FFEDD5] text-[#F97316] text-xs font-bold">
            Pending
          </button>
          <button onClick={() => handleStatus(contact._id, "In Progress")} disabled={updatingId === contact._id} className="px-3 py-2 rounded-xl bg-[#DBEAFE] text-[#2563EB] text-xs font-bold">
            In Progress
          </button>
          <button onClick={() => handleStatus(contact._id, "Resolved")} disabled={updatingId === contact._id} className="px-3 py-2 rounded-xl bg-[#DCFCE7] text-[#16A34A] text-xs font-bold">
            Resolved
          </button>
          <button
            type="button"
            onClick={() => setSelectedContact(contact)}
            className="ml-auto w-9 h-9 rounded-full bg-[#E1F5FE] text-[#041A40] flex items-center justify-center hover:bg-[#cdeefd] transition-colors"
            title="View details"
          >
            <Eye size={16} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#041A40]">Support Tickets</h1>
          <p className="text-gray-500 font-medium mt-1">Track user contact requests with ticket IDs in one responsive dashboard.</p>
        </div>
        <div className="flex items-center gap-3">
          <SearchInput value={search} onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }} placeholder="Search tickets..." />
          <Button onClick={refetch} icon={RefreshCw} className="px-4">Refresh</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.title} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500 font-semibold">{s.title}</div>
              <div className="text-3xl font-black text-[#041A40] mt-1">{s.value}</div>
            </div>
            <s.icon className="w-10 h-10 text-[#F97316]" />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
        <Table
          columns={columns}
          data={paginatedContacts}
          renderRow={renderRow}
          renderMobileCard={renderMobileCard}
          isLoading={isLoading}
          skeletonRows={5}
        />
      </div>

      {!isLoading && filtered.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 font-bold">
            Showing {indexOfFirst + 1}-{Math.min(indexOfLast, filtered.length)} of {filtered.length} tickets
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
                <span key={`dots-${idx}`} className="px-2 text-sm font-bold text-gray-400 select-none">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold ${currentPage === page
                    ? "bg-[#F97316] text-white"
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
      {selectedContact && (
        <div className="fixed inset-0 z-[90] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <div className="text-xs font-black text-[#F97316]">{getTicketId(selectedContact)}</div>
                <div className="text-xl font-black text-[#041A40] mt-1">Ticket Details</div>
              </div>
              <button
                onClick={() => setSelectedContact(null)}
                className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailBox label="Full Name" value={selectedContact.fullName} />
                <DetailBox label="Mobile Number" value={selectedContact.mobileNumber} />
                <DetailBox label="Subject" value={selectedContact.subject || "-"} />
                <DetailBox label="Status" value={selectedContact.status} />
              </div>
              <DetailBox label="Message" value={selectedContact.message || "-"} full />
              <DetailBox
                label="User"
                value={
                  selectedContact.userId
                    ? `${selectedContact.userId.name || "-"} ${selectedContact.userId.mobileNumber ? `(${selectedContact.userId.mobileNumber})` : ""}`
                    : "Guest / Not linked"
                }
              />
              {selectedContact.email && (
                <DetailBox label="Email" value={selectedContact.email} />
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailBox label="Created At" value={formatDate(selectedContact.createdAt)} />
                <DetailBox label="Updated At" value={formatDate(selectedContact.updatedAt)} />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button onClick={() => handleStatus(selectedContact._id, "Pending")} className="px-4 py-2 rounded-xl bg-[#FFEDD5] text-[#F97316] text-sm font-bold">
                  Pending
                </button>
                <button onClick={() => handleStatus(selectedContact._id, "In Progress")} className="px-4 py-2 rounded-xl bg-[#DBEAFE] text-[#2563EB] text-sm font-bold">
                  In Progress
                </button>
                <button onClick={() => handleStatus(selectedContact._id, "Resolved")} className="px-4 py-2 rounded-xl bg-[#DCFCE7] text-[#16A34A] text-sm font-bold">
                  Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailBox({ label, value, full = false }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1">{label}</div>
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-3 text-sm font-semibold text-gray-800 whitespace-pre-wrap break-words">
        {value}
      </div>
    </div>
  );
}
