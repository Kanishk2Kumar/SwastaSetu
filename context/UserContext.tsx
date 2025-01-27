"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase/client";

interface UserContextType {
  user: User | null;
  userDetails: any | null; // To store the user data from the `user` table
  session: any | null; // For storing the complete session
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null); // For storing the complete session
  const [userDetails, setUserDetails] = useState<any | null>(null); // For storing the full user details

  useEffect(() => {
    // Function to fetch user details from the `user` table based on user ID
    const getUserDetails = async (userId: string) => {
      const { data, error } = await supabase
        .from("user") // Replace with your actual table name
        .select("*")
        .eq("userId", userId)
        .single(); // Assuming userId is unique, so we expect a single row

      if (error) {
        console.error("Error fetching user details:", error);
      } else {
        setUserDetails(data); // Store user details in the state
      }
    };

    // Fetch the current session and set the user
    const getCurrentSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setSession(session); // Store the full session
        // Fetch the full user details from the `user` table
        getUserDetails(session.user.id);
      } else {
        setUser(null);
        setUserDetails(null);
        setSession(null);
      }
    };

    getCurrentSession();

    // Listen for auth state changes and fetch the user data accordingly
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setSession(session); // Store the full session
        getUserDetails(session.user.id);
      } else {
        setUser(null);
        setUserDetails(null);
        setSession(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, userDetails, session }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for accessing user context and session
export const useAuth = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
};
