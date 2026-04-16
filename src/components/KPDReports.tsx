"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileLock2, Download, Eye, Calendar, ShieldCheck, X, AlertCircle } from "lucide-react";


export default function KPDReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acknowledged, setAcknowledged] = useState(false);

  React.useEffect(() => {
    import("@/lib/api").then((m) => {
      m.default.get("/kpd-reports")
        .then((res) => setReports(res.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    });
  }, []);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center">
            <FileLock2 size={16} className="text-gray-500" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">Raporlarım & Envanterler</h2>
            <p className="text-xs text-gray-400">KPD Gizli Veri Modülü — Madde 13.2</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
          <ShieldCheck size={12} /> KVKK Güvenli
        </span>
      </div>

      {/* KVKK Notice */}
      {!acknowledged && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-lg flex gap-3">
          <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-medium text-amber-800 mb-1">Gizlilik Bildirimi</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Bu alandaki raporlar KPD seanslarınıza özeldir. Verileriniz KVKK kapsamında şifrelenmiş 
              ortamda saklanmakta; yalnızca siz görebilirsiniz.
            </p>
            <button
              onClick={() => setAcknowledged(true)}
              className="mt-3 text-xs font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-900 transition-colors"
            >
              Anladım, devam et →
            </button>
          </div>
        </div>
      )}

      {/* Reports List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-6 text-xs text-gray-400 font-medium italic animate-pulse">Raporlar taranıyor...</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-10 text-xs text-gray-300 font-medium italic border border-dashed border-gray-100 rounded-lg">Henüz adınıza kayıtlı rapor bulunmuyor.</div>
        ) : reports.map((report, idx) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06 }}
            className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 hover:bg-gray-50 transition-all group"
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-9 h-9 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-orange-50 group-hover:border-orange-100 transition-colors">
                <FileLock2 size={15} className="text-gray-400 group-hover:text-orange-500 transition-colors" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{report.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={10} /> {new Date(report.created_at).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-4">
              <button 
                onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/admin/kpd-reports/${report.id}/download`, '_blank')}
                className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 border border-transparent hover:border-orange-100 rounded-lg transition-all"
              >
                <Download size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
