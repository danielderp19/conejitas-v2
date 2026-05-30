"use client";
import { useState, useRef, useCallback, useEffect } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type ElType = "image" | "text" | "shape" | "emoji" | "quote";
type ShapeKind = "rect" | "circle" | "heart" | "star" | "diamond";

interface BoardEl {
  id: string;
  type: ElType;
  x: number; y: number;
  w: number; h: number;
  rotation: number;
  src?: string;
  content?: string;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  bold?: boolean;
  italic?: boolean;
  align?: "left" | "center" | "right";
  shape?: ShapeKind;
  fill?: string;
  stroke?: string;
  emoji?: string;
  opacity?: number;
}

// ─── Constantes (fuera del componente para no recrear en cada render) ─────────
const uid = () => Math.random().toString(36).slice(2);
const randPos = (base: number) => base + Math.floor(Math.random() * 80);

const FONTS = ["Poppins", "Syne", "Georgia", "Courier New", "Arial", "Dancing Script"];
const EMOJIS = ["🌸","✨","💜","🌙","⭐","🦋","🌺","💫","🌈","🎀","🍀","🌻","🦄","💎","🔮","🌿","🕊️","💝","🌙","🫧"];
const QUOTES = [
  "Todo lo que puedes imaginar es real ✨",
  "Ella creyó que podía, así que lo hizo 💜",
  "La vida es tuya, vívela con intención 🌸",
  "Mereces todo lo que sueñas 🌙",
  "Sé la protagonista de tu propia historia ⭐",
  "Tu futuro es tan brillante como tú 💫",
  "Confía en el proceso, confía en ti 🦋",
  "Crea la vida que amas 🌺",
  "El universo conspira a tu favor 🔮",
  "Eres más poderosa de lo que crees 💎",
];
const BACKGROUNDS = [
  { label: "Noche púrpura", value: "linear-gradient(135deg,#0d0a1a 0%,#1a0f2e 50%,#0d0a1a 100%)" },
  { label: "Rosa suave",    value: "linear-gradient(135deg,#fce4ec,#f8bbd0,#f48fb1)" },
  { label: "Sunset",        value: "linear-gradient(135deg,#ff6b6b,#feca57,#ff9ff3)" },
  { label: "Océano",        value: "linear-gradient(135deg,#0f3460,#16213e,#0f3460)" },
  { label: "Bosque",        value: "linear-gradient(135deg,#134e4a,#065f46,#064e3b)" },
  { label: "Aurora",        value: "linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899,#f43f5e)" },
  { label: "Dorado",        value: "linear-gradient(135deg,#78350f,#92400e,#d97706,#fbbf24)" },
  { label: "Blanco puro",   value: "#ffffff" },
  { label: "Negro elegante",value: "#0a0a0a" },
  { label: "Papel",         value: "linear-gradient(135deg,#fef9f0,#fef3e2)" },
];
const CREATIVE_MSGS = [
  "¡Wow, qué creativa! 💜",
  "¡Eres súper creativa! ✨",
  "¡Me encanta tu estilo! 🌸",
  "¡Esto se ve espectacular! 🌟",
  "¡Eres un genio del diseño! 🎨",
];
const MAX_IMG_BYTES = 1_500_000; // 1.5 MB en base64 por imagen
const STORAGE_KEY = "conjita-visionboard-v1";

