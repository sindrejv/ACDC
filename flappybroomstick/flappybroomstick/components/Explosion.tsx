import * as React from "react";
import { Position } from "../types/gameTypes";

type ExplosionProps = {
  position: Position;
  onComplete: () => void;
  size?: number;
};

export const Explosion: React.FC<ExplosionProps> = React.memo(
  ({ position, onComplete, size = 8 }) => {
    // Magical colors
    const colors = [
      "#9b59b6", // Purple
      "#3498db", // Blue
      "#e91e63", // Pink
      "#f1c40f", // Yellow
      "#2ecc71", // Green
      "#ffffff", // White sparkle
    ];

    const particles = React.useMemo(
      () =>
        Array.from({ length: 15 }, (_, i) => ({
          id: i,
          angle: (Math.PI * 2 * i) / 15 + Math.random() * 0.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: 1 + Math.random() * 4,
          size: size * (0.3 + Math.random() * 0.7),
          delay: Math.random() * 0.2, // Stagger effect
          duration: 0.5 + Math.random() * 0.5, // Random duration
        })),
      [size]
    );

    React.useEffect(() => {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }, [onComplete]);

    return (
      <>
        {/* Central glow */}
        <div
          style={{
            position: "absolute",
            left: position.x,
            top: position.y,
            width: `${size * 2}px`,
            height: `${size * 2}px`,
            background: "rgba(155, 89, 182, 0.3)",
            borderRadius: "50%",
            filter: "blur(5px)",
            animation: "magicFade 0.5s ease-out forwards",
          }}
        />
        {particles.map((particle) => {
          const x = Math.cos(particle.angle) * particle.speed * 30;
          const y = Math.sin(particle.angle) * particle.speed * 30;

          return (
            <div
              key={particle.id}
              style={
                {
                  position: "absolute",
                  left: position.x,
                  top: position.y,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  background: particle.color,
                  borderRadius: "50%",
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                  opacity: 0,
                  animation: `magicParticle ${particle.duration}s ease-out ${particle.delay}s forwards`,
                  "--x": `${x}px`,
                  "--y": `${y}px`,
                  "--scale": 0.1 + Math.random() * 0.9,
                } as React.CSSProperties
              }
            />
          );
        })}
      </>
    );
  }
);
