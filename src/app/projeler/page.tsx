"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Users, MapPin } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get("/projects")
      .then((res) => setProjects(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-28 pb-12 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-semibold text-orange-500 uppercase tracking-wider">Tüm Projeler</span>
              <h1 className="text-4xl font-bold text-gray-900 mt-2 tracking-tight">Faaliyet Kataloğu</h1>
            </div>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Proje ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent w-72"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-56 rounded-xl bg-gray-50 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-400 text-sm">Proje bulunamadı.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/projeler/${project.id}`}>
                    <div className="group h-full flex flex-col p-6 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            project.is_active
                              ? "text-green-600 bg-green-50"
                              : "text-gray-500 bg-gray-100"
                          }`}
                        >
                          {project.is_active ? "Aktif" : "Arşiv"}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-6 flex-1">
                        {project.description ||
                          "KADEME bünyesinde yürütülen bu program, katılımcıların profesyonel gelişimine katkı sağlar."}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-3 text-xs text-gray-400 font-bold">
                          <span className="flex items-center gap-1">
                            <Users size={12} /> {project.applications_count || 0} Katılımcı
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={12} /> {project.location || "Konya"}
                          </span>
                        </div>
                        <ArrowRight size={16} className="text-gray-300 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
