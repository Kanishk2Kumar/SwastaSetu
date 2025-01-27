import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  export function AccordionDemo() {
    return (
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-xl font-ibm-plex-sans">Can I access health information in my regional language?</AccordionTrigger>
          <AccordionContent className="text-lg font-ibm-plex-sans">
          Yes, our platform supports multiple regional languages, allowing you to access vital health information, government policies, and emergency contacts in the language you are most comfortable with.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-xl font-ibm-plex-sans">How can I contribute to raising awareness about a disease?</AccordionTrigger>
          <AccordionContent className="text-lg font-ibm-plex-sans">
          You can create or participate in Crowdsourced Campaigns on our platform. These campaigns allow you to share information, raise funds, and spread awareness about health-related causes within your community.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="text-xl font-ibm-plex-sans">Where can I find information about government assistance during a pandemic?</AccordionTrigger>
          <AccordionContent className="text-lg font-ibm-plex-sans">
          Our platform provides a dedicated section for Government Policy & Emergency Assistance, where you can find details about government support programs, policies, and emergency contact numbers during pandemics.
          </AccordionContent>
          
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger className="text-xl font-ibm-plex-sans">Is this platform useful for people in rural or underserved areas?</AccordionTrigger>
          <AccordionContent className="text-lg font-ibm-plex-sans">
          Absolutely. With Regional Language Support and simplified access to critical information, the platform is designed to ensure inclusivity and accessibility for people in rural or underserved communities.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }
  