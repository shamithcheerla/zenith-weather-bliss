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

    // Enhanced 3D particle system for different weather conditions
    const initParticles = () => {
      particles.length = 0;
      const count = getParticleCount();

      for (let i = 0; i < count; i++) {
        if (condition.toLowerCase().includes('rain')) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            z: Math.random() * 100,
            width: 2 + Math.random() * 3,
            height: 15 + Math.random() * 25,
            speed: 8 + Math.random() * 15,
            opacity: 0.5 + Math.random() * 0.5,
            angle: Math.random() * 0.3 - 0.15,
            color: `hsl(${200 + Math.random() * 40}, ${70 + Math.random() * 30}%, ${50 + Math.random() * 20}%)`
          });
        } else if (condition.toLowerCase().includes('snow')) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            z: Math.random() * 150,
            size: 4 + Math.random() * 12,
            speed: 1 + Math.random() * 4,
            opacity: 0.7 + Math.random() * 0.3,
            drift: Math.random() * 3 - 1.5,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 4 - 2,
            sparkle: Math.random() > 0.7
          });
        } else if (condition.toLowerCase().includes('cloud')) {
          particles.push({
            x: Math.random() * (canvas.width + 300) - 150,
            y: Math.random() * canvas.height * 0.7,
            z: Math.random() * 80,
            width: 100 + Math.random() * 200,
            height: 50 + Math.random() * 100,
            speed: 0.2 + Math.random() * 0.8,
            opacity: 0.15 + Math.random() * 0.25,
            puffiness: Math.random() * 0.5 + 0.5,
            color: `hsl(210, ${10 + Math.random() * 20}%, ${85 + Math.random() * 10}%)`
          });
        } else if (condition.toLowerCase().includes('storm') || condition.toLowerCase().includes('thunder')) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            z: Math.random() * 120,
            width: 3 + Math.random() * 4,
            height: 20 + Math.random() * 30,
            speed: 12 + Math.random() * 20,
            opacity: 0.6 + Math.random() * 0.4,
            angle: Math.random() * 0.4 - 0.2,
            color: `hsl(${220 + Math.random() * 20}, ${60 + Math.random() * 30}%, ${40 + Math.random() * 20}%)`,
            lightning: Math.random() > 0.95
          });
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        if (condition.toLowerCase().includes('rain') && !condition.toLowerCase().includes('storm')) {
          // Enhanced 3D rain with depth and color
          ctx.save();
          const depthScale = (particle.z + 50) / 150;
          ctx.globalAlpha = particle.opacity * depthScale;
          
          const gradient = ctx.createLinearGradient(
            particle.x, particle.y,
            particle.x, particle.y + particle.height
          );
          gradient.addColorStop(0, particle.color || '#00bcd4');
          gradient.addColorStop(0.6, particle.color || '#0097a7');
          gradient.addColorStop(1, 'rgba(0, 188, 212, 0)');
          
          ctx.fillStyle = gradient;
          ctx.shadowColor = '#00bcd4';
          ctx.shadowBlur = 3;
          ctx.fillRect(particle.x, particle.y, particle.width * depthScale, particle.height * depthScale);
          ctx.restore();

          particle.y += particle.speed * depthScale;
          particle.x += particle.angle * 3;
          particle.z += 0.5;

          if (particle.y > canvas.height) {
            particle.y = -particle.height;
            particle.x = Math.random() * canvas.width;
            particle.z = Math.random() * 100;
          }
        } else if (condition.toLowerCase().includes('snow')) {
          // Enhanced 3D snowflakes with sparkle and rotation
          ctx.save();
          const depthScale = (particle.z + 70) / 220;
          ctx.globalAlpha = particle.opacity * depthScale;
          ctx.translate(particle.x + particle.size / 2, particle.y + particle.size / 2);
          ctx.rotate((particle.rotation * Math.PI) / 180);
          
          // Main snowflake body with depth
          const size = particle.size * depthScale;
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#e3f2fd';
          ctx.shadowBlur = 6;
          
          // Draw detailed 6-pointed snowflake
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -size);
            ctx.moveTo(0, -size * 0.7);
            ctx.lineTo(-size * 0.3, -size * 0.9);
            ctx.moveTo(0, -size * 0.7);
            ctx.lineTo(size * 0.3, -size * 0.9);
            ctx.rotate(Math.PI / 3);
          }
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
          
          // Sparkle effect
          if (particle.sparkle) {
            ctx.fillStyle = '#e1f5fe';
            ctx.fillRect(-size * 0.2, -size * 0.2, size * 0.4, size * 0.4);
          }
          
          ctx.restore();

          particle.y += particle.speed * depthScale;
          particle.x += particle.drift;
          particle.rotation += particle.rotationSpeed;
          particle.z += 0.3;

          if (particle.y > canvas.height) {
            particle.y = -particle.size;
            particle.x = Math.random() * canvas.width;
            particle.z = Math.random() * 150;
          }
        } else if (condition.toLowerCase().includes('cloud')) {
          // Enhanced 3D clouds with realistic puffiness
          ctx.save();
          const depthScale = (particle.z + 30) / 110;
          ctx.globalAlpha = particle.opacity * depthScale;
          
          const gradient = ctx.createRadialGradient(
            particle.x + particle.width / 2, particle.y + particle.height / 2, 0,
            particle.x + particle.width / 2, particle.y + particle.height / 2, (particle.width / 2) * depthScale
          );
          gradient.addColorStop(0, particle.color || '#ffffff');
          gradient.addColorStop(0.7, particle.color || '#f8f9fa');
          gradient.addColorStop(1, 'rgba(248, 249, 250, 0)');
          
          ctx.fillStyle = gradient;
          
          // Draw multiple overlapping circles for puffy cloud effect
          const puffs = 5 + Math.floor(particle.puffiness * 3);
          for (let i = 0; i < puffs; i++) {
            const puffX = particle.x + (particle.width * i) / puffs + Math.sin(Date.now() * 0.001 + i) * 10;
            const puffY = particle.y + Math.cos(Date.now() * 0.0008 + i) * 5;
            const puffSize = (particle.width / puffs) * (1 + particle.puffiness * 0.5) * depthScale;
            
            ctx.beginPath();
            ctx.ellipse(puffX, puffY, puffSize, puffSize * 0.7, 0, 0, 2 * Math.PI);
            ctx.fill();
          }
          
          ctx.restore();

          particle.x += particle.speed;
          particle.z += 0.2;

          if (particle.x > canvas.width + 150) {
            particle.x = -particle.width - 150;
            particle.y = Math.random() * canvas.height * 0.7;
            particle.z = Math.random() * 80;
          }
        } else if (condition.toLowerCase().includes('storm') || condition.toLowerCase().includes('thunder')) {
          // Enhanced storm with lightning effects
          ctx.save();
          const depthScale = (particle.z + 60) / 180;
          ctx.globalAlpha = particle.opacity * depthScale;
          
          // Storm rain with electric blue tint
          const gradient = ctx.createLinearGradient(
            particle.x, particle.y,
            particle.x, particle.y + particle.height
          );
          gradient.addColorStop(0, particle.color || '#1e88e5');
          gradient.addColorStop(0.5, '#1565c0');
          gradient.addColorStop(1, 'rgba(21, 101, 192, 0)');
          
          ctx.fillStyle = gradient;
          ctx.shadowColor = particle.lightning ? '#ffffff' : '#1e88e5';
          ctx.shadowBlur = particle.lightning ? 15 : 5;
          
          if (particle.lightning) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle.x + Math.random() * 20 - 10, particle.y + particle.height * 0.3);
            ctx.lineTo(particle.x + Math.random() * 30 - 15, particle.y + particle.height * 0.7);
            ctx.lineTo(particle.x + Math.random() * 40 - 20, particle.y + particle.height);
            ctx.stroke();
          } else {
            ctx.fillRect(particle.x, particle.y, particle.width * depthScale, particle.height * depthScale);
          }
          
          ctx.restore();

          particle.y += particle.speed * depthScale;
          particle.x += particle.angle * 4;
          particle.z += 0.7;

          if (particle.y > canvas.height || (particle.lightning && Math.random() > 0.7)) {
            particle.y = -particle.height;
            particle.x = Math.random() * canvas.width;
            particle.z = Math.random() * 120;
            particle.lightning = Math.random() > 0.95;
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

  // Return canvas for rain, snow, clouds, and storms
  if (condition.toLowerCase().includes('rain') || 
      condition.toLowerCase().includes('snow') || 
      condition.toLowerCase().includes('cloud') ||
      condition.toLowerCase().includes('storm') ||
      condition.toLowerCase().includes('thunder')) {
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