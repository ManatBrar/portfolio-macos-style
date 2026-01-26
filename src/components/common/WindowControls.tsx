import { useWindow } from "@/context/WindowContext";
import { useState } from "react";

type Props = {
  windowId: string;
  parentRef: React.RefObject<HTMLDivElement>;
  positionRef: React.MutableRefObject<{ x: number; y: number }>;
};

const WindowControls = ({ windowId, parentRef, positionRef }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const { closeWindow } = useWindow();
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
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    const windowTop = 0;
    const windowLeft = 0;
    const navBarHeight = 40;

    parentRef.current!.style.transform = `translate(${windowLeft}px, ${windowTop}px)`;
    parentRef.current!.style.width = `${windowWidth}px`;
    parentRef.current!.style.height = `${windowHeight - navBarHeight}px`;

    positionRef.current.x = windowLeft;
    positionRef.current.y = windowTop;
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
          <img src="/icons/cross.svg" alt="close" className="" />
        ) : null}
      </div>
      <div
        className="w-3.5 h-3.5 rounded-full bg-yellow-400 flex-center"
        onPointerDown={handleClose}
      >
        {isHovered ? (
          <img src="/icons/minus.svg" alt="minimize" className="" />
        ) : null}
      </div>
      <div
        className="w-3.5 h-3.5 rounded-full bg-green-500 flex-center"
        onPointerDown={handleFullscreen}
      >
        {isHovered ? (
          <img src="/icons/resize.svg" alt="resize" className="rotate-45" />
        ) : null}
      </div>
    </div>
  );
};

export default WindowControls;
