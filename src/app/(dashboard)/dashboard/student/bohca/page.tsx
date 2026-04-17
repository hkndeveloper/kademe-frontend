"use client";

import React, { useEffect, useState } from 'react';
import { 
  File, 
  PlaySquare as Youtube, 
  Download, 
  ExternalLink, 
  Search, 
  Filter,
  Package,
  Clock,
  Layout
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

export default function DigitalBundlePage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBundle = async () => {
      try {
        const res = await api.get('/student/bundle');
        setMaterials(res.data);
      } catch (err) {
        console.error('Bohça verileri çekilemedi:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBundle();
  }, []);

  const filteredMaterials = materials.filter((m: any) => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) || 
                          m.project?.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'file' && m.file_path) || 
                         (filter === 'link' && m.external_link);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Dijital Bohça</h1>
          <p className="text-slate-500 mt-2 font-medium">Katıldığınız projelerden size kalan tüm eğitim materyalleri ve kaynaklar.</p>
        </div>
        
          <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="İçerik ara..." 
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-yellow-500/20"
            />
          </div>
          <select 
            value={filter}
            onChange={(e: any) => setFilter(e.target.value)}
            className="px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none"
          >
            <option value="all">Tümü</option>
            <option value="file">Dosyalar</option>
            <option value="link">Linkler</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 shimmer rounded-[2.5rem]"></div>)}
        </div>
      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((mat: any) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={mat.id}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group border-b-4 border-b-transparent hover:border-b-yellow-500"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${mat.external_link ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                   {mat.external_link ? <Youtube size={28} /> : <File size={28} />}
                </div>
                <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 px-3 py-1 rounded-full uppercase">
                  {mat.project?.name}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2">{mat.title}</h3>
              <p className="text-sm text-slate-500 mb-6 line-clamp-2">{mat.description || 'Açıklama belirtilmemiş.'}</p>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                <div className="flex items-center text-xs text-slate-400">
                  <Clock size={14} className="mr-1" />
                  {new Date(mat.created_at).toLocaleDateString()}
                </div>
                {mat.external_link ? (
                  <a 
                    href={mat.external_link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center space-x-2 text-yellow-600 font-bold text-sm hover:underline"
                  >
                    <span>İzle / Git</span>
                    <ExternalLink size={16} />
                  </a>
                ) : (
                   <a 
                    href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/materials/${mat.id}/download`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center space-x-2 text-yellow-600 font-bold text-sm hover:underline"
                  >
                    <span>İndir</span>
                    <Download size={16} />
                  </a>
                )}
              </div>
            </motion.div>
          ))}

          {filteredMaterials.length === 0 && (
            <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
              <Package size={64} className="text-slate-200 mb-4" />
              <p className="text-slate-400 font-medium text-lg">Bohçanızda henüz bir şey yok.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
