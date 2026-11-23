import { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, RoundedBox } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import type { Group } from 'three';

export interface ViewerHandle {
  rotate: (dir: number) => void;
  zoom: (dir: number) => void;
  reset: () => void;
}

function Chip({ autoRotate, showLabels }: { autoRotate: boolean; showLabels: boolean }) {
  const g = useRef<Group>(null);
  useFrame((_, dt) => {
    if (autoRotate && g.current) g.current.rotation.y += dt * 0.25;
  });
  // 퓨리오사AI RNGD 구성: 인터포저 위 연산 칩 1개 + HBM3 2스택 (크기 비율은 근사)
  const hbm = [
    [-1.55, 0],
    [1.55, 0],
  ] as const;
  return (
    <group ref={g}>
      {/* 패키지 기판 */}
      <RoundedBox args={[4.8, 0.18, 3.7]} radius={0.05} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1f3b34" roughness={0.7} />
      </RoundedBox>
      {/* 인터포저 */}
      <mesh position={[0, 0.13, 0]}>
        <boxGeometry args={[4.2, 0.08, 2.6]} />
        <meshStandardMaterial color="#4b5563" metalness={0.3} roughness={0.5} />
      </mesh>
      {/* 연산 다이 */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[2.1, 0.12, 2.3]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.335, 0]}>
        <boxGeometry args={[1.9, 0.01, 2.1]} />
        <meshStandardMaterial color="#2dd4bf" emissive="#0f766e" emissiveIntensity={0.5} transparent opacity={0.35} />
      </mesh>
      {/* HBM 스택 */}
      {hbm.map(([x, z], i) => (
        <group key={i} position={[x, 0.17, z]}>
          {Array.from({ length: 8 }).map((_, k) => (
            <mesh key={k} position={[0, 0.05 + k * 0.03, 0]}>
              <boxGeometry args={[0.95, 0.04, 0.9]} />
              <meshStandardMaterial color={k === 7 ? '#2b2f36' : k % 2 ? '#94a3b8' : '#64748b'} metalness={0.4} roughness={0.4} />
            </mesh>
          ))}
        </group>
      ))}
      {/* 솔더 볼 느낌의 하단 점 */}
      {Array.from({ length: 48 }).map((_, i) => (
        <mesh key={i} position={[-2.2 + (i % 12) * 0.4, -0.12, -1.4 + Math.floor(i / 12) * 0.9]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
      {showLabels && (
        <>
          <Html position={[0, 0.6, 0]} center>
            <div className="label3d">연산 칩(다이)</div>
          </Html>
          <Html position={[1.55, 0.62, 0]} center>
            <div className="label3d">HBM3 스택 ×2</div>
          </Html>
          <Html position={[0, 0.2, 1.65]} center>
            <div className="label3d">인터포저·패키지 기판</div>
          </Html>
        </>
      )}
    </group>
  );
}

const ChipModel = forwardRef<ViewerHandle, { reduced: boolean }>(function ChipModel({ reduced }, ref) {
  const controls = useRef<OrbitControlsImpl>(null);
  const [showLabels] = useState(true);
  useImperativeHandle(ref, () => ({
    rotate: (dir) => {
      const c = controls.current;
      if (!c) return;
      c.setAzimuthalAngle(c.getAzimuthalAngle() + dir * (Math.PI / 8));
      c.update();
    },
    zoom: (dir) => {
      const c = controls.current;
      if (!c) return;
      const cam = c.object;
      const d = cam.position.length();
      const next = Math.min(14, Math.max(3.5, d * (dir > 0 ? 0.8 : 1.25)));
      cam.position.setLength(next);
      c.update();
    },
    reset: () => controls.current?.reset(),
  }));
  return (
    <Canvas camera={{ position: [5, 4.2, 6], fov: 40 }} dpr={[1, 1.75]} aria-hidden="true">
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />
      <directionalLight position={[-6, 3, -4]} intensity={0.4} color="#93c5fd" />
      <Chip autoRotate={!reduced} showLabels={showLabels} />
      <OrbitControls ref={controls} enablePan={false} minDistance={3.5} maxDistance={14} />
    </Canvas>
  );
});

export default ChipModel;
