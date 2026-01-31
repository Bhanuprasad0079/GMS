"use client";
import React, { useEffect, useState } from "react";
import { Clock, User, CheckCircle, AlertCircle, ArrowUpCircle } from "lucide-react";

interface Log {
    id: number;
    action: string;
    description: string;
    changedBy: string;
    timestamp: string;
}

export default function ActivityLog({ ticketId }: { ticketId: number }) {
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

    if (loading) return <div className="text-xs text-slate-400 animate-pulse">Loading history...</div>;
    if (logs.length === 0) return <div className="text-xs text-slate-400">No history available.</div>;

    return (
        <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {logs.map((log) => (
                <div key={log.id} className="flex gap-3 group">
                    <div className="flex flex-col items-center">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ring-2 ring-white dark:ring-slate-900 
                            ${log.action.includes("STATUS") ? "bg-emerald-500" : 
                              log.action.includes("PRIORITY") ? "bg-rose-500" : "bg-blue-500"}`}>
                        </div>
                        <div className="w-0.5 h-full bg-slate-100 dark:bg-slate-800 group-last:hidden mt-1"></div>
                    </div>
                    <div className="pb-3">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {log.action} <span className="font-normal text-slate-500">• {log.changedBy}</span>
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 bg-slate-50 dark:bg-slate-800/50 p-2 rounded border border-slate-100 dark:border-slate-800 inline-block">
                            {log.description}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {new Date(log.timestamp).toLocaleString()}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}