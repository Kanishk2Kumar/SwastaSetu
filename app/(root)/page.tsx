import { Features } from "@/components/Features";
import Hero from "@/components/Hero";
import { AccordionDemo } from "@/components/Accordiondemo"; // Import the AccordionDemo component

export default function Home() {
  return (
    <div className="overflow-auto scrollbar scrollbar-thumb-gray-500 scrollbar-track-gray-200">
      <Hero />
      <Features />
      <div className="my-8 mx-28">
        <AccordionDemo />
      </div>
    </div>
  );
}
