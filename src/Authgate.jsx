import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useBootstrapSessionMutation } from '../src/redux/api/authApi';

// Wrap your whole app (or your router) in this. It fires the refresh call
// exactly once on mount, and holds off rendering children until we know
// whether the httpOnly cookie still represents a valid session.
const AuthGate = ({ children }) => {
    const [bootstrapSession] = useBootstrapSessionMutation();
    const bootstrapped = useSelector((state) => state.auth.bootstrapped);

    // React 18 StrictMode runs effects twice in dev (mount -> cleanup ->
    // mount). Since this effect has no cleanup, both runs would fire
    // bootstrapSession() almost simultaneously. Because the refresh token
    // is single-use/rotating, the SECOND call arrives with an
    // already-consumed token, gets a 401, and wipes out the session the
    // first call just successfully set. This ref makes sure only the first
    // invocation actually calls the API.
    const hasBootstrapped = useRef(false);

    useEffect(() => {
        if (hasBootstrapped.current) return;
        hasBootstrapped.current = true;
        bootstrapSession();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // empty deps — run once, not on every render

    if (!bootstrapped) {
        return <div>Loading…</div>; // or a splash screen / spinner
    }

    return children;
};

export default AuthGate;