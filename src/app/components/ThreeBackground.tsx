"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "motion/react";

function Particles({ count = 120 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 12;
      positions[i3 + 1] = (Math.random() - 0.5) * 10;
      positions[i3 + 2] = (Math.random() - 0.5) * 8;
    }
    return positions;
  }, [count]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime() * 0.05;
    pointsRef.current.rotation.y = t;
    pointsRef.current.rotation.x = t * 0.5;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlesPosition, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#a5b4fc"
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function AmbientCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 1.2;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight - 0.5) * 1.2;
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    // Lerp mouse interaction
    mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
    mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

    meshRef.current.rotation.x = t * 0.06 + mouseRef.current.y * 0.5;
    meshRef.current.rotation.y = t * 0.1 + mouseRef.current.x * 0.5;
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.12 + mouseRef.current.y * 0.2;
    meshRef.current.position.x = mouseRef.current.x * 0.3;
  });

  return (
    <Sphere ref={meshRef} args={[1.5, 64, 64]} position={[0.4, 0, 0]}>
      <MeshDistortMaterial
        color="#08081a"
        distort={0.38}
        speed={1.6}
        roughness={0.15}
        metalness={0.85}
        wireframe={false}
      />
    </Sphere>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[6, 6, 4]} intensity={0.7} color="#6366f1" />
      <directionalLight position={[-6, -4, -4]} intensity={0.3} color="#ffffff" />
      <pointLight position={[1, 1, 3]} intensity={0.8} color="#818cf8" />
      <AmbientCore />
      <Particles count={140} />
    </>
  );
}

export default function ThreeBackground() {
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || reduce) return null;

  return (
    <div
      className="three-canvas"
      aria-hidden="true"
      style={{ opacity: 0.6, pointerEvents: "none" }}
    >
      <Canvas
        camera={{ position: [0, 0, 4.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
