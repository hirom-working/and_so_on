interface CassetteProps {
    isPlaying: boolean
}

export const Cassette = ({ isPlaying }: CassetteProps) => {
    return (
        <div className="w-full aspect-[1.6/1] bg-[#1a1a1a] rounded-lg p-1.5 shadow-2xl relative overflow-hidden">
            {/* Outer Shell Bevel */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#3a3a3a] via-[#222] to-[#111] pointer-events-none" />

            {/* Casing Texture (Subtle Noise) */}
            <div className="absolute inset-0 bg-plastic-texture opacity-30 pointer-events-none mix-blend-overlay" />

            {/* Main Body Plastic */}
            <div className="w-full h-full bg-gradient-to-br from-[#EDE5D5] via-[#E3DAC9] to-[#D8CFBF] rounded-[4px] relative overflow-hidden flex flex-col items-center shadow-inner">
                {/* Subtle Gradient for lighting on plastic */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-black/15 pointer-events-none" />

                {/* Edge Highlight (Left/Top) */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/60" />
                <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-white/40" />

                {/* Edge Shadow (Right/Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-black/20" />
                <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-black/15" />

                {/* Screw Holes (Realistic) */}
                <Screw className="top-2 left-2" />
                <Screw className="top-2 right-2" />
                <Screw className="bottom-2 left-2" />
                <Screw className="bottom-2 right-2" />

                {/* Label Area (Paper Texture) */}
                <div className="w-[88%] h-[62%] mt-3 bg-[#FDFCF5] rounded-sm shadow-md relative overflow-hidden transform rotate-[0.3deg] skew-y-[0.1deg]">
                    {/* Paper Texture Overlay */}
                    <div className="absolute inset-0 bg-plastic-texture opacity-15 pointer-events-none" />

                    {/* Paper Edge Wear */}
                    <div className="absolute inset-0 border border-[#e0d8c8] rounded-sm pointer-events-none" />
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-b from-black/5 to-transparent" />

                    {/* Aesthetic Stripes - Retro Colors */}
                    <div className="absolute top-0 w-full h-8 bg-retro-primary/90 mix-blend-multiply" />
                    <div className="absolute top-8 w-full h-2 bg-retro-secondary/80 mix-blend-multiply" />

                    {/* Stripe Gloss */}
                    <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

                    {/* Handwritten Label - On white label area below stripes */}
                    <div className="absolute top-[6px] left-0 right-0 flex justify-center z-20">
                        <div
                            className="font-handwriting text-[#1a1a1a] text-[11px] tracking-wide -rotate-[0.5deg]"
                            style={{
                                fontWeight: 400
                            }}
                        >
                            sentakuki_2025/12/31
                        </div>
                    </div>

                    {/* Window Cutout - The most complex part */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[38%] w-[74%] h-[44%] bg-[#1a1a1a] rounded-xl shadow-[inset_0_2px_8px_rgba(0,0,0,0.8),inset_0_-1px_2px_rgba(255,255,255,0.1)] flex items-center justify-center gap-6 px-3 border border-[#333]">
                        {/* Window Depth Layer */}
                        <div className="absolute inset-[2px] rounded-[10px] bg-gradient-to-b from-[#252525] to-[#1a1a1a] pointer-events-none" />

                        {/* Window Glass Effect */}
                        <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/8 via-transparent to-transparent" />
                            <div className="absolute top-0 left-[20%] w-[30%] h-full bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg]" />
                        </div>

                        {/* Reel Left */}
                        <Reel isPlaying={isPlaying} tapeAmount="large" />

                        {/* Center Tape Path */}
                        <div className="w-full h-10 relative z-0 flex items-center justify-center">
                            {/* Tape running between reels */}
                            <div className="absolute w-full h-[3px] bg-gradient-to-b from-[#4a3828] via-[#3d2b1f] to-[#2a1d15] shadow-sm" />
                            {/* Tape shine */}
                            <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent top-0" />
                        </div>

                        {/* Reel Right */}
                        <Reel isPlaying={isPlaying} tapeAmount="small" />
                    </div>
                </div>

                {/* Bottom Trapezoid Area (Magnetic Head Access) */}
                <div className="absolute bottom-0 w-[68%] h-[22%] bg-gradient-to-b from-[#d4c9b9] to-[#c5baaa] clip-path-trapezoid flex items-center justify-center gap-10 shadow-[0_-2px_6px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.4)]">
                    {/* Surface texture */}
                    <div className="absolute inset-0 bg-plastic-texture opacity-10 pointer-events-none" />

                    {/* Guide Holes with depth */}
                    <GuideHole />
                    <div className="w-8 h-3 bg-[#2a2a2a] rounded-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]" />
                    <GuideHole />
                </div>

            </div>
        </div>
    )
}

const Screw = ({ className }: { className: string }) => (
    <div className={`absolute w-3 h-3 rounded-full bg-gradient-to-br from-[#a8a8a8] via-[#888] to-[#666] shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] flex items-center justify-center ${className}`}>
        {/* Screw head depression */}
        <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#777] to-[#999] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] flex items-center justify-center">
            {/* Phillips head cross */}
            <div className="absolute w-[1px] h-1.5 bg-[#444] rotate-45 shadow-[0_0_1px_rgba(0,0,0,0.5)]" />
            <div className="absolute w-[1px] h-1.5 bg-[#444] -rotate-45 shadow-[0_0_1px_rgba(0,0,0,0.5)]" />
        </div>
    </div>
)

const GuideHole = () => (
    <div className="w-3.5 h-3.5 rounded-full bg-[#1a1a1a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_0.5px_0_rgba(255,255,255,0.3)] relative">
        {/* Hole depth ring */}
        <div className="absolute inset-[2px] rounded-full bg-[#0a0a0a]" />
    </div>
)

const Reel = ({ isPlaying, tapeAmount }: { isPlaying: boolean, tapeAmount: 'large' | 'small' }) => {
    const tapeSize = tapeAmount === 'large' ? 'w-11 h-11' : 'w-8 h-8'
    const tapeSizeInner = tapeAmount === 'large' ? 'w-10 h-10' : 'w-7 h-7'

    return (
        <div className={`relative z-10 flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
            {/* Outer shadow ring */}
            <div className={`absolute ${tapeSize} rounded-full bg-black/30 blur-[2px] translate-y-[1px]`} />

            {/* Tape Roll (Dark Brown Magnetic Tape) */}
            <div className={`${tapeSizeInner} rounded-full bg-gradient-to-br from-[#4a3828] via-[#3d2b1f] to-[#2a1d15] shadow-lg flex items-center justify-center transition-all duration-1000 border border-[#1a1008] relative`}>
                {/* Tape shine effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

                {/* Tape rings (depth effect) */}
                <div className="absolute inset-[3px] rounded-full border border-[#2a1d15]/50" />
                <div className="absolute inset-[6px] rounded-full border border-[#2a1d15]/30" />

                {/* Reel Hub (Metallic) */}
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#f0f0f0] via-[#d0d0d0] to-[#a0a0a0] relative shadow-[0_1px_3px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.8)]">
                    {/* Hub center dimple */}
                    <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-[#888] to-[#bbb] shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)]" />

                    {/* Spokes (Teeth) */}
                    {[0, 60, 120, 180, 240, 300].map(deg => (
                        <div
                            key={deg}
                            className="absolute top-1/2 left-1/2 w-[3px] h-[9px] bg-gradient-to-b from-[#e8e8e8] to-[#c0c0c0] origin-center rounded-t-sm shadow-[0_0_1px_rgba(0,0,0,0.3)]"
                            style={{ transform: `translate(-50%, -50%) rotate(${deg}deg) translateY(-6px)` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
