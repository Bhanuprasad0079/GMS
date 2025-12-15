// "use client";

// import React, { useState } from "react";
// import { 
//   FaPlus, 
//   FaCheckCircle, 
//   FaTimesCircle, 
//   FaClipboardList, 
//   FaSpinner, 
//   FaUserCheck,
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
  
//   // Mock Data
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

//   // The Progress Tracker (Updated for Light Mode)
//   const Tracker = ({ step, status }: { step: number, status: TicketStatus }) => {
//     const milestones = ["Submitted", "In Review", "Resolved", "Closed"];
    
//     return (
//       <div className="w-full py-6">
//         <div className="relative flex items-center justify-between w-full">
//           {/* Background Line */}
//           <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-0"></div>
          
//           {milestones.map((milestone, index) => {
//             const isCompleted = index + 1 <= step;
//             const isCurrent = index + 1 === step;
            
//             return (
//               <div key={index} className="flex flex-col items-center relative z-10">
//                 <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm
//                   ${isCompleted ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-300 text-gray-300"}
//                   ${isCurrent && status === "Re-opened" ? "bg-red-500 border-red-500 text-white" : ""}
//                 `}>
//                   {isCompleted ? <FaCheckCircle /> : (isCurrent && status !== "Re-opened" ? <FaSpinner className="animate-spin text-blue-500"/> : <div className="w-2 h-2 bg-gray-300 rounded-full" />)}
//                 </div>
//                 <span className={`mt-2 text-xs font-bold uppercase tracking-wide ${isCompleted ? "text-green-600" : "text-gray-400"}`}>
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
//     <main className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-8">
      
//       {/* --- DASHBOARD HEADER --- */}
//       <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-200 pb-6">
//         <div>
//           <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">My Grievances</h1>
//           <p className="text-gray-500 mt-1 text-sm">Track real-time status and provide feedback.</p>
//         </div>
        
//         <button 
//           onClick={() => setShowNewTicketForm(true)}
//           className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all font-semibold"
//         >
//           <FaPlus /> New Ticket
//         </button>
//       </div>

//       <div className="max-w-5xl mx-auto space-y-6">

//         {/* --- NEW TICKET FORM (Conditional Render) --- */}
//         {showNewTicketForm && (
//           <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg animate-fade-in-down mb-8">
//             <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Lodge a New Complaint</h2>
//             <form onSubmit={handleCreateTicket} className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
//                   <input 
//                     required 
//                     type="text" 
//                     className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//                     placeholder="e.g. Street Light Not Working"
//                     value={newTicket.title}
//                     onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                   <select 
//                     className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
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
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                 <textarea 
//                   required
//                   rows={3}
//                   className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//                   placeholder="Describe your issue in detail..."
//                   value={newTicket.description}
//                   onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
//                 />
//               </div>
//               <div className="flex justify-end gap-3 pt-2">
//                 <button 
//                   type="button" 
//                   onClick={() => setShowNewTicketForm(false)} 
//                   className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
//                 >
//                   Cancel
//                 </button>
//                 <button 
//                   type="submit" 
//                   className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold shadow-sm"
//                 >
//                   Submit Grievance
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* --- TICKETS LIST --- */}
//         {tickets.length === 0 ? (
//           <div className="text-center py-20 bg-white rounded-lg border border-gray-200 shadow-sm">
//             <FaClipboardList className="mx-auto text-4xl mb-4 text-gray-300" />
//             <p className="text-gray-500 font-medium">No grievances found. Submit one to get started.</p>
//           </div>
//         ) : (
//           tickets.map((ticket) => (
//             <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              
//               {/* Card Header */}
//               <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                 <div>
//                   <div className="flex items-center gap-3">
//                     <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded border border-gray-200">#{ticket.id}</span>
//                     <h3 className="text-lg font-bold text-gray-900">{ticket.title}</h3>
//                   </div>
//                   <p className="text-sm text-gray-500 mt-1 font-medium">{ticket.category} • <span className="text-gray-400">Submitted on {ticket.date}</span></p>
//                 </div>
                
//                 {/* Status Badge */}
//                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border
//                   ${ticket.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' : ''}
//                   ${ticket.status === 'In Review' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
//                   ${ticket.status === 'Submitted' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
//                   ${ticket.status === 'Re-opened' ? 'bg-red-50 text-red-700 border-red-200' : ''}
//                   ${ticket.status === 'Closed' ? 'bg-gray-100 text-gray-600 border-gray-200' : ''}
//                 `}>
//                   {ticket.status}
//                 </span>
//               </div>

//               {/* Card Body */}
//               <div className="p-6 bg-gray-50/50">
//                 <p className="text-gray-700 mb-6 leading-relaxed">{ticket.description}</p>
                
//                 {/* Visual Tracker */}
//                 <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
//                   <p className="text-xs text-gray-400 uppercase font-bold mb-4 tracking-wider">Live Tracking</p>
//                   <Tracker step={ticket.trackingStep} status={ticket.status} />
//                 </div>

//                 {/* --- FEEDBACK LOOP (Only if Resolved) --- */}
//                 {ticket.status === "Resolved" && (
//                   <div className="bg-blue-50 border border-blue-100 p-5 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-blue-100 rounded-full text-blue-600">
//                         <FaUserCheck className="text-xl" />
//                       </div>
//                       <div>
//                         <p className="text-sm font-bold text-blue-900">Action Taken</p>
//                         <p className="text-xs text-blue-700">Authority has marked this as resolved. Are you satisfied?</p>
//                       </div>
//                     </div>
//                     <div className="flex gap-3 w-full md:w-auto">
//                        <button 
//                         onClick={() => handleFeedback(ticket.id, 'reject')}
//                         className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 rounded-lg text-sm font-semibold transition-colors shadow-sm"
//                        >
//                          <FaTimesCircle /> No, Re-open
//                        </button>
//                        <button 
//                         onClick={() => handleFeedback(ticket.id, 'accept')}
//                         className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
//                        >
//                          <FaCheckCircle /> Yes, Close Ticket
//                        </button>
//                     </div>
//                   </div>
//                 )}
                
