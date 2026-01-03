import { useState, useEffect } from "react";
import Upload from "./components/Upload";
import Download from "./components/Download";
import NeonDivider from "./components/NeonDivider";
import { Toaster } from "react-hot-toast";

export default function App() {
  const [loadingSplash, setLoadingSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingSplash(false), 2500); // 2.5s splash
    return () => clearTimeout(timer);
  }, []);

  if (loadingSplash)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B0F14]">
        <div className="flex flex-col items-center animate-pulse">
          <svg className="w-20 h-20 text-accent mb-4 animate-spin-slow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 3l7 4v5c0 5-3.5 9-7 10-3.5-1-7-5-7-10V7l7-4z" />
          </svg>
          <h1 className="text-3xl font-bold text-accent">ShieldShare</h1>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white flex flex-col items-center justify-center px-4 py-10 transition-all">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-5xl">

        {/* Brand Header */}
        <div className="text-center mb-12 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 animate-pulse">
            <svg className="w-10 h-10 text-accent animate-spin-slow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 3l7 4v5c0 5-3.5 9-7 10-3.5-1-7-5-7-10V7l7-4z" />
            </svg>
            <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-accent">
              ShieldShare
            </h1>
          </div>
          <p className="mt-3 text-sm text-gray-400">
            End-to-end encrypted • One-time secure file sharing
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8">
          <Upload />
          <NeonDivider />
          <Download />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-xs text-gray-500">
          Zero storage • Auto-expire • Military-grade encryption
        </div>
      </div>
    </div>
  );
}
