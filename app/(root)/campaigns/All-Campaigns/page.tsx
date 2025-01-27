"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { supabase } from "@/utils/supabase/client"; // Import Supabase client

const AllCampaigns: React.FC = () => {
  const [search, setSearch] = useState("");
  const [campaigns, setCampaigns] = useState<any[]>([]); // State to store campaigns
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Fetch campaigns from Supabase
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data, error } = await supabase
          .from("campaigns") // Use the correct table name
          .select("*")
          .eq("status", "approved"); // Filter by approved campaigns

        if (error) {
          throw new Error(error.message);
        }

        setCampaigns(data || []); // Set campaigns data
      } catch (error: any) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchCampaigns();
  }, []);

  // Filter campaigns based on search input
  const filteredCampaigns = campaigns.filter((campaign) =>
    campaign.title.toLowerCase().includes(search.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="p-8 lg:pl-24 lg:pr-24">
        <div className="text-center">Loading campaigns...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-8 lg:pl-24 lg:pr-24">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:pl-24 lg:pr-24">
      {/* Search Bar */}
      <div className="relative mb-8 lg:pl-48 lg:mr-48">
        <label className="relative block">
          <span className="sr-only">Search campaigns</span>
          <Input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 pr-12 border rounded-full"
          />
          <span className="absolute inset-y-0 right-4 flex items-center">
            <Image
              src="/icons/Search.svg"
              alt="Search"
              width={20}
              height={20}
              className="text-gray-400"
            />
          </span>
        </label>
      </div>

      {/* Campaign Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredCampaigns.map((campaign) => {
          console.log("Campaign coverImg:", campaign.coverImg); // Debugging: Log image URLs
          return (
            <Card
              key={campaign.id} // Use campaign.id from Supabase
              className="rounded-lg border border-gray-500 shadow-lg hover:scale-105 transition-transform"
            >
              {/* Campaign Image */}
              <div className="w-full h-[200px] overflow-hidden rounded-t-lg">
                <Image
                  src={campaign.imageLink || "/images/default-campaign.jpg"} // Fallback image
                  alt={campaign.title}
                  width={400}
                  height={200}
                  className="object-cover w-full h-full"
                  unoptimized // Add this if using external URLs
                />
              </div>

              {/* Campaign Details */}
              <CardContent className="p-4">
                <CardHeader className="p-0 mb-2">
                  <CardTitle className="text-lg font-bold text-green-500">
                    {campaign.title}
                  </CardTitle>
                </CardHeader>
                <p className="text-gray-700 text-sm line-clamp-2">
                  {campaign.description}
                </p>
                <div className="flex justify-between items-center mt-4">
                  {/* Raised Amount */}
                  <div className="text-sm font-semibold">
                    Raised: {campaign.currentAmount}{" "}
                    <span className="text-gray-600">
                      of {campaign.targetAmount}
                    </span>
                  </div>

                  {/* Donate Button */}
                  <Link href={`/campaigns/${campaign.id}/show`} passHref>
                    <Button size="sm" className="bg-green-500 hover:bg-green-700">
                      Donate
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AllCampaigns;