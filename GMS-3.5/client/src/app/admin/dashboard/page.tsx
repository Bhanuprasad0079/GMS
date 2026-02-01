"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, FileText, AlertTriangle, Filter, Save, Trash2, RefreshCw, 
  LogOut, X, UserPlus, Briefcase, Mail, ShieldAlert, MapPin, 
  Lock, KeyRound, Check, ChevronDown, ChevronUp, Clock, Activity, ArrowRightCircle,
  Image as ImageIcon, ExternalLink
} from "lucide-react";
import { getCsrfToken } from "@/utils/csrf"; // <--- 1. IMPORT CSRF UTILITY
import { formatDate } from "@/utils/date";

// --- Interfaces ---
interface Ticket { 
  id: number; 
  title: string; 
  category: string; 
  description: string; 
  priority: string; 
  status: string; 
  createdAt: string; 
  creator: { fullName: string; email: string }; 
  assignedWorkerId: number | null; 
  assignedWorker?: { fullName: string }; 
  attachmentUrl?: string;
}

interface UserData { 
  id: number; 
  fullName: string; 
  email: string; 
  role: string; 
  department?: string; 
  gender: string;
  address: string; 
  createdAt: string; 
  passwordHash?: string; 
}

interface Worker { 
  id: number; 
  fullName: string; 
  department?: string; 
}

interface Log {
    id: number;
    action: string;
    description: string;
    changedBy: string;
    timestamp: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"TICKETS" | "USERS">("TICKETS");
  
