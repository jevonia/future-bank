/*
 * Hand-built vector illustrations for New Future Bank. They share one palette
 * and a flat, rounded style so the landing page, dashboard, and share image
 * read as one family. All are decorative unless a title is passed.
 */

export const palette = {
  paper: "#ffffff",
  haze: "#f2f5ff",
  ink: "#121633",
  cobalt: "#2340d9",
  cobaltDeep: "#1b32b0",
  sky: "#d9e3ff",
  tomato: "#ef4f2b",
  tomatoLight: "#ff8a6b",
  tomatoDeep: "#c4361a",
  sun: "#ffc93c",
  sunLight: "#ffe28a",
  blush: "#ffdcd2",
  leaf: "#2fb47c",
  mint: "#bdebd5",
  leafDeep: "#0b7350",
  skin: ["#8d5a3b", "#c98e64", "#f0c7a0", "#5b3a29"],
};

type ArtProps = { className?: string; title?: string };

function a11y(title?: string) {
  return title
    ? { role: "img" as const, "aria-label": title }
    : { "aria-hidden": true as const };
}

/** Brand mark: a clock face with a sprout for hands — time that grows. */
export function LogoMark({
  className = "h-10 w-10",
  square = false,
  size,
}: {
  className?: string;
  /** Full-bleed background for platforms that apply their own mask. */
  square?: boolean;
  size?: number;
}) {
  const p = palette;
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      width={size}
      height={size}
      aria-hidden="true"
    >
      <rect width="64" height="64" rx={square ? 0 : 18} fill={p.cobalt} />
      <circle
        cx="32"
        cy="35"
        r="17"
        fill="none"
        stroke={p.paper}
        strokeWidth="4"
        strokeDasharray="88 19"
        strokeDashoffset="17.4"
        strokeLinecap="round"
      />
      <path
        d="M32 42V24"
        stroke={p.paper}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path d="M32 31c-7 0-11-4.5-11-11 7 0 11 4.5 11 11Z" fill={p.sun} />
      <path
        d="M32 26.5c0-6 4-10.5 11-10.5 0 6.5-4 10.5-11 10.5Z"
        fill={p.paper}
      />
      <circle cx="32" cy="42" r="3.2" fill={p.paper} />
    </svg>
  );
}

function Person({
  x,
  y,
  skin,
  shirt,
  hair,
  hairStyle = "short",
  scale = 1,
}: {
  x: number;
  y: number;
  skin: string;
  shirt: string;
  hair: string;
  hairStyle?: "short" | "bun" | "long" | "curly" | "cap";
  scale?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M-31 124V62c0-15 10-26 25-26h12c15 0 25 11 25 26v62Z"
        fill={shirt}
      />
      <rect x="-7" y="22" width="14" height="14" rx="5" fill={skin} />
      {hairStyle === "long" && (
        <path d="M-21 2c0-18 42-18 42 0v30h-42Z" fill={hair} />
      )}
      <circle r="19" fill={skin} />
      {hairStyle === "short" && (
        <path
          d="M-19-2c-1-14 9-20 19-20s21 6 19 20c-6-7-26-9-38 0Z"
          fill={hair}
        />
      )}
      {hairStyle === "bun" && (
        <>
          <circle cy="-24" r="9" fill={hair} />
          <path
            d="M-19-1c0-13 8-19 19-19s19 6 19 19c-8-8-30-8-38 0Z"
            fill={hair}
          />
        </>
      )}
      {hairStyle === "long" && (
        <path
          d="M-19-1c0-13 8-19 19-19s19 6 19 19c-5-3-12-9-17-12-5 7-13 11-21 12Z"
          fill={hair}
        />
      )}
      {hairStyle === "curly" && (
        <g fill={hair}>
          <circle cx="-14" cy="-10" r="8" />
          <circle cx="-4" cy="-17" r="9" />
          <circle cx="8" cy="-16" r="9" />
          <circle cx="16" cy="-7" r="7" />
          <circle cx="-18" cy="0" r="5" />
        </g>
      )}
      {hairStyle === "cap" && (
        <path
          d="M-19-3c0-12 8-18 19-18s19 6 19 18H-19Zm24 0h20c3 0 3 4 0 4H5Z"
          fill={hair}
        />
      )}
      <circle cx="-6" cy="3" r="1.8" fill={palette.ink} opacity=".75" />
      <circle cx="6" cy="3" r="1.8" fill={palette.ink} opacity=".75" />
      <path
        d="M-5 10q5 4 10 0"
        stroke={palette.ink}
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
        opacity=".6"
      />
    </g>
  );
}

