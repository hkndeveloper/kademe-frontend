"use client";

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null;

  const pages = [];
  for (let i = 1; i <= lastPage; i++) {
    pages.push(i);
  }

  // Sadece mantıklı sayfaları göstermek için (çok sayfa varsa [...] eklenebilir ama şimdilik temel)
  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-3 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-orange-500 hover:border-orange-500 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-100 transition-all shadow-sm"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${
              currentPage === page
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : 'bg-white text-gray-400 border border-gray-100 hover:border-orange-200 hover:text-orange-500 shadow-sm'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="p-3 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-orange-500 hover:border-orange-500 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-gray-100 transition-all shadow-sm"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
