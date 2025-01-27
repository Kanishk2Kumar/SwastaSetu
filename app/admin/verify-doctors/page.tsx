"use client";
import React, { useEffect, useState } from "react";
import { supabase, supabaseAdminRole } from "@/utils/supabase/client";
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
import Image from "next/image";

type Doctor = {
  id: string;
  userName: string;
  userId: string;
  hospital: string;
  location: string;
  idCardLink: string;
  authenticated: string;
};

const VerifyDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data, error } = await supabase
          .from("doctors") // Replace with your table name
          .select("*");

        if (error) throw error;

        setDoctors(data as Doctor[]);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleVerifyDoctor = async (doctorId: string) => {
    try {
      const { error } = await supabaseAdminRole
        .from("doctors")
        .update({ authenticated: "verified" })
        .eq("id", doctorId);

      if (error) throw error;

      // Update the local state to reflect the verification
      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor) =>
          doctor.id === doctorId ? { ...doctor, authenticated: "verified" } : doctor
        )
      );
    } catch (error) {
      console.error("Error verifying doctor:", error);
    }
  };

  const handleDeleteDoctor = async (doctorId: string) => {
    try {
      const { error: dbError } = await supabaseAdminRole
        .from("doctors")
        .delete()
        .eq("id", doctorId);

      if (dbError) throw dbError;

      // Remove the deleted doctor from the local state
      setDoctors((prevDoctors) => prevDoctors.filter((doctor) => doctor.id !== doctorId));
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Verify Doctors</CardTitle>
          <CardDescription>A list of all doctors awaiting verification.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Hospital</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>ID Card</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((doctor, index) => (
                <TableRow key={doctor.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{doctor.userName}</TableCell>
                  <TableCell>{doctor.hospital}</TableCell>
                  <TableCell>{doctor.location}</TableCell>
                  <TableCell>
                    {doctor.idCardLink && (
                      <Image
                        src={doctor.idCardLink}
                        alt="ID Card"
                        width={100}
                        height={60}
                        className="rounded-lg"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {doctor.authenticated === "verified" ? (
                      <span className="text-green-500">Verified</span>
                    ) : (
                      <span className="text-yellow-500">Pending</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {doctor.authenticated !== "verified" && (
                      <Button
                        variant="default"
                        className="bg-green-500 text-white mr-2"
                        onClick={() => handleVerifyDoctor(doctor.id)}
                      >
                        Verify
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteDoctor(doctor.id)}
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

export default VerifyDoctors;