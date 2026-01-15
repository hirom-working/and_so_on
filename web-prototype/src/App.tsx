import { useState, useRef, useEffect, useCallback } from 'react'
import { Cassette } from './components/Cassette'
import { VUMeter } from './components/VUMeter'
import { TimeDial } from './components/TimeDial'
import { Controls } from './components/Controls'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState(30) // Set duration (minutes)
  const [remainingTime, setRemainingTime] = useState(30) // Remaining time (minutes, can be fractional)
  const [audioLevel, setAudioLevel] = useState(0) // Audio level for VU meter (0-1)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const sourceCreatedRef = useRef(false)

  useEffect(() => {
    const audio = new Audio('./audio.m4a')
    audio.crossOrigin = 'anonymous'
    audioRef.current = audio

    audio.addEventListener('ended', () => {
      setIsPlaying(false)
    })

    return () => {
      audio.pause()
      audio.src = ''
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Audio level analysis
  useEffect(() => {
    if (!isPlaying || !audioRef.current) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      return
    }

    // Initialize AudioContext on first play (requires user interaction)
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256
      analyserRef.current.smoothingTimeConstant = 0.8
    }

    // Connect audio element to analyser (only once)
    if (!sourceCreatedRef.current && audioRef.current && audioContextRef.current && analyserRef.current) {
      const source = audioContextRef.current.createMediaElementSource(audioRef.current)
      source.connect(analyserRef.current)
      analyserRef.current.connect(audioContextRef.current.destination)
      sourceCreatedRef.current = true
    }

    // Resume audio context if suspended
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume()
    }

    // Analyze audio level
    const analyzeLevel = () => {
      if (!analyserRef.current || !isPlaying) return

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(dataArray)

      // Calculate average frequency amplitude (more visible response than time domain)
      let sum = 0
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i]
      }
      const average = sum / dataArray.length
      // Normalize to 0-1 range (frequency data is 0-255)
      const normalizedLevel = average / 255
      setAudioLevel(normalizedLevel)
      animationFrameRef.current = requestAnimationFrame(analyzeLevel)
    }

    analyzeLevel()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isPlaying])

  // Countdown timer effect
  useEffect(() => {
    if (isPlaying && remainingTime > 0) {
      timerRef.current = window.setInterval(() => {
        setRemainingTime(prev => {
          const newTime = prev - (1 / 60) // Decrease by 1 second (1/60 minute)
          if (newTime <= 0) {
            // Time's up - stop playback
            if (audioRef.current) {
              audioRef.current.pause()
              audioRef.current.currentTime = 0
            }
            setIsPlaying(false)
            return 0
          }
          return newTime
        })
      }, 1000) // Update every second
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPlaying, remainingTime])

  const handleDurationChange = useCallback((value: number) => {
    setDuration(value)
    setRemainingTime(value)
  }, [])

  const handlePlay = () => {
    if (audioRef.current && remainingTime > 0) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      setRemainingTime(duration) // Reset to set duration
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#e0d8d0] to-[#d0c8c0] p-4 flex flex-col items-center justify-center font-sans text-retro-dark select-none">

      {/* Device Casing */}
      <div className="
        w-full max-w-[380px] rounded-[40px] p-1.5
        bg-gradient-to-br from-[#e8e0d0] via-[#d0c8b8] to-[#b8b0a0]
        shadow-[20px_20px_60px_#a8a098,-10px_-10px_30px_#ffffff,inset_0_0_0_1px_rgba(255,255,255,0.3)]
        aspect-[9/18] relative overflow-hidden
      ">
        {/* Inner casing */}
        <div className="w-full h-full bg-gradient-to-br from-[#F8EED8] via-[#F4E4BC] to-[#E8D8A8] rounded-[36px] p-5 flex flex-col gap-5 relative overflow-hidden">

          {/* Subtle Noise Texture on Casing */}
          <div className="absolute inset-0 bg-plastic-texture opacity-25 pointer-events-none" />

          {/* Edge highlights */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-t-[36px]" />
          <div className="absolute top-0 left-0 bottom-0 w-[1px] bg-white/30" />

          {/* Brand / Top Section */}
          <div className="h-6 flex justify-between items-center px-3 relative z-10">
            {/* Speaker Grille (Left) */}
            <div className="flex gap-[3px]">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-[3px] h-4 bg-gradient-to-b from-[#3a3530] to-[#4a4540] rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.3),0_0.5px_0_rgba(255,255,255,0.3)]" />
              ))}
            </div>

            {/* Brand Name - Embossed */}
            <div className="relative">
              <div
                className="text-[11px] font-bold tracking-[0.25em] text-retro-dark/40 uppercase"
                style={{
                  textShadow: '0 1px 0 rgba(255,255,255,0.6), 0 -0.5px 0 rgba(0,0,0,0.1)'
                }}
              >
                and so on
              </div>
            </div>

            {/* Speaker Grille (Right) */}
            <div className="flex gap-[3px]">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-[3px] h-4 bg-gradient-to-b from-[#3a3530] to-[#4a4540] rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.3),0_0.5px_0_rgba(255,255,255,0.3)]" />
              ))}
            </div>
          </div>

          {/* Display / Meter Section */}
          <div className="flex gap-3 h-36 bg-gradient-to-b from-[#3a3530] to-[#4a4540] rounded-2xl p-3 shadow-[inset_0_3px_8px_rgba(0,0,0,0.4),0_1px_0_rgba(255,255,255,0.2)] relative z-10">
            {/* Inner panel depression */}
            <div className="absolute inset-[2px] rounded-xl bg-gradient-to-b from-[#454038] to-[#3a3530] pointer-events-none" />

            <div className="w-1/2 relative z-10">
              <VUMeter isPlaying={isPlaying} audioLevel={audioLevel} />
            </div>
            <div className="w-1/2 relative z-10">
              <TimeDial value={remainingTime} onChange={handleDurationChange} isRunning={isPlaying} />
            </div>
          </div>

          {/* Cassette Deck Section */}
          <div className="flex-1 flex items-center justify-center p-3 bg-gradient-to-b from-[#e0d6c6] to-[#d0c6b6] rounded-xl shadow-[inset_0_2px_6px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.5)] border border-white/40 relative z-10">
            {/* Deck surface texture */}
            <div className="absolute inset-0 bg-plastic-texture opacity-10 pointer-events-none rounded-xl" />
            <Cassette isPlaying={isPlaying} />
          </div>

          {/* Control Section */}
          <div className="h-28 relative z-10">
            <Controls
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onStop={handleStop}
            />
          </div>

          {/* Bottom ventilation slots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 opacity-30">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-6 h-1 bg-retro-dark/40 rounded-full shadow-[inset_0_1px_1px_rgba(0,0,0,0.3)]" />
            ))}
          </div>
        </div>

        {/* Outer casing edge details */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-black/10 to-transparent" />
      </div>

      <div className="mt-6 text-retro-dark/30 text-[10px] font-mono tracking-wider">
        DESIGN PROTOTYPE v3.0
      </div>
    </div>
  )
}

export default App
