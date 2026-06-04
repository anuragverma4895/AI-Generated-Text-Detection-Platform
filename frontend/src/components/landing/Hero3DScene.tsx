"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function Hero3DScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.15, 8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const ambient = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambient);

    const keyLight = new THREE.PointLight(0x22d3ee, 38, 16);
    keyLight.position.set(-3, 3, 5);
    scene.add(keyLight);

    const violetLight = new THREE.PointLight(0xa855f7, 28, 14);
    violetLight.position.set(4, -2, 4);
    scene.add(violetLight);

    const documentMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xe8f7ff,
      metalness: 0.05,
      roughness: 0.42,
      transmission: 0.08,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide,
    });

    const accentMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.5,
      roughness: 0.25,
      metalness: 0.15,
    });

    const warnMaterial = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xbe123c,
      emissiveIntensity: 0.45,
      roughness: 0.3,
    });

    const panels: THREE.Mesh[] = [];
    const panelGeometry = new THREE.BoxGeometry(1.35, 1.75, 0.045, 8, 8, 1);
    const positions = [
      [-2.15, 0.45, -1.2, -0.45],
      [0, 0.05, 0, 0.05],
      [2.1, -0.35, -1.0, 0.38],
    ];

    positions.forEach(([x, y, z, rotation], index) => {
      const panel = new THREE.Mesh(panelGeometry, documentMaterial);
      panel.position.set(x, y, z);
      panel.rotation.set(0.16, rotation, index === 1 ? -0.02 : 0.08);
      group.add(panel);
      panels.push(panel);

      for (let line = 0; line < 5; line += 1) {
        const width = line === 2 ? 0.86 : 0.58 + Math.random() * 0.38;
        const lineMesh = new THREE.Mesh(
          new THREE.BoxGeometry(width, 0.035, 0.018),
          line === 2 ? warnMaterial : accentMaterial
        );
        lineMesh.position.set(x - 0.15 + width * 0.08, y + 0.48 - line * 0.22, z + 0.05);
        lineMesh.rotation.copy(panel.rotation);
        group.add(lineMesh);
      }
    });

    const ringMaterial = new THREE.MeshStandardMaterial({
      color: 0x14b8a6,
      emissive: 0x0f766e,
      emissiveIntensity: 0.7,
      roughness: 0.15,
      metalness: 0.25,
    });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.018, 16, 96), ringMaterial);
    ring.position.set(0, 0.05, 0.35);
    ring.rotation.set(1.35, 0.1, 0.1);
    group.add(ring);

    const scanLine = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 0.025, 0.025),
      new THREE.MeshStandardMaterial({
        color: 0x67e8f9,
        emissive: 0x22d3ee,
        emissiveIntensity: 1.4,
      })
    );
    scanLine.position.set(0, -0.6, 0.65);
    group.add(scanLine);

    const particleCount = 130;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 9;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 4.8;
      particlePositions[i * 3 + 2] = -3.6 + Math.random() * 2.8;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particles = new THREE.Points(
      particleGeometry,
      new THREE.PointsMaterial({
        color: 0x8b5cf6,
        size: 0.025,
        transparent: true,
        opacity: 0.72,
      })
    );
    scene.add(particles);

    const mouse = new THREE.Vector2(0, 0);
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    resize();
    window.addEventListener("resize", resize);

    let animationFrame = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      group.rotation.y = mouse.x * 0.12;
      group.rotation.x = -mouse.y * 0.05;
      ring.rotation.z = elapsed * 0.32;
      scanLine.position.y = Math.sin(elapsed * 1.35) * 0.82;
      particles.rotation.y = elapsed * 0.025;

      panels.forEach((panel, index) => {
        panel.position.y = positions[index][1] + Math.sin(elapsed + index * 0.75) * 0.08;
      });

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      panelGeometry.dispose();
      particleGeometry.dispose();
      documentMaterial.dispose();
      accentMaterial.dispose();
      warnMaterial.dispose();
      ringMaterial.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="hero-3d-scene" aria-hidden="true" />;
}