function TimeCoin({ x, y, r = 11 }: { x: number; y: number; r?: number }) {
  const p = palette;
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r={r} fill={p.sun} stroke={p.paper} strokeWidth="3" />
      <path
        d={`M0 ${-r * 0.5}V0l${r * 0.38} ${r * 0.3}`}
        stroke={p.ink}
        strokeWidth="2.2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

/** A city block in the morning: a neighbor brings soup past the corner store, windows linked by a thread of time. */
export function HeroScene({
  className,
  title,
  width,
}: ArtProps & { width?: number }) {
  const p = palette;
  const apartmentWindows = [78, 116, 154].flatMap((x, col) =>
    [172, 212, 252, 292].map((y, row) => ({
      x,
      y,
      lit: (col + row) % 3 === 0 || (col === 2 && row === 2),
    })),
  );
  return (
    <svg
      viewBox="0 0 600 470"
      className={className}
      width={width}
      height={width && (width * 470) / 600}
      {...a11y(title)}
    >
      <defs>
        <clipPath id="nfb-hero-arch">
          <path d="M40 436V250C40 110 160 30 300 30s260 80 260 220v186q0 34-34 34H74q-34 0-34-34Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#nfb-hero-arch)">
        <rect width="600" height="470" fill={p.sky} />
        <circle cx="440" cy="128" r="62" fill={p.paper} opacity=".6" />
        <circle cx="440" cy="128" r="40" fill={p.sun} />
        <path
          d="M108 118c0-12 10-20 22-18 4-12 22-14 28-2 12-2 20 8 16 20Z"
          fill={p.paper}
        />

        <rect
          x="54"
          y="140"
          width="152"
          height="16"
          rx="3"
          fill={p.tomatoDeep}
        />
        <rect x="60" y="154" width="140" height="230" fill={p.tomato} />
        {apartmentWindows.map(({ x, y, lit }) => (
          <rect
            key={`${x}-${y}`}
            x={x}
            y={y}
            width="26"
            height="28"
            rx="4"
            fill={lit ? p.sun : p.sky}
          />
        ))}
        <rect
          x="108"
          y="326"
          width="44"
          height="8"
          rx="3"
          fill={p.tomatoDeep}
        />
        <rect x="114" y="334" width="32" height="50" rx="4" fill={p.ink} />

        <rect x="212" y="250" width="116" height="134" fill={p.paper} />
        <rect x="206" y="234" width="128" height="24" rx="4" fill={p.cobalt} />
        <circle cx="244" cy="246" r="6" fill={p.sun} />
        <circle cx="262" cy="246" r="6" fill={p.tomato} />
        <circle cx="280" cy="246" r="6" fill={p.leaf} />
        <circle cx="298" cy="246" r="6" fill={p.paper} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <g key={i}>
            <rect
              x={206 + i * 16}
              y="258"
              width="16"
              height="20"
              fill={i % 2 ? p.paper : p.tomato}
            />
            <circle
              cx={214 + i * 16}
              cy="278"
              r="8"
              fill={i % 2 ? p.paper : p.tomato}
            />
          </g>
        ))}
        <rect x="222" y="298" width="58" height="50" rx="4" fill={p.sky} />
        <circle cx="236" cy="340" r="7" fill={p.tomato} />
        <circle cx="251" cy="340" r="7" fill={p.leaf} />
        <circle cx="266" cy="340" r="7" fill={p.sun} />
        <rect
          x="290"
          y="300"
          width="28"
          height="84"
          rx="3"
          fill={p.cobaltDeep}
        />

        <rect x="336" y="184" width="88" height="14" rx="3" fill={p.ink} />
        <rect x="340" y="196" width="80" height="188" fill={p.leafDeep} />
        <rect x="424" y="214" width="96" height="14" rx="3" fill={p.ink} />
        <rect x="428" y="226" width="88" height="158" fill={p.sun} />
        {[214, 258, 302].map((y) => (
          <g key={y}>
            <rect
              x="352"
              y={y}
              width="22"
              height="30"
              rx="4"
              fill={y === 258 ? p.sun : p.sky}
            />
            <rect x="386" y={y} width="22" height="30" rx="4" fill={p.sky} />
          </g>
        ))}
        {[244, 290].map((y) => (
          <g key={y}>
            <rect x="442" y={y} width="24" height="30" rx="4" fill={p.paper} />
            <rect
              x="478"
              y={y}
              width="24"
              height="30"
              rx="4"
              fill={y === 244 ? p.paper : p.tomatoLight}
            />
          </g>
        ))}
        <rect x="380" y="340" width="28" height="44" rx="3" fill={p.ink} />
        <rect x="476" y="336" width="28" height="48" rx="3" fill={p.cobalt} />

        <path
          d="M167 262C210 150 330 150 396 240"
          fill="none"
          stroke={p.cobalt}
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="1 12"
        />
        <TimeCoin x={214} y={190} />
        <TimeCoin x={338} y={180} />

        <g>
          <rect x="542" y="300" width="10" height="84" rx="5" fill={p.ink} />
          <circle cx="547" cy="282" r="32" fill={p.leaf} />
          <circle cx="528" cy="302" r="20" fill={p.leaf} />
          <circle cx="566" cy="302" r="18" fill={p.leafDeep} />
        </g>

        <rect x="0" y="384" width="600" height="86" fill={p.haze} />
        <rect x="0" y="384" width="600" height="6" fill={p.sky} />
        <rect x="372" y="384" width="44" height="8" fill={p.sky} />
        <rect x="0" y="452" width="600" height="18" fill={p.ink} />

        <Person
          x={250}
          y={350}
          skin={p.skin[0]}
          shirt={p.leafDeep}
          hair={p.ink}
          hairStyle="curly"
        />
        <Person
          x={374}
          y={344}
          skin={p.skin[2]}
          shirt={p.tomato}
          hair={p.cobalt}
          hairStyle="bun"
        />
        <Person
          x={142}
          y={396}
          skin={p.skin[1]}
          shirt={p.cobalt}
          hair={p.ink}
          hairStyle="cap"
          scale={0.66}
        />

        <g transform="translate(312 408)">
          <path d="M-28 -6h56v14c0 16-12 26-28 26s-28-10-28-26Z" fill={p.ink} />
          <rect
            x="-32"
            y="-12"
            width="64"
            height="9"
            rx="4.5"
            fill={p.cobalt}
          />
          <rect x="-5" y="-18" width="10" height="7" rx="3" fill={p.cobalt} />
          <circle cx="-34" cy="-6" r="7" fill={p.skin[0]} />
          <circle cx="34" cy="-6" r="7" fill={p.skin[2]} />
          <g
            stroke={p.paper}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            className="drift"
          >
            <path d="M-12-28c-6-8 6-12 0-20" />
            <path d="M2-30c-6-8 6-12 0-20" />
            <path d="M16-28c-6-8 6-12 0-20" />
          </g>
        </g>
      </g>
    </svg>
  );
}

