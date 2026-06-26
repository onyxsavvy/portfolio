import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ServicesCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    // Default camera aspect ratio, will be updated on resize
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 30;

    // Particles Constellation
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);

    const color1 = new THREE.Color('#A3E635'); // Accent Lime
    const color2 = new THREE.Color('#38BDF8'); // Cyan

    for (let i = 0; i < particlesCount * 3; i += 3) {
      // Create a large bounding box
      posArray[i] = (Math.random() - 0.5) * 150;     // x
      posArray[i + 1] = (Math.random() - 0.5) * 150; // y
      posArray[i + 2] = (Math.random() - 0.5) * 150; // z

      const mixRatio = Math.random();
      const mixedColor = color1.clone().lerp(color2, mixRatio);
      colorsArray[i] = mixedColor.r;
      colorsArray[i + 1] = mixedColor.g;
      colorsArray[i + 2] = mixedColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

    const material = new THREE.PointsMaterial({
      size: 0.25,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (!mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      // Only track if mouse is within/near section to save processing
      if (event.clientY >= rect.top && event.clientY <= rect.bottom) {
        mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const updateSize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.offsetWidth;
      const height = mountRef.current.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', updateSize);
    updateSize(); // Initial call

    // Animation Loop
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Endless particle drift based on cursor moves + forward Z movement
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      
      // Target speeds based on mouse position
      const targetSpeedX = mouseX * 0.5;
      const targetSpeedY = mouseY * 0.5;

      for (let i = 0; i < particlesCount * 3; i += 3) {
        // Move particles according to cursor
        positions[i] += targetSpeedX;
        positions[i + 1] += targetSpeedY;
        
        // Constant forward movement (fly-through)
        positions[i + 2] += 0.15; 

        // Wrap around Z (depth)
        if (positions[i + 2] > 50) {
          positions[i + 2] = -150; 
          positions[i] = (Math.random() - 0.5) * 150;
          positions[i + 1] = (Math.random() - 0.5) * 150;
        }

        // Wrap around X (horizontal)
        if (positions[i] > 100) positions[i] = -100;
        else if (positions[i] < -100) positions[i] = 100;

        // Wrap around Y (vertical)
        if (positions[i + 1] > 100) positions[i + 1] = -100;
        else if (positions[i + 1] < -100) positions[i + 1] = 100;
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      // Subtle slow rotation for dynamic feel
      particlesMesh.rotation.y = elapsedTime * 0.02;
      particlesMesh.rotation.z = elapsedTime * 0.01;

      // Smooth Camera Parallax
      targetX = mouseX * 5;
      targetY = mouseY * 5;
      
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      particlesGeometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-screen"
    />
  );
}
