/* ============================================================
   CONEJITA — Character Bible mascot generator
   Puffy 3D sticker style, pure SVG. All gradients live once in
   #defsHost and are referenced by url(#id) from every figure.
   ============================================================ */

const PALETTE = {
  furLight:  '#FFFFFF',
  furMid:    '#F3EAFF',
  furShade:  '#E2D2F6',
  furDeep:   '#CDB6EC',
  earLight:  '#FCD6E7',
  earMid:    '#F6A6C8',
  earDeep:   '#E97BAE',
  eyeTop:    '#3B2557',
  eyeBottom: '#1A0E2E',
  blush:     '#FF9DBC',
  nose:      '#FF6F9C',
  noseDeep:  '#EC4E84',
  goldLight: '#FFE9A8',
  goldMid:   '#FFC94D',
  goldDeep:  '#E0941A',
  gem:       '#FF6FA5',
  outline:   '#3D2257',
  worldPurp: '#9333ea',
  worldPink: '#db2777',
  bgDark:    '#0d0a1a'
};

/* ---------- shared defs ---------- */
function defsMarkup(){
  return `
  <defs>
    <radialGradient id="furGrad" cx="38%" cy="30%" r="80%">
      <stop offset="0%"  stop-color="#FFFFFF"/>
      <stop offset="46%" stop-color="#F6EEFF"/>
      <stop offset="78%" stop-color="#E7D8F8"/>
      <stop offset="100%" stop-color="#D6C0F0"/>
    </radialGradient>
    <radialGradient id="furOcc" cx="50%" cy="78%" r="70%">
      <stop offset="0%"  stop-color="#B98FE0" stop-opacity="0"/>
      <stop offset="74%" stop-color="#B98FE0" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9B6FCB" stop-opacity=".42"/>
    </radialGradient>
    <radialGradient id="gloss" cx="42%" cy="20%" r="55%">
      <stop offset="0%"  stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="55%" stop-color="#FFFFFF" stop-opacity=".18"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rimPink" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0%"  stop-color="#FF8FC6"/>
      <stop offset="100%" stop-color="#C78BFF"/>
    </linearGradient>
    <radialGradient id="earGrad" cx="50%" cy="22%" r="85%">
      <stop offset="0%"  stop-color="#FFE0EE"/>
      <stop offset="48%" stop-color="#F8AFCF"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eyeGrad" cx="40%" cy="32%" r="78%">
      <stop offset="0%"  stop-color="#4A2F69"/>
      <stop offset="55%" stop-color="#2A1742"/>
      <stop offset="100%" stop-color="#160B28"/>
    </radialGradient>
    <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%"  stop-color="#FFA9C6" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FF9DBC" stop-opacity=".55"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="noseGrad" cx="40%" cy="30%" r="80%">
      <stop offset="0%"  stop-color="#FF9CBD"/>
      <stop offset="55%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="crownGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"  stop-color="#FFF1C4"/>
      <stop offset="42%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gemGrad" cx="40%" cy="30%" r="80%">
      <stop offset="0%"  stop-color="#FFC2DC"/>
      <stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <radialGradient id="sparkGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="tearGrad" cx="38%" cy="26%" r="82%">
      <stop offset="0%"  stop-color="#EAF6FF"/>
      <stop offset="50%" stop-color="#AFE0FF"/>
      <stop offset="100%" stop-color="#7FC4F0"/>
    </radialGradient>
    <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="#3a1d5e" flood-opacity=".28"/>
    </filter>
    <filter id="glowSoft" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="3.4"/>
    </filter>
  </defs>`;
}

/* ---------- small parts ---------- */
function sparkle(x, y, s, op){
  op = op==null ? 1 : op;
  return `<path d="M ${x},${y-s} Q ${x+s*0.22},${y-s*0.22} ${x+s},${y}
    Q ${x+s*0.22},${y+s*0.22} ${x},${y+s}
    Q ${x-s*0.22},${y+s*0.22} ${x-s},${y}
    Q ${x-s*0.22},${y-s*0.22} ${x},${y-s} Z"
    fill="url(#sparkGrad)" opacity="${op}"/>`;
}

function crown(cx, cy, scale){
  scale = scale || 1;
  return `<g transform="translate(${cx},${cy}) scale(${scale})" filter="url(#softShadow)">
    <path d="M -30,12 Q -33,-2 -22,-14 Q -16,-2 -9,-12 Q -2,-26 0,-26
             Q 2,-26 9,-12 Q 16,-2 22,-14 Q 33,-2 30,12 Z"
          fill="url(#crownGrad)" stroke="#C97E12" stroke-width="1.4" stroke-linejoin="round"/>
    <path d="M -26,9 Q 0,15 26,9 L 24,14 Q 0,19 -24,14 Z" fill="#F4B53A" opacity=".7"/>
    <circle cx="-22" cy="-15" r="3.4" fill="url(#gemGrad)" stroke="#C97E12" stroke-width=".8"/>
    <circle cx="22"  cy="-15" r="3.4" fill="url(#gemGrad)" stroke="#C97E12" stroke-width=".8"/>
    <circle cx="0" cy="-24" r="4.6" fill="url(#gemGrad)" stroke="#C97E12" stroke-width="1"/>
    <circle cx="-1.4" cy="-25.6" r="1.4" fill="#fff" opacity=".85"/>
    <path d="M -20,-2 Q 0,4 20,-2" stroke="#FFF6D8" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>
  </g>`;
}

