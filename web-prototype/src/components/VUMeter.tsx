import { useEffect, useRef, useState } from 'react'

interface VUMeterProps {
    isPlaying: boolean
    audioLevel?: number // 0-1 range, actual audio level from analyser
}

export const VUMeter = ({ isPlaying, audioLevel = 0 }: VUMeterProps) => {
    const [needleRotation, setNeedleRotation] = useState(-45)
    const targetRotationRef = useRef(-45)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // Update target rotation when audioLevel changes
    useEffect(() => {
        if (isPlaying) {
            // Convert audio level to needle rotation (-45 to +45 degrees)
            // Linear mapping for small audio levels:
            // 0.00 -> -45deg (-20dB)
            // 0.05 -> 0deg (0dB)
            // 0.10 -> +45deg (+6dB)
            targetRotationRef.current = Math.max(-45, Math.min(45, (audioLevel / 0.05) * 45 - 45))
        } else {
            // Rest position when not playing
            targetRotationRef.current = -45
        }
    }, [audioLevel, isPlaying])

    // Animation loop - runs continuously when playing
    useEffect(() => {
        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }

        // Smooth needle movement with inertia (VU meter characteristic)
        // VU meters have ~300ms integration time
        intervalRef.current = setInterval(() => {
            setNeedleRotation(prev => {
                const target = targetRotationRef.current
                const diff = target - prev

                // Stop updating if close enough to target
                if (Math.abs(diff) < 0.1) return target

                // VU meter characteristic: faster rise, slower fall
                // Rise time ~300ms, fall time ~300ms (but feels slower due to gravity simulation)
                const speed = diff > 0 ? 0.2 : 0.12
                return prev + diff * speed
            })
        }, 16) // ~60fps for smoother animation

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, []) // Run only once on mount

    return (
        <div className="w-full h-full relative">
            {/* Metal Bezel (Outer Ring) */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-[#c8c0b0] via-[#a09890] to-[#787068] p-[3px] shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.4)]">
                {/* Inner bezel highlight */}
                <div className="absolute inset-[1px] rounded-lg bg-gradient-to-br from-[#d8d0c0] to-[#a8a090] opacity-50 pointer-events-none" />

                {/* Meter Face */}
                <div className="w-full h-full bg-gradient-to-b from-[#f5ece0] via-[#f0e6d2] to-[#e8dcc8] rounded-[5px] shadow-[inset_0_2px_6px_rgba(0,0,0,0.15)] relative flex flex-col items-center justify-end overflow-hidden">
                    {/* Aged paper texture overlay */}
                    <div className="absolute inset-0 bg-plastic-texture opacity-20 pointer-events-none mix-blend-multiply" />

                    {/* Subtle yellowing effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#f5e8c8]/20 to-[#e8d8b8]/30 pointer-events-none" />

                    {/* Background Scale Graphics */}
                    <div className="absolute top-2 left-0 w-full text-center">
                        <div className="text-[7px] font-bold text-retro-dark/50 tracking-[0.15em] uppercase" style={{ textShadow: '0 0.5px 0 rgba(255,255,255,0.5)' }}>Level</div>
                    </div>

                    {/* Arced Scale Lines - More detailed */}
                    <svg className="absolute top-3 w-[92%] h-[82%] overflow-visible" viewBox="0 0 100 60">
                        {/* Main arc */}
                        <path d="M 8 52 A 42 42 0 0 1 92 52" fill="none" stroke="#8a7a60" strokeWidth="1.5" strokeLinecap="round" />

                        {/* Scale markings */}
                        {/* Left zone - normal */}
                        <path d="M 8 52 L 14 46" stroke="#8a7a60" strokeWidth="1" />
                        <path d="M 18 38 L 22 33" stroke="#8a7a60" strokeWidth="1" />
                        <path d="M 32 26 L 35 21" stroke="#8a7a60" strokeWidth="1" />

                        {/* Center */}
                        <path d="M 50 12 L 50 20" stroke="#8a7a60" strokeWidth="1.5" />

                        {/* Right zone - warning/red */}
                        <path d="M 68 26 L 65 21" stroke="#8a7a60" strokeWidth="1" />
                        <path d="M 82 38 L 78 33" stroke="#c4694a" strokeWidth="1" />
                        <path d="M 92 52 L 86 46" stroke="#c4694a" strokeWidth="1.5" />

                        {/* Red zone arc */}
                        <path d="M 75 35 A 42 42 0 0 1 92 52" fill="none" stroke="#c4694a" strokeWidth="2" strokeLinecap="round" />

                        {/* Scale numbers - screen printed look */}
                        <text x="12" y="56" fontSize="5" fill="#8a7a60" fontWeight="bold">-20</text>
                        <text x="28" y="32" fontSize="5" fill="#8a7a60" fontWeight="bold">-10</text>
                        <text x="47" y="22" fontSize="5" fill="#8a7a60" fontWeight="bold">0</text>
                        <text x="65" y="32" fontSize="5" fill="#c4694a" fontWeight="bold">+3</text>
                        <text x="80" y="48" fontSize="5" fill="#c4694a" fontWeight="bold">+6</text>

                        {/* VU label */}
                        <text x="44" y="45" fontSize="8" fill="#8a7a60" fontWeight="bold" letterSpacing="1">VU</text>
                    </svg>

                    {/* Glass Reflection Effect */}
                    <div className="absolute inset-0 rounded-[5px] overflow-hidden pointer-events-none z-20">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-transparent" />
                        <div className="absolute top-0 left-[10%] w-[40%] h-[60%] bg-gradient-to-br from-white/15 to-transparent rounded-full blur-sm" />
                    </div>

                    {/* Needle Shadow (Blurry, offset) */}
                    <div
                        className="absolute bottom-[10px] left-1/2 w-[2px] h-[50px] bg-black/15 origin-bottom blur-[2px] z-0"
                        style={{ transform: `translateX(-50%) rotate(${needleRotation + 3}deg)` }}
                    />

                    {/* Needle */}
                    <div
                        className="absolute bottom-[10px] left-1/2 origin-bottom z-10"
                        style={{ transform: `translateX(-50%) rotate(${needleRotation}deg)` }}
                    >
                        {/* Needle body - tapered */}
                        <div className="w-[2px] h-[50px] bg-gradient-to-t from-retro-primary via-retro-primary to-[#ff9070] relative">
                            {/* Needle highlight */}
                            <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-t from-transparent via-white/30 to-white/50" />
                        </div>
                        {/* Needle tip */}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[2px] border-r-[2px] border-b-[4px] border-l-transparent border-r-transparent border-b-retro-primary" />
                    </div>

                    {/* Pivot Assembly */}
                    <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 z-20">
                        {/* Pivot base */}
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#444] via-[#333] to-[#222] shadow-[0_1px_2px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.2)]">
                            {/* Center screw */}
                            <div className="absolute inset-[4px] rounded-full bg-gradient-to-br from-[#555] to-[#333] shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
