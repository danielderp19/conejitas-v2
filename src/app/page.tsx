"use client";

import { useState, useRef, useEffect, useCallback, memo } from "react";
import {
  CheckCircle2, Circle, ChevronRight, Trash2,
  RefreshCw, Monitor, Smartphone, Cloud, Menu, X,
  Send, Sparkles, RotateCcw, GripVertical, Bell, BellOff,
} from "lucide-react";

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
  onReorder: (dragId: string, dropId: string) => void;
}

const Node = memo(function Node({ node, done, expanded, desktop, onToggle, onExpand, onDelete, onReorder }: NodeProps) {
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
            ? <CheckCircle2 size={18} color="#86efac" style={{ filter:"drop-shadow(0 0 4px #86efac)", transition:"all 0.3s" }}/>
            : <Circle size={18} color="rgba(255,255,255,0.65)"/>
          }
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
            <Node key={c.id} node={c} done={done} expanded={expanded} desktop={desktop} onToggle={onToggle} onExpand={onExpand} onDelete={onDelete} onReorder={onReorder}/>
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
  onReorder: (dragId: string, dropId: string) => void;
}

const TreeCard = memo(function TreeCard({ tree, done, expanded, desktop, onToggle, onExpand, onDeleteNode, onDeleteTree, onReorder }: TreeCardProps) {
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
        transition:"border-color 0.3s, background 0.5s",
        animation:"slideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
        cursor:"grab",
      }}>
      {isComplete && <Confetti/>}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12, paddingBottom:10, borderBottom:`1px solid ${isComplete ? "rgba(134,239,172,0.2)" : P.border}` }}>
        <span style={{ fontSize:22, animation: isComplete ? "shimmer 1.5s infinite" : "none" }}>
          {isComplete ? "🎉" : (tree.icon || "🌱")}
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
        <Node key={c.id} node={c} done={done} expanded={expanded} desktop={desktop} onToggle={onToggle} onExpand={onExpand} onDelete={onDeleteNode} onReorder={onReorder}/>
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
  const [notifStatus, setNotifStatus] = useState<"idle"|"enabled"|"denied"|"unsupported">("idle");
  const [notifFreq, setNotifFreq] = useState(3); // horas
  const [showFreqPicker, setShowFreqPicker] = useState(false);

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
  ];
  const [showCat, setShowCat] = useState(false);
  const [catMsg, setCatMsg] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatEnd = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const catTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // ── Notificaciones ──────────────────────────────────────────────────────────
  const sendSwMsg = useCallback((msg: object) => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.ready.then((reg) => {
      reg.active?.postMessage(msg);
    });
  }, []);

  // Detectar si ya tenía notificaciones activadas
  useEffect(() => {
    if (!("Notification" in window)) { setNotifStatus("unsupported"); return; }
    const savedFreq = localStorage.getItem("conjita-notif-freq");
    if (savedFreq) setNotifFreq(Number(savedFreq));
    if (Notification.permission === "granted") {
      const saved = localStorage.getItem("conjita-notif");
      if (saved === "enabled") setNotifStatus("enabled");
    } else if (Notification.permission === "denied") {
      setNotifStatus("denied");
    }
  }, []);

  // Sincronizar tareas con el SW cuando cambian
  useEffect(() => {
    if (!hydrated || notifStatus !== "enabled") return;
    sendSwMsg({ type: "UPDATE_TASKS", trees, done });
  }, [trees, done, hydrated, notifStatus, sendSwMsg]);

  const enableNotifications = useCallback(async (freq: number) => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setNotifStatus("unsupported"); return;
    }
    const perm = await Notification.requestPermission();
    if (perm === "granted") {
      setNotifFreq(freq);
      sendSwMsg({ type: "ENABLE_NOTIFICATIONS", trees, done, freqMs: freq * 60 * 60 * 1000 });
      localStorage.setItem("conjita-notif", "enabled");
      localStorage.setItem("conjita-notif-freq", String(freq));
      setNotifStatus("enabled");
    } else {
      setNotifStatus("denied");
    }
    setShowFreqPicker(false);
  }, [sendSwMsg, trees, done]);

  const toggleNotifications = useCallback(() => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setNotifStatus("unsupported"); return;
    }
    if (notifStatus === "enabled") {
      sendSwMsg({ type: "DISABLE_NOTIFICATIONS" });
      localStorage.removeItem("conjita-notif");
      setNotifStatus("idle");
      return;
    }
    setShowFreqPicker(true);
  }, [notifStatus, sendSwMsg]);

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

    const sys = `Eres Conjita, un asistente que extrae tareas de mensajes en lenguaje natural y los convierte en árboles JSON.

El usuario puede escribir de forma informal, conversacional, con errores, mezclar temas y usar referencias implícitas. Tu trabajo es INTERPRETAR el mensaje completo y extraer TODAS las tareas.

RESPONDE SOLO CON JSON entre triple backticks. Nada más.

PASOS PARA PROCESAR EL MENSAJE:
1. Lee TODO el mensaje y extrae cada acción pendiente, sin importar cómo esté redactada
2. Agrupa las tareas por área: Salud, Universidad, Trabajo, Personal, Hogar, Finanzas, etc.
3. Crea UN árbol por área, con todas sus tareas adentro como children
4. Para tareas complejas (que tienen varios pasos) → agrega 2-3 subtareas
5. Para tareas simples (una sola acción) → sin subtareas

EJEMPLO REAL de mensaje conversacional:
Entrada: "Tengo que tomarme una pastilla a las 9, mirar el trabajo de riesgo en banca y enviarle al profe los comprobantes médicos, también al de Macros en excel y ver su clase de macros. Revisar los estados financieros de pacasmayo, preguntarle al profe de la asistencia y participación. Decirle que no me contestó el correo al profe de international finance y decirle que me ausente en el examen del sábado."

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
          "title": "Enviar comprobantes médicos al profesor",
          "icon": "📄",
          "children": []
        },
        {
          "title": "Pendientes con profesor de Macros Excel",
          "icon": "💻",
          "children": [
            {"title": "Enviar tarea de Macros", "icon": "📤", "children": []},
            {"title": "Ver clase de Macros para ponerse al día", "icon": "▶️", "children": []}
          ]
        },
        {
          "title": "Revisar estados financieros Pacasmayo",
          "icon": "📈",
          "children": []
        },
        {
          "title": "Escribir al profesor sobre asistencia y participación",
          "icon": "✉️",
          "children": [
            {"title": "Preguntar sobre asistencia y participación", "icon": "❓", "children": []},
            {"title": "Mencionar que no respondió el correo anterior", "icon": "📧", "children": []}
          ]
        },
        {
          "title": "Escribir al profesor de International Finance",
          "icon": "✉️",
          "children": [
            {"title": "Explicar ausencia en examen del sábado", "icon": "📝", "children": []}
          ]
        }
      ]
    }
  ]
}
\`\`\`

REGLAS:
- Extrae TODAS las tareas aunque el mensaje sea informal o confuso
- Un árbol por área (Salud, Universidad, Trabajo, etc.)
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
    } catch (e) {
      const isNetwork = e instanceof TypeError && e.message.includes("fetch");
      setChatLog((p) => [...p, { role:"ai", text: isNetwork ? "Sin conexión a internet. Revisa tu red e intenta de nuevo." : "Algo salió mal. Intenta de nuevo en unos segundos." }]);
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
        @keyframes slideIn{from{opacity:0;transform:translateY(30px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes slideInStagger{0%{opacity:0;transform:translateX(-20px) scale(0.98)}to{opacity:1;transform:translateX(0) scale(1)}}
        @keyframes fadeGlow{from{box-shadow:0 0 0 0 rgba(168,85,247,0.5)}to{box-shadow:0 0 0 8px rgba(168,85,247,0)}}
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        textarea,input{font-family:'Poppins',sans-serif;}
        ::-webkit-scrollbar{width:4px;}
        ::-webkit-scrollbar-thumb{background:rgba(168,85,247,0.3);border-radius:4px;}
        .progress-circle{transition:stroke-dashoffset 0.7s cubic-bezier(.4,0,.2,1);}
        .progress-bar{transition:width 0.5s cubic-bezier(.4,0,.2,1);}
      `}</style>

      {/* Header */}
      <header style={{ padding: desktop ? "14px 28px" : "14px 18px", background:"rgba(13,10,26,0.97)", borderBottom:`1px solid ${P.border}`, display:"flex", alignItems:"center", gap:10, position:"sticky", top:0, zIndex:100 }}>
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
        {/* Botón de notificaciones */}
        <button
          onClick={toggleNotifications}
          title={notifStatus === "enabled" ? "Desactivar recordatorios" : notifStatus === "denied" ? "Activa notificaciones en ajustes del navegador" : "Activar recordatorios cada 3h"}
          style={{
            background: notifStatus === "enabled" ? "linear-gradient(135deg,#9333ea,#db2777)" : "rgba(255,255,255,0.06)",
            border: `1px solid ${notifStatus === "enabled" ? "transparent" : P.border}`,
            borderRadius: 8, padding: 7, cursor: notifStatus === "denied" ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", position: "relative",
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
        <button onClick={() => setDesktop((d) => !d)} style={{ background:"rgba(255,255,255,0.06)", border:`1px solid ${P.border}`, borderRadius:8, padding:7, color:P.txt, cursor:"pointer", display:"flex", alignItems:"center" }}>
          {desktop ? <Smartphone size={15}/> : <Monitor size={15}/>}
        </button>
        <div style={{ display:"flex", background:"rgba(255,255,255,0.06)", borderRadius:28, padding:3 }}>
          {([{v:"dashboard",icon:"📊"},{v:"chat",icon:"💬"}] as const).map(({v,icon}) => (
            <button key={v} onClick={() => { setView(v); setMenuOpen(false); }} style={{ background: view===v ? `linear-gradient(135deg,${P.p1},${P.p3})` : "none", border:"none", borderRadius:22, padding:"5px 11px", color: view===v ? "#fff" : P.muted, fontSize:11, fontWeight:700, cursor:"pointer" }}>{icon}</button>
          ))}
        </div>
        <button onClick={() => setMenuOpen((m) => !m)} style={{ background:"rgba(255,255,255,0.06)", border:"none", borderRadius:8, padding:7, color:P.txt, cursor:"pointer" }}>
          {menuOpen ? <X size={16}/> : <Menu size={16}/>}
        </button>
      </header>

      {menuOpen && (
        <div style={{ position:"fixed", top:62, right: desktop ? "calc(50% - 480px + 12px)" : 12, background:"rgba(13,10,26,0.98)", border:`1px solid ${P.border}`, borderRadius:14, padding:8, zIndex:200, minWidth:210, boxShadow:"0 12px 40px rgba(0,0,0,0.8)" }}>
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
                  onToggle={toggle} onExpand={expandToggle} onDeleteNode={deleteNode} onDeleteTree={deleteTree}
                  onReorder={handleReorder}/>
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
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:maxW, background:"rgba(13,10,26,0.97)", borderTop:`1px solid ${P.border}`, padding: desktop ? "12px 28px 18px" : "10px 14px 16px", zIndex:100 }}>
        <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>
          <div style={{ flex:1, background:"rgba(255,255,255,0.05)", border:`1px solid ${P.borderHi}`, borderRadius:18, padding:"9px 14px", display:"flex", alignItems:"center", gap:7 }}>
            <Sparkles size={14} color={P.p1}/>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key==="Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              onInput={(e) => { const t = e.currentTarget; t.style.height="auto"; t.style.height=Math.min(t.scrollHeight,90)+"px"; }}
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
            animation:"slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
            cursor:"pointer", maxWidth: 300, width:"calc(100% - 40px)",
          }}
        >
          <img
            src="https://media.tenor.com/AXJ16vpJy98AAAAj/danci-dancing-cat.gif"
            alt="dancing cat"
            style={{ width:64, height:64, borderRadius:14, flexShrink:0 }}
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
    </div>
  );
}
