import { palette as p } from "@/components/illustrations";
import type { StandingLevel } from "@/lib/standing";

// Horizontal positions use the illustration's coordinates, so bubble tails
// and role labels stay aligned with the people at every screen width.
export const SCENE_SPEAKERS: Record<StandingLevel, { x: number; tailHeight: number }> = {
  new: { x: 171, tailHeight: 14 },
  introduced: { x: 233, tailHeight: 24 },
  known: { x: 86, tailHeight: 24 },
  steward: { x: 88, tailHeight: 24 },
};

// The same neighbor in the red shirt appears throughout the comic. These
// decorative vectors accompany real HTML dialogue and captions.
function Neighbor({ x, y, kind = "neighbor", flip = false }: {
  x: number;
  y: number;
  kind?: "neighbor" | "steward" | "elder" | "newcomer";
  flip?: boolean;
}) {
  const skin = kind === "neighbor" ? p.skin[0] : kind === "steward" ? p.skin[2] : kind === "elder" ? p.skin[3] : p.skin[1];
  const shirt = kind === "neighbor" ? p.tomato : kind === "steward" ? p.cobalt : kind === "elder" ? p.leafDeep : p.cobalt;
  const hair = kind === "elder" ? "#cbd0df" : p.ink;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <path d="M-17 90l-4 51h15l8-43 6 43h15l-4-51Z" fill={p.ink} />
      <path d="M-22 140h17v6h-23q-2-6 6-6Zm30 0h17q8 0 7 6H8Z" fill={p.ink} />
      <path d="M-27 88l4-43q2-16 23-16t23 16l4 43Z" fill={shirt} />
      <path d="M-6 20v11q6 6 12 0V20" fill={skin} />
      {kind === "neighbor" && <circle cx="-5" cy="-20" r="12" fill={hair} />}
      <rect x="-18" y="-19" width="36" height="44" rx="17" fill={skin} />
      <path d="M-18 0v-9q0-16 18-16 22 0 19 25l-9-14Q0-3-18 0Z" fill={hair} />
      <circle cx="-6" cy="5" r="1.5" fill={p.ink} />
      <circle cx="7" cy="5" r="1.5" fill={p.ink} />
      <path d="M-4 14q5 4 10-1" fill="none" stroke={p.ink} strokeWidth="1.8" strokeLinecap="round" />
      {kind === "elder" && (
        <g fill="none" stroke={p.ink} strokeWidth="1.7">
          <rect x="-13" y="0" width="11" height="9" rx="3" />
          <rect x="2" y="0" width="11" height="9" rx="3" />
          <path d="M-2 4h4" />
        </g>
      )}
      <path d="M-20 44l-8 32 21 7" fill="none" stroke={shirt} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M-9 82l9 2" stroke={skin} strokeWidth="10" strokeLinecap="round" />
      <path d="M20 44l10 22 21-12" fill="none" stroke={shirt} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 54l7-5" stroke={skin} strokeWidth="10" strokeLinecap="round" />
    </g>
  );
}

function Plant({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 0v-43" stroke={p.leafDeep} strokeWidth="4" />
      <path d="M0-19q-28 0-24-22Q0-40 0-19Zm0-10q0-25 23-24Q26-31 0-29Z" fill={p.leaf} />
      <path d="M-18-2h36l-5 29h-26Z" fill={p.tomato} />
      <rect x="-20" y="-5" width="40" height="8" rx="3" fill={p.tomatoDeep} />
    </g>
  );
}

