// "use client";

// import React, { useState } from "react";
// import { 
//   FaPlus, 
//   FaCheckCircle, 
//   FaTimesCircle, 
//   FaClipboardList, 
//   FaSpinner, 
//   FaUserCheck,
//   FaSearch
// } from "react-icons/fa";

// // Types for our Mock Data
// type TicketStatus = "Submitted" | "In Review" | "Resolved" | "Closed" | "Re-opened";

// interface Ticket {
//   id: number;
//   title: string;
//   category: string;
//   description: string;
//   date: string;
//   status: TicketStatus;
//   trackingStep: number; // 1 to 4
// }

// export default function DashboardPage() {
//   // --- STATE ---
//   const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  
//   // Mock Data: Pre-filled with a sample ticket so the dashboard isn't empty
//   const [tickets, setTickets] = useState<Ticket[]>([
//     {
//       id: 1024,
//       title: "Water Supply Irregularity",
//       category: "Public Utilities",
//       description: "Water supply has been erratic in Sector 4 for the last week.",
//       date: "2023-11-20",
//       status: "Resolved",
//       trackingStep: 3, 
//     }
//   ]);

//   // Form State
//   const [newTicket, setNewTicket] = useState({
//     title: "",
//     category: "Public Utilities",
//     description: ""
//   });

//   // --- HANDLERS ---

//   const handleCreateTicket = (e: React.FormEvent) => {
//     e.preventDefault();
//     const ticket: Ticket = {
//       id: Math.floor(Math.random() * 10000),
//       title: newTicket.title,
//       category: newTicket.category,
//       description: newTicket.description,
//       date: new Date().toISOString().split('T')[0],
//       status: "Submitted",
//       trackingStep: 1,
//     };
//     setTickets([ticket, ...tickets]);
//     setShowNewTicketForm(false);
//     setNewTicket({ title: "", category: "Public Utilities", description: "" });
//   };

//   const handleFeedback = (id: number, action: "accept" | "reject") => {
//     setTickets(tickets.map(t => {
//       if (t.id === id) {
//         if (action === "accept") {
//           return { ...t, status: "Closed", trackingStep: 4 };
//         } else {
//           return { ...t, status: "Re-opened", trackingStep: 2 }; // Goes back to review
//         }
//       }
//       return t;
//     }));
//   };

//   // --- COMPONENTS ---

//   // The Amazon-style Progress Tracker
//   const Tracker = ({ step, status }: { step: number, status: TicketStatus }) => {
//     const milestones = ["Submitted", "In Review", "Resolved", "Closed"];
    
//     return (
//       <div className="w-full py-6">
//         <div className="relative flex items-center justify-between w-full">
//           {/* Background Line */}
//           <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-700 -z-0"></div>
          
//           {milestones.map((milestone, index) => {
//             const isCompleted = index + 1 <= step;
//             const isCurrent = index + 1 === step;
            
//             return (
//               <div key={index} className="flex flex-col items-center relative z-10">
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
//                   ${isCompleted ? "bg-green-500 border-green-500 text-white" : "bg-gray-800 border-gray-600 text-gray-500"}
//                   ${isCurrent && status === "Re-opened" ? "bg-red-500 border-red-500" : ""}
//                 `}>
//                   {isCompleted ? <FaCheckCircle /> : <FaSpinner/>}
//                 </div>
//                 <span className={`mt-2 text-xs font-medium ${isCompleted ? "text-green-400" : "text-gray-500"}`}>
//                   {milestone}
//                 </span>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <main className="min-h-screen bg-gray-950 text-gray-100 p-4 sm:p-8">
      
//       {/* --- DASHBOARD HEADER --- */}
//       <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-800 pb-6">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-white">My Grievances</h1>
//           <p className="text-gray-400 mt-1 text-sm">Track real-time status and provide feedback.</p>
//         </div>
        
