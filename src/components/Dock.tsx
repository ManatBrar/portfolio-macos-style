import { dockItems } from "../constants"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useWindow } from "../context/WindowContext"

const Dock = () => {
    const { openWindow, closeWindow, windows } = useWindow()
    return (
        <div className="flex fixed bottom-2 left-1/2 translate-x-[-50%] bg-white/60 rounded-2xl p-1">
            {
                dockItems.map((item) => {
                    const { isOpen } = windows[item.windowId]
                    return (
                        <div key={item.id}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <img
                                        src={`images/${item.windowId}.png`}
                                        alt={item.title}
                                        loading="lazy"
                                        className="w-16 h-16 cursor-pointer hover:scale-120 transition-all duration-50"
                                        onClick={() => isOpen ? closeWindow(item.windowId) : openWindow(item.windowId)}
                                    />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{item.title}</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Dock