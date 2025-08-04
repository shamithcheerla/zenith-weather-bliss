import React from 'react';

interface WeatherAnimationsProps {
  condition: string;
  intensity?: 'light' | 'medium' | 'heavy';
}

const WeatherAnimations: React.FC<WeatherAnimationsProps> = ({ condition, intensity = 'medium' }) => {
  const getParticleCount = () => {
    switch (intensity) {
      case 'light': return 20;
      case 'heavy': return 60;
      default: return 40;
    }
  };

  const renderRainDrops = () => {
    const drops = [];
    const count = getParticleCount();
    
    for (let i = 0; i < count; i++) {
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 2;
      const duration = 0.5 + Math.random() * 0.5;
      
      drops.push(
        <div
          key={`rain-${i}`}
          className="absolute top-0 w-0.5 bg-gradient-to-b from-blue-400 to-transparent opacity-60"
          style={{
            left: `${left}%`,
            height: `${Math.random() * 30 + 20}px`,
            animationDelay: `${animationDelay}s`,
            animation: `rainfall ${duration}s linear infinite`
          }}
        />
      );
    }
    return drops;
  };

  const renderSnowFlakes = () => {
    const flakes = [];
    const count = Math.floor(getParticleCount() * 0.7);
    
    for (let i = 0; i < count; i++) {
      const left = Math.random() * 100;
      const animationDelay = Math.random() * 3;
      const duration = 3 + Math.random() * 2;
      const size = Math.random() * 4 + 2;
      
      flakes.push(
        <div
          key={`snow-${i}`}
          className="absolute top-0 bg-white rounded-full opacity-80"
          style={{
            left: `${left}%`,
            width: `${size}px`,
            height: `${size}px`,
            animationDelay: `${animationDelay}s`,
            animation: `snowfall ${duration}s linear infinite`
          }}
        />
      );
    }
    return flakes;
  };

  const renderClouds = () => {
    const clouds = [];
    const count = 5;
    
    for (let i = 0; i < count; i++) {
      const top = Math.random() * 40;
      const duration = 20 + Math.random() * 10;
      const size = Math.random() * 60 + 40;
      
      clouds.push(
        <div
          key={`cloud-${i}`}
          className="absolute bg-white/10 rounded-full"
          style={{
            top: `${top}%`,
            left: '-100px',
            width: `${size}px`,
            height: `${size * 0.6}px`,
            animation: `cloudDrift ${duration}s linear infinite`
          }}
        />
      );
    }
    return clouds;
  };

  const renderSunRays = () => {
    const rays = [];
    const count = 8;
    
    for (let i = 0; i < count; i++) {
      const rotation = (360 / count) * i;
      
      rays.push(
        <div
          key={`ray-${i}`}
          className="absolute top-1/2 left-1/2 w-1 h-20 bg-gradient-to-t from-yellow-400/30 to-transparent origin-bottom"
          style={{
            transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
            animation: 'sunRays 4s ease-in-out infinite'
          }}
        />
      );
    }
    return rays;
  };

  if (condition.toLowerCase().includes('rain') || condition.toLowerCase().includes('storm')) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {renderRainDrops()}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes rainfall {
              to {
                transform: translateY(100vh);
              }
            }
          `
        }} />
      </div>
    );
  }

  if (condition.toLowerCase().includes('snow')) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {renderSnowFlakes()}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes snowfall {
              to {
                transform: translateY(100vh) translateX(20px);
              }
            }
          `
        }} />
      </div>
    );
  }

  if (condition.toLowerCase().includes('cloud')) {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {renderClouds()}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes cloudDrift {
              from {
                transform: translateX(-100px);
              }
              to {
                transform: translateX(calc(100vw + 100px));
              }
            }
          `
        }} />
      </div>
    );
  }

  if (condition.toLowerCase().includes('sunny') || condition.toLowerCase().includes('clear')) {
    return (
      <div className="absolute top-20 right-20 pointer-events-none">
        {renderSunRays()}
        <div className="w-16 h-16 bg-yellow-400/20 rounded-full animate-pulse" />
      </div>
    );
  }

  return null;
};

export default WeatherAnimations;