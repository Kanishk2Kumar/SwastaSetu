import MapComponent from '@/components/MapComponent'
import React from 'react'

const EmergencyResources = () => {
    const powerBIReportURL = 'https://gsdl.org.in/hfw2/';

  return (

    <div className="min-h-screen bg-transparent text-white">
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

        </div>
      </main>
    </div>
  );
}

export default EmergencyResources