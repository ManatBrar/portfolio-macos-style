import { INITIAL_WINDOW_Z_INDEX, WINDOW_CONFIG } from "@/constants";
import { createContext, useContext, useState } from "react";
import type { Window } from '../constants/types';

const WindowContext = createContext<WindowContextType | null>(null)

type WindowContextType = {
    windows: Record<string, Window>
    nextZIndex: number,
    openWindow: (windowId: string, data?: any) => void,
    closeWindow: (windowId: string) => void,
    focusWindow: (windowId: string, data?: any) => void,
}

const WindowProvider = ({ children }: { children: React.ReactNode }) => {
    const [windowsConfig, setWindowsConfig] = useState<Omit<WindowContextType, 'openWindow' | 'closeWindow' | 'focusWindow'>>({
        windows: WINDOW_CONFIG,
        nextZIndex: INITIAL_WINDOW_Z_INDEX,
    })

    const openWindow = (windowId: string, data?: any) => {
        const { isOpen, data: windowData } = windowsConfig?.windows[windowId] || {}
        if (isOpen) {
            focusWindow(windowId)
        } else {
            setWindowsConfig(prev => ({
                ...prev,
                windows: {
                    ...prev.windows,
                    [windowId]: {
                        isOpen: true,
                        zIndex: prev.nextZIndex,
                        data: data || windowData,
                    }
                },
                nextZIndex: prev.nextZIndex + 1
            }))
        }
    }

    const closeWindow = (windowId: string) => {
        const { isOpen } = windowsConfig?.windows[windowId] || {}
        if (isOpen) {
            setWindowsConfig(prev => ({
                ...prev,
                windows: {
                    ...prev.windows,
                    [windowId]: {
                        ...prev.windows[windowId],
                        isOpen: false,
                        zIndex: INITIAL_WINDOW_Z_INDEX,
                    }
                }
            }))
        }
    }

    const focusWindow = (windowId: string) => {
        const { isOpen } = windowsConfig?.windows[windowId] || {}
        if (isOpen) {
            setWindowsConfig(prev => ({
                ...prev,
                windows: {
                    ...prev.windows,
                    [windowId]: {
                        ...prev.windows[windowId],
                        zIndex: prev.nextZIndex,
                    }
                },
                nextZIndex: prev.nextZIndex + 1
            }))
        }

    }

    return (
        <WindowContext.Provider value={{ windows: windowsConfig.windows, nextZIndex: windowsConfig.nextZIndex, openWindow, closeWindow, focusWindow }}>
            {children}
        </WindowContext.Provider>
    )
}

const useWindow = () => {
    const context = useContext(WindowContext)
    if (!context) {
        throw new Error("useWindow must be used within a WindowProvider")
    }
    return context
}

export { useWindow, WindowProvider }