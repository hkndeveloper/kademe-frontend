"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Users, BookOpen, MapPin, Clock, Download, ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function ProjectDetailPage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch project
    api.get(`/public-projects/${id}`)
      .then((res) => setProject(res.data))
      .catch(() => {});

    // Fetch user context to check applications
    api.get("/user")
      .then((res) => setUser(res.data.user))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const hasApplied = user?.applications?.find((app: any) => app.project_id === Number(id));

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-28">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="h-8 w-48 bg-gray-100 rounded animate-pulse mb-4" />
          <div className="h-4 w-96 bg-gray-100 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white pt-28 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Proje bulunamadı.</p>
          <Link href="/projeler" className="text-sm text-orange-500 hover:underline">← Projelere dön</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-28 pb-12 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <Link href="/projeler" className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-6">
            <ArrowLeft size={14} /> Tüm projeler
          </Link>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-1">
              <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full mb-4 ${
                (project.project?.is_active ?? project.is_active) ? "text-green-600 bg-green-50" : "text-gray-500 bg-gray-100"
              }`}>
                {(project.project?.is_active ?? project.is_active) ? "Aktif Program" : "Arşiv"}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">{project.project?.name || project.name}</h1>
              <p className="text-sm font-bold text-orange-600 mb-2 uppercase tracking-widest">{project.project?.sub_description || project.sub_description}</p>
              <p className="text-base text-gray-500 leading-relaxed max-w-2xl">
                {project.project?.description || project.description || "KADEME bünyesinde yürütülen bu program, katılımcıların profesyonel ve kişisel gelişimine odaklanan modüler bir ekosistemdir."}
              </p>
              <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-400 font-bold">
                <span className="flex items-center gap-1.5"><Users size={15} className="text-orange-500" /> {project.participants?.length || 0} katılımcı</span>
                <span className="flex items-center gap-1.5"><MapPin size={15} className="text-orange-500" /> {project.project?.location || project.location || "Konya / Hibrit"}</span>
                <span className="flex items-center gap-1.5"><Calendar size={15} className="text-orange-500" /> {project.project?.period || project.period || "2024 Bahar Dönemi"}</span>
              </div>
            </div>

            {/* Apply Card */}
            <div className="w-full md:w-80 shrink-0 p-8 bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-900/5">
              <h3 className="text-sm font-bold text-gray-900 mb-1">Başvuru Yap</h3>
              <p className="text-xs text-gray-400 font-medium mb-6">KADEME ekosisteminin bir parçası olun.</p>
              <div className="space-y-4 mb-8">
                <InfoRow icon={Clock} label="Başvuru Bitiş" value={(project.project?.application_deadline || project.application_deadline) ? new Date(project.project?.application_deadline || project.application_deadline).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : "Belirtilmedi"} />
                <InfoRow icon={Users} label="Kontenjan" value={`${project.project?.capacity || project.capacity || 50} Katılımcı`} />
                <InfoRow icon={MapPin} label="Format" value={project.project?.format || project.format || "Hibrit"} />
              </div>
              {hasApplied ? (
                <button disabled className={`w-full py-4 text-white text-[11px] font-bold rounded-xl cursor-not-allowed uppercase tracking-widest ${hasApplied.status === 'accepted' ? 'bg-emerald-500' : hasApplied.status === 'rejected' ? 'bg-red-500' : 'bg-gray-400'}`}>
                  {hasApplied.status === 'accepted' ? 'Programa Kabul Edildiniz' : hasApplied.status === 'rejected' ? 'Başvuru Reddedildi' : 'Başvurunuz Değerlendiriliyor'}
                </button>
              ) : (
                <Link href={`/basvuru?project_id=${project.id}`}>
                  <button className="w-full py-4 bg-orange-500 text-white text-[11px] font-bold rounded-xl hover:bg-orange-600 transition-all uppercase tracking-widest shadow-lg shadow-orange-500/20 active:scale-[0.98]">
                    Şimdi Başvur
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-16">
              {/* About */}
              <div className="prose prose-slate max-w-none">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <BookOpen size={24} className="text-orange-500" /> Proje Hakkında
                </h2>
                <div className="text-base text-gray-600 leading-relaxed space-y-4">
                  <p>{project.description || "Bu program kapsamında katılımcıların stratejik düşünme, liderlik ve dijital yetkinlikleri geliştirilmektedir."}</p>
                  <p>Program sonunda başarılı olan katılımcılara "KADEME Onaylı Dijital Sertifika" verilmektedir.</p>
                </div>
              </div>

              {/* Timeline */}
              {(project.project?.timeline || project.timeline) && (project.project?.timeline || project.timeline).length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Calendar size={24} className="text-orange-500" /> Program Akışı
                  </h2>
                  <div className="space-y-4">
                    {(project.project?.timeline || project.timeline).map((item: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-6 bg-gray-50/50 border border-gray-100 rounded-2xl hover:border-orange-100 hover:bg-white hover:shadow-sm transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-100 font-bold text-xs text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                            {i + 1}
                          </div>
                          <span className="text-sm font-bold text-gray-800">{item.label}</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Participants Summary */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Users size={24} className="text-orange-500" /> Katılımcılar
                </h2>
                
                {project.participants && project.participants.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.participants.map((participant: any, i: number) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:shadow-md hover:border-orange-100 transition-all">
                        <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                           <Users size={20} className="text-gray-300" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-gray-900">{participant.name}</div>
                          <div className="text-[10px] text-gray-500 mt-0.5 tracking-wide uppercase font-bold">
                            {participant.university} {participant.is_alumni ? ' (KADEME Mezunu)' : ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 bg-gray-50 border border-dashed border-gray-200 rounded-[2.5rem] text-center">
                    <p className="text-gray-400 text-sm font-bold">Bu projeye ait katılımcı bilgisi henüz bulunmuyor.</p>
                  </div>
                )}
              </div>
            </div>

              {(project.project?.documents || project.documents) && (project.project?.documents || project.documents).length > 0 && (
                <div className="p-8 bg-white border border-gray-100 rounded-[2rem] shadow-xl shadow-gray-900/5">
                  <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <Download size={14} className="text-orange-500" /> Belgeler & Formlar
                  </h4>
                  <div className="space-y-3">
                    {(project.project?.documents || project.documents).map((doc: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => doc.url && window.open(doc.url, '_blank')}
                        className="w-full text-left p-4 text-[11px] font-bold text-gray-600 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-xl transition-all flex items-center justify-between group"
                      >
                        <span className="truncate pr-4">{doc.title}</span>
                        <Download size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="flex items-center gap-1.5 text-gray-400">
        <Icon size={13} /> {label}
      </span>
      <span className="font-medium text-gray-700">{value}</span>
    </div>
  );
}
