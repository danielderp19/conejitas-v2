import React from 'react';

/**
 * Conejita — icon set (puffy 3D sticker style, 64×64).
 * One mascot, identical across the set. Brand: #9333EA → #DB2777 on #0D0A1A.
 *
 * Usage:
 *   import { MascotBunnyIcon, CheckDoneIcon } from '@/components/icons';
 *   <MascotBunnyIcon size={48} />
 *
 * A few icons loop subtly (loading spins, sparkle twinkles, celebration bounces,
 * bell-on rings, priority-high glows, mascot-bunny bobs). The keyframes are
 * injected once on first render and honour prefers-reduced-motion.
 */

export type IconName = 'mascot-bunny' | 'empty-state' | 'complete-celebration' | 'loading' | 'check-done' | 'close' | 'expand' | 'refresh' | 'sparkle' | 'work' | 'study' | 'health' | 'check-empty' | 'delete' | 'reset' | 'drag' | 'save-cloud' | 'menu' | 'send' | 'bell-on' | 'bell-off' | 'calendar-add' | 'tab-dashboard' | 'tab-chat' | 'tab-vision' | 'priority-high' | 'priority-medium' | 'priority-low' | 'fitness' | 'personal' | 'shopping' | 'finance' | 'travel' | 'creative' | 'home';

export interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** rendered px size (square). Default 64. */
  size?: number;
}

/** Looping animation keyframes (inert unless this stylesheet is present). */
export const ICON_ANIM_CSS = `
.cnj-spin{transform-box:fill-box;transform-origin:center;animation:cnjSpin 1.1s linear infinite;}
.cnj-twinkle{transform-box:fill-box;transform-origin:center;animation:cnjTwinkle 2.6s ease-in-out infinite;}
.cnj-bob{transform-box:fill-box;transform-origin:center;animation:cnjBob 3s ease-in-out infinite;}
.cnj-bounce{transform-box:fill-box;transform-origin:bottom;animation:cnjBounce 1.9s ease-in-out infinite;}
.cnj-ring{transform-box:fill-box;transform-origin:top center;animation:cnjRing 2.4s ease-in-out infinite;}
.cnj-pulse{transform-box:fill-box;transform-origin:center;animation:cnjPulse 1.9s ease-in-out infinite;}
.cnj-confetti{transform-box:fill-box;transform-origin:center;animation:cnjConfetti 1.9s ease-in-out infinite;}
@keyframes cnjSpin{to{transform:rotate(360deg);}}
@keyframes cnjTwinkle{0%,100%{transform:scale(1) rotate(0deg);opacity:1;}50%{transform:scale(1.13) rotate(16deg);opacity:.82;}}
@keyframes cnjBob{0%,100%{transform:translateY(0);}50%{transform:translateY(-2.4px);}}
@keyframes cnjBounce{0%,100%{transform:translateY(0) scaleY(1);}28%{transform:translateY(-3.2px);}50%{transform:translateY(0) scaleY(.96);}}
@keyframes cnjRing{0%,100%{transform:rotate(0deg);}18%{transform:rotate(12deg);}38%{transform:rotate(-10deg);}58%{transform:rotate(6deg);}78%{transform:rotate(-3deg);}}
@keyframes cnjPulse{0%,100%{transform:scale(1);opacity:.45;}50%{transform:scale(1.2);opacity:.82;}}
@keyframes cnjConfetti{0%{transform:translateY(2px);opacity:.55;}50%{transform:translateY(-2.4px);opacity:1;}100%{transform:translateY(2px);opacity:.55;}}
@media (prefers-reduced-motion: reduce){
  .cnj-spin,.cnj-twinkle,.cnj-bob,.cnj-bounce,.cnj-ring,.cnj-pulse,.cnj-confetti{animation:none!important;}
}
`;

let __cnjInjected = false;
function ensureAnimStyles() {
  if (__cnjInjected || typeof document === 'undefined') return;
  __cnjInjected = true;
  const s = document.createElement('style');
  s.setAttribute('data-conejita-icons', '');
  s.textContent = ICON_ANIM_CSS;
  document.head.appendChild(s);
}

