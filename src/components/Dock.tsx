import { dockItems } from "../constants";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useWindow } from "../context/WindowContext";
import { memo } from "react";

const Dock = () => {
  const { openWindow } = useWindow();
  return (
    <div className="flex fixed bottom-2 left-1/2 translate-x-[-50%] bg-white/70 rounded-2xl p-1 z-top">
      {dockItems.map((item) => {
        return (
          <div key={item.id}>
            <Tooltip>
              <TooltipTrigger>
                <img
                  src={`images/${item.windowId}.png`}
                  alt={item.title}
                  loading="lazy"
                  className="w-16 h-16 cursor-pointer hover:scale-120 transition-all duration-50"
                  onClick={() => openWindow(item.windowId)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.title}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      })}
    </div>
  );
};

export default memo(Dock);
