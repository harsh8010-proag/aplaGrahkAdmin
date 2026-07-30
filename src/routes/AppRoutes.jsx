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
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#FF8303] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[#041A40] font-bold text-sm">Loading...</p>
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
          <Route path='add-service' element={<CreateServices />}/>
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}
