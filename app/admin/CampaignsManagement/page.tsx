"use client";
import React, { useEffect, useState } from "react";
import { supabase, supabaseAdminRole } from "@/utils/supabase/client";
import {
  Table,
  TableBody,
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

type Campaign = {
  id: number;
  imageLink: string;
  title: string;
  description: string;
  targetAmount: number;
  upiID: string;
  deadline: string;
  currentAmount: number;
  status: string;
  userName: string;
};

const CampaignsManagement: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { data, error } = await supabase.from("campaigns").select("*");

        if (error) throw error;

        const sortedCampaigns = data.sort((a, b) => {
          if (a.status === "pending") return -1;
          if (b.status === "pending") return 1;
          if (a.status === "approved") return -1;
          if (b.status === "approved") return 1;
          return 0;
        });

        setCampaigns(sortedCampaigns as Campaign[]);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const handleDeleteCampaign = async (id: number, imageLink: string) => {
    try {
      // Delete the campaign from the database
      const { error: dbError } = await supabaseAdminRole
        .from("campaigns")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      const filePath = imageLink.split("/images/campaigns/")[1];
      if (!filePath) {
        throw new Error("Invalid image link");
      }

      const { error: storageError } = await supabaseAdminRole.storage
        .from("images")
        .remove([`campaigns/${filePath}`]);

      if (storageError) throw storageError;

      setCampaigns((prevCampaigns) =>
        prevCampaigns.filter((campaign) => campaign.id !== id)
      );
    } catch (error) {
      console.error("Error deleting campaign or image:", error);
    }
  };

  const handleUpdateStatus = async (
    id: number,
    currentStatus: string,
    imageLink: string
  ) => {
    try {
      let newStatus = "";
      if (currentStatus === "pending") {
        newStatus = "approved";
      } else if (currentStatus === "approved") {
        newStatus = "takedown";
      }

      if (newStatus === "takedown") {
        await handleDeleteCampaign(id, imageLink);
      } else {
        const { error } = await supabaseAdminRole
          .from("campaigns")
          .update({ status: newStatus })
          .eq("id", id);

        if (error) throw error;

        setCampaigns((prevCampaigns) =>
          prevCampaigns.map((campaign) =>
            campaign.id === id ? { ...campaign, status: newStatus } : campaign
          )
        );
      }
    } catch (error) {
      console.error("Error updating campaign status:", error);
    }
  };

  const openImageModal = (imageLink: string) => {
    setSelectedImage(imageLink);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>A list of all campaigns.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Target Amount</TableHead>
                <TableHead>UPI ID</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead>
                  Current
                  <br />
                  Amount
                </TableHead>
                <TableHead>User Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign, index) => (
                <TableRow key={campaign.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <img
                      src={campaign.imageLink}
                      alt={campaign.title}
                      className="w-16 h-16 object-cover cursor-pointer"
                      onClick={() => openImageModal(campaign.imageLink)}
                    />
                  </TableCell>
                  <TableCell>{campaign.title}</TableCell>
                  <TableCell>{campaign.description}</TableCell>
                  <TableCell>{campaign.targetAmount}</TableCell>
                  <TableCell>{campaign.upiID}</TableCell>
                  <TableCell>{campaign.deadline}</TableCell>
                  <TableCell>{campaign.currentAmount}</TableCell>
                  <TableCell>{campaign.userName}</TableCell>
                  <TableCell>{campaign.status}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {campaign.status === "pending" && (
                        <div>
                          <Button
                            className="bg-green-500 hover:bg-green-600 mr-2"
                            variant="default"
                            onClick={() =>
                              handleUpdateStatus(
                                campaign.id,
                                campaign.status,
                                campaign.imageLink
                              )
                            }
                          >
                            Approve
                          </Button>

                          <Button
                            variant="destructive"
                            onClick={() =>
                              handleUpdateStatus(
                                campaign.id,
                                campaign.status,
                                campaign.imageLink
                              )
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {campaign.status === "approved" && (
                        <Button
                          variant="destructive"
                          onClick={() =>
                            handleUpdateStatus(
                              campaign.id,
                              campaign.status,
                              campaign.imageLink
                            )
                          }
                        >
                          Take Down
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeImageModal}
        >
          <div className="bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <Button
              className="mt-4"
              variant="destructive"
              onClick={closeImageModal}
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsManagement;