//         <button 
//           onClick={() => setShowNewTicketForm(true)}
//           className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-sm shadow-md transition-all"
//         >
//           <FaPlus /> New Ticket
//         </button>
//       </div>

//       <div className="max-w-5xl mx-auto space-y-6">

//         {/* --- NEW TICKET FORM (Conditional Render) --- */}
//         {showNewTicketForm && (
//           <div className="bg-gray-900 border border-gray-700 p-6 rounded-sm shadow-xl animate-fade-in-down mb-8">
//             <h2 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">Lodge a New Complaint</h2>
//             <form onSubmit={handleCreateTicket} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm text-gray-400 mb-1">Title</label>
//                   <input 
//                     required 
//                     type="text" 
//                     className="w-full bg-gray-800 border border-gray-600 rounded-sm p-2 text-white focus:border-blue-500 focus:outline-none"
//                     placeholder="e.g. Street Light Not Working"
//                     value={newTicket.title}
//                     onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm text-gray-400 mb-1">Category</label>
//                   <select 
//                     className="w-full bg-gray-800 border border-gray-600 rounded-sm p-2 text-white focus:border-blue-500"
//                     value={newTicket.category}
//                     onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
//                   >
//                     <option>Public Utilities</option>
//                     <option>Sanitation</option>
//                     <option>Roads & Transport</option>
//                     <option>Law & Order</option>
//                     <option>Other</option>
//                   </select>
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm text-gray-400 mb-1">Description</label>
//                 <textarea 
//                   required
//                   rows={3}
//                   className="w-full bg-gray-800 border border-gray-600 rounded-sm p-2 text-white focus:border-blue-500 focus:outline-none"
//                   placeholder="Describe your issue in detail..."
//                   value={newTicket.description}
//                   onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
//                 />
//               </div>
//               <div className="flex justify-end gap-3 pt-2">
//                 <button 
//                   type="button" 
//                   onClick={() => setShowNewTicketForm(false)} 
//                   className="px-4 py-2 text-gray-400 hover:text-white"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="submit" 
//                   className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-sm text-white"
//                 >
//                   Submit Grievance
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* --- TICKETS LIST --- */}
//         {tickets.length === 0 ? (
//           <div className="text-center py-20 text-gray-500">
//             <FaClipboardList className="mx-auto text-4xl mb-4 opacity-50" />
//             <p>No grievances found. Submit one to get started.</p>
//           </div>
//         ) : (
//           tickets.map((ticket) => (
//             <div key={ticket.id} className="bg-gray-900 border border-gray-800 rounded-sm shadow-md overflow-hidden">
              
//               {/* Card Header */}
//               <div className="p-6 border-b border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                 <div>
//                   <div className="flex items-center gap-3">
//                     <span className="bg-gray-800 text-gray-300 text-xs px-2 py-1 rounded">#{ticket.id}</span>
//                     <h3 className="text-lg font-bold text-white">{ticket.title}</h3>
//                   </div>
//                   <p className="text-sm text-gray-400 mt-1">{ticket.category} • Submitted on {ticket.date}</p>
//                 </div>
                
//                 {/* Status Badge */}
//                 <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
//                   ${ticket.status === 'Resolved' ? 'bg-green-900/50 text-green-400 border border-green-800' : ''}
//                   ${ticket.status === 'In Review' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-800' : ''}
//                   ${ticket.status === 'Submitted' ? 'bg-blue-900/50 text-blue-400 border border-blue-800' : ''}
//                   ${ticket.status === 'Re-opened' ? 'bg-red-900/50 text-red-400 border border-red-800' : ''}
//                   ${ticket.status === 'Closed' ? 'bg-gray-700 text-gray-300' : ''}
//                 `}>
//                   {ticket.status}
//                 </span>
//               </div>

//               {/* Card Body */}
//               <div className="p-6 bg-gray-900/50">
//                 <p className="text-gray-300 mb-6">{ticket.description}</p>
                
