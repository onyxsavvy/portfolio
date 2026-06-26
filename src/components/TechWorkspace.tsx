import React, { useEffect, useRef, useState } from 'react';
import { Atom, Braces, Cpu, Database, Figma, Layers } from 'lucide-react';

interface TechNode {
  id: number;
  label: string;
  Icon: React.ComponentType<{ className?: string; size?: number }>;
  xPct: number; // percentage width
  yPct: number; // percentage height
  x: number;    // pixel coordinates
  y: number;
  phaseX: number;
  phaseY: number;
  speed: number;
  scale: number;
  glow: number;
  color: string;
}

export default function TechWorkspace() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const nodesRef = useRef<TechNode[]>([]);
  const requestRef = useRef<number>(0);
  const [activeTab, setActiveTab] = useState<'ui' | 'api' | 'data'>('ui');

  // Initialize node configurations
  useEffect(() => {
    const icons = [Atom, Braces, Cpu, Layers, Figma, Database];
    const labels = ['React', 'TypeScript', 'Node.js', 'Next.js', 'Figma', 'PostgreSQL'];
    const xPcts = [12, 85, 88, 10, 48, 52];
    const yPcts = [22, 18, 72, 68, 8, 88];
    const colors = [
      'rgba(163, 230, 53, 0.4)', // Neon Lime
      'rgba(56, 189, 248, 0.4)',  // Cyan
      'rgba(34, 197, 94, 0.4)',   // Green
      'rgba(244, 63, 94, 0.4)',   // Rose
      'rgba(168, 85, 247, 0.4)',  // Purple
      'rgba(234, 179, 8, 0.4)',   // Yellow
    ];

    nodesRef.current = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      label: labels[i],
      Icon: icons[i],
      xPct: xPcts[i],
      yPct: yPcts[i],
      x: 0,
      y: 0,
      phaseX: Math.random() * Math.PI * 2,
      phaseY: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 0.4,
      scale: 1,
      glow: 0,
      color: colors[i],
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Track mouse move globally over the parent section
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    // Find the closest ancestor hero section to attach mousemove (covers larger area)
    const heroSection = container.closest('section') || container;
    heroSection.addEventListener('mousemove', handleMouseMove as EventListener);
    heroSection.addEventListener('mouseleave', handleMouseLeave);

    // Resize handler
    const handleResize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // initial call

    let time = 0;

    const animate = () => {
      time += 0.006;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;

      // 1. Calculate positions with drift
      nodes.forEach((node) => {
        const baseX = (node.xPct / 100) * w;
        const baseY = (node.yPct / 100) * h;

        // Apply circular float
        const driftX = Math.sin(time * node.speed + node.phaseX) * 12;
        const driftY = Math.cos(time * node.speed + node.phaseY) * 12;

        node.x = baseX + driftX;
        node.y = baseY + driftY;

        // Proximity calculation
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180) {
          const intensity = 1.0 - dist / 180;
          node.scale = 1.0 + intensity * 0.25;
          node.glow = intensity;
        } else {
          node.scale += (1.0 - node.scale) * 0.1;
          node.glow += (0.0 - node.glow) * 0.1;
        }
      });

      // 2. Draw lines between nodes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Connect nodes that are close to each other
          if (dist < w * 0.45) {
            const opacity = (1.0 - dist / (w * 0.45)) * 0.08;
            ctx.strokeStyle = `rgba(163, 230, 53, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }
      }

      // 3. Draw lines to mouse
      if (mouseRef.current.x > 0 && mouseRef.current.y > 0) {
        nodes.forEach((node) => {
          const dx = mouseRef.current.x - node.x;
          const dy = mouseRef.current.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 200) {
            const opacity = (1.0 - dist / 200) * 0.18;
            ctx.strokeStyle = `rgba(163, 230, 53, ${opacity})`;
            ctx.lineWidth = 1.5;

            // Draw glowing gradient line
            const grad = ctx.createLinearGradient(node.x, node.y, mouseRef.current.x, mouseRef.current.y);
            grad.addColorStop(0, `rgba(163, 230, 53, ${opacity})`);
            grad.addColorStop(1, 'rgba(163, 230, 53, 0)');

            ctx.strokeStyle = grad;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.stroke();
          }
        });
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(requestRef.current);
      heroSection.removeEventListener('mousemove', handleMouseMove as EventListener);
      heroSection.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleTabClick = (tab: 'ui' | 'api' | 'data') => {
    setActiveTab(tab);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] lg:h-full min-h-[400px] pointer-events-none hidden md:block"
    >
      {/* Node connections canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Floating Technology Nodes */}
      {nodesRef.current.map((node) => {
        const Icon = node.Icon;
        return (
          <div
            key={node.id}
            className="absolute flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border backdrop-blur-md transition-all duration-150 pointer-events-auto"
            style={{
              left: `${node.xPct}%`,
              top: `${node.yPct}%`,
              transform: `translate(-50%, -50%) scale(${node.scale || 1})`,
              borderColor: node.glow > 0.1 ? 'rgba(163, 230, 53, 0.4)' : 'rgba(255, 255, 255, 0.08)',
              boxShadow: node.glow > 0.1 
                ? `0 0 20px rgba(163, 230, 53, ${node.glow * 0.15}), inset 0 0 10px rgba(163, 230, 53, ${node.glow * 0.08})`
                : 'none',
              willChange: 'transform, left, top',
            }}
          >
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{
                color: node.glow > 0.1 ? '#A3E635' : '#a1a1aa',
                transition: 'color 0.3s ease',
              }}
            >
              <Icon size={14} />
            </div>
            <span className="font-sans font-medium text-[11px] text-zinc-300 select-none tracking-wide">
              {node.label}
            </span>
          </div>
        );
      })}

      {/* Center Glassmorphic IDE Workspace Mockup */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[440px] bg-[#0A0A0A]/75 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto select-none"
        style={{
          boxShadow: '0 0 40px rgba(163, 230, 53, 0.02), 0 30px 60px rgba(0,0,0,0.7)',
        }}
      >
        {/* Editor Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#121212]/60 border-b border-white/5">
          {/* Traffic Lights */}
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>

          {/* Tab Selector */}
          <div className="flex bg-[#1E1E1E]/55 p-0.5 rounded border border-white/5">
            <button
              onClick={() => handleTabClick('ui')}
              className={`px-3 py-1 text-[10px] font-sans font-semibold rounded transition-all ${
                activeTab === 'ui' ? 'bg-[#A3E635] text-[#0A0A0A]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              OnyxUI.tsx
            </button>
            <button
              onClick={() => handleTabClick('api')}
              className={`px-3 py-1 text-[10px] font-sans font-semibold rounded transition-all ${
                activeTab === 'api' ? 'bg-[#A3E635] text-[#0A0A0A]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              router.ts
            </button>
            <button
              onClick={() => handleTabClick('data')}
              className={`px-3 py-1 text-[10px] font-sans font-semibold rounded transition-all ${
                activeTab === 'data' ? 'bg-[#A3E635] text-[#0A0A0A]' : 'text-zinc-400 hover:text-white'
              }`}
            >
              schema.prisma
            </button>
          </div>
          
          <div className="w-12 h-2" /> {/* spacer */}
        </div>

        {/* Editor Code Area */}
        <div className="p-5 font-mono text-[11px] leading-[1.6] text-zinc-300 overflow-hidden min-h-[200px]">
          {activeTab === 'ui' && (
            <div className="animate-fade-in">
              <div>
                <span className="text-purple-400">import</span> {'{ useState, useEffect }'}{' '}
                <span className="text-purple-400">from</span> <span className="text-emerald-400">'react'</span>;
              </div>
              <div>
                <span className="text-purple-400">import</span> {'{ design }'}{' '}
                <span className="text-purple-400">from</span> <span className="text-emerald-400">'@/lib/onyx'</span>;
              </div>
              <div className="h-3" />
              <div>
                <span className="text-purple-400">export default function</span>{' '}
                <span className="text-blue-400">OnyxSavvy</span>() {'{'}
              </div>
              <div className="pl-4">
                <span className="text-purple-400">const</span> [state, setState] ={' '}
                <span className="text-blue-400">useState</span>(<span className="text-emerald-400">'premium'</span>);
              </div>
              <div className="pl-4 mt-1">
                <span className="text-blue-400">useEffect</span>(() =&gt; {'{'}
              </div>
              <div className="pl-8">
                console.<span className="text-yellow-300">log</span>(<span className="text-emerald-400">"Interactive UI loaded!"</span>);
              </div>
              <div className="pl-4">{'}'}, []);</div>
              <div className="h-2" />
              <div className="pl-4">
                <span className="text-purple-400">return</span> (
              </div>
              <div className="pl-8">
                &lt;<span className="text-lime-400">Studio</span> quality={<span className="text-amber-300">"uncompromising"</span>}&gt;
              </div>
              <div className="pl-12">
                &lt;<span className="text-lime-400">DesignSystem</span> config={'{design}'} /&gt;
              </div>
              <div className="pl-12">
                &lt;<span className="text-lime-400">Experience</span> level={<span className="text-amber-300">"next-gen"</span>} /&gt;
              </div>
              <div className="pl-8">
                &lt;/<span className="text-lime-400">Studio</span>&gt;
              </div>
              <div className="pl-4">);</div>
              <div>{'}'}</div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="animate-fade-in">
              <div>
                <span className="text-purple-400">import</span> {'{ Router }'}{' '}
                <span className="text-purple-400">from</span> <span className="text-emerald-400">'express'</span>;
              </div>
              <div>
                <span className="text-purple-400">import</span> {'{ db }'}{' '}
                <span className="text-purple-400">from</span> <span className="text-emerald-400">'@/lib/db'</span>;
              </div>
              <div className="h-3" />
              <div>
                <span className="text-purple-400">const</span> router ={' '}
                <span className="text-blue-400">Router</span>();
              </div>
              <div className="h-2" />
              <div>
                router.<span className="text-yellow-300">post</span>(<span className="text-emerald-400">"/api/projects"</span>,{' '}
                <span className="text-purple-400">async</span> (req, res) =&gt; {'{'}
              </div>
              <div className="pl-4">
                <span className="text-purple-400">const</span> project ={' '}
                <span className="text-purple-400">await</span> db.project.<span className="text-yellow-300">create</span>({'{'}
              </div>
              <div className="pl-8">
                data: {'{'}
              </div>
              <div className="pl-12">
                title: req.body.title,
              </div>
              <div className="pl-12">
                techStack: [<span className="text-emerald-400">'React'</span>, <span className="text-emerald-400">'Node'</span>],
              </div>
              <div className="pl-12">
                featured: <span className="text-purple-400">true</span>
              </div>
              <div className="pl-8">{'}'}</div>
              <div className="pl-4">{'});'}</div>
              <div className="pl-4">
                res.<span className="text-yellow-300">status</span>(<span className="text-amber-300">201</span>).<span className="text-yellow-300">json</span>(project);
              </div>
              <div>{'});'}</div>
              <div className="h-2" />
              <div>
                <span className="text-purple-400">export default</span> router;
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="animate-fade-in">
              <div>
                <span className="text-zinc-500 italic">// Prisma Database Schema</span>
              </div>
              <div>
                <span className="text-purple-400">datasource</span> db {'{'}
              </div>
              <div className="pl-4">
                provider = <span className="text-emerald-400">"postgresql"</span>
              </div>
              <div className="pl-4">
                url      = env(<span className="text-emerald-400">"DATABASE_URL"</span>)
              </div>
              <div>{'}'}</div>
              <div className="h-3" />
              <div>
                <span className="text-purple-400">model</span> <span className="text-blue-400">Project</span> {'{'}
              </div>
              <div className="pl-4">
                id         String   @id @default(uuid())
              </div>
              <div className="pl-4">
                title      String
              </div>
              <div className="pl-4">
                slug       String   @unique
              </div>
              <div className="pl-4">
                imageUrl   String?
              </div>
              <div className="pl-4">
                techStack  String[]
              </div>
              <div className="pl-4">
                createdAt  DateTime @default(now())
              </div>
              <div>{'}'}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
