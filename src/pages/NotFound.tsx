import React from "react";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

const NotFound: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <h1 className="text-6xl font-black text-white mb-4">404</h1>
    <p className="text-xl text-[#A1A1AA] mb-8">Page not found.</p>
    <Link
      to="/"
      className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
    >
      <Home className="w-5 h-5" />
      Back to Dashboard
    </Link>
  </div>
);

export default NotFound;
