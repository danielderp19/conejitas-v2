"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import {
  CheckCircle2, Circle, ChevronRight, Trash2,
  RefreshCw, Monitor, Smartphone, Cloud, Menu, X,
  Send, Sparkles, RotateCcw,
} from "lucide-react";

const P = {
  bg: "#0f0a1e",
  card: "rgba(255,255,255,0.04)",
  border: "rgba(168,85,247,0.18)",
  borderHi: "rgba(168,85,247,0.55)",
  p1: "#a855f7",
  p3: "#ec4899",
  txt: "#f0e6ff",
  muted: "rgba(240,230,255,0.5)",
};

const LVL = [
  { from: "#a855f7", to: "#7c3aed" },
  { from: "#7c3aed", to: "#6d28d9" },
  { from: "#9333ea", to: "#db2777" },
  { from: "#db2777", to: "#f59e0b" },
  { from: "#f59e0b", to: "#ef4444" },
];

const lvlGrad = (l: number) => {
  const c = LVL[Math.min(l, LVL.length - 1)];
  return `linear-gradient(135deg,${c.from},${c.to})`;
};

let _id = Date.now();
const uid = () => `n${_id++}`;

interface TreeNode {
  id: string;
  title: string;
  icon?: string;
  level: number;
  children: TreeNode[];
}

function totalNodes(n: TreeNode): number {
  if (!n.children || n.children.length === 0) return 1;
  return n.children.reduce((s, c) => s + totalNodes(c), 0);
}

function doneNodes(n: TreeNode, done: Record<string, boolean>): number {
  if (!n.children || n.children.length === 0) return done[n.id] ? 1 : 0;
  return n.children.reduce((s, c) => s + doneNodes(c, done), 0);
}

function collectIds(n: TreeNode): string[] {
  let ids = [n.id];
  (n.children || []).forEach((c) => { ids = ids.concat(collectIds(c)); });
  return ids;
}

function parseResponse(raw: { type: string; text?: string }[]): TreeNode[] | null {
  try {
    const text = raw.map((b) => (b.type === "text" ? b.text : "")).join("");
    const match = text!.match(/```(?:json)?\s*([\s\S]*?)```/) || text!.match(/(\{[\s\S]*\})/);
    if (!match) return null;
    const trees = JSON.parse(match[1]).trees ?? null;
    if (!trees || !Array.isArray(trees) || trees.length === 0) return null;
    return trees;
  } catch {
    return null;
  }
}

function stampIds(node: Partial<TreeNode>, level = 0): TreeNode {
  return {
    ...node,
    id: uid(),
    level,
    title: node.title || "",
    children: (node.children || []).map((c) => stampIds(c, level + 1)),
  };
}

// ─── Confetti (fuera del componente principal) ───────────────────────────────
const CONFETTI_COLORS = ["#a855f7","#ec4899","#f59e0b","#86efac","#60a5fa","#f0e6ff"];

const Confetti = memo(function Confetti() {
  return (
    <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden", borderRadius:16 }}>
      {Array.from({length:18}).map((_,i) => (
        <div key={i} style={{
          position:"absolute",
          left:`${10 + (i * 5) % 80}%`,
          top:"60%",
          width: 5 + (i % 4),
          height: 5 + (i % 4),
          borderRadius: i % 3 === 0 ? "50%" : 2,
          background: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          animation: `confetti ${0.7 + (i % 4) * 0.15}s ${(i % 5) * 0.07}s ease-out forwards`,
        }}/>
      ))}
    </div>
  );
});

// ─── Node (fuera del componente principal para evitar remounts) ───────────────
interface NodeProps {
  node: TreeNode;
  done: Record<string, boolean>;
  expanded: Record<string, boolean>;
  desktop: boolean;
  onToggle: (id: string) => void;
  onExpand: (id: string) => void;
  onDelete: (id: string) => void;
}