/* one ear, local space, tip pointing up; root at (0,0) */
function ear(flop){
  // outer fur + inner ear + gloss + rim
  const outer = `M 0,6 C -21,0 -30,-46 -25,-94 C -22,-128 -7,-150 0,-150
                 C 7,-150 22,-128 25,-94 C 30,-46 21,0 0,6 Z`;
  const inner = `M 0,-10 C -12,-16 -19,-50 -15,-90 C -13,-116 -5,-132 0,-132
                 C 5,-132 13,-116 15,-90 C 19,-50 12,-16 0,-10 Z`;
  const innerG = flop ? 'rotate(0)' : '';
  return `<g>
    <path d="${outer}" fill="url(#furGrad)" stroke="${PALETTE.outline}" stroke-width="1.4" stroke-opacity=".5"/>
    <path d="${outer}" fill="url(#furOcc)"/>
    <path d="${inner}" fill="url(#earGrad)"/>
    <path d="M 0,-22 C -7,-30 -10,-58 -8,-86 C -6,-104 -2,-116 0,-116"
          stroke="#FFD8E8" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55"/>
    <path d="M -16,-70 C -22,-92 -18,-118 -8,-138" stroke="#FFFFFF" stroke-width="3.4"
          fill="none" stroke-linecap="round" opacity=".5"/>
  </g>`;
}

/* tiny front paw / body for chibi */
function chibiBody(){
  return `<g filter="url(#softShadow)">
    <ellipse cx="120" cy="276" rx="50" ry="33" fill="url(#furGrad)"
             stroke="${PALETTE.outline}" stroke-width="1.4" stroke-opacity=".45"/>
    <ellipse cx="120" cy="276" rx="50" ry="33" fill="url(#furOcc)"/>
    <ellipse cx="108" cy="262" rx="26" ry="14" fill="url(#gloss)"/>
    <!-- feet -->
    <ellipse cx="98"  cy="300" rx="17" ry="12" fill="url(#furGrad)" stroke="${PALETTE.outline}" stroke-width="1.2" stroke-opacity=".4"/>
    <ellipse cx="142" cy="300" rx="17" ry="12" fill="url(#furGrad)" stroke="${PALETTE.outline}" stroke-width="1.2" stroke-opacity=".4"/>
    <ellipse cx="98"  cy="302" rx="7" ry="5" fill="url(#earGrad)" opacity=".85"/>
    <ellipse cx="142" cy="302" rx="7" ry="5" fill="url(#earGrad)" opacity=".85"/>
    <!-- arms -->
    <ellipse cx="74"  cy="268" rx="12" ry="17" fill="url(#furGrad)" stroke="${PALETTE.outline}" stroke-width="1.2" stroke-opacity=".4" transform="rotate(18 74 268)"/>
    <ellipse cx="166" cy="268" rx="12" ry="17" fill="url(#furGrad)" stroke="${PALETTE.outline}" stroke-width="1.2" stroke-opacity=".4" transform="rotate(-18 166 268)"/>
  </g>`;
}

/* ---------- expressions ---------- */
function eyeOpen(cx, cy, rx, ry){
  rx = rx||16; ry = ry||20;
  return `<g>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="url(#eyeGrad)"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="#120824" stroke-width="1.2" opacity=".5"/>
    <circle cx="${cx-rx*0.32}" cy="${cy-ry*0.38}" r="${rx*0.36}" fill="#FFFFFF"/>
    <circle cx="${cx+rx*0.34}" cy="${cy+ry*0.28}" r="${rx*0.18}" fill="#FFFFFF" opacity=".85"/>
    <ellipse cx="${cx+rx*0.5}" cy="${cy-ry*0.5}" rx="2.2" ry="2.2" fill="#FFE6F4" opacity=".9"/>
  </g>`;
}
function eyeClosed(cx, cy){ // gentle downward lash arc
  return `<g>
    <path d="M ${cx-14},${cy-2} Q ${cx},${cy+12} ${cx+14},${cy-2}"
          stroke="${PALETTE.outline}" stroke-width="3.6" fill="none" stroke-linecap="round"/>
    <path d="M ${cx-14},${cy-2} q -3,4 -5,3"  stroke="${PALETTE.outline}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M ${cx+14},${cy-2} q 3,4 5,3"   stroke="${PALETTE.outline}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
  </g>`;
}
function eyeHalf(cx, cy){ // focused, half-lidded
  return `<g>
    <ellipse cx="${cx}" cy="${cy+5}" rx="15" ry="13" fill="url(#eyeGrad)"/>
    <circle cx="${cx-5}" cy="${cy}" r="5" fill="#fff"/>
    <path d="M ${cx-16},${cy-3} Q ${cx},${cy-9} ${cx+16},${cy-3}"
          stroke="${PALETTE.outline}" stroke-width="4" fill="none" stroke-linecap="round"/>
  </g>`;
}
function eyeHeart(cx, cy){
  return `<path d="M ${cx},${cy+11} C ${cx-7},${cy+2} ${cx-16},${cy-2} ${cx-16},${cy-9}
    C ${cx-16},${cy-17} ${cx-6},${cy-18} ${cx},${cy-9}
    C ${cx+6},${cy-18} ${cx+16},${cy-17} ${cx+16},${cy-9}
    C ${cx+16},${cy-2} ${cx+7},${cy+2} ${cx},${cy+11} Z"
    fill="url(#gemGrad)" stroke="#D8417A" stroke-width="1.2"/>
    <circle cx="${cx-6}" cy="${cy-8}" r="3" fill="#fff" opacity=".9"/>`;
}

