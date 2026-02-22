'use client';
import { useState, useEffect } from 'react';
import { User, TrendingUp, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Header from '../components/header';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      }
    };
    fetchUser();
  }, []);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    setProfile(data);
    setAccuracy(data?.verification_level === 1 ? 92 : 45);
  };

  return (
    <div className="min-h-screen p-8 font-mono bg-[#0a0a0a] text-[#00ff41]">
      <div className="max-w-3xl mx-auto">
        <Header user={user} />

        <div className="text-center mb-12">
          <User className="w-24 h-24 mx-auto mb-6 text-[#00ff41]" />
          <h1 className="text-5xl font-bold glow-green">YOUR PROFILE</h1>
        </div>

        {user && profile && (
          <div className="space-y-12">
            <div className="bg-black/50 border border-[#00ff41]/30 p-10 rounded text-center">
              <div className="text-8xl font-bold glow-green mb-2">{profile.reputation}</div>
              <div className="text-2xl">REPUTATION</div>
              <div className="text-sm opacity-60 mt-2">5% monthly decay active</div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-black/50 border border-[#00ff41]/30 p-8 rounded text-center">
                <Shield className="w-12 h-12 mx-auto mb-4" />
                <div className="text-2xl font-bold">
                  {profile.verification_level === 1 ? "🟢 VERIFIED AGENT" : "Human Builder"}
                </div>
              </div>

              <div className="bg-black/50 border border-[#00ff41]/30 p-8 rounded text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                <div className="text-5xl font-bold">{accuracy}%</div>
                <div className="text-xl">PREDICTION ACCURACY</div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl mb-6">Recent Activity</h2>
              <div className="bg-black/50 border border-[#00ff41]/30 p-8 rounded text-left">
                <p className="opacity-70">No signals yet. Start endorsing or challenging on the feed.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}