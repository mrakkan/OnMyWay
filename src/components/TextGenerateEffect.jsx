import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { motion, stagger, useAnimate } from 'framer-motion'

function joinClassNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const TextGenerateEffect = forwardRef(function TextGenerateEffect(
  {
    words,
    className,
    filter = true,
    duration = 0.35,
    staggerDelay = 0.08,
    ...props
  },
  ref,
) {
  const localRef = useRef(null)
  const [scope, animate] = useAnimate()
  const wordsArray = useMemo(() => String(words || '').split(' '), [words])

  useImperativeHandle(ref, () => localRef.current)

  useEffect(() => {
    if (!scope.current) {
      return
    }

    animate(
      'span',
      {
        opacity: 1,
        filter: filter ? 'blur(0px)' : 'none',
      },
      {
        duration,
        delay: stagger(staggerDelay),
      },
    )
  }, [animate, duration, filter, scope, staggerDelay])

  return (
    <div className={joinClassNames('font-semibold', className)} ref={localRef} {...props}>
      <motion.div ref={scope}>
        {wordsArray.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            className="opacity-0 will-change-transform will-change-opacity"
            style={{ filter: filter ? 'blur(8px)' : 'none' }}
          >
            {word}{' '}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
})

export default TextGenerateEffect
