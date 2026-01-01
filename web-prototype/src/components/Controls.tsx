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
            <div className="absolute bottom-4 w-[90%] h-16 bg-black/20 rounded-md shadow-inner blur-[1px] pointer-events-none" />

            {/* Play Button - Accent Color */}
            <PianoKey
                icon={<Play size={20} fill="currentColor" />}
                onClick={onPlay}
                colorClass="bg-retro-primary text-white"
            // No longer passing 'active={isPlaying}' for visual state
            />

            {/* Stop Button - Neutral */}
            <PianoKey
                icon={<Square size={18} fill="currentColor" />}
                onClick={onStop}
                colorClass="bg-[#e0e0e0] text-retro-dark"
            />

            {/* Settings Button - Neutral */}
            <PianoKey
                icon={<Settings size={18} />}
                onClick={() => { }}
                colorClass="bg-[#e0e0e0] text-retro-dark"
            />
        </div>
    )
}

interface PianoKeyProps {
    icon: React.ReactNode
    onClick: () => void
    colorClass: string
}

const PianoKey = ({ icon, onClick, colorClass }: PianoKeyProps) => {
    return (
        <div className="perspective-500 pb-2 z-10"> {/* Add perspective wrapper */}
            <button
                onClick={onClick}
                className={`
                    group relative w-20 h-16 rounded-t-sm rounded-b-md 
                    flex flex-col items-center justify-end pb-2 gap-1
                    transition-all duration-100 ease-out
                    origin-top /* Pivot from top like a piano key */
                    
                    /* Base Style */
                    ${colorClass} shadow-[0_4px_6px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)]
                    
                    /* Hover Effect */
                    hover:-translate-y-0.5

                    /* Active (Pressed) Effect - 3D Pivot */
                    active:rotate-x-12 active:translate-y-1 active:scale-95
                    active:shadow-[0_2px_3px_rgba(0,0,0,0.2),inset_0_2px_8px_rgba(0,0,0,0.1)]
                    active:brightness-95
                `}
                style={{ transformStyle: 'preserve-3d' }}
            >
                {/* Glossy Highlight Top */}
                <div className="absolute top-0 w-full h-[30%] bg-gradient-to-b from-white/40 to-transparent rounded-t-sm pointer-events-none" />

                <div className="transition-opacity opacity-80 group-active:opacity-100">
                    {icon}
                </div>
            </button>
        </div>
    )
}
