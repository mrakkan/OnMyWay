import React from "react";
import AdminSidebar from "./sidebar";
import ReactApexChart from "react-apexcharts";

export default function AdminDashboard() {
  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [selectedMonth, setSelectedMonth] = React.useState("January");

  const daysInMonth = {
    January: 31,
    February: 28,
    March: 31,
    April: 30,
    May: 31,
    June: 30,
    July: 31,
    
  };

  const monthSeed = {
    January: 8,
    February: 10,
    March: 9,
    April: 11,
    May: 12,
    June: 13,
    July: 14,
    August: 15,
    September: 13,
    October: 16,
    November: 17,
    December: 18,
  };

  const selectedMonthData = React.useMemo(() => {
    const totalDays = daysInMonth[selectedMonth];
    const seed = monthSeed[selectedMonth];

    return Array.from({ length: totalDays }, (_, index) => {
      const day = index + 1;
      const value = seed + ((day * 3) % 7) + (day % 5);
      return value;
    });
  }, [selectedMonth]);

  const chartOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
    },
    colors: ["#C4B5FD", "#E7E0EB"],
    dataLabels: {
      enabled: false,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        distributed: true,
      },
    },
    xaxis: {
      categories: selectedMonthData.map((_, index) => `${index + 1}`),
      title: {
        text: "Day",
      },
    },
    yaxis: {
      title: {
        text: "Requests",
      },
    },
  };

  const chartSeries = [
    {
      name: "Requests",
      data: selectedMonthData,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDF8FD] text-on-surface font-[Lexend] flex">
          
          <AdminSidebar />
    
          <div className="flex-1 flex flex-col h-screen overflow-y-auto">
    
            
    
      {/* Main */}
      <main className="flex-1 px-6 md:px-10 mt-2 md:mt-0 pt-10">
        
        {/* Header */}
        <h2 className="text-3xl font-extrabold mb-2 flex">
            Performance Overview
          </h2>
          <p className="text-gray-500 mb-10 flex">
            Here is overview this month
          </p>
        
        

        {/* Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">
            <div className="bg-purple-100 p-6 rounded-xl shadow">
                <p className="text-md text-gray-500 flex">
                    <span className="material-symbols-outlined  mr-2">
                        person
                    </span>
                    Total users</p>
                <h2 className="text-3xl font-bold text-purple-800">208</h2>
            </div>
            <div className="bg-purple-200 p-6 rounded-xl shadow">
                <p className="text-md text-gray-500 flex">
                    <span className="material-symbols-outlined  mr-2">
                        directions_car
                    </span>
                    Total Rider</p>
                <h2 className="text-3xl font-bold text-purple-800">188</h2>
            </div>
            <div className="bg-purple-400 p-6 rounded-xl shadow">
                <p className="text-md text-white flex">
                    <span className="material-symbols-outlined  mr-2">
                        request_quote
                    </span>
                    Total Request</p>
                <h2 className="text-3xl font-bold text-white">200</h2>
            </div>
            <div className="bg-[#684CB5] p-6 rounded-xl shadow">
                <p className="text-md text-white flex">
                    <span className="material-symbols-outlined  mr-2">
                        monetization_on
                    </span>
                    Total Revenue</p>
                <h2 className="text-3xl font-bold text-white">$102,400</h2>
            </div>
            
        </div>

        {/* chart */}
        <div className="bg-white p-6 rounded-xl shadow mb-10">
            <div className="flex items-center justify-between gap-4">
              <p className="">Monthly Request Volume</p>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="border rounded-lg px-3 py-2 bg-gray-50"
              >
                {monthOptions.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height={300}
              />
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