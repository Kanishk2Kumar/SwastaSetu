"use client"; // Ensure this is a Client Component

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; // Import Framer Motion for animations
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
  IconUser,
} from "@tabler/icons-react";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <EnhancedGridLayout />
    </div>
  );
}

export function EnhancedGridLayout() {
  const router = useRouter();
  const [alertsCount, setAlertsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [campaignsCount, setCampaignsCount] = useState(0);
  const [doctorsCount, setDoctorsCount] = useState(0); // New state for doctors count

  // Fetch counts for alerts, users, campaigns, and doctors
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { count: alertsCount } = await supabase
          .from("alerts")
          .select("*", { count: "exact", head: true });
        setAlertsCount(alertsCount || 0);

        const { count: usersCount } = await supabase
          .from("user")
          .select("*", { count: "exact", head: true })
          .neq("userType", "admin"); // Exclude admin users
        setUsersCount(usersCount || 0);

        const { count: campaignsCount } = await supabase
          .from("campaigns")
          .select("*", { count: "exact", head: true });
        setCampaignsCount(campaignsCount || 0);

        const { count: doctorsCount } = await supabase
          .from("doctors")
          .select("*", { count: "exact", head: true });
        setDoctorsCount(doctorsCount || 0);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const items = [
    {
      title: "Alerts",
      description: `Total Alerts: ${alertsCount}`,
      icon: <IconClipboardCopy className="h-10 w-10 text-neutral-500" />,
      onClick: () => router.push("/admin/Alerts"),
    },
    {
      title: "Users",
      description: `Total Users: ${usersCount}`,
      icon: <IconFileBroken className="h-10 w-10 text-neutral-500" />,
      onClick: () => router.push("/admin/all-users"),
    },
    {
      title: "Campaigns",
      description: `Total Campaigns: ${campaignsCount}`,
      icon: <IconSignature className="h-10 w-10 text-neutral-500" />,
      onClick: () => router.push("/admin/CampaignsManagement"),
    },
    {
      title: "Resource Management",
      description:
        "Understand the impact of effective communication in our lives.",
      icon: <IconTableColumn className="h-10 w-10 text-neutral-500" />,
      onClick: () => router.push("/admin/resource-management"),
    },
    {
      title: "Doctors",
      description: `Total Doctors: ${doctorsCount}`,
      icon: <IconUser className="h-10 w-10 text-neutral-500" />,
      onClick: () => router.push("/admin/verify-doctors"),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto grid gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {items.slice(0, 3).map((item, i) => (
          <motion.div
            key={i}
            onClick={item.onClick}
            className="cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <GridItem
              title={item.title}
              description={item.description}
              icon={item.icon}
              className="h-56"
            />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {items.slice(3).map((item, i) => (
          <motion.div
            key={i}
            onClick={item.onClick}
            className="cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <GridItem
              title={item.title}
              description={item.description}
              icon={item.icon}
              className="h-56"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface GridItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

const GridItem: React.FC<GridItemProps> = ({ title, description, icon, className }) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 p-8 flex flex-col justify-between",
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl font-extrabold">{title}</div>
        {icon}
      </div>
      <div className="text-xl text-neutral-600 dark:text-neutral-400">
        {description}
      </div>
    </div>
  );
};
