"use client";

const COLORS = ["#e6237a", "#f7931e", "#ffc20e", "#7cb342", "#1fa99a", "#29abe2", "#3f6fc4"];

/** Dependency-free confetti burst: 60 absolutely-positioned bits with CSS keyframes. */
export function burstConfetti(origin?: HTMLElement | null) {
  if (typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const r = origin?.getBoundingClientRect();
  const x = r ? r.left + r.width / 2 : window.innerWidth / 2;
  const y = r ? r.top + r.height / 3 : window.innerHeight / 3;
  const host = document.createElement("div");
  host.setAttribute("aria-hidden", "true");
  host.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:100;overflow:hidden";
  for (let i = 0; i < 60; i++) {
    const b = document.createElement("span");
    const angle = Math.random() * Math.PI * 2;
    const dist = 120 + Math.random() * 260;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist - 120;
    const size = 6 + Math.random() * 8;
    const round = Math.random() > 0.5;
    b.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${size}px;height:${round ? size : size * 0.45}px;background:${COLORS[i % COLORS.length]};border-radius:${round ? "50%" : "2px"}`;
    b.animate(
      [
        { transform: "translate(0,0) rotate(0)", opacity: 1 },
        { transform: `translate(${dx}px,${dy}px) rotate(${Math.random() * 720}deg)`, opacity: 1, offset: 0.6 },
        { transform: `translate(${dx * 1.1}px,${dy + 260}px) rotate(${Math.random() * 1080}deg)`, opacity: 0 },
      ],
      { duration: 1400 + Math.random() * 700, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" },
    );
    host.appendChild(b);
  }
  document.body.appendChild(host);
  window.setTimeout(() => host.remove(), 2400);
}
