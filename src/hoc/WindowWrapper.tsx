import { useWindow } from "@/context/WindowContext";
import { useLayoutEffect, useRef, type PointerEvent } from "react";

const WindowWrapper = (Component: React.ComponentType, windowId: string) => {
  const Wrapped = (props: any) => {
    const { windows, focusWindow } = useWindow();
    const { isOpen, zIndex, position } = windows[windowId];
    const ref = useRef<HTMLDivElement>(null);

    const posRef = useRef({ x: position?.x || 0, y: position?.y || 0 });
    const startRef = useRef({ x: 0, y: 0 });
    const draggingRef = useRef(false);

    const pendingRef = useRef({ dx: 0, dy: 0 });
    const rafRef = useRef<number | null>(null);

    const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return;

      pendingRef.current.dx = e.clientX - startRef.current.x;
      pendingRef.current.dy = e.clientY - startRef.current.y;

      if (rafRef.current === null) {
        rafRef.current = requestAnimationFrame(() => {
          const { dx, dy } = pendingRef.current;

          ref.current!.style.transform = `translate(
                ${posRef.current.x + dx}px,
                ${posRef.current.y + dy}px
            )`;

          rafRef.current = null;
        });
      }
    };

    const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
      draggingRef.current = false;

      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;

      posRef.current.x += dx;
      posRef.current.y += dy;

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      ref.current?.releasePointerCapture(e.pointerId);
    };

    const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
      focusWindow(windowId);
      draggingRef.current = true;

      startRef.current = {
        x: e.clientX,
        y: e.clientY,
      };

      ref.current?.setPointerCapture(e.pointerId);
    };

    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;
      el.style.display = isOpen ? "block" : "none";
      if (position) {
        el.style.transform = `translate(${position.x}px, ${position.y}px)`;
      }
    }, [isOpen, position]);

    return (
      <section
        id={windowId}
        className="absolute"
        ref={ref}
        style={{ zIndex }}
        onPointerUp={handlePointerUp}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <Component {...props} />
      </section>
    );
  };

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`;

  return Wrapped;
};

export default WindowWrapper;
