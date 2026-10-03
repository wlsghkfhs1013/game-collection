import React, { useState } from 'react';
import { X, Play, Code2, Sparkles, Upload, FileText, CheckCircle2, Gamepad2, Info, ShieldCheck, Trash2 } from 'lucide-react';
import { Game, GameCategory, UserProfile } from '../types';

interface GameSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitGame: (game: Game) => void;
  profile?: UserProfile;
}

export const GameSubmitModal: React.FC<GameSubmitModalProps> = ({
  isOpen,
  onClose,
  onSubmitGame,
  profile
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'code' | 'preview'>('details');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState(profile?.gamerTag || '');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('Use Arrow Keys to move, Space to interact.');
  const [category, setCategory] = useState<GameCategory>('Arcade');
  const [tagsInput, setTagsInput] = useState('Arcade, Indie, Fun');
  const [code, setCode] = useState('');
  const [thumbnailGradient, setThumbnailGradient] = useState('from-indigo-600 via-purple-700 to-slate-900');
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setCode(content);
        if (!title) setTitle(file.name.replace(/\.[^/.]+$/, ''));
        setActiveTab('code');
      }
    };
    reader.readAsText(file);
  };

  const applyTemplate = (tmplKey: string) => {
    if (tmplKey === 'clicker') {
      setCode(CLICKER_TEMPLATE);
      setTitle(title || 'Cyber Clicker Quest');
      setCategory('Casual');
    } else if (tmplKey === 'reaction') {
      setCode(REACTION_TEMPLATE);
      setTitle(title || 'Neon Reflex Lab');
      setCategory('Puzzle');
    } else if (tmplKey === 'flappy') {
      setCode(FLAPPY_TEMPLATE);
      setTitle(title || 'Vector Hopper');
      setCategory('Action');
    } else {
      setCode('');
    }
    setActiveTab('code');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !code.trim()) {
      setErrorMsg('Please fill in Title, Author Name, and Game Code.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newGame: Game = {
      id: 'game-' + Date.now(),
      title: title.trim(),
      author: author.trim(),
      description: description.trim() || 'A community-made indie game.',
      instructions: instructions.trim() || 'Follow the on-screen game instructions.',
      category,
      tags: tags.length > 0 ? tags : ['Indie', category],
      rating: 5.0,
      ratingsCount: 1,
      ratingDistribution: { 5: 1, 4: 0, 3: 0, 2: 0, 1: 0 },
      playCount: 1,
      code: code.trim(),
      thumbnailGradient,
      iconName: 'Gamepad2',
      createdAt: new Date().toISOString().split('T')[0],
      isUserSubmitted: true
    };

    onSubmitGame(newGame);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  const gradients = [
    'from-indigo-600 via-purple-700 to-slate-900',
    'from-pink-600 via-rose-700 to-slate-900',
    'from-cyan-600 via-blue-700 to-indigo-950',
    'from-emerald-600 via-teal-700 to-slate-950',
    'from-amber-600 via-yellow-700 to-slate-900',
    'from-fuchsia-600 via-violet-800 to-slate-950'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Publish a Game to the Community</h2>
              <p className="text-xs text-slate-500">Anyone can add HTML5 / JS games to the arcade hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50/50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'details'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            1. Game Information
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'code'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            2. Game Code & Templates
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'preview'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Play className="w-4 h-4" />
            3. Test Play Sandbox
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[72vh] overflow-y-auto text-xs">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
              <span>{errorMsg}</span>
              <button type="button" onClick={() => setErrorMsg('')} className="text-rose-500 hover:text-rose-850">✕</button>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="space-y-4">
              {profile?.isGoogleLinked && (
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-indigo-900">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span className="font-semibold">Publishing with Google Verified ID:</span>
                    <span className="font-bold">{profile.gamerTag}</span>
                    <span className="text-indigo-600">({profile.googleEmail})</span>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-500">ID: {profile.id}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Game Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Star Patrol or Maze Runner"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Author Name *</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Your name or handle"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category / Genre</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as GameCategory)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 text-xs cursor-pointer"
                  >
                    <option value="Action">Action</option>
                    <option value="Arcade">Arcade</option>
                    <option value="Puzzle">Puzzle</option>
                    <option value="Retro">Retro</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Casual">Casual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. 2D, Sci-Fi, Quick"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell players what makes your game exciting..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-xs resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Controls & How to Play</label>
                <input
                  type="text"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="e.g. Arrow keys to steer, Space to shoot"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>

              {/* Color Theme Theme Selection */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">Card Color Accent</label>
                <div className="flex items-center gap-3">
                  {gradients.map((grad, i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setThumbnailGradient(grad)}
                      className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${grad} transition ${
                        thumbnailGradient === grad ? 'ring-2 ring-indigo-600 ring-offset-2 ring-offset-white scale-110 shadow-sm' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              {/* Starter Templates Picker & Clear Action */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-slate-800 text-xs">Optional Templates:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => applyTemplate('clicker')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 text-xs font-medium transition"
                  >
                    Cyber Clicker
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('reaction')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 text-xs font-medium transition"
                  >
                    Speed Reaction Lab
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('flappy')}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 text-xs font-medium transition"
                  >
                    Vector Hopper
                  </button>
                </div>
              </div>

              {/* Upload HTML file option & Clear Code button */}
              <div className="flex items-center justify-between gap-2">
                <label className="text-slate-700 font-semibold text-xs">HTML5 Game Code (Self-Contained HTML, JS & CSS)</label>
                <div className="flex items-center gap-2">
                  {code && (
                    <button
                      type="button"
                      onClick={() => setCode('')}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition"
                      title="Clear code"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear</span>
                    </button>
                  )}
                  <label className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 text-indigo-600 border border-slate-300 rounded-lg cursor-pointer transition shadow-sm font-medium text-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload .html File</span>
                    <input type="file" accept=".html,.htm" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <textarea
                required
                rows={12}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="<!DOCTYPE html>&#10;<html>&#10;  <!-- Paste or type your game HTML & JavaScript code here -->&#10;</html>"
                className="w-full bg-slate-900 font-mono text-xs border border-slate-700 rounded-xl p-3 text-cyan-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed shadow-inner"
              />

              <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Runs securely in an isolated iframe. You can include audio with Web Audio API and full keyboard/touch events!</span>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">Live Game Sandbox: {title || 'Untitled'}</span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Running Sandbox
                </span>
              </div>
              <div className="w-full aspect-[16/9] max-h-[50vh] min-h-[300px] bg-slate-950 rounded-xl border border-slate-300 overflow-hidden shadow-sm">
                <iframe
                  title="Test Preview"
                  srcDoc={code}
                  sandbox="allow-scripts allow-modals allow-same-origin"
                  className="w-full h-full border-0"
                />
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              {activeTab !== 'preview' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold rounded-lg transition flex items-center gap-1.5 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Test in Sandbox</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold rounded-lg transition shadow-sm"
                >
                  Back to Details
                </button>
              )}

              <button
                type="submit"
                disabled={success}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-emerald-600 text-white font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm"
              >
                {success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Published to Arcade!</span>
                  </>
                ) : (
                  <span>Publish Game</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const CLICKER_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing:border-box; margin:0; padding:0; user-select:none; }
  body { background:#0f172a; color:#f8fafc; font-family:system-ui, sans-serif; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .energy { font-size:48px; font-weight:900; color:#38bdf8; margin-bottom:8px; }
  .orb { width:150px; height:150px; border-radius:50%; background:radial-gradient(circle, #38bdf8 0%, #1e1b4b 100%); border:4px solid #06b6d4; cursor:pointer; transition:transform 0.05s ease; box-shadow:0 0 30px rgba(6,182,212,0.4); }
  .orb:active { transform:scale(0.92); }
  .upgrades { margin-top:24px; display:flex; gap:10px; }
  button { background:#1e293b; border:1px solid #334155; color:white; padding:8px 14px; border-radius:8px; font-weight:bold; cursor:pointer; }
  button:hover { background:#334155; }
</style>
</head>
<body>
<div class="energy" id="count">0</div>
<p style="color:#94a3b8; margin-bottom:16px;">TAP THE QUANTUM CORE</p>
<div class="orb" id="orb"></div>
<div class="upgrades">
  <button id="btnAuto" onclick="buyAuto()">Autoclicker (Cost: 20)</button>
</div>
<script>
  let energy = 0, perClick = 1, auto = 0, autoCost = 20;
  const countEl = document.getElementById('count');
  document.getElementById('orb').onclick = () => {
    energy += perClick;
    countEl.innerText = energy;
  };
  function buyAuto() {
    if (energy >= autoCost) {
      energy -= autoCost;
      auto++;
      autoCost = Math.floor(autoCost * 1.5);
      document.getElementById('btnAuto').innerText = 'Autoclicker (Cost: ' + autoCost + ')';
      countEl.innerText = energy;
    }
  }
  setInterval(() => {
    if (auto > 0) {
      energy += auto;
      countEl.innerText = energy;
    }
  }, 1000);
</script>
</body>
</html>`;

const REACTION_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing:border-box; margin:0; padding:0; user-select:none; }
  body { background:#030712; color:#fff; font-family:system-ui, sans-serif; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  #box { width:300px; height:240px; border-radius:16px; background:#1e293b; display:flex; align-items:center; justify-content:center; font-size:22px; font-weight:bold; cursor:pointer; transition:background 0.2s; border:2px solid #334155; }
  #stat { margin-top:16px; font-size:16px; color:#38bdf8; font-weight:bold; }
</style>
</head>
<body>
<div id="box">CLICK TO START</div>
<div id="stat"></div>
<script>
  const box = document.getElementById('box');
  const stat = document.getElementById('stat');
  let state = 'idle', startTime, timeout;
  box.onclick = () => {
    if (state === 'idle') {
      state = 'waiting';
      box.style.background = '#e11d48';
      box.innerText = 'WAIT FOR GREEN...';
      stat.innerText = '';
      timeout = setTimeout(() => {
        state = 'ready';
        box.style.background = '#10b981';
        box.innerText = 'CLICK NOW!';
        startTime = performance.now();
      }, 1500 + Math.random() * 2500);
    } else if (state === 'waiting') {
      clearTimeout(timeout);
      state = 'idle';
      box.style.background = '#1e293b';
      box.innerText = 'TOO EARLY! CLICK TO RETRY';
    } else if (state === 'ready') {
      const elapsed = Math.round(performance.now() - startTime);
      state = 'idle';
      box.style.background = '#1e293b';
      box.innerText = 'CLICK TO TRY AGAIN';
      stat.innerText = 'Reaction Time: ' + elapsed + ' ms';
    }
  };
</script>
</body>
</html>`;

const FLAPPY_TEMPLATE = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin:0; padding:0; box-sizing:border-box; user-select:none; }
  body { background:#080b12; color:#fff; font-family:sans-serif; display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; overflow:hidden; }
  canvas { background:#020617; border:2px solid #3b82f6; border-radius:8px; }
  #score { position:absolute; top:16px; font-size:20px; font-weight:bold; color:#38bdf8; }
</style>
</head>
<body>
<div id="score">Score: 0</div>
<canvas id="c" width="340" height="460"></canvas>
<script>
  const c = document.getElementById('c'), ctx = c.getContext('2d');
  let score = 0, y = 200, vy = 0, pipes = [], over = false;
  function jump() { if(over) reset(); else vy = -6.5; }
  window.addEventListener('keydown', jump);
  c.addEventListener('click', jump);

  function reset() { y = 200; vy = 0; score = 0; pipes = []; over = false; document.getElementById('score').innerText = 'Score: 0'; }

  function loop() {
    if(!over) {
      vy += 0.35; y += vy;
      if (Math.random() < 0.015) {
        const topH = Math.random() * 200 + 40;
        pipes.push({ x: c.width, top: topH, gap: 120, passed: false });
      }
      pipes.forEach(p => {
        p.x -= 2.2;
        if (!p.passed && p.x < 50) { p.passed = true; score++; document.getElementById('score').innerText = 'Score: ' + score; }
        if (50 > p.x && 30 < p.x + 40 && (y < p.top || y > p.top + p.gap)) over = true;
      });
      pipes = pipes.filter(p => p.x > -50);
      if (y > c.height || y < 0) over = true;
    }

    ctx.fillStyle = '#020617'; ctx.fillRect(0, 0, c.width, c.height);
    // Draw pipes
    ctx.fillStyle = '#10b981';
    pipes.forEach(p => {
      ctx.fillRect(p.x, 0, 40, p.top);
      ctx.fillRect(p.x, p.top + p.gap, 40, c.height);
    });

    // Draw player
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath(); ctx.arc(40, y, 10, 0, Math.PI*2); ctx.fill();

    if (over) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = '#f43f5e'; ctx.font = 'bold 24px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('CRASHED!', c.width/2, c.height/2);
      ctx.fillStyle = '#fff'; ctx.font = '14px sans-serif';
      ctx.fillText('Click to Restart', c.width/2, c.height/2 + 30);
    }
    requestAnimationFrame(loop);
  }
  loop();
</script>
</body>
</html>`;
