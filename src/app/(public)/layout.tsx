import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-[#fafafa]">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-yellow-400/10 blur-[120px] rounded-full" />
        <div className="absolute top-[30%] left-[20%] w-[800px] h-[800px] bg-orange-300/5 blur-[150px] rounded-full" />
      </div>
      
      <Navbar />
      <main className="min-h-screen pt-20 relative z-10">
        {children}
      </main>
      <Footer />
    </>
  );
}
