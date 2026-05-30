"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import dynamic from "next/dynamic";
const VisionBoard = dynamic(() => import("@/components/VisionBoard"), { ssr: false });
import {
  IconContext,
  CheckCircle as CheckCircle2,
  Circle,
  CaretRight as ChevronRight,
  Trash as Trash2,
  ArrowsClockwise as RefreshCw,
  DeviceMobile as Smartphone,
  Cloud,
  List as Menu,
  X,
  PaperPlaneRight as Send,
  Sparkle as Sparkles,
  ArrowCounterClockwise as RotateCcw,
  DotsSixVertical as GripVertical,
  Bell,
  BellSlash as BellOff,
  CalendarPlus,
} from "@phosphor-icons/react";

const GCAL_CLIENT_ID_ENV = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const GCAL_ID_KEY   = "conjita-gcal-clientid";
const GCAL_TOK_KEY  = "conjita-gcal-token";

const P = {
  bg: "#0d0a1a",
  card: "rgba(168,85,247,0.1)",
  border: "rgba(168,85,247,0.25)",
  borderHi: "rgba(168,85,247,0.6)",
  p1: "#9333ea",
  p3: "#db2777",
  txt: "#f0e6ff",
  muted: "rgba(240,230,255,0.45)",
};

const LVL = [
  { from: "#d8b4fe", to: "#c084fc" },
  { from: "#c084fc", to: "#a855f7" },
  { from: "#fbbf24", to: "#f97316" },
  { from: "#f97316", to: "#ea580c" },
  { from: "#ea580c", to: "#dc2626" },
];

const lvlGrad = (l: number) => {
  const c = LVL[Math.min(l, LVL.length - 1)];
  return `linear-gradient(135deg,${c.from},${c.to})`;
};

let _id = Date.now();
const uid = () => `n${_id++}`;

// ── Emoji 3D (Apple glossy via jsDelivr) con fallback a emoji nativo ──────────
function emojiCodepoints(emoji: string): string[] {
  const full = Array.from(emoji).map(c => c.codePointAt(0)!.toString(16)).join("-");
  const stripped = full.replace(/-?fe0f/g, ""); // sin selector de variación
  return stripped && stripped !== full ? [full, stripped] : [full];
}
function Emoji3D({ char, size = 24, style }: { char: string; size?: number; style?: React.CSSProperties }) {
  const candidates = emojiCodepoints(char);
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState(false);
  if (failed || !candidates[0]) {
    return <span style={{ fontSize: size, lineHeight: 1, ...style }}>{char}</span>;
  }
  return (
    <img
      src={`https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${candidates[idx]}.png`}
      alt={char}
      width={size}
      height={size}
      draggable={false}
      onError={() => { if (idx < candidates.length - 1) setIdx(idx + 1); else setFailed(true); }}
      style={{ objectFit: "contain", verticalAlign: "middle", filter: "drop-shadow(0 2px 5px rgba(0,0,0,0.3))", ...style }}
    />
  );
}

type Priority = "high" | "medium" | "low" | null;

interface TreeNode {
  id: string;
  title: string;
  icon?: string;
  level: number;
  children: TreeNode[];
  priority?: Priority;
}

const PRIORITY_COLORS: Record<string, string> = {
  high:   "#ef4444",
  medium: "#f59e0b",
  low:    "#22c55e",
};
const PRIORITY_GLOW: Record<string, string> = {
  high:   "0 0 8px #ef4444, 0 0 16px rgba(239,68,68,0.4)",
  medium: "0 0 8px #f59e0b, 0 0 16px rgba(245,158,11,0.4)",
  low:    "0 0 8px #22c55e, 0 0 16px rgba(34,197,94,0.4)",
};
const PRIORITY_CYCLE: Priority[] = ["high", "medium", "low", null];
const nextPriority = (p: Priority): Priority => PRIORITY_CYCLE[(PRIORITY_CYCLE.indexOf(p) + 1) % PRIORITY_CYCLE.length];

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

function reorderSiblings(trees: TreeNode[], dragId: string, dropId: string): TreeNode[] {
  function reorder(nodes: TreeNode[]): TreeNode[] {
    const di = nodes.findIndex((n) => n.id === dragId);
    const ti = nodes.findIndex((n) => n.id === dropId);
    if (di !== -1 && ti !== -1) {
      const arr = [...nodes];
      const [item] = arr.splice(di, 1);
      arr.splice(ti, 0, item);
      return arr;
    }
    return nodes.map((n) => ({ ...n, children: reorder(n.children || []) }));
  }
  return reorder(trees);
}

