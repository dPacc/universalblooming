/**
 * A template re-mounts on every navigation (unlike layout), so its wrapper
 * replays a soft fade-and-rise for each new page. Pure CSS, no JS cost.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
