"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/image-upload";
import { supabase } from "@/utils/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/UserContext";

const CreateCampaign: React.FC = () => {
  const [formData, setFormData] = useState({
    coverImg: "",
    imgLink: "",
    title: "",
    description: "",
    targetAmount: 0,
    upiID: "",
    deadline: "",
  });

  const router = useRouter();
  const { userDetails } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUploadComplete = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];

      // Validate file type (images only)
      if (!file.type.startsWith("image/")) {
        setErrorMessage("Please upload a valid image file.");
        return;
      }

      // Generate file name: campaignName_userName
      const fileName = `${formData.title}_${userDetails?.userName || "anonymous"}`.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      );

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from("images")
        .upload(`campaigns/${fileName}`, file);

      if (error) {
        setErrorMessage("Failed to upload the image.");
        return;
      }

      const fileUrl = data?.path
        ? `https://llkuxbyxxliwnjuzywjb.supabase.co/storage/v1/object/public/images/${data.path}`
        : "";
      setFormData((prev) => ({ ...prev, imgLink: fileUrl }));
      setErrorMessage(null); // Clear any previous error message
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!formData.imgLink) {
      setErrorMessage("Please upload a campaign image.");
      setIsLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase.from("campaigns").insert([
        {
          imageLink: formData.imgLink,
          title: formData.title,
          description: formData.description,
          targetAmount: formData.targetAmount,
          upiID: formData.upiID,
          deadline: formData.deadline,
          userId: userDetails?.userId,
          userName: userDetails?.userName,
        },
      ]);

      if (insertError) throw insertError;

      setSuccessMessage("Campaign created successfully!");
      router.push("/campaigns/All-Campaigns"); // Redirect to campaigns page after success
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("There was an error creating your campaign.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative bg-cover bg-center min-h-screen pt-20">
      <div className="absolute inset-0"></div>
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-2xl w-full bg-opacity-90 rounded-lg p-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              Start a Campaign
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Campaign Title *</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Give your campaign a title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Story *</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tell your story..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="upiID">UPI ID *</Label>
                  <Input
                    id="upiID"
                    name="upiID"
                    type="text"
                    placeholder="Enter your UPI ID"
                    value={formData.upiID}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="targetAmount">Amount in Rs *</Label>
                <Input
                  id="targetAmount"
                  name="targetAmount"
                  type="number"
                  placeholder="Target amount"
                  value={formData.targetAmount}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="deadline">Deadline *</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="coverImg">Campaign Image *</Label>
                <ImageUpload onChange={handleUploadComplete} />
              </div>

              {errorMessage && (
                <p className="text-red-500 text-center">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-green-500 text-center">{successMessage}</p>
              )}

              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="bg-green-500 text-white px-6 py-3"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit Campaign"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCampaign;
