import { localDateStr } from "@/lib/date";

// ═══════════════════════════════════════════════════════════════
//  CUENTA REGRESIVA AL CUMPLE DE CATA — 1 al 20 de octubre
//  Todo el texto vive aquí para editarlo fácil (mensajes, carta, razones, fotos).
// ═══════════════════════════════════════════════════════════════

export const CUMPLE_NAME = "Cata";
export const CUMPLE_MONTH = 10; // octubre
export const CUMPLE_DAY = 20;

export interface CumpleDay {
  day: number;
  emoji: string;
  year: string; // texto libre: "1950", "Octubre de 1902"...
  title: string;
  fact: string; // lo que pasó
  love: string; // el giro hacia ella
  song?: { title: string; artist: string; year: string; note: string; dedication: string };
}

export const CUMPLE_DAYS: CumpleDay[] = [
  {
    day: 1, emoji: "🏰", year: "1971", title: "Se abrió la magia",
    fact: "Un 1 de octubre como hoy, pero de 1971, abrió sus puertas el Magic Kingdom de Walt Disney World, en Florida. Miles de personas cruzaron la entrada por primera vez para vivir un cuento de hadas de verdad.",
    love: "Fue un día importante para la historia de los sueños… pero no tanto como el 20 de octubre, el día en que nació la reina de MI cuento. Faltan 19 días, Cata 👑",
    song: { title: "Something", artist: "The Beatles", year: "1969", note: "Ese día salió en Estados Unidos «Abbey Road», el último disco que grabaron juntos los cuatro Beatles, con «Something», una de las canciones de amor más bonitas de la historia.", dedication: "Te la dedico porque contigo me pasa exactamente eso: hay algo en ti, en tu forma de ser, que me atrapó y no me suelta." },
  },
  {
    day: 2, emoji: "🐶", year: "1950", title: "Empezó la pandilla de Charlie Brown",
    fact: "Hoy, en 1950, se publicó por primera vez la tira cómica Peanuts, con Charlie Brown, Snoopy y toda la pandilla. Empezó en solo siete periódicos y terminó enamorando al mundo entero.",
    love: "Algo pequeño que se volvió gigante: así me pasó contigo. Fue importante, sí, pero no tanto como tu cumpleaños. Faltan 18 días 💜",
  },
  {
    day: 3, emoji: "🐭", year: "1955", title: "«¿Quién es el líder del club?»",
    fact: "El 3 de octubre de 1955 salió al aire por primera vez «El Club de Mickey Mouse» (The Mickey Mouse Club) en la televisión de Estados Unidos. Cada tarde, millones de niños se sentaban frente al televisor a cantar, bailar y soñar con los Mouseketeers y sus orejitas.",
    love: "Ese club tenía orejitas, y yo tengo mi propia conejita de orejitas favorita. Muy famoso el 3 de octubre, pero el 20 lo supera por mucho. Faltan 17 días 🎀",
  },
  {
    day: 4, emoji: "🐰", year: "Octubre de 1902",
    title: "Un conejo con chaqueta azul",
    fact: "Hoy es el Día Mundial de los Animales. Y fue en octubre de 1902 cuando Beatrix Potter publicó «El cuento de Pedro Conejo», el conejito travieso de chaqueta azul que se coló en el huerto del señor McGregor.",
    love: "Y aun con toda esa fama, ningún conejo del mundo me ha quitado el sueño como mi conejita. Importante fecha, pero tu cumpleaños es más. Faltan 16 días 🥕",
  },
  {
    day: 5, emoji: "💎", year: "1961", title: "Desayuno con diamantes",
    fact: "El 5 de octubre de 1961 se estrenó en Nueva York «Desayuno con diamantes» con Audrey Hepburn, y ese vestido negro se volvió el más famoso de la historia del cine.",
    love: "Audrey fue elegancia pura frente a una vitrina. Tú eres elegancia y ternura frente a cualquier cosa, incluso un lunes. Gran estreno, pero no tanto como tu día. Faltan 15 días ✨",
    song: { title: "I Honestly Love You", artist: "Olivia Newton-John", year: "1974", note: "El 5 de octubre de 1974, «I Honestly Love You» llegó al número 1 de la lista Billboard en Estados Unidos y le dio a Olivia Newton-John su primer número uno. Es una balada sobre atreverse a decir «te quiero» de verdad, sin adornos.", dedication: "Te la dedico porque quiero decírtelo así, sin adornos y con toda la sinceridad: te quiero de verdad, Cata." },
  },
  {
    day: 6, emoji: "🎬", year: "1927", title: "El cine aprendió a hablar",
    fact: "Un 6 de octubre de 1927 se estrenó «El cantante de jazz», la primera película larga con diálogo sincronizado. Hasta ese día el cine era mudo; después de ella, nada volvió a ser silencio.",
    love: "El cine tardó décadas en aprender a hablar; yo aprendí a decirte lo que siento a punta de mirarte. Un día que cambió la historia del cine, pero no tanto como el día en que naciste tú. Faltan 14 días 🎞️",
  },
  {
    day: 7, emoji: "🕊️", year: "1950", title: "Una vida entera de cariño",
    fact: "El 7 de octubre de 1950 se aprobó oficialmente la congregación de las Misioneras de la Caridad, fundada por la Madre Teresa de Calcuta para cuidar a quienes nadie más cuidaba.",
    love: "Hay quienes cambian el mundo cuidando. Tú cambias el mío igual. Un día enorme de esa historia, pero el 20 de octubre es aún más grande para mí. Faltan 13 días 🤍",
    song: { title: "Got To Be There", artist: "Michael Jackson", year: "1971", note: "El primer sencillo solista de Michael Jackson, cuando aún era un niño con una voz enorme.", dedication: "Te la dedico porque siempre quiero estar ahí para ti, en las buenas, en las malas y en las de «no sé cómo me siento»." },
  },
  {
    day: 8, emoji: "🌹", year: "1968", title: "Romeo y Julieta llegó al cine",
    fact: "El 8 de octubre de 1968 se estrenó en Estados Unidos «Romeo y Julieta» de Franco Zeffirelli, con actores jóvenes de verdad, y su banda sonora hizo suspirar a toda una generación.",
    love: "Ellos se amaron con drama. Yo te amo con calma, con risas y contigo eligiéndome de vuelta. Bonito estreno, pero tu cumpleaños es el mejor de todos. Faltan 12 días 🌹",
  },
  {
    day: 9, emoji: "🎵", year: "1940", title: "Nació quien imaginó un mundo mejor",
    fact: "Hoy, en 1940, nació John Lennon en Liverpool. Compuso «Imagine» y «All You Need Is Love», canciones que todavía nos hacen creer que el amor lo puede todo.",
    love: "Él tenía razón: todo lo que necesitas es amor. Yo solo necesito que tú sigas siendo tú. Importante nacimiento, pero ninguno más importante que el tuyo. Faltan 11 días 🎶",
  },
  {
    day: 10, emoji: "🧠", year: "Hoy",
    title: "Día Mundial de la Salud Mental",
    fact: "Cada 10 de octubre se celebra el Día Mundial de la Salud Mental, para recordarnos que sentirse bien por dentro importa tanto como cualquier meta. Por eso existe el registro de ánimo en tu rinconcito.",
    love: "Que tengas días felices, tristes, cansados o de mil ánimos a la vez, y que sepas que en todos me tienes a mí. Un día importante, pero no tanto como el 20. Faltan 10 días — ¡ya estamos a la mitad! 💜",
    song: { title: "A Dios le pido", artist: "Juanes", year: "2002", note: "Esta no salió un 10 de octubre (Juanes la lanzó en marzo de 2002), pero hoy quise dedicarte una canción colombiana. Es una de las más queridas de nuestro país: una canción para pedir cosas buenas para la gente que uno quiere.", dedication: "Te la dedico porque yo también pido lo mismo para ti: que estés siempre bien, que sonrías mucho y que la vida te devuelva todo lo bonito que das." },
  },
  {
    day: 11, emoji: "📺", year: "1975", title: "«¡En vivo desde Nueva York!»",
    fact: "El 11 de octubre de 1975 salió al aire el primer episodio de Saturday Night Live. Casi 50 años después, sigue mandando risas a la televisión cada semana.",
    love: "Me río contigo mucho más de lo que me río con cualquier programa. Historia de la tele, sí, pero tu cumpleaños es mejor evento en vivo. Faltan 9 días 😂",
  },
  {
    day: 12, emoji: "🥂", year: "1810", title: "La fiesta que nunca se acabó",
    fact: "El 12 de octubre de 1810 se casaron el príncipe Luis de Baviera y la princesa Teresa, y Múnich celebró con una gran fiesta pública. Así nació el Oktoberfest, que después no se detuvo por más de 200 años.",
    love: "Una boda que se convirtió en la fiesta más grande del mundo. Yo no necesito una boda real para hacer fiesta: me alcanza con tu cumpleaños. Faltan 8 días 🎉",
  },
  {
    day: 13, emoji: "📱", year: "1983", title: "La primera llamada de celular",
    fact: "El 13 de octubre de 1983 se hizo en Chicago la primera llamada comercial desde un teléfono móvil, con un aparato que pesaba casi un kilo. Sin ese día, hoy no existirían los «buenos días, mi reina» por mensaje.",
    love: "Gracias a esa llamada puedo mandarte un audio desde cualquier lugar. Invento inmenso, pero la mejor llamada del año será la del 20. Faltan 7 días 📞",
  },
  {
    day: 14, emoji: "🚀", year: "1947", title: "Romper la barrera del sonido",
    fact: "El 14 de octubre de 1947 el piloto Chuck Yeager voló el Bell X-1 más rápido que el sonido y fue el primero en hacerlo. Su historia llegó al cine en «Elegidos para la gloria».",
    love: "Todo el mundo decía que era imposible, y alguien lo logró. Yo también sentí que encontrar a alguien como tú era casi imposible, y aquí estás. Gran hazaña, pero no tan grande como tu cumple. Faltan 6 días ✈️",
  },
  {
    day: 15, emoji: "❤️", year: "1951", title: "Todos amaban a Lucy",
    fact: "El 15 de octubre de 1951 se estrenó «Te quiero, Lucy» (I Love Lucy), la comedia que le enseñó a la televisión cómo se hace reír a todo un país en la sala de la casa.",
    love: "El título ya lo dice todo. Y como a Lucy, a ti te quiero por tu manera de ser, tan tuya. Gran estreno, pero tu día es mejor. Faltan 5 días 💋",
    song: { title: "You Light Up My Life", artist: "Debby Boone", year: "1977", note: "En octubre de 1977, «You Light Up My Life» de Debby Boone llegó al número 1 en Estados Unidos y se quedó ahí diez semanas seguidas, un récord para su época. Es una canción de agradecimiento a esa persona que le da luz a tus días.", dedication: "Te la dedico porque eso eres tú para mí: la persona que ilumina mis días, incluso los grises." },
  },
  {
    day: 16, emoji: "🐭", year: "1923", title: "Nació un ratón que cambió todo",
    fact: "El 16 de octubre de 1923 Walt y Roy Disney fundaron su estudio de animación, el mismo que años después crearía a Mickey Mouse, Blancanieves y tantos sueños más.",
    love: "Empezó con un dibujo y una idea, y terminó siendo magia. Yo empecé contigo con un «hola» y terminé enamorado. Día grande, pero no tanto como el 20. Faltan 4 días ✨",
    song: { title: "Crazy", artist: "Patsy Cline", year: "1961", note: "«Crazy» de Patsy Cline salió a la venta y desde entonces es una de las canciones más queridas de toda la música country.", dedication: "Te la dedico porque quien me vuelve un poco loco (de amor, claro) eres tú." },
  },
  {
    day: 17, emoji: "🎃", year: "1998", title: "Bienvenida a Halloweentown",
    fact: "El 17 de octubre de 1998 se estrenó en Disney Channel «Halloweentown», la película de la bruja adolescente Marnie y su abuela. Desde entonces vuelve cada octubre como tradición.",
    love: "Es la magia de octubre en casa, y yo tengo mi propia magia de octubre: tú. Estreno de culto, pero el mejor octubre de todos es el que trae tu cumpleaños. Faltan 3 días 🧙‍♀️",
  },
  {
    day: 18, emoji: "💡", year: "1931", title: "Se apagó el genio de la luz",
    fact: "El 18 de octubre de 1931 murió Thomas Edison, el inventor que le dio luz a millones de hogares, y que además ayudó a crear el cine con su kinetoscopio.",
    love: "Él iluminó las casas; tú iluminas mis días sin gastar nada de energía. Fecha importante, pero para mí lo es más el 20. Faltan 2 días 💡",
  },
  {
    day: 19, emoji: "📖", year: "1953", title: "Un libro que no se podía quemar",
    fact: "El 19 de octubre de 1953 salió «Fahrenheit 451» de Ray Bradbury, la historia de un mundo donde los libros se queman. Se volvió película y clásico, un recordatorio de que las historias importan.",
    love: "Nuestra historia sí la escribimos para quedarse. Y mañana empieza un capítulo nuevo. Importante libro, pero mañana es un día más importante. Falta 1 día. UNO. Mañana, Cata 💜",
  },
  {
    day: 20, emoji: "🎭", year: "1973", title: "Se abrió el telón en Sídney",
    fact: "El 20 de octubre de 1973 se inauguró la Ópera de Sídney, ese edificio que parece velas de barco y que hoy es símbolo de todo un país. Un 20 de octubre ha sido siempre día de grandes estrenos.",
    love: "Pero hoy no es ningún estreno: hoy es EL día. El más importante de todos. El día en que nació mi razón favorita para sonreír. ¡FELIZ CUMPLEAÑOS, CATA! 🎂👑",
  },
];

