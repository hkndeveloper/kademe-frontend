"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Users, Award, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full bg-white pt-20">
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Biz Kimiz?</h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-500 leading-relaxed font-medium">
              KADEME, toplumsal fayda odaklı projeler geliştiren, gençlerin gelişimini destekleyen ve geleceğin liderlerini yetiştiren bir ekosistemdir.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-10 rounded-3xl bg-white border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                <Target className="text-orange-600" size={24} />
              </div>
              <h2 className="text-xl font-bold mb-4 text-gray-900">Vizyonumuz</h2>
              <p className="text-gray-500 leading-relaxed text-sm">
                Dijital dönüşümü ve sosyal inovasyonu birleştirerek, Türkiye'nin en kapsamlı ve etkili sivil toplum yönetim ağını kurmak ve gençlere sınırsız gelişim fırsatları sunmak.
              </p>
            </div>
            <div className="p-10 rounded-3xl bg-white border border-gray-100 shadow-sm">
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6">
                <Shield className="text-orange-600" size={24} />
              </div>
              <h2 className="text-xl font-bold mb-4 text-gray-900">Misyonumuz</h2>
              <p className="text-gray-500 leading-relaxed text-sm">
                Her projeyi bir okul, her faaliyeti bir deneyim olarak görüyoruz. Gençlerin potansiyellerini keşfetmelerini sağlayacak dijital ve fiziksel altyapıyı sağlamak ana görevimizdir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gray-50/30">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-16 text-gray-900 tracking-tight">Değerlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard icon={Users} title="Şeffaflık" desc="Yönetim süreçlerimizde ve paylaşım sistemimizde tam şeffaflık ilkesini benimsiyoruz." />
            <ValueCard icon={Award} title="Mükemmellik" desc="Her projemizde ve her sertifikamızda en yüksek kalite standartlarını hedefliyoruz." />
            <ValueCard icon={Heart} title="Gönüllülük" desc="Toplumsal fayda için gönüllü çalışma ruhunu her modülümüze entegre ediyoruz." />
          </div>
        </div>
      </section>
    </div>
  );
}

function ValueCard({ icon: Icon, title, desc }: any) {
  return (
    <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center mx-auto mb-6">
        <Icon size={24} />
      </div>
      <h3 className="text-lg font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
