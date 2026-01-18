import { useState, useRef, useEffect, useCallback } from 'react'
import { Cassette } from './components/Cassette'
import { VUMeter } from './components/VUMeter'
import { TimeDial } from './components/TimeDial'
import { Controls } from './components/Controls'

// Outro duration in minutes (10 seconds)
const OUTRO_DURATION = 10 / 60
// Crossfade duration in seconds
const CROSSFADE_DURATION = 2

type PlayPhase = 'idle' | 'intro' | 'loop' | 'outro'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playPhase, setPlayPhase] = useState<PlayPhase>('idle')
  const [duration, setDuration] = useState(30) // Set duration (minutes)
  const [remainingTime, setRemainingTime] = useState(30) // Remaining time (minutes, can be fractional)
  const [audioLevel, setAudioLevel] = useState(0) // Audio level for VU meter (0-1)

  // Audio element refs
  const introAudioRef = useRef<HTMLAudioElement | null>(null)
  const loopAudioARef = useRef<HTMLAudioElement | null>(null)
  const loopAudioBRef = useRef<HTMLAudioElement | null>(null)
  const outroAudioRef = useRef<HTMLAudioElement | null>(null)

  // Track which loop is currently active ('A' or 'B')
  const activeLoopRef = useRef<'A' | 'B'>('A')
  // Track if crossfade is in progress
  const crossfadeInProgressRef = useRef(false)

  // Audio context refs
  const timerRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // GainNode refs for volume control
  const introGainRef = useRef<GainNode | null>(null)
  const loopGainARef = useRef<GainNode | null>(null)
  const loopGainBRef = useRef<GainNode | null>(null)
  const outroGainRef = useRef<GainNode | null>(null)

  // Track if sources are created
  const sourcesCreatedRef = useRef(false)

  // Initialize audio elements
  useEffect(() => {
    const introAudio = new Audio('./intro.m4a')
    const loopAudioA = new Audio('./loop.m4a')
    const loopAudioB = new Audio('./loop.m4a')
    const outroAudio = new Audio('./outro.m4a')

    introAudio.crossOrigin = 'anonymous'
    loopAudioA.crossOrigin = 'anonymous'
    loopAudioB.crossOrigin = 'anonymous'
    outroAudio.crossOrigin = 'anonymous'

    // Preload audio
    introAudio.preload = 'auto'
    loopAudioA.preload = 'auto'
    loopAudioB.preload = 'auto'
    outroAudio.preload = 'auto'

    introAudioRef.current = introAudio
    loopAudioARef.current = loopAudioA
    loopAudioBRef.current = loopAudioB
    outroAudioRef.current = outroAudio

    return () => {
      introAudio.pause()
      loopAudioA.pause()
      loopAudioB.pause()
      outroAudio.pause()
      introAudio.src = ''
      loopAudioA.src = ''
      loopAudioB.src = ''
      outroAudio.src = ''
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Crossfade function for loop transition
  const startCrossfade = useCallback(() => {
    if (crossfadeInProgressRef.current) return
    crossfadeInProgressRef.current = true

    const audioContext = audioContextRef.current
    const currentLoop = activeLoopRef.current
    const nextLoop = currentLoop === 'A' ? 'B' : 'A'

    const currentAudio = currentLoop === 'A' ? loopAudioARef.current : loopAudioBRef.current
    const nextAudio = nextLoop === 'A' ? loopAudioARef.current : loopAudioBRef.current
    const currentGain = currentLoop === 'A' ? loopGainARef.current : loopGainBRef.current
    const nextGain = nextLoop === 'A' ? loopGainARef.current : loopGainBRef.current

    if (!audioContext || !currentAudio || !nextAudio || !currentGain || !nextGain) {
      crossfadeInProgressRef.current = false
      return
    }

    const now = audioContext.currentTime

    // Start next loop from beginning
    nextAudio.currentTime = 0
    nextGain.gain.setValueAtTime(0, now)
    nextAudio.play()

    // Crossfade: fade out current, fade in next
    currentGain.gain.setValueAtTime(1, now)
    currentGain.gain.linearRampToValueAtTime(0, now + CROSSFADE_DURATION)
    nextGain.gain.linearRampToValueAtTime(1, now + CROSSFADE_DURATION)

    // After crossfade completes, stop current loop
    setTimeout(() => {
      currentAudio.pause()
      currentAudio.currentTime = 0
      activeLoopRef.current = nextLoop
      crossfadeInProgressRef.current = false
    }, CROSSFADE_DURATION * 1000)
  }, [])

  // Handle loop timeupdate for crossfade trigger
  useEffect(() => {
    const loopAudioA = loopAudioARef.current
    const loopAudioB = loopAudioBRef.current

    if (!loopAudioA || !loopAudioB) return

    const handleTimeUpdate = (audio: HTMLAudioElement, which: 'A' | 'B') => {
      // Only trigger crossfade for the active loop
      if (activeLoopRef.current !== which) return
      if (playPhase !== 'loop') return
      if (crossfadeInProgressRef.current) return

      const timeRemaining = audio.duration - audio.currentTime
      if (timeRemaining <= CROSSFADE_DURATION && timeRemaining > 0) {
        startCrossfade()
      }
    }

    const handleTimeUpdateA = () => handleTimeUpdate(loopAudioA, 'A')
    const handleTimeUpdateB = () => handleTimeUpdate(loopAudioB, 'B')

    loopAudioA.addEventListener('timeupdate', handleTimeUpdateA)
    loopAudioB.addEventListener('timeupdate', handleTimeUpdateB)

    return () => {
      loopAudioA.removeEventListener('timeupdate', handleTimeUpdateA)
      loopAudioB.removeEventListener('timeupdate', handleTimeUpdateB)
    }
  }, [playPhase, startCrossfade])

  // Handle phase transitions
  useEffect(() => {
    const introAudio = introAudioRef.current
    const outroAudio = outroAudioRef.current

    if (!introAudio || !outroAudio) return

    const handleIntroEnded = () => {
      if (playPhase === 'intro') {
        setPlayPhase('loop')
        // Start loop A immediately after intro
        const loopAudioA = loopAudioARef.current
        if (loopAudioA && loopGainARef.current) {
          activeLoopRef.current = 'A'
          loopGainARef.current.gain.value = 1
          loopAudioA.currentTime = 0
          loopAudioA.play()
        }
      }
    }

    const handleOutroEnded = () => {
      if (playPhase === 'outro') {
        setPlayPhase('idle')
        setIsPlaying(false)
        setRemainingTime(0)
      }
    }

    introAudio.addEventListener('ended', handleIntroEnded)
    outroAudio.addEventListener('ended', handleOutroEnded)

    return () => {
      introAudio.removeEventListener('ended', handleIntroEnded)
      outroAudio.removeEventListener('ended', handleOutroEnded)
    }
  }, [playPhase])

  // Initialize AudioContext and connect all audio elements
  const initializeAudioContext = useCallback(() => {
    if (audioContextRef.current || sourcesCreatedRef.current) return

    const introAudio = introAudioRef.current
    const loopAudioA = loopAudioARef.current
    const loopAudioB = loopAudioBRef.current
    const outroAudio = outroAudioRef.current

    if (!introAudio || !loopAudioA || !loopAudioB || !outroAudio) return

    const audioContext = new AudioContext()
    audioContextRef.current = audioContext

    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    analyser.smoothingTimeConstant = 0.8
    analyserRef.current = analyser

    // Create gain nodes
    const introGain = audioContext.createGain()
    const loopGainA = audioContext.createGain()
    const loopGainB = audioContext.createGain()
    const outroGain = audioContext.createGain()

    introGainRef.current = introGain
    loopGainARef.current = loopGainA
    loopGainBRef.current = loopGainB
    outroGainRef.current = outroGain

    // Initialize loop B gain to 0
    loopGainB.gain.value = 0

    // Create sources and connect: source -> gain -> analyser -> destination
    const introSource = audioContext.createMediaElementSource(introAudio)
    const loopSourceA = audioContext.createMediaElementSource(loopAudioA)
    const loopSourceB = audioContext.createMediaElementSource(loopAudioB)
    const outroSource = audioContext.createMediaElementSource(outroAudio)

    introSource.connect(introGain)
    loopSourceA.connect(loopGainA)
    loopSourceB.connect(loopGainB)
    outroSource.connect(outroGain)

    introGain.connect(analyser)
    loopGainA.connect(analyser)
    loopGainB.connect(analyser)
    outroGain.connect(analyser)

    analyser.connect(audioContext.destination)

    sourcesCreatedRef.current = true
  }, [])

  // Audio level analysis
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
      setAudioLevel(0)
      return
    }

    // Resume audio context if suspended
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume()
    }

    // Analyze audio level
    const analyzeLevel = () => {
      if (!analyserRef.current || !isPlaying) return

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(dataArray)

      let sum = 0
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i]
      }
      const average = sum / dataArray.length
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

  // Countdown timer and phase transition to outro
  useEffect(() => {
    if (isPlaying && remainingTime > 0 && playPhase !== 'outro') {
      timerRef.current = window.setInterval(() => {
        setRemainingTime(prev => {
          const newTime = prev - (1 / 60) // Decrease by 1 second

          // Check if it's time to transition to outro
          if (newTime <= OUTRO_DURATION && playPhase === 'loop') {
            // Stop both loops and start outro immediately
            if (loopAudioARef.current) {
              loopAudioARef.current.pause()
              loopAudioARef.current.currentTime = 0
            }
            if (loopAudioBRef.current) {
              loopAudioBRef.current.pause()
              loopAudioBRef.current.currentTime = 0
            }
            if (outroAudioRef.current) {
              outroAudioRef.current.currentTime = 0
              outroAudioRef.current.play()
            }
            setPlayPhase('outro')
          }

          if (newTime <= 0) {
            return 0
          }
          return newTime
        })
      }, 1000)
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
  }, [isPlaying, remainingTime, playPhase])

  const handleDurationChange = useCallback((value: number) => {
    setDuration(value)
    setRemainingTime(value)
  }, [])

  const handlePlay = () => {
    if (remainingTime > 0) {
      // Initialize audio context on first play (requires user interaction)
      initializeAudioContext()

      if (introAudioRef.current) {
        introAudioRef.current.currentTime = 0
        introAudioRef.current.play()
        setPlayPhase('intro')
        setIsPlaying(true)
      }
    }
  }

  const handleStop = () => {
    // Stop all audio
    if (introAudioRef.current) {
      introAudioRef.current.pause()
      introAudioRef.current.currentTime = 0
    }
    if (loopAudioARef.current) {
      loopAudioARef.current.pause()
      loopAudioARef.current.currentTime = 0
    }
    if (loopAudioBRef.current) {
      loopAudioBRef.current.pause()
      loopAudioBRef.current.currentTime = 0
    }
    if (outroAudioRef.current) {
      outroAudioRef.current.pause()
      outroAudioRef.current.currentTime = 0
    }

    // Reset gains
    if (loopGainARef.current) loopGainARef.current.gain.value = 1
    if (loopGainBRef.current) loopGainBRef.current.gain.value = 0

    activeLoopRef.current = 'A'
    crossfadeInProgressRef.current = false
    setPlayPhase('idle')
    setIsPlaying(false)
    setRemainingTime(duration)
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
            <Cassette isPlaying={isPlaying} progress={duration > 0 ? (duration - remainingTime) / duration : 0} />
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
