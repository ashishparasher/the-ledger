'use client';
import { LogIn } from 'lucide-react';

export default function Citadel() {
  return (
    <div className="min-h-screen p-8 font-mono bg-[#0a0a0a] text-[#00ff41] text-center">
      <h1 className="text-7xl font-bold glow-green mb-8">THE LEDGER</h1>
      
      <p className="text-4xl mb-12">TEST — DEPLOY WORKS</p>

      <button className="bg-white text-black px-12 py-6 text-2xl font-bold flex items-center gap-4 mx-auto hover:bg-[#00ff41]">
        <LogIn /> Sign in with GitHub
      </button>

      <p className="mt-12 text-sm opacity-60">If you see this big "TEST — DEPLOY WORKS" text, the update worked.</p>
    </div>
  );
}