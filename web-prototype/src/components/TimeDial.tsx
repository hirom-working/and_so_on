import { useRef } from 'react'

interface TimeDialProps {
    value: number // Current remaining time in minutes (can be fractional)
    onChange: (value: number) => void
    isRunning?: boolean
}

// Max time in minutes
const MAX_TIME = 90

export const TimeDial = ({ value, onChange, isRunning = false }: TimeDialProps) => {
    // Rotation: 0 minutes = 0deg (pointer at top), 90 minutes = 270deg (pointer at 9 o'clock position)
    const dialRotation = (value / MAX_TIME) * 270

    const dialRef = useRef<HTMLDivElement>(null)
    const isDraggingRef = useRef(false)

    const getAngleFromCenter = (clientX: number, clientY: number) => {
        if (!dialRef.current) return 0
        const rect = dialRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        // Angle from top (12 o'clock position)
        let angle = Math.atan2(clientX - centerX, centerY - clientY) * (180 / Math.PI)
        if (angle < 0) angle += 360
        return angle
    }

    const angleToValue = (angle: number) => {
        // Clamp angle to 0-270 range (0 to 90 minutes)
        const clampedAngle = Math.max(0, Math.min(270, angle))
        return (clampedAngle / 270) * MAX_TIME
    }

    const handlePointerDown = (e: React.PointerEvent) => {
        if (isRunning) return
        isDraggingRef.current = true
        ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
        const angle = getAngleFromCenter(e.clientX, e.clientY)
        const newValue = angleToValue(angle)
        onChange(Math.round(newValue / 5) * 5) // Snap to 5-minute increments
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDraggingRef.current || isRunning) return
        const angle = getAngleFromCenter(e.clientX, e.clientY)
        const newValue = angleToValue(angle)
        onChange(Math.round(newValue / 5) * 5) // Snap to 5-minute increments
    }

    const handlePointerUp = () => {
        isDraggingRef.current = false
    }

    // Scale marks: 0, 15, 30, 45, 60, 75, 90
    const majorMarks = [0, 15, 30, 45, 60, 75, 90]

    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            {/* Dial Container */}
            <div className="relative w-[100px] h-[100px]">
                {/* Base plate - Fixed with printed numbers */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#f5f0e8] to-[#e8e0d4] shadow-[inset_0_2px_6px_rgba(0,0,0,0.15),0_1px_0_rgba(255,255,255,0.5)]">
                    {/* Recessed track */}
                    <div className="absolute inset-[6px] rounded-full bg-gradient-to-b from-[#d8d0c4] to-[#e4dcd0] shadow-[inset_0_2px_4px_rgba(0,0,0,0.12)]" />

                    {/* Numbers printed on base (fixed) */}
                    {majorMarks.map((num) => {
                        const angle = (num / MAX_TIME) * 270 - 90 // -90 to start from top
                        const radius = 42
                        const radian = angle * (Math.PI / 180)
                        const x = Math.cos(radian) * radius
                        const y = Math.sin(radian) * radius

                        return (
                            <div
                                key={num}
                                className="absolute text-[9px] font-bold text-[#5a5045] pointer-events-none select-none"
                                style={{
                                    left: '50%',
                                    top: '50%',
                                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                                    textShadow: '0 0.5px 0 rgba(255,255,255,0.6)'
                                }}
                            >
                                {num}
                            </div>
                        )
                    })}

                    {/* Minor tick marks on base */}
                    {[...Array(19)].map((_, i) => {
                        const minutes = i * 5
                        if (majorMarks.includes(minutes)) return null
                        const angle = (minutes / MAX_TIME) * 270
                        return (
                            <div
                                key={i}
                                className="absolute left-1/2 top-1/2"
                                style={{
                                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                                }}
                            >
                                <div
                                    className="w-[1px] h-[4px] bg-[#a09080]"
                                    style={{ transform: 'translateY(-40px)' }}
                                />
                            </div>
                        )
                    })}
                </div>

                {/* Rotatable knob with pointer */}
                <div
                    ref={dialRef}
                    className={`
                        absolute inset-[14px] rounded-full
                        bg-gradient-to-br from-[#f0e8d8] via-[#e0d4c0] to-[#c8bca8]
                        shadow-[0_3px_6px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.08)]
                        ${isRunning ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}
                        select-none
                    `}
                    style={{
                        transform: `rotate(${dialRotation}deg)`,
                        transition: isDraggingRef.current ? 'none' : 'transform 0.15s ease-out'
                    }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                >
                    {/* Knob texture - subtle ridges */}
                    {[...Array(12)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute inset-[4px]"
                            style={{
                                transform: `rotate(${i * 30}deg)`,
                            }}
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-[8px] bg-gradient-to-b from-black/5 to-transparent rounded-full" />
                        </div>
                    ))}

                    {/* Pointer/Indicator on knob */}
                    <div className="absolute top-[2px] left-1/2 -translate-x-1/2">
                        <div className="w-[4px] h-[12px] bg-gradient-to-b from-[#c04020] via-[#a03018] to-[#802010] rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
                    </div>

                    {/* Center cap */}
                    <div className="absolute inset-[18px] rounded-full bg-gradient-to-br from-[#e8e0d0] via-[#d8ccb8] to-[#c0b4a0] shadow-[0_2px_3px_rgba(0,0,0,0.15),inset_0_1px_2px_rgba(255,255,255,0.4)]">
                        <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-[#d0c4b0] to-[#e0d4c0] shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]" />
                    </div>

                    {/* Highlight */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none" />
                </div>
            </div>

            {/* Label */}
            <span className="text-[8px] font-bold text-[#f0e8d8]/60 tracking-[0.12em] mt-1.5">MINUTES</span>
        </div>
    )
}
