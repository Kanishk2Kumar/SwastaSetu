import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

const DashboardPage = () => {
  const powerBIReportURL = 'https://app.powerbi.com/view?r=eyJrIjoiYzIxNmRiODItNWZmZC00NTkwLWE3YTgtNzhmOGJmNWQzZTkwIiwidCI6IjhjNzhjMTIyLWY3ODEtNDUwMC05YzJhLWY2NDVhNzYyODFmNSJ9';

  // Dummy data for diseases
  const diseases = [
    {
      title: 'Tuberculosis',
      description: 'Bacterial infection affecting lungs, spread through air, causes cough, weight loss, and fever.',
      learnMoreLink: 'https://www.who.int/health-topics/tuberculosis',
    },
    {
      title: 'Diabetes',
      description: 'Chronic condition with high blood sugar due to insulin issues, leading to various complications.',
      learnMoreLink: 'https://www.who.int/health-topics/diabetess',
    },
    {
      title: 'Cancer',
      description: 'Uncontrolled cell growth forming tumors, potentially spreading, with various types and treatments.',
      learnMoreLink: 'https://www.who.int/health-topics/cancer',
    },
    {
      title: 'Respiratory Diseases',
      description: 'Disorders affecting lungs and airways, including asthma, COPD, and pneumonia, causing breathing difficulties.',
      learnMoreLink: 'https://platform.who.int/mortality/themes/theme-details/topics/topic-details/MDB/respiratory-diseases',
    },
    {
      title: 'Malaria',
      description: 'Mosquito-borne parasitic disease causing fever, chills, and anemia, prevalent in tropical regions.',
      learnMoreLink: 'https://www.who.int/news-room/fact-sheets/detail/malaria',
    },
    {
      title: 'Diarrhoel Diseases',
      description: 'Infections causing frequent loose stools, often due to contaminated water or food.',
      learnMoreLink: 'https://www.who.int/news-room/fact-sheets/detail/diarrhoeal-disease',
    },
  ];

  return (

    <div className="min-h-screen bg-transparent text-white">
      {/* Header Section */}
      <header className="py-6  text-center">
        <h1 className="text-4xl text-green-500 font-bold">Disease Analysis</h1>
        {/* <p className=" mt-2">Here is the Analytics of recent Pandemic</p> */}
      </header>

      {/* Main Content Section */}
      <main className="p-6 flex flex-col items-center">
        <div className="w-full max-w-screen mx-10">
          {/* Power BI Embed */}

          <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-8">

            <iframe
              src={powerBIReportURL}
              frameBorder="0"
              className="w-full h-[85vh]"
              allowFullScreen
              title="Power BI Dashboard"
            ></iframe>
          </div>

          {/* Title for Diseases Section */}
          <h2 className="text-3xl text-green-500 font-bold mb-6">Some other Major Diseases</h2>

          {/* Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diseases.map((disease, index) => (
              <Card key={index} className="bg-transparent  border-gray-700">
                <CardHeader>
                  <CardTitle>{disease.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{disease.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <a
                    href={disease.learnMoreLink}
                    className="text-green-400 hover:text-green-300 transition-colors"
                  >
                    Learn More →
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;