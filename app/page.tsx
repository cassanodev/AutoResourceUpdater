"use client";

import { LoginScreen } from "./views/LoginScreen";
import { FolderScreen } from "./views/FolderScreen";
import { Dashboard } from "./views/Dashboard";
import { useData } from "./providers/DataProvider";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function Page() {
  const { isAuthenticated, folderPath, isLoading } = useData();

  // useEffect(() => {
  //   signOut();
  //   localStorage.removeItem("folderPath");
  // }, []);

  if (isLoading) return null;
  
  return (
    <div className="h-full w-full overflow-hidden bg-[#08080A] text-[#F2F2F5] font-sans antialiased selection:bg-[#FF6A1A]/30 selection:text-white relative">
      {!isAuthenticated && (
        <LoginScreen />
      )}

      {isAuthenticated && !folderPath && (
        <FolderScreen />
      )}

      {isAuthenticated && folderPath && (
        <Dashboard />
      )}
    </div>
  );
}