import { useWindow } from "@/context/WindowContext";
import { useLayoutEffect, useRef, type PointerEvent } from "react";

const WindowWrapper = (Component: React.ComponentType, windowId: string) => {
  const Wrapped = (props: any) => {
    const { windows, focusWindow, setPosition } = useWindow();
    const { isOpen, zIndex, data } = windows[windowId];
    const { position, width, height } = data;
    const ref = useRef<HTMLDivElement>(null);

    const posRef = useRef({ x: position?.x || 0, y: position?.y || 0 });
    const startRef = useRef({ x: 0, y: 0 });
    const draggingRef = useRef(false);

    const pendingRef = useRef({ dx: 0, dy: 0 });
    const rafRef = useRef<number | null>(null);

    const resizingRef = useRef<{
      x: number;
      y: number;
      width: number;
      height: number;
      posX: number;
      posY: number;
    } | null>(null);

    const resizeData: Record<
      string,
      { className: string; cursorClass: string }
    > = {
      top: {
        className: "top-0 left-0 w-full h-1",
        cursorClass: "cursor-ns-resize",
      },
      bottom: {
        className: "bottom-0 left-0 w-full h-1",
        cursorClass: "cursor-ns-resize",
      },
      left: {
        className: "top-0 left-0 w-1 h-full",
        cursorClass: "cursor-ew-resize",
      },
      right: {
        className: "top-0 right-0 w-1 h-full",
        cursorClass: "cursor-ew-resize",
      },
      topLeft: {
        className: "top-0 left-0 w-2 h-2",
        cursorClass: "cursor-nwse-resize",
      },
      topRight: {
        className: "top-0 right-0 w-2 h-2",
        cursorClass: "cursor-nesw-resize",
      },
      bottomLeft: {
        className: "bottom-0 left-0 w-2 h-2",
        cursorClass: "cursor-nesw-resize",
      },
      bottomRight: {
        className: "bottom-0 right-0 w-2 h-2",
        cursorClass: "cursor-nwse-resize",
      },
    };

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
      e.stopPropagation();
      if (!draggingRef.current) return;

      draggingRef.current = false;

      const dx = e.clientX - startRef.current.x;
      const dy = e.clientY - startRef.current.y;

      posRef.current.x += dx;
      posRef.current.y += dy;

      setPosition(windowId, posRef.current);

      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      ref.current?.releasePointerCapture(e.pointerId);
    };

    const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
      e.stopPropagation();
      focusWindow(windowId);
      draggingRef.current = true;

      startRef.current = {
        x: e.clientX,
        y: e.clientY,
      };

      ref.current?.setPointerCapture(e.pointerId);
    };

    const handleResize = (
      e: PointerEvent<HTMLDivElement>,
      direction:
        | "top"
        | "bottom"
        | "left"
        | "right"
        | "topLeft"
        | "topRight"
        | "bottomLeft"
        | "bottomRight",
    ) => {
      e.stopPropagation();
      if (!resizingRef.current) return;
      const { x, y, width, height, posX, posY } = resizingRef.current;
      const dx = e.clientX - x;
      const dy = e.clientY - y;
      const { style } = ref.current!;

      let newWidth = width;
      let newHeight = height;
      let newX = posX;
      let newY = posY;

      switch (direction) {
        case "top":
          newHeight = height - dy;
          newY = posY + dy;
          break;
        case "bottom":
          newHeight = height + dy;
          break;
        case "left":
          newWidth = width - dx;
          newX = posX + dx;
          break;
        case "right":
          newWidth = width + dx;
          break;
        case "topLeft":
          newWidth = width - dx;
          newHeight = height - dy;
          newX = posX + dx;
          newY = posY + dy;
          break;
        case "topRight":
          newWidth = width + dx;
          newHeight = height - dy;
          newY = posY + dy;
          break;
        case "bottomLeft":
          newWidth = width - dx;
          newHeight = height + dy;
          newX = posX + dx;
          break;
        case "bottomRight":
          newWidth = width + dx;
          newHeight = height + dy;
          break;
      }

      if (newWidth > 200) style.width = `${newWidth}px`;
      if (newHeight > 200) style.height = `${newHeight}px`;
      style.transform = `translate(${newX}px, ${newY}px)`;

      posRef.current = { x: newX, y: newY };
    };

    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;
      el.style.display = isOpen ? "block" : "none";
    }, [isOpen]);

    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;
      if (width) {
        el.style.width = `${width}px`;
      }
      if (height) {
        el.style.height = `${height}px`;
      }
    }, []);

    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;
      if (position) {
        el.style.transform = `translate(${position.x}px, ${position.y}px)`;
      }
    }, []);

    return (
      <section
        id={windowId}
        className="absolute bg-white rounded-3xl shadow-s"
        ref={ref}
        style={{
          zIndex,
        }}
        onPointerUp={handlePointerUp}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        {Object.entries(resizeData).map(
          ([direction, { className, cursorClass }]) => (
            <div
              key={direction}
              className={`absolute ${className} bg-transparent ${cursorClass}`}
              onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!ref.current) return;
                focusWindow(windowId);
                const rect = ref.current.getBoundingClientRect();

                resizingRef.current = {
                  x: e.clientX,
                  y: e.clientY,
                  width: rect.width,
                  height: rect.height,
                  posX: posRef.current.x,
                  posY: posRef.current.y,
                };

                (e.target as Element).setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => handleResize(e, direction as any)}
              onPointerUp={(e) => {
                e.stopPropagation();
                if (resizingRef.current) {
                  setPosition(windowId, posRef.current);
                }
                resizingRef.current = null;
                (e.target as Element).releasePointerCapture(e.pointerId);
              }}
            ></div>
          ),
        )}
        <Component {...props} parentRef={ref} positionRef={posRef} />
      </section>
    );
  };

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`;

  return Wrapped;
};

export default WindowWrapper;
