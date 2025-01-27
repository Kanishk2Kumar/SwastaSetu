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
import { Label } from "@/components/ui/label";

type Resource = {
  id: number;
  hospital: string;
  location: string;
  icuBeds: number;
  normalBeds: number;
  ventilators: number;
};

const Resources = () => {
  const [resources, setResources] = useState<Resource[]>([]); // State to store resources
  const [hospital, setHospital] = useState(""); // State for hospital name
  const [location, setLocation] = useState(""); // State for location
  const [icuBeds, setIcuBeds] = useState<number>(0); // State for ICU beds
  const [normalBeds, setNormalBeds] = useState<number>(0); // State for normal beds
  const [ventilators, setVentilators] = useState<number>(0); // State for ventilators
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [editingResource, setEditingResource] = useState<Resource | null>(null); // State for editing resource

  // Fetch resources from Supabase
  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("Inventory") // Use the correct table name
        .select("*")
        .order("id", { ascending: true }); // Sort by ID in ascending order

      if (error) throw error;

      setResources(data as Resource[]); // Set resources data
    } catch (error) {
      console.error("Error fetching resources:", error);
      setError("Failed to fetch resources.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate the next ID based on the maximum existing ID
  const getNextId = () => {
    if (resources.length === 0) return 1; // If no resources, start from 1
    const maxId = Math.max(...resources.map((resource) => resource.id)); // Find the maximum ID
    return maxId + 1; // Return the next ID
  };

  // Add or update a resource
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hospital.trim() || !location.trim()) {
      setError("Hospital and location are required.");
      return;
    }

    try {
      setLoading(true);
      if (editingResource) {
        // Update existing resource
        const { error } = await supabase
          .from("inventory")
          .update({
            hospital,
            location,
            icuBeds,
            normalBeds,
            ventilators,
          })
          .eq("id", editingResource.id);

        if (error) throw error;
      } else {
        // Add new resource
        const nextId = getNextId(); // Calculate the next ID
        const { error } = await supabase
          .from("Inventory")
          .insert([
            {
              id: nextId,
              hospital,
              location,
              icuBeds,
              normalBeds,
              ventilators,
            },
          ]);

        if (error) throw error;
      }

      // Clear form and refresh resources
      setHospital("");
      setLocation("");
      setIcuBeds(0);
      setNormalBeds(0);
      setVentilators(0);
      setEditingResource(null);
      await fetchResources();
    } catch (error) {
      console.error("Error saving resource:", error);
      setError("Failed to save resource.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a resource
  const handleDeleteResource = async (id: number) => {
    try {
      const { error } = await supabase
        .from("Inventory")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setResources((prevResources) =>
        prevResources.filter((resource) => resource.id !== id)
      ); // Remove resource from state
    } catch (error) {
      console.error("Error deleting resource:", error);
      setError("Failed to delete resource.");
    }
  };

  // Set form for editing a resource
  const handleEditResource = (resource: Resource) => {
    setHospital(resource.hospital);
    setLocation(resource.location);
    setIcuBeds(resource.icuBeds);
    setNormalBeds(resource.normalBeds);
    setVentilators(resource.ventilators);
    setEditingResource(resource);
  };

  // Fetch resources on component mount
  useEffect(() => {
    fetchResources();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Resource Management</CardTitle>
          <CardDescription>A list of all hospital resources.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Add/Edit Resource Form */}
          <div className="mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="hospital">Hospital *</Label>
                <Input
                  id="hospital"
                  type="text"
                  placeholder="Enter hospital name"
                  value={hospital}
                  onChange={(e) => setHospital(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="Enter location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="icuBeds">ICU Beds</Label>
                <Input
                  id="icuBeds"
                  type="number"
                  placeholder="Enter number of ICU beds"
                  value={icuBeds}
                  onChange={(e) => setIcuBeds(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="normalBeds">Normal Beds</Label>
                <Input
                  id="normalBeds"
                  type="number"
                  placeholder="Enter number of normal beds"
                  value={normalBeds}
                  onChange={(e) => setNormalBeds(Number(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="ventilators">Ventilators</Label>
                <Input
                  id="ventilators"
                  type="number"
                  placeholder="Enter number of ventilators"
                  value={ventilators}
                  onChange={(e) => setVentilators(Number(e.target.value))}
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Saving..."
                  : editingResource
                  ? "Update Resource"
                  : "Add Resource"}
              </Button>
              {editingResource && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setHospital("");
                    setLocation("");
                    setIcuBeds(0);
                    setNormalBeds(0);
                    setVentilators(0);
                    setEditingResource(null);
                  }}
                >
                  Cancel Edit
                </Button>
              )}
            </form>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          {/* Resources Table */}
          <Table>
            <TableCaption>A list of all hospital resources.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>ICU Beds</TableHead>
                <TableHead>Normal Beds</TableHead>
                <TableHead>Ventilators</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource, index) => (
                <TableRow key={resource.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{resource.hospital}</TableCell>
                  <TableCell>{resource.location}</TableCell>
                  <TableCell>{resource.icuBeds}</TableCell>
                  <TableCell>{resource.normalBeds}</TableCell>
                  <TableCell>{resource.ventilators}</TableCell>
                  <TableCell>
                    <Button
                      variant="secondary"
                      onClick={() => handleEditResource(resource)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      className="ml-2"
                      onClick={() => handleDeleteResource(resource.id)}
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

export default Resources;