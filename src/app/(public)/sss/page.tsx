"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

const faqs = [
  {
    question: "KADEME projelerine nasıl başvurabilirim?",
    answer: "Anasayfada yer alan 'Faaliyetlerimiz' bölümünden ilgili projeyi seçerek detay sayfasındaki başvuru formunu doldurabilirsiniz. Başvurunuz kabul edildiğinde otomatik olarak katılımcı profiline dönüştürüleceksiniz."
  },
  {
    question: "Kredi sistemi nasıl çalışıyor?",
    answer: "Her dönem başında 100 kredi ile başlarsınız. Katılmadığınız her program için sistem otomatik olarak kredi düşümü yapar. Krediniz 75'in altına düştüğünde uyarı SMS'i alırsınız."
  },
  {
    question: "Konum bazlı yoklama nedir?",
    answer: "Yoklama sistemi QR kod ve GPS doğrulaması ile çalışır. Sadece koordinatları belirlenmiş faaliyet alanında (örn: 100m yarıçapı) QR kodu okutarak yoklama verebilirsiniz."
  },
  {
    question: "Mezuniyet şartları nelerdir?",
    answer: "Her projenin kendine has katılım oranı ve kredi eşiği vardır. Genel olarak kredinizin 75 üzerinde olması ve faaliyetlerin %80'ine katılmış olmanız mezuniyet / sertifika için yeterlidir."
  },
  {
    question: "Dijital CV nedir?",
    answer: "Otomatik olarak projelerinizdeki başarılarınızı, aldığınız rozetleri ve sertifikaları KADEME onaylı bir formatta sunan dijital bir profildir. İş başvurularınızda doğrudan referans olarak kullanabilirsiniz."
  }
];

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 bg-white mt-20">
      <div className="text-center mb-16">
        <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <HelpCircle className="text-orange-500" size={28} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Sık Sorulan Sorular</h1>
        <p className="text-gray-500 text-sm md:text-base font-medium">Platform ve projelerimiz hakkında merak ettiğiniz her şey.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} faq={faq} />
        ))}
      </div>

      <div className="mt-20 p-8 md:p-12 rounded-3xl bg-gray-50 border border-gray-100 text-center relative overflow-hidden">
        <div className="relative z-10">
          <MessageCircle className="mx-auto mb-6 text-orange-500" size={40} />
          <h2 className="text-2xl font-bold mb-3 text-gray-900">Başka bir sorunuz mu var?</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm font-medium leading-relaxed">
            Sorunuza burada cevap bulamadıysanız bize iletişim formundan veya destek hattımızdan ulaşabilirsiniz.
          </p>
          <Link href="/iletisim">
            <button className="px-8 py-3 bg-orange-500 text-white font-bold text-sm rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20">
              Bize Ulaşın
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ faq }: any) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-2xl bg-white overflow-hidden hover:border-orange-100 transition-colors">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 md:p-8 flex justify-between items-center text-left"
      >
        <span className="text-base md:text-lg font-bold text-gray-900 pr-4">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-gray-300"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="px-6 md:px-8 pb-8 text-gray-500 text-sm md:text-base leading-relaxed border-t border-gray-50 pt-6">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