//                 {/* Visual Tracker */}
//                 <div className="mb-6 bg-gray-950 p-4 rounded-lg border border-gray-800">
//                   <p className="text-xs text-gray-500 uppercase font-bold mb-4">Live Tracking</p>
//                   <Tracker step={ticket.trackingStep} status={ticket.status} />
//                 </div>

//                 {/* --- FEEDBACK LOOP (Only if Resolved) --- */}
//                 {ticket.status === "Resolved" && (
//                   <div className="bg-blue-900/20 border border-blue-900/50 p-4 rounded-sm flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse-slow">
//                     <div className="flex items-center gap-3">
//                       <FaUserCheck className="text-blue-400 text-xl" />
//                       <div>
//                         <p className="text-sm font-bold text-blue-100">Action Taken</p>
//                         <p className="text-xs text-blue-300">Authority has marked this as resolved. Are you satisfied?</p>
//                       </div>
//                     </div>
//                     <div className="flex gap-3">
//                        <button 
//                         onClick={() => handleFeedback(ticket.id, 'reject')}
//                         className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 border border-red-900 rounded-sm text-sm transition-colors"
//                        >
//                          <FaTimesCircle /> No, Re-open
//                        </button>
//                        <button 
//                         onClick={() => handleFeedback(ticket.id, 'accept')}
//                         className="flex items-center gap-2 px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded-sm text-sm shadow-sm transition-colors"
//                        >
//                          <FaCheckCircle /> Yes, Close Ticket
//                        </button>
//                     </div>
//                   </div>
//                 )}
                
//                 {ticket.status === "Closed" && (
//                   <div className="text-center py-2 text-gray-500 text-sm italic">
//                     Ticket closed by citizen. No further action required.
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </main>
//   );
// }

"use client";

import React, { useState } from "react";
import { 
  FaPlus, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClipboardList, 
  FaSpinner, 
  FaUserCheck,
} from "react-icons/fa";

// Types for our Mock Data
type TicketStatus = "Submitted" | "In Review" | "Resolved" | "Closed" | "Re-opened";

interface Ticket {
  id: number;
  title: string;
  category: string;
  description: string;
  date: string;
  status: TicketStatus;
  trackingStep: number; // 1 to 4
}