const Node = memo(function Node({ node, done, expanded, desktop, onToggle, onExpand, onDelete }: NodeProps) {
  const isExp = expanded[node.id];
  const isDone = done[node.id];
  const hasKids = (node.children || []).length > 0;
  const kDone = hasKids ? node.children.reduce((s, c) => s + doneNodes(c, done), 0) : 0;
  const kTotal = hasKids ? node.children.reduce((s, c) => s + totalNodes(c), 0) : 0;
  const lPct = kTotal ? Math.round((kDone / kTotal) * 100) : isDone ? 100 : 0;
  const isComplete = hasKids && lPct === 100;

  // Animación pop solo cuando isDone cambia a true
  const [popping, setPopping] = useState(false);
  const prevDone = useRef(isDone);
  useEffect(() => {
    if (!prevDone.current && isDone) {
      setPopping(true);
      const t = setTimeout(() => setPopping(false), 400);
      return () => clearTimeout(t);
    }
    prevDone.current = isDone;
  }, [isDone]);

  return (
    <div style={{ marginLeft: node.level * (desktop ? 20 : 14), marginBottom: 6 }}>
      <div
        onClick={() => hasKids && onExpand(node.id)}
        style={{
          background: isDone ? "rgba(134,239,172,0.1)" : isComplete ? "rgba(168,85,247,0.2)" : lvlGrad(node.level),
          borderRadius: 12,
          padding: desktop ? "11px 15px" : "9px 12px",
          display: "flex", alignItems: "center", gap: 7,
          cursor: hasKids ? "pointer" : "default",
          opacity: isDone ? 0.65 : 1,
          border: isDone ? "1px solid rgba(134,239,172,0.4)" : isComplete ? `1px solid ${P.p1}` : "1px solid rgba(255,255,255,0.1)",
          transition: "opacity 0.3s, border-color 0.3s, background 0.3s",
          animation: popping ? "pop 0.35s ease" : "none",
        }}
      >
        {hasKids
          ? <div style={{ color:"#fff", transform: isExp ? "rotate(90deg)" : "rotate(0)", flexShrink:0, transition:"transform 0.25s ease" }}><ChevronRight size={14}/></div>
          : <div style={{ width:14, flexShrink:0 }}/>
        }
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}
          style={{ background:"none", border:"none", padding:0, cursor:"pointer", flexShrink:0, lineHeight:0 }}
        >
          {isDone
            ? <CheckCircle2 size={18} color="#86efac" style={{ filter:"drop-shadow(0 0 4px #86efac)", transition:"all 0.3s" }}/>
            : <Circle size={18} color="rgba(255,255,255,0.65)"/>
          }
        </button>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ margin:0, fontSize: desktop ? 13 : 12, fontWeight:600, color: isDone ? "#86efac" : "#fff", textDecoration: isDone ? "line-through" : "none", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", transition:"color 0.3s, text-decoration 0.3s" }}>
            {node.title}
          </p>
          {hasKids && (
            <div style={{ height:3, background:"rgba(0,0,0,0.25)", borderRadius:4, marginTop:4, overflow:"hidden" }}>
              <div className="progress-bar" style={{ height:"100%", width:`${lPct}%`, background: isComplete ? "linear-gradient(90deg,#86efac,#34d399)" : "rgba(255,255,255,0.7)", borderRadius:4 }}/>
            </div>
          )}
        </div>
        {hasKids && (
          <span style={{ fontSize:10, fontWeight:700, color: isComplete ? "#86efac" : "#fff", background: isComplete ? "rgba(134,239,172,0.2)" : "rgba(0,0,0,0.25)", borderRadius:20, padding:"2px 7px", flexShrink:0, transition:"all 0.3s", animation: isComplete ? "shimmer 1.5s infinite" : "none" }}>
            {lPct}%
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
          style={{ background:"rgba(255,0,0,0.15)", border:"none", borderRadius:6, padding:4, cursor:"pointer", display:"flex", alignItems:"center", flexShrink:0 }}
        >
          <Trash2 size={13} color="#ff6b6b"/>
        </button>
      </div>
      {isExp && hasKids && (
        <div>
          {node.children.map((c) => (
            <Node key={c.id} node={c} done={done} expanded={expanded} desktop={desktop} onToggle={onToggle} onExpand={onExpand} onDelete={onDelete}/>
          ))}
        </div>
      )}
    </div>
  );
});

// ─── TreeCard (fuera del componente principal) ────────────────────────────────
interface TreeCardProps {
  tree: TreeNode;
  done: Record<string, boolean>;
  expanded: Record<string, boolean>;
  desktop: boolean;
  onToggle: (id: string) => void;
  onExpand: (id: string) => void;
  onDeleteNode: (id: string) => void;
  onDeleteTree: (id: string) => void;
}

const TreeCard = memo(function TreeCard({ tree, done, expanded, desktop, onToggle, onExpand, onDeleteNode, onDeleteTree }: TreeCardProps) {
  const tTotal = totalNodes(tree);
  const tDone = doneNodes(tree, done);
  const tPct = tTotal ? Math.round((tDone / tTotal) * 100) : 0;
  const isComplete = tPct === 100;
  const circleR = 17;
  const circleC = 2 * Math.PI * circleR;

  return (
    <div style={{
      background: isComplete ? "rgba(134,239,172,0.06)" : P.card,
      border: `1px solid ${isComplete ? "rgba(134,239,172,0.4)" : P.border}`,
      borderRadius:16, padding: desktop ? 18 : 14, marginBottom:12,
      position:"relative", overflow:"hidden",
      transition:"border-color 0.5s, background 0.5s",
    }}>
      {isComplete && <Confetti/>}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${isComplete ? "rgba(134,239,172,0.2)" : P.border}` }}>
        <span style={{ fontSize:22, animation: isComplete ? "shimmer 1.5s infinite" : "none" }}>
          {isComplete ? "🎉" : (tree.icon || "🌱")}
        </span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize: desktop ? 15 : 13, color: isComplete ? "#86efac" : P.txt, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", transition:"color 0.4s" }}>
            {tree.title}
          </div>
          <div style={{ fontSize:10, color: isComplete ? "#86efac" : P.muted, marginTop:1, transition:"color 0.4s" }}>
            {isComplete ? "✅ ¡Completado!" : `${tDone}/${tTotal} tareas`}
          </div>
        </div>
        <button onClick={() => onDeleteTree(tree.id)} style={{ background:"rgba(255,0,0,0.15)", border:"none", borderRadius:8, padding:"5px 9px", cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
          <Trash2 size={13} color="#ff6b6b"/>
          <span style={{ fontSize:10, color:"#ff6b6b", fontWeight:700 }}>Árbol</span>
        </button>
        <svg width={40} height={40} viewBox="0 0 42 42" style={{ flexShrink:0 }}>
          <circle cx={21} cy={21} r={circleR} fill="none" stroke="rgba(168,85,247,0.15)" strokeWidth={4}/>
          <circle cx={21} cy={21} r={circleR} fill="none"
            stroke={isComplete ? "#86efac" : P.p1}
            strokeWidth={4}
            strokeDasharray={`${circleC}`}
            strokeDashoffset={`${circleC * (1 - tPct / 100)}`}
            strokeLinecap="round"
            transform="rotate(-90 21 21)"
            className="progress-circle"
            style={{ filter: isComplete ? "drop-shadow(0 0 4px #86efac)" : "none" }}
          />
          <text x={21} y={25} textAnchor="middle" fill={isComplete ? "#86efac" : "#fff"} fontSize={9} fontWeight={800}>{tPct}%</text>
        </svg>
      </div>
      {(tree.children || []).map((c) => (
        <Node key={c.id} node={c} done={done} expanded={expanded} desktop={desktop} onToggle={onToggle} onExpand={onExpand} onDelete={onDeleteNode}/>
      ))}
    </div>
  );
});

// ─── Componente principal ─────────────────────────────────────────────────────
const STORAGE_KEY = "conejitas-state-v1";

export default function ConejitasDashboard() {
  const [trees, setTrees] = useState<TreeNode[]>([]);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatLog, setChatLog] = useState<{ role: string; text: string }[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState<"dashboard" | "chat">("dashboard");
  const [desktop, setDesktop] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle"|"saving"|"saved"|"error">("idle");
  const [hydrated, setHydrated] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatEnd = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.trees) setTrees(s.trees);
        if (s.done) setDone(s.done);
        if (s.expanded) setExpanded(s.expanded);
        if (s.chatLog) setChatLog(s.chatLog.slice(-20));
      }
    } catch { /* fresh start */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    const check = () => setDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const saveState = useCallback(
    (t: TreeNode[], d: Record<string, boolean>, e: Record<string, boolean>, cl: { role: string; text: string }[]) => {
      setSaveStatus("saving");
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ trees:t, done:d, expanded:e, chatLog:cl.slice(-20), savedAt:new Date().toISOString() }));
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    }, []
  );

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => saveState(trees, done, expanded, chatLog), 800);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [trees, done, expanded, chatLog, hydrated, saveState]);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior:"smooth" }); }, [chatLog]);

  const totalT = trees.reduce((s, t) => s + totalNodes(t), 0);
  const doneT = trees.reduce((s, t) => s + doneNodes(t, done), 0);
  const pct = totalT ? Math.round((doneT / totalT) * 100) : 0;

  const toggle = useCallback((id: string) => setDone((p) => ({ ...p, [id]: !p[id] })), []);
  const expandToggle = useCallback((id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] })), []);

  const deleteNode = useCallback((nodeId: string) => {
    function find(nodes: TreeNode[]): TreeNode | null {
      for (const n of nodes) {
        if (n.id === nodeId) return n;
        const f = find(n.children || []);
        if (f) return f;
      }
      return null;
    }
    function del(nodes: TreeNode[]): TreeNode[] {
      return nodes.filter((n) => n.id !== nodeId).map((n) => ({ ...n, children: del(n.children || []) }));
    }
    setTrees((prev) => {
      const target = find(prev);
      const toRemove = target ? collectIds(target) : [nodeId];
      setDone((p) => { const nd = { ...p }; toRemove.forEach((id) => delete nd[id]); return nd; });
      setExpanded((p) => { const ne = { ...p }; toRemove.forEach((id) => delete ne[id]); return ne; });
      return del(prev);
    });
  }, []);

  const deleteTree = useCallback((treeId: string) => {
    setTrees((prev) => {
      const tree = prev.find((t) => t.id === treeId);
      const toRemove = tree ? collectIds(tree) : [treeId];
      setDone((p) => { const nd = { ...p }; toRemove.forEach((id) => delete nd[id]); return nd; });
      setExpanded((p) => { const ne = { ...p }; toRemove.forEach((id) => delete ne[id]); return ne; });
      return prev.filter((t) => t.id !== treeId);
    });
  }, []);

  async function send() {
    const msg = input.trim();
    if (!msg || loading) return;
    setInput("");
    setLoading(true);
    setChatLog((p) => [...p, { role:"user", text:msg }]);
    setView("chat");

    const sys = `Eres Conjita, asistente de productividad. Tu única función es convertir mensajes del usuario en árboles de tareas jerárquicos.

RESPUESTA: ÚNICAMENTE un bloque JSON entre triple backticks. CERO texto adicional antes o después.
\`\`\`json
{"trees":[{"title":"Área o proyecto","icon":"🎯","children":[{"title":"Tarea accionable","icon":"📌","children":[{"title":"Paso concreto","icon":"⚡","children":[]}]}]}]}
\`\`\`

ESTRUCTURA:
- Un árbol por área o proyecto distinto (trabajo, hogar, finanzas, salud, etc.)
- Nivel raíz: nombre del área + emoji del área
- Nivel 1: tareas principales accionables (verbo + objeto, ej: "Preparar informe mensual")
- Nivel 2: pasos específicos (solo si la tarea tiene sub-pasos claros y distintos)
- Máximo 3 niveles de profundidad
- Cada "title": texto limpio SIN emojis, conciso
- Cada "icon": UN solo emoji

GUÍA DE ÍCONOS:
💼 trabajo  🏠 hogar  💰 finanzas  💻 tecnología  🔥 urgente
📅 fechas  🏥 salud  📦 proyecto  🎓 aprendizaje  🛒 compras
✉️ comunicación  📊 análisis  🎯 objetivos  🔧 mantenimiento  🤝 reuniones

DECISIONES DE AGRUPACIÓN:
- 1–3 tareas del mismo tema → un árbol sin subtareas a menos que tengan pasos claros
- Tareas de áreas distintas → un árbol por área
- Tarea vaga (ej: "trabajar en el proyecto") → desglosa en 2–3 subtareas lógicas
- Lista larga mezclada → agrupa por área en árboles separados

CASO SIN TAREAS: Si el mensaje no contiene ninguna tarea concreta:
{"trees":[{"title":"Sin tareas detectadas","icon":"💬","children":[{"title":"Describe tus pendientes con más detalle","icon":"✏️","children":[]}]}]}

IMPORTANTE: NO repitas ni modifiques tareas de mensajes anteriores. Solo procesa el mensaje actual.`;

    try {
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"gpt-4o-mini", max_tokens:1500, system:sys, messages:[{ role:"user", content:msg }] }),
      });
      const data = await res.json();
      const newTrees = parseResponse(data.content);
      if (newTrees && newTrees.length > 0) {
        const stamped = newTrees.map((t) => stampIds(t, 0));
        setTrees((prev) => [...prev, ...stamped]);
        const exp: Record<string, boolean> = {};
        stamped.forEach((t) => {
          exp[t.id] = true;
          (t.children || []).forEach((c) => { exp[c.id] = true; });
        });
        setExpanded((p) => ({ ...p, ...exp }));
        const total = stamped.reduce((s, t) => s + totalNodes(t), 0);
        setChatLog((p) => [...p, { role:"ai", text:`¡Listo! ${stamped.length} árbol${stamped.length > 1 ? "es" : ""} con ${total} tareas. 🎯` }]);
        setTimeout(() => setView("dashboard"), 900);
      } else {
        setChatLog((p) => [...p, { role:"ai", text:"No pude entender eso. Intenta de otra forma." }]);
      }
    } catch {
      setChatLog((p) => [...p, { role:"ai", text:"Error de conexión. Intenta de nuevo." }]);
    }
    setLoading(false);
  }

  function reset() {
    if (!window.confirm("¿Borrar TODO? Esto eliminará también la memoria guardada.")) return;
    setTrees([]); setDone({}); setExpanded({}); setChatLog([]);
    setMenuOpen(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ok */ }
  }

  if (!hydrated) return (
    <div style={{ minHeight:"100vh", background:P.bg, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:32, height:32, border:`3px solid ${P.p1}`, borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
    </div>
  );

  const maxW = 960;

  return (
    <div style={{ minHeight:"100vh", background:P.bg, fontFamily:"'Poppins',sans-serif", color:P.txt, display:"flex", flexDirection:"column", maxWidth:maxW, margin:"0 auto", position:"relative" }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0.2;}}
        @keyframes pop{0%{transform:scale(1)}40%{transform:scale(1.2)}70%{transform:scale(0.95)}100%{transform:scale(1)}}
        @keyframes shimmer{0%,100%{opacity:0.7}50%{opacity:1}}
        @keyframes confetti{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(-90px) rotate(720deg);opacity:0}}
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        textarea,input{font-family:'Poppins',sans-serif;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(168,85,247,0.3);border-radius:4px;}
        .progress-circle{transition:stroke-dashoffset 0.7s cubic-bezier(.4,0,.2,1);}
        .progress-bar{transition:width 0.5s cubic-bezier(.4,0,.2,1);}
      `}</style>

      {/* Header */}
      <header style={{ padding: desktop ? "14px 28px" : "14px 18px", background:"rgba(15,10,30,0.97)", borderBottom:`1px solid ${P.border}`, display:"flex", alignItems:"center", gap:10, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize: desktop ? 22 : 18, fontWeight:800, background:`linear-gradient(135deg,${P.p1},${P.p3})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Conjita&apos;s Dashboard
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:1 }}>
            <div style={{ fontSize:11, color:P.muted }}>
              {totalT ? `${doneT} de ${totalT} tareas • ${pct}%` : "Escribe tus tareas"}
            </div>
            {saveStatus === "saving" && <div style={{ fontSize:10, color:P.muted, display:"flex", alignItems:"center", gap:3 }}><RefreshCw size={10} style={{ animation:"spin 0.7s linear infinite" }}/>Guardando</div>}
            {saveStatus === "saved" && <div style={{ fontSize:10, color:"#86efac", display:"flex", alignItems:"center", gap:3 }}><Cloud size={10}/>Guardado</div>}
          </div>
        </div>
        <button onClick={() => setDesktop((d) => !d)} style={{ background:"rgba(255,255,255,0.06)", border:`1px solid ${P.border}`, borderRadius:8, padding:7, color:P.txt, cursor:"pointer", display:"flex", alignItems:"center" }}>
          {desktop ? <Smartphone size={15}/> : <Monitor size={15}/>}
        </button>
        <div style={{ display:"flex", background:"rgba(255,255,255,0.06)", borderRadius:28, padding:3 }}>
          {([{v:"dashboard",icon:"📊"},{v:"chat",icon:"💬"}] as const).map(({v,icon}) => (
            <button key={v} onClick={() => setView(v)} style={{ background: view===v ? `linear-gradient(135deg,${P.p1},${P.p3})` : "none", border:"none", borderRadius:22, padding:"5px 11px", color: view===v ? "#fff" : P.muted, fontSize:11, fontWeight:700, cursor:"pointer" }}>{icon}</button>
          ))}
        </div>
        <button onClick={() => setMenuOpen((m) => !m)} style={{ background:"rgba(255,255,255,0.06)", border:"none", borderRadius:8, padding:7, color:P.txt, cursor:"pointer" }}>
          {menuOpen ? <X size={16}/> : <Menu size={16}/>}
        </button>
      </header>

      {menuOpen && (
        <div style={{ position:"fixed", top:62, right: desktop ? "calc(50% - 480px + 12px)" : 12, background:"rgba(20,10,40,0.98)", border:`1px solid ${P.border}`, borderRadius:14, padding:8, zIndex:200, minWidth:210, boxShadow:"0 12px 40px rgba(0,0,0,0.5)" }}>
          <div style={{ padding:"8px 12px 6px", fontSize:10, color:P.muted, fontWeight:700 }}>MEMORIA</div>
          <div style={{ padding:"4px 12px 10px", fontSize:11, color:P.txt, borderBottom:`1px solid ${P.border}` }}>
            💾 Tus tareas se guardan automáticamente.
          </div>
          <button onClick={reset} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", background:"none", border:"none", color:"#f87171", padding:"9px 12px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600, marginTop:4 }}>
            <RotateCcw size={13}/> Borrar todo y memoria
          </button>
        </div>
      )}

      <main style={{ flex:1, overflowY:"auto", padding: desktop ? "20px 28px 150px" : "14px 14px 130px" }}>

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <div style={{ display: desktop && trees.length > 0 ? "grid" : "block", gridTemplateColumns: desktop && trees.length > 0 ? "1fr 1fr" : "1fr", gap: desktop ? 16 : 0 }}>
            {trees.length > 0 && (
              <div style={{ gridColumn: desktop ? "1 / -1" : undefined, background:"linear-gradient(135deg,rgba(124,58,237,0.12),rgba(236,72,153,0.08))", border:`1px solid ${P.border}`, borderRadius:16, padding:"16px 20px", marginBottom: desktop ? 0 : 14, display:"flex", alignItems:"center", gap:14 }}>
                <svg width={64} height={64} viewBox="0 0 72 72">
                  <circle cx={36} cy={36} r={30} fill="none" stroke="rgba(168,85,247,0.15)" strokeWidth={6}/>
                  <circle cx={36} cy={36} r={30} fill="none" stroke="url(#rg)" strokeWidth={6}
                    strokeDasharray={`${2 * Math.PI * 30}`}
                    strokeDashoffset={`${2 * Math.PI * 30 * (1 - pct / 100)}`}
                    strokeLinecap="round" transform="rotate(-90 36 36)"
                    className="progress-circle"/>
                  <defs>
                    <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={P.p1}/>
                      <stop offset="100%" stopColor={P.p3}/>
                    </linearGradient>
                  </defs>
                  <text x={36} y={40} textAnchor="middle" fill="#fff" fontSize={14} fontWeight={800}>{pct}%</text>
                </svg>
                <div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, color:P.txt }}>Progreso Global</div>
                  <div style={{ fontSize:12, color:P.muted, marginTop:2 }}>{doneT} / {totalT} completadas</div>
                </div>
              </div>
            )}

            {trees.length === 0 ? (
              <div style={{ gridColumn:"1 / -1", textAlign:"center", padding:"50px 20px" }}>
                <div style={{ fontSize:48, marginBottom:12 }}>🌱</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:P.txt, marginBottom:6 }}>Dashboard vacío</div>
                <div style={{ fontSize:12, color:P.muted, lineHeight:1.7 }}>
                  Escribe tus tareas abajo y la IA las organiza automáticamente.
                  <br/><span style={{ color:"#86efac" }}>💾 Todo se guarda automáticamente.</span>
                </div>
                <button onClick={() => { setView("chat"); setTimeout(() => inputRef.current?.focus(), 100); }}
                  style={{ background:`linear-gradient(135deg,${P.p1},${P.p3})`, border:"none", borderRadius:28, padding:"11px 22px", color:"#fff", fontWeight:700, fontSize:13, cursor:"pointer", marginTop:20 }}>
                  Agregar tareas
                </button>
              </div>
            ) : (
              trees.map((tree) => (
                <TreeCard key={tree.id} tree={tree} done={done} expanded={expanded} desktop={desktop}
                  onToggle={toggle} onExpand={expandToggle} onDeleteNode={deleteNode} onDeleteTree={deleteTree}/>
              ))
            )}
          </div>
        )}

        {/* CHAT */}
        {view === "chat" && (
          <div>
            {chatLog.length === 0 ? (
              <div style={{ textAlign:"center", padding:"36px 18px" }}>
                <div style={{ fontSize:44 }}>💬</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, color:P.txt, marginTop:10 }}>Cuéntame tus tareas</div>
                <div style={{ fontSize:12, color:P.muted, marginTop:6, lineHeight:1.8 }}>
                  Ejemplo:<br/>
                  <span style={{ color:P.p1 }}>&quot;Terminar informe del proyecto, revisar correos y preparar presentación&quot;</span>
                </div>
              </div>
            ) : chatLog.map((m, i) => (
              <div key={i} style={{ display:"flex", justifyContent: m.role==="user" ? "flex-end" : "flex-start", marginBottom:10 }}>
                {m.role === "ai" && (
                  <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg,${P.p1},${P.p3})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, marginRight:7, flexShrink:0, alignSelf:"flex-end" }}>✨</div>
                )}
                <div style={{ maxWidth:"78%", background: m.role==="user" ? P.p1 : "rgba(255,255,255,0.06)", borderRadius: m.role==="user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding:"9px 13px", fontSize:12, color:"#fff", lineHeight:1.5, border: m.role==="ai" ? `1px solid ${P.border}` : "none" }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display:"flex", alignItems:"center", gap:9, marginTop:7 }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:`linear-gradient(135deg,${P.p1},${P.p3})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13 }}>✨</div>
                <div style={{ background:"rgba(255,255,255,0.06)", border:`1px solid ${P.border}`, borderRadius:"16px 16px 16px 4px", padding:"10px 16px", display:"flex", gap:5 }}>
                  {[0,1,2].map((i) => <div key={i} style={{ width:6, height:6, borderRadius:"50%", background:P.p1, animation:`blink 1.2s ${i*0.2}s infinite` }}/>)}
                </div>
              </div>
            )}
            <div ref={chatEnd}/>
          </div>
        )}
      </main>

      {/* Input bar */}
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:maxW, background:"rgba(15,10,30,0.97)", borderTop:`1px solid ${P.border}`, padding: desktop ? "12px 28px 18px" : "10px 14px 16px", zIndex:100 }}>
        <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
          <div style={{ flex:1, background:"rgba(255,255,255,0.06)", border:`1px solid ${P.borderHi}`, borderRadius:18, padding:"9px 14px", display:"flex", alignItems:"center", gap:7 }}>
            <Sparkles size={14} color={P.p1}/>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder='Escribe tus tareas... (ej: "preparar reunión, revisar informe")'
              rows={1}
              style={{ flex:1, background:"none", border:"none", outline:"none", color:P.txt, fontSize:12, resize:"none", lineHeight:1.5, maxHeight:90, overflowY:"auto" }}
            />
          </div>
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            style={{ width:42, height:42, borderRadius:"50%", background: input.trim() && !loading ? `linear-gradient(135deg,${P.p1},${P.p3})` : "rgba(255,255,255,0.08)", border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor: input.trim() && !loading ? "pointer" : "not-allowed", flexShrink:0 }}
          >
            {loading
              ? <div style={{ width:16, height:16, border:"2px solid #fff", borderTopColor:"transparent", borderRadius:"50%", animation:"spin 0.7s linear infinite" }}/>
              : <Send size={16} color="#fff"/>
            }
          </button>
        </div>
        <div style={{ textAlign:"center", fontSize:10, color:P.muted, marginTop:6 }}>
          Enter para enviar • 💾 Guardado automático en tu dispositivo
        </div>
      </div>
    </div>
  );
}
