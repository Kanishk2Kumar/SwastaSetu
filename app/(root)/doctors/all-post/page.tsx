"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const AllPost = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from("posts") // Replace with your table name
          .select("*")
          .order("created_at", { ascending: false }); // Fetch the latest posts first

        if (error) throw error;

        setPosts(data || []);
      } catch (error) {
        setError("Failed to fetch posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="shadow-lg">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Truncate the description to 2-3 lines */}
              <p className="text-gray-600 line-clamp-3">{post.content}</p>
              {post.imageLink && (
                <div className="mt-4">
                  <Image
                    src={post.imageLink}
                    alt="Post Image"
                    width={400}
                    height={300}
                    className="rounded-lg"
                  />
                </div>
              )}
              <p className="mt-4 text-sm text-gray-500">
                <strong>Location:</strong> {post.location}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Posted by:</strong> {post.userName}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => {
                  // Add functionality for interacting with the post (e.g., like, comment)
                }}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AllPost;