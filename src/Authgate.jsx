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
    // already-consumed token, gets a 401, and wipes out the 
    //  the
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
        return <div className="flex items-center justify-center h-screen bg-slate-50/50 backdrop-blur-sm">
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
        </div>; // or a splash screen / spinner
    }

    return children;
};

export default AuthGate;