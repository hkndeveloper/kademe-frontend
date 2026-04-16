"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import api from "@/lib/api";


export default function DashboardCharts() {
  const [mounted, setMounted] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/admin/visual-analytics");
      setAnalyticsData(res.data);
    } catch (err) {
      console.error("Analitik veriler alinamadi");
    }
  };

  if (!mounted || !analyticsData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="h-[240px] rounded-3xl bg-slate-50 animate-pulse" />
        <div className="h-[240px] rounded-3xl bg-slate-50 animate-pulse" />
      </div>
    );
  }

  // API'den gelen veriyi Recharts formatına dönüştürelim
  const occupancyData = analyticsData.occupancy_rates.map((o: any) => ({
    name: o.project_name.substring(0, 10),
    ratio: o.occupancy_rate
  }));

  // SMS harcamaları (Basit aylık görünüm için son logları baz alabiliriz)
  const smsData = [
    { name: "Toplam", sms: analyticsData.sms_expenses.total_sent },
    { name: "Bu Ay", sms: analyticsData.sms_expenses.monthly_cost / 0.15 } // SMS sayısına geri çevirelim grafik için
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 min-w-0">
      <div className="min-w-0">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 px-1">
          Proje Doluluk Oranlari (%)
        </h3>
        <div className="h-[240px] w-full min-w-0">
          <ResponsiveContainer width="100%" height={240} minWidth={0} minHeight={undefined}>
            <BarChart data={occupancyData} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
              />
              <Tooltip
                cursor={{ fill: "#f8fafc" }}
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)",
                  fontSize: "11px",
                  fontWeight: "bold",
                }}
              />
              <Bar dataKey="ratio" fill="#0f172a" radius={[6, 6, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="min-w-0">
        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 px-1">
          Aylik Iletisim Giderleri
        </h3>
        <div className="h-[240px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={smsData} margin={{ left: 0, right: 8, top: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 700, fill: "#94a3b8" }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)",
                  fontSize: "11px",
                  fontWeight: "bold",
                }}
              />
              <Line
                type="monotone"
                dataKey="sms"
                stroke="#f97316"
                strokeWidth={3}
                dot={{ r: 4, fill: "#0f172a", strokeWidth: 0 }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
