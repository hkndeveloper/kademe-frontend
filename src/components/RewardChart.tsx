"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Trophy, Star, Gift } from "lucide-react";

import api from "@/lib/api";

export default function RewardChart({ badgesCount = 0 }: { badgesCount?: number }) {
  const [tiers, setTiers] = React.useState<any[]>([]);
  const userBadges = badgesCount;

  React.useEffect(() => {
    api.get("/badge-tiers").then(res => setTiers(res.data)).catch(() => {});
  }, []);

  const getTierIcon = (name: string) => {
    if (name.includes("Altın")) return Star;
    if (name.includes("Platin")) return Trophy;
    if (name.includes("Elmas")) return Gift;
    return Award;
  };

  const getTierColor = (name: string) => {
    if (name.includes("Altın")) return "text-amber-400 bg-amber-50";
    if (name.includes("Platin")) return "text-blue-400 bg-blue-50";
    if (name.includes("Elmas")) return "text-orange-500 bg-orange-50";
    return "text-gray-400 bg-gray-50";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Ödüllendirme Çizelgesi</h2>
          <p className="text-xs text-gray-400 mt-0.5">KADEME+ Oyunlaştırma Sistemi</p>
        </div>
        <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2.5 py-1 rounded-full">
          {userBadges} rozet
        </span>
      </div>

      <div className="space-y-3">
        {tiers.map((tier, idx) => {
          const isUnlocked = userBadges >= tier.min_badges;
          const TierIcon = getTierIcon(tier.name);
          const colorClass = getTierColor(tier.name);
          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                isUnlocked
                  ? "border-orange-100 bg-orange-50/50"
                  : "border-gray-100 bg-gray-50/50"
              }`}
            >
              <div className={`w-10 h-10 ${colorClass.split(' ')[1]} rounded-lg flex items-center justify-center shrink-0`}>
                <TierIcon size={18} className={colorClass.split(' ')[0]} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${isUnlocked ? "text-gray-900" : "text-gray-400"}`}>
                    {tier.name}
                  </span>
                  {isUnlocked && (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">Kazanıldı</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{tier.reward_description}</p>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-sm font-bold ${isUnlocked ? "text-orange-500" : "text-gray-300"}`}>
                  {tier.min_badges}
                </div>
                <div className="text-xs text-gray-400">rozet</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
