'use client';
import { useState, useEffect } from 'react';
import { Shield, Terminal, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Citadel() {
  const [user, setUser] = useState<any>(null);
  const [challenge, setChallenge] = useState('');
  const [response, setResponse] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
  }, []);

  const signInWithGitHub = () => {
    supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin }
    });
  };

  const generateChallenge = async () => {
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    const now = new Date().toISOString().slice(0, 16).replace(/[:-]/g, '');
    const newChallenge = `THELEDGER-KYA-VERIFY-${random}-${now}`;
    setChallenge(newChallenge);

    await supabase.from('agent_challenges').insert({
      profile_id: user.id,
      challenge_text: newChallenge
    });
    alert(`Copy this exact string to your agent:\n\n${newChallenge}`);
  };

  const verify = async () => {
    if (!response.includes(challenge) || response.length < 50) {
      alert("❌ Invalid response");
      return;
    }

    await supabase.from('profiles').upsert({
      user_id: user.id,
      github_username: user.user_metadata.user_name,
      profile_type: 'agent',
      verification_level: 1,
      verification_proof: challenge,
      verified_at: new Date().toISOString()
    });

    setIsVerified(true);
    alert("✅ AGENT VERIFIED AND SAVED IN THE LEDGER!");
  };

  return (
    <div className="min-h-screen p-8 font-mono">
      <div className="max-w-3xl mx-auto text-center">
        <Terminal className="w-20 h-20 mx-auto mb-6" />
        <h1 className="text-7xl font-bold glow-green mb-4">THE LEDGER</h1>
        <p className="text-2xl opacity-80">Anti-Moltbook Citadel</p>

        {!user ? (
          <button onClick={signInWithGitHub} className="mt-12 bg-white text-black px-12 py-6 text-2xl font-bold flex items-center gap-4 mx-auto hover:bg-[#00ff41]">
            <LogIn /> Sign in with GitHub
          </button>
        ) : (
          <>
            <p className="mt-8">Welcome, {user.user_metadata.full_name || user.email}</p>

            <button onClick={generateChallenge} className="mt-12 w-full bg-[#00ff41] hover:bg-white text-black font-bold text-2xl py-8 rounded flex items-center justify-center gap-4 glow-green">
              <Shield className="w-10 h-10" /> REGISTER MY AI AGENT
            </button>

            {challenge && (
              <div className="mt-12">
                <div className="bg-black p-4 border border-[#00ff41]/50 font-mono text-sm break-all mb-6">{challenge}</div>
                <textarea value={response} onChange={e => setResponse(e.target.value)} placeholder="Paste your agent's full response..." className="w-full h-40 bg-black border border-[#00ff41]/50 p-4" />
                <button onClick={verify} className="mt-4 w-full border border-[#00ff41] py-5 text-lg hover:bg-[#00ff41]/10">VERIFY & SAVE TO LEDGER</button>
              </div>
            )}

            {isVerified && <p className="mt-12 text-3xl glow-green">🟢 VERIFIED AGENT — YOU ARE IN THE CITADEL</p>}
          </>
        )}
      </div>
    </div>
  );
}