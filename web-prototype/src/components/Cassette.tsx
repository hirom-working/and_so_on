// Imports removed as they were unused

interface CassetteProps {
    isPlaying: boolean
}

export const Cassette = ({ isPlaying }: CassetteProps) => {
    return (
        <div className="w-full aspect-[1.6/1] bg-retro-black rounded-[4px] p-1 shadow-2xl relative">
            {/* Cassette Body */}
            <div className="w-full h-full bg-[#DCD0BE] rounded-[2px] relative overflow-hidden flex flex-col items-center">

                {/* Screw Holes */}
                <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-retro-black/20 shadow-inner" />
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-retro-black/20 shadow-inner" />
                <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-retro-black/20 shadow-inner" />
                <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-retro-black/20 shadow-inner" />

                {/* Label Area */}
                <div className="w-[85%] h-[60%] mt-3 bg-white/80 rounded-sm border-[0.5px] border-retro-black/10 relative overflow-hidden">
                    {/* Aesthetic Stripes */}
                    <div className="absolute top-0 w-full h-4 bg-retro-accent3 opacity-80" />
                    <div className="absolute top-4 w-full h-1 bg-retro-accent1 opacity-80" />

                    {/* Text */}
                    <div className="mt-8 ml-4 font-handwriting text-retro-black/80 text-sm font-bold tracking-widest">
                        Lo-Fi Sleep
                    </div>

                    {/* Window Cutout */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-[70%] h-[45%] bg-retro-black/10 rounded-full border border-retro-black/20 backdrop-blur-sm flex items-center justify-center gap-6">
                        {/* Left Reel */}
                        <Reel isPlaying={isPlaying} />

                        {/* Right Reel */}
                        <Reel isPlaying={isPlaying} />
                    </div>
                </div>

                {/* Bottom Trapezoid Area */}
                <div className="absolute bottom-0 w-[65%] h-[25%] bg-[#C5B8A5] clip-path-trapezoid flex items-center justify-center gap-8">
                    <div className="w-3 h-3 rounded-full bg-retro-black/30" />
                    <div className="w-3 h-3 rounded-full bg-retro-black/30" />
                </div>

            </div>
        </div>
    )
}

const Reel = ({ isPlaying }: { isPlaying: boolean }) => {
    return (
        <div className={`w-10 h-10 rounded-full border-4 border-white/80 bg-white/20 flex items-center justify-center relative ${isPlaying ? 'animate-spin-slow' : ''}`}>
            {/* Spoke */}
            <div className="w-full h-1 bg-retro-black/40 absolute" />
            <div className="w-1 h-full bg-retro-black/40 absolute" />
            <div className="w-full h-1 bg-retro-black/40 absolute rotate-45" />
            <div className="w-1 h-full bg-retro-black/40 absolute rotate-45" />

            {/* Tape Roll (simplified) */}
            <div className="w-6 h-6 rounded-full bg-retro-black/60 z-10" />
        </div>
    )
}