export default function DashboardPage() {
  // --- STATE ---
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  
  // Mock Data
  const [tickets, setTickets] = useState<Ticket[]>([
    {
      id: 1024,
      title: "Water Supply Irregularity",
      category: "Public Utilities",
      description: "Water supply has been erratic in Sector 4 for the last week.",
      date: "2023-11-20",
      status: "Resolved",
      trackingStep: 3, 
    }
  ]);

  // Form State
  const [newTicket, setNewTicket] = useState({
    title: "",
    category: "Public Utilities",
    description: ""
  });

  // --- HANDLERS ---

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket: Ticket = {
      id: Math.floor(Math.random() * 10000),
      title: newTicket.title,
      category: newTicket.category,
      description: newTicket.description,
      date: new Date().toISOString().split('T')[0],
      status: "Submitted",
      trackingStep: 1,
    };
    setTickets([ticket, ...tickets]);
    setShowNewTicketForm(false);
    setNewTicket({ title: "", category: "Public Utilities", description: "" });
  };

  const handleFeedback = (id: number, action: "accept" | "reject") => {
    setTickets(tickets.map(t => {
      if (t.id === id) {
        if (action === "accept") {
          return { ...t, status: "Closed", trackingStep: 4 };
        } else {
          return { ...t, status: "Re-opened", trackingStep: 2 }; // Goes back to review
        }
      }
      return t;
    }));
  };

  // --- COMPONENTS ---

  // The Progress Tracker (Updated for Light Mode)
  const Tracker = ({ step, status }: { step: number, status: TicketStatus }) => {
    const milestones = ["Submitted", "In Review", "Resolved", "Closed"];
    
    return (
      <div className="w-full py-6">
        <div className="relative flex items-center justify-between w-full">
          {/* Background Line */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-0"></div>
          
          {milestones.map((milestone, index) => {
            const isCompleted = index + 1 <= step;
            const isCurrent = index + 1 === step;
            
            return (
              <div key={index} className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm
                  ${isCompleted ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-300 text-gray-300"}
                  ${isCurrent && status === "Re-opened" ? "bg-red-500 border-red-500 text-white" : ""}
                `}>
                  {isCompleted ? <FaCheckCircle /> : (isCurrent && status !== "Re-opened" ? <FaSpinner className="animate-spin text-blue-500"/> : <div className="w-2 h-2 bg-gray-300 rounded-full" />)}
                </div>
                <span className={`mt-2 text-xs font-bold uppercase tracking-wide ${isCompleted ? "text-green-600" : "text-gray-400"}`}>
                  {milestone}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-8">
      
      {/* --- DASHBOARD HEADER --- */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">My Grievances</h1>
          <p className="text-gray-500 mt-1 text-sm">Track real-time status and provide feedback.</p>
        </div>
        
        <button 
          onClick={() => setShowNewTicketForm(true)}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all font-semibold"
        >
          <FaPlus /> New Ticket
        </button>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">

        {/* --- NEW TICKET FORM (Conditional Render) --- */}
        {showNewTicketForm && (
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg animate-fade-in-down mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Lodge a New Complaint</h2>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g. Street Light Not Working"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                  >
                    <option>Public Utilities</option>
                    <option>Sanitation</option>
                    <option>Roads & Transport</option>
                    <option>Law & Order</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  required
                  rows={3}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Describe your issue in detail..."
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowNewTicketForm(false)} 
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold shadow-sm"
                >
                  Submit Grievance
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- TICKETS LIST --- */}
        {tickets.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200 shadow-sm">
            <FaClipboardList className="mx-auto text-4xl mb-4 text-gray-300" />
            <p className="text-gray-500 font-medium">No grievances found. Submit one to get started.</p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              
              {/* Card Header */}
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded border border-gray-200">#{ticket.id}</span>
                    <h3 className="text-lg font-bold text-gray-900">{ticket.title}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 font-medium">{ticket.category} • <span className="text-gray-400">Submitted on {ticket.date}</span></p>
                </div>
                
                {/* Status Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
                  ${ticket.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                  ${ticket.status === 'In Review' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                  ${ticket.status === 'Submitted' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                  ${ticket.status === 'Re-opened' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                  ${ticket.status === 'Closed' ? 'bg-gray-100 text-gray-600 border-gray-200' : ''}
                `}>
                  {ticket.status}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 bg-gray-50/50">
                <p className="text-gray-700 mb-6 leading-relaxed">{ticket.description}</p>
                
                {/* Visual Tracker */}
                <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-4 tracking-wider">Live Tracking</p>
                  <Tracker step={ticket.trackingStep} status={ticket.status} />
                </div>

                {/* --- FEEDBACK LOOP (Only if Resolved) --- */}
                {ticket.status === "Resolved" && (
                  <div className="bg-blue-50 border border-blue-100 p-5 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                        <FaUserCheck className="text-xl" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-900">Action Taken</p>
                        <p className="text-xs text-blue-700">Authority has marked this as resolved. Are you satisfied?</p>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                       <button 
                        onClick={() => handleFeedback(ticket.id, 'reject')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors shadow-sm"
                       >
                         <FaTimesCircle /> No, Re-open
                       </button>
                       <button 
                        onClick={() => handleFeedback(ticket.id, 'accept')}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
                       >
                         <FaCheckCircle /> Yes, Close Ticket
                       </button>
                    </div>
                  </div>
                )}
                
                {ticket.status === "Closed" && (
                  <div className="text-center py-2 text-gray-400 text-sm italic bg-gray-100 rounded-lg border border-gray-200">
                    Ticket closed by citizen. No further action required.
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}