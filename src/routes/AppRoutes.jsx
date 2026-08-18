import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

// Lazy loaded components
const Login = lazy(() => import('../auth/Login'))
const AdminLayout = lazy(() => import('../admin-panel/layouts/AdminLayout'))
const Dashboard = lazy(() => import('../admin-panel/features/dashboard/Dashboard'))
const Users = lazy(() => import('../admin-panel/features/users/Users'))
const UserProfile = lazy(() => import('../admin-panel/features/users/UserProfile'))
const Applications = lazy(() => import('../admin-panel/features/applications/Applications'))
const ApplicationDetails = lazy(() => import('../admin-panel/features/applications/ApplicationDetails'))
const Services = lazy(() => import('../admin-panel/features/services/Services'))
const Payments = lazy(() => import('../admin-panel/features/payments/Payments'))
const DocumentCards = lazy(() => import('../admin-panel/features/document/DocumentCards'))
const Support = lazy(() => import('../admin-panel/features/support/Support'))
const AddDocumentModal = lazy(() => import('../admin-panel/features/document/AddDocument'))
const ServiceDetails = lazy(() => import('../admin-panel/features/services/ServiceDetails'))
const CreateServices = lazy(() => import("../admin-panel/features/services/CreateServices"))

// Loading fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-50/50 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4 p-8 rounded-2xl bg-white shadow-xl border border-slate-100/50 animate-in fade-in duration-300">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-[#FF8303] animate-spin"></div>
          <div className="absolute w-6 h-6 rounded-full bg-[#041A40]/10 animate-ping"></div>
        </div>
        <div className="text-center">
          <p className="text-[#041A40] font-black text-sm tracking-wide">Aapla Grahak</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 animate-pulse">Initializing Portal...</p>
        </div>
      </div>
    </div>
  )
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Admin Panel Routes */}
        <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserProfile />} />
          {/* Placeholder for other admin routes */}
          <Route path="requests" element={<Applications />} />
          <Route path="requests/:id" element={<ApplicationDetails />} />
          <Route path="services" element={<Services />} />
          <Route path="document" element={<DocumentCards />} />
          <Route path="document/add" element={<AddDocumentModal />} />
          <Route path="payments" element={<Payments />} />
          <Route path="support" element={<Support />} />
          <Route path="services/:id" element={<ServiceDetails />} />
          <Route path='add-service' element={<CreateServices />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}
