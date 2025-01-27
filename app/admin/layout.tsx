"use client"; // Mark this as a Client Component to use hooks and interactivity

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client"; // Import Supabase client
import AdminHeader from "@/components/AdminHeader";
import { AdminSidebar } from "@/components/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false); // State to control AlertDialog visibility
  const [alertMessage, setAlertMessage] = useState(""); // State to store the alert message
  const router = useRouter();

  useEffect(() => {
    // Fetch the current user's role
    const fetchUserRole = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        // Fetch the user's profile or role from the `user` table
        const { data: userData, error: userError } = await supabase
          .from("user") // Use the correct table name
          .select("userType")
          .eq("userId", user?.id)
          .single();

        // Check if the user is an admin
        if (userData?.userType === "admin") {
          setIsAdmin(true);
        } else {
          // Set alert message for non-admin users
          setAlertMessage("You do not have permission to access this page.");
          setShowAlert(true);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setAlertMessage("An error occurred. Please try again later.");
        setShowAlert(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [router]);

  // Handle AlertDialog close
  const handleAlertClose = () => {
    setShowAlert(false);
    router.push("/"); // Redirect to home or login page after closing the dialog
  };

  // Show a loading state while checking the user's role
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Render the layout only if the user is an admin
  if (!isAdmin) {
    return (
      <AlertDialog open={showAlert} onOpenChange={handleAlertClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Access Denied</AlertDialogTitle>
            <AlertDialogDescription>
              {alertMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleAlertClose}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <main className="flex min-h-screen w-full flex-row">
      <SidebarProvider>
        <AdminSidebar />
        <div className="flex w-[calc(100%-264px)] flex-1 flex-col bg-light-300 p-4 xs:p-10;">
          <AdminHeader />
          <div className="mt-10 pb-10">{children}</div>
        </div>
      </SidebarProvider>
    </main>
  );
};

export default Layout;