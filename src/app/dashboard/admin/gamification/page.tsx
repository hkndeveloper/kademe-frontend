"use client";

import React, { useEffect, useState } from "react";
import { 
  Trophy, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X,
  Award,
  Star,
  Gift,
  Search
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function GamificationPage() {
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchTiers = async () => {
    try {
      const res = await api.get("/badge-tiers");
      setTiers(res.data);
    } catch (err) {
      toast.error("Seviyeler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTiers();
  }, []);

  const handleEdit = (tier: any) => {
    setEditingId(tier.id);
    setEditForm(tier);
  };

  const handleSave = async () => {
    try {
      await api.put(`/admin/badge-tiers/${editingId}`, editForm);
      toast.success("Seviye güncellendi.");
      setEditingId(null);
      fetchTiers();
    } catch (err) {
      toast.error("Güncelleme başarısız.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu seviyeyi silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/admin/badge-tiers/${id}`);
      toast.success("Seviye silindi.");
      fetchTiers();
    } catch (err) {
      toast.error("Silme işlemi başarısız.");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget as HTMLFormElement).entries());
    
    try {
      await api.post("/admin/badge-tiers", data);
      toast.success("Yeni seviye eklendi.");
      setShowAddForm(false);
      fetchTiers();
    } catch (err) {
      toast.error("Ekleme başarısız.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Oyunlaştırma Yönetimi</h1>
          <p className="text-sm text-gray-500 font-medium">Rozet eşiklerini, unvanları ve ödülleri yönetin.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
        >
          <Plus size={18} /> Yeni Seviye Ekle
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xl shadow-orange-500/5 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Seviye Detayları</h3>
            <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
          </div>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input label="Seviye Adı" name="name" placeholder="Örn: Altın Seviye" required />
            <Input label="Eşik (Rozet Sayısı)" name="min_badges" type="number" placeholder="Örn: 10" required />
            <Input label="Kazanılan Unvan" name="title" placeholder="Örn: Altın Lider" />
            <Input label="Çerçeve Rengi (Hex)" name="frame_color" placeholder="#fbbf24" defaultValue="#94a3b8" />
            <div className="md:col-span-2">
              <Input label="Ödül Açıklaması" name="reward_description" placeholder="Örn: KADEME Kupa Seti" />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all">Kaydet ve Yayınla</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-medium italic">Seviyeler yükleniyor...</div>
        ) : tiers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400">
            <Trophy size={48} className="mx-auto mb-4 opacity-10" />
            <p>Henüz tanımlanmış bir seviye bulunmuyor.</p>
          </div>
        ) : (
          tiers.map((tier) => (
            <div key={tier.id} className="bg-white border border-gray-100 rounded-2xl p-6 transition-all hover:border-orange-100 group">
              {editingId === tier.id ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Input label="Ad" value={editForm.name} onChange={(v: any) => setEditForm({...editForm, name: v})} />
                  <Input label="Eşik" type="number" value={editForm.min_badges} onChange={(v: any) => setEditForm({...editForm, min_badges: v})} />
                  <Input label="Unvan" value={editForm.title} onChange={(v: any) => setEditForm({...editForm, title: v})} />
                  <Input label="Renk" value={editForm.frame_color} onChange={(v: any) => setEditForm({...editForm, frame_color: v})} />
                  <div className="md:col-span-3">
                    <Input label="Ödül" value={editForm.reward_description} onChange={(v: any) => setEditForm({...editForm, reward_description: v})} />
                  </div>
                  <div className="flex items-end gap-2">
                    <button onClick={handleSave} className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-green-600"><Save size={14} /> Kaydet</button>
                    <button onClick={() => setEditingId(null)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold text-xs hover:bg-gray-200">İptal</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4 flex-1">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-dashed"
                      style={{ borderColor: tier.frame_color, backgroundColor: `${tier.frame_color}11` }}
                    >
                      <Trophy size={20} style={{ color: tier.frame_color }} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        {tier.name}
                        <span className="text-[10px] font-black bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">{tier.min_badges} Rozet</span>
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">{tier.title}</span>
                        <span className="text-xs text-gray-400 font-medium">| {tier.reward_description}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all shadow-sm">
                    <button 
                      onClick={() => handleEdit(tier)}
                      className="p-2.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(tier.id)}
                      className="p-2.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
      <input 
        {...props}
        className="w-full bg-gray-50 border-none rounded-xl p-3.5 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-orange-500/10 transition-all"
        onChange={(e) => props.onChange?.(e.target.value)}
      />
    </div>
  );
}
