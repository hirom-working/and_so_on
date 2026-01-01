import { Play, Square, Settings } from 'lucide-react'

interface ControlsProps {
    isPlaying: boolean
    onPlay: () => void
    onStop: () => void
}

export const Controls = ({ isPlaying, onPlay, onStop }: ControlsProps) => {
    return (
        <div className="w-full h-full flex items-end justify-center gap-4 px-8 pb-4 bg-[#cfc5b5] rounded-b-[30px] shadow-inner relative">
            {/* Button Well/Depression */}
            <div className="absolute bottom-4 w-[90%] h-16 bg-black/20 rounded-md shadow-inner blur-[1px]" />

            {/* Play Button - Accent Color */}
            <PianoKey
                icon={<Play size={20} fill="currentColor" />}
                onClick={onPlay}
                active={isPlaying}
                colorClass="bg-retro-primary text-white"
                activeColorClass="bg-retro-primary brightness-90"
            />

            {/* Stop Button - Neutral */}
            <PianoKey
                icon={<Square size={18} fill="currentColor" />}
                onClick={onStop}
                active={!isPlaying}
                colorClass="bg-[#e0e0e0] text-retro-dark"
                activeColorClass="bg-[#d0d0d0]"
            />

            {/* Settings Button - Neutral */}
            <PianoKey
                icon={<Settings size={18} />}
                onClick={() => { }}
                active={false} // Momentary switch usually
                colorClass="bg-[#e0e0e0] text-retro-dark"
                activeColorClass="bg-[#d0d0d0]"
            />
        </div>
    )
}

interface PianoKeyProps {
    icon: React.ReactNode
    onClick: () => void
    active: boolean
    colorClass: string
    activeColorClass: string
}

const PianoKey = ({ icon, onClick, active, colorClass, activeColorClass }: PianoKeyProps) => {
    return (
        <button
            onClick={onClick}
            className={`
                relative w-20 h-16 rounded-t-sm rounded-b-md flex flex-col items-center justify-end pb-2 gap-1
                transition-all duration-150 ease-out z-10
                shadow-[0_4px_6px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]
                ${active
                    ? `translate-y-2 h-14 ${activeColorClass} shadow-[0_1px_2px_rgba(0,0,0,0.2),inset_0_2px_5px_rgba(0,0,0,0.2)]`
                    : `${colorClass} hover:-translate-y-0.5`
                }
            `}
        >
            {/* Glossy Highlight Top */}
            <div className="absolute top-0 w-full h-[30%] bg-gradient-to-b from-white/40 to-transparent rounded-t-sm pointer-events-none" />

            <div className={`transition-opacity ${active ? 'opacity-100' : 'opacity-70'}`}>
                {icon}
            </div>
            {/* <span className="text-[9px] font-bold tracking-widest opacity-60">{label}</span> */}
        </button>
    )
}
