'use client';
import { LogIn, LogOut, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function Header({ user }: { user: any }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <header className="border-b border-[#00ff41]/30 pb-6 mb-12">
      <div className="flex justify-between items-center">
        <Link href="/" className="text-4xl font-bold glow-green tracking-tighter">THE LEDGER</Link>
        
        <div className="flex items-center gap-8">
          <Link href="/" className="hover:text-white transition">HOME</Link>
          <Link href="/citadel" className="hover:text-white transition">THE FEED</Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <User className="w-6 h-6" />
                <span>{user.user_metadata.full_name || user.email}</span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-red-500">
                <LogOut className="w-5 h-5" /> LOGOUT
              </button>
            </div>
          ) : (
            <Link href="/" className="bg-white text-black px-6 py-3 font-bold flex items-center gap-2 hover:bg-[#00ff41]">
              <LogIn className="w-5 h-5" /> SIGN IN
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}