function Backdrop({ fill }: { fill: string }) {
  return (
    <path
      d="M80 10c40 0 70 26 70 66s-28 74-72 74S8 120 10 78 40 10 80 10Z"
      fill={fill}
    />
  );
}

/** Story: the grocery run — a tote and a long receipt. */
export function GroceryArt({ className, title }: ArtProps) {
  const p = palette;
  return (
    <svg viewBox="0 0 160 160" className={className} {...a11y(title)}>
      <Backdrop fill={p.sunLight} />
      <rect
        x="44"
        y="40"
        width="34"
        height="24"
        rx="12"
        fill={p.sun}
        transform="rotate(-18 61 52)"
      />
      <path
        d="M52 50l6-6M60 54l6-6"
        stroke={p.tomatoDeep}
        strokeWidth="3"
        strokeLinecap="round"
        transform="rotate(-18 61 52)"
      />
      <path d="M86 58c-6-14 2-26 14-28-2 12-6 20-14 28Z" fill={p.leaf} />
      <path d="M90 60c4-14 16-20 26-16-6 10-14 15-26 16Z" fill={p.leafDeep} />
      <path
        d="M58 60c0-22 44-22 44 0"
        stroke={p.cobaltDeep}
        strokeWidth="6"
        fill="none"
      />
      <path d="M36 62h88l-8 70H44Z" fill={p.cobalt} />
      <path d="M80 92c-6-6-14 0-8 7l8 7 8-7c6-7-2-13-8-7Z" fill={p.paper} />
      <path d="M108 80h30v66l-5-4-5 4-5-4-5 4-5-4-5 4Z" fill={p.paper} />
      <g stroke={p.ink} strokeWidth="2.5" strokeLinecap="round" opacity=".55">
        <path d="M114 90h18M114 98h12M114 106h18M114 114h10M114 122h18" />
      </g>
      <path
        d="M114 132h18"
        stroke={p.tomato}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Story: the check-engine light. */
export function CarArt({ className, title }: ArtProps) {
  const p = palette;
  return (
    <svg viewBox="0 0 160 160" className={className} {...a11y(title)}>
      <Backdrop fill={p.sky} />
      <path
        d="M18 108V94c0-7 5-12 12-12h14l16-20h40l18 20h14c7 0 12 5 12 12v14Z"
        fill={p.tomato}
      />
      <path d="M64 68h18v14H52Zm24 0h12l12 14H88Z" fill={p.sky} />
      <rect x="128" y="88" width="10" height="6" rx="3" fill={p.sun} />
      <circle cx="50" cy="110" r="14" fill={p.ink} />
      <circle cx="50" cy="110" r="5" fill={p.sky} />
      <circle cx="112" cy="110" r="14" fill={p.ink} />
      <circle cx="112" cy="110" r="5" fill={p.sky} />
      <path
        d="M26 132h108"
        stroke={p.cobalt}
        strokeWidth="4"
        strokeLinecap="round"
        opacity=".35"
      />
      <g transform="rotate(40 118 40)">
        <rect x="113" y="30" width="10" height="40" rx="5" fill={p.cobalt} />
        <circle cx="118" cy="26" r="12" fill={p.cobalt} />
        <rect x="113.5" y="10" width="9" height="15" rx="2" fill={p.sky} />
      </g>
    </svg>
  );
}

/** Story: trading afternoons of childcare. */
export function KidsArt({ className, title }: ArtProps) {
  const p = palette;
  return (
    <svg viewBox="0 0 160 160" className={className} {...a11y(title)}>
      <Backdrop fill={p.blush} />
      <rect x="26" y="98" width="30" height="30" rx="5" fill={p.cobalt} />
      <rect x="58" y="98" width="30" height="30" rx="5" fill={p.sun} />
      <rect x="42" y="66" width="30" height="30" rx="5" fill={p.tomato} />
      <path
        d="M41 105v16m-6-8h12"
        stroke={p.paper}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="73" cy="113" r="6" fill={p.paper} />
      <path d="M51 88l6-14 6 14Z" fill={p.paper} />
      <Person
        x={116}
        y={64}
        skin={p.skin[3]}
        shirt={p.leaf}
        hair={p.ink}
        hairStyle="curly"
        scale={0.56}
      />
    </svg>
  );
}

/** Story: setting up a phone, a video call home. */
export function PhoneArt({ className, title }: ArtProps) {
  const p = palette;
  return (
    <svg viewBox="0 0 160 160" className={className} {...a11y(title)}>
      <Backdrop fill={p.mint} />
      <rect x="48" y="22" width="64" height="116" rx="12" fill={p.ink} />
      <rect x="54" y="32" width="52" height="92" rx="6" fill={p.sky} />
      <circle cx="80" cy="64" r="14" fill={p.skin[1]} />
      <path d="M66 60c0-12 28-12 28 0-6-4-22-4-28 0Z" fill={p.paper} />
      <path d="M58 124c0-26 44-26 44 0Z" fill={p.tomato} />
      <rect
        x="88"
        y="94"
        width="14"
        height="20"
        rx="3"
        fill={p.paper}
        stroke={p.cobalt}
        strokeWidth="2"
      />
      <rect
        x="72"
        y="128"
        width="16"
        height="4"
        rx="2"
        fill={p.paper}
        opacity=".6"
      />
      <path d="M122 40c-6-6-14 0-8 7l8 7 8-7c6-7-2-13-8-7Z" fill={p.tomato} />
      <path d="M30 96c-4-4-9 0-5 4l5 5 5-5c4-4-1-8-5-4Z" fill={p.cobalt} />
    </svg>
  );
}

/** Step: post what you can share on the community board. */
export function OfferCardArt({ className, title }: ArtProps) {
  const p = palette;
  return (
    <svg viewBox="0 0 160 160" className={className} {...a11y(title)}>
      <Backdrop fill={p.sunLight} />
      <g transform="rotate(-6 80 84)">
        <rect x="34" y="40" width="92" height="88" rx="8" fill="#ffffff" />
        <rect x="34" y="40" width="92" height="22" rx="8" fill={p.leafDeep} />
        <rect x="34" y="54" width="92" height="8" fill={p.leafDeep} />
        <path
          d="M48 80h52M48 94h38M48 108h46"
          stroke={p.haze}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path d="M108 96c-5-5-12 0-7 6l7 6 7-6c5-6-2-11-7-6Z" fill={p.tomato} />
      </g>
      <circle cx="78" cy="40" r="7" fill={p.tomato} />
      <circle cx="76" cy="38" r="2.5" fill={p.blush} />
    </svg>
  );
}

/** Step: ask for what you need. */
export function AskCardArt({ className, title }: ArtProps) {
  const p = palette;
  return (
    <svg viewBox="0 0 160 160" className={className} {...a11y(title)}>
      <Backdrop fill={p.sky} />
      <path
        d="M30 50c0-12 8-20 20-20h60c12 0 20 8 20 20v36c0 12-8 20-20 20H72l-24 20v-20c-10-2-18-10-18-20Z"
        fill="#ffffff"
      />
      <path
        d="M70 58c0-8 5-13 11-13s11 5 11 12c0 9-11 10-11 18"
        stroke={p.tomato}
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="81" cy="89" r="4.5" fill={p.tomato} />
      <circle cx="128" cy="118" r="14" fill={p.sun} />
      <path
        d="M128 110v16M120 118h16"
        stroke={p.ink}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Step: meet up and help — two mugs. */
export function MugsArt({ className, title }: ArtProps) {
  const p = palette;
  return (
    <svg viewBox="0 0 160 160" className={className} {...a11y(title)}>
      <Backdrop fill={p.blush} />
      <g
        stroke={p.paper}
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        className="drift"
      >
        <path d="M56 46c-6-8 6-11 0-20" />
        <path d="M104 46c-6-8 6-11 0-20" />
      </g>
      <g transform="rotate(-8 56 92)">
        <path
          d="M30 60h50v42c0 14-10 22-25 22s-25-8-25-22Z"
          fill={p.leafDeep}
        />
        <path
          d="M30 70c-14 0-14 26 0 26"
          stroke={p.leafDeep}
          strokeWidth="7"
          fill="none"
        />
        <path
          d="M44 84h22"
          stroke={p.sky}
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      <g transform="rotate(8 104 92)">
        <path d="M80 60h50v42c0 14-10 22-25 22s-25-8-25-22Z" fill={p.tomato} />
        <path
          d="M130 70c14 0 14 26 0 26"
          stroke={p.tomato}
          strokeWidth="7"
          fill="none"
        />
        <path d="M98 82c-4-4-10 0-6 5l6 5 6-5c4-5-2-9-6-5Z" fill={p.blush} />
      </g>
      <g stroke={p.sun} strokeWidth="4" strokeLinecap="round">
        <path d="M80 44v-10M68 48l-5-8M92 48l5-8" />
      </g>
    </svg>
  );
}

/** Step: the hour comes back around. */
export function ReturnClockArt({ className, title }: ArtProps) {
  const p = palette;
  return (
    <svg viewBox="0 0 160 160" className={className} {...a11y(title)}>
      <Backdrop fill={p.mint} />
      <circle cx="80" cy="82" r="38" fill="#ffffff" />
      <g fill={p.haze}>
        <circle cx="80" cy="52" r="3" />
        <circle cx="110" cy="82" r="3" />
        <circle cx="80" cy="112" r="3" />
        <circle cx="50" cy="82" r="3" />
      </g>
      <path
        d="M80 64v18l12 9"
        stroke={p.ink}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M128 70a50 50 0 0 0-84-28"
        stroke={p.tomato}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M40 30l4 14 14-4"
        stroke={p.tomato}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M32 96a50 50 0 0 0 84 28"
        stroke={p.leafDeep}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M120 136l-4-14-14 4"
        stroke={p.leafDeep}
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The community fund: a jar of shared hours. */
export function FundJarArt({ className, title }: ArtProps) {
  const p = palette;
  return (
    <svg viewBox="0 0 160 160" className={className} {...a11y(title)}>
      <Backdrop fill={p.sunLight} />
      <rect x="52" y="26" width="56" height="14" rx="5" fill={p.tomato} />
      <path
        d="M50 44h60c8 0 14 6 14 14v56c0 10-8 18-18 18H54c-10 0-18-8-18-18V58c0-8 6-14 14-14Z"
        fill="#ffffff"
        opacity=".92"
      />
      <TimeCoin x={62} y={112} r={13} />
      <TimeCoin x={96} y={114} r={13} />
      <TimeCoin x={80} y={92} r={13} />
      <path d="M68 74c-5-5-12 0-7 6l7 6 7-6c5-6-2-11-7-6Z" fill={p.tomato} />
      <path d="M100 70c-4-4-9 0-5 4l5 5 5-5c4-4-1-8-5-4Z" fill={p.blush} />
      <path
        d="M44 62v34"
        stroke={p.paper}
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Community projects: a shared garden bed. */
export function GardenArt({ className, title }: ArtProps) {
  const p = palette;
  return (
    <svg viewBox="0 0 160 160" className={className} {...a11y(title)}>
      <Backdrop fill={p.sky} />
      <rect x="24" y="100" width="112" height="28" rx="6" fill={p.tomato} />
      <path d="M24 112h112" stroke={p.tomatoLight} strokeWidth="3" />
      <g strokeLinecap="round" fill="none" stroke={p.leafDeep} strokeWidth="4">
        <path d="M48 100V76M80 100V64M112 100V80" />
      </g>
      <path d="M48 84c-10 0-14-6-14-14 10 0 14 6 14 14Z" fill={p.leaf} />
      <path d="M48 80c0-8 5-13 13-13 0 8-5 13-13 13Z" fill={p.leafDeep} />
      <path d="M80 72c-12 0-17-7-17-17 12 0 17 7 17 17Z" fill={p.leafDeep} />
      <path d="M80 68c0-10 6-16 16-16 0 10-6 16-16 16Z" fill={p.leaf} />
      <circle cx="112" cy="72" r="9" fill={p.sun} />
      <circle cx="112" cy="72" r="3.5" fill={p.tomato} />
      <path d="M112 90c6 0 10-4 10-10-6 0-10 4-10 10Z" fill={p.leaf} />
      <path
        d="M128 40l-14 8m6-18l-4 10m18 4h-10"
        stroke={p.sun}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** A circle of neighbors with hands joined, for the closing invitation. */
export function CircleArt({ className, title }: ArtProps) {
  const p = palette;
  const people = [
    {
      a: -90,
      skin: p.skin[2],
      shirt: p.tomato,
      hair: p.cobalt,
      style: "bun" as const,
    },
    {
      a: -18,
      skin: p.skin[0],
      shirt: p.leafDeep,
      hair: p.ink,
      style: "curly" as const,
    },
    {
      a: 54,
      skin: p.skin[1],
      shirt: p.sun,
      hair: p.ink,
      style: "short" as const,
    },
    {
      a: 126,
      skin: p.skin[3],
      shirt: p.cobalt,
      hair: p.ink,
      style: "long" as const,
    },
    {
      a: 198,
      skin: p.skin[2],
      shirt: p.leaf,
      hair: p.tomato,
      style: "cap" as const,
    },
  ];
  return (
    <svg viewBox="0 0 320 320" className={className} {...a11y(title)}>
      <circle cx="160" cy="160" r="150" fill={p.paper} opacity=".5" />
      <circle
        cx="160"
        cy="160"
        r="96"
        fill="none"
        stroke={p.sun}
        strokeWidth="10"
        strokeDasharray="2 20"
        strokeLinecap="round"
      />
      <circle cx="160" cy="160" r="44" fill={p.sun} />
      <path
        d="M160 176c-12-12-30 0-18 14l18 16 18-16c12-14-6-26-18-14Z"
        transform="translate(0 -28)"
        fill={p.paper}
      />
      {people.map(({ a, skin, shirt, hair, style }) => {
        const r = (a * Math.PI) / 180;
        const x = 160 + Math.cos(r) * 112;
        const y = 160 + Math.sin(r) * 112 - 36;
        return (
          <Person
            key={a}
            x={x}
            y={y}
            skin={skin}
            shirt={shirt}
            hair={hair}
            hairStyle={style}
            scale={0.6}
          />
        );
      })}
    </svg>
  );
}

/** Small four-point star used in the contribution constellation. */
export function StarGlyph({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 2c.8 5.2 4.8 9.2 10 10-5.2.8-9.2 4.8-10 10-.8-5.2-4.8-9.2-10-10 5.2-.8 9.2-4.8 10-10Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function PlusGlyph({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
