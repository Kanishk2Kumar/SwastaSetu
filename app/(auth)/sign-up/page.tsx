"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const SignUp = (props: React.ComponentPropsWithoutRef<"div">) => {
  const { className, ...rest } = props;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState<string | null>(null); // Store city name instead of coordinates
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Reverse geocode coordinates to get the city name
  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();

      if (data.address) {
        return data.address.city || data.address.town || data.address.village || "Unknown City";
      } else {
        throw new Error("City not found in response.");
      }
    } catch (err) {
      console.error("Error reverse geocoding:", err);
      throw err;
    }
  };

  const fetchLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocode to get the city name
          const cityName = await reverseGeocode(latitude, longitude);
          setCity(cityName); // Set the city name in the state
        } catch (err) {
          setError("Unable to fetch city name. Please try again.");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError("Unable to fetch location. Please enable location services.");
        setLoading(false);
      }
    );
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number length
    if (phoneNumber.length !== 10 || !/^[\d]+$/.test(phoneNumber)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    if (!city) {
      setError("Location is required. Please enable location services.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      const user = data?.user;
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          display_name: username,
        },
      });

      const { error: insertError } = await supabase.from("user").insert([
        {
          userId: user?.id,
          userName: username,
          email: user?.email,
          phoneNumber: phoneNumber,
          location: city, // Store the city name
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      setSuccessMessage("Sign up successful! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1500); // Redirect after 1.5 seconds
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-green-500">Sign Up</CardTitle>
            <CardDescription>Enter your details to Sign Up</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="User_Name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="text"
                    placeholder="1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button
                  type="button"
                  className="w-full bg-green-500 hover:bg-green-700"
                  onClick={fetchLocation}
                  disabled={loading || city !== null}
                >
                  {city ? `Location: ${city}` : "Get Location"}
                </Button>
                <Button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </div>
              {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
              {successMessage && (
                <p className="mt-4 text-green-500 text-sm">{successMessage}</p>
              )}
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <a href="/sign-in" className="underline underline-offset-4">
                  Sign In
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;