//                 {ticket.status === "Closed" && (
//                   <div className="text-center py-2 text-gray-400 text-sm italic bg-gray-100 rounded-lg border border-gray-200">
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

import React, { useState, useEffect } from "react";
import { FaPlus, FaCheckCircle, FaTimesCircle, FaClipboardList, FaSpinner, FaUserCheck } from "react-icons/fa";
import { useRouter } from "next/navigation";

// Types matching Backend DTO
type TicketStatus = "OPEN" | "ASSIGNED" | "RESOLVED" | "CLOSED" | "RE-OPENED";

interface Ticket {
  id: number;
  title: string;
  category: string;
  description: string;
  createdAt: string;
  status: TicketStatus;
}

export default function DashboardPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  const [newTicket, setNewTicket] = useState({
    title: "",
    category: "Public Utilities",
    description: ""
  });

  // 1. Check Login & Fetch Tickets
  useEffect(() => {
    const userDataStr = localStorage.getItem("user");
    if (!userDataStr) {
      router.push("/login"); // Redirect if not logged in
      return;
    }

    const user = JSON.parse(userDataStr);
    setUserId(user.userId);

    fetchTickets(user.userId);
  }, []);

  const fetchTickets = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5087/api/Ticket/my-tickets/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (error) {
      console.error("Failed to fetch tickets", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Create Ticket Handler
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const response = await fetch("http://localhost:5087/api/Ticket/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTicket.title,
          category: newTicket.category,
          description: newTicket.description,
          creatorId: userId
        }),
      });

      if (response.ok) {
        alert("Grievance submitted successfully!");
        setShowNewTicketForm(false);
        setNewTicket({ title: "", category: "Public Utilities", description: "" });
        fetchTickets(userId); // Refresh list
      } else {
        alert("Failed to create ticket.");
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  // Helper to map status to tracker step (1-4)
  const getStep = (status: string) => {
    switch(status) {
        case "OPEN": return 1;
        case "ASSIGNED": return 2;
        case "RESOLVED": return 3;
        case "CLOSED": return 4;
        case "RE-OPENED": return 2;
        default: return 1;
    }
  };

  // Tracker Component
  const Tracker = ({ status }: { status: TicketStatus }) => {
    const step = getStep(status);
    const milestones = ["Submitted", "In Review", "Resolved", "Closed"];
    
    return (
      <div className="w-full py-6">
        <div className="relative flex items-center justify-between w-full">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-0"></div>
          {milestones.map((milestone, index) => {
            const isCompleted = index + 1 <= step;
            const isCurrent = index + 1 === step;
            return (
              <div key={index} className="flex flex-col items-center relative z-10">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${isCompleted ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-300 text-gray-300"} ${isCurrent && status === "RE-OPENED" ? "bg-red-500 border-red-500 text-white" : ""}`}>
                  {isCompleted ? <FaCheckCircle /> : (isCurrent && status !== "RE-OPENED" ? <FaSpinner className="animate-spin text-blue-500"/> : <div className="w-2 h-2 bg-gray-300 rounded-full" />)}
                </div>
                <span className={`mt-2 text-xs font-bold uppercase tracking-wide ${isCompleted ? "text-green-600" : "text-gray-400"}`}>{milestone}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">My Grievances</h1>
          <p className="text-gray-500 mt-1 text-sm">Track real-time status and provide feedback.</p>
        </div>
        <button onClick={() => setShowNewTicketForm(true)} className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-md transition-all font-semibold">
          <FaPlus /> New Ticket
        </button>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        {showNewTicketForm && (
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg animate-fade-in-down mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Lodge a New Complaint</h2>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Title</label><input required type="text" className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Street Light Not Working" value={newTicket.title} onChange={(e) => setNewTicket({...newTicket, title: e.target.value})} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Category</label><select className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" value={newTicket.category} onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}><option>Public Utilities</option><option>Sanitation</option><option>Roads & Transport</option><option>Law & Order</option><option>Other</option></select></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea required rows={3} className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Describe your issue..." value={newTicket.description} onChange={(e) => setNewTicket({...newTicket, description: e.target.value})} /></div>
              <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setShowNewTicketForm(false)} className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">Cancel</button><button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg text-white font-semibold shadow-sm">Submit Grievance</button></div>
            </form>
          </div>
        )}

        {isLoading ? (
            <div className="text-center py-20"><FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto" /></div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200 shadow-sm"><FaClipboardList className="mx-auto text-4xl mb-4 text-gray-300" /><p className="text-gray-500 font-medium">No grievances found. Submit one to get started.</p></div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-3"><span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded border border-gray-200">#{ticket.id}</span><h3 className="text-lg font-bold text-gray-900">{ticket.title}</h3></div>
                  <p className="text-sm text-gray-500 mt-1 font-medium">{ticket.category} • <span className="text-gray-400">Submitted on {new Date(ticket.createdAt).toLocaleDateString()}</span></p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${ticket.status === 'RESOLVED' ? 'bg-green-50 text-green-700 border-green-200' : ticket.status === 'OPEN' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-600'}`}>{ticket.status}</span>
              </div>
              <div className="p-6 bg-gray-50/50">
                <p className="text-gray-700 mb-6 leading-relaxed">{ticket.description}</p>
                <div className="mb-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm"><p className="text-xs text-gray-400 uppercase font-bold mb-4 tracking-wider">Live Tracking</p><Tracker status={ticket.status} /></div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}