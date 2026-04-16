"use client";

import React, { useEffect, useState, Suspense } from "react";
import {
  ArrowLeft,
  MapPin,
  Save,
  CalendarDays,
  Crosshair,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

type Project = {
  id: number;
  name: string;
};

function ActivityForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project_id");

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    project_id: projectId || "",
    name: "",
    description: "",
    type: "event",
    start_time: "",
    end_time: "",
    latitude: "41.0082",
    longitude: "28.9784",
    radius: 100,
    credit_loss_amount: 10,
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data);
      } catch {
        console.error("Projeler cekilemedi");
      }
    };

    void fetchProjects();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.project_id || !formData.name || !formData.start_time || !formData.end_time) {
      return toast.error("Lutfen zorunlu alanlari doldurun.");
    }

    setLoading(true);
    try {
      await api.post("/activities", formData);
      toast.success("Faaliyet basariyla olusturuldu.");
      router.push("/dashboard/admin/activities");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        toast.error(typeof backendMessage === "string" ? backendMessage : "Faaliyet olusturulurken bir hata olustu.");
      } else {
        toast.error("Faaliyet olusturulurken bir hata olustu.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/dashboard/admin/activities"
        className="inline-flex items-center text-slate-400 hover:text-slate-900 mb-8 transition-colors group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
        Faaliyetlere Don
      </Link>

      <div className="bg-white rounded-[2rem] border border-slate-200 p-10 shadow-sm">
        <div className="flex items-center space-x-4 mb-10">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-sm">
            <CalendarDays size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Yeni Faaliyet Planla</h1>
            <p className="text-slate-500 font-medium">Takvime yeni bir etkinlik ve yoklama alani ekleyin.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 block">Ilgili Proje</label>
              <select
                value={formData.project_id}
                onChange={(e: any) => setFormData({ ...formData, project_id: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium"
              >
                <option value="">Proje Secin</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 block">Faaliyet Adi</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Orn: Hafta 4 Diplomasi Semineri"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 block">Aciklama</label>
              <textarea
                value={formData.description}
                onChange={(e: any) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Faaliyet detaylari, konusmaci ve notlar"
                className="w-full min-h-28 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 block">Tur</label>
              <select
                value={formData.type}
                onChange={(e: any) => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium"
              >
                <option value="event">Etkinlik</option>
                <option value="training">Egitim</option>
                <option value="program">Program</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 block">Kredi Dusumu</label>
              <input
                type="number"
                value={formData.credit_loss_amount}
                onChange={(e: any) => setFormData({ ...formData, credit_loss_amount: parseInt(e.target.value || "0", 10) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 block">Baslangic Zamani</label>
              <input
                type="datetime-local"
                value={formData.start_time}
                onChange={(e: any) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 block">Bitis Zamani</label>
              <input
                type="datetime-local"
                value={formData.end_time}
                onChange={(e: any) => setFormData({ ...formData, end_time: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-medium"
              />
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-slate-50 rounded-[2rem] border border-slate-200">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 block flex items-center">
                  <MapPin size={12} className="mr-1" /> Latitude
                </label>
                <input
                  type="text"
                  value={formData.latitude}
                  onChange={(e: any) => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 block flex items-center">
                  <MapPin size={12} className="mr-1" /> Longitude
                </label>
                <input
                  type="text"
                  value={formData.longitude}
                  onChange={(e: any) => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 block flex items-center">
                  <Crosshair size={12} className="mr-1" /> Yaricap (metre)
                </label>
                <input
                  type="number"
                  value={formData.radius}
                  onChange={(e: any) => setFormData({ ...formData, radius: parseInt(e.target.value || "0", 10) })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl flex items-center justify-center space-x-3 hover:bg-slate-800 transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">KAYDEDILIYOR...</span>
            ) : (
              <>
                <Save size={20} />
                <span>FAALIYETI KAYDET</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function NewActivityPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Yukleniyor...</div>}>
      <ActivityForm />
    </Suspense>
  );
}
