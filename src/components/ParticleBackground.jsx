import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        let ctx;
        
        try {
            ctx = canvas.getContext('2d');
            if (!ctx) {
                console.error('Could not get 2D context');
                return;
            }
        } catch (e) {
            console.error('Error getting canvas context:', e);
            return;
        }

        let animationFrameId;
        
        // Set canvas size
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        handleResize();
        
        // Particle array and mouse tracking
        let particlesArray = [];
        const numberOfParticles = 100;
        const mouse = { 
            x: null, 
            y: null, 
            radius: 150 
        };
        
        // Mouse movement handler
        const handleMouseMove = (event) => { 
            mouse.x = event.clientX; 
            mouse.y = event.clientY; 
        };
        
        window.addEventListener('mousemove', handleMouseMove);

        // Particle class
        class Particle {
            constructor(x, y, directionX, directionY, size, color) {
                this.x = x; 
                this.y = y; 
                this.directionX = directionX; 
                this.directionY = directionY; 
                this.size = size; 
                this.color = color;
            }
            
            draw() {
                ctx.beginPath(); 
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false); 
                ctx.fillStyle = this.color; 
                ctx.fill();
            }
            
            update() {
                // Bounce off edges
                if (this.x > canvas.width || this.x < 0) { 
                    this.directionX = -this.directionX; 
                }
                if (this.y > canvas.height || this.y < 0) { 
                    this.directionY = -this.directionY; 
                }
                
                // Mouse interaction
                let dx = mouse.x - this.x; 
                let dy = mouse.y - this.y; 
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 10) { 
                        this.x += 5; 
                    }
                    if (mouse.x > this.x && this.x > this.size * 10) { 
                        this.x -= 5; 
                    }
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 10) { 
                        this.y += 5; 
                    }
                    if (mouse.y > this.y && this.y > this.size * 10) { 
                        this.y -= 5; 
                    }
                }
                
                // Move particle
                this.x += this.directionX; 
                this.y += this.directionY; 
                this.draw();
            }
        }
        
        // Initialize particles
        function init() {
            particlesArray = [];
            for (let i = 0; i < numberOfParticles; i++) {
                let size = (Math.random() * 2) + 1;
                let x = (Math.random() * ((window.innerWidth - size * 2) - (size * 2))) + size * 2;
                let y = (Math.random() * ((window.innerHeight - size * 2) - (size * 2))) + size * 2;
                let directionX = (Math.random() * 0.4) - 0.2; 
                let directionY = (Math.random() * 0.4) - 0.2;
                let color = 'rgba(16, 185, 129, 0.5)';
                particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
            }
        }
        
        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particlesArray.length; i++) { 
                particlesArray[i].update(); 
            }
            
            animationFrameId = requestAnimationFrame(animate);
        }
        
        // Initialize and start animation
        init();
        animate();
        
        // Add event listeners
        window.addEventListener('resize', handleResize);
        
        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);
    
    return (
        <canvas 
            ref={canvasRef} 
            className="fixed top-0 left-0 w-full h-full -z-10"
        />
    );
};

export default ParticleBackground;