function noseHeart(cx, cy){
  return `<path d="M ${cx},${cy+6} C ${cx-3.4},${cy+1.5} ${cx-8},${cy} ${cx-8},${cy-4}
    C ${cx-8},${cy-8} ${cx-2.6},${cy-8.5} ${cx},${cy-4.5}
    C ${cx+2.6},${cy-8.5} ${cx+8},${cy-8} ${cx+8},${cy-4}
    C ${cx+8},${cy} ${cx+3.4},${cy+1.5} ${cx},${cy+6} Z"
    fill="url(#noseGrad)" stroke="${PALETTE.noseDeep}" stroke-width="1" stroke-opacity=".6"/>
    <circle cx="${cx-2.4}" cy="${cy-3.6}" r="1.5" fill="#fff" opacity=".8"/>`;
}

function browsAndMouth(expr){
  const EL = 92, ER = 148, EY = 168;        // eye centers
  const NX = 120, NY = 200;                  // nose
  const MX = 120, MY = 214;                  // mouth
  let eyes, brows = '', mouth = '', extra = '';

  switch(expr){
    case 'feliz':
      eyes = eyeOpen(EL,EY)+eyeOpen(ER,EY);
      brows = browArc(EL,EY-26,0)+browArc(ER,EY-26,0);
      mouth = `<path d="M ${MX-10},${MY} Q ${MX},${MY+11} ${MX+10},${MY}" stroke="${PALETTE.outline}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      break;
    case 'emocionada':
      eyes = eyeOpen(EL,EY,17,21)+eyeOpen(ER,EY,17,21);
      brows = browArc(EL,EY-30,-3)+browArc(ER,EY-30,-3);
      mouth = openSmile(MX,MY+1,8,9);
      extra = sparkle(54,150,7)+sparkle(190,158,8)+sparkle(176,116,5)+sparkle(64,118,5,.9);
      break;
    case 'dormida':
      eyes = eyeClosed(EL,EY)+eyeClosed(ER,EY);
      mouth = `<ellipse cx="${MX}" cy="${MY+3}" rx="5" ry="6" fill="#7a2e4d" opacity=".85"/>`;
      extra = zzz(168,118);
      break;
    case 'concentrada':
      eyes = eyeHalf(EL,EY)+eyeHalf(ER,EY);
      brows = browLine(EL,EY-24,8)+browLine(ER,EY-24,-8);
      mouth = `<path d="M ${MX-9},${MY+2} L ${MX+9},${MY}" stroke="${PALETTE.outline}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      extra = `<g opacity=".9">${sparkle(184,150,5)}</g>`;
      break;
    case 'orgullosa':
      eyes = eyeConfident(EL,EY)+eyeConfident(ER,EY);
      brows = browArc(EL,EY-27,-4)+browArc(ER,EY-27,-4);
      mouth = `<path d="M ${MX-11},${MY-1} Q ${MX},${MY+9} ${MX+11},${MY-1}" stroke="${PALETTE.outline}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      extra = sparkle(188,120,6)+sparkle(56,124,5);
      break;
    case 'guino':
      eyes = eyeClosed(EL,EY)+eyeOpen(ER,EY,17,21);
      brows = browArc(EL,EY-24,2)+browArc(ER,EY-30,-3);
      mouth = openSmile(MX+2,MY,7,7);
      extra = sparkle(58,150,7);
      break;
    case 'enojada':
      eyes = eyeOpen(EL,EY,14,16)+eyeOpen(ER,EY,14,16);
      brows = browLine(EL,EY-22,13)+browLine(ER,EY-22,-13);
      mouth = `<path d="M ${MX-9},${MY+2} Q ${MX-4.5},${MY-3} ${MX},${MY+2} Q ${MX+4.5},${MY-3} ${MX+9},${MY+2}" stroke="${PALETTE.outline}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      extra = angerMark(184,120);
      break;
    case 'amor':
      eyes = eyeHeart(EL,EY)+eyeHeart(ER,EY);
      mouth = openSmile(MX,MY,7,6);
      extra = floatHeart(58,128,8)+floatHeart(186,140,10)+floatHeart(176,108,6);
      break;
    case 'triste':
      eyes = eyeSad(EL,EY)+eyeSad(ER,EY);
      brows = browWorryL(EL,EY-27)+browWorryR(ER,EY-27);
      mouth = frownMouth(MX,MY);
      extra = tear(76,EY+12,6.5);
      break;
    case 'llorando':
      eyes = eyeCry(EL,EY)+eyeCry(ER,EY);
      brows = browWorryL(EL,EY-25)+browWorryR(ER,EY-25);
      mouth = wailMouth(MX,MY+2);
      extra = tearStream(EL,EY+9,30)+tearStream(ER,EY+9,30);
      break;
    case 'preocupada':
      eyes = eyeOpen(EL,EY,13,16)+eyeOpen(ER,EY,13,16);
      brows = browWorryL(EL,EY-25)+browWorryR(ER,EY-25);
      mouth = wiggleMouth(MX,MY);
      extra = tear(182,124,5.5);
      break;
    case 'sorprendida':
      eyes = eyeOpen(EL,EY,18,23)+eyeOpen(ER,EY,18,23);
      brows = browArc(EL,EY-35,5)+browArc(ER,EY-35,5);
      mouth = ohMouth(MX,MY);
      extra = sparkle(188,118,6)+sparkle(54,124,5,.9);
      break;
    case 'tranquila':
      eyes = eyeContent(EL,EY)+eyeContent(ER,EY);
      brows = browArc(EL,EY-28,1)+browArc(ER,EY-28,1);
      mouth = `<path d="M ${MX-9},${MY-1} Q ${MX},${MY+8} ${MX+9},${MY-1}" stroke="${PALETTE.outline}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      extra = `<g opacity=".75">${sparkle(186,150,4)}</g>`;
      break;
    case 'agradecida':
      eyes = eyeContent(EL,EY)+eyeContent(ER,EY);
      brows = browArc(EL,EY-28,2)+browArc(ER,EY-28,2);
      mouth = `<path d="M ${MX-10},${MY} Q ${MX},${MY+11} ${MX+10},${MY}" stroke="${PALETTE.outline}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      extra = floatHeart(58,140,7)+floatHeart(184,150,8)+sparkle(176,112,4,.8);
      break;
    case 'timida':
      eyes = eyeShy(EL,EY)+eyeShy(ER,EY);
      brows = browArc(EL,EY-26,2)+browArc(ER,EY-26,2);
      mouth = `<path d="M ${MX-6},${MY+1} Q ${MX},${MY+6} ${MX+6},${MY+1}" stroke="${PALETTE.outline}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
      extra = shiverMark(56,188,-1)+shiverMark(184,188,1);
      break;
    case 'motivada':
      eyes = eyeConfident(EL,EY)+eyeConfident(ER,EY);
      brows = browLine(EL,EY-26,7)+browLine(ER,EY-26,-7);
      mouth = openSmile(MX,MY,8,8);
      extra = sparkle(188,114,6)+sparkle(54,150,4,.85)+glyph(56,120,'!',22,'#FFC94D');
      break;
    case 'aburrida':
      eyes = eyeHalf(EL,EY)+eyeHalf(ER,EY);
      brows = browArc(EL,EY-26,2)+browArc(ER,EY-26,2);
      mouth = flatMouth(MX,MY);
      extra = glyph(182,150,'· · ·',16,'#B7A8DA');
      break;
    case 'curiosa':
      eyes = eyeOpen(EL,EY,15,18)+eyeOpen(ER,EY,15,18);
      brows = browArc(EL,EY-32,4)+browArc(ER,EY-24,0);
      mouth = `<ellipse cx="${MX}" cy="${MY+2}" rx="4.4" ry="5.4" fill="#7C2E4F"/>`;
      extra = glyph(186,122,'?',24,'#C792FF')+sparkle(58,128,4,.8);
      break;
    case 'ansiosa':
      eyes = eyeOpen(EL,EY,12,15)+eyeOpen(ER,EY,12,15);
      brows = browWorryL(EL,EY-24)+browWorryR(ER,EY-24);
      mouth = zigzagMouth(MX,MY);
      extra = tear(76,EY+12,5)+tear(180,124,5);
      break;
    case 'abrumada':
      eyes = spiralEye(EL,EY)+spiralEye(ER,EY);
      brows = browWorryL(EL,EY-24)+browWorryR(ER,EY-24);
      mouth = wiggleMouth(MX,MY);
      extra = tear(76,EY+12,5)+tear(180,124,5)+glyph(186,150,'×',16,'#B7A8DA');
      break;
    case 'enferma':
      eyes = eyeHalf(EL,EY)+eyeHalf(ER,EY);
      brows = browWorryL(EL,EY-25)+browWorryR(ER,EY-25);
      mouth = wiggleMouth(MX,MY);
      extra = tear(180,124,5)+coldVapor(150,210);
      break;
    case 'hambre':
      eyes = eyeOpen(EL,EY,15,19)+eyeOpen(ER,EY,15,19);
      brows = browArc(EL,EY-28,3)+browArc(ER,EY-28,3);
      mouth = openSmile(MX,MY,7,6)+drool(MX+9,MY+9);
      extra = sparkle(58,150,4,.85)+sparkle(186,140,5,.8);
      break;
    case 'friolenta':
      eyes = eyeOpen(EL,EY,12,15)+eyeOpen(ER,EY,12,15);
      brows = browWorryL(EL,EY-24)+browWorryR(ER,EY-24);
      mouth = zigzagMouth(MX,MY);
      extra = coldVapor(148,210)+shiverMark(56,184,-1)+shiverMark(184,184,1);
      break;
    case 'frustrada':
      eyes = eyeOpen(EL,EY,13,15)+eyeOpen(ER,EY,13,15);
      brows = browLine(EL,EY-22,13)+browLine(ER,EY-22,-13);
      mouth = grittedMouth(MX,MY);
      extra = steamPuff(58,118,-1)+steamPuff(182,118,1);
      break;
    default:
      eyes = eyeOpen(EL,EY)+eyeOpen(ER,EY);
  }
  // cheek tint varies by mood
  const blushR = (expr==='amor') ? 18 : (expr==='timida' ? 19 : (expr==='enojada' ? 15 : 14));
  let blushFill = 'url(#blushGrad)', blushOp = 1;
  if(expr==='enferma'){ blushFill = '#8FC47E'; blushOp = .55; }
  if(expr==='friolenta'){ blushFill = '#9FC6EC'; blushOp = .7; }
  const blush = `<ellipse cx="78" cy="196" rx="${blushR}" ry="${blushR*0.62}" fill="${blushFill}" opacity="${blushOp}"/>
                 <ellipse cx="162" cy="196" rx="${blushR}" ry="${blushR*0.62}" fill="${blushFill}" opacity="${blushOp}"/>`;
  return `${blush}${brows}${eyes}${noseHeart(NX,NY)}${mouth}${extra}`;
}

function browArc(cx, cy, lift){
  return `<path d="M ${cx-9},${cy+2+(-lift)} Q ${cx},${cy-2+(-lift)} ${cx+9},${cy+2+(-lift)}"
    stroke="${PALETTE.outline}" stroke-width="2.6" fill="none" stroke-linecap="round" opacity=".82"/>`;
}
function browLine(cx, cy, slope){
  return `<path d="M ${cx-9},${cy-slope*0.4} L ${cx+9},${cy+slope*0.4}"
    stroke="${PALETTE.outline}" stroke-width="2.8" fill="none" stroke-linecap="round" opacity=".85"/>`;
}
function eyeConfident(cx, cy){
  return `<g>
    <path d="M ${cx-15},${cy-6} Q ${cx},${cy-12} ${cx+15},${cy-6}
             L ${cx+15},${cy+2} Q ${cx},${cy-4} ${cx-15},${cy+2} Z" fill="url(#eyeGrad)"/>
    <ellipse cx="${cx}" cy="${cy+6}" rx="14" ry="11" fill="url(#eyeGrad)"/>
    <circle cx="${cx-5}" cy="${cy+2}" r="4.4" fill="#fff"/>
  </g>`;
}
function openSmile(cx, cy, rx, ry){
  return `<g>
    <path d="M ${cx-rx},${cy-2} Q ${cx},${cy-6} ${cx+rx},${cy-2}
             Q ${cx+rx},${cy+ry} ${cx},${cy+ry} Q ${cx-rx},${cy+ry} ${cx-rx},${cy-2} Z"
          fill="#7C2E4F"/>
    <path d="M ${cx-rx*0.7},${cy+ry*0.4} Q ${cx},${cy+ry+2} ${cx+rx*0.7},${cy+ry*0.4} Z"
          fill="#FF7DA6"/>
  </g>`;
}
function zzz(x, y){
  return `<g fill="none" stroke="#B98FE0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".85">
    <path d="M ${x},${y} h9 l-9,11 h9" transform="scale(.7)" />
    <path d="M ${x+22},${y-16} h7 l-7,9 h7"/>
    <path d="M ${x+34},${y-30} h5 l-5,7 h5"/>
  </g>`;
}
function angerMark(x, y){
  return `<g stroke="#E0568A" stroke-width="3" stroke-linecap="round" opacity=".9">
    <path d="M ${x},${y} l8,-6 M ${x},${y} l10,1 M ${x+2},${y+6} l8,3" fill="none"/>
  </g>`;
}
function floatHeart(x, y, s){
  return `<path d="M ${x},${y+s*0.7} C ${x-s*0.7},${y} ${x-s},${y-s*0.4} ${x-s*0.5},${y-s*0.8}
    C ${x-s*0.18},${y-s*1.05} ${x},${y-s*0.7} ${x},${y-s*0.45}
    C ${x},${y-s*0.7} ${x+s*0.18},${y-s*1.05} ${x+s*0.5},${y-s*0.8}
    C ${x+s},${y-s*0.4} ${x+s*0.7},${y} ${x},${y+s*0.7} Z"
    fill="url(#gemGrad)" opacity=".92"/>`;
}

/* ---- new emotion parts ---- */
function eyeSad(cx, cy){ // big watery eye, drooped upper lid, looking down
  return `<g>
    <ellipse cx="${cx}" cy="${cy+2}" rx="14" ry="16.5" fill="url(#eyeGrad)"/>
    <ellipse cx="${cx}" cy="${cy+2}" rx="14" ry="16.5" fill="none" stroke="#120824" stroke-width="1.2" opacity=".5"/>
    <circle cx="${cx-4}" cy="${cy+5}" r="6" fill="#fff"/>
    <circle cx="${cx+5}" cy="${cy-3}" r="3" fill="#fff" opacity=".85"/>
    <ellipse cx="${cx-1}" cy="${cy+11}" rx="3.4" ry="2.4" fill="#CFE9FF" opacity=".7"/>
    <path d="M ${cx-15},${cy-9} Q ${cx},${cy-3} ${cx+15},${cy-9}"
          stroke="${PALETTE.outline}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
  </g>`;
}
function eyeCry(cx, cy){ // squeezed shut (upward arc)
  return `<g>
    <path d="M ${cx-13},${cy+5} Q ${cx},${cy-8} ${cx+13},${cy+5}"
          stroke="${PALETTE.outline}" stroke-width="3.6" fill="none" stroke-linecap="round"/>
    <path d="M ${cx-13},${cy+5} q -3,-2 -5,-1" stroke="${PALETTE.outline}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M ${cx+13},${cy+5} q 3,-2 5,-1"  stroke="${PALETTE.outline}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  </g>`;
}
function eyeContent(cx, cy){ // serene, gentle upward arc
  return `<path d="M ${cx-12},${cy} Q ${cx},${cy-8} ${cx+12},${cy}"
          stroke="${PALETTE.outline}" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
}
function browWorryL(cx, cy){ // left brow, inner (right) end raised
  return `<path d="M ${cx-9},${cy+3} Q ${cx-1},${cy-3} ${cx+9},${cy-5}"
    stroke="${PALETTE.outline}" stroke-width="2.7" fill="none" stroke-linecap="round" opacity=".85"/>`;
}
function browWorryR(cx, cy){ // right brow, inner (left) end raised
  return `<path d="M ${cx-9},${cy-5} Q ${cx+1},${cy-3} ${cx+9},${cy+3}"
    stroke="${PALETTE.outline}" stroke-width="2.7" fill="none" stroke-linecap="round" opacity=".85"/>`;
}
function frownMouth(cx, cy){
  return `<path d="M ${cx-9},${cy+4} Q ${cx},${cy-3} ${cx+9},${cy+4}"
    stroke="${PALETTE.outline}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
}
function wiggleMouth(cx, cy){
  return `<path d="M ${cx-9},${cy+1} q 2.5,-4.5 5,0 q 2.5,4.5 5,0"
    stroke="${PALETTE.outline}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
}
function ohMouth(cx, cy){
  return `<g><ellipse cx="${cx}" cy="${cy+3}" rx="6.5" ry="9" fill="#7C2E4F"/>
    <ellipse cx="${cx}" cy="${cy+7}" rx="4" ry="4" fill="#FF7DA6"/></g>`;
}
function wailMouth(cx, cy){
  return `<g><path d="M ${cx-10},${cy} Q ${cx},${cy-4} ${cx+10},${cy}
    Q ${cx+8},${cy+15} ${cx},${cy+16} Q ${cx-8},${cy+15} ${cx-10},${cy} Z" fill="#7C2E4F"/>
    <path d="M ${cx-6},${cy+11} Q ${cx},${cy+18} ${cx+6},${cy+11} Z" fill="#FF7DA6"/></g>`;
}
function tear(x, y, s){
  s = s || 6;
  return `<g><path d="M ${x},${y} C ${x-s*0.75},${y+s} ${x-s*0.75},${y+s*1.8} ${x},${y+s*1.8}
    C ${x+s*0.75},${y+s*1.8} ${x+s*0.75},${y+s} ${x},${y} Z"
    fill="url(#tearGrad)" stroke="#7FB8E6" stroke-width=".7" stroke-opacity=".55"/>
    <ellipse cx="${x-s*0.2}" cy="${y+s}" rx="${s*0.22}" ry="${s*0.34}" fill="#fff" opacity=".85"/></g>`;
}
function tearStream(x, y, len){
  len = len || 26; const s = 5;
  return `<g><path d="M ${x},${y} C ${x-s},${y+len*0.5} ${x-s},${y+len} ${x},${y+len}
    C ${x+s},${y+len} ${x+s},${y+len*0.5} ${x},${y} Z"
    fill="url(#tearGrad)" stroke="#7FB8E6" stroke-width=".7" stroke-opacity=".5"/>
    <ellipse cx="${x-1.4}" cy="${y+len*0.5}" rx="1.3" ry="3" fill="#fff" opacity=".75"/></g>`;
}
/* shy eye — pupil low, soft upper lid */
function eyeShy(cx, cy){
  return `<g>
    <ellipse cx="${cx}" cy="${cy+5}" rx="11" ry="12.5" fill="url(#eyeGrad)"/>
    <circle cx="${cx-3}" cy="${cy+8}" r="4.4" fill="#fff"/>
    <circle cx="${cx+4}" cy="${cy+2}" r="2" fill="#fff" opacity=".8"/>
    <path d="M ${cx-13},${cy-3} Q ${cx},${cy+2} ${cx+13},${cy-3}"
          stroke="${PALETTE.outline}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
  </g>`;
}
/* dizzy swirl eye */
function spiralEye(cx, cy){
  return `<path d="M ${cx},${cy} a2.2,2.2 0 1 1 -2.2,2.2 a4.6,4.6 0 1 0 4.6,-4.6 a7,7 0 1 1 -7,7 a9.4,9.4 0 1 0 9.4,-9.4"
    fill="none" stroke="${PALETTE.outline}" stroke-width="2.6" stroke-linecap="round"/>`;
}
function zigzagMouth(cx, cy){
  return `<path d="M ${cx-10},${cy} l3.3,-4 l3.3,4 l3.3,-4 l3.3,4"
    stroke="${PALETTE.outline}" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}
function flatMouth(cx, cy){
  return `<path d="M ${cx-9},${cy+1} L ${cx+8},${cy}" stroke="${PALETTE.outline}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
}
function grittedMouth(cx, cy){
  return `<g>
    <path d="M ${cx-12},${cy-4} Q ${cx},${cy-7} ${cx+12},${cy-4} L ${cx+12},${cy+4} Q ${cx},${cy+7} ${cx-12},${cy+4} Z"
          fill="#fff" stroke="${PALETTE.outline}" stroke-width="2.2"/>
    <path d="M ${cx},${cy-6} L ${cx},${cy+6} M ${cx-6},${cy-5.5} L ${cx-6},${cy+5.5} M ${cx+6},${cy-5.5} L ${cx+6},${cy+5.5}"
          stroke="${PALETTE.outline}" stroke-width="1.5"/>
  </g>`;
}
function steamPuff(x, y, dir){
  return `<g fill="#D9CCEF" opacity=".8">
    <circle cx="${x}" cy="${y}" r="5"/><circle cx="${x+dir*7}" cy="${y-7}" r="4"/><circle cx="${x+dir*12}" cy="${y-15}" r="3"/>
  </g>`;
}
function coldVapor(x, y){
  return `<g fill="#CFE9FF" opacity=".7"><ellipse cx="${x}" cy="${y}" rx="7" ry="5"/>
    <ellipse cx="${x+9}" cy="${y-4}" rx="5" ry="3.6"/><ellipse cx="${x+16}" cy="${y-9}" rx="3.4" ry="2.6"/></g>`;
}
function shiverMark(x, y, dir){
  return `<path d="M ${x},${y} q ${dir*3.5},-3 0,-6 q ${-dir*3.5},-3 0,-6"
    stroke="#9FC6EC" stroke-width="2" fill="none" stroke-linecap="round" opacity=".85"/>`;
}
function drool(x, y){
  return `<path d="M ${x},${y} q -2.6,5.5 0,10 q 2.6,-4.5 0,-10 Z" fill="#FF9DC0" opacity=".88"/>`;
}
function glyph(x, y, ch, size, col){
  return `<text x="${x}" y="${y}" font-family="Fredoka, sans-serif" font-size="${size}" font-weight="700" fill="${col}" text-anchor="middle">${ch}</text>`;
}

/* ---------- assembled figures ---------- */
function bunnyFront(opts){
  opts = opts || {};
  const expr = opts.expr || 'feliz';
  const showCrown = opts.crown;
  const showBody = opts.body !== false;
  const headPath = `M 120,92 C 66,90 32,128 32,172 C 32,216 64,252 120,252
                    C 176,252 208,216 208,172 C 208,128 174,90 120,92 Z`;
  return `
  <g>
    ${showBody ? chibiBody() : ''}
    <!-- ears behind head -->
    <g transform="translate(94,104) rotate(-9)">${ear(false)}</g>
    <g transform="translate(150,104) rotate(34)">${ear(true)}</g>
    <!-- head -->
    <g filter="url(#softShadow)">
      <path d="${headPath}" fill="url(#furGrad)" stroke="${PALETTE.outline}" stroke-width="1.6" stroke-opacity=".5"/>
      <path d="${headPath}" fill="url(#furOcc)"/>
      <path d="M 120,96 C 80,96 52,120 50,150 C 78,128 162,128 190,150 C 188,120 160,96 120,96 Z" fill="url(#gloss)"/>
      <!-- rim light bottom-right -->
      <path d="M 196,150 C 206,168 202,200 182,224" stroke="url(#rimPink)" stroke-width="4.5" fill="none" stroke-linecap="round" opacity=".7" filter="url(#glowSoft)"/>
    </g>
    ${browsAndMouth(expr)}
    ${showCrown ? crown(120, 88, 1.2) : ''}
  </g>`;
}

/* 3/4 view — face turned slightly to viewer's right */
function bunny3q(opts){
  opts = opts || {};
  const showCrown = opts.crown;
  const showBody = opts.body !== false;
  const headPath = `M 124,92 C 70,90 36,128 36,172 C 36,214 70,252 126,252
                    C 182,252 212,214 210,170 C 208,128 178,90 124,92 Z`;
  // features clustered toward the right (near side)
  const nearEye = eyeOpen(150,172,16,20);
  const farEye  = eyeOpen(108,172,12.5,17.5);
  const nose    = noseHeart(140,202);
  const mouth   = `<path d="M 130,216 Q 140,227 150,216" stroke="${PALETTE.outline}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const blush   = `<ellipse cx="100" cy="198" rx="13" ry="8" fill="url(#blushGrad)"/>
                   <ellipse cx="170" cy="198" rx="14" ry="9" fill="url(#blushGrad)"/>`;
  const brows   = browArc(150,146,0)+browArc(108,148,0);
  return `<g>
    ${showBody ? chibiBody() : ''}
    <g transform="translate(106,104) rotate(-22)">${ear(false)}</g>
    <g transform="translate(160,106) rotate(20) scale(.92)">${ear(true)}</g>
    <g filter="url(#softShadow)">
      <path d="${headPath}" fill="url(#furGrad)" stroke="${PALETTE.outline}" stroke-width="1.6" stroke-opacity=".5"/>
      <path d="${headPath}" fill="url(#furOcc)"/>
      <path d="M 124,96 C 84,96 56,120 54,150 C 82,128 168,130 196,152 C 192,120 164,96 124,96 Z" fill="url(#gloss)"/>
      <path d="M 200,150 C 210,170 205,202 184,226" stroke="url(#rimPink)" stroke-width="4.5" fill="none" stroke-linecap="round" opacity=".7" filter="url(#glowSoft)"/>
    </g>
    ${blush}${brows}${farEye}${nearEye}${nose}${mouth}
    ${showCrown ? crown(132, 90, 1.18) : ''}
  </g>`;
}

/* profile — facing left */
function bunnyProfile(opts){
  opts = opts || {};
  const showCrown = opts.crown;
  const showBody = opts.body !== false;
  return `<g>
    ${showBody ? `<g filter="url(#softShadow)">
      <ellipse cx="170" cy="272" rx="22" ry="20" fill="url(#furGrad)" stroke="${PALETTE.outline}" stroke-width="1.3" stroke-opacity=".4"/>
      <ellipse cx="134" cy="278" rx="46" ry="32" fill="url(#furGrad)" stroke="${PALETTE.outline}" stroke-width="1.4" stroke-opacity=".45"/>
      <ellipse cx="134" cy="278" rx="46" ry="32" fill="url(#furOcc)"/>
      <ellipse cx="122" cy="264" rx="22" ry="12" fill="url(#gloss)"/>
      <ellipse cx="110" cy="302" rx="19" ry="11" fill="url(#furGrad)" stroke="${PALETTE.outline}" stroke-width="1.2" stroke-opacity=".4"/>
      <ellipse cx="106" cy="304" rx="8" ry="5" fill="url(#earGrad)" opacity=".85"/>
    </g>` : ''}
    <g transform="translate(150,104) rotate(8)">${ear(false)}</g>
    <g transform="translate(168,108) rotate(46) scale(.9)">${ear(true)}</g>
    <g filter="url(#softShadow)">
      <!-- head facing left, gentle muzzle bump -->
      <path d="M 150,96 C 100,94 64,124 58,160
               C 56,176 49,182 47,191
               C 46,198 52,202 60,199
               C 68,208 82,215 106,217
               C 152,221 196,200 198,159
               C 200,123 188,98 150,96 Z"
            fill="url(#furGrad)" stroke="${PALETTE.outline}" stroke-width="1.6" stroke-opacity=".5"/>
      <path d="M 150,96 C 100,94 64,124 58,160 C 56,176 49,182 47,191 C 46,198 52,202 60,199 C 68,208 82,215 106,217 C 152,221 196,200 198,159 C 200,123 188,98 150,96 Z" fill="url(#furOcc)"/>
      <path d="M 150,100 C 108,100 80,122 74,150 C 100,130 156,124 184,142 C 180,118 172,100 150,100 Z" fill="url(#gloss)"/>
      <path d="M 192,134 C 202,158 198,196 178,222" stroke="url(#rimPink)" stroke-width="4.5" fill="none" stroke-linecap="round" opacity=".6" filter="url(#glowSoft)"/>
    </g>
    <ellipse cx="100" cy="196" rx="13" ry="8" fill="url(#blushGrad)"/>
    ${browArc(116,150,0)}
    ${eyeOpen(116,170,14,18)}
    ${noseHeart(52,186)}
    <path d="M 56,194 Q 66,200 76,195" stroke="${PALETTE.outline}" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    ${showCrown ? crown(150, 94, 1.1) : ''}
  </g>`;
}

function svgWrap(viewBox, inner, cls){
  return `<svg class="${cls||''}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}

export const CONEJITA = { PALETTE, defsMarkup, bunnyFront, bunny3q, bunnyProfile, crown, sparkle, svgWrap, ear, chibiBody };
