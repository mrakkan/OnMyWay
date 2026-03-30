import { memo, useCallback, useEffect, useRef } from 'react'

function mergeClassNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) {
    return { r: 255, g: 255, b: 255 }
  }

  return {
    r: Number.parseInt(result[1], 16),
    g: Number.parseInt(result[2], 16),
    b: Number.parseInt(result[3], 16),
  }
}

export function LightWavesBackground({
  className,
  children,
  colors = ['#7c3aed', '#8b5cf6', '#a78bfa', '#6d28d9', '#9333ea'],
  speed = 1,
  intensity = 0.6,
}) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const wavesRef = useRef([])
  const animationRef = useRef(null)
  const startTimeRef = useRef(Date.now())

  const initWaves = useCallback(
    (height) => {
      const waves = []
      const waveCount = 5

      for (let i = 0; i < waveCount; i += 1) {
        waves.push({
          y: height * (0.3 + (i / waveCount) * 0.5),
          amplitude: height * (0.15 + Math.random() * 0.15),
          frequency: 0.002 + Math.random() * 0.002,
          speed: (0.2 + Math.random() * 0.3) * (i % 2 === 0 ? 1 : -1),
          phase: Math.random() * Math.PI * 2,
          color: colors[i % colors.length],
          opacity: 0.15 + Math.random() * 0.1,
        })
      }

      wavesRef.current = waves
    },
    [colors],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current

    if (!canvas || !container) {
      return undefined
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return undefined
    }

    let width = 0
    let height = 0

    const updateSize = () => {
      const rect = container.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width
      canvas.height = height
      initWaves(height)
    }

    updateSize()

    const resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(container)

    const draw = () => {
      const time = (Date.now() - startTimeRef.current) * 0.001 * speed

      const bgGradient = ctx.createLinearGradient(0, 0, 0, height)
      bgGradient.addColorStop(0, '#f8f5ff')
      bgGradient.addColorStop(0.5, '#f2ecff')
      bgGradient.addColorStop(1, '#efe7ff')
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      ctx.globalCompositeOperation = 'lighter'

      const glowSpots = [
        {
          x: width * 0.2,
          y: height * 0.3,
          radius: Math.min(width, height) * 0.4,
          color: colors[0],
        },
        {
          x: width * 0.8,
          y: height * 0.6,
          radius: Math.min(width, height) * 0.35,
          color: colors[1],
        },
        {
          x: width * 0.5,
          y: height * 0.8,
          radius: Math.min(width, height) * 0.3,
          color: colors[2],
        },
      ]

      for (const spot of glowSpots) {
        const rgb = hexToRgb(spot.color)
        const gradient = ctx.createRadialGradient(
          spot.x + Math.sin(time * 0.3) * 50,
          spot.y + Math.cos(time * 0.2) * 30,
          0,
          spot.x + Math.sin(time * 0.3) * 50,
          spot.y + Math.cos(time * 0.2) * 30,
          spot.radius,
        )

        gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.08 * intensity})`)
        gradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${0.03 * intensity})`)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
      }

      for (const wave of wavesRef.current) {
        const rgb = hexToRgb(wave.color)

        ctx.beginPath()

        for (let x = 0; x <= width; x += 5) {
          const y =
            wave.y +
            Math.sin(x * wave.frequency + time * wave.speed + wave.phase) * wave.amplitude +
            Math.sin(x * wave.frequency * 0.5 + time * wave.speed * 0.7 + wave.phase * 1.3) * wave.amplitude * 0.5

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.lineTo(width, height)
        ctx.lineTo(0, height)
        ctx.closePath()

        const waveGradient = ctx.createLinearGradient(0, wave.y - wave.amplitude, 0, height)
        waveGradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${wave.opacity * intensity})`)
        waveGradient.addColorStop(0.3, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${wave.opacity * 0.5 * intensity})`)
        waveGradient.addColorStop(1, 'transparent')

        ctx.fillStyle = waveGradient
        ctx.fill()
      }

      ctx.globalCompositeOperation = 'source-over'

      const topGlow = ctx.createLinearGradient(0, 0, 0, height * 0.4)
      const topRgb = hexToRgb(colors[0])
      topGlow.addColorStop(0, `rgba(${topRgb.r}, ${topRgb.g}, ${topRgb.b}, ${0.06 * intensity})`)
      topGlow.addColorStop(1, 'transparent')
      ctx.fillStyle = topGlow
      ctx.fillRect(0, 0, width, height * 0.4)

      animationRef.current = requestAnimationFrame(draw)
    }

    animationRef.current = requestAnimationFrame(draw)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      resizeObserver.disconnect()
    }
  }, [colors, speed, intensity, initWaves])

  return (
    <div ref={containerRef} className={mergeClassNames('fixed inset-0 overflow-hidden', className)}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        }}
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 58%, rgba(58,28,110,0.24) 100%)',
        }}
      />

      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  )
}

export default memo(LightWavesBackground)