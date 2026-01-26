import { INITIAL_WINDOW_Z_INDEX, WINDOW_CONFIG } from "@/constants";
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import type { Window } from "../constants/types";

const WindowContext = createContext<WindowContextType | null>(null);

type WindowContextType = {
  windows: Record<string, Window>;
  nextZIndex: number;
  openWindow: (windowId: string, data?: any) => void;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string, data?: any) => void;
  setPosition: (windowId: string, position: { x: number; y: number }) => void;
};

const WindowProvider = ({ children }: { children: React.ReactNode }) => {
  const [windowsConfig, setWindowsConfig] = useState<
    Omit<
      WindowContextType,
      | "openWindow"
      | "closeWindow"
      | "focusWindow"
      | "setPosition"
      | "setDimensions"
    >
  >({
    windows: WINDOW_CONFIG,
    nextZIndex: INITIAL_WINDOW_Z_INDEX,
  });

  const openWindow = useCallback((windowId: string) => {
    const { isOpen } = windowsConfig.windows[windowId] || {};
    if (isOpen) {
      focusWindow(windowId);
    } else {
      setWindowsConfig((prev) => ({
        ...prev,
        windows: {
          ...prev.windows,
          [windowId]: {
            ...prev.windows[windowId],
            isOpen: true,
            zIndex: prev.nextZIndex,
          },
        },
        nextZIndex: prev.nextZIndex + 1,
      }));
    }
  }, []);

  const closeWindow = useCallback((windowId: string) => {
    setWindowsConfig((prev) => {
      const { isOpen } = prev.windows[windowId] || {};
      if (!isOpen) return prev;

      return {
        ...prev,
        windows: {
          ...prev.windows,
          [windowId]: {
            ...prev.windows[windowId],
            isOpen: false,
            zIndex: INITIAL_WINDOW_Z_INDEX,
          },
        },
      };
    });
  }, []);

  const focusWindow = useCallback((windowId: string) => {
    setWindowsConfig((prev) => {
      const { isOpen } = prev.windows[windowId] || {};
      if (!isOpen) return prev;

      return {
        ...prev,
        windows: {
          ...prev.windows,
          [windowId]: {
            ...prev.windows[windowId],
            zIndex: prev.nextZIndex,
          },
        },
        nextZIndex: prev.nextZIndex + 1,
      };
    });
  }, []);

  const setPosition = useCallback(
    (windowId: string, position: { x: number; y: number }) => {
      setWindowsConfig((prev) => {
        const { isOpen } = prev.windows[windowId] || {};
        if (!isOpen) return prev;

        return {
          ...prev,
          windows: {
            ...prev.windows,
            [windowId]: {
              ...prev.windows[windowId],
              data: {
                ...prev.windows[windowId].data,
                position,
              },
            },
          },
        };
      });
    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      windows: windowsConfig.windows,
      nextZIndex: windowsConfig.nextZIndex,
      openWindow,
      closeWindow,
      focusWindow,
      setPosition,
    }),
    [
      windowsConfig.windows,
      windowsConfig.nextZIndex,
      openWindow,
      closeWindow,
      focusWindow,
      setPosition,
    ],
  );

  return (
    <WindowContext.Provider value={contextValue}>
      {children}
    </WindowContext.Provider>
  );
};

const useWindow = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error("useWindow must be used within a WindowProvider");
  }
  return context;
};

export { useWindow, WindowProvider };
