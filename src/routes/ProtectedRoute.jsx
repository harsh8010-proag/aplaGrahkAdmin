import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Use this to wrap protected routes. It never touches window.location —
// it only ever renders <Navigate>, so React Router (HashRouter included)
// stays in full control of the URL. That's what avoids the mangled
// "/login/#login" style URLs you get from mixing a hard redirect with
// client-side routing.
const ProtectedRoute = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const bootstrapped = useSelector((state) => state.auth.bootstrapped);
  const location = useLocation();
  // Memoized so this object keeps the same reference across renders as
  // long as the pathname hasn't actually changed — required if you pass
  // it as `state` to <Navigate>, to avoid the infinite-loop issue above.
  const redirectState = useMemo(() => ({ from: location.pathname }), [location.pathname]);

  // AuthGate should already block rendering until bootstrapped is true,
  // but guard here too in case this route is reached some other way.
  if (!bootstrapped) {
    return null; // or a small spinner
  }

  if (!accessToken) {
    // IMPORTANT: don't pass state={{ from: location }} here as an inline
    // object literal. <Navigate> re-runs its internal navigate effect
    // whenever its props change by reference, and a fresh object literal
    // is a "new" value on every render — that creates an infinite
    // redirect loop ("Maximum update depth exceeded" / navigation
    // throttling). Drop it if you don't need it, or see the memoized
    // version below if you want "redirect back after login".
    //
    // Leading slash matters: always use absolute paths ("/login"), never
    // a relative one like "login" — a relative <Navigate>/navigate()
    // target is what produces a malformed combined hash URL.
    return <Navigate to="/login" replace state={redirectState} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

/*
Usage in your router:

    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        ...other protected routes...
      </Route>
    </Routes>
*/