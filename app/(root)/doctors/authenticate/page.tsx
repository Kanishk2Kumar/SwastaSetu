"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { supabase } from "@/utils/supabase/client";
import { useAuth } from "@/context/UserContext"; // Assuming you have a UserContext

const Authenticate = () => {
  const [formData, setFormData] = useState({
    hospital: "",
    location: "",
    idCardLink: "",
  });

  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const router = useRouter();
  const { userDetails } = useAuth(); // Fetch user details from the context

  useEffect(() => {
    if (userDetails) {
      setUserName(userDetails.userName || ""); // Set userName from the session
      setUserId(userDetails.userId || ""); // Set userId from the session
    }
  }, [userDetails]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setIdCardFile(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Validate inputs
      if (!formData.hospital || !formData.location || !idCardFile) {
        throw new Error("All fields are required.");
      }

      // Step 1: Upload ID card to Supabase Storage inside the `doctorImages` folder
      const fileName = `${userName}_${idCardFile.name}`.replace(/[^a-zA-Z0-9]/g, "_");
      const filePath = `doctorImages/${fileName}`; // Specify the folder path
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("images") // Bucket name
        .upload(filePath, idCardFile);

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded file
      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      const idCardLink = urlData.publicUrl;

      // Step 2: Insert doctor's details into the database
      const { data, error: insertError } = await supabase
        .from("doctors") // Replace with your table name
        .insert([
          {
            userName,
            userId,
            hospital: formData.hospital,
            location: formData.location,
            idCardLink,
            authenticated: "pending", // Default status
          },
        ]);

      if (insertError) throw insertError;

      setSuccessMessage("Your details have been submitted successfully!");
      router.push("/"); // Redirect to home page after success
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-cover bg-center min-h-96 pt-20">
      <div className="absolute inset-0"></div>
      <div className="relative flex items-center justify-center min-h-screen p-4">
        <Card className="max-w-2xl w-full bg-opacity-90 rounded-lg p-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              Doctor Authentication
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="hospital">Hospital *</Label>
                <Input
                  id="hospital"
                  name="hospital"
                  type="text"
                  placeholder="Enter your hospital name"
                  value={formData.hospital}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  placeholder="Enter your hospital location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="idCardLink">Doctor's License *</Label>
                <Input
                  id="idCardLink"
                  name="idCardLink"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
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
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Authenticate;