'use client';
import { useState, useEffect } from 'react';
import { Plus, ThumbsUp, ThumbsDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Header from '../components/header';

export default function Feed() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [points, setPoints] = useState(20);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [side, setSide] = useState<'endorse' | 'challenge'>('endorse');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('signal_score', { ascending: false });
    setProjects(data || []);
  };

  const createProject = async () => {
    if (!user) return alert("Please sign in first");
    await supabase.from('projects').insert({
      author_id: user.id,
      title,
      description,
      repo_url: repoUrl,
    });
    setTitle(''); setDescription(''); setRepoUrl('');
    fetchProjects();
    alert("✅ Project posted!");
  };

  const addSignal = async (projectId: string, signalType: 'endorse' | 'challenge') => {
    if (!user) return alert("Please sign in first");
    await supabase.from('trust_signals').insert({
      project_id: projectId,
      signaler_id: user.id,
      type: signalType,
      points
    });
    fetchProjects();
    alert(`✅ ${signalType.toUpperCase()}D with ${points} Trust Points!`);
  };

  return (
    <div className="min-h-screen p-8 font-mono bg-[#0a0a0a] text-[#00ff41]">
      <div className="max-w-4xl mx-auto">
        <Header user={user} />

        <h1 className="text-5xl font-bold glow-green mb-8">THE FEED</h1>

        {/* Create New Project */}
        <div className="bg-black/50 border border-[#00ff41]/30 p-8 rounded mb-12">
          <h2 className="text-2xl mb-6">Post a New Project</h2>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project Title" className="w-full bg-black border border-[#00ff41]/50 p-4 mb-4" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What are you building?" className="w-full bg-black border border-[#00ff41]/50 p-4 mb-4 h-32" />
          <input value={repoUrl} onChange={e => setRepoUrl(e.target.value)} placeholder="GitHub Repo URL" className="w-full bg-black border border-[#00ff41]/50 p-4 mb-6" />
          <button onClick={createProject} className="w-full bg-[#00ff41] text-black py-5 font-bold text-xl hover:bg-white">
            <Plus className="inline w-6 h-6 mr-2" /> POST PROJECT
          </button>
        </div>

        {/* Live Feed */}
        <div className="space-y-8">
          {projects.map(p => (
            <div key={p.id} className="bg-black/50 border border-[#00ff41]/30 p-8 rounded">
              <h3 className="text-2xl font-bold mb-3">{p.title}</h3>
              <p className="opacity-80 mb-6">{p.description}</p>
              {p.repo_url && <a href={p.repo_url} target="_blank" className="text-[#00ff41] underline">View Repo →</a>}

              <div className="mt-8 flex items-center gap-8">
                <div className="text-5xl font-bold glow-green">{p.signal_score || 0}</div>
                <div className="text-sm opacity-70">SIGNAL SCORE</div>

                <div className="flex gap-4 ml-auto">
                  <button onClick={() => { setSelectedProject(p); setSide('endorse'); }} className="border border-[#00ff41] px-8 py-4 hover:bg-[#00ff41]/10 flex items-center gap-3">
                    <ThumbsUp /> Endorse
                  </button>
                  <button onClick={() => { setSelectedProject(p); setSide('challenge'); }} className="border border-red-500 px-8 py-4 hover:bg-red-500/10 flex items-center gap-3">
                    <ThumbsDown /> Challenge
                  </button>
                </div>
              </div>

              {selectedProject?.id === p.id && (
                <div className="mt-6 flex gap-4 items-center">
                  <input type="number" value={points} onChange={e => setPoints(Number(e.target.value))} min="10" max="50" className="bg-black border border-[#00ff41]/50 p-4 w-24 text-center" />
                  <button onClick={() => addSignal(p.id, side)} className="bg-[#00ff41] text-black px-10 py-4 font-bold">
                    CONFIRM {side.toUpperCase()}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}