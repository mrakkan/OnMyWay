import React from "react";
import RequestCard from "./requestcard";
import DriverSidebar from "./sidebar";
import { useNavigate } from "react-router-dom";
export default function MyWorkPage({ myWork }) {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#FDF8FD] text-on-surface font-[Lexend] flex">
      <DriverSidebar />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="pt-5 px-8 flex items-center justify-end">
          <div className="flex items-center gap-3">
            <p className="font-bold text-[#581C87]">David Miller</p>
            <img
              className="w-10 h-10 rounded-full object-cover"
              src="https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
            />
          </div>
        </header>

        <main className="flex-1 px-6 md:px-10 mt-2 md:mt-0">
          <h2 className="text-3xl font-extrabold mb-2 flex">My Works</h2>
          <p className="text-gray-500 mb-10 flex">
            You have {myWork.length} works in progress
          </p>

          {myWork.length === 0 ? (
            <div className="bg-white rounded-xl p-6 shadow text-gray-600">
              No works yet. Go to My Request and press Accept to add work.
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8" href="">
              {myWork.map((job) => (
                <RequestCard key={job.id} {...job} 
                mode="work" 
                status={job.status}
  onClick={() => navigate(`/work/${job.id}`)}/>
              ))}

              
            </div>
          )}
        </main>
      </div>
    </div>
  );
}