function parseResponse(raw: { type: string; text?: string }[]): TreeNode[] | null {
  try {
    const text = raw.map((b) => (b.type === "text" ? b.text : "")).join("");
    const match = text!.match(/```(?:json)?\s*([\s\S]*?)```/) || text!.match(/(\{[\s\S]*\})/);
    if (!match) return null;
    const parsed = JSON.parse(match[1]);
    const trees = parsed.trees;
    if (!Array.isArray(trees)) return null;
    return trees.length === 0 ? [] : trees;
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

// ─── Prioridad por palabras clave ─────────────────────────────────────────────
const HIGH_KW = ["urgente","urgente!","hoy","ahora","inmediato","vence","plazo","deadline","entregar","entrega","examen","evaluacion","evaluación","presentación","presentacion","reunion importante","junta","crítico","critico","asap","ya","emergencia"];
const MED_KW  = ["esta semana","próximo","proximo","importante","revisar","pendiente","seguimiento","confirmar","recordar","semana","mañana","mañana"];

function guessPriority(title: string): Priority {
  const t = title.toLowerCase();
  if (HIGH_KW.some(k => t.includes(k))) return "high";
  if (MED_KW.some(k => t.includes(k))) return "medium";
  return "low";
}

function assignPriorities(node: TreeNode): TreeNode {
  return {
    ...node,
    priority: node.priority ?? guessPriority(node.title),
    children: (node.children || []).map(assignPriorities),
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
  scheduled: Record<string, boolean>;
  onToggle: (id: string) => void;
  onExpand: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder: (dragId: string, dropId: string) => void;
  onSchedule: (node: TreeNode) => void;
  onPriority: (id: string) => void;
}

const Node = memo(function Node({ node, done, expanded, desktop, scheduled, onToggle, onExpand, onDelete, onReorder, onSchedule, onPriority }: NodeProps) {
  const isExp = expanded[node.id];
  const isDone = done[node.id];
  const hasKids = (node.children || []).length > 0;
  const kDone = hasKids ? node.children.reduce((s, c) => s + doneNodes(c, done), 0) : 0;
  const kTotal = hasKids ? node.children.reduce((s, c) => s + totalNodes(c), 0) : 0;
  const lPct = kTotal ? Math.round((kDone / kTotal) * 100) : isDone ? 100 : 0;
  const isComplete = hasKids && lPct === 100;

  const [popping, setPopping] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
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
    <div
      data-node-id={node.id}
      style={{ marginLeft: node.level * (desktop ? 20 : 14), marginBottom: 6 }}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        const fromId = e.dataTransfer.getData("text/plain");
        if (fromId && fromId !== node.id) onReorder(fromId, node.id);
      }}
    >
      <div
        onClick={() => hasKids && onExpand(node.id)}
        style={{
          background: isDone ? "rgba(134,239,172,0.1)" : isComplete ? "rgba(168,85,247,0.2)" : lvlGrad(node.level),
          borderRadius: 12,
          padding: desktop ? "11px 15px" : "9px 12px",
          display: "flex", alignItems: "center", gap: 7,
          cursor: hasKids ? "pointer" : "default",
          opacity: isDone ? 0.65 : 1,
          border: isDragOver ? "1px solid rgba(168,85,247,0.9)" : isDone ? "1px solid rgba(134,239,172,0.4)" : isComplete ? `1px solid ${P.p1}` : "1px solid rgba(255,255,255,0.1)",
          transition: "opacity 0.3s, border-color 0.2s, background 0.3s",
          animation: popping ? "pop 0.35s ease" : `slideInStagger 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${node.level * 0.08}s both`,
        }}
      >
        {/* Grip handle */}
        <div
          draggable
          onDragStart={(e) => {
            e.stopPropagation();
            e.dataTransfer.setData("text/plain", node.id);
            e.dataTransfer.effectAllowed = "move";
          }}
          onClick={(e) => e.stopPropagation()}
          style={{ cursor:"grab", flexShrink:0, display:"flex", alignItems:"center", opacity:0.45, touchAction:"none" }}
          onTouchStart={(e) => {
            e.stopPropagation();
            (e.currentTarget as HTMLElement).setAttribute("data-touch-drag", node.id);
          }}
        >
          <GripVertical size={14} color="#fff"/>
        </div>

        {hasKids
          ? <div style={{ color:"#fff", transform: isExp ? "rotate(90deg)" : "rotate(0)", flexShrink:0, transition:"transform 0.25s ease" }}><ChevronRight size={14}/></div>
          : <div style={{ width:14, flexShrink:0 }}/>
        }
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}
          style={{ background:"none", border:"none", padding:0, cursor:"pointer", flexShrink:0, lineHeight:0 }}
        >
          {isDone
            ? <CheckCircle2 size={18} color="#86efac" style={{ filter:"drop-shadow(0 0 5px #86efac)", animation: popping ? "checkBurst 0.5s cubic-bezier(0.34,1.56,0.64,1)" : "none" }}/>
            : <Circle size={18} color="rgba(255,255,255,0.65)"/>
          }
        </button>
        {/* Semáforo de prioridad */}
        <button
          onClick={(e) => { e.stopPropagation(); onPriority(node.id); }}
          title={node.priority === "high" ? "Alta prioridad" : node.priority === "medium" ? "Media prioridad" : node.priority === "low" ? "Baja prioridad" : "Sin prioridad"}
          style={{ background:"none", border:"none", padding:"2px 3px", cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}
        >
          <div style={{
            width: 10, height: 10, borderRadius:"50%",
            background: node.priority ? PRIORITY_COLORS[node.priority] : "rgba(255,255,255,0.15)",
            boxShadow: node.priority ? PRIORITY_GLOW[node.priority] : "none",
            transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            ...(node.priority === "high" && !isDone
              ? { ["--pc" as string]: PRIORITY_COLORS.high, animation: "priorityPulse 1.8s ease-in-out infinite" }
              : {}),
          }}/>
        </button>

        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ margin:0, fontSize: desktop ? 13 : 12, fontWeight:600, color: isDone ? "#86efac" : "#fff", textDecoration: isDone ? "line-through" : "none", whiteSpace:"normal", wordBreak:"break-word", lineHeight:1.4, transition:"color 0.3s, text-decoration 0.3s" }}>
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
        {!hasKids && (
          <button
            onClick={(e) => { e.stopPropagation(); onSchedule(node); }}
            title="Agendar en Google Calendar"
            style={{ background: scheduled[node.id] ? "rgba(52,211,153,0.25)" : "rgba(66,133,244,0.2)", border:"none", borderRadius:6, padding:"6px 8px", cursor:"pointer", display:"flex", alignItems:"center", flexShrink:0 }}
          >
            {scheduled[node.id]
              ? <span style={{ fontSize:12 }}>📅</span>
              : <CalendarPlus size={14} color={scheduled[node.id] ? "#34d399" : "#93c5fd"}/>
            }
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); if (window.confirm("¿Eliminar esta tarea?")) onDelete(node.id); }}
          style={{ background:"rgba(239,68,68,0.3)", border:"none", borderRadius:6, padding:"6px 8px", cursor:"pointer", display:"flex", alignItems:"center", flexShrink:0 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.5)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.3)"; }}
        >
          <Trash2 size={14} color="#fca5a5"/>
        </button>
      </div>
      {isExp && hasKids && (
        <div>
          {node.children.map((c) => (
            <Node key={c.id} node={c} done={done} expanded={expanded} desktop={desktop} scheduled={scheduled} onToggle={onToggle} onExpand={onExpand} onDelete={onDelete} onReorder={onReorder} onSchedule={onSchedule} onPriority={onPriority}/>
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
  scheduled: Record<string, boolean>;
  onToggle: (id: string) => void;
  onExpand: (id: string) => void;
  onDeleteNode: (id: string) => void;
  onDeleteTree: (id: string) => void;
  onReorder: (dragId: string, dropId: string) => void;
  onSchedule: (node: TreeNode) => void;
  onPriority: (id: string) => void;
}

const TreeCard = memo(function TreeCard({ tree, done, expanded, desktop, scheduled, onToggle, onExpand, onDeleteNode, onDeleteTree, onReorder, onSchedule, onPriority }: TreeCardProps) {
  const tTotal = totalNodes(tree);
  const tDone = doneNodes(tree, done);
  const tPct = tTotal ? Math.round((tDone / tTotal) * 100) : 0;
  const isComplete = tPct === 100;
  const circleR = 17;
  const circleC = 2 * Math.PI * circleR;

  const [cardDragOver, setCardDragOver] = useState(false);

  return (
    <div
      data-node-id={tree.id}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", tree.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragOver={(e) => { e.preventDefault(); setCardDragOver(true); }}
      onDragLeave={() => setCardDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setCardDragOver(false);
        const fromId = e.dataTransfer.getData("text/plain");
        if (fromId && fromId !== tree.id) onReorder(fromId, tree.id);
      }}
      style={{
        background: isComplete ? "rgba(134,239,172,0.06)" : P.card,
        border: `1px solid ${cardDragOver ? "rgba(168,85,247,0.9)" : isComplete ? "rgba(134,239,172,0.4)" : P.border}`,
        borderRadius:16, padding: desktop ? 18 : 14, marginBottom:12,
        position:"relative", overflow:"hidden",
        transition:"border-color 0.3s, background 0.5s, box-shadow 0.3s, transform 0.18s cubic-bezier(.34,1.56,.64,1)",
        animation:"cardEnter 0.65s cubic-bezier(0.34, 1.56, 0.64, 1) both",
        boxShadow: isComplete ? "0 6px 24px rgba(134,239,172,0.12)" : "0 4px 18px rgba(0,0,0,0.18)",
        cursor:"grab",
      }}>
      {isComplete && <Confetti/>}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${isComplete ? "rgba(134,239,172,0.2)" : P.border}` }}>
        <span style={{ display:"flex", alignItems:"center", flexShrink:0, animation: isComplete ? "breathe 1.8s ease-in-out infinite" : "floatIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}>
          <Emoji3D char={isComplete ? "🎉" : (tree.icon || "🌱")} size={30}/>
        </span>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize: desktop ? 15 : 13, color: isComplete ? "#86efac" : P.txt, whiteSpace:"normal", wordBreak:"break-word", lineHeight:1.3, transition:"color 0.4s" }}>
            {tree.title}
          </div>
          <div style={{ fontSize:10, color: isComplete ? "#86efac" : P.muted, marginTop:1, transition:"color 0.4s" }}>
            {isComplete ? "✅ ¡Completado!" : `${tDone}/${tTotal} tareas`}
          </div>
        </div>
        <button onClick={() => onDeleteTree(tree.id)} style={{ background:"rgba(239,68,68,0.35)", border:"1px solid rgba(239,68,68,0.4)", borderRadius:8, padding:"6px 12px", cursor:"pointer", display:"flex", alignItems:"center", gap:4, transition:"all 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.5)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.35)"; }}
        >
          <Trash2 size={13} color="#fca5a5"/>
          <span style={{ fontSize:10, color:"#fca5a5", fontWeight:700 }}>Árbol</span>
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
        <Node key={c.id} node={c} done={done} expanded={expanded} desktop={desktop} scheduled={scheduled} onToggle={onToggle} onExpand={onExpand} onDelete={onDeleteNode} onReorder={onReorder} onSchedule={onSchedule} onPriority={onPriority}/>
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
  const [view, setView] = useState<"dashboard" | "chat" | "vision">("dashboard");
  const [desktop, setDesktop] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle"|"saving"|"saved"|"error">("idle");
  const [hydrated, setHydrated] = useState(false);
  const [notifStatus, setNotifStatus] = useState<"idle"|"enabled"|"denied"|"unsupported">("idle");
  const [notifFreq, setNotifFreq] = useState(3); // horas
  const [showFreqPicker, setShowFreqPicker] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showMotivation, setShowMotivation] = useState(false);

  // ── Toast de motivación al ver tareas ────────────────────────────────────────
  const TASK_TOASTS = [
    "¡Conejita, vengaaaa! 🔥 Que las tareas llevan horas esperándote",
    "¡Ostia chaval! ¿A qué esperas? ¡Las tareas te necesitan! 💪",
    "¡Venga, venga! Que no muerden... bueno, quizás un poco 🐰",
    "Cada tarea que terminas me enamora más de ti 💜",
    "El que programó esto estaría muy orgulloso de verte lograr tus metas 🥹",
    "Eres tan bonita cuando eres productiva... y siempre 💝",
  ];
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((pending: number) => {
    if (pending === 0) return;
    const msg = TASK_TOASTS[Math.floor(Math.random() * TASK_TOASTS.length)];
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 4000);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Semáforo de prioridad ────────────────────────────────────────────────────
  const cyclePriority = useCallback((id: string) => {
    setTrees(prev => {
      function cycle(nodes: TreeNode[]): TreeNode[] {
        return nodes.map(n => n.id === id
          ? { ...n, priority: nextPriority(n.priority ?? null) }
          : { ...n, children: cycle(n.children || []) }
        );
      }
      return cycle(prev);
    });
  }, []);

  const reanalyzePriorities = useCallback(() => {
    setTrees(prev => prev.map(t => assignPriorities({ ...t, priority: undefined, children: (t.children || []).map(c => ({ ...c, priority: undefined })) })));
  }, []);

  // ── Google Calendar ──────────────────────────────────────────────────────────
  const [gcalToken, setGcalToken] = useState<string | null>(null);
  const [gcalClientId, setGcalClientId] = useState("");
  const [gcalIdInput, setGcalIdInput] = useState("");
  const [scheduled, setScheduled] = useState<Record<string, boolean>>({});
  const [calNode, setCalNode] = useState<TreeNode | null>(null);
  const [calDate, setCalDate] = useState("");
  const [calTime, setCalTime] = useState("09:00");
  const [calCreating, setCalCreating] = useState(false);
  const [calMsg, setCalMsg] = useState<{ type: "ok"|"err"; text: string } | null>(null);
  const [calRecurring, setCalRecurring] = useState(false);
  const [calDays, setCalDays] = useState(7);
  const [showClientIdGuide, setShowClientIdGuide] = useState(false);
  const gcalClientRef = useRef<{ requestAccessToken: () => void } | null>(null);

  const CAT_MSGS = [
    "¡Te amo! 💜",
    "¡Eres la mejor! 🌟",
    "¡Vas muy bien! 🚀",
    "¡Sigue así! 💪",
    "¡Te adoro! 🐰",
    "¡Imparable! ✨",
    "¡Orgullo total! 🎉",
    "¡Crack! 🔥",
    "¡Eres increíble! 💫",
    "¡Yo creía en ti! 🥹",
    "¡Nada te detiene! ⚡",
    "¡Eres mi favorita! 💝",
    "¡Qué máquina! 🤩",
    "¡Lo sabía! 🌸",
    "¡Dios mío qué buena! 😍",
    "정말 독특하다 🇰🇷✨",
    "Ti amo, sei sempre il migliore 🇮🇹💜",
    "Tu es toujours incroyable, n'en doute pas 🇫🇷🌟",
    "Toma, te ganaste un tulipán 🌷",
    "¡Eres una absoluta campeona! 🏆",
    "¡Qué energía tan bonita la tuya! 🌈",
    "¡El universo está orgulloso de ti! 🌌",
    "¡Cada tarea cuenta, y tú las cuentas todas! 🥰",
  ];
  const [showCat, setShowCat] = useState(false);
  const [catMsg, setCatMsg] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatEnd = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const catTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cargar Client ID guardado y token en cache al montar
  useEffect(() => {
    const saved = localStorage.getItem(GCAL_ID_KEY) || GCAL_CLIENT_ID_ENV;
    if (saved) setGcalClientId(saved);

    // Recuperar token guardado si aún no expiró
    try {
      const raw = localStorage.getItem(GCAL_TOK_KEY);
      if (raw) {
        const { token, expiresAt } = JSON.parse(raw);
        if (token && expiresAt > Date.now()) setGcalToken(token);
      }
    } catch { /* ok */ }
  }, []);

  // Inicializar Google Identity Services cuando tengamos un Client ID
  useEffect(() => {
    if (!gcalClientId) return;
    const initGIS = () => {
      const g = (window as unknown as { google: { accounts: { oauth2: { initTokenClient: (cfg: unknown) => { requestAccessToken: () => void } } } } }).google;
      gcalClientRef.current = g.accounts.oauth2.initTokenClient({
        client_id: gcalClientId,
        scope: "https://www.googleapis.com/auth/calendar.events",
        callback: (resp: { access_token?: string; expires_in?: number }) => {
          if (resp.access_token) {
            setGcalToken(resp.access_token);
            const expiresAt = Date.now() + (resp.expires_in ?? 3600) * 1000 - 60_000;
            localStorage.setItem(GCAL_TOK_KEY, JSON.stringify({ token: resp.access_token, expiresAt }));
          }
        },
      });
    };
    if ((window as unknown as { google?: unknown }).google) {
      initGIS();
    } else {
      const existing = document.querySelector('script[src*="accounts.google.com/gsi"]');
      if (!existing) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.onload = initGIS;
        document.head.appendChild(script);
      } else {
        existing.addEventListener("load", initGIS);
      }
    }
  }, [gcalClientId]);

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
    // Mostrar bienvenida solo la primera vez (v3 incluye Vision Board y guía Calendar)
    if (!localStorage.getItem("conjita-welcome-v3")) {
      setTimeout(() => setShowWelcome(true), 800);
    }
    // Mensaje motivacional — una vez cada 8 días
    const lastMotiv = localStorage.getItem("conjita-motiv-last");
    const eightDays = 8 * 24 * 60 * 60 * 1000;
    if (!lastMotiv || Date.now() - Number(lastMotiv) >= eightDays) {
      setTimeout(() => setShowMotivation(true), 4000);
    }
  }, []);

  // Mostrar toast solo si hay tareas URGENTES (prioridad alta) pendientes
  useEffect(() => {
    if (view !== "dashboard" || !hydrated) return;
    function hasUrgentPending(node: TreeNode): boolean {
      if (!node.children || node.children.length === 0) return node.priority === "high" && !done[node.id];
      return node.children.some(c => hasUrgentPending(c));
    }
    const hasUrgent = trees.some(t => hasUrgentPending(t));
    const timer = setTimeout(() => showToast(hasUrgent ? 1 : 0), 2500);
    return () => clearTimeout(timer);
  }, [view, hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // ── Notificaciones Web Push ─────────────────────────────────────────────────
  const VAPID_PUBLIC = "BPPYfrwEE2qdjYfKo6-iZ0sEYuIvjW0N6eFe9UI_EtPkIzWj1XZFM_u9A1gEgqugn4P8dr1Dp0YeqWag18-LUSs";

  function urlB64ToUint8Array(b64: string) {
    const pad = "=".repeat((4 - b64.length % 4) % 4);
    const base64 = (b64 + pad).replace(/-/g, "+").replace(/_/g, "/");
    const raw = atob(base64);
    return Uint8Array.from(Array.from(raw).map(c => c.charCodeAt(0)));
  }

  // Detectar estado guardado
  useEffect(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setNotifStatus("unsupported"); return;
    }
    const savedFreq = localStorage.getItem("conjita-notif-freq");
    if (savedFreq) setNotifFreq(Number(savedFreq));
    if (Notification.permission === "granted") {
      const saved = localStorage.getItem("conjita-notif");
      if (saved === "enabled") setNotifStatus("enabled");
    } else if (Notification.permission === "denied") {
      setNotifStatus("denied");
    }
  }, []);

  // Sincronizar tareas con el servidor cuando cambian
  useEffect(() => {
    if (!hydrated || notifStatus !== "enabled") return;
    fetch("/api/tasks-sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trees, done, freqHours: notifFreq }),
    }).catch(() => {});
  }, [trees, done, hydrated, notifStatus, notifFreq]);

  const enableNotifications = useCallback(async (freq: number) => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setNotifStatus("unsupported"); return;
    }
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") { setNotifStatus("denied"); setShowFreqPicker(false); return; }

      const sw = await navigator.serviceWorker.ready;
      const subscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC),
      });

      await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription, trees, done, freqHours: freq }),
      });

      setNotifFreq(freq);
      localStorage.setItem("conjita-notif", "enabled");
      localStorage.setItem("conjita-notif-freq", String(freq));
      setNotifStatus("enabled");
    } catch (e) {
      console.error("Push subscribe error:", e);
    }
    setShowFreqPicker(false);
  }, [trees, done, VAPID_PUBLIC]);

  const toggleNotifications = useCallback(async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setNotifStatus("unsupported"); return;
    }
    if (notifStatus === "enabled") {
      // Desuscribir
      try {
        const sw = await navigator.serviceWorker.ready;
        const sub = await sw.pushManager.getSubscription();
        if (sub) await sub.unsubscribe();
      } catch {}
      localStorage.removeItem("conjita-notif");
      setNotifStatus("idle");
      return;
    }
    setShowFreqPicker(true);
  }, [notifStatus]);

  const totalT = trees.reduce((s, t) => s + totalNodes(t), 0);
  const doneT = trees.reduce((s, t) => s + doneNodes(t, done), 0);
  const pct = totalT ? Math.round((doneT / totalT) * 100) : 0;

  const toggle = useCallback((id: string) => {
    setDone((p) => {
      const wasDone = p[id];
      if (!wasDone) {
        // Tarea recién completada → mostrar el gato
        if (catTimer.current) clearTimeout(catTimer.current);
        setCatMsg(CAT_MSGS[Math.floor(Math.random() * CAT_MSGS.length)]);
        setShowCat(true);
        catTimer.current = setTimeout(() => setShowCat(false), 2800);
      }
      return { ...p, [id]: !wasDone };
    });
  }, []);
  const expandToggle = useCallback((id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] })), []);

  const handleReorder = useCallback((dragId: string, dropId: string) => {
    setTrees((prev) => reorderSiblings(prev, dragId, dropId));
  }, []);

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

    const sys = `Eres Conjita, un asistente que extrae tareas de mensajes en lenguaje natural y los convierte en árboles JSON jerárquicos.

El usuario puede escribir de forma informal, conversacional, con errores, mezclar temas y usar referencias implícitas. Tu trabajo es INTERPRETAR el mensaje completo y extraer TODAS las tareas con su jerarquía correcta.

RESPONDE SOLO CON JSON entre triple backticks. Nada más.

REGLA MÁS IMPORTANTE — JERARQUÍA:
Cuando el usuario describe un OBJETIVO y luego lista los PASOS para lograrlo, el objetivo es el padre y cada paso es un hijo (subtarea).
Frases que indican pasos de un objetivo: "para eso tengo que...", "primero... luego... después...", "los pasos son...", "tengo que hacer X, Y, Z para lograr..."

EJEMPLO 1 — Pasos explícitos de un objetivo:
Entrada: "tengo que hacerme millonario, para eso tengo que comprar unas papas, venderlas, luego comprar más, venderlas de nuevo y contar el dinero"
Salida correcta:
\`\`\`json
{
  "trees": [
    {
      "title": "Finanzas",
      "icon": "💰",
      "children": [
        {
          "title": "Hacerse millonario vendiendo papas",
          "icon": "🥔",
          "children": [
            {"title": "Comprar papas", "icon": "🛒", "children": []},
            {"title": "Vender las papas", "icon": "💵", "children": []},
            {"title": "Comprar más papas con las ganancias", "icon": "🛒", "children": []},
            {"title": "Vender las papas de nuevo", "icon": "💵", "children": []},
            {"title": "Contar el dinero acumulado", "icon": "💰", "children": []}
          ]
        }
      ]
    }
  ]
}
\`\`\`

EJEMPLO 2 — Múltiples áreas y tareas mezcladas:
Entrada: "Tengo que tomarme una pastilla a las 9, mirar el trabajo de riesgo en banca y enviarle al profe los comprobantes médicos, también al de Macros en excel y ver su clase de macros. Revisar los estados financieros de pacasmayo."
Salida correcta:
\`\`\`json
{
  "trees": [
    {
      "title": "Salud",
      "icon": "🏥",
      "children": [
        {"title": "Tomar pastilla a las 9am", "icon": "💊", "children": []}
      ]
    },
    {
      "title": "Universidad",
      "icon": "🎓",
      "children": [
        {
          "title": "Entregar trabajo de riesgo en banca",
          "icon": "📊",
          "children": [
            {"title": "Revisar trabajo antes de enviar", "icon": "🔍", "children": []},
            {"title": "Enviar al profesor", "icon": "✉️", "children": []}
          ]
        },
        {
          "title": "Pendientes con profesor de Macros Excel",
          "icon": "💻",
          "children": [
            {"title": "Enviar comprobantes médicos", "icon": "📄", "children": []},
            {"title": "Ver clase de Macros para ponerse al día", "icon": "▶️", "children": []}
          ]
        },
        {"title": "Revisar estados financieros Pacasmayo", "icon": "📈", "children": []}
      ]
    }
  ]
}
\`\`\`

EJEMPLO 3 — Lista sin etiquetas: SIEMPRE infiere el área por el tipo de tarea:
Entrada: "me toca hacer ejercicio, hablar con mi jefe sobre el aumento, comprar frutas, ir a la farmacia, llamar al banco y organizar mis fotos del cel"
Salida correcta:
\`\`\`json
{
  "trees": [
    {
      "title": "Salud",
      "icon": "🏥",
      "children": [
        {"title": "Hacer ejercicio", "icon": "🏋️", "children": []},
        {"title": "Ir a la farmacia", "icon": "💊", "children": []},
        {"title": "Comprar frutas", "icon": "🍎", "children": []}
      ]
    },
    {
      "title": "Trabajo",
      "icon": "💼",
      "children": [
        {"title": "Hablar con el jefe sobre el aumento", "icon": "💬", "children": []}
      ]
    },
    {
      "title": "Finanzas",
      "icon": "🏦",
      "children": [
        {"title": "Llamar al banco", "icon": "📞", "children": []}
      ]
    },
    {
      "title": "Personal",
      "icon": "🌸",
      "children": [
        {"title": "Organizar fotos del celular", "icon": "📱", "children": []}
      ]
    }
  ]
}
\`\`\`

REGLAS GENERALES:
- Extrae TODAS las tareas aunque el mensaje sea informal o confuso
- SIEMPRE separa en múltiples árboles por área aunque el usuario no lo diga explícitamente
- Infiere el área por el tipo de tarea: médico/pastillas/ejercicio → Salud, jefe/reunión/trabajo → Trabajo, banco/dinero/pagar → Finanzas, mamá/amigos/cuarto → Personal, etc.
- Un árbol por área (Salud, Universidad, Trabajo, Finanzas, Personal, Hogar, etc.)
- NUNCA metas tareas de distintas áreas en un mismo árbol
- Cuando hay pasos explícitos para un objetivo → el objetivo es el PADRE y los pasos son HIJOS
- Títulos: VERBO + OBJETO, claros y concisos, sin emojis
- 1 emoji por nodo
- Si no hay tareas: {"trees":[]}
- Solo JSON entre backticks`;

    try {
      const res = await fetch("/api/chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({ model:"gpt-4o-mini", max_tokens:2500, system:sys, messages:[{ role:"user", content:msg }] }),
      });
      const data = await res.json();
      console.log("API response:", data.content);
      const newTrees = parseResponse(data.content);
      if (!newTrees || newTrees.length === 0) {
        setChatLog((p) => [...p, { role:"ai", text:"No detecté tareas concretas. Intenta algo como: \"preparar informe, llamar cliente, revisar correos\"" }]);
        setLoading(false);
        return;
      }
      if (newTrees.length > 0) {
        const stamped = newTrees.map((t) => assignPriorities(stampIds(t, 0)));
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
    } catch (e) {
      const isNetwork = e instanceof TypeError && e.message.includes("fetch");
      setChatLog((p) => [...p, { role:"ai", text: isNetwork ? "Sin conexión a internet. Revisa tu red e intenta de nuevo." : "Algo salió mal. Intenta de nuevo en unos segundos." }]);
    }
    setLoading(false);
  }

  // Guardar Client ID ingresado por la usuaria
  function saveGcalClientId() {
    const id = gcalIdInput.trim();
    if (!id) return;
    localStorage.setItem(GCAL_ID_KEY, id);
    setGcalClientId(id);
    setGcalIdInput("");
  }

  // Abrir modal de calendario para una tarea
  function openCalModal(node: TreeNode) {
    setCalNode(node);
    setCalMsg(null);
    setCalRecurring(false);
    setCalDays(7);
    // Fecha por defecto: mañana
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setCalDate(tomorrow.toISOString().split("T")[0]);
    setCalTime("09:00");
  }

  // Crear evento en Google Calendar
  async function createCalendarEvent() {
    if (!calNode || !calDate) return;
    if (!gcalToken) {
      gcalClientRef.current?.requestAccessToken();
      return;
    }
    setCalCreating(true);
    setCalMsg(null);
    try {
      const start = new Date(`${calDate}T${calTime}:00`);
      const end = new Date(start.getTime() + 60 * 60 * 1000); // +1 hora
      const fmt = (d: Date) => d.toISOString();
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: { Authorization: `Bearer ${gcalToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          summary: calNode.title,
          description: "Tarea de Conjita's Dashboard 🐰",
          start: { dateTime: fmt(start), timeZone: tz },
          end: { dateTime: fmt(end), timeZone: tz },
          ...(calRecurring ? { recurrence: [`RRULE:FREQ=DAILY;COUNT=${calDays}`] } : {}),
        }),
      });
      if (!res.ok) {
        if (res.status === 401) {
          setGcalToken(null);
          gcalClientRef.current?.requestAccessToken();
          setCalCreating(false);
          return;
        }
        throw new Error("Error al crear evento");
      }
      setScheduled((p) => ({ ...p, [calNode.id]: true }));
      setCalMsg({ type: "ok", text: calRecurring ? `✅ Evento creado por ${calDays} días en tu Google Calendar` : "✅ Evento creado en tu Google Calendar" });
      setTimeout(() => setCalNode(null), 1800);
    } catch {
      setCalMsg({ type: "err", text: "❌ No se pudo crear el evento. Intenta de nuevo." });
    } finally {
      setCalCreating(false);
    }
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
    <IconContext.Provider value={{ weight: "duotone", mirrored: false }}>
    <div style={{ minHeight:"100dvh", background:P.bg, fontFamily:"'Poppins',sans-serif", color:P.txt, display:"flex", flexDirection:"column", maxWidth:maxW, margin:"0 auto", position:"relative" }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes blink{0%,100%{opacity:1;}50%{opacity:0.2;}}
        @keyframes pop{0%{transform:scale(1)}40%{transform:scale(1.2)}70%{transform:scale(0.95)}100%{transform:scale(1)}}
        @keyframes shimmer{0%,100%{opacity:0.7}50%{opacity:1}}
        @keyframes confetti{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(-90px) rotate(720deg);opacity:0}}
        @keyframes slideIn{from{opacity:0;transform:translateY(30px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes slideInStagger{0%{opacity:0;transform:translateX(-20px) scale(0.98)}to{opacity:1;transform:translateX(0) scale(1)}}
        @keyframes fadeGlow{from{box-shadow:0 0 0 0 rgba(168,85,247,0.5)}to{box-shadow:0 0 0 8px rgba(168,85,247,0)}}
        /* ── Nuevas animaciones bonitas ── */
        @keyframes floatIn{0%{opacity:0;transform:translateY(22px) scale(0.96);filter:blur(6px)}100%{opacity:1;transform:translateY(0) scale(1);filter:blur(0)}}
        @keyframes cardEnter{0%{opacity:0;transform:translateY(28px) scale(0.94)}60%{opacity:1;transform:translateY(-4px) scale(1.01)}100%{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes checkBurst{0%{transform:scale(1)}30%{transform:scale(1.45) rotate(-8deg)}55%{transform:scale(0.85) rotate(4deg)}100%{transform:scale(1) rotate(0)}}
        @keyframes priorityPulse{0%,100%{box-shadow:0 0 6px 0 var(--pc),0 0 0 0 var(--pc)}50%{box-shadow:0 0 12px 2px var(--pc),0 0 0 4px rgba(239,68,68,0.18)}}
        @keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
        @keyframes sparkleSpin{0%{transform:rotate(0) scale(1);opacity:0.8}50%{transform:rotate(180deg) scale(1.25);opacity:1}100%{transform:rotate(360deg) scale(1);opacity:0.8}}
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes tabGlow{0%{box-shadow:0 0 0 0 rgba(219,39,119,0.6)}100%{box-shadow:0 0 0 7px rgba(219,39,119,0)}}
        @keyframes toastBounce{0%{opacity:0;transform:translateX(-50%) translateY(24px) scale(0.9)}60%{opacity:1;transform:translateX(-50%) translateY(-6px) scale(1.02)}100%{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        textarea,input{font-family:'Poppins',sans-serif;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(168,85,247,0.3);border-radius:4px;}
        .progress-circle{transition:stroke-dashoffset 0.7s cubic-bezier(.4,0,.2,1);}
        .progress-bar{transition:width 0.6s cubic-bezier(.34,1.56,.64,1);}
        /* Micro-interacciones globales en botones */
        button{transition:transform 0.12s cubic-bezier(.34,1.56,.64,1), filter 0.15s, box-shadow 0.2s, background 0.2s;}
        button:active{transform:scale(0.92);}
        @media(hover:hover){button:hover{filter:brightness(1.12);}}
        .tap-lift{transition:transform 0.18s cubic-bezier(.34,1.56,.64,1), box-shadow 0.2s;}
        @media(hover:hover){.tap-lift:hover{transform:translateY(-2px);}}
        .grad-anim{background-size:200% 200%;animation:gradientShift 5s ease infinite;}
        @media(prefers-reduced-motion:reduce){*{animation-duration:0.01ms!important;animation-iteration-count:1!important;}}
      `}</style>

      {/* Header */}
      <header style={{ padding: desktop ? "14px 28px" : "12px 14px", paddingTop: desktop ? 14 : "calc(12px + env(safe-area-inset-top))", background:"rgba(13,10,26,0.97)", backdropFilter:"blur(10px)", borderBottom:`1px solid ${P.border}`, display:"flex", alignItems:"center", gap: desktop ? 10 : 7, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="grad-anim" style={{ fontFamily:"'Syne',sans-serif", fontSize: desktop ? 22 : 17, fontWeight:800, backgroundImage:`linear-gradient(135deg,${P.p1},${P.p3},${P.p1})`, WebkitBackgroundClip:"text", backgroundClip:"text", WebkitTextFillColor:"transparent", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
            Conjita&apos;s Dashboard
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:1 }}>
            <div style={{ fontSize:11, color:P.muted, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
              {totalT ? `${doneT} de ${totalT} tareas • ${pct}%` : "Escribe tus tareas"}
            </div>
            {saveStatus === "saving" && <div style={{ fontSize:10, color:P.muted, display:"flex", alignItems:"center", gap:3, flexShrink:0 }}><RefreshCw size={10} style={{ animation:"spin 0.7s linear infinite" }}/>Guardando</div>}
            {saveStatus === "saved" && <div style={{ fontSize:10, color:"#86efac", display:"flex", alignItems:"center", gap:3, flexShrink:0 }}><Cloud size={10}/>Guardado</div>}
          </div>
        </div>
        {/* Botón de notificaciones */}
        <button
          onClick={toggleNotifications}
          title={notifStatus === "enabled" ? "Desactivar recordatorios" : notifStatus === "denied" ? "Activa notificaciones en ajustes del navegador" : "Activar recordatorios cada 3h"}
          style={{
            background: notifStatus === "enabled" ? "linear-gradient(135deg,#9333ea,#db2777)" : "rgba(255,255,255,0.06)",
            border: `1px solid ${notifStatus === "enabled" ? "transparent" : P.border}`,
            borderRadius: 10, padding: desktop ? 7 : 9, cursor: notifStatus === "denied" ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", position: "relative", flexShrink:0,
            opacity: notifStatus === "unsupported" ? 0.4 : 1,
          }}
        >
          {notifStatus === "enabled"
            ? <Bell size={15} color="#fff"/>
            : <BellOff size={15} color={P.muted}/>
          }
          {notifStatus === "enabled" && (
            <span style={{ position:"absolute", top:4, right:4, width:6, height:6, borderRadius:"50%", background:"#86efac", boxShadow:"0 0 4px #86efac" }}/>
          )}
        </button>
        {/* Toggle vista escritorio — solo visible en escritorio */}
        {desktop && (
          <button onClick={() => setDesktop((d) => !d)} style={{ background:"rgba(255,255,255,0.06)", border:`1px solid ${P.border}`, borderRadius:10, padding:7, color:P.txt, cursor:"pointer", display:"flex", alignItems:"center", flexShrink:0 }}>
            <Smartphone size={15}/>
          </button>
        )}
        <div style={{ display:"flex", background:"rgba(255,255,255,0.06)", borderRadius:28, padding:3, flexShrink:0 }}>
          {([{v:"dashboard",icon:"📊"},{v:"chat",icon:"💬"},{v:"vision",icon:"🌟"}] as const).map(({v,icon}) => (
            <button key={v} onClick={() => { setView(v); setMenuOpen(false); }} style={{ background: view===v ? `linear-gradient(135deg,${P.p1},${P.p3})` : "none", border:"none", borderRadius:22, padding: desktop ? "5px 11px" : "7px 12px", color: view===v ? "#fff" : P.muted, fontSize: desktop ? 11 : 14, fontWeight:700, cursor:"pointer", lineHeight:1, transform: view===v ? "scale(1.08)" : "scale(1)", animation: view===v ? "tabGlow 0.5s ease-out" : "none" }}>{icon}</button>
          ))}
        </div>
        <button onClick={() => setMenuOpen((m) => !m)} style={{ background:"rgba(255,255,255,0.06)", border:"none", borderRadius:10, padding: desktop ? 7 : 9, color:P.txt, cursor:"pointer", flexShrink:0, display:"flex", alignItems:"center" }}>
          {menuOpen ? <X size={16}/> : <Menu size={16}/>}
        </button>
      </header>

      {menuOpen && (
        <div style={{ position:"fixed", top: desktop ? 62 : "calc(64px + env(safe-area-inset-top))", right: desktop ? "calc(50% - 480px + 12px)" : 12, background:"rgba(13,10,26,0.98)", border:`1px solid ${P.border}`, borderRadius:14, padding:8, zIndex:200, minWidth:210, boxShadow:"0 12px 40px rgba(0,0,0,0.8)" }}>
          <div style={{ padding:"8px 12px 6px", fontSize:10, color:P.muted, fontWeight:700 }}>MEMORIA</div>
          <div style={{ padding:"4px 12px 10px", fontSize:11, color:P.txt, borderBottom:`1px solid ${P.border}` }}>
            💾 Tus tareas se guardan automáticamente.
          </div>
          <div style={{ padding:"8px 12px 4px", fontSize:10, color:P.muted, fontWeight:700 }}>RECORDATORIOS</div>
          <button
            onClick={() => { toggleNotifications(); setMenuOpen(false); }}
            style={{ display:"flex", alignItems:"center", gap:8, width:"100%", background:"none", border:"none", color: notifStatus === "enabled" ? "#86efac" : P.txt, padding:"9px 12px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600 }}
          >
            {notifStatus === "enabled" ? <Bell size={13}/> : <BellOff size={13}/>}
            {notifStatus === "enabled" ? `Desactivar (cada ${notifFreq < 1 ? "30 min" : notifFreq + "h"})` : "Activar recordatorios"}
          </button>
          {notifStatus === "denied" && (
            <div style={{ padding:"4px 12px 8px", fontSize:10, color:"#f87171" }}>
              ⚠️ Activa notificaciones en los ajustes del navegador/iPhone.
            </div>
          )}
          <div style={{ padding:"8px 12px 4px", fontSize:10, color:P.muted, fontWeight:700, borderTop:`1px solid ${P.border}`, marginTop:4 }}>PRIORIDADES</div>
          <button
            onClick={() => { reanalyzePriorities(); setMenuOpen(false); }}
            style={{ display:"flex", alignItems:"center", gap:8, width:"100%", background:"none", border:"none", color:P.txt, padding:"9px 12px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600 }}
          >
            <span style={{ display:"flex", gap:3 }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:"#ef4444", display:"inline-block", boxShadow:"0 0 5px #ef4444" }}/>
              <span style={{ width:8, height:8, borderRadius:"50%", background:"#f59e0b", display:"inline-block", boxShadow:"0 0 5px #f59e0b" }}/>
              <span style={{ width:8, height:8, borderRadius:"50%", background:"#22c55e", display:"inline-block", boxShadow:"0 0 5px #22c55e" }}/>
            </span>
            Re-analizar prioridades
          </button>
          <button onClick={reset} style={{ display:"flex", alignItems:"center", gap:8, width:"100%", background:"none", border:"none", color:"#f87171", padding:"9px 12px", borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:600, marginTop:4 }}>
            <RotateCcw size={13}/> Borrar todo y memoria
          </button>
        </div>
      )}

      {/* Banner recordatorio de notificaciones */}
      {notifStatus === "idle" && hydrated && (
        <div style={{ padding: desktop ? "10px 28px" : "10px 14px", background:"rgba(168,85,247,0.08)", borderBottom:`1px solid ${P.border}`, display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:18 }}>🔔</span>
          <div style={{ flex:1 }}>
            <p style={{ margin:0, fontSize:11, fontWeight:600, color:P.txt }}>Activa los recordatorios</p>
            <p style={{ margin:0, fontSize:10, color:P.muted }}>Te avisamos cada cierto tiempo para que no olvides tus tareas</p>
          </div>
          <button
            onClick={() => setShowFreqPicker(true)}
            style={{ background:`linear-gradient(135deg,${P.p1},${P.p3})`, border:"none", borderRadius:20, padding:"6px 14px", color:"#fff", fontSize:11, fontWeight:700, cursor:"pointer", flexShrink:0 }}
          >
            Activar
          </button>
        </div>
      )}

      {/* Modal selector de frecuencia */}
      {showFreqPicker && (
        <div
          onClick={() => setShowFreqPicker(false)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.6)", zIndex:300, display:"flex", alignItems:"flex-end", justifyContent:"center" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background:"#1a0f2e", border:`1px solid ${P.border}`, borderRadius:"24px 24px 0 0", padding:"24px 20px 36px", width:"100%", maxWidth:maxW, animation:"slideIn 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:28, marginBottom:6 }}>🔔</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:17, color:P.txt }}>¿Cada cuánto te recordamos?</div>
              <div style={{ fontSize:12, color:P.muted, marginTop:4 }}>Solo te avisamos si tienes tareas pendientes</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:20 }}>
              {[
                { label:"30 min", val:0.5 },
                { label:"1 hora", val:1 },
                { label:"2 horas", val:2 },
                { label:"3 horas", val:3 },
                { label:"4 horas", val:4 },
                { label:"6 horas", val:6 },
              ].map(({ label, val }) => (
                <button
                  key={val}
                  onClick={() => setNotifFreq(val)}
                  style={{
                    background: notifFreq === val ? `linear-gradient(135deg,${P.p1},${P.p3})` : "rgba(168,85,247,0.1)",
                    border: `1px solid ${notifFreq === val ? "transparent" : P.border}`,
                    borderRadius:14, padding:"12px 8px", color: notifFreq === val ? "#fff" : P.txt,
                    fontSize:13, fontWeight:700, cursor:"pointer", transition:"all 0.2s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => enableNotifications(notifFreq)}
              style={{ width:"100%", background:`linear-gradient(135deg,${P.p1},${P.p3})`, border:"none", borderRadius:16, padding:"14px", color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"'Syne',sans-serif" }}
            >
              Activar recordatorios ✨
            </button>
            <button
              onClick={() => setShowFreqPicker(false)}
              style={{ width:"100%", background:"none", border:"none", color:P.muted, fontSize:12, cursor:"pointer", marginTop:12, padding:8 }}
            >
              Ahora no
            </button>
          </div>
        </div>
      )}

      <main style={{ flex:1, overflowY: view === "vision" ? "hidden" : "auto", WebkitOverflowScrolling:"touch", padding: view === "vision" ? 0 : desktop ? "20px 28px 150px" : "14px 14px", paddingBottom: view === "vision" ? 0 : desktop ? 150 : "calc(120px + env(safe-area-inset-bottom))", display: view === "vision" ? "flex" : "block", flexDirection: "column" }}>

        {/* VISION BOARD */}
        {view === "vision" && <VisionBoard/>}

        {/* DASHBOARD */}
        {view === "dashboard" && (
          <div style={{ display: desktop && trees.length > 0 ? "grid" : "block", gridTemplateColumns: desktop && trees.length > 0 ? "1fr 1fr" : "1fr", gap: desktop ? 16 : 0 }}>
            {trees.length > 0 && (
              <div style={{ gridColumn: desktop ? "1 / -1" : undefined, background:"linear-gradient(135deg,rgba(124,58,237,0.12),rgba(236,72,153,0.08))", border:`1px solid ${P.border}`, borderRadius:16, padding:"16px 20px", marginBottom: desktop ? 0 : 14, display:"flex", alignItems:"center", gap:14, animation:"floatIn 0.55s cubic-bezier(0.34,1.56,0.64,1) both" }}>
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
                <div style={{ marginBottom:12, animation:"breathe 2.5s ease-in-out infinite" }}><Emoji3D char="🌱" size={56}/></div>
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
                  scheduled={scheduled} onToggle={toggle} onExpand={expandToggle} onDeleteNode={deleteNode}
                  onDeleteTree={deleteTree} onReorder={handleReorder} onSchedule={openCalModal} onPriority={cyclePriority}/>
              ))
            )}
          </div>
        )}

        {/* CHAT */}
        {view === "chat" && (
          <div>
            {chatLog.length === 0 ? (
              <div style={{ textAlign:"center", padding:"36px 18px" }}>
                <div style={{ animation:"breathe 2.5s ease-in-out infinite" }}><Emoji3D char="💬" size={52}/></div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, color:P.txt, marginTop:10 }}>Cuéntame tus tareas</div>
                <div style={{ fontSize:12, color:P.muted, marginTop:6, lineHeight:1.8 }}>
                  Ejemplo:<br/>
                  <span style={{ color:P.p1 }}>&quot;Terminar informe del proyecto, revisar correos y preparar presentación&quot;</span>
                </div>
              </div>
            ) : chatLog.map((m, i) => (
              <div key={i} style={{ display:"flex", justifyContent: m.role==="user" ? "flex-end" : "flex-start", marginBottom:10, animation:"floatIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}>
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
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:maxW, background:"rgba(13,10,26,0.97)", backdropFilter:"blur(10px)", borderTop:`1px solid ${P.border}`, padding: desktop ? "12px 28px 18px" : "10px 14px", paddingBottom: desktop ? 18 : "calc(10px + env(safe-area-inset-bottom))", zIndex:100, display: view === "vision" ? "none" : "block" }}>
        <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
          <div style={{ flex:1, background:"rgba(255,255,255,0.05)", border:`1px solid ${P.borderHi}`, borderRadius:18, padding:"9px 14px", display:"flex", alignItems:"center", gap:7 }}>
            <Sparkles size={14} color={P.p1} style={{ animation:"sparkleSpin 3.5s ease-in-out infinite", flexShrink:0 }}/>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              onInput={(e) => { const t = e.currentTarget; t.style.height="auto"; t.style.height=Math.min(t.scrollHeight,90)+"px"; }}
              placeholder='Escribe tus tareas... (ej: "preparar reunión, revisar informe")'
              rows={1}
              style={{ flex:1, background:"none", border:"none", outline:"none", color:P.txt, fontSize:16, resize:"none", lineHeight:1.5, maxHeight:90, overflowY:"auto" }}
            />
          </div>
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            style={{ width:42, height:42, borderRadius:"50%", background: input.trim() && !loading ? `linear-gradient(135deg,${P.p1},${P.p3})` : "rgba(255,255,255,0.08)", border:"none", display:"flex", alignItems:"center", justifyContent:"center", cursor: input.trim() && !loading ? "pointer" : "not-allowed", flexShrink:0, boxShadow: input.trim() && !loading ? "0 4px 16px rgba(147,51,234,0.45)" : "none", animation: input.trim() && !loading ? "breathe 2s ease-in-out infinite" : "none" }}
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

      {/* 🐱 Gato celebración */}
      {showCat && (
        <div
          onClick={() => setShowCat(false)}
          style={{
            position:"fixed", bottom: desktop ? 100 : 90, left:"50%",
            transform:"translateX(-50%)", zIndex:999,
            background:"rgba(13,10,26,0.95)",
            border:"1px solid rgba(168,85,247,0.6)",
            borderRadius:24, padding:"14px 22px",
            display:"flex", alignItems:"center", gap:14,
            boxShadow:"0 8px 40px rgba(168,85,247,0.35)",
            animation:"toastBounce 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both",
            cursor:"pointer", maxWidth: 300, width:"calc(100% - 40px)",
            willChange:"transform, opacity",
          }}
        >
          <img
            src="https://media.tenor.com/AXJ16vpJy98AAAAj/danci-dancing-cat.gif"
            alt="dancing cat"
            style={{ width:64, height:64, borderRadius:14, flexShrink:0, objectFit:"cover", background:"rgba(168,85,247,0.15)" }}
          />
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#f0e6ff", fontSize:14, marginBottom:3 }}>
              ¡Tarea completada! 🎉
            </div>
            <div style={{ color:"#c084fc", fontSize:13, fontWeight:700, lineHeight:1.5 }}>
              {catMsg}
            </div>
          </div>
        </div>
      )}

      {/* Modal Google Calendar */}
      {calNode && (
        <div
          onClick={() => setCalNode(null)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.65)", zIndex:400, display:"flex", alignItems:"flex-end", justifyContent:"center" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background:"#1a0f2e", border:`1px solid ${P.border}`, borderRadius:"24px 24px 0 0", padding:"24px 20px 40px", width:"100%", maxWidth:maxW, animation:"slideIn 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            <div style={{ position:"relative", textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:28, marginBottom:6 }}>📅</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:16, color:P.txt }}>Agendar tarea</div>
              <div style={{ fontSize:12, color:P.muted, marginTop:4, padding:"0 16px", wordBreak:"break-word" }}>
                &ldquo;{calNode.title}&rdquo;
              </div>
              {/* Botón de ayuda siempre visible */}
              <button
                onClick={() => { setCalNode(null); setShowClientIdGuide(true); }}
                title="¿Cómo conectar Google Calendar?"
                style={{ position:"absolute", top:0, right:0, width:28, height:28, borderRadius:"50%", background:"rgba(168,85,247,0.2)", border:`1px solid ${P.border}`, color:"#c084fc", fontSize:13, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}
              >?</button>
            </div>

            {!gcalToken && (
              <div style={{ marginBottom:16, display:"flex", flexDirection:"column", gap:10 }}>
                {!gcalClientId ? (
                  /* ── Sin Client ID: mostrar input para pegarlo ── */
                  <div style={{ background:"rgba(26,15,46,0.8)", border:`1px solid ${P.border}`, borderRadius:14, padding:"14px 16px", display:"flex", flexDirection:"column", gap:10 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:P.txt }}>🗝️ Pega tu Google Client ID</div>
                    <div style={{ fontSize:11, color:P.muted, lineHeight:1.5 }}>Solo se guarda en tu dispositivo y no lo volverás a pedir.</div>
                    <input
                      value={gcalIdInput}
                      onChange={e => setGcalIdInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && saveGcalClientId()}
                      placeholder="624920945698-xxxx.apps.googleusercontent.com"
                      style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:`1px solid ${P.border}`, borderRadius:10, padding:"10px 12px", color:P.txt, fontSize:12, outline:"none", fontFamily:"'Poppins',sans-serif", boxSizing:"border-box" }}
                    />
                    <button
                      onClick={saveGcalClientId}
                      disabled={!gcalIdInput.trim()}
                      style={{ background:`linear-gradient(135deg,${P.p1},${P.p3})`, border:"none", borderRadius:10, padding:"11px", color:"#fff", fontSize:13, fontWeight:800, cursor:"pointer", opacity: gcalIdInput.trim() ? 1 : 0.5 }}
                    >
                      Guardar y conectar 🔗
                    </button>
                    <button
                      onClick={() => { setCalNode(null); setShowClientIdGuide(true); }}
                      style={{ background:"linear-gradient(135deg,rgba(168,85,247,0.18),rgba(219,39,119,0.14))", border:"1.5px solid rgba(168,85,247,0.5)", borderRadius:10, padding:"10px 14px", color:P.txt, fontSize:12, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:7, boxShadow:"0 0 10px rgba(168,85,247,0.18)" }}
                    >
                      <span style={{ fontSize:16 }}>❓</span> ¿Cómo me conecto? <span style={{ color:"#c084fc", textDecoration:"underline" }}>Ver guía</span>
                    </button>
                  </div>
                ) : (
                  /* ── Tiene Client ID pero aún no ha conectado ── */
                  <div style={{ background:"rgba(66,133,244,0.08)", border:"1px solid rgba(66,133,244,0.28)", borderRadius:12, padding:"12px 16px", fontSize:12, color:"#93c5fd", textAlign:"center" }}>
                    Toca el botón de abajo para autorizar con Google 👇
                  </div>
                )}
              </div>
            )}

            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:20 }}>
              <div>
                <label style={{ fontSize:11, color:P.muted, fontWeight:600, display:"block", marginBottom:5 }}>FECHA</label>
                <input
                  type="date"
                  value={calDate}
                  onChange={(e) => setCalDate(e.target.value)}
                  style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:`1px solid ${P.border}`, borderRadius:10, padding:"10px 14px", color:P.txt, fontSize:15, outline:"none", fontFamily:"'Poppins',sans-serif" }}
                />
              </div>
              <div>
                <label style={{ fontSize:11, color:P.muted, fontWeight:600, display:"block", marginBottom:5 }}>HORA</label>
                <input
                  type="time"
                  value={calTime}
                  onChange={(e) => setCalTime(e.target.value)}
                  style={{ width:"100%", background:"rgba(255,255,255,0.07)", border:`1px solid ${P.border}`, borderRadius:10, padding:"10px 14px", color:P.txt, fontSize:15, outline:"none", fontFamily:"'Poppins',sans-serif" }}
                />
              </div>
            </div>

            {/* Tarea repetitiva */}
            <div style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${P.border}`, borderRadius:12, padding:"12px 14px", marginBottom:16 }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:P.txt }}>🔁 Tarea repetitiva</div>
                  <div style={{ fontSize:11, color:P.muted, marginTop:2 }}>Repite el evento todos los días a la misma hora</div>
                </div>
                {/* Toggle */}
                <div
                  onClick={() => setCalRecurring(r => !r)}
                  style={{ width:44, height:24, borderRadius:12, background: calRecurring ? `linear-gradient(135deg,${P.p1},${P.p3})` : "rgba(255,255,255,0.12)", cursor:"pointer", position:"relative", transition:"background 0.3s", flexShrink:0 }}
                >
                  <div style={{ position:"absolute", top:3, left: calRecurring ? 23 : 3, width:18, height:18, borderRadius:"50%", background:"#fff", transition:"left 0.3s", boxShadow:"0 1px 4px rgba(0,0,0,0.3)" }}/>
                </div>
              </div>

              {calRecurring && (
                <div style={{ marginTop:14 }}>
                  <label style={{ fontSize:11, color:P.muted, fontWeight:600, display:"block", marginBottom:8 }}>¿CUÁNTOS DÍAS?</label>
                  <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                    {[3, 5, 7, 10, 14, 21, 30].map(d => (
                      <button
                        key={d}
                        onClick={() => setCalDays(d)}
                        style={{ background: calDays === d ? `linear-gradient(135deg,${P.p1},${P.p3})` : "rgba(168,85,247,0.1)", border:`1px solid ${calDays === d ? "transparent" : P.border}`, borderRadius:10, padding:"8px 14px", color: calDays === d ? "#fff" : P.txt, fontSize:13, fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                  <div style={{ marginTop:10, fontSize:11, color:"rgba(168,85,247,0.8)", fontWeight:600 }}>
                    📅 Se crearán {calDays} eventos — del {calDate} a las {calTime}, todos los días
                  </div>
                </div>
              )}
            </div>

            {calMsg && (
              <div style={{ background: calMsg.type === "ok" ? "rgba(52,211,153,0.1)" : "rgba(239,68,68,0.1)", border:`1px solid ${calMsg.type === "ok" ? "rgba(52,211,153,0.3)" : "rgba(239,68,68,0.3)"}`, borderRadius:10, padding:"10px 14px", fontSize:12, color: calMsg.type === "ok" ? "#34d399" : "#f87171", marginBottom:14, textAlign:"center" }}>
                {calMsg.text}
              </div>
            )}

            <button
              onClick={createCalendarEvent}
              disabled={calCreating}
              style={{ width:"100%", background: gcalToken ? `linear-gradient(135deg,${P.p1},${P.p3})` : "linear-gradient(135deg,#4285f4,#34a853)", border:"none", borderRadius:16, padding:"14px", color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"'Syne',sans-serif", opacity: calCreating ? 0.7 : 1 }}
            >
              {calCreating ? "Creando evento..." : gcalToken ? "Crear evento en Calendar 📅" : "Conectar Google Calendar"}
            </button>
            <button onClick={() => setCalNode(null)} style={{ width:"100%", background:"none", border:"none", color:P.muted, fontSize:12, cursor:"pointer", marginTop:12, padding:8 }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* ── Modal guía Cómo conectar Google Calendar ── */}
      {showClientIdGuide && (
        <div onClick={() => setShowClientIdGuide(false)} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.80)", zIndex:600, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background:"#1a0f2e", border:`1px solid ${P.border}`, borderRadius:20, padding:"24px 20px", width:"100%", maxWidth:400, maxHeight:"90vh", overflowY:"auto", animation:"slideIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>

            {/* Header */}
            <div style={{ textAlign:"center", marginBottom:22 }}>
              <div style={{ fontSize:34, marginBottom:6 }}>📅</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:17, color:P.txt }}>Cómo conectar Google Calendar</div>
              <div style={{ fontSize:12, color:P.muted, marginTop:5 }}>Solo se hace una vez — promesa 🐰</div>
            </div>

            {/* PASO 1 */}
            <div style={{ marginBottom:18 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:`linear-gradient(135deg,${P.p1},${P.p3})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#fff", flexShrink:0 }}>1</div>
                <span style={{ fontSize:13, fontWeight:700, color:P.txt }}>Toca el botón 📅 en cualquier tarea</span>
              </div>
              {/* Mockup tarea */}
              <div style={{ background:"rgba(10,5,20,0.8)", borderRadius:12, padding:"10px 14px", border:`1px solid ${P.border}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:16, height:16, borderRadius:"50%", border:"2px solid rgba(255,255,255,0.25)", flexShrink:0 }}/>
                  <span style={{ flex:1, color:"rgba(240,230,255,0.8)", fontSize:12 }}>Llamar al médico mañana</span>
                  <div style={{ background:"linear-gradient(135deg,#4285f4,#34a853)", borderRadius:7, padding:"5px 9px", fontSize:16, boxShadow:"0 0 14px rgba(66,133,244,0.7)" }}>📅</div>
                </div>
                <div style={{ textAlign:"right", marginTop:5, fontSize:10, color:"#4ade80", fontWeight:700 }}>↑ Toca aquí</div>
              </div>
            </div>

            {/* PASO 2 */}
            <div style={{ marginBottom:18 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:`linear-gradient(135deg,${P.p1},${P.p3})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#fff", flexShrink:0 }}>2</div>
                <span style={{ fontSize:13, fontWeight:700, color:P.txt }}>Toca &ldquo;Conectar Google Calendar&rdquo;</span>
              </div>
              {/* Mockup botón */}
              <div style={{ background:"rgba(10,5,20,0.8)", borderRadius:12, padding:"12px 14px", border:`1px solid ${P.border}` }}>
                <div style={{ background:"linear-gradient(135deg,#4285f4,#34a853)", borderRadius:10, padding:"11px", textAlign:"center", color:"#fff", fontSize:12, fontWeight:800, boxShadow:"0 0 16px rgba(66,133,244,0.4)" }}>Conectar Google Calendar</div>
                <div style={{ textAlign:"center", marginTop:5, fontSize:10, color:"#4ade80", fontWeight:700 }}>↑ Toca este botón</div>
              </div>
            </div>

            {/* PASO 3 */}
            <div style={{ marginBottom:18 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:`linear-gradient(135deg,${P.p1},${P.p3})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#fff", flexShrink:0 }}>3</div>
                <span style={{ fontSize:13, fontWeight:700, color:P.txt }}>Elige tu cuenta de Google</span>
              </div>
              {/* Mockup Google account picker */}
              <div style={{ background:"#fff", borderRadius:10, padding:"12px 14px", boxShadow:"0 4px 20px rgba(0,0,0,0.4)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10 }}>
                  <span style={{ fontWeight:900, fontSize:14, background:"linear-gradient(90deg,#4285f4,#ea4335,#fbbc05,#34a853)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>G</span>
                  <span style={{ fontSize:11, color:"#444", fontFamily:"sans-serif" }}>Elegir una cuenta</span>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 8px", borderRadius:6, border:"1px solid #e8e8e8" }}>
                  <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#9333ea,#db2777)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:12, flexShrink:0 }}>👤</div>
                  <div>
                    <div style={{ fontSize:12, color:"#333", fontFamily:"sans-serif", fontWeight:600 }}>Tu nombre</div>
                    <div style={{ fontSize:10, color:"#888", fontFamily:"sans-serif" }}>tucorreo@gmail.com</div>
                  </div>
                  <div style={{ marginLeft:"auto", fontSize:16 }}>›</div>
                </div>
              </div>
            </div>

            {/* PASO 4 */}
            <div style={{ marginBottom:18 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:`linear-gradient(135deg,${P.p1},${P.p3})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#fff", flexShrink:0 }}>4</div>
                <span style={{ fontSize:13, fontWeight:700, color:P.txt }}>Aparece una advertencia — ¡no te asustes! 😊</span>
              </div>
              <div style={{ background:"rgba(251,188,5,0.08)", border:"1px solid rgba(251,188,5,0.3)", borderRadius:10, padding:"10px 12px", marginBottom:8 }}>
                <div style={{ fontSize:11, color:"#fbbf24", lineHeight:1.6 }}>⚠️ Google muestra esta pantalla porque la app es personal y no está en su tienda oficial. Es completamente <strong style={{color:"#fde68a"}}>normal y seguro</strong> — igual que cuando instalas cualquier app fuera de la Play Store.</div>
              </div>
              {/* Mockup pantalla Google "no verificada" */}
              <div style={{ background:"#fff", borderRadius:10, padding:"14px", boxShadow:"0 4px 20px rgba(0,0,0,0.4)" }}>
                <div style={{ textAlign:"center", marginBottom:10 }}>
                  <div style={{ fontSize:28 }}>⚠️</div>
                  <div style={{ fontSize:12, fontWeight:700, color:"#333", fontFamily:"sans-serif", margin:"4px 0 2px" }}>Google no ha verificado esta app</div>
                  <div style={{ fontSize:10, color:"#666", fontFamily:"sans-serif" }}>Conjita&apos;s Dashboard</div>
                </div>
                <div style={{ borderTop:"1px solid #eee", paddingTop:8, textAlign:"center" }}>
                  <span style={{ fontSize:11, color:"#1a73e8", fontFamily:"sans-serif", cursor:"pointer", fontWeight:600 }}>Opciones avanzadas ▼</span>
                  <div style={{ marginTop:6, fontSize:11, color:"#c5221f", fontFamily:"sans-serif", cursor:"pointer" }}>→ Ir a Conjita&apos;s Dashboard (no seguro)</div>
                </div>
                <div style={{ textAlign:"center", marginTop:6, fontSize:10, color:"#4ade80", fontWeight:700 }}>↑ Toca "Opciones avanzadas" y luego el enlace rojo</div>
              </div>
            </div>

            {/* PASO 5 */}
            <div style={{ marginBottom:18 }}>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
                <div style={{ width:22, height:22, borderRadius:"50%", background:`linear-gradient(135deg,${P.p1},${P.p3})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#fff", flexShrink:0 }}>5</div>
                <span style={{ fontSize:13, fontWeight:700, color:P.txt }}>Toca &ldquo;Permitir&rdquo;</span>
              </div>
              <div style={{ background:"#fff", borderRadius:10, padding:"12px 14px", boxShadow:"0 4px 20px rgba(0,0,0,0.4)" }}>
                <div style={{ fontSize:11, color:"#333", fontFamily:"sans-serif", marginBottom:10, lineHeight:1.5 }}>
                  <strong>Conjita&apos;s Dashboard</strong> quiere acceder a tu Google Calendar para crear eventos
                </div>
                <div style={{ display:"flex", justifyContent:"flex-end", gap:8 }}>
                  <div style={{ fontSize:11, color:"#444", fontFamily:"sans-serif", padding:"6px 12px", cursor:"pointer" }}>Cancelar</div>
                  <div style={{ background:"#1a73e8", color:"#fff", borderRadius:4, padding:"6px 16px", fontSize:11, fontFamily:"sans-serif", fontWeight:700, cursor:"pointer", boxShadow:"0 0 10px rgba(26,115,232,0.5)" }}>Permitir</div>
                </div>
                <div style={{ textAlign:"right", marginTop:4, fontSize:10, color:"#4ade80", fontWeight:700 }}>↑ Toca "Permitir"</div>
              </div>
            </div>

            {/* PASO 6: ¡Listo! */}
            <div style={{ background:"rgba(52,211,153,0.1)", border:"1px solid rgba(52,211,153,0.35)", borderRadius:12, padding:"14px 16px", textAlign:"center", marginBottom:20 }}>
              <div style={{ fontSize:28, marginBottom:6 }}>🎉</div>
              <div style={{ fontSize:14, fontWeight:800, color:"#34d399", fontFamily:"'Syne',sans-serif" }}>¡Listo! Ya está conectado</div>
              <div style={{ fontSize:11, color:"rgba(52,211,153,0.7)", marginTop:4, lineHeight:1.5 }}>La próxima vez que uses el calendario <strong style={{color:"#6ee7b7"}}>ya no te pedirá nada</strong> — se conecta solo automáticamente 💜</div>
            </div>

            <button onClick={() => setShowClientIdGuide(false)} style={{ width:"100%", background:`linear-gradient(135deg,${P.p1},${P.p3})`, border:"none", borderRadius:14, padding:"13px", color:"#fff", fontSize:14, fontWeight:800, cursor:"pointer", fontFamily:"'Syne',sans-serif" }}>
              ¡Entendido! 🐰
            </button>
          </div>
        </div>
      )}

      {/* Modal de bienvenida — solo primera vez */}
      {showWelcome && (
        <div
          onClick={() => { setShowWelcome(false); localStorage.setItem("conjita-welcome-v3", "1"); }}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.7)", zIndex:500, display:"flex", alignItems:"flex-end", justifyContent:"center" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background:"linear-gradient(180deg,#1a0f2e 0%,#0d0a1a 100%)", border:`1px solid ${P.borderHi}`, borderRadius:"28px 28px 0 0", padding:"28px 22px 44px", width:"100%", maxWidth:maxW, animation:"slideIn 0.5s cubic-bezier(0.34,1.56,0.64,1)", boxShadow:"0 -20px 60px rgba(147,51,234,0.2)", maxHeight:"90vh", overflowY:"auto" }}
          >
            {/* GIF + Título */}
            <div style={{ textAlign:"center", marginBottom:24 }}>
              <img src="https://media4.giphy.com/media/kXNYthbiZZWda/giphy.gif" alt="novedades" style={{ width:120, height:120, objectFit:"cover", borderRadius:"50%", border:`3px solid ${P.p1}`, boxShadow:`0 0 20px rgba(147,51,234,0.5)`, marginBottom:12 }}/>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, background:`linear-gradient(135deg,${P.p1},${P.p3})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                ¡Novedades en tu dashboard!
              </div>
              <div style={{ fontSize:12, color:P.muted, marginTop:4 }}>Todo lo nuevo para ti, mi traviesa de corona brillante 👑✨</div>
            </div>

            {/* Feature 1: Semáforo */}
            <div style={{ background:"rgba(168,85,247,0.08)", border:`1px solid ${P.border}`, borderRadius:16, padding:"16px 18px", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <div style={{ display:"flex", gap:5, alignItems:"center" }}>
                  <div style={{ width:12, height:12, borderRadius:"50%", background:"#ef4444", boxShadow:"0 0 8px #ef4444" }}/>
                  <div style={{ width:12, height:12, borderRadius:"50%", background:"#f59e0b", boxShadow:"0 0 8px #f59e0b" }}/>
                  <div style={{ width:12, height:12, borderRadius:"50%", background:"#22c55e", boxShadow:"0 0 8px #22c55e" }}/>
                </div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, color:P.txt }}>Semáforo de prioridad</div>
              </div>
              <p style={{ margin:0, fontSize:12, color:P.muted, lineHeight:1.7 }}>Cada tarea tiene un <strong style={{ color:P.txt }}>punto de color</strong> que indica su prioridad. La IA lo asigna automáticamente.</p>
              <p style={{ margin:"8px 0 0", fontSize:11, color:"rgba(168,85,247,0.8)", fontWeight:600 }}>💡 Toca el punto para cambiarlo manualmente</p>
            </div>

            {/* Feature 2: Google Calendar */}
            <div style={{ background:"rgba(66,133,244,0.08)", border:"1px solid rgba(66,133,244,0.25)", borderRadius:16, padding:"16px 18px", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <span style={{ fontSize:20 }}>📅</span>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, color:P.txt }}>Agenda en Google Calendar</div>
              </div>
              <p style={{ margin:0, fontSize:12, color:P.muted, lineHeight:1.7 }}>Toca el <strong style={{ color:P.txt }}>botón azul 📅</strong> en cualquier tarea para agregarla a tu Google Calendar. La primera vez te pedirá iniciar sesión — ¡solo esa vez!</p>
              <p style={{ margin:"8px 0 0", fontSize:11, color:"rgba(66,133,244,0.8)", fontWeight:600 }}>💡 Toca el <strong>?</strong> dentro del modal si tienes dudas — hay una guía paso a paso con imágenes</p>
            </div>

            {/* Feature 3: Alertas urgentes */}
            <div style={{ background:"rgba(239,68,68,0.07)", border:"1px solid rgba(239,68,68,0.2)", borderRadius:16, padding:"16px 18px", marginBottom:12 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <img src="https://www.gifsanimados.org/data/media/202/perro-imagen-animada-0091.gif" alt="perro" style={{ width:32, height:32, borderRadius:"50%" }}/>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, color:P.txt }}>Alertas de tareas urgentes</div>
              </div>
              <p style={{ margin:0, fontSize:12, color:P.muted, lineHeight:1.7 }}>Cuando tengas tareas <strong style={{ color:"#ef4444" }}>🔴 urgentes</strong> pendientes, al abrir la app aparecerá un aviso para que no se te escapen.</p>
              <p style={{ margin:"8px 0 0", fontSize:11, color:"rgba(239,68,68,0.7)", fontWeight:600 }}>💡 Solo aparece cuando hay algo urgente sin completar</p>
            </div>

            {/* Feature 4: Vision Board */}
            <div style={{ background:"rgba(251,191,36,0.07)", border:"1px solid rgba(251,191,36,0.25)", borderRadius:16, padding:"16px 18px", marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                <span style={{ fontSize:20 }}>🌟</span>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:14, color:P.txt }}>Vision Board</div>
              </div>
              <p style={{ margin:0, fontSize:12, color:P.muted, lineHeight:1.7 }}>Toca la pestaña <strong style={{ color:P.txt }}>🌟</strong> en el menú para crear tu tablero de visión. Agrega imágenes, texto, frases, formas y emojis — y expórtalo en PDF.</p>
              <p style={{ margin:"8px 0 0", fontSize:11, color:"rgba(251,191,36,0.8)", fontWeight:600 }}>💡 Gira los elementos con el círculo ↻ que aparece al seleccionarlos</p>
            </div>

            {/* Nota: no volverá a salir */}
            <div style={{ textAlign:"center", marginBottom:16 }}>
              <span style={{ fontSize:11, color:"rgba(240,230,255,0.3)", fontStyle:"italic" }}>Este mensaje no volverá a aparecer 🐰</span>
            </div>

            <button
              onClick={() => { setShowWelcome(false); localStorage.setItem("conjita-welcome-v3", "1"); }}
              style={{ width:"100%", background:`linear-gradient(135deg,${P.p1},${P.p3})`, border:"none", borderRadius:18, padding:"15px", color:"#fff", fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"'Syne',sans-serif" }}
            >
              ¡Entendido, vamos! 🚀
            </button>
          </div>
        </div>
      )}

      {/* Toast de motivación */}
      {toast && (
        <div
          onClick={() => setToast(null)}
          style={{
            position:"fixed", top:72, left:"50%", transform:"translateX(-50%)",
            background:"linear-gradient(135deg,rgba(147,51,234,0.95),rgba(219,39,119,0.95))",
            backdropFilter:"blur(12px)",
            border:"1px solid rgba(255,255,255,0.15)",
            borderRadius:20, padding:"12px 18px 12px 14px",
            display:"flex", alignItems:"center", gap:10,
            maxWidth: "calc(100vw - 28px)", width:"max-content",
            boxShadow:"0 8px 32px rgba(147,51,234,0.4)",
            animation:"slideInDown 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            cursor:"pointer", zIndex:250,
          }}
        >
          <img src="https://www.gifsanimados.org/data/media/202/perro-imagen-animada-0091.gif" alt="perro" style={{ width:36, height:36, borderRadius:"50%", flexShrink:0 }}/>
          <span style={{ fontSize:12, fontWeight:600, color:"#fff", lineHeight:1.4 }}>{toast}</span>
        </div>
      )}
      <style>{`@keyframes slideInDown{from{opacity:0;transform:translateX(-50%) translateY(-20px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>

      {/* Toast motivacional — una vez cada 8 días */}
      {showMotivation && (() => {
        const MOTIV_MSGS = [
          { title:"Eres brillante, talentosa y grande 💜", body:"Cada vez que abres esto, estás más cerca de ser la mujer más espectacular del mundo 🌟" },
          { title:"Hoy también eres increíble ✨", body:"No existe versión tuya que no sea absolutamente extraordinaria. Sigue así, campeona 🏆" },
          { title:"El mundo es mejor contigo en él 🌸", body:"Cada cosa que logras, por pequeña que sea, te hace más poderosa de lo que imaginas 💫" },
          { title:"Eres más fuerte de lo que crees 🦋", body:"Cada tarea que completas es una victoria. Y las victorias pequeñas construyen grandes vidas 🌺" },
          { title:"Tu potencial no tiene límites 🚀", body:"La persona que abre esta app cada día es alguien que no se rinde. Eso es todo lo que necesitas saber 💝" },
          { title:"Eres única e irrepetible 🌙", body:"No hay nadie en el mundo que pueda hacer lo que tú haces, de la forma en que tú lo haces. Eso es un superpoder 💎" },
          { title:"Orgullo total por ti 🥹", body:"Cada vez que te organizas, te estás amando a ti misma. Y eso es lo más bonito que existe 🌷" },
          { title:"Sigue brillando, conejita 🐰", body:"El esfuerzo de hoy es el logro de mañana. Y tú lo sabes mejor que nadie porque aquí estás, otra vez 💜" },
          { title:"La mujer más espectacular del mundo 👑", body:"No es una meta lejana — eres tú, ahora mismo, con todo lo que eres y todo lo que estás construyendo ✨" },
        ];
        const idx = Number(localStorage.getItem("conjita-motiv-idx") || "0") % MOTIV_MSGS.length;
        const msg = MOTIV_MSGS[idx];
        return (
        <div
          onClick={() => { setShowMotivation(false); localStorage.setItem("conjita-motiv-last", String(Date.now())); localStorage.setItem("conjita-motiv-idx", String((idx + 1) % MOTIV_MSGS.length)); }}
          style={{
            position:"fixed", bottom:28, left:"50%", transform:"translateX(-50%)",
            background:"linear-gradient(135deg,rgba(13,10,26,0.97),rgba(26,15,46,0.97))",
            border:`1px solid ${P.borderHi}`,
            borderRadius:20, padding:"16px 20px",
            maxWidth:"calc(100vw - 32px)", width:360,
            boxShadow:"0 8px 40px rgba(147,51,234,0.45)",
            animation:"toastBounce 0.5s cubic-bezier(0.34,1.56,0.64,1) both",
            willChange:"transform, opacity",
            cursor:"pointer", zIndex:250,
            display:"flex", flexDirection:"column", alignItems:"center", gap:10,
          }}
        >
          <div style={{ fontSize:28 }}>💜</div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:15, color:P.txt, marginBottom:6 }}>
              {msg.title}
            </div>
            <div style={{ fontSize:12, color:"rgba(240,230,255,0.65)", lineHeight:1.6 }}>
              {msg.body}
            </div>
          </div>
          <div style={{ fontSize:10, color:"rgba(240,230,255,0.3)", fontStyle:"italic" }}>Toca para cerrar 🐰</div>
        </div>
        );
      })()}

      {/* Version tag */}
      <div style={{ position:"fixed", bottom:8, right:10, fontSize:10, color:"rgba(240,230,255,0.25)", pointerEvents:"none", zIndex:9 }}>
        v1.3
      </div>
    </div>
    </IconContext.Provider>
  );
}