export const CUMPLE_LETTER: string[] = [
  "Cata,",
  "Durante veinte días te conté cosas que pasaron en el mundo, cosas muy importantes, y en cada una te dije lo mismo: que no eran tan importantes como este día.",
  "Porque el mundo tiene sus estrenos, sus inventos y sus fiestas. Pero yo tengo el 20 de octubre, el día en que llegó al mundo la persona que hace que todo lo demás valga la pena.",
  "Gracias por dejarme ser parte de tu historia. Por tus risas, por tus ánimos buenos y por los otros, por dejarme acompañarte en todos ellos.",
  "Que este año te devuelva todo el cariño que tú regalas. Te lo mereces todo, mi reina.",
  "Feliz cumpleaños, mi princesa amada. 💜",
];

export const CUMPLE_REASONS: string[] = [
  "Porque tu risa es mi sonido favorito.",
  "Porque siempre encuentras cómo hacerme sentir en casa.",
  "Porque eres la reina de mis días buenos y también de los difíciles.",
  "Porque tu ternura no tiene comparación.",
  "Porque haces bonito lo simple.",
  "Porque contigo hasta un lunes se siente diferente.",
  "Porque creces sin dejar de ser tú.",
  "Porque tu forma de querer es de las que se sienten.",
  "Porque eres constante, aun cuando estás cansada.",
  "Porque tus sueños me contagian.",
  "Porque me haces querer ser mejor.",
  "Porque eres valiente incluso cuando no lo notas.",
  "Porque tu abrazo arregla mucho.",
  "Porque tienes un corazón enorme.",
  "Porque me escuchas de verdad.",
  "Porque tu forma de ver el mundo es única.",
  "Porque hasta tus enojos me parecen tiernos.",
  "Porque contigo quiero más días como hoy.",
  "Porque eres mi persona favorita.",
  "Porque naciste un 20 de octubre, y eso ya es suficiente.",
];

