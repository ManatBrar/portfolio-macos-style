import { useWindow } from "@/context/WindowContext";
import { useState } from "react";

type Props = {
  windowId: string;
  parentRef: React.RefObject<HTMLDivElement>;
  positionRef: React.MutableRefObject<{ x: number; y: number }>;
};

const WindowControls = ({ windowId, parentRef, positionRef }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const { closeWindow, setPosition, setFullscreen, setDimensions, windows } =
    useWindow();
  const currentWindow = windows[windowId] || {};

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    closeWindow(windowId);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  const handleFullscreen = (e: React.PointerEvent) => {
    e.stopPropagation();

    parentRef.current!.style.transition =
      "width 0.3s ease-in-out, height 0.3s ease-in-out, transform 0.3s ease-in-out";

    setTimeout(() => {
      if (parentRef.current) {
        parentRef.current.style.transition = "";
      }
    }, 300);

    if (currentWindow?.data?.isFullscreen) {
      const { position, width, height } = currentWindow.data;
      if (!position) return;

      parentRef.current!.style.width = `${width}px`;
      parentRef.current!.style.height = `${height}px`;
      parentRef.current!.style.transform = `translate(${position.x}px, ${position.y}px)`;

      positionRef.current.x = position.x;
      positionRef.current.y = position.y;

      setFullscreen(windowId, false);
    } else {
      setPosition(windowId, {
        x: positionRef.current.x,
        y: positionRef.current.y,
      });
      setDimensions(windowId, {
        width: parentRef.current!.offsetWidth,
        height: parentRef.current!.offsetHeight,
      });
      setFullscreen(windowId, true);

      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      const windowTop = 0;
      const windowLeft = 0;
      const navBarHeight = 40;

      parentRef.current!.style.width = `${windowWidth}px`;
      parentRef.current!.style.height = `${windowHeight - navBarHeight}px`;
      parentRef.current!.style.transform = `translate(${windowLeft}px, ${windowTop}px)`;

      positionRef.current.x = windowLeft;
      positionRef.current.y = windowTop;
    }
  };

  return (
    <div
      className="flex items-center gap-2"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div
        className="w-3.5 h-3.5 rounded-full bg-red-400 flex-center"
        onPointerDown={handleClose}
      >
        {isHovered ? (
          <img src="icons/cross.svg" alt="close" className="" />
        ) : null}
      </div>
      <div
        className="w-3.5 h-3.5 rounded-full bg-yellow-400 flex-center"
        onPointerDown={handleClose}
      >
        {isHovered ? (
          <img src="icons/minus.svg" alt="minimize" className="" />
        ) : null}
      </div>
      <div
        className="w-3.5 h-3.5 rounded-full bg-green-500 flex-center"
        onPointerDown={handleFullscreen}
      >
        {isHovered ? (
          currentWindow.data.isFullscreen ? (
            <img src="icons/collapse.svg" alt="resize" className="rotate-135" />
          ) : (
            <img src="icons/resize.svg" alt="resize" className="rotate-135" />
          )
        ) : null}
      </div>
    </div>
  );
};

export default WindowControls;
