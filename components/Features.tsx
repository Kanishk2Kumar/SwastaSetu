import { HoverEffect } from "./ui/card-hover-effect";

export function Features() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-5xl font-bold leading-tight font-ibm-plex-sans">
        Our{" "}
        <span className="border-b-4 border-dashed border-green-500">
          Features
        </span>
      </h1>

      <div className="max-w-6xl mx-auto px-8 max-h-[80vh]">
        <HoverEffect items={projects} />
      </div>
    </div>
  );
}
export const projects = [
  {
    title: "Interactive Dashboards",
    description:
      "A technology company that builds economic infrastructure for the internet.",
    link: "/dashboard",
  },
  {
    title: "Precations & Symptoms",
    description:
      "A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
    link: "https://netflix.com",
  },
  {
    title: "Predictions",
    description:
      "A multinational technology company that specializes in Internet-related services and products.",
    link: "/predictions",
  },
  {
    title: "Self Assesment Tools",
    description:
      "A technology company that focuses on building products that advance Facebook's mission of bringing the world closer together.",
    link: "/self-diagnosis",
  },
  {
    title: "Emergency Resources",
    description:
      "A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
    link: "/Emergency-Resources",
  },
  {
    title: "Social Campaigns",
    description:
      "A multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
    link: "social-campaigns",
  },
];
