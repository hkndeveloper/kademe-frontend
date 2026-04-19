"use client";

import React, { useEffect, useState } from "react";
import { GraduationCap, Briefcase, Award, Users, Download, ExternalLink, MapPin } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function AlumniDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [alumniNetwork, setAlumniNetwork] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/user"),
      api.get("/participants/alumni").catch(() => ({ data: { data: [] } })), // in case of auth restriction
      api.get("/student/certificates").catch(() => ({ data: [] }))
    ])
      .then(([resUser, resAlumni, resCerts]) => {
        setProfile(resUser.data.user);
        const fetchedAlumni = Array.isArray(resAlumni.data) ? resAlumni.data : (resAlumni.data?.data || []);
        setAlumniNetwork(fetchedAlumni.slice(0, 5)); // show top 5
        setCertificates(resCerts.data || []);
      })
      .catch((err) => console.error("Mezun verileri alınamadı", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center text-gray-400 text-sm">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header Segment - Refined Corporate */}
        <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-8 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-60"></div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center shrink-0 border border-orange-100">
              <GraduationCap size={32} className="text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Hoş Geldiniz, {profile?.name}</h1>
              <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-widest">KADEME Ailesinin Seçkin Mezunu</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Opportunities */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                    <Briefcase size={16} className="text-orange-500" /> Özel Staj & Kariyer İlanları
                  </h2>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
                  <span className="px-4 py-2 bg-slate-950 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl">Çok Yakında</span>
                </div>
                <div className="space-y-4 opacity-50 select-none">
                  <JobCard 
                    title="Diplomasi Koordinatörü" 
                    company="Diplomasi360"
                    type="Tam Zamanlı"
                    location="Ankara"
                    tags={["Diplomasi360", "Global"]}
                  />
                  <JobCard 
                    title="Proje Asistanı" 
                    company="KADEME Yönetim Merkezi"
                    type="Yarı Zamanlı"
                    location="İstanbul"
                    tags={["KADEME+"]}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm relative">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                <Users size={16} className="text-orange-500" /> Yaklaşan Mezun Buluşmaları
              </h2>
              <div className="absolute inset-x-0 bottom-0 top-14 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-b-2xl">
                 <span className="px-4 py-2 bg-slate-950 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl">Yakında Aktif</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-slate-50 rounded-xl border border-slate-100 gap-4 opacity-50 select-none">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Bahar Kahvaltısı & Networking</h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                    <MapPin size={12} /> Yakında Belli Olacak
                  </p>
                </div>
                <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 transition min-w-[100px] uppercase tracking-wider">
                  Kayıt Ol
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Digital CV for Alumni */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2"><Award size={16} className="text-orange-500" /> Sertifikalarım</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6">
                Sistemde kayıtlı doğrulanabilir <b className="text-orange-600">{certificates.length}</b> adet sertifikanız bulunuyor.
              </p>
              <Link href="/dashboard/student/sertifikalar" className="w-full flex items-center justify-center gap-2 py-3 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all uppercase tracking-wider">
                <Download size={14} /> Görüntüle
              </Link>
            </div>

            <div className="bg-orange-500 rounded-2xl p-8 text-white shadow-lg shadow-orange-500/10 flex flex-col justify-between h-[200px] relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-lg font-bold mb-2">Mentor Olmak İster misiniz?</h3>
                <p className="text-xs text-orange-50 leading-relaxed font-medium">
                  Deneyimlerinizi yeni KADEME katılımcılarıyla paylaşın ve ekosisteme katkıda bulunun.
                </p>
              </div>
              <button className="relative z-10 w-full py-3 bg-white text-orange-600 text-xs font-bold rounded-xl hover:bg-orange-50 transition-all shadow-md active:scale-95 uppercase tracking-widest">
                Başvuruyu Başlat
              </button>
              <Users size={120} className="absolute -bottom-8 -right-8 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
            </div>
            
             <div className="bg-white rounded-2xl border border-slate-200/60 p-8 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6">Sektörel Network</h3>
              <div className="space-y-1">
                {alumniNetwork.length > 0 ? alumniNetwork.map((alumni: any) => (
                  <AlumniContact 
                    key={alumni.id} 
                    name={alumni.user?.name || alumni.name || "İsimsiz Mezun"} 
                    role={alumni.university || "KADEME Mezunu"} 
                    year={alumni.created_at ? new Date(alumni.created_at).getFullYear() + " Mezunu" : "Mezun"} 
                  />
                )) : (
                  <p className="text-xs text-slate-400 font-medium">Şu an aktif bir network bulunamadı.</p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function JobCard({ title, company, type, location, tags }: any) {
  return (
    <div className="p-5 border border-slate-100 rounded-xl hover:bg-slate-50 hover:border-slate-200 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-all">{title}</h3>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">{company}</p>
        </div>
        <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wider border border-blue-100/50">{type}</span>
      </div>
      <div className="flex items-center gap-4 mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        <span className="flex items-center gap-1.5"><MapPin size={12} className="text-orange-500" /> {location}</span>
        <div className="flex items-center gap-1.5">
           {tags?.map((t: string) => (
             <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md border border-slate-200/50">{t}</span>
           ))}
        </div>
        <span className="ml-auto flex items-center gap-1 text-slate-800 group-hover:text-orange-600 transition-all">
          İncele <ExternalLink size={12} />
        </span>
      </div>
    </div>
  );
}

function AlumniContact({ name, role, year }: any) {
  return (
    <div className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all cursor-pointer border border-transparent hover:border-slate-100 group">
      <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-full shrink-0 flex items-center justify-center group-hover:bg-white group-hover:border-orange-200 transition-all">
         <Users size={16} className="text-slate-400 group-hover:text-orange-500 transition-colors" />
      </div>
      <div className="min-w-0">
        <div className="text-xs font-bold text-slate-800 truncate group-hover:text-slate-900">{name}</div>
        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter truncate mt-0.5">{role} • {year}</div>
      </div>
    </div>
  );
}
