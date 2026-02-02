"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Plus, Filter, CheckCircle2, Clock, FileText, X, Loader2, 
  Trash2, MapPin, ThumbsUp, ThumbsDown, AlertCircle, Upload, Image as ImageIcon, ExternalLink
} from "lucide-react";
import { getCsrfToken } from "@/utils/csrf"; // <--- 1. IMPORT CSRF HELPER
import { formatDate } from "@/utils/date";
import { API_BASE_URL } from '@/utils/api';
import { apiFetch } from '@/utils/apiFetch';

// --- Types ---
type TicketStatus = "OPEN" | "ASSIGNED" | "RESOLVED" | "CLOSED" | "RE-OPENED" | "IN_REVIEW";

interface Ticket {
  id: number;
  title: string;
  category: string;
  description: string;
  createdAt: string;
  status: TicketStatus;
  priority?: string;
  attachmentUrl?: string; 
}

interface UserInfo {
  userId: number;
  fullName: string;
  role: string;
}

const CATEGORIES = [
  "Public Utilities", 
  "Sanitation", 
  "Roads & Transport",
  "Law & Order",
  "Healthcare", 
  "Other"
];

export default function DashboardPage() {
  const router = useRouter();
  
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "CLOSED">("ALL");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- Form State ---
  const [newTicket, setNewTicket] = useState({ title: "", category: CATEGORIES[0], description: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null); 

  // useEffect(() => {
  //   const initDashboard = async () => {
  //     try {
  //       const meRes = await fetch(`${API_BASE_URL}/api/Auth/me`, { credentials: "include" });
  //       if (meRes.ok) {
  //         const user = await meRes.json();
  //         setUserInfo(user);
  //         fetchTickets(user.userId);
  //       } else {
  //         router.push("/login");
  //       }
  //     } catch (error) {
  //       router.push("/login");
  //     }
  //   };
  //   initDashboard();
  // },
  useEffect(() => {
    const initDashboard = async () => {
      try {
        const res = await apiFetch("/api/Auth/me"); // Simple call!
        if (res.ok) {
          const user = await res.json();
          setUserInfo(user);
          fetchTickets(user.userId);
        } else {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      }
    };
    initDashboard();
},
   [router]);

  const fetchTickets = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/Ticket/my-tickets/${id}`, {
        credentials: "include" 
      });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (error) {
      console.error("Fetch error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("Title", newTicket.title);
      formData.append("Category", newTicket.category);
      formData.append("Description", newTicket.description);
      if (selectedFile) {
        formData.append("Image", selectedFile);
      }

      const response = await fetch(`${API_BASE_URL}/api/Ticket/create`, {
        method: "POST",
        credentials: "include",
        headers: {
            "X-XSRF-TOKEN": getCsrfToken() // <--- 2. ADD CSRF HEADER
            // Do NOT set Content-Type for FormData
        },
        body: formData, 
      });
      
      


      if (response.ok) {
        setShowNewTicketForm(false);
        setNewTicket({ title: "", category: CATEGORIES[0], description: "" });
        setSelectedFile(null); 
        if (userInfo) fetchTickets(userInfo.userId); 
        alert("Grievance Submitted Successfully");
      } else {
        const err = await response.json();
        alert(err.message || "Failed to submit. Please try again.");
      }
    } catch (error) {
      alert("Server Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTicket = async (ticketId: number) => {
    if (!confirm("Are you sure you want to withdraw this grievance?")) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/Ticket/${ticketId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "X-XSRF-TOKEN": getCsrfToken() // <--- 3. ADD CSRF HEADER
        }
      });

      if (response.ok) {
        setTickets(prev => prev.filter(t => t.id !== ticketId));
      } else {
        alert("Cannot delete tickets that are already being processed.");
      }
    } catch (error) {
      alert("Delete failed");
    }
  };

  const handleFeedback = async (ticketId: number, action: "close" | "reopen") => {
    const newStatus = action === "close" ? "CLOSED" : "RE-OPENED";
    const confirmMsg = action === "close" 
        ? "Are you sure you are satisfied? This will close the ticket permanently." 
        : "Are you sure you want to reopen this ticket? The worker will be notified.";

    if (!confirm(confirmMsg)) return;

    try {
        const res = await fetch(`${API_BASE_URL}/api/Ticket/${ticketId}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": getCsrfToken() // <--- 4. ADD CSRF HEADER
            },
            credentials: "include",
            body: JSON.stringify({ status: newStatus })
        });

        if (res.ok) {
            setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus as any } : t));
            alert(action === "close" ? "Thank you! Ticket Closed." : "Ticket Re-opened.");
        } else {
            alert("Failed to update ticket.");
        }
    } catch (e) { alert("Network Error"); }
  };

  const filteredTickets = tickets.filter(t => {
    if (filterStatus === "ALL") return true;
    if (filterStatus === "CLOSED") return t.status === "CLOSED" || t.status === "RESOLVED";
    return t.status !== "CLOSED" && t.status !== "RESOLVED";
  });

  const stats = {
    total: tickets.length,
    active: tickets.filter(t => t.status !== 'CLOSED' && t.status !== 'RESOLVED').length,
    resolved: tickets.filter(t => t.status === 'CLOSED' || t.status === 'RESOLVED').length
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans pb-20">
      
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between gap-4 items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {userInfo?.fullName.split(' ')[0]}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Citizen Grievance Dashboard</p>
          </div>
          <button 
            onClick={() => setShowNewTicketForm(true)} 
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" /> File New Grievance
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        <div className="grid grid-cols-3 gap-4 mb-8">
            <StatCard label="Total Reports" count={stats.total} icon={<FileText className="text-blue-500"/>} />
            <StatCard label="In Progress" count={stats.active} icon={<Clock className="text-amber-500"/>} />
            <StatCard label="Resolved" count={stats.resolved} icon={<CheckCircle2 className="text-emerald-500"/>} />
        </div>

        {/* --- CREATE MODAL --- */}
        {showNewTicketForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">File Grievance</h3>
                    <button onClick={() => setShowNewTicketForm(false)}><X className="text-slate-400 hover:text-red-500" /></button>
                </div>
                <form onSubmit={handleCreateTicket} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Subject</label>
                        <input required className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Brief title..." value={newTicket.title} onChange={e => setNewTicket({...newTicket, title: e.target.value})} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Category</label>
                        <select className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" value={newTicket.category} onChange={e => setNewTicket({...newTicket, category: e.target.value})}>
                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Description</label>
                        <textarea required rows={4} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="Describe the issue..." value={newTicket.description} onChange={e => setNewTicket({...newTicket, description: e.target.value})} />
                    </div>

                    {/* --- IMAGE UPLOAD FIELD --- */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Attach Proof (Optional)</label>
                        <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors relative group cursor-pointer">
                            {!selectedFile ? (
                                <>
                                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2 group-hover:text-emerald-500 transition-colors" />
                                    <p className="text-xs text-slate-500">Click to upload photo (Max 5MB)</p>
                                    <input type="file" accept="image/png, image/jpeg, image/jpg" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                                </>
                            ) : (
                                <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded border border-emerald-200 dark:border-emerald-800">
                                    <div className="flex items-center gap-2 truncate">
                                        <ImageIcon className="w-4 h-4 text-emerald-600" />
                                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 truncate max-w-[200px]">{selectedFile.name}</span>
                                    </div>
                                    <button type="button" onClick={() => setSelectedFile(null)} className="p-1 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full text-emerald-700"><X className="w-3 h-3" /></button>
                                </div>
                            )}
                        </div>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-lg flex justify-center items-center gap-2">
                        {isSubmitting ? <Loader2 className="animate-spin w-5 h-5"/> : "Submit Report"}
                    </button>
                </form>
            </div>
          </div>
        )}

        <div className="flex gap-4 border-b border-slate-200 dark:border-slate-800 mb-6">
            <button onClick={() => setFilterStatus("ALL")} className={`pb-2 text-sm font-bold border-b-2 transition-colors ${filterStatus === "ALL" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500"}`}>All Tickets</button>
            <button onClick={() => setFilterStatus("ACTIVE")} className={`pb-2 text-sm font-bold border-b-2 transition-colors ${filterStatus === "ACTIVE" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500"}`}>Active</button>
            <button onClick={() => setFilterStatus("CLOSED")} className={`pb-2 text-sm font-bold border-b-2 transition-colors ${filterStatus === "CLOSED" ? "border-emerald-500 text-emerald-600" : "border-transparent text-slate-500"}`}>Resolved</button>
        </div>

        {isLoading ? <div className="text-center py-10"><Loader2 className="animate-spin w-8 h-8 mx-auto text-emerald-500"/></div> : (
            <div className="grid gap-6">
                {filteredTickets.map(ticket => (
                    <div key={ticket.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col gap-6 relative overflow-hidden group">
                        
                        <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${ticket.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>

                        <div className="flex flex-col md:flex-row justify-between gap-6 pl-2">
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <span className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs font-mono font-bold text-slate-500">#{ticket.id}</span>
                                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded border border-emerald-100 dark:border-emerald-800">{ticket.category}</span>
                                    <span className="text-xs text-slate-400 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {new Date(ticket.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{ticket.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-3">{ticket.description}</p>

                                {/* --- VIEW PROOF LINK --- */}
                                {ticket.attachmentUrl && (
                                    <a 
                                        href={`${API_BASE_URL}/api/Ticket/${ticket.id}/attachment`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded w-fit"
                                    >
                                        <ImageIcon className="w-3 h-3" /> View Proof <ExternalLink className="w-3 h-3"/>
                                    </a>
                                )}
                            </div>

                            {ticket.status === 'OPEN' && (
                                <div className="flex items-start">
                                    <button onClick={() => handleDeleteTicket(ticket.id)} className="text-slate-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors" title="Withdraw Ticket">
                                        <Trash2 className="w-5 h-5"/>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* FEEDBACK SECTION */}
                        {ticket.status === "RESOLVED" && (
                            <div className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                    <div>
                                        <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200">Worker marked as Resolved.</p>
                                        <p className="text-xs text-indigo-700 dark:text-indigo-300">Are you satisfied?</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button onClick={() => handleFeedback(ticket.id, 'close')} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-emerald-600 border border-emerald-200 dark:border-emerald-800 rounded-lg text-sm font-bold hover:bg-emerald-50 transition-colors shadow-sm">
                                        <ThumbsUp className="w-4 h-4"/> Yes, Close
                                    </button>
                                    <button onClick={() => handleFeedback(ticket.id, 'reopen')} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-rose-600 border border-rose-200 dark:border-rose-800 rounded-lg text-sm font-bold hover:bg-rose-50 transition-colors shadow-sm">
                                        <ThumbsDown className="w-4 h-4"/> No, Reopen
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                            <Tracker status={ticket.status} />
                        </div>

                    </div>
                ))}
                
                {filteredTickets.length === 0 && (
                    <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed">
                        <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-500">No tickets found.</p>
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
}

const StatCard = ({ label, count, icon }: any) => (
  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
    <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p><p className="text-2xl font-bold text-slate-900 dark:text-white">{count}</p></div>
    <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">{icon}</div>
  </div>
);

const Tracker = ({ status }: { status: TicketStatus }) => {
  const getStep = (s: string) => {
    if (s === "OPEN") return 1;
    if (s === "ASSIGNED" || s === "IN_REVIEW" || s === "RE-OPENED") return 2;
    if (s === "RESOLVED") return 3;
    if (s === "CLOSED") return 4;
    return 1;
  };
  
  const currentStep = getStep(status);
  const steps = ["Submitted", "Assigned", "Resolved", "Closed"];

  return (
    <div className="w-full px-2">
      <div className="relative flex justify-between items-center w-full">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 dark:bg-slate-800 -z-10 rounded-full"></div>
        <div className="absolute top-1/2 left-0 h-1 bg-emerald-500 -z-10 transition-all duration-700 ease-out rounded-full" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}></div>
        {steps.map((label, idx) => {
          const isActive = (idx + 1) <= currentStep;
          return (
            <div key={label} className="flex flex-col items-center gap-2 bg-white dark:bg-slate-900 px-2">
              <div className={`w-3 h-3 rounded-full border-2 transition-all duration-500 ${isActive ? "bg-emerald-500 border-emerald-500 scale-125 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]" : "bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600"}`}></div>
              <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors duration-300 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-300 dark:text-slate-600"}`}>{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};