const RAW: Record<IconName, string> = {
  'mascot-bunny': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="mascot-bunny"><defs>
    <radialGradient id="fur_mascotbunny" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_mascotbunny" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_mascotbunny" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_mascotbunny" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_mascotbunny" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_mascotbunny" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_mascotbunny" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_mascotbunny" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_mascotbunny" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_mascotbunny" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_mascotbunny" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_mascotbunny" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_mascotbunny" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_mascotbunny" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_mascotbunny" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_mascotbunny" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><g class="cnj-bob"><g transform="translate(25.5,23) rotate(-8)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_mascotbunny)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_mascotbunny)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g>
          <g transform="translate(38.5,23) rotate(30)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_mascotbunny)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_mascotbunny)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g><g filter="url(#sh_mascotbunny)">
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#fur_mascotbunny)" stroke="#3D2257" stroke-width=".8" stroke-opacity=".5"/>
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#occ_mascotbunny)"/>
    <path d="M32,21 C23.5,21 17.5,26 16.5,32 C23.5,27 40.5,27 47.5,32 C46.5,26 40.5,21 32,21 Z" fill="url(#gloss_mascotbunny)"/>
    <path d="M48,32 C51,38 49.5,46 44,50.5" stroke="#FF93C6" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".55"/>
  </g><ellipse cx="22.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_mascotbunny)"/><ellipse cx="41.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_mascotbunny)"/><ellipse cx="26" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_mascotbunny)"/><circle cx="24.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="27.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><ellipse cx="38" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_mascotbunny)"/><circle cx="36.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="39.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><path d="M undefined,43.9 C NaN,42.1 NaN,41.5 NaN,39.9 C NaN,38.1 NaN,37.8 undefined,39.8 C NaN,37.8 NaN,38.1 NaN,39.9 C NaN,41.5 NaN,42.1 undefined,43.9 Z" fill="url(#nose_mascotbunny)"/><path d="M 29.4,45 Q 32,47.4 34.6,45" stroke="#3D2257" stroke-width="1.4" fill="none" stroke-linecap="round"/><g transform="translate(32,18) scale(0.24)">
    <path d="M -30,12 Q -33,-2 -22,-14 Q -16,-2 -9,-12 Q -2,-26 0,-26 Q 2,-26 9,-12 Q 16,-2 22,-14 Q 33,-2 30,12 Z" fill="url(#gold_mascotbunny)" stroke="#C97E12" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="-22" cy="-15" r="3.6" fill="url(#gem_mascotbunny)"/>
    <circle cx="22" cy="-15" r="3.6" fill="url(#gem_mascotbunny)"/>
    <circle cx="0" cy="-24" r="5" fill="url(#gem_mascotbunny)"/>
    <path d="M -20,-2 Q 0,5 20,-2" stroke="#FFF6D8" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>
  </g></g><path d="M 52,13.6 Q 52.528,15.472 54.4,16 Q 52.528,16.528 52,18.4 Q 51.472,16.528 49.6,16 Q 51.472,15.472 52,13.6 Z" fill="url(#spark_mascotbunny)" opacity="0.9"/><path d="M 12,20.2 Q 12.396,21.604 13.8,22 Q 12.396,22.396 12,23.8 Q 11.604,22.396 10.2,22 Q 11.604,21.604 12,20.2 Z" fill="url(#spark_mascotbunny)" opacity="0.8"/></svg>`,
  'empty-state': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="empty-state"><defs>
    <radialGradient id="fur_emptystate" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_emptystate" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_emptystate" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_emptystate" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_emptystate" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_emptystate" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_emptystate" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_emptystate" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_emptystate" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_emptystate" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_emptystate" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_emptystate" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_emptystate" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_emptystate" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_emptystate" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_emptystate" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><g transform="translate(25.5,23) rotate(-8)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_emptystate)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_emptystate)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g>
          <g transform="translate(38.5,23) rotate(30)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_emptystate)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_emptystate)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g><g filter="url(#sh_emptystate)">
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#fur_emptystate)" stroke="#3D2257" stroke-width=".8" stroke-opacity=".5"/>
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#occ_emptystate)"/>
    <path d="M32,21 C23.5,21 17.5,26 16.5,32 C23.5,27 40.5,27 47.5,32 C46.5,26 40.5,21 32,21 Z" fill="url(#gloss_emptystate)"/>
    <path d="M48,32 C51,38 49.5,46 44,50.5" stroke="#FF93C6" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".55"/>
  </g><ellipse cx="22.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_emptystate)"/><ellipse cx="41.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_emptystate)"/><path d="M 22.6,35 Q 26,38.5 29.4,35" stroke="#3D2257" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M 34.6,35 Q 38,38.5 41.4,35" stroke="#3D2257" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M undefined,43.9 C NaN,42.1 NaN,41.5 NaN,39.9 C NaN,38.1 NaN,37.8 undefined,39.8 C NaN,37.8 NaN,38.1 NaN,39.9 C NaN,41.5 NaN,42.1 undefined,43.9 Z" fill="url(#nose_emptystate)"/><ellipse cx="32" cy="45.6" rx="1.3" ry="1.6" fill="#7a2e4d" opacity=".8"/><g fill="none" stroke="#B98FE0" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity=".85">
          <path d="M44,18 h3.4 l-3.4,4 h3.4"/><path d="M50,12 h2.6 l-2.6,3 h2.6"/></g></svg>`,
  'complete-celebration': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="complete-celebration"><defs>
    <radialGradient id="fur_completecelebration" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_completecelebration" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_completecelebration" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_completecelebration" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_completecelebration" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_completecelebration" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_completecelebration" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_completecelebration" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_completecelebration" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_completecelebration" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_completecelebration" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_completecelebration" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_completecelebration" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_completecelebration" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_completecelebration" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_completecelebration" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><g class="cnj-bounce">
    <g filter="url(#sh_completecelebration)">
      <ellipse cx="14" cy="30" rx="3.6" ry="5" fill="url(#fur_completecelebration)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".4" transform="rotate(38 14 30)"/>
      <ellipse cx="50" cy="30" rx="3.6" ry="5" fill="url(#fur_completecelebration)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".4" transform="rotate(-38 50 30)"/>
    </g><g transform="translate(25.5,23) rotate(-22)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_completecelebration)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_completecelebration)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g>
          <g transform="translate(38.5,23) rotate(42)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_completecelebration)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_completecelebration)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g><g filter="url(#sh_completecelebration)">
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#fur_completecelebration)" stroke="#3D2257" stroke-width=".8" stroke-opacity=".5"/>
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#occ_completecelebration)"/>
    <path d="M32,21 C23.5,21 17.5,26 16.5,32 C23.5,27 40.5,27 47.5,32 C46.5,26 40.5,21 32,21 Z" fill="url(#gloss_completecelebration)"/>
    <path d="M48,32 C51,38 49.5,46 44,50.5" stroke="#FF93C6" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".55"/>
  </g><ellipse cx="22.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_completecelebration)"/><ellipse cx="41.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_completecelebration)"/><ellipse cx="26" cy="35.5" rx="4" ry="5" fill="url(#eye_completecelebration)"/><circle cx="24.64" cy="33.7" r="1.68" fill="#fff"/><circle cx="27.44" cy="37" r="0.8" fill="#fff" opacity=".8"/><ellipse cx="38" cy="35.5" rx="4" ry="5" fill="url(#eye_completecelebration)"/><circle cx="36.64" cy="33.7" r="1.68" fill="#fff"/><circle cx="39.44" cy="37" r="0.8" fill="#fff" opacity=".8"/><path d="M undefined,43.9 C NaN,42.1 NaN,41.5 NaN,39.9 C NaN,38.1 NaN,37.8 undefined,39.8 C NaN,37.8 NaN,38.1 NaN,39.9 C NaN,41.5 NaN,42.1 undefined,43.9 Z" fill="url(#nose_completecelebration)"/><path d="M 29.4,44.5 Q 32,46 34.6,44.5 Q 34.6,48.4 32,48.4 Q 29.4,48.4 29.4,44.5 Z" fill="#7C2E4F"/><g transform="translate(32,18) scale(0.24)">
    <path d="M -30,12 Q -33,-2 -22,-14 Q -16,-2 -9,-12 Q -2,-26 0,-26 Q 2,-26 9,-12 Q 16,-2 22,-14 Q 33,-2 30,12 Z" fill="url(#gold_completecelebration)" stroke="#C97E12" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="-22" cy="-15" r="3.6" fill="url(#gem_completecelebration)"/>
    <circle cx="22" cy="-15" r="3.6" fill="url(#gem_completecelebration)"/>
    <circle cx="0" cy="-24" r="5" fill="url(#gem_completecelebration)"/>
    <path d="M -20,-2 Q 0,5 20,-2" stroke="#FFF6D8" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>
  </g></g><g class="cnj-confetti"><rect x="10.4" y="12.4" width="3.2" height="3.2" rx=".8" fill="#FFD05C" transform="rotate(18 12 14)"/><rect x="50.4" y="14.4" width="3.2" height="3.2" rx=".8" fill="#FF6FA5" transform="rotate(-22 52 16)"/><rect x="6.4" y="28.4" width="3.2" height="3.2" rx=".8" fill="#A24BF0" transform="rotate(12 8 30)"/><rect x="54.4" y="30.4" width="3.2" height="3.2" rx=".8" fill="#FF93C6" transform="rotate(30 56 32)"/><rect x="16.4" y="6.4" width="3.2" height="3.2" rx=".8" fill="#E0468C" transform="rotate(-15 18 8)"/><rect x="44.4" y="7.4" width="3.2" height="3.2" rx=".8" fill="#FFD05C" transform="rotate(24 46 9)"/><circle cx="10" cy="44" r="1.6" fill="#FF6FA5"/><circle cx="54" cy="44" r="1.6" fill="#FFD05C"/></g></svg>`,
  'loading': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="loading"><defs>
    <radialGradient id="fur_loading" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_loading" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_loading" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_loading" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_loading" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_loading" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_loading" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_loading" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_loading" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_loading" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_loading" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_loading" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_loading" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_loading" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_loading" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_loading" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><g transform="translate(32,33) scale(.62) translate(-32,-33)"><g transform="translate(25.5,23) rotate(-8)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_loading)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_loading)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g>
          <g transform="translate(38.5,23) rotate(30)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_loading)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_loading)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g><g filter="url(#sh_loading)">
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#fur_loading)" stroke="#3D2257" stroke-width=".8" stroke-opacity=".5"/>
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#occ_loading)"/>
    <path d="M32,21 C23.5,21 17.5,26 16.5,32 C23.5,27 40.5,27 47.5,32 C46.5,26 40.5,21 32,21 Z" fill="url(#gloss_loading)"/>
    <path d="M48,32 C51,38 49.5,46 44,50.5" stroke="#FF93C6" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".55"/>
  </g><ellipse cx="22.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_loading)"/><ellipse cx="41.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_loading)"/><path d="M 22.6,35 Q 26,38.5 29.4,35" stroke="#3D2257" stroke-width="1.5" fill="none" stroke-linecap="round"/><ellipse cx="38" cy="35.5" rx="4" ry="5" fill="url(#eye_loading)"/><circle cx="36.64" cy="33.7" r="1.68" fill="#fff"/><circle cx="39.44" cy="37" r="0.8" fill="#fff" opacity=".8"/><path d="M undefined,43.9 C NaN,42.1 NaN,41.5 NaN,39.9 C NaN,38.1 NaN,37.8 undefined,39.8 C NaN,37.8 NaN,38.1 NaN,39.9 C NaN,41.5 NaN,42.1 undefined,43.9 Z" fill="url(#nose_loading)"/><path d="M 29.4,45 Q 32,47.4 34.6,45" stroke="#3D2257" stroke-width="1.4" fill="none" stroke-linecap="round"/></g><g class="cnj-spin"><circle cx="32" cy="33" r="25" fill="none" stroke="url(#acc_loading)" stroke-width="4.6" stroke-linecap="round" stroke-dasharray="100 57" transform="rotate(-90 32 33)"/></g><path d="M 32,3.4 Q 32.572,5.428 34.6,6 Q 32.572,6.572 32,8.6 Q 31.428,6.572 29.4,6 Q 31.428,5.428 32,3.4 Z" fill="url(#spark_loading)" opacity="0.95"/></svg>`,
  'check-done': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="check-done"><defs>
    <radialGradient id="fur_checkdone" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_checkdone" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_checkdone" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_checkdone" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_checkdone" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_checkdone" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_checkdone" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_checkdone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_checkdone" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_checkdone" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_checkdone" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_checkdone" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_checkdone" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_checkdone" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_checkdone" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_checkdone" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><circle cx="32" cy="33" r="20" fill="url(#acc_checkdone)" stroke="#7a2ba8" stroke-width="1" stroke-opacity=".4" filter="url(#sh_checkdone)"/>
  <ellipse cx="32" cy="22" rx="13" ry="7" fill="url(#accHi_checkdone)"/><path d="M23,33.5 L29.5,40 L42,26.5" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M 46,15.6 Q 46.528,17.472 48.4,18 Q 46.528,18.528 46,20.4 Q 45.472,18.528 43.6,18 Q 45.472,17.472 46,15.6 Z" fill="url(#spark_checkdone)" opacity="0.95"/></svg>`,
  'close': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="close"><defs>
    <radialGradient id="fur_close" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_close" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_close" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_close" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_close" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_close" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_close" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_close" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_close" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_close" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_close" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_close" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_close" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_close" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_close" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_close" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><path d="M22,23 L42,43 M42,23 L22,43" stroke="url(#acc_close)" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#sh_close)"/>
  <path d="M22,23 L42,43 M42,23 L22,43" stroke="url(#accHi_close)" stroke-width="2.04" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(0,-1.1)"/><path d="M 47,14 Q 47.44,15.56 49,16 Q 47.44,16.44 47,18 Q 46.56,16.44 45,16 Q 46.56,15.56 47,14 Z" fill="url(#spark_close)" opacity="0.9"/></svg>`,
  'expand': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="expand"><defs>
    <radialGradient id="fur_expand" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_expand" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_expand" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_expand" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_expand" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_expand" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_expand" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_expand" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_expand" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_expand" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_expand" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_expand" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_expand" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_expand" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_expand" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_expand" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><path d="M25,25 L17,17 M17,17 L17,25 M17,17 L25,17" stroke="url(#acc_expand)" stroke-width="4.4" fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#sh_expand)"/>
  <path d="M25,25 L17,17 M17,17 L17,25 M17,17 L25,17" stroke="url(#accHi_expand)" stroke-width="1.4960000000000002" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(0,-1.1)"/><path d="M39,39 L47,47 M47,47 L47,39 M47,47 L39,47" stroke="url(#acc_expand)" stroke-width="4.4" fill="none" stroke-linecap="round" stroke-linejoin="round" filter="url(#sh_expand)"/>
  <path d="M39,39 L47,47 M47,47 L47,39 M47,47 L39,47" stroke="url(#accHi_expand)" stroke-width="1.4960000000000002" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(0,-1.1)"/></svg>`,
  'refresh': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="refresh"><defs>
    <radialGradient id="fur_refresh" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_refresh" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_refresh" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_refresh" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_refresh" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_refresh" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_refresh" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_refresh" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_refresh" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_refresh" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_refresh" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_refresh" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_refresh" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_refresh" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_refresh" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_refresh" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><path d="M46,33 A14,14 0 1 1 41.5,22.6" fill="none" stroke="url(#acc_refresh)" stroke-width="5.4" stroke-linecap="round" filter="url(#sh_refresh)"/>
      <path d="M46,33 A14,14 0 1 1 41.5,22.6" fill="none" stroke="url(#accHi_refresh)" stroke-width="1.8" stroke-linecap="round" transform="translate(0,-1)"/>
      <path d="M40,15 L43,23.5 L33.5,23.5 Z" fill="url(#acc_refresh)" filter="url(#sh_refresh)"/><path d="M 17,42 Q 17.44,43.56 19,44 Q 17.44,44.44 17,46 Q 16.56,44.44 15,44 Q 16.56,43.56 17,42 Z" fill="url(#spark_refresh)" opacity="0.85"/></svg>`,
  'sparkle': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="sparkle"><defs>
    <radialGradient id="fur_sparkle" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_sparkle" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_sparkle" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_sparkle" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_sparkle" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_sparkle" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_sparkle" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_sparkle" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_sparkle" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_sparkle" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_sparkle" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_sparkle" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_sparkle" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_sparkle" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_sparkle" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_sparkle" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><g class="cnj-twinkle"><path d="M32,9 C34,22 36,24 49,26 C36,28 34,30 32,43 C30,30 28,28 15,26 C28,24 30,22 32,9 Z" fill="url(#acc_sparkle)" stroke="#7a2ba8" stroke-width=".8" stroke-opacity=".4" filter="url(#sh_sparkle)"/>
      <path d="M32,14 C33.4,22.6 34.6,24 42,25.6 C34.6,27.2 33.4,28.6 32,36" stroke="url(#accHi_sparkle)" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M49,42 C50,47 50.6,47.6 55,48.6 C50.6,49.6 50,50.2 49,55 C48,50.2 47.4,49.6 43,48.6 C47.4,47.6 48,47 49,42 Z" fill="url(#gem_sparkle)"/></g></svg>`,
  'work': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="work"><defs>
    <radialGradient id="fur_work" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_work" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_work" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_work" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_work" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_work" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_work" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_work" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_work" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_work" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_work" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_work" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_work" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_work" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_work" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_work" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><g transform="translate(25.5,23) rotate(-8)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_work)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_work)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g>
          <g transform="translate(38.5,23) rotate(30)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_work)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_work)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g><g filter="url(#sh_work)">
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#fur_work)" stroke="#3D2257" stroke-width=".8" stroke-opacity=".5"/>
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#occ_work)"/>
    <path d="M32,21 C23.5,21 17.5,26 16.5,32 C23.5,27 40.5,27 47.5,32 C46.5,26 40.5,21 32,21 Z" fill="url(#gloss_work)"/>
    <path d="M48,32 C51,38 49.5,46 44,50.5" stroke="#FF93C6" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".55"/>
  </g><ellipse cx="22.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_work)"/><ellipse cx="41.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_work)"/><ellipse cx="26" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_work)"/><circle cx="24.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="27.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><ellipse cx="38" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_work)"/><circle cx="36.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="39.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><path d="M undefined,43.9 C NaN,42.1 NaN,41.5 NaN,39.9 C NaN,38.1 NaN,37.8 undefined,39.8 C NaN,37.8 NaN,38.1 NaN,39.9 C NaN,41.5 NaN,42.1 undefined,43.9 Z" fill="url(#nose_work)"/><path d="M 29.4,45 Q 32,47.4 34.6,45" stroke="#3D2257" stroke-width="1.4" fill="none" stroke-linecap="round"/><g filter="url(#sh_work)" transform="translate(32,53.5)">
  <path d="M0,0 L-8,-4 Q-9.5,-4.6 -9.5,-2 L-9.5,2 Q-9.5,4.6 -8,4 Z" fill="url(#acc_work)"/>
  <path d="M0,0 L8,-4 Q9.5,-4.6 9.5,-2 L9.5,2 Q9.5,4.6 8,4 Z" fill="url(#acc_work)"/>
  <ellipse cx="0" cy="0" rx="2.4" ry="2.8" fill="url(#acc_work)" stroke="#7a2ba8" stroke-width=".5"/>
  <path d="M-7,-2.6 L-2,-1" stroke="#fff" stroke-width="1" opacity=".5" stroke-linecap="round"/>
</g></svg>`,
  'study': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="study"><defs>
    <radialGradient id="fur_study" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_study" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_study" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_study" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_study" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_study" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_study" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_study" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_study" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_study" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_study" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_study" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_study" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_study" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_study" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_study" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><g transform="translate(25.5,23) rotate(-8)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_study)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_study)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g>
          <g transform="translate(38.5,23) rotate(30)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_study)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_study)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g><g filter="url(#sh_study)">
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#fur_study)" stroke="#3D2257" stroke-width=".8" stroke-opacity=".5"/>
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#occ_study)"/>
    <path d="M32,21 C23.5,21 17.5,26 16.5,32 C23.5,27 40.5,27 47.5,32 C46.5,26 40.5,21 32,21 Z" fill="url(#gloss_study)"/>
    <path d="M48,32 C51,38 49.5,46 44,50.5" stroke="#FF93C6" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".55"/>
  </g><ellipse cx="22.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_study)"/><ellipse cx="41.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_study)"/><ellipse cx="26" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_study)"/><circle cx="24.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="27.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><ellipse cx="38" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_study)"/><circle cx="36.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="39.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><path d="M undefined,43.9 C NaN,42.1 NaN,41.5 NaN,39.9 C NaN,38.1 NaN,37.8 undefined,39.8 C NaN,37.8 NaN,38.1 NaN,39.9 C NaN,41.5 NaN,42.1 undefined,43.9 Z" fill="url(#nose_study)"/><path d="M 29.4,45 Q 32,47.4 34.6,45" stroke="#3D2257" stroke-width="1.4" fill="none" stroke-linecap="round"/><g transform="translate(0,0)">
  <circle cx="26" cy="35.5" r="5.4" fill="#fff" fill-opacity=".12" stroke="url(#gold_study)" stroke-width="1.8"/>
  <circle cx="38" cy="35.5" r="5.4" fill="#fff" fill-opacity=".12" stroke="url(#gold_study)" stroke-width="1.8"/>
  <path d="M 31.4,35 Q 32,33 32.6,35" stroke="url(#gold_study)" stroke-width="1.8" fill="none"/>
  <circle cx="24.4" cy="33.7" r="1.3" fill="#fff" opacity=".7"/>
</g><g filter="url(#sh_study)" transform="translate(46,49) rotate(-12)">
  <rect x="-6" y="-4.5" width="12" height="9" rx="1.6" fill="url(#acc_study)"/>
  <rect x="-6" y="-4.5" width="6" height="9" rx="1.6" fill="#C25BE8"/>
  <line x1="0" y1="-4.5" x2="0" y2="4.5" stroke="#fff" stroke-width=".8" opacity=".7"/>
  <line x1="2" y1="-1.5" x2="4.2" y2="-1.5" stroke="#fff" stroke-width=".8" opacity=".6"/>
  <line x1="2" y1="1" x2="4.2" y2="1" stroke="#fff" stroke-width=".8" opacity=".6"/>
</g></svg>`,
  'health': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="health"><defs>
    <radialGradient id="fur_health" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_health" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_health" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_health" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_health" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_health" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_health" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_health" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_health" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_health" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_health" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_health" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_health" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_health" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_health" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_health" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><g transform="translate(25.5,23) rotate(-8)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_health)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_health)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g>
          <g transform="translate(38.5,23) rotate(30)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_health)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_health)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g><g filter="url(#sh_health)">
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#fur_health)" stroke="#3D2257" stroke-width=".8" stroke-opacity=".5"/>
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#occ_health)"/>
    <path d="M32,21 C23.5,21 17.5,26 16.5,32 C23.5,27 40.5,27 47.5,32 C46.5,26 40.5,21 32,21 Z" fill="url(#gloss_health)"/>
    <path d="M48,32 C51,38 49.5,46 44,50.5" stroke="#FF93C6" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".55"/>
  </g><ellipse cx="22.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_health)"/><ellipse cx="41.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_health)"/><ellipse cx="26" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_health)"/><circle cx="24.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="27.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><ellipse cx="38" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_health)"/><circle cx="36.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="39.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><path d="M undefined,43.9 C NaN,42.1 NaN,41.5 NaN,39.9 C NaN,38.1 NaN,37.8 undefined,39.8 C NaN,37.8 NaN,38.1 NaN,39.9 C NaN,41.5 NaN,42.1 undefined,43.9 Z" fill="url(#nose_health)"/><path d="M 29.4,45 Q 32,47.4 34.6,45" stroke="#3D2257" stroke-width="1.4" fill="none" stroke-linecap="round"/><g filter="url(#sh_health)" transform="translate(45,46) scale(1)">
  <path d="M0,5.2 C-3.4,1.6 -7,0 -7,-3.4 C-7,-6.6 -3.2,-7.2 0,-3.6 C3.2,-7.2 7,-6.6 7,-3.4 C7,0 3.4,1.6 0,5.2 Z" fill="url(#gem_health)" stroke="#D8417A" stroke-width=".7"/>
  <circle cx="-2.4" cy="-3" r="1.4" fill="#fff" opacity=".85"/></g></svg>`,
  'check-empty': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="check-empty"><defs>
    <radialGradient id="fur_checkempty" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_checkempty" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_checkempty" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_checkempty" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_checkempty" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_checkempty" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_checkempty" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_checkempty" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_checkempty" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_checkempty" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_checkempty" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_checkempty" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_checkempty" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_checkempty" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_checkempty" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_checkempty" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><circle cx="32" cy="33" r="18.5" fill="none" stroke="url(#acc_checkempty)" stroke-width="4.6" filter="url(#sh_checkempty)"/>
      <circle cx="32" cy="33" r="18.5" fill="none" stroke="url(#accHi_checkempty)" stroke-width="1.5" transform="translate(0,-1)"/>
      <circle cx="25" cy="25" r="2.2" fill="#fff" opacity=".5"/></svg>`,
  'delete': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="delete"><defs>
    <radialGradient id="fur_delete" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_delete" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_delete" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_delete" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_delete" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_delete" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_delete" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_delete" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_delete" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_delete" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_delete" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_delete" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_delete" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_delete" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_delete" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_delete" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><path d="M21,26 L43,26 L41,49 Q40.6,51 38.6,51 L25.4,51 Q23.4,51 23,49 Z" fill="url(#acc_delete)" stroke="#7a2ba8" stroke-width="1" stroke-opacity=".4" filter="url(#sh_delete)"/><path d="M21,26 L43,26 L41,49 Q40.6,51 38.6,51 L25.4,51 Q23.4,51 23,49 Z" fill="url(#gloss_delete)" opacity=".4"/>
        <rect x="17.5" y="20.5" width="29" height="5.6" rx="2.8" fill="url(#acc_delete)" filter="url(#sh_delete)"/>
        <rect x="17.5" y="20.5" width="29" height="2" rx="1" fill="url(#accHi_delete)"/>
        <path d="M27,20 Q27,16.5 30.4,16.5 L33.6,16.5 Q37,16.5 37,20" fill="none" stroke="url(#acc_delete)" stroke-width="3" stroke-linecap="round" filter="url(#sh_delete)"/>
        <g stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".6"><line x1="28" y1="31" x2="28.6" y2="45"/><line x1="32" y1="31" x2="32" y2="45"/><line x1="36" y1="31" x2="35.4" y2="45"/></g></svg>`,
  'reset': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="reset"><defs>
    <radialGradient id="fur_reset" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_reset" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_reset" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_reset" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_reset" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_reset" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_reset" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_reset" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_reset" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_reset" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_reset" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_reset" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_reset" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_reset" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_reset" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_reset" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><path d="M18,33 A14,14 0 1 0 22.5,22.6" fill="none" stroke="url(#acc_reset)" stroke-width="5.4" stroke-linecap="round" filter="url(#sh_reset)"/>
      <path d="M18,33 A14,14 0 1 0 22.5,22.6" fill="none" stroke="url(#accHi_reset)" stroke-width="1.8" stroke-linecap="round" transform="translate(0,-1)"/>
      <path d="M24,15 L21,23.5 L30.5,23.5 Z" fill="url(#acc_reset)" filter="url(#sh_reset)"/>
      <circle cx="32" cy="33" r="2.6" fill="url(#gem_reset)"/></svg>`,
  'drag': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="drag"><defs>
    <radialGradient id="fur_drag" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_drag" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_drag" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_drag" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_drag" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_drag" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_drag" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_drag" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_drag" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_drag" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_drag" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_drag" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_drag" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_drag" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_drag" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_drag" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><circle cx="26" cy="21" r="3.4" fill="url(#acc_drag)" filter="url(#sh_drag)"/><circle cx="25" cy="19.8" r="1.1" fill="#fff" opacity=".6"/><circle cx="38" cy="21" r="3.4" fill="url(#acc_drag)" filter="url(#sh_drag)"/><circle cx="37" cy="19.8" r="1.1" fill="#fff" opacity=".6"/><circle cx="26" cy="33" r="3.4" fill="url(#acc_drag)" filter="url(#sh_drag)"/><circle cx="25" cy="31.8" r="1.1" fill="#fff" opacity=".6"/><circle cx="38" cy="33" r="3.4" fill="url(#acc_drag)" filter="url(#sh_drag)"/><circle cx="37" cy="31.8" r="1.1" fill="#fff" opacity=".6"/><circle cx="26" cy="45" r="3.4" fill="url(#acc_drag)" filter="url(#sh_drag)"/><circle cx="25" cy="43.8" r="1.1" fill="#fff" opacity=".6"/><circle cx="38" cy="45" r="3.4" fill="url(#acc_drag)" filter="url(#sh_drag)"/><circle cx="37" cy="43.8" r="1.1" fill="#fff" opacity=".6"/></svg>`,
  'save-cloud': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="save-cloud"><defs>
    <radialGradient id="fur_savecloud" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_savecloud" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_savecloud" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_savecloud" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_savecloud" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_savecloud" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_savecloud" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_savecloud" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_savecloud" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_savecloud" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_savecloud" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_savecloud" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_savecloud" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_savecloud" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_savecloud" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_savecloud" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><path d="M22,43 Q14,43 14,35.5 Q14,28 22.5,28 Q24.5,19.5 34,20.5 Q43.5,20.5 44.5,29 Q51.5,29.5 51.5,36.5 Q51.5,43 44,43 Z" fill="url(#acc_savecloud)" stroke="#7a2ba8" stroke-width="1" stroke-opacity=".4" filter="url(#sh_savecloud)"/><path d="M22,43 Q14,43 14,35.5 Q14,28 22.5,28 Q24.5,19.5 34,20.5 Q43.5,20.5 44.5,29 Q51.5,29.5 51.5,36.5 Q51.5,43 44,43 Z" fill="url(#gloss_savecloud)" opacity=".4"/>
        <path d="M33,29 L33,39.5 M28.4,35 L33,39.8 L37.6,35" stroke="#fff" stroke-width="2.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  'menu': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="menu"><defs>
    <radialGradient id="fur_menu" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_menu" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_menu" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_menu" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_menu" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_menu" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_menu" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_menu" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_menu" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_menu" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_menu" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_menu" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_menu" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_menu" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_menu" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_menu" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><rect x="18" y="21.3" width="28" height="5.4" rx="2.7" fill="url(#acc_menu)" filter="url(#sh_menu)"/><rect x="18.5" y="21.6" width="27" height="1.8" rx="1" fill="url(#accHi_menu)"/><rect x="18" y="30.3" width="28" height="5.4" rx="2.7" fill="url(#acc_menu)" filter="url(#sh_menu)"/><rect x="18.5" y="30.6" width="27" height="1.8" rx="1" fill="url(#accHi_menu)"/><rect x="18" y="39.3" width="28" height="5.4" rx="2.7" fill="url(#acc_menu)" filter="url(#sh_menu)"/><rect x="18.5" y="39.6" width="27" height="1.8" rx="1" fill="url(#accHi_menu)"/></svg>`,
  'send': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="send"><defs>
    <radialGradient id="fur_send" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_send" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_send" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_send" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_send" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_send" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_send" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_send" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_send" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_send" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_send" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_send" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_send" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_send" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_send" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_send" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><path d="M13,31 L51,14 L36,51 Z" fill="url(#acc_send)" stroke="#7a2ba8" stroke-width="1" stroke-opacity=".4" filter="url(#sh_send)"/>
      <path d="M13,31 L36,51 L33,35 Z" fill="#6e2699" fill-opacity=".55"/>
      <path d="M33,35 L51,14" stroke="#fff" stroke-width="1.4" opacity=".4" stroke-linecap="round"/>
      <path d="M 14,14.4 Q 14.572,16.428 16.6,17 Q 14.572,17.572 14,19.6 Q 13.428,17.572 11.4,17 Q 13.428,16.428 14,14.4 Z" fill="url(#spark_send)" opacity="0.92"/></svg>`,
  'bell-on': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="bell-on"><defs>
    <radialGradient id="fur_bellon" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_bellon" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_bellon" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_bellon" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_bellon" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_bellon" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_bellon" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_bellon" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_bellon" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_bellon" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_bellon" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_bellon" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_bellon" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_bellon" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_bellon" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_bellon" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><g transform="translate(25.5,23) rotate(-8)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_bellon)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_bellon)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g>
          <g transform="translate(38.5,23) rotate(30)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_bellon)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_bellon)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g><g filter="url(#sh_bellon)">
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#fur_bellon)" stroke="#3D2257" stroke-width=".8" stroke-opacity=".5"/>
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#occ_bellon)"/>
    <path d="M32,21 C23.5,21 17.5,26 16.5,32 C23.5,27 40.5,27 47.5,32 C46.5,26 40.5,21 32,21 Z" fill="url(#gloss_bellon)"/>
    <path d="M48,32 C51,38 49.5,46 44,50.5" stroke="#FF93C6" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".55"/>
  </g><ellipse cx="22.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_bellon)"/><ellipse cx="41.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_bellon)"/><ellipse cx="26" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_bellon)"/><circle cx="24.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="27.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><ellipse cx="38" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_bellon)"/><circle cx="36.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="39.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><path d="M undefined,43.9 C NaN,42.1 NaN,41.5 NaN,39.9 C NaN,38.1 NaN,37.8 undefined,39.8 C NaN,37.8 NaN,38.1 NaN,39.9 C NaN,41.5 NaN,42.1 undefined,43.9 Z" fill="url(#nose_bellon)"/><path d="M 29.4,45 Q 32,47.4 34.6,45" stroke="#3D2257" stroke-width="1.4" fill="none" stroke-linecap="round"/><g class="cnj-ring"><g filter="url(#sh_bellon)" transform="translate(46.5,46)">
  <path d="M0,-7.2 Q5.4,-6.6 5.4,0.4 Q5.4,3 7,4.4 L-7,4.4 Q-5.4,3 -5.4,0.4 Q-5.4,-6.6 0,-7.2 Z" fill="url(#gold_bellon)" stroke="#C97E12" stroke-width=".8"/>
  <circle cx="0" cy="6.4" r="1.9" fill="url(#gold_bellon)" stroke="#C97E12" stroke-width=".5"/>
  <path d="M-3,-4 Q-2,-5.6 0.2,-5.6" stroke="#FFF6D8" stroke-width="1" fill="none" stroke-linecap="round" opacity=".7"/></g></g><g fill="none" stroke="#FFD05C" stroke-width="1.7" stroke-linecap="round" opacity=".95"><path d="M55,42 Q58,47 55,52"/><path d="M51,44 Q52.6,47 51,50"/></g><path d="M 53,35 Q 53.44,36.56 55,37 Q 53.44,37.44 53,39 Q 52.56,37.44 51,37 Q 52.56,36.56 53,35 Z" fill="url(#spark_bellon)" opacity="0.85"/></svg>`,
  'bell-off': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="bell-off"><defs>
    <radialGradient id="fur_belloff" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_belloff" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_belloff" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_belloff" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_belloff" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_belloff" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_belloff" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_belloff" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_belloff" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_belloff" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_belloff" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_belloff" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_belloff" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_belloff" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_belloff" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_belloff" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><g transform="translate(25.5,23) rotate(-8)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_belloff)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_belloff)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g>
          <g transform="translate(38.5,23) rotate(48)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_belloff)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_belloff)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g><g filter="url(#sh_belloff)">
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#fur_belloff)" stroke="#3D2257" stroke-width=".8" stroke-opacity=".5"/>
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#occ_belloff)"/>
    <path d="M32,21 C23.5,21 17.5,26 16.5,32 C23.5,27 40.5,27 47.5,32 C46.5,26 40.5,21 32,21 Z" fill="url(#gloss_belloff)"/>
    <path d="M48,32 C51,38 49.5,46 44,50.5" stroke="#FF93C6" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".55"/>
  </g><ellipse cx="22.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_belloff)"/><ellipse cx="41.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_belloff)"/><path d="M 22.6,35 Q 26,38.5 29.4,35" stroke="#3D2257" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M 34.6,35 Q 38,38.5 41.4,35" stroke="#3D2257" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M undefined,43.9 C NaN,42.1 NaN,41.5 NaN,39.9 C NaN,38.1 NaN,37.8 undefined,39.8 C NaN,37.8 NaN,38.1 NaN,39.9 C NaN,41.5 NaN,42.1 undefined,43.9 Z" fill="url(#nose_belloff)"/><ellipse cx="32" cy="45.6" rx="1.3" ry="1.6" fill="#7a2e4d" opacity=".8"/><g filter="url(#sh_belloff)" transform="translate(46.5,46)">
  <path d="M0,-7.2 Q5.4,-6.6 5.4,0.4 Q5.4,3 7,4.4 L-7,4.4 Q-5.4,3 -5.4,0.4 Q-5.4,-6.6 0,-7.2 Z" fill="url(#gold_belloff)" stroke="#C97E12" stroke-width=".8"/>
  <circle cx="0" cy="6.4" r="1.9" fill="url(#gold_belloff)" stroke="#C97E12" stroke-width=".5"/>
  <path d="M-3,-4 Q-2,-5.6 0.2,-5.6" stroke="#FFF6D8" stroke-width="1" fill="none" stroke-linecap="round" opacity=".7"/></g><line x1="38" y1="39" x2="55" y2="54" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/>
        <line x1="38" y1="39" x2="55" y2="54" stroke="#A99AD0" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  'calendar-add': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="calendar-add"><defs>
    <radialGradient id="fur_calendaradd" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_calendaradd" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_calendaradd" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_calendaradd" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_calendaradd" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_calendaradd" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_calendaradd" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_calendaradd" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_calendaradd" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_calendaradd" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_calendaradd" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_calendaradd" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_calendaradd" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_calendaradd" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_calendaradd" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_calendaradd" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><path d="M15,21 L49,21 Q51,21 51,23 L51,47 Q51,49 49,49 L15,49 Q13,49 13,47 L13,23 Q13,21 15,21 Z" fill="url(#acc_calendaradd)" stroke="#7a2ba8" stroke-width="1" stroke-opacity=".4" filter="url(#sh_calendaradd)"/><rect x="13" y="21" width="38" height="9" rx="2" fill="#6e2699" fill-opacity=".5"/>
        <rect x="20.3" y="15" width="3.6" height="9.5" rx="1.8" fill="url(#acc_calendaradd)" filter="url(#sh_calendaradd)"/>
        <rect x="40.1" y="15" width="3.6" height="9.5" rx="1.8" fill="url(#acc_calendaradd)" filter="url(#sh_calendaradd)"/>
        <g stroke="#fff" stroke-width="2.8" stroke-linecap="round"><line x1="32" y1="34" x2="32" y2="44"/><line x1="27" y1="39" x2="37" y2="39"/></g></svg>`,
  'tab-dashboard': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="tab-dashboard"><defs>
    <radialGradient id="fur_tabdashboard" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_tabdashboard" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_tabdashboard" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_tabdashboard" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_tabdashboard" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_tabdashboard" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_tabdashboard" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_tabdashboard" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_tabdashboard" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_tabdashboard" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_tabdashboard" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_tabdashboard" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_tabdashboard" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_tabdashboard" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_tabdashboard" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_tabdashboard" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><rect x="20" y="21" width="13.5" height="13.5" rx="3.6" fill="url(#acc_tabdashboard)" filter="url(#sh_tabdashboard)"/><rect x="21" y="22" width="11.5" height="4.6" rx="2.3" fill="url(#accHi_tabdashboard)"/><rect x="35" y="21" width="13.5" height="13.5" rx="3.6" fill="url(#acc_tabdashboard)" filter="url(#sh_tabdashboard)"/><rect x="36" y="22" width="11.5" height="4.6" rx="2.3" fill="url(#accHi_tabdashboard)"/><rect x="20" y="36" width="13.5" height="13.5" rx="3.6" fill="url(#acc_tabdashboard)" filter="url(#sh_tabdashboard)"/><rect x="21" y="37" width="11.5" height="4.6" rx="2.3" fill="url(#accHi_tabdashboard)"/><rect x="35" y="36" width="13.5" height="13.5" rx="3.6" fill="url(#acc_tabdashboard)" filter="url(#sh_tabdashboard)"/><rect x="36" y="37" width="11.5" height="4.6" rx="2.3" fill="url(#accHi_tabdashboard)"/></svg>`,
  'tab-chat': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="tab-chat"><defs>
    <radialGradient id="fur_tabchat" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_tabchat" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_tabchat" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_tabchat" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_tabchat" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_tabchat" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_tabchat" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_tabchat" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_tabchat" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_tabchat" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_tabchat" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_tabchat" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_tabchat" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_tabchat" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_tabchat" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_tabchat" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><path d="M15,19 L49,19 Q53,19 53,23 L53,39 Q53,43 49,43 L30,43 L21,51 L22.5,43 Q15,43 15,39 Z" fill="url(#acc_tabchat)" stroke="#7a2ba8" stroke-width="1" stroke-opacity=".4" filter="url(#sh_tabchat)"/><path d="M15,19 L49,19 Q53,19 53,23 L53,39 Q53,43 49,43 L30,43 L21,51 L22.5,43 Q15,43 15,39 Z" fill="url(#gloss_tabchat)" opacity=".32"/>
        <g fill="#fff" opacity=".92"><circle cx="26" cy="31" r="2.4"/><circle cx="34" cy="31" r="2.4"/><circle cx="42" cy="31" r="2.4"/></g></svg>`,
  'tab-vision': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="tab-vision"><defs>
    <radialGradient id="fur_tabvision" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_tabvision" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_tabvision" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_tabvision" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_tabvision" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_tabvision" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_tabvision" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_tabvision" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_tabvision" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_tabvision" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_tabvision" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_tabvision" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_tabvision" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_tabvision" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_tabvision" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_tabvision" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><g transform="translate(32,35) scale(0.92)">
    <path d="M -30,12 Q -33,-2 -22,-14 Q -16,-2 -9,-12 Q -2,-26 0,-26 Q 2,-26 9,-12 Q 16,-2 22,-14 Q 33,-2 30,12 Z" fill="url(#gold_tabvision)" stroke="#C97E12" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="-22" cy="-15" r="3.6" fill="url(#gem_tabvision)"/>
    <circle cx="22" cy="-15" r="3.6" fill="url(#gem_tabvision)"/>
    <circle cx="0" cy="-24" r="5" fill="url(#gem_tabvision)"/>
    <path d="M -20,-2 Q 0,5 20,-2" stroke="#FFF6D8" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>
  </g><path d="M 15,18.6 Q 15.528,20.472 17.4,21 Q 15.528,21.528 15,23.4 Q 14.472,21.528 12.6,21 Q 14.472,20.472 15,18.6 Z" fill="url(#spark_tabvision)" opacity="0.9"/><path d="M 50,21 Q 50.44,22.56 52,23 Q 50.44,23.44 50,25 Q 49.56,23.44 48,23 Q 49.56,22.56 50,21 Z" fill="url(#spark_tabvision)" opacity="0.85"/></svg>`,
  'priority-high': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="priority-high"><defs>
    <radialGradient id="fur_priorityhigh" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_priorityhigh" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_priorityhigh" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_priorityhigh" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_priorityhigh" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_priorityhigh" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_priorityhigh" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_priorityhigh" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_priorityhigh" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_priorityhigh" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_priorityhigh" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_priorityhigh" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_priorityhigh" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_priorityhigh" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_priorityhigh" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_priorityhigh" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><ellipse cx="32" cy="34" rx="16" ry="17" class="cnj-pulse" fill="#FF4D8D" opacity=".55" filter="url(#glw_priorityhigh)"/><g filter="url(#sh_priorityhigh)">
  <path d="M22,23 L42,23 L46.5,28 L32,50 L17.5,28 Z" fill="url(#gemHi_priorityhigh)" stroke="#fff" stroke-width=".6" stroke-opacity=".4"/>
  <path d="M22,23 L26,28 L17.5,28 Z" fill="#fff" fill-opacity=".22"/>
  <path d="M42,23 L38,28 L46.5,28 Z" fill="#000" fill-opacity=".12"/>
  <path d="M26,28 L38,28 L32,50 Z" fill="#fff" fill-opacity=".14"/>
  <line x1="17.5" y1="28" x2="46.5" y2="28" stroke="#fff" stroke-width=".6" stroke-opacity=".45"/>
  <line x1="26" y1="28" x2="32" y2="50" stroke="#fff" stroke-width=".5" stroke-opacity=".4"/>
  <line x1="38" y1="28" x2="32" y2="50" stroke="#fff" stroke-width=".5" stroke-opacity=".4"/>
  <path d="M24,24.4 L29,26.6" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".6"/></g><g transform="translate(32,16) scale(0.14)">
    <path d="M -30,12 Q -33,-2 -22,-14 Q -16,-2 -9,-12 Q -2,-26 0,-26 Q 2,-26 9,-12 Q 16,-2 22,-14 Q 33,-2 30,12 Z" fill="url(#gold_priorityhigh)" stroke="#C97E12" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="-22" cy="-15" r="3.6" fill="url(#gem_priorityhigh)"/>
    <circle cx="22" cy="-15" r="3.6" fill="url(#gem_priorityhigh)"/>
    <circle cx="0" cy="-24" r="5" fill="url(#gem_priorityhigh)"/>
    <path d="M -20,-2 Q 0,5 20,-2" stroke="#FFF6D8" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>
  </g><path d="M 48,16.4 Q 48.572,18.428 50.6,19 Q 48.572,19.572 48,21.6 Q 47.428,19.572 45.4,19 Q 47.428,18.428 48,16.4 Z" fill="url(#spark_priorityhigh)" opacity="0.95"/><path d="M 16,22 Q 16.44,23.56 18,24 Q 16.44,24.44 16,26 Q 15.56,24.44 14,24 Q 15.56,23.56 16,22 Z" fill="url(#spark_priorityhigh)" opacity="0.85"/></svg>`,
  'priority-medium': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="priority-medium"><defs>
    <radialGradient id="fur_prioritymedium" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_prioritymedium" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_prioritymedium" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_prioritymedium" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_prioritymedium" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_prioritymedium" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_prioritymedium" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_prioritymedium" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_prioritymedium" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_prioritymedium" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_prioritymedium" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_prioritymedium" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_prioritymedium" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_prioritymedium" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_prioritymedium" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_prioritymedium" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><ellipse cx="32" cy="34" rx="16" ry="17" class="cnj-pulse" fill="#E0468C" opacity=".55" filter="url(#glw_prioritymedium)"/><g filter="url(#sh_prioritymedium)">
  <path d="M22,23 L42,23 L46.5,28 L32,50 L17.5,28 Z" fill="url(#gem_prioritymedium)" stroke="#fff" stroke-width=".6" stroke-opacity=".4"/>
  <path d="M22,23 L26,28 L17.5,28 Z" fill="#fff" fill-opacity=".22"/>
  <path d="M42,23 L38,28 L46.5,28 Z" fill="#000" fill-opacity=".12"/>
  <path d="M26,28 L38,28 L32,50 Z" fill="#fff" fill-opacity=".14"/>
  <line x1="17.5" y1="28" x2="46.5" y2="28" stroke="#fff" stroke-width=".6" stroke-opacity=".45"/>
  <line x1="26" y1="28" x2="32" y2="50" stroke="#fff" stroke-width=".5" stroke-opacity=".4"/>
  <line x1="38" y1="28" x2="32" y2="50" stroke="#fff" stroke-width=".5" stroke-opacity=".4"/>
  <path d="M24,24.4 L29,26.6" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".6"/></g><path d="M 48,16.4 Q 48.572,18.428 50.6,19 Q 48.572,19.572 48,21.6 Q 47.428,19.572 45.4,19 Q 47.428,18.428 48,16.4 Z" fill="url(#spark_prioritymedium)" opacity="0.95"/></svg>`,
  'priority-low': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="priority-low"><defs>
    <radialGradient id="fur_prioritylow" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_prioritylow" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_prioritylow" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_prioritylow" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_prioritylow" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_prioritylow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_prioritylow" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_prioritylow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_prioritylow" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_prioritylow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_prioritylow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_prioritylow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_prioritylow" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_prioritylow" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_prioritylow" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_prioritylow" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><g filter="url(#sh_prioritylow)">
  <path d="M22,23 L42,23 L46.5,28 L32,50 L17.5,28 Z" fill="url(#gemLo_prioritylow)" stroke="#fff" stroke-width=".6" stroke-opacity=".4"/>
  <path d="M22,23 L26,28 L17.5,28 Z" fill="#fff" fill-opacity=".22"/>
  <path d="M42,23 L38,28 L46.5,28 Z" fill="#000" fill-opacity=".12"/>
  <path d="M26,28 L38,28 L32,50 Z" fill="#fff" fill-opacity=".14"/>
  <line x1="17.5" y1="28" x2="46.5" y2="28" stroke="#fff" stroke-width=".6" stroke-opacity=".45"/>
  <line x1="26" y1="28" x2="32" y2="50" stroke="#fff" stroke-width=".5" stroke-opacity=".4"/>
  <line x1="38" y1="28" x2="32" y2="50" stroke="#fff" stroke-width=".5" stroke-opacity=".4"/>
  <path d="M24,24.4 L29,26.6" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".6"/></g></svg>`,
  'fitness': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="fitness"><defs>
    <radialGradient id="fur_fitness" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_fitness" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_fitness" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_fitness" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_fitness" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_fitness" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_fitness" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_fitness" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_fitness" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_fitness" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_fitness" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_fitness" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_fitness" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_fitness" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_fitness" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_fitness" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><g transform="translate(25.5,23) rotate(-8)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_fitness)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_fitness)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g>
          <g transform="translate(38.5,23) rotate(30)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_fitness)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_fitness)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g><g filter="url(#sh_fitness)">
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#fur_fitness)" stroke="#3D2257" stroke-width=".8" stroke-opacity=".5"/>
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#occ_fitness)"/>
    <path d="M32,21 C23.5,21 17.5,26 16.5,32 C23.5,27 40.5,27 47.5,32 C46.5,26 40.5,21 32,21 Z" fill="url(#gloss_fitness)"/>
    <path d="M48,32 C51,38 49.5,46 44,50.5" stroke="#FF93C6" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".55"/>
  </g><ellipse cx="22.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_fitness)"/><ellipse cx="41.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_fitness)"/><ellipse cx="26" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_fitness)"/><circle cx="24.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="27.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><ellipse cx="38" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_fitness)"/><circle cx="36.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="39.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><path d="M undefined,43.9 C NaN,42.1 NaN,41.5 NaN,39.9 C NaN,38.1 NaN,37.8 undefined,39.8 C NaN,37.8 NaN,38.1 NaN,39.9 C NaN,41.5 NaN,42.1 undefined,43.9 Z" fill="url(#nose_fitness)"/><path d="M 29.4,45 Q 32,47.4 34.6,45" stroke="#3D2257" stroke-width="1.4" fill="none" stroke-linecap="round"/><g filter="url(#sh_fitness)">
  <path d="M16.5,30 Q32,23.5 47.5,30 L47.5,34 Q32,27.5 16.5,34 Z" fill="url(#acc_fitness)"/>
  <path d="M16.5,30 Q32,23.5 47.5,30" stroke="url(#accHi_fitness)" stroke-width="1.2" fill="none"/>
  <circle cx="40" cy="29.6" r="2.2" fill="#fff" opacity=".8"/></g><path d="M 49,16 Q 49.44,17.56 51,18 Q 49.44,18.44 49,20 Q 48.56,18.44 47,18 Q 48.56,17.56 49,16 Z" fill="url(#spark_fitness)" opacity="0.85"/></svg>`,
  'personal': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="personal"><defs>
    <radialGradient id="fur_personal" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_personal" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_personal" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_personal" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_personal" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_personal" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_personal" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_personal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_personal" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_personal" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_personal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_personal" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_personal" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_personal" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_personal" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_personal" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><g transform="translate(25.5,23) rotate(-8)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_personal)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_personal)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g>
          <g transform="translate(38.5,23) rotate(30)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_personal)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_personal)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g><g filter="url(#sh_personal)">
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#fur_personal)" stroke="#3D2257" stroke-width=".8" stroke-opacity=".5"/>
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#occ_personal)"/>
    <path d="M32,21 C23.5,21 17.5,26 16.5,32 C23.5,27 40.5,27 47.5,32 C46.5,26 40.5,21 32,21 Z" fill="url(#gloss_personal)"/>
    <path d="M48,32 C51,38 49.5,46 44,50.5" stroke="#FF93C6" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".55"/>
  </g><ellipse cx="22.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_personal)"/><ellipse cx="41.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_personal)"/><ellipse cx="26" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_personal)"/><circle cx="24.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="27.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><ellipse cx="38" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_personal)"/><circle cx="36.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="39.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><path d="M undefined,43.9 C NaN,42.1 NaN,41.5 NaN,39.9 C NaN,38.1 NaN,37.8 undefined,39.8 C NaN,37.8 NaN,38.1 NaN,39.9 C NaN,41.5 NaN,42.1 undefined,43.9 Z" fill="url(#nose_personal)"/><path d="M 29.4,45 Q 32,47.4 34.6,45" stroke="#3D2257" stroke-width="1.4" fill="none" stroke-linecap="round"/><g filter="url(#sh_personal)" transform="translate(45.5,45)">
  <path d="M-7,-1 L-7,6.5 Q-7,7 -6.4,7 L6.4,7 Q7,7 7,6.5 L7,-1 Z" fill="url(#acc_personal)"/>
  <path d="M-8.5,-0.2 L0,-8 L8.5,-0.2" fill="none" stroke="#7a2ba8" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M-8.5,-0.2 L0,-8 L8.5,-0.2" fill="none" stroke="url(#accHi_personal)" stroke-width=".9" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="-2.4" y="1.5" width="4.8" height="5.5" rx=".9" fill="#fff" opacity=".88"/></g></svg>`,
  'shopping': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="shopping"><defs>
    <radialGradient id="fur_shopping" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_shopping" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_shopping" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_shopping" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_shopping" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_shopping" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_shopping" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_shopping" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_shopping" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_shopping" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_shopping" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_shopping" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_shopping" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_shopping" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_shopping" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_shopping" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><g transform="translate(25.5,23) rotate(-8)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_shopping)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_shopping)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g>
          <g transform="translate(38.5,23) rotate(30)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_shopping)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_shopping)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g><g filter="url(#sh_shopping)">
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#fur_shopping)" stroke="#3D2257" stroke-width=".8" stroke-opacity=".5"/>
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#occ_shopping)"/>
    <path d="M32,21 C23.5,21 17.5,26 16.5,32 C23.5,27 40.5,27 47.5,32 C46.5,26 40.5,21 32,21 Z" fill="url(#gloss_shopping)"/>
    <path d="M48,32 C51,38 49.5,46 44,50.5" stroke="#FF93C6" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".55"/>
  </g><ellipse cx="22.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_shopping)"/><ellipse cx="41.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_shopping)"/><ellipse cx="26" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_shopping)"/><circle cx="24.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="27.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><ellipse cx="38" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_shopping)"/><circle cx="36.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="39.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><path d="M undefined,43.9 C NaN,42.1 NaN,41.5 NaN,39.9 C NaN,38.1 NaN,37.8 undefined,39.8 C NaN,37.8 NaN,38.1 NaN,39.9 C NaN,41.5 NaN,42.1 undefined,43.9 Z" fill="url(#nose_shopping)"/><path d="M 29.4,45 Q 32,47.4 34.6,45" stroke="#3D2257" stroke-width="1.4" fill="none" stroke-linecap="round"/><g filter="url(#sh_shopping)" transform="translate(45.5,46)">
  <path d="M-6,-2 L6,-2 L7,7 Q7,8.2 5.8,8.2 L-5.8,8.2 Q-7,8.2 -7,7 Z" fill="url(#acc_shopping)"/>
  <path d="M-3.6,-2 Q-3.6,-7.4 0,-7.4 Q3.6,-7.4 3.6,-2" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M-5.6,0 L5.6,0" stroke="#fff" stroke-width=".8" opacity=".4"/></g></svg>`,
  'finance': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="finance"><defs>
    <radialGradient id="fur_finance" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_finance" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_finance" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_finance" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_finance" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_finance" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_finance" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_finance" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_finance" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_finance" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_finance" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_finance" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_finance" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_finance" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_finance" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_finance" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><g transform="translate(25.5,23) rotate(-8)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_finance)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_finance)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g>
          <g transform="translate(38.5,23) rotate(30)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_finance)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_finance)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g><g filter="url(#sh_finance)">
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#fur_finance)" stroke="#3D2257" stroke-width=".8" stroke-opacity=".5"/>
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#occ_finance)"/>
    <path d="M32,21 C23.5,21 17.5,26 16.5,32 C23.5,27 40.5,27 47.5,32 C46.5,26 40.5,21 32,21 Z" fill="url(#gloss_finance)"/>
    <path d="M48,32 C51,38 49.5,46 44,50.5" stroke="#FF93C6" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".55"/>
  </g><ellipse cx="22.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_finance)"/><ellipse cx="41.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_finance)"/><ellipse cx="26" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_finance)"/><circle cx="24.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="27.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><ellipse cx="38" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_finance)"/><circle cx="36.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="39.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><path d="M undefined,43.9 C NaN,42.1 NaN,41.5 NaN,39.9 C NaN,38.1 NaN,37.8 undefined,39.8 C NaN,37.8 NaN,38.1 NaN,39.9 C NaN,41.5 NaN,42.1 undefined,43.9 Z" fill="url(#nose_finance)"/><path d="M 29.4,45 Q 32,47.4 34.6,45" stroke="#3D2257" stroke-width="1.4" fill="none" stroke-linecap="round"/><g filter="url(#sh_finance)" transform="translate(46,45)">
  <circle r="8" fill="url(#gold_finance)" stroke="#C97E12" stroke-width=".9"/>
  <circle r="5.4" fill="none" stroke="#C97E12" stroke-width=".8" opacity=".55"/>
  <path d="M0,-3.8 L0,3.8 M-2.2,-1.6 Q0,-4 2.2,-2 M2.2,1.6 Q0,4 -2.2,2" stroke="#C97E12" stroke-width="1.4" fill="none" stroke-linecap="round"/>
  <ellipse cx="-2.6" cy="-3" rx="2" ry="1.2" fill="#fff" opacity=".55"/></g></svg>`,
  'travel': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="travel"><defs>
    <radialGradient id="fur_travel" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_travel" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_travel" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_travel" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_travel" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_travel" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_travel" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_travel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_travel" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_travel" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_travel" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_travel" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_travel" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_travel" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_travel" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_travel" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><g transform="translate(25.5,23) rotate(-8)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_travel)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_travel)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g>
          <g transform="translate(38.5,23) rotate(30)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_travel)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_travel)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g><g filter="url(#sh_travel)">
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#fur_travel)" stroke="#3D2257" stroke-width=".8" stroke-opacity=".5"/>
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#occ_travel)"/>
    <path d="M32,21 C23.5,21 17.5,26 16.5,32 C23.5,27 40.5,27 47.5,32 C46.5,26 40.5,21 32,21 Z" fill="url(#gloss_travel)"/>
    <path d="M48,32 C51,38 49.5,46 44,50.5" stroke="#FF93C6" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".55"/>
  </g><ellipse cx="22.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_travel)"/><ellipse cx="41.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_travel)"/><ellipse cx="26" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_travel)"/><circle cx="24.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="27.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><ellipse cx="38" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_travel)"/><circle cx="36.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="39.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><path d="M undefined,43.9 C NaN,42.1 NaN,41.5 NaN,39.9 C NaN,38.1 NaN,37.8 undefined,39.8 C NaN,37.8 NaN,38.1 NaN,39.9 C NaN,41.5 NaN,42.1 undefined,43.9 Z" fill="url(#nose_travel)"/><path d="M 29.4,45 Q 32,47.4 34.6,45" stroke="#3D2257" stroke-width="1.4" fill="none" stroke-linecap="round"/><g filter="url(#sh_travel)" transform="translate(45.5,46)">
  <rect x="-7.2" y="-4" width="14.4" height="11.4" rx="2.4" fill="url(#acc_travel)"/>
  <path d="M-3,-4 L-3,-6.6 Q-3,-7.6 -2,-7.6 L2,-7.6 Q3,-7.6 3,-6.6 L3,-4" fill="none" stroke="#7a2ba8" stroke-width="1.6"/>
  <line x1="0" y1="-4" x2="0" y2="7.4" stroke="#fff" stroke-width="1" opacity=".5"/>
  <rect x="-7.2" y="-1.2" width="14.4" height="2.6" fill="#fff" opacity=".22"/></g></svg>`,
  'creative': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="creative"><defs>
    <radialGradient id="fur_creative" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_creative" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_creative" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_creative" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_creative" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_creative" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_creative" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_creative" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_creative" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_creative" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_creative" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_creative" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_creative" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_creative" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_creative" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_creative" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><g transform="translate(25.5,23) rotate(-8)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_creative)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_creative)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g>
          <g transform="translate(38.5,23) rotate(30)"><g>
    <path d="M0,1 C-5,-1 -7.5,-9 -6.4,-16.5 C-5.4,-22 -2.2,-25 0,-25 C2.2,-25 5.4,-22 6.4,-16.5 C7.5,-9 5,-1 0,1 Z" fill="url(#fur_creative)" stroke="#3D2257" stroke-width=".7" stroke-opacity=".45"/>
    <path d="M0,-3 C-3,-5 -5,-10 -4,-15.5 C-3.2,-19.5 -1.2,-22 0,-22 C1.2,-22 3.2,-19.5 4,-15.5 C5,-10 3,-5 0,-3 Z" fill="url(#ear_creative)"/>
    <path d="M-1,-8 C-3,-13 -2.4,-18 -0.6,-21.5" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".5"/>
  </g></g><g filter="url(#sh_creative)">
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#fur_creative)" stroke="#3D2257" stroke-width=".8" stroke-opacity=".5"/>
    <path d="M32,19 C20.5,18 13.5,26 13.5,36 C13.5,46 22,53.5 32,53.5 C42,53.5 50.5,46 50.5,36 C50.5,26 43.5,18 32,19 Z" fill="url(#occ_creative)"/>
    <path d="M32,21 C23.5,21 17.5,26 16.5,32 C23.5,27 40.5,27 47.5,32 C46.5,26 40.5,21 32,21 Z" fill="url(#gloss_creative)"/>
    <path d="M48,32 C51,38 49.5,46 44,50.5" stroke="#FF93C6" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".55"/>
  </g><ellipse cx="22.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_creative)"/><ellipse cx="41.5" cy="41.5" rx="3.2" ry="1.9" fill="url(#blush_creative)"/><ellipse cx="26" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_creative)"/><circle cx="24.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="27.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><ellipse cx="38" cy="35.5" rx="3.7" ry="4.7" fill="url(#eye_creative)"/><circle cx="36.742" cy="33.808" r="1.554" fill="#fff"/><circle cx="39.332" cy="36.91" r="0.7400000000000001" fill="#fff" opacity=".8"/><path d="M undefined,43.9 C NaN,42.1 NaN,41.5 NaN,39.9 C NaN,38.1 NaN,37.8 undefined,39.8 C NaN,37.8 NaN,38.1 NaN,39.9 C NaN,41.5 NaN,42.1 undefined,43.9 Z" fill="url(#nose_creative)"/><path d="M 29.4,45 Q 32,47.4 34.6,45" stroke="#3D2257" stroke-width="1.4" fill="none" stroke-linecap="round"/><g filter="url(#sh_creative)" transform="translate(46,45) rotate(42)">
  <rect x="-2.4" y="-9.5" width="4.8" height="9.5" rx="1.8" fill="url(#acc_creative)"/>
  <rect x="-2.4" y="-1.4" width="4.8" height="3" fill="#C7A6E6"/>
  <path d="M-2.7,1.6 L2.7,1.6 L1.7,8 Q0,9.8 -1.7,8 Z" fill="#fff" opacity=".92"/></g></svg>`,
  'home': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="home"><defs>
    <radialGradient id="fur_home" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="48%" stop-color="#F4EBFF"/>
      <stop offset="80%" stop-color="#E5D5F6"/><stop offset="100%" stop-color="#D2BBEF"/>
    </radialGradient>
    <radialGradient id="occ_home" cx="50%" cy="80%" r="70%">
      <stop offset="0%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="72%" stop-color="#A981D8" stop-opacity="0"/>
      <stop offset="100%" stop-color="#9670C9" stop-opacity=".4"/>
    </radialGradient>
    <radialGradient id="gloss_home" cx="42%" cy="18%" r="60%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".95"/>
      <stop offset="60%" stop-color="#FFFFFF" stop-opacity=".15"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ear_home" cx="50%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#FFE0EE"/><stop offset="50%" stop-color="#F7ABCD"/>
      <stop offset="100%" stop-color="#E879AC"/>
    </radialGradient>
    <radialGradient id="eye_home" cx="38%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#46295F"/><stop offset="60%" stop-color="#291641"/>
      <stop offset="100%" stop-color="#150A26"/>
    </radialGradient>
    <radialGradient id="blush_home" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FF9DBC" stop-opacity=".9"/>
      <stop offset="100%" stop-color="#FF9DBC" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="nose_home" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FF9CBD"/><stop offset="60%" stop-color="#FF6F9C"/>
      <stop offset="100%" stop-color="#E84C82"/>
    </radialGradient>
    <linearGradient id="gold_home" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFF1C4"/><stop offset="45%" stop-color="#FFD05C"/>
      <stop offset="100%" stop-color="#E0941A"/>
    </linearGradient>
    <radialGradient id="gem_home" cx="40%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#FFC2DC"/><stop offset="55%" stop-color="#FF6FA5"/>
      <stop offset="100%" stop-color="#DC4684"/>
    </radialGradient>
    <linearGradient id="acc_home" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#A24BF0"/><stop offset="100%" stop-color="#E0468C"/>
    </linearGradient>
    <linearGradient id="accHi_home" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity=".85"/>
      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="spark_home" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF"/><stop offset="100%" stop-color="#FFE6F4"/>
    </radialGradient>
    <radialGradient id="gemHi_home" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#FFD0E2"/><stop offset="45%" stop-color="#FF4D8D"/>
      <stop offset="100%" stop-color="#C9165C"/>
    </radialGradient>
    <radialGradient id="gemLo_home" cx="40%" cy="28%" r="80%">
      <stop offset="0%" stop-color="#F0E4FF"/><stop offset="50%" stop-color="#C9A8F0"/>
      <stop offset="100%" stop-color="#9E78CF"/>
    </radialGradient>
    <filter id="sh_home" x="-40%" y="-40%" width="180%" height="180%">
      <feDropShadow dx="0" dy="1.4" stdDeviation="1.4" flood-color="#3a1d5e" flood-opacity=".30"/>
    </filter>
    <filter id="glw_home" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="2.6"/>
    </filter>
  </defs><path d="M16,33 L32,18.5 L48,33 L48,49 Q48,50 47,50 L17,50 Q16,50 16,49 Z" fill="url(#acc_home)" stroke="#7a2ba8" stroke-width="1" stroke-opacity=".4" filter="url(#sh_home)"/><path d="M16,33 L32,18.5 L48,33 L48,49 Q48,50 47,50 L17,50 Q16,50 16,49 Z" fill="url(#gloss_home)" opacity=".35"/>
        <path d="M13,34 L32,16.5 L51,34" fill="none" stroke="url(#acc_home)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" filter="url(#sh_home)"/>
        <path d="M13,34 L32,16.5 L51,34" fill="none" stroke="url(#accHi_home)" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="27" y="38" width="10" height="12" rx="1.6" fill="#fff" opacity=".88"/>
        <circle cx="34.4" cy="44" r="1" fill="url(#acc_home)"/></svg>`,
};

/** Generic renderer — inlines the self-contained SVG (own gradients per icon). */
export const ConejitaIcon: React.FC<IconProps & { name: IconName }> = ({
  name, size = 64, style, ...rest
}) => {
  React.useEffect(ensureAnimStyles, []);
  return (
    <span
      role="img"
      aria-label={name.replace(/-/g, ' ')}
      style={{ display: 'inline-flex', lineHeight: 0, width: size, height: size, ...style }}
      {...rest}
      dangerouslySetInnerHTML={{
        __html: RAW[name].replace(
          'width="64" height="64"',
          `width="${size}" height="${size}"`
        ),
      }}
    />
  );
};

export const MascotBunnyIcon = (p: IconProps) => <ConejitaIcon name="mascot-bunny" {...p} />;
export const EmptyStateIcon = (p: IconProps) => <ConejitaIcon name="empty-state" {...p} />;
export const CompleteCelebrationIcon = (p: IconProps) => <ConejitaIcon name="complete-celebration" {...p} />;
export const LoadingIcon = (p: IconProps) => <ConejitaIcon name="loading" {...p} />;
export const CheckDoneIcon = (p: IconProps) => <ConejitaIcon name="check-done" {...p} />;
export const CloseIcon = (p: IconProps) => <ConejitaIcon name="close" {...p} />;
export const ExpandIcon = (p: IconProps) => <ConejitaIcon name="expand" {...p} />;
export const RefreshIcon = (p: IconProps) => <ConejitaIcon name="refresh" {...p} />;
export const SparkleIcon = (p: IconProps) => <ConejitaIcon name="sparkle" {...p} />;
export const WorkIcon = (p: IconProps) => <ConejitaIcon name="work" {...p} />;
export const StudyIcon = (p: IconProps) => <ConejitaIcon name="study" {...p} />;
export const HealthIcon = (p: IconProps) => <ConejitaIcon name="health" {...p} />;
export const CheckEmptyIcon = (p: IconProps) => <ConejitaIcon name="check-empty" {...p} />;
export const DeleteIcon = (p: IconProps) => <ConejitaIcon name="delete" {...p} />;
export const ResetIcon = (p: IconProps) => <ConejitaIcon name="reset" {...p} />;
export const DragIcon = (p: IconProps) => <ConejitaIcon name="drag" {...p} />;
export const SaveCloudIcon = (p: IconProps) => <ConejitaIcon name="save-cloud" {...p} />;
export const MenuIcon = (p: IconProps) => <ConejitaIcon name="menu" {...p} />;
export const SendIcon = (p: IconProps) => <ConejitaIcon name="send" {...p} />;
export const BellOnIcon = (p: IconProps) => <ConejitaIcon name="bell-on" {...p} />;
export const BellOffIcon = (p: IconProps) => <ConejitaIcon name="bell-off" {...p} />;
export const CalendarAddIcon = (p: IconProps) => <ConejitaIcon name="calendar-add" {...p} />;
export const TabDashboardIcon = (p: IconProps) => <ConejitaIcon name="tab-dashboard" {...p} />;
export const TabChatIcon = (p: IconProps) => <ConejitaIcon name="tab-chat" {...p} />;
export const TabVisionIcon = (p: IconProps) => <ConejitaIcon name="tab-vision" {...p} />;
export const PriorityHighIcon = (p: IconProps) => <ConejitaIcon name="priority-high" {...p} />;
export const PriorityMediumIcon = (p: IconProps) => <ConejitaIcon name="priority-medium" {...p} />;
export const PriorityLowIcon = (p: IconProps) => <ConejitaIcon name="priority-low" {...p} />;
export const FitnessIcon = (p: IconProps) => <ConejitaIcon name="fitness" {...p} />;
export const PersonalIcon = (p: IconProps) => <ConejitaIcon name="personal" {...p} />;
export const ShoppingIcon = (p: IconProps) => <ConejitaIcon name="shopping" {...p} />;
export const FinanceIcon = (p: IconProps) => <ConejitaIcon name="finance" {...p} />;
export const TravelIcon = (p: IconProps) => <ConejitaIcon name="travel" {...p} />;
export const CreativeIcon = (p: IconProps) => <ConejitaIcon name="creative" {...p} />;
export const HomeIcon = (p: IconProps) => <ConejitaIcon name="home" {...p} />;

export const ICON_NAMES: IconName[] = ['mascot-bunny', 'empty-state', 'complete-celebration', 'loading', 'check-done', 'close', 'expand', 'refresh', 'sparkle', 'work', 'study', 'health', 'check-empty', 'delete', 'reset', 'drag', 'save-cloud', 'menu', 'send', 'bell-on', 'bell-off', 'calendar-add', 'tab-dashboard', 'tab-chat', 'tab-vision', 'priority-high', 'priority-medium', 'priority-low', 'fitness', 'personal', 'shopping', 'finance', 'travel', 'creative', 'home'];
