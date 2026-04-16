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
    api.get(`/projects/${id}`)
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
                project.status === "active" ? "text-green-600 bg-green-50" : "text-gray-500 bg-gray-100"
              }`}>
                {project.status === "active" ? "Aktif Program" : "Arşiv"}
              </span>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">{project.name}</h1>
              <p className="text-base text-gray-500 leading-relaxed max-w-2xl">
                {project.description || "KADEME bünyesinde yürütülen bu program, katılımcıların profesyonel ve kişisel gelişimine odaklanan modüler bir ekosistemdir."}
              </p>
              <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-400">
                <span className="flex items-center gap-1.5"><Users size={15} /> 50 katılımcı</span>
                <span className="flex items-center gap-1.5"><MapPin size={15} /> Konya / Hibrit</span>
                <span className="flex items-center gap-1.5"><Calendar size={15} /> 2024 Bahar Dönemi</span>
              </div>
            </div>

            {/* Apply Card */}
            <div className="w-full md:w-80 shrink-0 p-6 bg-gray-50 border border-gray-100 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Başvuru Yap</h3>
              <p className="text-xs text-gray-500 mb-5">KADEME ekosisteminin bir parçası olun.</p>
              <div className="space-y-3 mb-5">
                <InfoRow icon={Clock} label="Başvuru Bitiş" value="25 Mart 2026" />
                <InfoRow icon={Users} label="Kontenjan" value="50 Katılımcı" />
                <InfoRow icon={MapPin} label="Format" value="Hibrit" />
              </div>
              {hasApplied ? (
                <button disabled className={`w-full py-2.5 text-white text-sm font-semibold rounded-lg cursor-not-allowed ${hasApplied.status === 'accepted' ? 'bg-green-500' : hasApplied.status === 'rejected' ? 'bg-red-500' : 'bg-gray-400'}`}>
                  {hasApplied.status === 'accepted' ? 'Programa Kabul Edildiniz' : hasApplied.status === 'rejected' ? 'Başvuru Reddedildi' : 'Başvurunuz Değerlendiriliyor'}
                </button>
              ) : (
                <Link href={`/basvuru?project_id=${project.id}`}>
                  <button className="w-full py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors">
                    Şimdi Başvur
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* About */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen size={18} className="text-orange-500" /> Proje Hakkında
                </h2>
                <div className="text-sm text-gray-600 leading-relaxed space-y-3">
                  <p>Bu program kapsamında katılımcıların stratejik düşünme, liderlik ve dijital yetkinlikleri geliştirilmektedir. {project.name} ekosistemi, teorik bilgileri pratiğe dökülen bir network platformudur.</p>
                  <p>Program sonunda başarılı olan katılımcılara "KADEME Onaylı Dijital Sertifika" verilmektedir.</p>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-orange-500" /> Program Akışı
                </h2>
                <div className="space-y-3">
                  {[
                    { label: "Açılış ve Tanışma Lansmanı", date: "Mart 2026" },
                    { label: "Modüler Eğitim Serisi I", date: "Nisan 2026" },
                    { label: "Alan Uygulamaları ve Atölye", date: "Mayıs 2026" },
                    { label: "Sertifika ve Mezuniyet Töreni", date: "Haziran 2026" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-lg hover:border-orange-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-orange-50 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-orange-500">{i + 1}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-800">{item.label}</span>
                      </div>
                      <span className="text-xs text-gray-400">{item.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Participants */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users size={18} className="text-orange-500" /> Katılımcılar
                </h2>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="text-center">
                      <div className="w-14 h-14 bg-gray-100 rounded-xl mx-auto mb-2 hover:bg-orange-50 transition-colors" />
                      <p className="text-xs font-medium text-gray-700">Katılımcı {i}</p>
                      <p className="text-xs text-gray-400">Mühendislik</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="p-5 border border-dashed border-gray-200 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                  <Download size={15} /> Belgeler
                </h4>
                <div className="space-y-2">
                  {["Proje Tanıtım Dosyası.pdf", "Yönetmelik ve Şartlar.pdf"].map((doc) => (
                    <button
                      key={doc}
                      className="w-full text-left px-3 py-2.5 text-xs text-gray-600 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                    >
                      {doc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
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
