import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef } from 'react'

function mergeClassNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function BackgroundGradientAnimation({
  gradientBackgroundStart = 'rgb(243, 239, 247)',
  gradientBackgroundEnd = 'rgb(93, 52, 201)',
  firstColor = '122, 90, 248',
  secondColor = '168, 85, 247',
  thirdColor = '139, 92, 246',
  fourthColor = '79, 70, 229',
  fifthColor = '192, 132, 252',
  pointerColor = '124, 58, 237',
  size = '80%',
  blendingValue = 'hard-light',
  children,
  className,
  interactive = true,
}) {
  const containerRef = useRef(null)
  const interactiveRef = useRef(null)
  const animationRef = useRef(null)
  const positionRef = useRef({ curX: 0, curY: 0, tgX: 0, tgY: 0 })

  const animate = useCallback(() => {
    if (!interactiveRef.current) {
      return
    }

    const { curX, curY, tgX, tgY } = positionRef.current
    positionRef.current.curX = curX + (tgX - curX) / 20
    positionRef.current.curY = curY + (tgY - curY) / 20

    interactiveRef.current.style.transform = `translate(${Math.round(positionRef.current.curX)}px, ${Math.round(positionRef.current.curY)}px)`

    animationRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    if (interactive) {
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [interactive, animate])

  const handleMouseMove = useCallback((event) => {
    if (!containerRef.current) {
      return
    }

    const rect = containerRef.current.getBoundingClientRect()
    positionRef.current.tgX = event.clientX - rect.left
    positionRef.current.tgY = event.clientY - rect.top
  }, [])

  const gradientStyle = {
    width: size,
    height: size,
    mixBlendMode: blendingValue,
  }

  return (
    <div
      ref={containerRef}
      className={mergeClassNames('fixed inset-0 overflow-hidden', className)}
      style={{
        background: `linear-gradient(40deg, ${gradientBackgroundStart}, ${gradientBackgroundEnd})`,
      }}
      onMouseMove={interactive ? handleMouseMove : undefined}
    >
      <svg className="hidden" aria-hidden="true">
        <defs>
          <filter id="goo-filter">
            <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              result="goo"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      <div className="absolute inset-0 blur-lg [filter:url(#goo-filter)_blur(40px)]">
        <motion.div
          className="absolute rounded-full"
          style={{
            ...gradientStyle,
            background: `radial-gradient(circle at center, rgb(${firstColor}) 0%, rgb(${firstColor}) 50%, transparent 50%)`,
            top: `calc(50% - ${size} / 2)`,
            left: `calc(50% - ${size} / 2)`,
            transformOrigin: 'center center',
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: 'linear' },
            scale: { duration: 8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
          }}
        />

        <motion.div
          className="absolute rounded-full opacity-80"
          style={{
            ...gradientStyle,
            background: `radial-gradient(circle at center, rgba(${secondColor}, 0.8) 0%, transparent 50%)`,
            top: `calc(50% - ${size} / 2)`,
            left: `calc(50% - ${size} / 2)`,
            transformOrigin: 'calc(50% - 400px) center',
          }}
          animate={{
            rotate: [0, -360],
            x: [0, 100, -50, 0],
            y: [0, -80, 60, 0],
          }}
          transition={{
            rotate: { duration: 15, repeat: Number.POSITIVE_INFINITY, ease: 'linear' },
            x: { duration: 12, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
            y: { duration: 10, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
          }}
        />

        <motion.div
          className="absolute rounded-full opacity-80"
          style={{
            ...gradientStyle,
            background: `radial-gradient(circle at center, rgba(${thirdColor}, 0.8) 0%, transparent 50%)`,
            top: `calc(50% - ${size} / 2)`,
            left: `calc(50% - ${size} / 2)`,
            transformOrigin: 'calc(50% + 400px) center',
          }}
          animate={{
            rotate: [0, 360],
            x: [0, -120, 80, 0],
            y: [0, 100, -40, 0],
          }}
          transition={{
            rotate: { duration: 25, repeat: Number.POSITIVE_INFINITY, ease: 'linear' },
            x: { duration: 14, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
            y: { duration: 16, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
          }}
        />

        <motion.div
          className="absolute rounded-full opacity-70"
          style={{
            ...gradientStyle,
            background: `radial-gradient(circle at center, rgba(${fourthColor}, 0.8) 0%, transparent 50%)`,
            top: `calc(50% - ${size} / 2)`,
            left: `calc(50% - ${size} / 2)`,
            transformOrigin: 'calc(50% - 200px) center',
          }}
          animate={{
            rotate: [0, -360],
            x: [0, 60, -100, 0],
            y: [0, -60, 80, 0],
          }}
          transition={{
            rotate: { duration: 18, repeat: Number.POSITIVE_INFINITY, ease: 'linear' },
            x: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
            y: { duration: 14, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
          }}
        />

        <motion.div
          className="absolute rounded-full opacity-80"
          style={{
            ...gradientStyle,
            background: `radial-gradient(circle at center, rgba(${fifthColor}, 0.8) 0%, transparent 50%)`,
            top: `calc(50% - ${size} / 2)`,
            left: `calc(50% - ${size} / 2)`,
            transformOrigin: 'calc(50% - 800px) calc(50% + 800px)',
          }}
          animate={{
            rotate: [0, 360],
            x: [0, -80, 120, 0],
            y: [0, 120, -60, 0],
          }}
          transition={{
            rotate: { duration: 22, repeat: Number.POSITIVE_INFINITY, ease: 'linear' },
            x: { duration: 18, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
            y: { duration: 12, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' },
          }}
        />

        {interactive && (
          <div
            ref={interactiveRef}
            className="absolute -left-1/2 -top-1/2 h-full w-full opacity-60"
            style={{
              background: `radial-gradient(circle at center, rgba(${pointerColor}, 0.8) 0%, transparent 50%)`,
              mixBlendMode: blendingValue,
            }}
          />
        )}
      </div>

      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  )
}

export default BackgroundGradientAnimation
