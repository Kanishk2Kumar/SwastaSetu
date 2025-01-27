"use client"; // Ensure this is a Client Component

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client"; // Import Supabase client
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select component

type Alert = {
  id: number;
  userId: string;
  userName: string;
  message: string;
  level: string;
  title: string;
};

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]); // State to store alerts
  const [title, setTitle] = useState(""); // State for alert title
  const [message, setMessage] = useState(""); // State for alert message
  const [level, setLevel] = useState<"moderate" | "high">("moderate"); // State for alert level
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [currentUser, setCurrentUser] = useState<{ id: string; userName: string } | null>(null); // State for current user

  // Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) throw error;

      if (user) {
        // Fetch additional user details from the user table if needed
        const { data: userData, error: userError } = await supabase
          .from("user")
          .select("userName")
          .eq("userId", user.id)
          .single();

        if (userError) throw userError;

        setCurrentUser({
          id: user.id,
          userName: userData?.userName || "Unknown",
        });
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      setError("Failed to fetch current user.");
    }
  };

  // Fetch alerts from Supabase
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("alerts") // Use the correct table name
        .select("*")
        .order("id", { ascending: true }); // Sort by ID in ascending order

      if (error) throw error;

      setAlerts(data as Alert[]); // Set alerts data
    } catch (error) {
      console.error("Error fetching alerts:", error);
      setError("Failed to fetch alerts.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate the next ID based on the maximum existing ID
  const getNextId = () => {
    if (alerts.length === 0) return 1; // If no alerts, start from 1
    const maxId = Math.max(...alerts.map((alert) => alert.id)); // Find the maximum ID
    return maxId + 1; // Return the next ID
  };

  // Add a new alert
  const addAlert = async () => {
    if (!title.trim() || !message.trim()) {
      setError("Title and message cannot be empty.");
      return;
    }

    if (!currentUser) {
      setError("User not authenticated.");
      return;
    }

    try {
      setLoading(true);
      const nextId = getNextId(); // Calculate the next ID
      const { data, error } = await supabase
        .from("alerts") // Use the correct table name
        .insert([
          {
            id: nextId, // Manually assign the next ID
            title: title,
            message: message,
            level: level,
            userId: currentUser.id,
            userName: currentUser.userName,
          },
        ]);

      if (error) throw error;

      setTitle(""); // Clear title input
      setMessage(""); // Clear message input
      setLevel("moderate"); // Reset level to default
      await fetchAlerts(); // Refresh alerts
    } catch (error) {
      console.error("Error adding alert:", error);
      setError("Failed to add alert.");
    } finally {
      setLoading(false);
    }
  };

  // Delete an alert
  const handleDeleteAlert = async (id: number) => {
    try {
      const { error } = await supabase
        .from("alerts") // Use the correct table name
        .delete()
        .eq("id", id);

      if (error) throw error;

      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id)); // Remove alert from state
    } catch (error) {
      console.error("Error deleting alert:", error);
      setError("Failed to delete alert.");
    }
  };

  // Fetch current user and alerts on component mount
  useEffect(() => {
    fetchCurrentUser();
    fetchAlerts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
          <CardDescription>A list of all alerts.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add Alert Form */}
          <div className="mb-6">
            <div className="flex flex-col gap-4">
              <Input
                type="text"
                placeholder="Enter alert title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Enter alert message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Select
                value={level}
                onValueChange={(value: "moderate" | "high") => setLevel(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={addAlert} disabled={loading}>
                {loading ? "Adding..." : "Add Alert"}
              </Button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          {/* Alerts Table */}
          <Table>
            <TableCaption>A list of all alerts.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert, index) => (
                <TableRow key={alert.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{alert.userId}</TableCell>
                  <TableCell>{alert.userName}</TableCell>
                  <TableCell>{alert.title}</TableCell>
                  <TableCell>{alert.message}</TableCell>
                  <TableCell>{alert.level}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteAlert(alert.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Alerts;