import React, { useEffect, useRef } from 'react';

interface WeatherAnimationsProps {
  condition: string;
  intensity?: 'light' | 'medium' | 'heavy';
}

const WeatherAnimations: React.FC<WeatherAnimationsProps> = ({ condition, intensity = 'medium' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    let animationId: number;

    const getParticleCount = () => {
      switch (intensity) {
        case 'light': return 30;
        case 'heavy': return 100;
        default: return 60;
      }
    };

    // Enhanced particle system for different weather conditions
    const initParticles = () => {
      particles.length = 0;
      const count = getParticleCount();

      for (let i = 0; i < count; i++) {
        if (condition.toLowerCase().includes('rain')) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            width: 2 + Math.random() * 3,
            height: 15 + Math.random() * 20,
            speed: 8 + Math.random() * 12,
            opacity: 0.4 + Math.random() * 0.4,
            angle: Math.random() * 0.2 - 0.1
          });
        } else if (condition.toLowerCase().includes('snow')) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            size: 3 + Math.random() * 8,
            speed: 1 + Math.random() * 3,
            opacity: 0.6 + Math.random() * 0.4,
            drift: Math.random() * 2 - 1,
            rotation: Math.random() * 360
          });
        } else if (condition.toLowerCase().includes('cloud')) {
          particles.push({
            x: Math.random() * (canvas.width + 200) - 100,
            y: Math.random() * canvas.height * 0.6,
            width: 80 + Math.random() * 120,
            height: 40 + Math.random() * 60,
            speed: 0.3 + Math.random() * 0.7,
            opacity: 0.1 + Math.random() * 0.2
          });
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        if (condition.toLowerCase().includes('rain')) {
          // Enhanced rain with 3D effect
          ctx.save();
          ctx.globalAlpha = particle.opacity;
          
          const gradient = ctx.createLinearGradient(
            particle.x, particle.y,
            particle.x, particle.y + particle.height
          );
          gradient.addColorStop(0, '#4fc3f7');
          gradient.addColorStop(0.5, '#29b6f6');
          gradient.addColorStop(1, 'rgba(33, 150, 243, 0)');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(particle.x, particle.y, particle.width, particle.height);
          ctx.restore();

          particle.y += particle.speed;
          particle.x += particle.angle * 2;

          if (particle.y > canvas.height) {
            particle.y = -particle.height;
            particle.x = Math.random() * canvas.width;
          }
        } else if (condition.toLowerCase().includes('snow')) {
          // Enhanced snowflakes with rotation
          ctx.save();
          ctx.globalAlpha = particle.opacity;
          ctx.translate(particle.x + particle.size / 2, particle.y + particle.size / 2);
          ctx.rotate((particle.rotation * Math.PI) / 180);
          
          // Draw detailed snowflake
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
          
          // Add sparkle effect
          ctx.fillStyle = '#e3f2fd';
          ctx.fillRect(-particle.size / 4, -particle.size / 4, particle.size / 2, particle.size / 2);
          
          ctx.restore();

          particle.y += particle.speed;
          particle.x += particle.drift;
          particle.rotation += 2;

          if (particle.y > canvas.height) {
            particle.y = -particle.size;
            particle.x = Math.random() * canvas.width;
          }
        } else if (condition.toLowerCase().includes('cloud')) {
          // Enhanced clouds with gradient
          ctx.save();
          ctx.globalAlpha = particle.opacity;
          
          const gradient = ctx.createRadialGradient(
            particle.x + particle.width / 2, particle.y + particle.height / 2, 0,
            particle.x + particle.width / 2, particle.y + particle.height / 2, particle.width / 2
          );
          gradient.addColorStop(0, '#ffffff');
          gradient.addColorStop(0.7, '#f5f5f5');
          gradient.addColorStop(1, 'rgba(245, 245, 245, 0)');
          
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.ellipse(
            particle.x + particle.width / 2, 
            particle.y + particle.height / 2,
            particle.width / 2, 
            particle.height / 2,
            0, 0, 2 * Math.PI
          );
          ctx.fill();
          ctx.restore();

          particle.x += particle.speed;

          if (particle.x > canvas.width + 100) {
            particle.x = -particle.width - 100;
            particle.y = Math.random() * canvas.height * 0.6;
          }
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    initParticles();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [condition, intensity]);

  // Render enhanced sun rays for clear weather
  if (condition.toLowerCase().includes('sunny') || condition.toLowerCase().includes('clear')) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 right-16 w-32 h-32">
          {/* Enhanced sun with multiple layers */}
          <div className="absolute inset-0 bg-gradient-radial from-yellow-300/40 via-orange-300/20 to-transparent rounded-full animate-pulse" />
          <div className="absolute inset-2 bg-gradient-radial from-yellow-400/60 via-orange-400/30 to-transparent rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute inset-4 bg-gradient-radial from-yellow-500/80 via-orange-500/40 to-transparent rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Enhanced sun rays */}
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-1 bg-gradient-to-t from-yellow-400/60 to-transparent origin-bottom"
              style={{
                height: '80px',
                transform: `translate(-50%, -100%) rotate(${(360 / 12) * i}deg)`,
                animation: `sunRays 3s ease-in-out infinite ${i * 0.2}s`
              }}
            />
          ))}
        </div>
        
        {/* Enhanced CSS animations */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes sunRays {
              0%, 100% { opacity: 0.3; transform: translate(-50%, -100%) scale(1); }
              50% { opacity: 0.8; transform: translate(-50%, -100%) scale(1.1); }
            }
            .bg-gradient-radial { 
              background: radial-gradient(circle, var(--tw-gradient-stops)); 
            }
          `
        }} />
      </div>
    );
  }

  // Return canvas for rain, snow, and clouds
  if (condition.toLowerCase().includes('rain') || 
      condition.toLowerCase().includes('snow') || 
      condition.toLowerCase().includes('cloud')) {
    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 10 }}
      />
    );
  }

  return null;
};

export default WeatherAnimations;