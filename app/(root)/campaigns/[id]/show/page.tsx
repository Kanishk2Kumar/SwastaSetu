"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useParams } from "next/navigation"; // Import useParams to get the campaign ID
import { supabase } from "@/utils/supabase/client"; // Import Supabase client

const SuccessCard = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-100">
    <div className="rounded-lg bg-gray-50 px-16 py-14">
      <div className="flex justify-center">
        <div className="rounded-full bg-green-200 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 p-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-8 w-8 text-white"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
        </div>
      </div>
      <h3 className="my-4 text-center text-3xl font-semibold text-gray-700">
        Congratulations!!!
      </h3>
      <p className="w-[230px] text-center font-normal text-gray-600">
        Your contribution has been successfully processed.
      </p>
      <div className="mt-10 flex flex-col gap-4 items-center">
        <button
          className="block rounded-xl border-4 border-transparent bg-blue-500 px-6 py-3 text-center text-base font-medium text-white outline-8 hover:outline hover:duration-300"
          onClick={() => (window.location.href = "/campaigns/all")}
        >
          Back to Campaigns
        </button>
      </div>
    </div>
  </div>
);

const CampaignDetails: React.FC = () => {
  const [transactionSuccess, setTransactionSuccess] = useState<boolean>(false);
  const [campaign, setCampaign] = useState<any>(null); // State to store campaign data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const { id } = useParams(); // Get the campaign ID from the URL

  // Fetch campaign data from Supabase
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const { data, error } = await supabase
          .from("campaigns") // Use the correct table name
          .select("*")
          .eq("id", id) // Filter by campaign ID
          .single(); // Fetch a single record

        if (error) {
          throw new Error(error.message);
        }

        setCampaign(data); // Set campaign data
      } catch (error: any) {
        setError(error.message); // Set error message
      } finally {
        setLoading(false); // Set loading to false
      }
    };

    fetchCampaign();
  }, [id]);

  const handleFundCampaign = () => {
    // Placeholder for handling fund logic
    setTransactionSuccess(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen p-8 rounded-xl flex items-center justify-center">
        <div className="text-center">Loading campaign details...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen p-8 rounded-xl flex items-center justify-center">
        <div className="text-center text-red-500">Error: {error}</div>
      </div>
    );
  }

  // If campaign data is not found
  if (!campaign) {
    return (
      <div className="min-h-screen p-8 rounded-xl flex items-center justify-center">
        <div className="text-center">Campaign not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 rounded-xl">
      {transactionSuccess ? (
        <SuccessCard />
      ) : (
        <Card
          className="relative w-full max-w-4xl border-2 rounded-l p-6 mx-auto"
          style={{ width: "90%" }}
        >
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Campaign Image */}
            <div className="flex-1">
              <Image
                src={campaign.imageLink || "/images/default-campaign.jpg"} // Fallback image
                alt={campaign.title}
                width={600}
                height={400}
                className="rounded-lg"
                unoptimized // Add this if using external URLs
              />
            </div>

            {/* Fund Raised & Days Left Cards */}
            <div className="flex-none lg:w-[175px] flex flex-col gap-8">
              {/* Funds Raised Card */}
              <Card className=" border border-green-500 p-2 rounded-lg shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center text-lg">
                    Funds Raised
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center text-lg font-bold text-green-500">
                  {campaign.currentAmount} of {campaign.targetAmount}
                </CardContent>
              </Card>

              {/* Days Left Card */}
              <Card className=" border border-green-500 p-2 rounded-lg shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center text-lg font-ibm-plex-sans">
                    Deadline
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center text-lg font-semibold text-green-500">
                  {new Date(campaign.deadline).toLocaleDateString()}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Campaign Details */}
          <div className="mt-8 flex flex-col lg:flex-row gap-8">
            {/* Creator & Story */}
            <div className="flex-1">
              <h4 className="text-xl font-semibold font-ibm-plex-sans"><span className="font-ibm-plex-sans">CREATOR</span>: UNICEF</h4>
              <p className="text-lg mt-4 font-ibm-plex-sans">{campaign.description}</p>
            </div>

            {/* Fund Campaign Card */}
            <div className="flex-none lg:w-[350px]">
              <Card className=" border border-green-500 p-4 rounded-lg shadow-lg">
                <CardHeader>
                  <CardTitle className="text-center text-lg font-ibm-plex-sans">
                    Fund This Campaign
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h2 className="text-lg font-semibold mb-2 font-ibm-plex-sans">Enter Amount</h2>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    step="0.01"
                    id="amount"
                    className="mb-4 font-ibm-plex-sans"
                  />
                  <Button
                    onClick={handleFundCampaign}
                    className="bg-green-500 text-white px-6 py-3 w-full"
                  >
                    Fund Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CampaignDetails;