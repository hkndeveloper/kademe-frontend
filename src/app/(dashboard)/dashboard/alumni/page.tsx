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
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header Segment */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-60"></div>
          
          <div className="flex items-center gap-5 relative z-10">
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
              <GraduationCap size={32} className="text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hoş Geldiniz, {profile?.name}</h1>
              <p className="text-sm text-gray-400 mt-1">KADEME Ailesinin Seçkin Mezunu</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Opportunities */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Briefcase size={16} className="text-orange-500" /> Özel Staj & Kariyer İlanları
              </h2>
              <div className="relative">
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl">
                  <span className="px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-xl">ÇOK YAKINDA</span>
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

            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm relative">
              <h2 className="text-sm font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Users size={16} className="text-orange-500" /> Yaklaşan Mezun Buluşmaları
              </h2>
              <div className="absolute inset-x-0 bottom-0 top-14 bg-white/60 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-b-xl">
                 <span className="px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-xl">YAKINDA AKTİF</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 gap-4 opacity-50 select-none">
                <div>
                  <h3 className="text-sm font-medium text-gray-800">Bahar Kahvaltısı & Networking</h3>
                  <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                    <MapPin size={12} /> Yakında Belli Olacak
                  </p>
                </div>
                <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 transition min-w-[100px]">
                  Kayıt Ol
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Digital CV for Alumni */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2"><Award size={16} className="text-orange-500" /> Sertifikalarım</h3>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Sistemde kayıtlı doğrulanabilir <b>{certificates.length}</b> adet sertifikanız bulunuyor.
              </p>
              <Link href="/dashboard/student/sertifikalar" className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                <Download size={13} /> Sertifikalarımı Görüntüle
              </Link>
            </div>

            <div className="bg-orange-500 rounded-xl p-6 text-white shadow-sm flex flex-col justify-between h-[180px]">
              <div>
                <h3 className="text-sm font-bold mb-2">Mentor Olmak İster misiniz?</h3>
                <p className="text-xs text-orange-100 leading-relaxed">
                  Deneyimlerinizi yeni KADEME katılımcılarıyla paylaşın ve ekosisteme katkıda bulunun.
                </p>
              </div>
              <button className="w-full py-2 bg-white text-orange-600 text-xs font-semibold rounded-lg hover:bg-orange-50 transition">
                Başvuruyu Başlat
              </button>
            </div>
            
             <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Sektörel Network (Yakın Dönem Mezunları)</h3>
              <div className="space-y-4">
                {alumniNetwork.length > 0 ? alumniNetwork.map((alumni: any) => (
                  <AlumniContact 
                    key={alumni.id} 
                    name={alumni.user?.name || alumni.name || "İsimsiz Mezun"} 
                    role={alumni.university || "KADEME Mezunu"} 
                    year={alumni.created_at ? new Date(alumni.created_at).getFullYear() + " Mezunu" : "Mezun"} 
                  />
                )) : (
                  <p className="text-xs text-gray-400">Şu an aktif bir network bulunamadı.</p>
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
    <div className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 hover:border-gray-200 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-500 transition-colors">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{company}</p>
        </div>
        <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase tracking-wider">{type}</span>
      </div>
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
        <span className="flex items-center gap-1.5"><MapPin size={12} /> {location}</span>
        <div className="flex items-center gap-1.5">
           {tags?.map((t: string) => (
             <span key={t} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{t}</span>
           ))}
        </div>
        <span className="ml-auto flex items-center gap-1 font-medium text-gray-700 group-hover:text-orange-500 transition-colors">
          İncele <ExternalLink size={12} />
        </span>
      </div>
    </div>
  );
}

function AlumniContact({ name, role, year }: any) {
  return (
    <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-all cursor-pointer border border-transparent hover:border-gray-100">
      <div className="w-8 h-8 bg-gray-100 rounded-full shrink-0 flex items-center justify-center">
         <Users size={14} className="text-gray-400" />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-gray-800 truncate">{name}</div>
        <div className="text-[10px] text-gray-400 truncate">{role} • {year}</div>
      </div>
    </div>
  );
}
