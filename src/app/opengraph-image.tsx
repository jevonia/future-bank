import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";
import { ImageResponse } from "next/og";
import { HeroScene, LogoMark, palette } from "@/components/illustrations";

// The image renderer only accepts intrinsic elements inside <svg>, so expand
// the illustration's helper components (houses, people) before rendering.
function flatten(node: ReactNode): ReactNode {
  if (!isValidElement(node)) return node;
  const element = node as ReactElement<{ children?: ReactNode }>;
  if (typeof element.type === "function") {
    const render = element.type as (props: object) => ReactNode;
    return flatten(render(element.props));
  }
  const children = Children.map(element.props.children, flatten);
  if ((element.type as unknown) === Fragment) return <>{children}</>;
  return cloneElement(element, undefined, children);
}

export const alt =
  "New Future Bank. Drawing of neighbors sharing soup on a city block.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The site uses system fonts (Georgia and Verdana), which can't be bundled
// here, so load close open-licensed matches as TTF: Gelasio is drawn to
// Georgia's metrics. If they can't be fetched while the image is generated,
// the renderer's default font is used instead.
async function loadFont(query: string) {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=${query}`,
    ).then((response) => response.text());
    const url = css.match(
      /src: url\((.+?)\) format\('(?:truetype|opentype)'\)/,
    )?.[1];
    if (!url) return null;
    return await fetch(url).then((response) => response.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpenGraphImage() {
  const [display, body] = await Promise.all([
    loadFont("Gelasio:wght@700"),
    loadFont("Noto+Sans:wght@400"),
  ]);
  const fonts = [
    display && { name: "Gelasio", data: display, weight: 700 as const },
    body && { name: "Noto Sans", data: body, weight: 400 as const },
  ].filter((font) => !!font);
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        background: palette.paper,
        padding: "0 48px 0 72px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", width: 540 }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <LogoMark size={64} />
          <div
            style={{
              marginLeft: 18,
              fontFamily: display ? "Gelasio" : undefined,
              fontSize: 34,
              fontWeight: 700,
              color: palette.ink,
            }}
          >
            New Future Bank
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 36,
            fontFamily: display ? "Gelasio" : undefined,
            fontSize: 60,
            fontWeight: 700,
            lineHeight: 1.02,

            color: palette.ink,
          }}
        >
          <div>Everything costs more.</div>
          <div style={{ color: palette.cobalt }}>We have each other.</div>
        </div>
        <div
          style={{
            marginTop: 28,
            fontFamily: body ? "Noto Sans" : undefined,
            fontSize: 28,
            lineHeight: 1.4,
            color: "#475069",
          }}
        >
          A neighborhood time bank. Trade an hour of what you’re good at for an
          hour of what you need. No money, ever.
        </div>
      </div>
      <div style={{ display: "flex", width: 560, marginLeft: 0 }}>
        {flatten(<HeroScene width={560} />)}
      </div>
    </div>,
    {
      ...size,
      fonts: fonts.length ? fonts : undefined,
    },
  );
}