// Pon fotos en /public/cumple/ (por ejemplo "/cumple/1.jpg") y agrégalas aquí.
export const FINALE_PHOTOS: string[] = [];

// ── Fechas ─────────────────────────────────────────────────────

export type CumplePhase = "before" | "active" | "birthday" | "after";

export interface CumpleNow {
  phase: CumplePhase;
  day: number; // día de octubre (1..31) si hay fase activa
  daysLeft: number;
  preview: boolean;
}

const PREVIEW_KEY = "conjita-cumple-preview";
const PREVIEW_TOKEN = "d45aea6b22";

// ?cumple=2026-10-20 simula otra fecha (solo esa pestaña, para probar).
export function readPreview(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get("cumple");
    if (q === "off") sessionStorage.removeItem(PREVIEW_KEY);
    else if (q && sp.get("k") === PREVIEW_TOKEN && /^\d{4}-\d{2}-\d{2}$/.test(q)) sessionStorage.setItem(PREVIEW_KEY, q);
    return sessionStorage.getItem(PREVIEW_KEY);
  } catch {
    return null;
  }
}

export function getCumpleNow(): CumpleNow {
  const pv = readPreview();
  const s = pv || localDateStr();
  const [, m, d] = s.split("-").map(Number);
  let phase: CumplePhase = "before";
  if (m === CUMPLE_MONTH) {
    if (d < CUMPLE_DAY) phase = d >= 1 ? "active" : "before";
    else if (d === CUMPLE_DAY) phase = "birthday";
    else phase = "after";
  } else if (m > CUMPLE_MONTH) phase = "after";
  return { phase, day: m === CUMPLE_MONTH ? d : 0, daysLeft: Math.max(0, CUMPLE_DAY - d), preview: !!pv };
}

export const cumpleYear = () => {
  const pv = readPreview();
  return (pv || localDateStr()).slice(0, 4);
};

export const SEEN_DAY_KEY = "conjita-cumple-seen-day";
export const FINALE_SEEN_KEY = "conjita-cumple-finale-seen";
