"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  HardHat, MapPin, Phone, Clock, CheckCircle, RefreshCw, 
  LogOut, PlayCircle, CheckSquare, AlertCircle, ChevronDown, ChevronUp, Activity,
  Image as ImageIcon, ExternalLink
} from "lucide-react";
import { getCsrfToken } from "@/utils/csrf"; // <--- 1. IMPORT CSRF HELPER
import { formatDate } from "@/utils/date";
import { API_BASE_URL } from '@/utils/api';


// Interfaces
interface User { fullName: string; contact: string; address: string; }
interface Ticket { 
  id: number; title: string; category: string; description: string; 
  priority: "LOW" | "MEDIUM" | "HIGH"; 
  status: "OPEN" | "ASSIGNED" | "RESOLVED" | "CLOSED" | "RE-OPENED" | "IN_REVIEW"; 
  createdAt: string; creator: User; 
  attachmentUrl?: string; 
}
interface UserInfo { userId: number; fullName: string; role: string; }

interface Log {
    id: number; action: string; description: string; changedBy: string; timestamp: string;
}

export default function WorkerDashboard() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);

  useEffect(() => {
    const initWorker = async () => {
      try {
        const meRes = await fetch(`${API_BASE_URL}/api/Auth/me`, { credentials: "include" });
        if (!meRes.ok) { router.push("/login/workerloginpage"); return; }
        
        const user = await meRes.json();
        if (user.role !== "Worker") {
            alert("Unauthorized: Field Staff Only");
            router.push("/login");
            return;
        }
        setUserInfo(user);
        fetchAssignedTickets(user.userId);
      } catch (e) { router.push("/login/workerloginpage"); }
    };
    initWorker();
  }, []);

  const fetchAssignedTickets = async (workerId: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/Ticket/assigned-tickets/${workerId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setTickets(data);
      }
    } catch (error) { console.error("Fetch error:", error); } 
    finally { setIsLoading(false); }
  };

  const updateStatus = async (ticketId: number, newStatus: string) => {
    setProcessingId(ticketId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/Ticket/${ticketId}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": getCsrfToken() // <--- 2. ADD CSRF HEADER
        },
        credentials: "include",
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: newStatus as any } : t));
        alert(newStatus === "RESOLVED" ? "Ticket Resolved! Email sent to citizen." : "Status Updated.");
      } else { alert("Failed to update status"); }
    } catch (error) { alert("Network error"); } 
    finally { setProcessingId(null); }
  };

  const updatePriority = async (ticketId: number, newPriority: string) => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/Ticket/${ticketId}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": getCsrfToken() // <--- 3. ADD CSRF HEADER
            },
            credentials: "include",
            body: JSON.stringify({ priority: newPriority })
        });
        if(res.ok) {
            setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, priority: newPriority as any } : t));
        }
    } catch(e) { alert("Failed to update priority"); }
  };

  const handleEscalate = async (ticketId: number) => {
    if(!confirm("Return this ticket to Admin pool? You will be unassigned.")) return;
    try {
        const res = await fetch(`${API_BASE_URL}/api/Ticket/${ticketId}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": getCsrfToken() // <--- 4. ADD CSRF HEADER
            },
            credentials: "include",
            body: JSON.stringify({ assignedWorkerId: 0 }) 
        });
        if(res.ok) {
            setTickets(prev => prev.filter(t => t.id !== ticketId)); 
            alert("Ticket returned to Admin.");
        }
    } catch(e) { alert("Network Error"); }
  };

  const handleLogout = async () => {
    await fetch(`${API_BASE_URL}/api/Auth/logout`, { 
        method: "POST", 
        headers: { "X-XSRF-TOKEN": getCsrfToken() }, // <--- 5. ADD CSRF HEADER
        credentials: "include" 
    });
    localStorage.removeItem("user_info");
    router.push("/login/workerloginpage");
  };

  const toggleTimeline = (id: number) => {
      setExpandedTicketId(expandedTicketId === id ? null : id);
  };

  const stats = {
    pending: tickets.filter(t => t.status !== "RESOLVED" && t.status !== "CLOSED").length,
    completed: tickets.filter(t => t.status === "RESOLVED" || t.status === "CLOSED").length,
    highPriority: tickets.filter(t => t.priority === "HIGH" && t.status !== "RESOLVED").length
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 pb-10">
      
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="bg-amber-500 text-white p-1 rounded-md"><HardHat className="w-5 h-5"/></span>
          Field Operations
        </h1>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm text-slate-500 font-medium">{userInfo?.fullName}</span>
          <button onClick={() => fetchAssignedTickets(userInfo!.userId)} className="p-2 text-slate-400 hover:text-amber-600 transition-colors" title="Refresh"><RefreshCw className="w-5 h-5" /></button>
          <button onClick={handleLogout} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-colors"><LogOut className="w-5 h-5" /></button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-8">
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="Inbox" count={stats.pending} color="text-amber-600" bg="bg-amber-50 dark:bg-amber-900/10" />
          <StatCard label="High Priority" count={stats.highPriority} color="text-rose-600" bg="bg-rose-50 dark:bg-rose-900/10" />
          <StatCard label="Completed" count={stats.completed} color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-900/10" />
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-slate-500 font-bold uppercase text-xs tracking-wider">
            <CheckSquare className="w-4 h-4"/> Assignment List
          </div>

          {isLoading ? (
            <div className="text-center py-20 text-slate-400 animate-pulse">Syncing tasks...</div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <p className="text-slate-500">No active assignments.</p>
            </div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className={`bg-white dark:bg-slate-900 border rounded-xl shadow-sm transition-all hover:shadow-md relative group overflow-hidden
                  ${ticket.priority === 'HIGH' ? 'border-l-4 border-l-rose-500 border-slate-200 dark:border-slate-800' : 'border-slate-200 dark:border-slate-800'}
                `}
              >
                <div className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                    
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">#{ticket.id}</span>
                        <StatusBadge status={ticket.status} />
                        <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto md:ml-0">
                            <Clock className="w-3 h-3" /> {new Date(ticket.createdAt).toLocaleDateString()}
                        </span>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{ticket.title}</h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm mb-3 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            {ticket.description}
                        </p>

                        {/* --- VIEW PROOF BUTTON --- */}
                        {ticket.attachmentUrl && (
                            <div className="mb-4">
                                <a 
                                    href={`${API_BASE_URL}/api/Ticket/${ticket.id}/attachment`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded-lg transition-colors border border-blue-100 dark:border-blue-900"
                                >
                                    <ImageIcon className="w-4 h-4" /> View Attached Proof <ExternalLink className="w-3 h-3 ml-1"/>
                                </a>
                            </div>
                        )}
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                            <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" /> 
                            <span>{ticket.creator.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                            <span>{ticket.creator.contact} <span className="text-xs text-slate-400">({ticket.creator.fullName})</span></span>
                        </div>
                        </div>
                    </div>

                    {/* PRIORITY DROPDOWN */}
                    <div className="absolute top-6 right-6">
                        <select 
                            className={`text-[10px] font-bold uppercase py-1 px-2 rounded border outline-none cursor-pointer bg-white dark:bg-slate-900
                                ${ticket.priority === 'HIGH' ? 'text-rose-700 border-rose-200 dark:text-rose-400 dark:border-rose-800' : 
                                ticket.priority === 'MEDIUM' ? 'text-amber-700 border-amber-200 dark:text-amber-400 dark:border-amber-800' : 
                                'text-blue-700 border-blue-200 dark:text-blue-400 dark:border-blue-800'}`}
                            value={ticket.priority}
                            onChange={(e) => updatePriority(ticket.id, e.target.value)}
                        >
                            <option value="LOW">Low Priority</option>
                            <option value="MEDIUM">Medium Priority</option>
                            <option value="HIGH">High Priority</option>
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row md:flex-col gap-3 justify-center min-w-[140px] border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6">
                        {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' && ticket.status !== 'RE-OPENED' && (
                        <>
                            {ticket.status !== "IN_REVIEW" && (
                                <button onClick={() => updateStatus(ticket.id, "IN_REVIEW")} disabled={processingId === ticket.id} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg font-bold text-xs hover:bg-blue-100 transition-colors">
                                <PlayCircle className="w-4 h-4" /> Start Work
                                </button>
                            )}
                            <button onClick={() => updateStatus(ticket.id, "RESOLVED")} disabled={processingId === ticket.id} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-md shadow-emerald-200 dark:shadow-none transition-colors">
                            {processingId === ticket.id ? <RefreshCw className="w-4 h-4 animate-spin"/> : <CheckCircle className="w-4 h-4" />} Mark Resolved
                            </button>
                        </>
                        )}

                        {ticket.status === 'RE-OPENED' && (
                            <div className="flex flex-col gap-2 animate-in fade-in">
                                <div className="text-xs text-rose-600 font-bold text-center mb-1 flex items-center justify-center gap-1"><AlertCircle className="w-3 h-3"/> Re-opened</div>
                                <button onClick={() => updateStatus(ticket.id, "IN_REVIEW")} className="px-3 py-2 bg-emerald-600 text-white text-xs font-bold rounded hover:bg-emerald-700">Continue Work</button>
                                <button onClick={() => handleEscalate(ticket.id)} className="px-3 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded hover:bg-slate-300">Inform Admin</button>
                            </div>
                        )}
                        
                        {/* Expand History Button */}
                        <button onClick={() => toggleTimeline(ticket.id)} className="mt-auto pt-2 flex items-center justify-center gap-1 text-slate-400 hover:text-indigo-500 transition-colors text-[10px] uppercase font-bold tracking-wider">
                            {expandedTicketId === ticket.id ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>} History
                        </button>
                    </div>
                    </div>
                </div>

                {/* TIMELINE SECTION */}
                {expandedTicketId === ticket.id && (
                    <div className="bg-slate-50 dark:bg-slate-950/30 border-t border-slate-200 dark:border-slate-800 p-6 animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="w-4 h-4 text-slate-400"/>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Activity Audit Log</h4>
                        </div>
                        <ActivityLog ticketId={ticket.id} />
                    </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

const ActivityLog = ({ ticketId }: { ticketId: number }) => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/Ticket/history/${ticketId}`, { credentials: "include" });
                if (res.ok) setLogs(await res.json());
            } catch (e) { console.error(e); } 
            finally { setLoading(false); }
        };
        fetchHistory();
    }, [ticketId]);

    if (loading) return <div className="text-xs text-slate-400 animate-pulse flex items-center gap-2"><RefreshCw className="w-3 h-3 animate-spin"/> Loading history...</div>;
    if (logs.length === 0) return <div className="text-xs text-slate-400">No history available.</div>;

    return (
        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-2 space-y-6 pl-6 py-2">
            {logs.map((log) => (
                <div key={log.id} className="relative group">
                    <div className={`absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 transition-colors 
                        ${log.action.includes("STATUS") ? "bg-emerald-500" : 
                          log.action.includes("PRIORITY") ? "bg-rose-500" : 
                          log.action.includes("ASSIGN") ? "bg-amber-500" : "bg-blue-500"}`}>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                            {formatDate(log.timestamp)}
                        </span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{log.action}</span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">by {log.changedBy}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{log.description}</p>
                </div>
            ))}
        </div>
    );
};

const StatCard = ({ label, count, color, bg }: any) => (
  <div className={`p-4 rounded-xl border border-slate-200 dark:border-slate-800 ${bg} flex flex-col items-center text-center`}>
    <span className={`text-2xl font-black ${color}`}>{count}</span>
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{label}</span>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => (
  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold border border-slate-200 dark:border-slate-700">
    {status.replace("_", " ")}
  </span>
);