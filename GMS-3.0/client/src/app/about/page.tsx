"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Target,
  Clock,
  FileText,
  CheckCircle2,
  Mail,
  Users,
  Building2,
  Lock,
  ArrowRight
} from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* --- HEADER SECTION --- */}
      <section className="relative bg-white dark:bg-slate-900 pt-20 pb-16 md:pt-32 md:pb-24 border-b border-slate-200 dark:border-slate-800 overflow-hidden">
         {/* Background Pattern */}
         <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05]" 
             style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(to right, #000 1px, transparent 1px)", backgroundSize: "40px 40px" }}>
         </div>
         
         <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
              <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-500" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                System Overview
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              Transparency, Integrity, <br />
              <span className="text-emerald-600 dark:text-emerald-500">and Action.</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
              The Grievance Management System (GMS) is an institutional initiative designed to bridge the gap between citizens and administration through technology-driven redressal.
            </p>
         </div>
      </section>

      {/* --- MISSION STATEMENT --- */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            
            {/* Left: Text */}
            <div className="animate-in slide-in-from-left duration-700 delay-300">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Our Mandate
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg leading-relaxed">
                We believe that an efficient administration is one that listens. Our platform was architected to eliminate the friction often associated with reporting issues manually.
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8">
                By leveraging modern digital infrastructure, we automate the routing of complaints, ensure strict adherence to Service Level Agreements (SLAs), and provide real-time visibility into the resolution process.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Zero Tolerance for Delays</span>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Data-Driven Accountability</span>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Secure & Confidential</span>
                </div>
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Public-Centric Design</span>
                </div>
              </div>
            </div>

            {/* Right: Visual Card */}
            <div className="relative animate-in slide-in-from-right duration-700 delay-300">
               <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 rounded-2xl rotate-3 transform translate-x-2 translate-y-2"></div>
               <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-lg">
                        <Target className="w-8 h-8 text-emerald-600 dark:text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Strategic Objectives</h3>
                        <p className="text-sm text-slate-500">Annual Goals 2026</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <ObjectiveItem title="Accessibility" desc="Ensure every citizen can file a report under 2 minutes." />
                    <ObjectiveItem title="Velocity" desc="Reduce average resolution time by 40% using auto-assignment." />
                    <ObjectiveItem title="Integrity" desc="Maintain an immutable audit trail of all actions taken." />
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CORE PILLARS --- */}
      <section className="py-20 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Operational Pillars</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">The foundational principles that drive our system.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
             <FeatureCard 
               icon={<FileText className="w-6 h-6 text-slate-700 dark:text-white" />}
               title="Simplified Reporting"
               desc="A streamlined interface designed for rapid grievance logging without bureaucratic hurdles."
             />
             <FeatureCard 
               icon={<Lock className="w-6 h-6 text-slate-700 dark:text-white" />}
               title="Data Security"
               desc="AES-256 encryption ensures that personal identity and grievance details remain protected."
             />
             <FeatureCard 
               icon={<Users className="w-6 h-6 text-slate-700 dark:text-white" />}
               title="Direct Assignment"
               desc="Tickets are intelligently routed to the specialized department worker immediately."
             />
             <FeatureCard 
               icon={<Clock className="w-6 h-6 text-slate-700 dark:text-white" />}
               title="SLA Monitoring"
               desc="Automated escalation protocols ensure that no grievance remains unresolved indefinitely."
             />
          </div>
        </div>
      </section>

      {/* --- CONTACT & SUPPORT --- */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="bg-slate-900 dark:bg-black rounded-2xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 opacity-10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <h2 className="text-3xl font-bold mb-6">Need Administrative Assistance?</h2>
            <p className="text-slate-300 mb-8 max-w-xl mx-auto text-lg">
              For technical issues, system inquiries, or to report a critical failure, please contact our support desk directly.
            </p>
            
            <div className="inline-flex flex-col items-center justify-center p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm mb-8">
                <div className="flex items-center gap-3 text-emerald-400 mb-2">
                    <Mail className="w-6 h-6" />
                    <span className="text-sm font-bold uppercase tracking-widest">Official Support Channel</span>
                </div>
                <a href="mailto:gms.service.mail@gmail.com" className="text-2xl md:text-3xl font-bold text-white hover:text-emerald-400 transition-colors">
                    gms.service.mail@gmail.com
                </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <button className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                  Access Portal <ArrowRight className="w-4 h-4"/>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

// --- SUB-COMPONENTS ---

const FeatureCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md transition-all duration-300 group">
    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-500 transition-colors">{title}</h3>
    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const ObjectiveItem = ({ title, desc }: { title: string, desc: string }) => (
    <div className="flex gap-4">
        <div className="w-1 h-full bg-emerald-500 rounded-full min-h-[40px]"></div>
        <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">{title}</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{desc}</p>
        </div>
    </div>
);

export default AboutPage;