  // Data
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter & Edit
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingTicketId, setEditingTicketId] = useState<number | null>(null);
  const [editTicketData, setEditTicketData] = useState({ status: "", priority: "", assignedWorkerId: "" });
  
  // Timeline State
  const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);

  // Modals
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  
  // Forms
  const [newUser, setNewUser] = useState({ 
      fullName: "", email: "", password: "", role: "Worker", 
      department: "", gender: "Male", address: "", state: "Delhi", district: "New Delhi", pincode: "000000" 
  });
  
  const [resetData, setResetData] = useState({ email: "", newPassword: "", fullName: "" });

  const categories = ["Public Utilities", "Sanitation", "Roads & Transport", "Law & Order", "Healthcare", "Other"];

  useEffect(() => {
    const initAdmin = async () => {
      try {
        const meRes = await fetch("http://localhost:5087/api/Auth/me", { credentials: "include" });
        if (!meRes.ok) { router.push("/login/adminloginpage"); return; }

        const user = await meRes.json();
        if (user.role !== "Admin" && user.role !== "SuperAdmin") {
          alert("Access Denied");
          router.push("/login");
          return;
        }
        fetchData();
      } catch (e) { router.push("/login/adminloginpage"); }
    };
    initAdmin();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
        try {
            const ticketRes = await fetch("http://localhost:5087/api/Ticket/all-tickets", { credentials: "include" });
            if (ticketRes.ok) setTickets(await ticketRes.json());
        } catch (e) { console.error("Failed to fetch tickets", e); }

        try {
            const workerRes = await fetch("http://localhost:5087/api/Auth/get-workers", { credentials: "include" });
            if (workerRes.ok) setWorkers(await workerRes.json());
        } catch (e) { console.error("Failed to fetch workers", e); }

        try {
            const userRes = await fetch("http://localhost:5087/api/Auth/all-users", { credentials: "include" });
            if (userRes.ok) setUsers(await userRes.json());
        } catch (e) { console.error("Failed to fetch users", e); }

    } catch (error) { console.error(error); } 
    finally { setIsLoading(false); }
  };

  // --- ACTIONS ---

  const handleForceReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm(`Are you sure you want to reset the password for ${resetData.fullName}?`)) return;

    try {
      const res = await fetch("http://localhost:5087/api/Auth/force-reset-password", {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": getCsrfToken() // <--- ADDED CSRF HEADER
        },
        credentials: "include",
        body: JSON.stringify({ email: resetData.email, newPassword: resetData.newPassword })
      });

      if (res.ok) {
        alert("Password updated successfully.");
        setShowResetModal(false);
        setResetData({ email: "", newPassword: "", fullName: "" });
        fetchData();
      } else {
        alert("Failed to reset password.");
      }
    } catch (error) { alert("Network Error"); }
  };

  const saveTicketEdit = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5087/api/Ticket/${id}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": getCsrfToken() // <--- ADDED CSRF HEADER
        },
        credentials: "include",
        body: JSON.stringify({
          status: editTicketData.status,
          priority: editTicketData.priority,
          assignedWorkerId: editTicketData.assignedWorkerId ? parseInt(editTicketData.assignedWorkerId) : null
        })
      });
      if (res.ok) { setEditingTicketId(null); fetchData(); }
    } catch (error) { alert("Update failed"); }
  };

  const deleteTicket = async (id: number) => {
    if (!confirm("Permanently delete this ticket?")) return;
    await fetch(`http://localhost:5087/api/Ticket/${id}`, { 
        method: "DELETE", 
        headers: { "X-XSRF-TOKEN": getCsrfToken() }, // <--- ADDED CSRF HEADER
        credentials: "include" 
    });
    fetchData();
  };

  const deleteUser = async (email: string) => {
    if (!confirm(`Delete user ${email}?`)) return;
    await fetch(`http://localhost:5087/api/Auth/delete-user/${email}`, { 
        method: "DELETE", 
        headers: { "X-XSRF-TOKEN": getCsrfToken() }, // <--- ADDED CSRF HEADER
        credentials: "include" 
    });
    fetchData();
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = newUser.role === "Citizen" ? "register" : "create-staff";
    const payload = { ...newUser, department: newUser.role === "Worker" ? newUser.department : "" };

    const res = await fetch(`http://localhost:5087/api/Auth/${endpoint}`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": getCsrfToken() // <--- ADDED CSRF HEADER
        },
        credentials: "include",
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        setShowAddUserModal(false);
        fetchData();
        alert("User Created Successfully");
        setNewUser({ fullName: "", email: "", password: "", role: "Worker", department: "", gender: "Male", address: "", state: "Delhi", district: "New Delhi", pincode: "000000" });
    } else {
        const err = await res.json();
        alert("Error: " + (err.message || "Operation failed"));
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:5087/api/Auth/logout", { 
        method: "POST", 
        headers: { "X-XSRF-TOKEN": getCsrfToken() }, // <--- ADDED CSRF HEADER
        credentials: "include" 
    });
    localStorage.removeItem("user_info");
    router.push("/login/adminloginpage");
  };

  const toggleTimeline = (id: number) => {
      setExpandedTicketId(expandedTicketId === id ? null : id);
  };

  const filteredTickets = tickets.filter(t => statusFilter === "ALL" ? true : t.status === statusFilter);

  // ... (REST OF THE RENDER CODE IS IDENTICAL) ...
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100">
      
      {/* Top Navigation */}
      <nav className="bg-slate-900 text-white px-4 md:px-6 py-4 sticky top-0 z-30 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-700">
        <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="bg-rose-600 p-2.5 rounded-xl shadow-lg shadow-rose-900/50">
                <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="font-black text-xl tracking-wide leading-none">ADMIN<span className="text-slate-400 font-light">CONSOLE</span></h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] mt-1">System Oversight</p>
            </div>
        </div>
        <div className="flex items-center gap-6 w-full md:w-auto justify-end">
            <button onClick={fetchData} className="p-2 hover:bg-slate-800 rounded-full transition-colors group" title="Refresh Data">
                <RefreshCw className="w-5 h-5 text-slate-400 group-hover:text-white group-active:rotate-180 transition-all"/>
            </button>
            <div className="h-8 w-px bg-slate-700 hidden md:block"></div>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-rose-400 hover:text-rose-300 transition-colors bg-rose-950/30 px-4 py-2 rounded-lg hover:bg-rose-900/50">
                <LogOut className="w-4 h-4"/> Logout
            </button>
        </div>
      </nav>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            <StatCard label="Total Users" value={users.length} icon={<Users className="text-blue-500"/>} trend="+12% this week" />
            <StatCard label="Pending Tickets" value={tickets.filter(t => t.status === 'OPEN').length} icon={<AlertTriangle className="text-amber-500"/>} trend="Requires Attention" />
            <StatCard label="Field Staff" value={users.filter(u => u.role === 'Worker').length} icon={<Briefcase className="text-emerald-500"/>} trend="Active Personnel" />
            <StatCard label="Resolved Cases" value={tickets.filter(t => t.status === 'RESOLVED').length} icon={<FileText className="text-indigo-500"/>} trend="High Completion" />
        </div>

        {/* Main Interface */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden min-h-[700px] flex flex-col">
            
            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-10">
                <div className="flex gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl w-full md:w-auto">
                    <TabButton active={activeTab === "TICKETS"} onClick={() => setActiveTab("TICKETS")} label="Grievance Tickets" icon={<FileText className="w-4 h-4"/>} />
                    <TabButton active={activeTab === "USERS"} onClick={() => setActiveTab("USERS")} label="User Database" icon={<Users className="w-4 h-4"/>} />
                </div>

                {activeTab === "TICKETS" && (
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full">
                            <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                            <select 
                                className="w-full md:w-auto bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm rounded-lg pl-9 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500 font-medium appearance-none" 
                                value={statusFilter} 
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="ALL">All Status</option>
                                <option value="OPEN">Open</option>
                                <option value="ASSIGNED">Assigned</option>
                                <option value="RESOLVED">Resolved</option>
                            </select>
                        </div>
                    </div>
                )}
                
                {activeTab === "USERS" && (
                    <button onClick={() => setShowAddUserModal(true)} className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/30 transition-all hover:-translate-y-0.5">
                        <UserPlus className="w-4 h-4"/> Create New User
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-x-auto bg-slate-50/50 dark:bg-slate-950/50">
                {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                        <RefreshCw className="w-8 h-8 animate-spin text-indigo-500"/>
                        <p className="text-sm font-medium">Synchronizing Database...</p>
                    </div>
                ) : activeTab === "TICKETS" ? (
                    /* --- TICKET TABLE --- */
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0">
                            <tr>
                                <th className="px-6 py-4 font-bold">Ticket Details</th>
                                <th className="px-6 py-4 font-bold">Priority</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold">Assignment</th>
                                <th className="px-6 py-4 text-right font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {filteredTickets.map(t => (
                                <React.Fragment key={t.id}>
                                    <tr className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group ${expandedTicketId === t.id ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : 'bg-white dark:bg-slate-900'}`}>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900 dark:text-white text-base">{t.title}</div>
                                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                                                <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono">#{t.id}</span>
                                                <span className="font-medium text-indigo-600 dark:text-indigo-400">{t.category}</span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="flex items-center gap-1"><Mail className="w-3 h-3"/> {t.creator.email}</span>
                                            </div>
                                            {/* --- IMAGE PROOF LINK --- */}
                                            {t.attachmentUrl && (
                                                <a 
                                                    href={`http://localhost:5087/api/Ticket/${t.id}/attachment`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded w-fit"
                                                >
                                                    <ImageIcon className="w-3 h-3" /> View Proof <ExternalLink className="w-3 h-3"/>
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingTicketId === t.id ? (
                                                <select className="border border-slate-300 dark:border-slate-700 rounded p-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value={editTicketData.priority} onChange={e => setEditTicketData({...editTicketData, priority: e.target.value})}><option>LOW</option><option>MEDIUM</option><option>HIGH</option></select>
                                            ) : <PriorityBadge priority={t.priority} />}
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingTicketId === t.id ? (
                                                <select className="border border-slate-300 dark:border-slate-700 rounded p-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" value={editTicketData.status} onChange={e => setEditTicketData({...editTicketData, status: e.target.value})}><option>OPEN</option><option>ASSIGNED</option><option>RESOLVED</option><option>CLOSED</option></select>
                                            ) : <span className="font-bold text-xs">{t.status}</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingTicketId === t.id ? (
                                                <select className="border border-slate-300 dark:border-slate-700 rounded p-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-white max-w-[150px]" value={editTicketData.assignedWorkerId} onChange={e => setEditTicketData({...editTicketData, assignedWorkerId: e.target.value})}><option value="">Unassigned</option>{workers.map(w => <option key={w.id} value={w.id}>{w.fullName}</option>)}</select>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${t.assignedWorkerId ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                                    <span className="text-xs text-slate-600 dark:text-slate-400">{t.assignedWorker?.fullName || "Unassigned"}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 items-center">
                                                <button onClick={() => toggleTimeline(t.id)} className="p-1.5 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors" title="View Timeline">
                                                    {expandedTicketId === t.id ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
                                                </button>
                                                {editingTicketId === t.id ? (
                                                    <><button onClick={() => saveTicketEdit(t.id)} className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded"><Save className="w-4 h-4"/></button><button onClick={() => setEditingTicketId(null)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded"><X className="w-4 h-4"/></button></>
                                                ) : (
                                                    <>
                                                        <button onClick={() => { setEditingTicketId(t.id); setEditTicketData({ status: t.status, priority: t.priority, assignedWorkerId: t.assignedWorkerId?.toString() || "" }) }} className="text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:underline px-2 py-1">Edit</button>
                                                        <button onClick={() => deleteTicket(t.id)} className="text-rose-400 hover:text-rose-600 p-1"><Trash2 className="w-4 h-4"/></button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                    {/* TIMELINE EXPANDABLE ROW */}
                                    {expandedTicketId === t.id && (
                                        <tr>
                                            <td colSpan={5} className="bg-slate-50 dark:bg-slate-950/30 p-0 border-b border-slate-200 dark:border-slate-800">
                                                <div className="p-6">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <Activity className="w-4 h-4 text-slate-400"/>
                                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Activity Timeline</h4>
                                                    </div>
                                                    <ActivityLog ticketId={t.id} />
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    /* --- USER TABLE --- */
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 shadow-sm z-10">
                            <tr>
                                <th className="px-6 py-4 font-bold">Identity</th>
                                <th className="px-6 py-4 font-bold">Role & Dept</th>
                                <th className="px-6 py-4 font-bold">Security (Hash)</th>
                                <th className="px-6 py-4 font-bold">Location</th>
                                <th className="px-6 py-4 text-right font-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {users.map(u => (
                                <tr key={u.id} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md
                                                ${u.role === 'Admin' ? 'bg-gradient-to-br from-rose-500 to-red-600' : 
                                                  u.role === 'Worker' ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 
                                                  'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
                                                {u.fullName.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 dark:text-white">{u.fullName}</div>
                                                <div className="text-xs text-slate-500 font-mono">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-start gap-2">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border tracking-wide uppercase shadow-sm
                                                ${u.role === 'Admin' ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20' : 
                                                  u.role === 'Worker' ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20' : 
                                                  'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20'}`}>
                                                {u.role}
                                            </span>
                                            {u.role === 'Worker' && (
                                                <span className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                    <Briefcase className="w-3 h-3"/> {u.department || "General"}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="text-[10px] text-slate-400 font-mono truncate max-w-[100px] bg-slate-50 dark:bg-slate-950 p-1.5 rounded border border-slate-200 dark:border-slate-800">
                                                {u.passwordHash ? u.passwordHash.substring(0, 10) + "..." : "N/A"}
                                            </div>
                                            <button 
                                                onClick={() => { setResetData({ email: u.email, fullName: u.fullName, newPassword: "" }); setShowResetModal(true); }}
                                                className="flex items-center gap-1 px-2 py-1.5 rounded bg-orange-50 hover:bg-orange-100 text-orange-600 text-[10px] font-bold border border-orange-200 transition-colors"
                                                title="Force Password Reset"
                                            >
                                                <KeyRound className="w-3 h-3"/> Reset
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-400">
                                        <div className="flex items-center gap-2"><MapPin className="w-3 h-3"/> {u.address}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => deleteUser(u.email)} className="text-slate-400 hover:text-rose-500 p-2 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>

        {/* --- MODALS --- */}

        {/* 1. ADD USER MODAL */}
        {showAddUserModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 animate-in zoom-in-95">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg dark:text-white">Create New User</h3>
                        <button onClick={() => setShowAddUserModal(false)}><X className="text-slate-400 hover:text-slate-600"/></button>
                    </div>
                    <form onSubmit={handleAddUser} className="space-y-4">
                        <select className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}><option value="Worker">Worker</option><option value="Admin">Admin</option><option value="Citizen">Citizen</option></select>
                        {newUser.role === "Worker" && (
                            <select className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" value={newUser.department} onChange={e => setNewUser({...newUser, department: e.target.value})}><option value="">-- Department --</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select>
                        )}
                        <input className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Name" value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})}/>
                        <input className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})}/>
                        <input className="w-full p-3 border border-slate-300 dark:border-slate-700 rounded-lg text-sm bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" type="password" placeholder="Password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})}/>
                        <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg mt-2 shadow-lg">Create User</button>
                    </form>
                </div>
            </div>
        )}

        {/* 2. RESET PASSWORD MODAL */}
        {showResetModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-orange-200 dark:border-orange-900 p-6 animate-in zoom-in-95">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2 text-orange-600 font-bold">
                            <KeyRound className="w-5 h-5"/> Reset Password
                        </div>
                        <button onClick={() => setShowResetModal(false)}><X className="text-slate-400 hover:text-slate-600"/></button>
                    </div>
                    <p className="text-sm text-slate-500 mb-4">Set a new temporary password for <strong>{resetData.fullName}</strong>.</p>
                    
                    <form onSubmit={handleForceReset}>
                        <div className="relative mb-4">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400"/>
                            <input 
                                type="text" 
                                required
                                minLength={6}
                                className="w-full pl-10 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 dark:text-white" 
                                placeholder="New Password (e.g. Temp@123)" 
                                value={resetData.newPassword} 
                                onChange={e => setResetData({...resetData, newPassword: e.target.value})}
                            />
                        </div>
                        <button type="submit" className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-orange-500/20">
                            Update Password
                        </button>
                    </form>
                </div>
            </div>
        )}

      </main>
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
                const res = await fetch(`http://localhost:5087/api/Ticket/history/${ticketId}`, { credentials: "include" });
                if (res.ok) setLogs(await res.json());
            } catch (e) { console.error(e); } 
            finally { setLoading(false); }
        };
        fetchHistory();
    }, [ticketId]);

    if (loading) return <div className="text-xs text-slate-400 animate-pulse flex items-center gap-2"><RefreshCw className="w-3 h-3 animate-spin"/> Loading history...</div>;
    if (logs.length === 0) return <div className="text-xs text-slate-400">No history available for this ticket.</div>;

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
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {log.action}
                        </span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                            by {log.changedBy}
                        </span>
                    </div>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                        {log.description}
                    </p>
                </div>
            ))}
        </div>
    );
};

const TabButton = ({ active, onClick, label, icon }: any) => (
    <button onClick={onClick} className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${active ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md transform md:scale-105" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"}`}>
        {icon} <span className="hidden sm:inline">{label}</span>
    </button>
);

const StatCard = ({ label, value, icon, trend }: any) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{value}</p>
                <p className="text-[10px] font-medium text-emerald-600 mt-2 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full w-fit">{trend}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">{icon}</div>
        </div>
    </div>
);

const PriorityBadge = ({ priority }: { priority: string }) => {
    const colors = { HIGH: "bg-rose-100 text-rose-700 border-rose-200", MEDIUM: "bg-amber-100 text-amber-700 border-amber-200", LOW: "bg-blue-100 text-blue-700 border-blue-200" };
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${colors[priority as keyof typeof colors]}`}>{priority}</span>;
};