export function StandingScene({ level }: { level: StandingLevel }) {
  return (
    <svg viewBox="0 0 320 228" className="block w-full" aria-hidden="true" focusable="false">
      <path d="M0 188q160-12 320 0v40H0Z" fill={p.paper} fillOpacity=".65" />
      {level === "new" && (
        <>
          <rect x="19" y="24" width="87" height="123" rx="8" fill={p.paper} />
          <rect x="29" y="34" width="67" height="91" rx="3" fill={p.sky} />
          <path d="M62 35v90M29 78h67" stroke={p.paper} strokeWidth="5" />
          <circle cx="79" cy="52" r="11" fill={p.sun} />
          <path d="M30 117l20-32 18 18 28-32v54H30Z" fill={p.mint} />
          <path d="M128 199h132" stroke={p.ink} strokeWidth="3" opacity=".15" strokeLinecap="round" />
          <Neighbor x={SCENE_SPEAKERS.new.x} y={51} />
          <rect x="216" y="86" width="24" height="38" rx="5" fill={p.ink} transform="rotate(-14 228 105)" />
          <path d="m223 103 4 4 7-10" fill="none" stroke={p.sun} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M112 145h151v12H112Z" fill={p.sun} />
          <path d="M126 157v57m125-57v57" stroke={p.ink} strokeWidth="6" />
          <rect x="133" y="122" width="54" height="23" rx="10" fill={p.cobalt} />
          <path d="M130 124h60m-47-7q-5-6 1-13m14 12q-5-6 1-13m14 13q-5-6 1-13" fill="none" stroke={p.cobalt} strokeWidth="3" strokeLinecap="round" />
          <Plant x={41} y={185} />
        </>
      )}
      {level === "introduced" && (
        <>
          <rect x="103" y="19" width="113" height="167" rx="55" fill={p.paper} />
          <path d="M117 186V75a43 43 0 0 1 86 0v111Z" fill={p.cobalt} fillOpacity=".12" />
          <path d="M119 33h81" stroke={p.cobalt} strokeWidth="5" strokeLinecap="round" />
          <path d="m22 28 41 15 41-15m113 0 41 15 41-15" fill="none" stroke={p.ink} strokeWidth="1.5" opacity=".3" />
          <path d="m32 32 15 6-10 13Zm42 6 15-6-5 19Zm153-6 15 6-10 13Zm43 6 15-6-5 19Z" fill={p.tomato} />
          <Neighbor x={86} y={59} />
          <Neighbor x={SCENE_SPEAKERS.introduced.x} y={59} kind="steward" flip />
          <path d="M141 108q17 12 35 0" fill="none" stroke={p.skin[0]} strokeWidth="9" strokeLinecap="round" />
          <rect x="205" y="100" width="29" height="36" rx="4" fill={p.paper} transform="rotate(8 219 118)" />
          <path d="M213 110h13m-13 7h13m-13 7h9" fill="none" stroke={p.cobalt} strokeWidth="2" strokeLinecap="round" />
          <Plant x={292} y={185} />
        </>
      )}
      {level === "known" && (
        <>
          <rect x="17" y="24" width="89" height="63" rx="6" fill={p.paper} />
          <rect x="26" y="34" width="28" height="21" rx="3" fill={p.sun} />
          <rect x="62" y="34" width="33" height="33" rx="3" fill={p.sky} />
          <path d="M27 65h23m-23 9h44" stroke={p.ink} strokeWidth="3" opacity=".18" strokeLinecap="round" />
          <Neighbor x={SCENE_SPEAKERS.known.x} y={60} kind="elder" />
          <Neighbor x={233} y={60} flip />
          <path d="M136 111q22 12 40 0" fill="none" stroke={p.skin[3]} strokeWidth="8" strokeLinecap="round" />
          <rect x="133" y="145" width="53" height="33" rx="3" fill={p.sun} />
          <path d="M133 154h53m-34-9v33m15-33v33" stroke={p.paper} strokeWidth="2" />
          <path d="M119 178h83v9h-83m10 9v18m63-18v18" stroke={p.ink} strokeWidth="4" strokeLinecap="round" />
          <path d="M160 143v-19m0 10q-18-1-17-14 16-1 17 14m0-4q0-18 17-19 0 18-17 19" fill={p.leaf} />
        </>
      )}
      {level === "steward" && (
        <>
          <rect x="25" y="25" width="79" height="63" rx="5" fill={p.paper} />
          <path d="M37 41h50m-50 12h37m-37 12h45" stroke={p.cobalt} strokeWidth="4" strokeLinecap="round" opacity=".4" />
          <Neighbor x={SCENE_SPEAKERS.steward.x} y={59} />
          <Neighbor x={239} y={59} kind="newcomer" flip />
          <rect x="68" y="100" width="30" height="14" rx="3" fill={p.paper} />
          <path d="M76 107h14" stroke={p.tomatoDeep} strokeWidth="2" strokeLinecap="round" />
          <path d="M110 145h104v12H110Z" fill={p.cobalt} />
          <path d="M121 157v58m82-58v58" stroke={p.ink} strokeWidth="5" />
          <path d="M131 128h17v10q-8 10-17 0Zm45 0h17v10q-8 10-17 0Z" fill={p.paper} />
          <path d="M148 130q11 0 0 8m45-8q11 0 0 8" fill="none" stroke={p.paper} strokeWidth="3" />
          <Plant x={288} y={184} />
        </>
      )}
    </svg>
  );
}
