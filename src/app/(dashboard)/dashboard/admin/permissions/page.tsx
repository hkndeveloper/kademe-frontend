"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Plus, 
  Save,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

export default function PermissionsMatrix() {
  const [data, setData] = useState<any>({ roles: [], permissions: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await api.get('/admin/roles-permissions');
      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      toast.error("Yetki verileri alınamadı.");
      // Ensure data is not null to prevent mapping errors
      if (!data) setData({ roles: [], permissions: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const togglePermission = async (role: any, permissionName: string) => {
    const hasPermission = role.permissions.some((p: any) => p.name === permissionName);
    let newPermissions;
    
    if (hasPermission) {
      newPermissions = role.permissions.filter((p: any) => p.name !== permissionName).map((p: any) => p.name);
    } else {
      newPermissions = [...role.permissions.map((p: any) => p.name), permissionName];
    }

    setSaving(role.id);
    try {
      await api.put(`/admin/roles/${role.id}/permissions`, { permissions: newPermissions });
      toast.success(`${role.name} yetkileri güncellendi.`);
      fetchData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Güncellenemedi.");
    } finally {
      setSaving(null);
    }
  };

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <Loader2 className="animate-spin text-slate-400" size={40} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Dinamik Yetki Matrisi</h1>
          <p className="text-slate-500 font-medium text-sm">Sistem rollerinin hangi sayfalara ve işlemlere erişebileceğini buradan yönetin.</p>
        </div>
        <div className="flex items-center gap-4 bg-amber-50 p-4 rounded-2xl border border-amber-100">
           <ShieldAlert className="text-amber-600" size={24} />
           <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest leading-relaxed">
             Dikkat: Yetkilerde yapılan değişiklikler <br /> tüm kullanıcıları anında etkiler.
           </p>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-white">
                <th className="p-8 font-black text-[10px] uppercase tracking-[0.2em] sticky left-0 bg-slate-950 z-20">Yetki / Kabiliyet</th>
                {data.roles.map((role: any) => (
                  <th key={role.id} className="p-8 text-center min-w-[150px]">
                    <div className="flex flex-col items-center gap-2">
                       <Shield size={18} className={role.name === 'super-admin' ? 'text-amber-500' : 'text-slate-400'} />
                       <span className="font-black text-[10px] uppercase tracking-widest">{role.name}</span>
                       {saving === role.id && <Loader2 size={12} className="animate-spin" />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.permissions.map((perm: any) => (
                <tr key={perm.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="p-8 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-10 border-r border-slate-50">
                    <div className="flex flex-col">
                       <span className="font-bold text-slate-900 text-sm">{perm.name}</span>
                       <span className="text-[10px] text-slate-400 font-medium">{getPermissionDesc(perm.name)}</span>
                    </div>
                  </td>
                  {data.roles.map((role: any) => {
                    const hasPerm = role.permissions.some((p: any) => p.name === perm.name);
                    const isSuper = role.name === 'super-admin';
                    
                    return (
                      <td key={role.id} className="p-8 text-center">
                        <button
                          disabled={isSuper || saving !== null}
                          onClick={() => togglePermission(role, perm.name)}
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center mx-auto transition-all ${
                            isSuper 
                              ? 'bg-amber-100 text-amber-600 scale-90' 
                              : hasPerm 
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-110 active:scale-95' 
                                : 'bg-slate-50 text-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isSuper || hasPerm ? <CheckCircle2 size={20} /> : <Unlock size={20} />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-8 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full translate-x-32 -translate-y-32 blur-3xl"></div>
         <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
            <Plus size={32} />
         </div>
         <div className="flex-1 text-center md:text-left">
            <h4 className="text-xl font-bold mb-1">Yeni Yetki Tanımlamak mı İstiyorsunuz?</h4>
            <p className="text-slate-400 text-sm font-medium">Bu liste sistemin temel fonksiyonlarını kapsar. Uygulamanıza yeni bir özellik eklediğinizde backend seeder'ı üzerinden yeni bir yetenek tanımlayabilirsiniz.</p>
         </div>
      </div>
    </div>
  );
}

function getPermissionDesc(name: string) {
  const descs: any = {
    'view-dashboard': 'Admin ana sayfa istatistiklerini görür.',
    'manage-projects': 'Projeleri oluşturur, düzenler ve siler.',
    'manage-participants': 'Öğrenci profillerini yönetir.',
    'manage-blacklist': 'Kullanıcıları kara listeye alır veya çıkarır.',
    'manage-applications': 'Proje başvurularını inceler ve yanıtlar.',
    'write-blog': 'Blog yazıları yazar ve yayınlar.',
    'view-audit-logs': 'Sistem üzerindeki tüm işlem loglarını görür.',
    'manage-announcements': 'Mobil ve portal duyuruları gönderir.',
    'view-calendar': 'Kurumsal takvimi görüntüler.',
    'manage-coordinators': 'Projeye koordinatör atamaları yapar.',
    'manage-gamification': 'Rozet kademelerini ve ödülleri yönetir.',
    'manage-kpd': 'Randevu ve raporlama sistemini yönetir.',
    'manage-settings': 'Logo, vizyon, misyon gibi genel ayarları değiştirir.',
    'manage-permissions': 'Yetki matrisini görür ve değiştirir.',
    'manage-users': 'Tüm kullanıcı listesini ve rollerini yönetir.'
  };
  return descs[name] || 'Sistem yeteneği.';
}
