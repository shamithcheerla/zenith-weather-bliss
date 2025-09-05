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

    // Advanced 3D particle system for immersive weather effects
    const initParticles = () => {
      particles.length = 0;
      const count = getParticleCount();

      for (let i = 0; i < count; i++) {
        if (condition.toLowerCase().includes('rain')) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            z: Math.random() * 150,
            width: 2 + Math.random() * 4,
            height: 18 + Math.random() * 35,
            speed: 10 + Math.random() * 18,
            opacity: 0.6 + Math.random() * 0.4,
            angle: Math.random() * 0.4 - 0.2,
            color: `hsl(${190 + Math.random() * 50}, ${70 + Math.random() * 30}%, ${45 + Math.random() * 25}%)`,
            splashTimer: 0,
            rippleRadius: 0
          });
        } else if (condition.toLowerCase().includes('sunny') || condition.toLowerCase().includes('clear')) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            z: Math.random() * 200,
            size: 1 + Math.random() * 3,
            speed: 0.2 + Math.random() * 0.8,
            opacity: 0.1 + Math.random() * 0.3,
            drift: Math.random() * 2 - 1,
            float: Math.random() * 2 - 1,
            shimmer: Math.random() > 0.8
          });
        } else if (condition.toLowerCase().includes('snow')) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            z: Math.random() * 180,
            size: 5 + Math.random() * 15,
            speed: 1.5 + Math.random() * 5,
            opacity: 0.8 + Math.random() * 0.2,
            drift: Math.random() * 4 - 2,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 6 - 3,
            sparkle: Math.random() > 0.6,
            crystal: Math.random() > 0.7,
            accumulated: false
          });
        } else if (condition.toLowerCase().includes('cloud')) {
          particles.push({
            x: Math.random() * (canvas.width + 400) - 200,
            y: Math.random() * canvas.height * 0.8,
            z: Math.random() * 120,
            width: 120 + Math.random() * 280,
            height: 60 + Math.random() * 140,
            speed: 0.3 + Math.random() * 1.2,
            opacity: 0.2 + Math.random() * 0.3,
            puffiness: Math.random() * 0.7 + 0.6,
            color: `hsl(210, ${15 + Math.random() * 25}%, ${80 + Math.random() * 15}%)`,
            layer: Math.floor(Math.random() * 3)
          });
        } else if (condition.toLowerCase().includes('storm') || condition.toLowerCase().includes('thunder')) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            z: Math.random() * 160,
            width: 4 + Math.random() * 5,
            height: 25 + Math.random() * 40,
            speed: 15 + Math.random() * 25,
            opacity: 0.7 + Math.random() * 0.3,
            angle: Math.random() * 0.5 - 0.25,
            color: `hsl(${210 + Math.random() * 30}, ${65 + Math.random() * 30}%, ${35 + Math.random() * 25}%)`,
            lightning: Math.random() > 0.92,
            electricCharge: Math.random() * 100,
            windForce: Math.random() * 3 + 1
          });
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        if (condition.toLowerCase().includes('sunny') || condition.toLowerCase().includes('clear')) {
          // Floating dust particles and heat shimmer effects
          ctx.save();
          const depthScale = (particle.z + 50) / 250;
          ctx.globalAlpha = particle.opacity * depthScale * 0.6;
          
          if (particle.shimmer) {
            const shimmerGradient = ctx.createRadialGradient(
              particle.x, particle.y, 0,
              particle.x, particle.y, particle.size * 3
            );
            shimmerGradient.addColorStop(0, 'rgba(255, 223, 0, 0.4)');
            shimmerGradient.addColorStop(1, 'rgba(255, 223, 0, 0)');
            ctx.fillStyle = shimmerGradient;
            ctx.fillRect(particle.x - particle.size * 3, particle.y - particle.size * 3, particle.size * 6, particle.size * 6);
          }
          
          ctx.fillStyle = `rgba(255, 215, 0, ${0.3 * depthScale})`;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * depthScale, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          particle.x += particle.drift;
          particle.y += particle.float;
          particle.z += 0.1;

          if (particle.x < -20 || particle.x > canvas.width + 20 || 
              particle.y < -20 || particle.y > canvas.height + 20) {
            particle.x = Math.random() * canvas.width;
            particle.y = Math.random() * canvas.height;
            particle.z = Math.random() * 200;
          }
        } else if (condition.toLowerCase().includes('rain') && !condition.toLowerCase().includes('storm')) {
          // Ultra-realistic 3D rain with splash effects
          ctx.save();
          const depthScale = (particle.z + 75) / 225;
          ctx.globalAlpha = particle.opacity * depthScale;
          
          const gradient = ctx.createLinearGradient(
            particle.x, particle.y,
            particle.x, particle.y + particle.height
          );
          gradient.addColorStop(0, particle.color || '#00d4ff');
          gradient.addColorStop(0.4, particle.color || '#0099cc');
          gradient.addColorStop(1, 'rgba(0, 180, 255, 0)');
          
          ctx.fillStyle = gradient;
          ctx.shadowColor = '#00b4d8';
          ctx.shadowBlur = 4;
          ctx.fillRect(particle.x, particle.y, particle.width * depthScale, particle.height * depthScale);
          
          // Add splash effect when hitting ground
          if (particle.y > canvas.height - 50 && particle.splashTimer < 10) {
            particle.splashTimer++;
            particle.rippleRadius += 2;
            ctx.strokeStyle = `rgba(0, 180, 255, ${(10 - particle.splashTimer) * 0.1})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(particle.x, canvas.height - 10, particle.rippleRadius, 0, Math.PI * 2);
            ctx.stroke();
          }
          
          ctx.restore();

          particle.y += particle.speed * depthScale;
          particle.x += particle.angle * 4;
          particle.z += 0.7;

          if (particle.y > canvas.height) {
            particle.y = -particle.height;
            particle.x = Math.random() * canvas.width;
            particle.z = Math.random() * 150;
            particle.splashTimer = 0;
            particle.rippleRadius = 0;
          }
        } else if (condition.toLowerCase().includes('snow')) {
          // Ultra-detailed 3D snowflakes with ice crystal formations
          ctx.save();
          const depthScale = (particle.z + 90) / 270;
          ctx.globalAlpha = particle.opacity * depthScale;
          ctx.translate(particle.x + particle.size / 2, particle.y + particle.size / 2);
          ctx.rotate((particle.rotation * Math.PI) / 180);
          
          const size = particle.size * depthScale;
          
          if (particle.crystal) {
            // Ice crystal formation - more complex structure
            ctx.strokeStyle = `rgba(200, 230, 255, ${0.9 * depthScale})`;
            ctx.lineWidth = 1.5;
            ctx.shadowColor = '#cce7ff';
            ctx.shadowBlur = 8;
            
            ctx.beginPath();
            for (let i = 0; i < 8; i++) {
              ctx.moveTo(0, 0);
              ctx.lineTo(0, -size * 1.2);
              // Add fractal branches
              for (let j = 0; j < 3; j++) {
                const branchY = -size * (0.3 + j * 0.3);
                ctx.moveTo(0, branchY);
                ctx.lineTo(-size * 0.2, branchY - size * 0.1);
                ctx.moveTo(0, branchY);
                ctx.lineTo(size * 0.2, branchY - size * 0.1);
              }
              ctx.rotate(Math.PI / 4);
            }
            ctx.stroke();
          } else {
            // Regular detailed snowflake
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#e3f2fd';
            ctx.shadowBlur = 8;
            
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
            ctx.lineWidth = 2.5;
            ctx.stroke();
          }
          
          // Enhanced sparkle effect
          if (particle.sparkle) {
            const sparkleSize = size * 0.15;
            ctx.fillStyle = '#f0f8ff';
            ctx.shadowBlur = 12;
            ctx.fillRect(-sparkleSize, -sparkleSize, sparkleSize * 2, sparkleSize * 2);
            ctx.fillRect(-sparkleSize * 0.5, -sparkleSize * 1.5, sparkleSize, sparkleSize * 3);
            ctx.fillRect(-sparkleSize * 1.5, -sparkleSize * 0.5, sparkleSize * 3, sparkleSize);
          }
          
          ctx.restore();

          particle.y += particle.speed * depthScale;
          particle.x += particle.drift * (1 + Math.sin(Date.now() * 0.001 + index) * 0.5);
          particle.rotation += particle.rotationSpeed;
          particle.z += 0.4;

          if (particle.y > canvas.height) {
            particle.y = -particle.size;
            particle.x = Math.random() * canvas.width;
            particle.z = Math.random() * 180;
          }
        } else if (condition.toLowerCase().includes('cloud')) {
          // Ultra-realistic 3D clouds with parallax layers
          ctx.save();
          const depthScale = (particle.z + 60) / 180;
          const layerOpacity = [0.4, 0.6, 0.8][particle.layer] || 0.5;
          ctx.globalAlpha = particle.opacity * depthScale * layerOpacity;
          
          // Create layered gradient for depth
          const gradient = ctx.createRadialGradient(
            particle.x + particle.width / 2, particle.y + particle.height / 2, 0,
            particle.x + particle.width / 2, particle.y + particle.height / 2, (particle.width / 2) * depthScale
          );
          gradient.addColorStop(0, particle.color || '#ffffff');
          gradient.addColorStop(0.5, particle.color || '#f5f7fa');
          gradient.addColorStop(0.8, 'rgba(245, 247, 250, 0.6)');
          gradient.addColorStop(1, 'rgba(245, 247, 250, 0)');
          
          ctx.fillStyle = gradient;
          
          // Enhanced puffy cloud with more realistic shapes
          const puffs = 7 + Math.floor(particle.puffiness * 4);
          for (let i = 0; i < puffs; i++) {
            const time = Date.now() * 0.0005;
            const puffX = particle.x + (particle.width * i) / puffs + 
                          Math.sin(time + i * 0.5) * 15 * particle.layer;
            const puffY = particle.y + Math.cos(time + i * 0.3) * 8 +
                          Math.sin(time * 0.7 + i) * 5;
            const puffSize = (particle.width / puffs) * (1 + particle.puffiness * 0.7) * depthScale;
            const puffHeight = puffSize * (0.6 + Math.sin(time + i) * 0.2);
            
            ctx.beginPath();
            ctx.ellipse(puffX, puffY, puffSize, puffHeight, Math.sin(time + i) * 0.1, 0, 2 * Math.PI);
            ctx.fill();
          }
          
          // Add subtle cloud wisps
          if (particle.layer === 2) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * depthScale})`;
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
              ctx.beginPath();
              ctx.moveTo(particle.x + i * 50, particle.y + particle.height * 0.8);
              ctx.quadraticCurveTo(
                particle.x + i * 50 + 30, particle.y + particle.height * 0.6,
                particle.x + i * 50 + 60, particle.y + particle.height * 0.8
              );
              ctx.stroke();
            }
          }
          
          ctx.restore();

          particle.x += particle.speed * (1 + particle.layer * 0.3);
          particle.z += 0.3;

          if (particle.x > canvas.width + 200) {
            particle.x = -particle.width - 200;
            particle.y = Math.random() * canvas.height * 0.8;
            particle.z = Math.random() * 120;
          }
        } else if (condition.toLowerCase().includes('storm') || condition.toLowerCase().includes('thunder')) {
          // Epic storm with dramatic lightning and wind effects
          ctx.save();
          const depthScale = (particle.z + 80) / 240;
          ctx.globalAlpha = particle.opacity * depthScale;
          
          // Intense storm rain with electric effects
          const gradient = ctx.createLinearGradient(
            particle.x, particle.y,
            particle.x, particle.y + particle.height
          );
          gradient.addColorStop(0, particle.color || '#0066ff');
          gradient.addColorStop(0.3, '#003d99');
          gradient.addColorStop(0.7, '#001a66');
          gradient.addColorStop(1, 'rgba(0, 26, 102, 0)');
          
          ctx.fillStyle = gradient;
          
          if (particle.lightning) {
            // Dramatic lightning bolt with branching
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.9 + Math.random() * 0.1})`;
            ctx.lineWidth = 4 + Math.random() * 3;
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 20;
            
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            let currentX = particle.x;
            let currentY = particle.y;
            
            // Create zigzag lightning pattern
            for (let i = 0; i < 5; i++) {
              const nextX = currentX + (Math.random() * 60 - 30);
              const nextY = currentY + particle.height * 0.2;
              ctx.lineTo(nextX, nextY);
              
              // Add branches
              if (Math.random() > 0.7) {
                ctx.moveTo(nextX, nextY);
                ctx.lineTo(nextX + (Math.random() * 40 - 20), nextY + 30);
                ctx.moveTo(nextX, nextY);
              }
              
              currentX = nextX;
              currentY = nextY;
            }
            ctx.stroke();
            
            // Electric charge effect
            const chargeRadius = 30 + particle.electricCharge * 0.2;
            const chargeGradient = ctx.createRadialGradient(
              particle.x, particle.y, 0,
              particle.x, particle.y, chargeRadius
            );
            chargeGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            chargeGradient.addColorStop(0.5, 'rgba(150, 200, 255, 0.2)');
            chargeGradient.addColorStop(1, 'rgba(150, 200, 255, 0)');
            
            ctx.fillStyle = chargeGradient;
            ctx.fillRect(particle.x - chargeRadius, particle.y - chargeRadius, chargeRadius * 2, chargeRadius * 2);
          } else {
            // Heavy rain with wind distortion
            ctx.shadowColor = '#0066ff';
            ctx.shadowBlur = 6;
            
            const windOffset = Math.sin(Date.now() * 0.01 + index) * particle.windForce;
            ctx.fillRect(
              particle.x + windOffset, 
              particle.y, 
              particle.width * depthScale, 
              particle.height * depthScale
            );
          }
          
          ctx.restore();

          particle.y += particle.speed * depthScale;
          particle.x += particle.angle * 6 + Math.sin(Date.now() * 0.005 + index) * 2;
          particle.z += 0.9;
          particle.electricCharge = (particle.electricCharge + 1) % 100;

          if (particle.y > canvas.height || (particle.lightning && Math.random() > 0.6)) {
            particle.y = -particle.height;
            particle.x = Math.random() * canvas.width;
            particle.z = Math.random() * 160;
            particle.lightning = Math.random() > 0.92;
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