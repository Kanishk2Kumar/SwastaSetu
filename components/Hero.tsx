import React from "react";
import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[90vh]">
      <div className="container mx-auto px-6 md:flex md:items-center md:justify-between mt-16">
        {/* Left Section */}
        <div className="md:w-1/2 pl-10">
          <h1 className="text-5xl font-bold leading-tight font-ibm-plex-sans">
            Swastya Setu <br />
            <span className="text-green-600"> समृद्ध आयु</span>
          </h1>
          <p className="mt-6 mr-20 text-gray-700 text-lg font-serif">
            Swasth Setu combines real-time disease tracking, AI-driven
            predictions, and geospatial analysis to empower communities and
            authorities. With multilingual support and localized alerts, we
            provide actionable insights, enabling proactive measures and
            resource management to prevent disease spread and build a resilient
            health ecosystem.
          </p>

          <button className="mt-10 px-6 py-3 text-green-500 rounded-md transition-transform transform hover:scale-105 hover:bg-green-500 hover:text-white">
            <Link href="/learn-more" className="transition-colors">
              Learn More
            </Link>
          </button>
        </div>

        <div className="mt-10 md:mt-0 md:w-1/2 relative pl-10">
          <img
            src="/images/HeroImage.png"
            alt="Hero Image"
            className="hidden md:block animate-slide-in-right"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
