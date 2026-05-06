'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const presets = {
  fadeUp:   { hidden: { opacity: 0, y: 30 },        visible: { opacity: 1, y: 0 } },
  fadeIn:   { hidden: { opacity: 0 },               visible: { opacity: 1 } },
  fadeLeft: { hidden: { opacity: 0, x: -24 },       visible: { opacity: 1, x: 0 } },
  fadeRight:{ hidden: { opacity: 0, x: 24 },        visible: { opacity: 1, x: 0 } },
  scale:    { hidden: { opacity: 0, scale: 0.96 },  visible: { opacity: 1, scale: 1 } },
};

export default function ScrollReveal({
  children,
  preset   = 'fadeUp',
  delay    = 0,
  duration = 1.1,
  margin   = '-80px',
  className = '',
}) {
  const ref      = useRef(null);
  const inView   = useInView(ref, { once: true, margin });
  const variants = presets[preset] ?? presets.fadeUp;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}