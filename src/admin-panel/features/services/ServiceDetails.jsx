import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import {
  User,
  Users,
  IndianRupee,
  Clock3,
  FileText,
  Building2,
  Globe,
  Languages,
  ShieldCheck,
  Pencil,
  Trash2,
  RotateCcw,
} from "lucide-react";
import {
  useGetServiceByIdQuery,
  useGetServiceApplicationsQuery,
} from "../../../redux/api/servicesApi";
import { useParams } from "react-router-dom";

const steps = [
  {
    title: "Apply Online",
    text: "Fill the application form with required details",
  },
  {
    title: "Upload Documents",
    text: "Upload the required documents",
  },
  {
    title: "Verification",
    text: "Application will be verified by authorities",
  },
  {
    title: "Completion",
    text: "Service will be completed",
  },
];

const ServiceDetails = () => {
  const { id } = useParams();

  // console.log("ID:", id);

  const {
    data: serviceData,
    isLoading,
    error,
    refetch,
  } = useGetServiceByIdQuery(id);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const {
    data: applicationsData,
    isLoading: isAppsLoading,
    error: appsError,
    refetch: refetchApplications,
  } = useGetServiceApplicationsQuery({ id, page, limit });

  const service = serviceData?.data;
  const applications = applicationsData?.data?.applications || [];
  const totalAppCount = applicationsData?.data?.total ?? 0;
  const totalPages = applicationsData?.data?.totalPages ?? 1;
  // console.log(applications)
  useEffect(() => {
    refetch();
  }, [refetch]);


  // console.log("Error:", error);

  const stats = [
    {
      title: "Applications Processed",
      value: service?.stats?.applicationsProcessed ?? 0,
      sub: "Total applications completed",
      icon: User,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Users Served",
      value: service?.stats?.usersServed ?? 0,
      sub: "Unique users served",
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Service Fees",
      value: `₹${service?.stats?.serviceFee ?? (service?.price || 0) / 100}`,
      sub: "Per application",
      icon: IndianRupee,
      color: "bg-orange-100 text-orange-500",
    },
    {
      title: "Estimated Time",
      value: service?.stats?.estimatedTime
        ? `${service.stats.estimatedTime}`
        : service?.processingTime?.en,
      sub: "Processing time",
      icon: Clock3,
      color: "bg-purple-100 text-purple-600",

    },
  ];



  return (
    <div className="min-h-screen">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <button
            className="text-gray-500 text-sm mb-3 cursor-pointer"
            onClick={() => window.history.back()}
          >
            ← Back to Services
          </button>

          <div className="flex gap-4">
            <div className="h-14 w-14 rounded-full bg-orange-500 flex items-center justify-center">
              <FileText className="text-white" />
            </div>

            <div>
              <h1 className="text-3xl font-bold">{service?.name?.en}</h1>

              <p className="text-gray-500">{service?.description?.en}</p>
            </div>
          </div>
        </div>

        {/* <div className="flex items-center gap-5">
          <Pencil className="text-orange-500 cursor-pointer" size={20} />

          <Trash2 className="text-red-500 cursor-pointer" size={20} />

          <div className="w-12 h-6 rounded-full bg-gray-200 relative">
            <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-black" />
          </div>
        </div> */}
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">
        {stats.map((item, i) => {
          const Icon = item.icon;

          return (
            <div key={i} className="bg-white rounded-2xl border p-6 shadow-sm">
              <div className="flex gap-4">
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center ${item.color}`}
                >
                  <Icon />
                </div>

                <div>
                  <p className="text-sm text-gray-500">{item.title}</p>

                  <h2 className="text-3xl font-bold">{item.value}</h2>

                  <p className="text-xs text-gray-400">{item.sub}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Section */}

      <div className="grid xl:grid-cols-2 gap-5 mt-6">
        {/* About */}

        <div className="bg-white rounded-2xl border p-6">
          <h2 className="font-bold text-lg">About this Service</h2>

          <p className="text-gray-500 mt-3">{service?.description?.en}</p>

          <div className="mt-8 space-y-5">
            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <ShieldCheck size={18} />
                Service Category
              </div>

              <span>Identity Services</span>
            </div>

            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <Building2 size={18} />
                Department
              </div>

              <span>UIDAI</span>
            </div>

            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <Globe size={18} />
                Service Type
              </div>

              <span>Online</span>
            </div>

            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <User size={18} />
                Available For
              </div>

              <span>All Citizens</span>
            </div>

            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <Languages size={18} />
                Language
              </div>

              <span>English, मराठी</span>
            </div>
          </div>
        </div>

        {/* Right */}

        <div className="space-y-5">
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="font-bold">Required Documents</h2>

            <div className="flex flex-wrap gap-3 mt-5">
              {service?.documents?.map((doc, i) => (
                <span
                  key={doc?.documentTypeId?._id || i}
                  className="px-4 py-2 rounded-full bg-orange-50 text-orange-600 text-sm"
                >
                  {doc?.documentTypeId?.name?.en || "N/A"}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border p-6">
            <h2 className="font-bold">Process Overview</h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 mt-8 gap-5">
              {steps.map((item, i) => (
                <div key={i} className="text-center">
                  <div className="h-8 w-8 rounded-full bg-orange-500 text-white mx-auto flex items-center justify-center">
                    {i + 1}
                  </div>

                  <h3 className="font-semibold mt-4">{item.title}</h3>

                  <p className="text-xs text-gray-500 mt-2">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl border mt-6 overflow-hidden">
        <div className="flex items-center justify-between p-5">
          <div>
            <h2 className="font-bold text-lg">Recent Applications</h2>
            <p className="text-xs text-gray-500">
              Showing page {page} of {totalPages}, {totalAppCount} total applications
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 text-sm text-blue-600 font-medium"
            onClick={() => refetchApplications()}
            type="button"
          >
            <RotateCcw size={16} />
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <div className="min-w-[700px] ">
            <table className=" w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">Application ID</th>
                  <th className="p-4 text-left">Applicant Name</th>
                  <th className="p-4 text-left">Mobile Number</th>
                  <th className="p-4 text-left">Applied On</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {appsError ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-red-500">
                      Failed to load applications.
                    </td>
                  </tr>
                ) : isAppsLoading ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-500">
                      Loading applications...
                    </td>
                  </tr>
                ) : applications.length > 0 ? (
                  applications.map((app) => {
                    const statusStyles = {
                      Pending: "bg-yellow-100 text-yellow-700",
                      Completed: "bg-green-100 text-green-700",
                      Rejected: "bg-red-100 text-red-700",
                      "In Progress": "bg-blue-100 text-blue-700",
                    };

                    return (
                      <tr key={app._id} className="border-t">
                        <td className="p-4">#{app._id?.slice(-8).toUpperCase()}</td>
                        <td className="p-4">
                          {app.formData?.applicantName || app.formData?.name || app.formData?.fullName || app.userId?.name || "N/A"}
                        </td>
                        <td className="p-4">
                          {app.formData?.mobileNumber ||
                            app.userId?.mobileNumber ||
                            "N/A"}
                        </td>
                        <td className="p-4">
                          {new Date(app.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs ${statusStyles[app.status] ||
                              "bg-gray-100 text-gray-700"
                              }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="p-4 text-blue-600 cursor-pointer">
                          <Link to={`/requests/${app._id}`} >
                            View Details</Link>

                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-gray-400">
                      No recent applications found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-t bg-gray-50">
          <div className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-2 rounded-lg border text-sm text-gray-700 disabled:opacity-40"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </button>
            <button
              className="px-3 py-2 rounded-lg border text-sm text-gray-700 disabled:opacity-40"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;