const P = {
  bg: "#0d0a1a", card: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.25)",
  borderHi: "rgba(168,85,247,0.6)", p1: "#9333ea", p3: "#db2777",
  txt: "#f0e6ff", muted: "rgba(240,230,255,0.45)",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function safeStore(elements: BoardEl[], bg: string, bgImage: string | null) {
  try {
    // Filtra imágenes demasiado grandes para no reventar localStorage
    const safeEls = elements.map(e =>
      e.type === "image" && e.src && e.src.length > MAX_IMG_BYTES
        ? { ...e, src: "" } // guarda el elemento sin la imagen
        : e
    );
    const safeBg = bgImage && bgImage.length > MAX_IMG_BYTES ? null : bgImage;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ elements: safeEls, bg, bgImage: safeBg }));
    return true;
  } catch {
    // QuotaExceededError: guarda solo estructura sin imágenes
    try {
      const minimal = elements.map(e => ({ ...e, src: undefined }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ elements: minimal, bg, bgImage: null }));
    } catch { /* sin espacio */ }
    return false;
  }
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function VisionBoard() {
  const [elements, setElements]         = useState<BoardEl[]>([]);
  const [bg, setBg]                     = useState(BACKGROUNDS[0].value);
  const [bgImage, setBgImage]           = useState<string | null>(null);
  const [selected, setSelected]         = useState<string | null>(null);
  const [showBgPicker, setShowBgPicker] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput]         = useState("");
  const [showQuotes, setShowQuotes]     = useState(false);
  const [editingText, setEditingText]   = useState<string | null>(null);
  const [exporting, setExporting]       = useState(false);
  const [desktop, setDesktop]           = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfName, setPdfName]           = useState("mi-vision-board");
  const [creativeToast, setCreativeToast] = useState(false);
  const [creativeMsg, setCreativeMsg]   = useState("");
  const [draftStatus, setDraftStatus]   = useState<"saved"|"error"|null>(null);

  const boardRef    = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef<HTMLDivElement>(null);
  const fileRef     = useRef<HTMLInputElement>(null);
  const bgFileRef   = useRef<HTMLInputElement>(null);
  const dragRef     = useRef<{ id: string; startX: number; startY: number; elX: number; elY: number } | null>(null);
  const rotRef      = useRef<{ id: string; cx: number; cy: number } | null>(null);
  const draftTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Responsive ────────────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ── Carga inicial ─────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setElements(s.elements || []);
        setBg(s.bg || BACKGROUNDS[0].value);
        if (s.bgImage) setBgImage(s.bgImage);
      }
    } catch { /* ok */ }
  }, []);

  // ── Guardado con debounce + indicador ─────────────────────────────────────
  useEffect(() => {
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => {
      const ok = safeStore(elements, bg, bgImage);
      setDraftStatus(ok ? "saved" : "error");
      setTimeout(() => setDraftStatus(null), 2000);
    }, 800);
    return () => { if (draftTimer.current) clearTimeout(draftTimer.current); };
  }, [elements, bg, bgImage]);

  const selectedEl = elements.find(e => e.id === selected) || null;

  // ── Toast creativa ────────────────────────────────────────────────────────
  const triggerCreativeToast = useCallback(() => {
    if (Math.random() > 0.35) return;
    const msg = CREATIVE_MSGS[Math.floor(Math.random() * CREATIVE_MSGS.length)];
    setCreativeMsg(msg);
    setCreativeToast(true);
    setTimeout(() => setCreativeToast(false), 3800);
  }, []);

  // Coordenadas del puntero: para touch sigue el MISMO dedo por identifier (evita saltos con multi-touch)
  const ptr = (ev: MouseEvent | TouchEvent, touchId: number | null): { x: number; y: number } | null => {
    if ("touches" in ev) {
      const t = touchId != null
        ? Array.from(ev.touches).find(tt => tt.identifier === touchId)
        : ev.touches[0];
      return t ? { x: t.clientX, y: t.clientY } : null;
    }
    return { x: (ev as MouseEvent).clientX, y: (ev as MouseEvent).clientY };
  };

  // ── Drag ──────────────────────────────────────────────────────────────────
  const startDrag = useCallback((e: React.MouseEvent | React.TouchEvent, id: string) => {
    if (editingText === id) return;
    e.stopPropagation();
    const board = boardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    const el = elements.find(x => x.id === id);
    if (!el) return;
    const touchId = "touches" in e ? e.touches[0].identifier : null;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    dragRef.current = { id, startX: clientX - rect.left, startY: clientY - rect.top, elX: el.x, elY: el.y };
    setSelected(id);

    const onMove = (ev: MouseEvent | TouchEvent) => {
      const d = dragRef.current;
      if (!d || !board) return;
      if (ev.cancelable) ev.preventDefault(); // evita que la página haga scroll al arrastrar
      const p = ptr(ev, touchId);
      if (!p) return;
      const r = board.getBoundingClientRect();
      const dx = (p.x - r.left) - d.startX;
      const dy = (p.y - r.top)  - d.startY;
      setElements(prev => prev.map(x =>
        x.id === d.id ? { ...x, x: Math.max(0, d.elX + dx), y: Math.max(0, d.elY + dy) } : x
      ));
    };
    const onUp = () => {
      dragRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend",  onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend",  onUp);
  }, [elements, editingText]);

  // ── Rotate ────────────────────────────────────────────────────────────────
  const startRotate = useCallback((e: React.MouseEvent | React.TouchEvent, el: BoardEl) => {
    e.stopPropagation();
    if (e.cancelable) e.preventDefault();
    const board = boardRef.current;
    if (!board) return;
    const rect = board.getBoundingClientRect();
    // getBoundingClientRect ya está en coords de viewport (incluye scroll) → NO restar scrollTop
    const cx = rect.left + el.x + el.w / 2;
    const cy = rect.top  + el.y + el.h / 2;
    const touchId = "touches" in e ? e.touches[0].identifier : null;
    rotRef.current = { id: el.id, cx, cy };

    const onMove = (ev: MouseEvent | TouchEvent) => {
      const r = rotRef.current;
      if (!r) return;
      if (ev.cancelable) ev.preventDefault();
      const p = ptr(ev, touchId);
      if (!p) return;
      const angle = Math.atan2(p.y - r.cy, p.x - r.cx) * 180 / Math.PI + 90;
      setElements(prev => prev.map(x =>
        x.id === r.id ? { ...x, rotation: Math.round(angle) } : x
      ));
    };
    const onUp = () => {
      rotRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend",  onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend",  onUp);
  }, []);

  // ── Resize ────────────────────────────────────────────────────────────────
  const startResize = useCallback((
    e: React.MouseEvent | React.TouchEvent,
    el: BoardEl,
    cx: number,
    cy: number
  ) => {
    e.stopPropagation();
    const startX  = "touches" in e ? e.touches[0].clientX : e.clientX;
    const startY  = "touches" in e ? e.touches[0].clientY : e.clientY;
    const startW  = el.w;
    const startH  = el.h;
    const touchId = "touches" in e ? e.touches[0].identifier : null;

    const onMove = (ev: MouseEvent | TouchEvent) => {
      if (ev.cancelable) ev.preventDefault();
      const p = ptr(ev, touchId);
      if (!p) return;
      setElements(prev => prev.map(x =>
        x.id === el.id
          ? { ...x, w: Math.max(40, startW + (p.x - startX) * cx), h: Math.max(30, startH + (p.y - startY) * cy) }
          : x
      ));
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend",  onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend",  onUp);
  }, []);

  // ── Agregar imagen (con límite de tamaño) ─────────────────────────────────
  const addImage = useCallback((src: string) => {
    if (src.length > MAX_IMG_BYTES * 3) {
      alert("La imagen es demasiado grande. Usa una imagen más pequeña o una URL.");
      return;
    }
    setElements(prev => [...prev, {
      id: uid(), type: "image",
      x: randPos(30), y: randPos(30),
      w: 200, h: 200, rotation: 0, src, opacity: 1,
    }]);
    triggerCreativeToast();
  }, [triggerCreativeToast]);

  const addText = useCallback(() => {
    const id = uid();
    setElements(prev => [...prev, {
      id, type: "text",
      x: randPos(40), y: randPos(40),
      w: 220, h: 60, rotation: 0,
      content: "Escribe aquí ✨", fontSize: 18, color: "#f0e6ff",
      fontFamily: "Poppins", bold: false, italic: false, align: "center", opacity: 1,
    }]);
    setSelected(id);
    setTimeout(() => setEditingText(id), 100);
    triggerCreativeToast();
  }, [triggerCreativeToast]);

  const addShape = useCallback((shape: ShapeKind) => {
    setElements(prev => [...prev, {
      id: uid(), type: "shape",
      x: randPos(60), y: randPos(60),
      w: 120, h: 120, rotation: 0, shape, fill: "#9333ea", stroke: "transparent", opacity: 1,
    }]);
    triggerCreativeToast();
  }, [triggerCreativeToast]);

  const addEmoji = useCallback((emoji: string) => {
    setElements(prev => [...prev, {
      id: uid(), type: "emoji",
      x: randPos(80), y: randPos(80),
      w: 80, h: 80, rotation: 0, emoji, opacity: 1,
    }]);
    setShowEmojiPicker(false);
    triggerCreativeToast();
  }, [triggerCreativeToast]);

  const addQuote = useCallback((q: string) => {
    setElements(prev => [...prev, {
      id: uid(), type: "quote",
      x: randPos(20), y: randPos(100),
      w: 280, h: 80, rotation: 0,
      content: q, fontSize: 16, color: "#f0e6ff",
      fontFamily: "Georgia", bold: false, italic: true, align: "center", opacity: 1,
    }]);
    setShowQuotes(false);
    triggerCreativeToast();
  }, [triggerCreativeToast]);

  // ── Actualizar / eliminar ─────────────────────────────────────────────────
  const updateEl = useCallback((patch: Partial<BoardEl>) => {
    if (!selected) return;
    setElements(prev => prev.map(e => e.id === selected ? { ...e, ...patch } : e));
  }, [selected]);

  const deleteEl = useCallback(() => {
    if (!selected) return;
    setElements(prev => prev.filter(e => e.id !== selected));
    setSelected(null);
  }, [selected]);

  const bringForward = useCallback(() => {
    if (!selected) return;
    setElements(prev => {
      const i = prev.findIndex(e => e.id === selected);
      if (i >= prev.length - 1) return prev;
      const arr = [...prev];
      [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      return arr;
    });
  }, [selected]);

  const sendBack = useCallback(() => {
    if (!selected) return;
    setElements(prev => {
      const i = prev.findIndex(e => e.id === selected);
      if (i <= 0) return prev;
      const arr = [...prev];
      [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
      return arr;
    });
  }, [selected]);

  // ── Export PDF ────────────────────────────────────────────────────────────
  const exportPDF = useCallback(async (name: string) => {
    if (!boardRef.current) return;
    setShowPdfModal(false);
    setExporting(true);
    setSelected(null);
    await new Promise(r => setTimeout(r, 200));
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { default: jsPDF }       = await import("jspdf");
      const canvas = await html2canvas(boardRef.current, { useCORS: true, scale: 2, backgroundColor: null });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [canvas.width / 2, canvas.height / 2] });
      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save((name.trim() || "mi-vision-board").replace(/\.pdf$/i, "") + ".pdf");
    } catch { alert("Error al exportar. Intenta de nuevo."); }
    setExporting(false);
  }, []);

  // ── Render shape ──────────────────────────────────────────────────────────
  function renderShape(el: BoardEl) {
    const { shape, fill, stroke } = el;
    const s = stroke !== "transparent" ? stroke : "none";
    if (shape === "circle")
      return <div style={{ width:"100%", height:"100%", borderRadius:"50%", background:fill, border: s !== "none" ? `3px solid ${s}` : "none" }}/>;
    if (shape === "heart")
      return <svg viewBox="0 0 100 90" style={{ width:"100%", height:"100%" }}><path d="M50 85 C50 85 5 55 5 28 C5 14 16 5 28 5 C38 5 46 11 50 18 C54 11 62 5 72 5 C84 5 95 14 95 28 C95 55 50 85 50 85Z" fill={fill} stroke={s} strokeWidth="2"/></svg>;
    if (shape === "star")
      return <svg viewBox="0 0 100 100" style={{ width:"100%", height:"100%" }}><polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill={fill} stroke={s} strokeWidth="2"/></svg>;
    if (shape === "diamond")
      return <svg viewBox="0 0 100 100" style={{ width:"100%", height:"100%" }}><polygon points="50,5 95,50 50,95 5,50" fill={fill} stroke={s} strokeWidth="2"/></svg>;
    return <div style={{ width:"100%", height:"100%", background:fill, border: s !== "none" ? `3px solid ${s}` : "none", borderRadius:8 }}/>;
  }

  const boardH = desktop ? 600 : 420;

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", fontFamily:"'Poppins',sans-serif" }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .vb-el:hover .vb-handles{opacity:1!important}
        .vb-toolbar-btn:active{transform:scale(0.93)}
      `}</style>

      {/* ── Toolbar ── */}
      <div style={{ background:"rgba(13,10,26,0.97)", borderBottom:`1px solid ${P.border}`, padding: desktop ? "10px 20px" : "8px 10px", display:"flex", alignItems:"center", gap: desktop ? 8 : 4, flexWrap:"wrap", flexShrink:0 }}>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => {
          const f = e.target.files?.[0];
          if (!f) return;
          if (f.size > 8_000_000) { alert("Imagen muy grande (máx 8 MB). Comprimela un poco."); return; }
          const r = new FileReader();
          r.onload = ev => addImage(ev.target?.result as string);
          r.readAsDataURL(f);
          e.target.value = "";
        }}/>
        <ToolBtn icon="🖼️" label="Imagen"     onClick={() => fileRef.current?.click()}/>
        <ToolBtn icon="🔗" label="URL"        onClick={() => setShowUrlInput(v => !v)}/>
        <ToolBtn icon="✍️" label="Texto"      onClick={addText}/>
        <ToolBtn icon="⬛" label="Rectángulo" onClick={() => addShape("rect")}/>
        <ToolBtn icon="⭕" label="Círculo"    onClick={() => addShape("circle")}/>
        <ToolBtn icon="❤️" label="Corazón"    onClick={() => addShape("heart")}/>
        <ToolBtn icon="⭐" label="Estrella"   onClick={() => addShape("star")}/>
        <ToolBtn icon="🔷" label="Diamante"   onClick={() => addShape("diamond")}/>
        <ToolBtn icon="😊" label="Emoji"      onClick={() => setShowEmojiPicker(v => !v)}/>
        <ToolBtn icon="💬" label="Frase"      onClick={() => setShowQuotes(v => !v)}/>

        <div style={{ marginLeft:"auto", display:"flex", gap: desktop ? 8 : 4, alignItems:"center" }}>
          {/* Indicador de borrador */}
          {draftStatus && (
            <span style={{ fontSize:10, color: draftStatus === "saved" ? "#4ade80" : "#f87171", fontWeight:600, whiteSpace:"nowrap" }}>
              {draftStatus === "saved" ? "✓ Guardado" : "⚠ Sin espacio"}
            </span>
          )}
          <ToolBtn icon="🎨" label="Fondo" onClick={() => setShowBgPicker(v => !v)} accent/>
          <ToolBtn icon={exporting ? "⏳" : "📄"} label="PDF" onClick={() => setShowPdfModal(v => !v)} accent/>
        </div>
      </div>

      {/* ── Popovers ── */}
      {showUrlInput && (
        <div style={{ background:"rgba(26,15,46,0.98)", border:`1px solid ${P.border}`, borderRadius:12, padding:"12px 14px", margin:"6px 12px 0", display:"flex", gap:8, animation:"fadeIn 0.2s" }}>
          <input value={urlInput} onChange={e => setUrlInput(e.target.value)} placeholder="https://... URL de la imagen" style={{ flex:1, background:"rgba(255,255,255,0.07)", border:`1px solid ${P.border}`, borderRadius:8, padding:"8px 12px", color:P.txt, fontSize:13, outline:"none", fontFamily:"Poppins" }}/>
          <button onClick={() => { if (urlInput.trim()) { addImage(urlInput.trim()); setUrlInput(""); setShowUrlInput(false); } }} style={{ background:`linear-gradient(135deg,${P.p1},${P.p3})`, border:"none", borderRadius:8, padding:"8px 14px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer" }}>Agregar</button>
        </div>
      )}
      {showEmojiPicker && (
        <div style={{ background:"rgba(26,15,46,0.98)", border:`1px solid ${P.border}`, borderRadius:12, padding:12, margin:"6px 12px 0", display:"flex", flexWrap:"wrap", gap:6, animation:"fadeIn 0.2s" }}>
          {EMOJIS.map(em => <button key={em} onClick={() => addEmoji(em)} style={{ background:"none", border:"none", fontSize:26, cursor:"pointer", padding:4, borderRadius:8, transition:"background 0.15s" }} onMouseEnter={e => (e.currentTarget.style.background="rgba(168,85,247,0.2)")} onMouseLeave={e => (e.currentTarget.style.background="none")}>{em}</button>)}
        </div>
      )}
      {showQuotes && (
        <div style={{ background:"rgba(26,15,46,0.98)", border:`1px solid ${P.border}`, borderRadius:12, padding:12, margin:"6px 12px 0", display:"flex", flexDirection:"column", gap:6, animation:"fadeIn 0.2s", maxHeight:200, overflowY:"auto" }}>
          {QUOTES.map(q => <button key={q} onClick={() => addQuote(q)} style={{ background:"none", border:`1px solid ${P.border}`, borderRadius:8, padding:"8px 12px", color:P.txt, fontSize:12, cursor:"pointer", textAlign:"left", fontFamily:"Georgia", fontStyle:"italic" }}>{q}</button>)}
        </div>
      )}
      {showPdfModal && (
        <div style={{ background:"rgba(26,15,46,0.98)", border:`1px solid ${P.border}`, borderRadius:12, padding:"12px 14px", margin:"6px 12px 0", display:"flex", gap:8, alignItems:"center", animation:"fadeIn 0.2s" }}>
          <span style={{ fontSize:13, color:P.muted, whiteSpace:"nowrap" }}>📄 Nombre:</span>
          <input value={pdfName} onChange={e => setPdfName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") exportPDF(pdfName); if (e.key === "Escape") setShowPdfModal(false); }} placeholder="mi-vision-board" autoFocus style={{ flex:1, background:"rgba(255,255,255,0.07)", border:`1px solid ${P.border}`, borderRadius:8, padding:"8px 12px", color:P.txt, fontSize:13, outline:"none", fontFamily:"Poppins" }}/>
          <span style={{ fontSize:12, color:P.muted }}>.pdf</span>
          <button onClick={() => exportPDF(pdfName)} style={{ background:`linear-gradient(135deg,${P.p1},${P.p3})`, border:"none", borderRadius:8, padding:"8px 14px", color:"#fff", fontSize:12, fontWeight:700, cursor:"pointer", whiteSpace:"nowrap" }}>
            {exporting ? "⏳" : "Exportar"}
          </button>
        </div>
      )}
      {showBgPicker && (
        <div style={{ background:"rgba(26,15,46,0.98)", border:`1px solid ${P.border}`, borderRadius:12, padding:12, margin:"6px 12px 0", animation:"fadeIn 0.2s" }}>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:10 }}>
            {BACKGROUNDS.map(b => (
              <button key={b.value} title={b.label} onClick={() => { setBg(b.value); setBgImage(null); }} style={{ width:48, height:48, borderRadius:10, background:b.value, border: bg === b.value && !bgImage ? "3px solid #fff" : `2px solid ${P.border}`, cursor:"pointer" }}/>
            ))}
          </div>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <input ref={bgFileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => {
              const f = e.target.files?.[0];
              if (!f) return;
              if (f.size > 8_000_000) { alert("Imagen muy grande (máx 8 MB)."); return; }
              const r = new FileReader();
              r.onload = ev => { setBgImage(ev.target?.result as string); setShowBgPicker(false); };
              r.readAsDataURL(f);
            }}/>
            <button onClick={() => bgFileRef.current?.click()} style={{ background:"rgba(168,85,247,0.15)", border:`1px solid ${P.border}`, borderRadius:8, padding:"7px 12px", color:P.txt, fontSize:12, cursor:"pointer", fontWeight:600 }}>📷 Imagen de fondo</button>
            <span style={{ fontSize:11, color:P.muted }}>o color:</span>
            <input type="color" defaultValue="#0d0a1a" onChange={e => { setBg(e.target.value); setBgImage(null); }} style={{ width:36, height:36, border:"none", borderRadius:8, cursor:"pointer", background:"none" }}/>
          </div>
        </div>
      )}

      {/* ── Panel edición elemento seleccionado ── */}
      {selectedEl && !editingText && (
        <div style={{ background:"rgba(13,10,26,0.97)", borderBottom:`1px solid ${P.border}`, padding:"8px 12px", display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", animation:"fadeIn 0.2s", flexShrink:0 }}>
          {(selectedEl.type === "text" || selectedEl.type === "quote") && <>
            <input type="color" value={selectedEl.color || "#f0e6ff"} onChange={e => updateEl({ color:e.target.value })} style={{ width:30, height:30, border:"none", borderRadius:6, cursor:"pointer" }} title="Color texto"/>
            <select value={selectedEl.fontSize || 18} onChange={e => updateEl({ fontSize:+e.target.value })} style={{ background:"rgba(255,255,255,0.07)", border:`1px solid ${P.border}`, borderRadius:6, color:P.txt, padding:"4px 6px", fontSize:12 }}>
              {[10,12,14,16,18,20,24,28,32,40,48,60].map(s => <option key={s} value={s}>{s}px</option>)}
            </select>
            <select value={selectedEl.fontFamily || "Poppins"} onChange={e => updateEl({ fontFamily:e.target.value })} style={{ background:"rgba(255,255,255,0.07)", border:`1px solid ${P.border}`, borderRadius:6, color:P.txt, padding:"4px 6px", fontSize:12 }}>
              {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <button onClick={() => updateEl({ bold:!selectedEl.bold })} style={{ background: selectedEl.bold ? `linear-gradient(135deg,${P.p1},${P.p3})` : "rgba(255,255,255,0.07)", border:"none", borderRadius:6, padding:"4px 10px", color:"#fff", fontWeight:800, cursor:"pointer" }}>B</button>
            <button onClick={() => updateEl({ italic:!selectedEl.italic })} style={{ background: selectedEl.italic ? `linear-gradient(135deg,${P.p1},${P.p3})` : "rgba(255,255,255,0.07)", border:"none", borderRadius:6, padding:"4px 10px", color:"#fff", fontStyle:"italic", cursor:"pointer" }}>I</button>
            <button onClick={() => setEditingText(selectedEl.id)} style={{ background:"rgba(168,85,247,0.2)", border:`1px solid ${P.border}`, borderRadius:6, padding:"4px 10px", color:P.txt, fontSize:12, cursor:"pointer" }}>✏️ Editar</button>
          </>}
          {selectedEl.type === "shape" && <>
            <label style={{ fontSize:11, color:P.muted }}>Relleno</label>
            <input type="color" value={selectedEl.fill || "#9333ea"} onChange={e => updateEl({ fill:e.target.value })} style={{ width:30, height:30, border:"none", borderRadius:6, cursor:"pointer" }}/>
            <label style={{ fontSize:11, color:P.muted }}>Borde</label>
            <input type="color" value={selectedEl.stroke || "#ffffff"} onChange={e => updateEl({ stroke:e.target.value })} style={{ width:30, height:30, border:"none", borderRadius:6, cursor:"pointer" }}/>
          </>}
          <label style={{ fontSize:11, color:P.muted }}>Opacidad</label>
          <input type="range" min={0.1} max={1} step={0.05} value={selectedEl.opacity ?? 1} onChange={e => updateEl({ opacity:+e.target.value })} style={{ width:70 }}/>
          <span style={{ fontSize:11, color:P.muted, marginLeft:4 }}>↻ {selectedEl.rotation}°</span>
          <button onClick={bringForward} title="Traer adelante" style={{ background:"rgba(255,255,255,0.07)", border:"none", borderRadius:6, padding:"4px 8px", color:P.txt, cursor:"pointer", fontSize:14 }}>↑</button>
          <button onClick={sendBack}    title="Enviar atrás"   style={{ background:"rgba(255,255,255,0.07)", border:"none", borderRadius:6, padding:"4px 8px", color:P.txt, cursor:"pointer", fontSize:14 }}>↓</button>
          <button onClick={deleteEl} style={{ background:"rgba(239,68,68,0.3)", border:"none", borderRadius:6, padding:"4px 10px", color:"#fca5a5", fontSize:12, cursor:"pointer", fontWeight:700, marginLeft:"auto" }}>🗑 Eliminar</button>
        </div>
      )}

      {/* ── Canvas ── */}
      <div ref={scrollRef} style={{ flex:1, overflowY:"auto", overflowX:"hidden", WebkitOverflowScrolling:"touch", padding: desktop ? "16px 20px 24px" : "10px 10px 20px", paddingBottom: desktop ? 24 : "calc(20px + env(safe-area-inset-bottom))" }}>
        <div
          ref={boardRef}
          onClick={() => { setSelected(null); setEditingText(null); }}
          style={{
            position:"relative", width:"100%", height:boardH,
            background: bgImage ? `url(${bgImage}) center/cover no-repeat` : bg,
            borderRadius:16, overflow:"hidden",
            boxShadow:"0 8px 40px rgba(0,0,0,0.5)",
            cursor:"crosshair", userSelect:"none",
          }}
        >
          {elements.length === 0 && (
            <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🌟</div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:"rgba(255,255,255,0.3)" }}>Tu vision board</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.2)", marginTop:6 }}>Agrega imágenes, texto y formas desde la barra</div>
            </div>
          )}

          {elements.map(el => (
            <div
              key={el.id}
              className="vb-el"
              onMouseDown={e => startDrag(e, el.id)}
              onTouchStart={e => startDrag(e, el.id)}
              onClick={e => { e.stopPropagation(); setSelected(el.id); }}
              style={{
                position:"absolute", left:el.x, top:el.y, width:el.w, height:el.h,
                transform:`rotate(${el.rotation}deg)`,
                opacity:el.opacity ?? 1,
                cursor:"grab",
                outline: selected === el.id ? "2px solid rgba(168,85,247,0.9)" : "none",
                boxShadow: selected === el.id ? "0 0 0 4px rgba(168,85,247,0.2)" : "none",
                borderRadius:4, touchAction:"none",
              }}
            >
              {/* Handle de rotación */}
              {selected === el.id && (
                <div style={{ position:"absolute", top:-46, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", zIndex:20, pointerEvents:"none" }}>
                  <div
                    onMouseDown={e => startRotate(e, el)}
                    onTouchStart={e => startRotate(e, el)}
                    title="Girar"
                    style={{ width:20, height:20, borderRadius:"50%", background:`linear-gradient(135deg,${P.p1},${P.p3})`, border:"2.5px solid #fff", cursor:"grab", pointerEvents:"all", boxShadow:"0 2px 10px rgba(147,51,234,0.6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#fff", fontWeight:700, userSelect:"none" }}
                  >↻</div>
                  <div style={{ width:2, height:24, background:`linear-gradient(to bottom,${P.p1},rgba(168,85,247,0.3))` }}/>
                </div>
              )}

              {/* Resize handles en esquinas (mouse + touch) */}
              {selected === el.id && (
                <div className="vb-handles" style={{ opacity:1 }}>
                  {([[-1,-1],[1,-1],[-1,1],[1,1]] as [number,number][]).map(([cx,cy],i) => (
                    <div
                      key={i}
                      onMouseDown={e => startResize(e, el, cx, cy)}
                      onTouchStart={e => startResize(e, el, cx, cy)}
                      style={{
                        position:"absolute",
                        [cy === -1 ? "top" : "bottom"]: -9,
                        [cx === -1 ? "left" : "right"]: -9,
                        width:18, height:18, borderRadius:"50%",
                        background:P.p1, border:"2.5px solid #fff",
                        boxShadow:"0 1px 6px rgba(0,0,0,0.4)",
                        cursor:"nwse-resize", zIndex:10, touchAction:"none",
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Contenido */}
              {el.type === "image" && (
                el.src
                  ? <img src={el.src} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:4, pointerEvents:"none", display:"block" }} crossOrigin="anonymous"/>
                  : <div style={{ width:"100%", height:"100%", background:"rgba(168,85,247,0.15)", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, color:P.muted }}>⚠️ Img no guardada</div>
              )}
              {el.type === "shape" && renderShape(el)}
              {el.type === "emoji" && (
                <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:Math.min(el.w,el.h)*0.7, lineHeight:1, userSelect:"none" }}>{el.emoji}</div>
              )}
              {(el.type === "text" || el.type === "quote") && (
                editingText === el.id
                  ? <textarea
                      autoFocus
                      value={el.content || ""}
                      onChange={e => updateEl({ content:e.target.value })}
                      onBlur={() => setEditingText(null)}
                      onClick={e => e.stopPropagation()}
                      style={{ width:"100%", height:"100%", background:"rgba(0,0,0,0.5)", border:"none", outline:"none", resize:"none", color:el.color||"#f0e6ff", fontSize: Math.max(16, el.fontSize||18), fontFamily:el.fontFamily||"Poppins", fontWeight:el.bold?700:400, fontStyle:el.italic?"italic":"normal", textAlign:el.align||"center", padding:8, borderRadius:4, cursor:"text" }}/>
                  : <div
                      onDoubleClick={e => { e.stopPropagation(); setEditingText(el.id); }}
                      style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent: el.align==="left"?"flex-start":el.align==="right"?"flex-end":"center", padding:8, boxSizing:"border-box" }}
                    >
                      <p style={{ margin:0, color:el.color||"#f0e6ff", fontSize:el.fontSize||18, fontFamily:el.fontFamily||"Poppins", fontWeight:el.bold?700:400, fontStyle:el.italic?"italic":"normal", textAlign:el.align||"center", lineHeight:1.4, wordBreak:"break-word", textShadow:"0 1px 4px rgba(0,0,0,0.5)" }}>{el.content}</p>
                    </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop:10, fontSize:11, color:P.muted, textAlign:"center" }}>
          💡 Arrastra para mover · Doble clic en texto para editar · Esquinas para redimensionar · Círculo ↻ para girar
        </div>
      </div>

      {/* ── Toast "qué creativa" ── */}
      {creativeToast && (
        <div style={{ position:"fixed", bottom:28, right:20, zIndex:9999, background:"rgba(13,10,26,0.97)", border:`1px solid ${P.borderHi}`, borderRadius:16, padding:"12px 16px", maxWidth:260, boxShadow:"0 8px 32px rgba(147,51,234,0.4)", display:"flex", flexDirection:"column", alignItems:"center", gap:8, animation:"fadeIn 0.3s" }}>
          <img src="https://media4.giphy.com/media/deOKie3HCHOAo/giphy.gif" alt="creativa" style={{ width:160, height:120, objectFit:"cover", borderRadius:10, border:`1px solid ${P.border}` }}/>
          <p style={{ margin:0, color:P.txt, fontSize:14, fontWeight:700, textAlign:"center", fontFamily:"'Poppins',sans-serif" }}>{creativeMsg}</p>
        </div>
      )}
    </div>
  );
}

// ── Botón toolbar ─────────────────────────────────────────────────────────────
function ToolBtn({ icon, label, onClick, accent }: { icon:string; label:string; onClick:()=>void; accent?:boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <button className="vb-toolbar-btn" onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} title={label}
      style={{ background: accent ? (hover?"linear-gradient(135deg,#9333ea,#db2777)":"rgba(147,51,234,0.2)") : (hover?"rgba(255,255,255,0.12)":"rgba(255,255,255,0.06)"), border:`1px solid ${accent?"rgba(147,51,234,0.5)":"rgba(168,85,247,0.2)"}`, borderRadius:8, padding:"5px 8px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:1, transition:"all 0.15s" }}>
      <span style={{ fontSize:16 }}>{icon}</span>
      <span style={{ fontSize:9, color:"rgba(240,230,255,0.6)", fontFamily:"Poppins", whiteSpace:"nowrap" }}>{label}</span>
    </button>
  );
}
