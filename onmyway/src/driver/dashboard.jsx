import React from "react";
import DriverSidebar from "./sidebar";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#FDF8FD] text-on-surface font-[Lexend] flex">
          
          <DriverSidebar />
    
          <div className="flex-1 flex flex-col h-screen overflow-y-auto">
    
            <header className="pt-5 px-8 flex items-center justify-end ">
              <div className="flex items-center gap-3">
                <p className="p-2 bg-green-200 text-green-800 rounded-xl text-sm font-semibold flex items-center gap-1">
                                    <span className="material-symbols-outlined  ">
                                            verified
                                    </span>
                                    verify
                                </p>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-[#581C87]">David Miller</p>
                  <img
                    className="w-10 h-10 rounded-full object-cover"
                    src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
                  />
                </div>
              </div>
            </header>
    
      {/* Main */}
      <main className="flex-1 px-6 md:px-10 mt-2 md:mt-0">
        
        {/* Header */}
        <h2 className="text-3xl font-extrabold mb-2 flex">
            Performance Overview
          </h2>
          <p className="text-gray-500 mb-10 flex">
            
            Here is your impact this month
          </p>
        
        

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="bg-purple-100 p-6 rounded-xl shadow">
                <p className="text-md text-gray-500 flex">
                    <span className="material-symbols-outlined  mr-2">
                        directions_car
                    </span>
                    Total Rides</p>
                <h2 className="text-3xl font-bold text-purple-800">128</h2>
            </div>
            <div className="bg-[#E7E0EB] p-6 rounded-xl shadow">
                <p className="text-md text-gray-500 flex">
                    <span className="material-symbols-outlined  mr-2">
                        monetization_on
                    </span>
                    Total Earnings</p>
                <h2 className="text-3xl font-bold text-purple-800">$1,024</h2>
            </div>
            <div className="bg-[#684CB5] p-6 rounded-xl shadow">
                <p className="text-md text-white flex">
                    <span className="material-symbols-outlined  mr-2">
                        star
                    </span>
                    Rating Score</p>
                <h2 className="text-3xl font-bold text-white">4.9/5</h2>
            </div>
        </div>

        {/* Requests */}
        <div className="bg-gray-100 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <span className="material-symbols-outlined  mr-2">
                history
            </span>
            Incoming History
          </h2>

          <div className="space-y-4 overflow-y-auto max-h-[300px] pr-2">
            <RequestCard name="Martha Jenkins" time="10:30 AM" incoming="30" date="2023-10-01" rate={5} />
            <RequestCard name="Robert Chen" time="01:15 PM" incoming="25" date="2023-10-01" rate={4} />
            <RequestCard name="George Miller" time="04:45 PM" incoming="40" date="2023-10-01" rate={5} />
            <RequestCard name="George Miller" time="04:45 PM" incoming="40" date="2023-10-01" rate={5} />
            <RequestCard name="George Miller" time="04:45 PM" incoming="40" date="2023-10-01" rate={5} />
            <RequestCard name="George Miller" time="04:45 PM" incoming="40" date="2023-10-01" rate={5} />
            <RequestCard name="George Miller" time="04:45 PM" incoming="40" date="2023-10-01" rate={5} />
            <RequestCard name="George Miller" time="04:45 PM" incoming="40" date="2023-10-01" rate={5} />
          </div>
        </div>
      </main>
    </div>
    </div>
  );
}





function RequestCard({ name, time, incoming, date, rate }) {
  return (
    <div className="bg-white p-4 rounded-xl flex justify-between items-center">
      <div>
        <p className="font-bold flex">{name} 
        <span className="material-symbols-outlined text-yellow-400 ml-2">
            star
        </span>
        <span className="font-bold text-yellow-400 ml-1">{rate}</span>
        </p>
        <p className="text-sm text-gray-500 flex">{date} • {time}</p>
      </div>

      <div className="flex gap-2">
        <div>
            <span className="material-symbols-outlined text-green-600">
          monetization_on
        </span>
        </div>
        <p className="font-bold">${incoming}</p>
      </div>
    </div>
    
  );
}