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
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Resource = {
  id: number;
  hospital: string;
  location: string;
  icuBeds: number;
  normalBeds: number;
  ventilators: number;
};

const SelfDiagnosis = () => {
  const [resources, setResources] = useState<Resource[]>([]); // State to store resources
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [searchType, setSearchType] = useState<"hospital" | "location">("hospital"); // State for search type
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

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

  // Filter resources based on search query and search type
  const filteredResources = resources.filter((resource) => {
    if (searchType === "hospital") {
      return resource.hospital.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      return resource.location.toLowerCase().includes(searchQuery.toLowerCase());
    }
  });

  // Fetch resources on component mount
  useEffect(() => {
    fetchResources();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle>Hospital Resources</CardTitle>
          <CardContent>
            {/* Search Bar and Search Type Selector */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center gap-4">
                <Label htmlFor="searchType">Search By:</Label>
                <Select
                  value={searchType}
                  onValueChange={(value: "hospital" | "location") => setSearchType(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Search By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospital">Hospital</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                type="text"
                placeholder={`Search by ${searchType}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Resources Table */}
            <Table>
              <TableCaption>A list of all hospital resources.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>ICU Beds</TableHead>
                  <TableHead>Normal Beds</TableHead>
                  <TableHead>Ventilators</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>{resource.hospital}</TableCell>
                    <TableCell>{resource.location}</TableCell>
                    <TableCell>{resource.icuBeds}</TableCell>
                    <TableCell>{resource.normalBeds}</TableCell>
                    <TableCell>{resource.ventilators}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default SelfDiagnosis;