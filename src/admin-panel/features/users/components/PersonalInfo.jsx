import { Phone, MapPin, Calendar, User, ShieldAlert, Clock } from "lucide-react";

export default function PersonalInfo({ user }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Profile / Status Card */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#F8F9FA] border border-gray-100 rounded-2xl p-5 gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-[#041A40] flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm">
            {(user?.name || "NA").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-[#041A40] font-bold text-lg leading-tight">
              {user?.name || "N/A"}
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Registered Account Details
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {user?.isBlock ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
              <ShieldAlert className="w-3.5 h-3.5 mr-1" />
              Blocked
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">
              Active User
            </span>
          )}
          {user?.profileCompleted ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600">
              Profile Completed
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-600">
              Incomplete Profile
            </span>
          )}
          {user?.isDeleted && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600">
              Deleted
            </span>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Name */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Name</label>
          <div className="flex items-center space-x-2 px-4 py-3 bg-slate-50 border border-gray-100 rounded-xl text-sm text-gray-700 font-semibold">
            <User className="w-4 h-4 text-[#FF8303] shrink-0" />
            <span>{user?.name || "N/A"}</span>
          </div>
        </div>

        {/* Contact No */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Contact No</label>
          <div className="flex items-center space-x-2 px-4 py-3 bg-slate-50 border border-gray-100 rounded-xl text-sm text-gray-700 font-semibold">
            <Phone className="w-4 h-4 text-[#FF8303] shrink-0" />
            <span>{user?.mobileNumber || "N/A"}</span>
          </div>
        </div>

        {/* Date of Birth */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Date of Birth</label>
          <div className="flex items-center space-x-2 px-4 py-3 bg-slate-50 border border-gray-100 rounded-xl text-sm text-gray-700 font-semibold">
            <Calendar className="w-4 h-4 text-[#FF8303] shrink-0" />
            <span>{user?.dateOfBirth || "N/A"}</span>
          </div>
        </div>

        {/* Taluka */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Taluka</label>
          <div className="px-4 py-3 bg-slate-50 border border-gray-100 rounded-xl text-sm text-gray-700 font-semibold">
            {user?.taluka || "N/A"}
          </div>
        </div>

        {/* District */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">District</label>
          <div className="px-4 py-3 bg-slate-50 border border-gray-100 rounded-xl text-sm text-gray-700 font-semibold">
            {user?.district || "N/A"}
          </div>
        </div>

        {/* Member Since */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Member Since</label>
          <div className="flex items-center space-x-2 px-4 py-3 bg-slate-50 border border-gray-100 rounded-xl text-sm text-gray-700 font-semibold">
            <Clock className="w-4 h-4 text-[#FF8303] shrink-0" />
            <span>{formatDate(user?.createdAt)}</span>
          </div>
        </div>

        {/* Address */}
        <div className="flex flex-col md:col-span-2 lg:col-span-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Address</label>
          <div className="flex items-start space-x-2 px-4 py-3.5 bg-slate-50 border border-gray-100 rounded-xl text-sm text-gray-700 font-semibold leading-relaxed">
            <MapPin className="w-4 h-4 text-[#FF8303] mt-0.5 shrink-0" />
            <span>{user?.address || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
