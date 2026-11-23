import { createContext, useContext, useLayoutEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Group, InstancedMesh, MeshStandardMaterial, Object3D, PerspectiveCamera, Vector3 } from 'three';
import {
  CARD, CARD_CZ, CARD_LIFT, CARDS, cardCY, cardLocalToWorld, cardX, effective, HALL, HBM_X, keyframes, phase,
  PKG, PKG_LOCAL, RACK, RACK_FRONT_Z, RACKS_PER_ROW, rackX, ROW_Z, SERVER, SERVER_CZ, SERVER_FRONT_Z, SERVER_SLIDE, serverBottomY,
  SERVERS_IN_RACK, TARGET_CARD, TARGET_RACK, TARGET_ROW, TARGET_SERVER, U,
} from './world';

export const ROLE_COLOR = {
  compute: '#fb923c',
  memory: '#60a5fa',
  link: '#f472b6',
  package: '#9ca3af',
  cooling: '#cbd5e1',
  other: '#64748b',
};

/* ───── 선택·하이라이트 ───── */
const Sel = createContext<{ sel: string | null; onSelect: (id: string) => void }>({ sel: null, onSelect: () => {} });

function Mat({ id, color, metal = 0.25, rough = 0.6, opacity = 1, emissive }: { id?: string; color: string; metal?: number; rough?: number; opacity?: number; emissive?: string }) {
  const { sel } = useContext(Sel);
  const on = !!id && sel === id;
  return (
    <meshStandardMaterial
      color={color}
      metalness={metal}
      roughness={rough}
      transparent={opacity < 1}
      opacity={opacity}
      emissive={on ? '#fde047' : emissive ?? '#000000'}
      emissiveIntensity={on ? 0.6 : emissive ? 0.9 : 0}
    />
  );
}

/** 클릭 가능한 박스 */
function Bx({ id, p, s, color, metal, rough, opacity, r }: { id?: string; p: [number, number, number]; s: [number, number, number]; color: string; metal?: number; rough?: number; opacity?: number; r?: [number, number, number] }) {
  const { onSelect } = useContext(Sel);
  return (
    <mesh
      position={p}
      rotation={r}
      onClick={id ? (e) => { e.stopPropagation(); onSelect(id); } : undefined}
      onPointerOver={id ? (e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; } : undefined}
      onPointerOut={id ? () => { document.body.style.cursor = ''; } : undefined}
    >
      <boxGeometry args={s} />
      <Mat id={id} color={color} metal={metal} rough={rough} opacity={opacity} />
    </mesh>
  );
}

/** 같은 상자를 여러 개 — 인스턴싱 */
function Inst({ pts, size, color, emissive, metal = 0.3, rough = 0.6, id }: { pts: [number, number, number][]; size: [number, number, number]; color: string; emissive?: string; metal?: number; rough?: number; id?: string }) {
  const ref = useRef<InstancedMesh>(null);
  const { onSelect } = useContext(Sel);
  useLayoutEffect(() => {
    const o = new Object3D();
    pts.forEach((p, i) => {
      o.position.set(...p);
      o.updateMatrix();
      ref.current!.setMatrixAt(i, o.matrix);
    });
    ref.current!.instanceMatrix.needsUpdate = true;
    ref.current!.computeBoundingSphere();
  }, [pts]);
  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, pts.length]}
      onClick={id ? (e) => { e.stopPropagation(); onSelect(id); } : undefined}
    >
      <boxGeometry args={size} />
      <Mat id={id} color={color} emissive={emissive} metal={metal} rough={rough} />
    </instancedMesh>
  );
}

/* ───── 라벨 ───── */
function Label({ p, text, id, show }: { p: Vector3 | [number, number, number]; text: string; id?: string; show: boolean }) {
  const { sel } = useContext(Sel);
  if (!show) return null;
  const pos = Array.isArray(p) ? p : (p.toArray() as [number, number, number]);
  return (
    <Html position={pos} center zIndexRange={[5, 0]}>
      <div className={`label3d ${id && sel === id ? 'active' : ''}`}>{text}</div>
    </Html>
  );
}

/* ───── 데이터센터 홀 ───── */
function Hall() {
  const racks = useMemo(() => {
    const out: [number, number, number][] = [];
    ROW_Z.forEach((z, r) => {
      for (let i = 0; i < RACKS_PER_ROW; i++) {
        if (r === TARGET_ROW && i === TARGET_RACK) continue;
        out.push([rackX(i), RACK.h / 2, z]);
      }
    });
    return out;
  }, []);
  const faces = useMemo(() => {
    const out: [number, number, number][] = [];
    racks.forEach(([x, , z]) => {
      for (let k = 0; k < 9; k++) out.push([x, 0.25 + k * 0.19, z + RACK.d / 2 + 0.004]);
    });
    return out;
  }, [racks]);
  const leds = useMemo(() => faces.map(([x, y, z]) => [x + 0.22, y, z + 0.004] as [number, number, number]), [faces]);
  const trays = ROW_Z.map((z) => [0, 2.45, z] as [number, number, number]);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[HALL.w, HALL.d]} />
        <meshStandardMaterial color="#1a2234" roughness={0.9} />
      </mesh>
      <gridHelper args={[HALL.w, 46, '#2a3655', '#222c45']} position={[0, 0.002, 0]} />
      <Inst pts={racks} size={[RACK.w, RACK.h, RACK.d]} color="#1f2937" metal={0.5} rough={0.5} id="dc-rack" />
      <Inst pts={faces} size={[0.54, 0.16, 0.006]} color="#334155" metal={0.4} />
      <Inst pts={leds} size={[0.012, 0.012, 0.004]} color="#22d3ee" emissive="#22d3ee" />
      {trays.map((p, i) => (
        <Bx key={i} id="dc-net" p={p} s={[RACKS_PER_ROW * RACK.pitch, 0.06, 0.3]} color={ROLE_COLOR.link} metal={0.4} />
      ))}
      {[-6, -2, 2, 6].map((x) => (
        <Bx key={x} id="dc-cool" p={[x, 1.1, -7.6]} s={[1.6, 2.2, 0.9]} color={ROLE_COLOR.cooling} metal={0.2} />
      ))}
      <mesh position={[0, 1.6, -8.5]}>
        <boxGeometry args={[HALL.w, 3.2, 0.1]} />
        <meshStandardMaterial color="#121a2b" />
      </mesh>
    </group>
  );
}

/* ───── 대상 랙 (문을 연 상태) ───── */
function TargetRack({ serverRef, cardRef, shroudRef, overlayRef, shroudMats }: Refs) {
  const x = rackX(TARGET_RACK);
  const z = ROW_Z[TARGET_ROW];
  const posts: [number, number][] = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  return (
    <group>
      {posts.map(([sx, sz], i) => (
        <mesh key={i} position={[x + sx * (RACK.w / 2 - 0.02), RACK.h / 2, z + sz * (RACK.d / 2 - 0.02)]}>
          <boxGeometry args={[0.04, RACK.h, 0.04]} />
          <meshStandardMaterial color="#0e7490" emissive="#22d3ee" emissiveIntensity={0.35} metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
      <Bx p={[x, RACK.h - 0.01, z]} s={[RACK.w, 0.02, RACK.d]} color="#111827" />
      <Bx p={[x - RACK.w / 2 + 0.005, RACK.h / 2, z]} s={[0.01, RACK.h, RACK.d]} color="#1f2937" opacity={0.35} />
      <Bx p={[x + RACK.w / 2 - 0.005, RACK.h / 2, z]} s={[0.01, RACK.h, RACK.d]} color="#1f2937" opacity={0.35} />
      <Bx id="rack-switch" p={[x, RACK.h - 0.12, SERVER_CZ]} s={[SERVER.w, U - 0.004, SERVER.d * 0.7]} color={ROLE_COLOR.link} />
      <Bx id="rack-power" p={[x + 0.25, RACK.h / 2, z - RACK.d / 2 + 0.06]} s={[0.04, RACK.h * 0.85, 0.05]} color="#a16207" />
      <Bx id="rack-power" p={[x - 0.25, RACK.h / 2, z - RACK.d / 2 + 0.06]} s={[0.04, RACK.h * 0.85, 0.05]} color="#a16207" />
      {Array.from({ length: SERVERS_IN_RACK }).map((_, k) =>
        k === TARGET_SERVER ? null : <ClosedServer key={k} y={serverBottomY(k)} />,
      )}
      <group ref={serverRef}>
        <OpenServer cardRef={cardRef} shroudRef={shroudRef} overlayRef={overlayRef} shroudMats={shroudMats} />
      </group>
    </group>
  );
}

function ClosedServer({ y }: { y: number }) {
  return (
    <group>
      <Bx id="rack-server" p={[0, y + SERVER.h / 2, SERVER_CZ]} s={[SERVER.w, SERVER.h, SERVER.d]} color="#374151" metal={0.5} rough={0.45} />
      <Bx p={[0, y + SERVER.h / 2, SERVER_FRONT_Z + 0.004]} s={[SERVER.w + 0.04, SERVER.h, 0.008]} color="#1e293b" metal={0.4} />
      {[-0.15, -0.05, 0.05, 0.15].map((dx) => (
        <Bx key={dx} p={[dx, y + SERVER.h / 2, SERVER_FRONT_Z + 0.01]} s={[0.07, SERVER.h * 0.7, 0.004]} color="#0f172a" />
      ))}
      <Bx p={[0.2, y + SERVER.h * 0.8, SERVER_FRONT_Z + 0.012]} s={[0.008, 0.008, 0.004]} color="#22d3ee" />
    </group>
  );
}

interface Refs {
  serverRef: MutableRefObject<Group | null>;
  cardRef: MutableRefObject<Group | null>;
  shroudRef: MutableRefObject<Group | null>;
  overlayRef: MutableRefObject<Group | null>;
  shroudMats: MutableRefObject<MeshStandardMaterial[]>;
}

/* ───── NXT RNGD 서버 (뚜껑을 연 상태, 4U·카드 8장) ───── */
function OpenServer({ cardRef, shroudRef, overlayRef, shroudMats }: Omit<Refs, 'serverRef'>) {
  const y0 = serverBottomY(TARGET_SERVER);
  const fanPts = useMemo(() => Array.from({ length: 6 }, (_, i) => [-0.185 + i * 0.074, y0 + 0.07, SERVER_FRONT_Z - 0.1] as [number, number, number]), [y0]);
  const dimm = useMemo(() => {
    const out: [number, number, number][] = [];
    [-1, 1].forEach((side) => {
      for (let k = 0; k < 6; k++) out.push([side * (0.15 + k * 0.008), y0 + 0.03, SERVER_FRONT_Z - 0.22]);
    });
    return out;
  }, [y0]);
  return (
    <group>
      <Bx p={[0, y0 + 0.003, SERVER_CZ]} s={[SERVER.w, 0.006, SERVER.d]} color="#4b5563" metal={0.6} rough={0.4} />
      <Bx p={[-SERVER.w / 2 + 0.003, y0 + SERVER.h / 2, SERVER_CZ]} s={[0.006, SERVER.h, SERVER.d]} color="#4b5563" metal={0.6} />
      <Bx p={[SERVER.w / 2 - 0.003, y0 + SERVER.h / 2, SERVER_CZ]} s={[0.006, SERVER.h, SERVER.d]} color="#4b5563" metal={0.6} />
      <Bx p={[0, y0 + SERVER.h / 2, SERVER_FRONT_Z + 0.004]} s={[SERVER.w + 0.04, SERVER.h, 0.008]} color="#1e293b" metal={0.4} />
      {/* 팬 벽 */}
      <Bx id="srv-fan" p={[0, y0 + 0.07, SERVER_FRONT_Z - 0.1]} s={[SERVER.w - 0.02, 0.13, 0.05]} color="#1f2937" />
      {fanPts.map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2] + 0.027]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.004, 24]} />
          <Mat id="srv-fan" color={ROLE_COLOR.cooling} metal={0.2} />
        </mesh>
      ))}
      {/* CPU 2개 + 방열판 */}
      {[-0.09, 0.09].map((x) => (
        <group key={x}>
          <Bx id="srv-cpu" p={[x, y0 + 0.012, SERVER_FRONT_Z - 0.22]} s={[0.08, 0.012, 0.08]} color="#94a3b8" metal={0.7} />
          {Array.from({ length: 12 }).map((_, k) => (
            <Bx key={k} id="srv-cpu" p={[x - 0.033 + k * 0.006, y0 + 0.05, SERVER_FRONT_Z - 0.22]} s={[0.0012, 0.065, 0.075]} color="#cbd5e1" metal={0.8} rough={0.3} />
          ))}
        </group>
      ))}
      <Inst pts={dimm} size={[0.004, 0.035, 0.13]} color="#15803d" id="srv-mem" />
      {/* PCIe 라이저 */}
      <Bx id="srv-pcie" p={[0, y0 + 0.01, CARD_CZ]} s={[0.4, 0.012, CARD.len * 0.4]} color={ROLE_COLOR.link} />
      {/* 카드 8장 */}
      {Array.from({ length: CARDS }).map((_, j) =>
        j === TARGET_CARD ? null : (
          <group key={j} position={[cardX(j), cardCY(), CARD_CZ]} rotation={[0, Math.PI / 2, 0]}>
            <SimpleCard />
          </group>
        ),
      )}
      <group ref={cardRef} position={[cardX(TARGET_CARD), cardCY(), CARD_CZ]} rotation={[0, Math.PI / 2, 0]}>
        <DetailedCard shroudRef={shroudRef} overlayRef={overlayRef} shroudMats={shroudMats} />
      </group>
    </group>
  );
}

function SimpleCard() {
  return (
    <group>
      <Bx id="srv-card" p={[0, 0, 0.012]} s={[CARD.len, CARD.h, CARD.t - 0.006]} color="#20242c" metal={0.6} rough={0.35} />
      <Bx p={[0, 0, -0.006]} s={[CARD.len, CARD.h, 0.0016]} color="#0f2a1f" />
      <Bx p={[CARD.len / 2 + 0.001, 0.004, 0.012]} s={[0.002, CARD.h + 0.012, 0.036]} color="#9ca3af" metal={0.8} />
    </group>
  );
}

/* ───── RNGD 카드 상세 (카드 로컬: 길이=x, 높이=y, 부품 면=+z) ───── */
function DetailedCard({ shroudRef, overlayRef, shroudMats }: Omit<Refs, 'serverRef' | 'cardRef'>) {
  const P = PKG_LOCAL;
  const fins = useMemo(() => Array.from({ length: 34 }, (_, i) => [-0.005, -0.048 + i * 0.0029, 0.019] as [number, number, number]), []);
  const inductors = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) out.push([-0.07 + r * 0.011, -0.03 + c * 0.011, 0.004]);
    return out;
  }, []);
  const caps = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let c = 0; c < 14; c++) out.push([P.x - 0.03 + c * 0.0045, P.y - 0.032, 0.0015]);
    return out;
  }, [P]);
  const regMat = (m: MeshStandardMaterial | null) => {
    if (m && !shroudMats.current.includes(m)) shroudMats.current.push(m);
  };
  return (
    <group>
      {/* 기판(PCB) */}
      <Bx id="brd-pcb" p={[0, 0, 0]} s={[CARD.len, CARD.h, 0.0016]} color="#0d2b1e" rough={0.7} />
      {/* PCIe 단자 */}
      <Bx id="brd-edge" p={[0.02, -CARD.h / 2 - 0.005, 0]} s={[0.089, 0.01, 0.0016]} color="#d4a017" metal={0.9} rough={0.2} />
      {/* I/O 브래킷 */}
      <Bx p={[CARD.len / 2 + 0.001, 0.004, 0.012]} s={[0.002, CARD.h + 0.012, 0.036]} color="#9ca3af" metal={0.85} rough={0.3} />
      {/* 뒷판 */}
      <Bx p={[0, 0, -0.0025]} s={[CARD.len - 0.01, CARD.h - 0.008, 0.0016]} color="#30343c" metal={0.7} rough={0.4} />
      {/* 전원 회로 */}
      <Inst pts={inductors} size={[0.008, 0.008, 0.005]} color="#27272a" id="brd-vrm" rough={0.5} />
      <Inst pts={caps} size={[0.002, 0.0012, 0.0012]} color="#a8a29e" id="brd-vrm" />
      <Bx id="brd-power" p={[-0.11, CARD.h / 2 - 0.012, 0.006]} s={[0.014, 0.012, 0.01]} color="#18181b" />

      {/* 패키지: 기판 → 인터포저 → 칩 + HBM3 2스택 */}
      <group position={[P.x, P.y, P.z]}>
        <Bx id="pkg-sub" p={[0, 0, PKG.sub[2] / 2]} s={[...PKG.sub]} color="#2c3a24" rough={0.75} />
        <Bx id="pkg-interposer" p={[0, 0, PKG.sub[2] + PKG.ip[2] / 2]} s={[...PKG.ip]} color="#8b8f99" metal={0.6} rough={0.35} />
        <Bx id="pkg-die" p={[0, 0, PKG.sub[2] + PKG.ip[2] + PKG.die[2] / 2]} s={[...PKG.die]} color="#2b313d" metal={0.55} rough={0.3} />
        {[-HBM_X, HBM_X].map((hx) => (
          <group key={hx}>
            {Array.from({ length: 8 }).map((_, k) => (
              <Bx
                key={k}
                id="pkg-hbm"
                p={[hx, 0, PKG.sub[2] + PKG.ip[2] + (k + 0.5) * (PKG.hbm[2] / 8)]}
                s={[PKG.hbm[0], PKG.hbm[1], PKG.hbm[2] / 8 - 0.00002]}
                color={k === 7 ? '#2b2f36' : k % 2 ? '#7f8ea3' : '#5b6b82'}
                metal={0.6}
              />
            ))}
          </group>
        ))}
        {/* 칩 내부 개념도 (공개되지 않은 배치) */}
        <group ref={overlayRef} position={[0, 0, PKG.sub[2] + PKG.ip[2] + PKG.die[2] + 0.00006]} visible={false}>
          <DieConcept />
        </group>
      </group>

      {/* 패시브 방열판·덮개 (단계가 진행되면 들어 올려짐) */}
      <group ref={shroudRef}>
        <mesh position={[-0.005, 0, 0.0055]}>
          <boxGeometry args={[0.205, 0.102, 0.003]} />
          <meshStandardMaterial ref={regMat} color="#b8bec8" metalness={0.85} roughness={0.3} transparent />
        </mesh>
        <FinStack pts={fins} regMat={regMat} />
        {/* 덮개 테두리(가운데는 열려 핀이 보임) */}
        {[CARD.h / 2 - 0.006, -CARD.h / 2 + 0.006].map((yy) => (
          <mesh key={yy} position={[-0.005, yy, CARD.t - 0.004]}>
            <boxGeometry args={[CARD.len - 0.012, 0.012, 0.002]} />
            <meshStandardMaterial ref={regMat} color="#22262e" metalness={0.5} roughness={0.45} transparent />
          </mesh>
        ))}
        {[-(CARD.len / 2) + 0.012, CARD.len / 2 - 0.018].map((xx) => (
          <mesh key={xx} position={[xx, 0, CARD.t / 2 + 0.002]}>
            <boxGeometry args={[0.008, CARD.h, CARD.t - 0.006]} />
            <meshStandardMaterial ref={regMat} color="#22262e" metalness={0.5} roughness={0.45} transparent />
          </mesh>
        ))}
        <mesh position={[-0.005, CARD.h / 2 - 0.001, CARD.t / 2]}>
          <boxGeometry args={[CARD.len - 0.012, 0.002, CARD.t - 0.004]} />
          <meshStandardMaterial ref={regMat} color="#22262e" metalness={0.5} roughness={0.45} transparent />
        </mesh>
      </group>
    </group>
  );
}

function FinStack({ pts, regMat }: { pts: [number, number, number][]; regMat: (m: MeshStandardMaterial | null) => void }) {
  const ref = useRef<InstancedMesh>(null);
  const { onSelect } = useContext(Sel);
  useLayoutEffect(() => {
    const o = new Object3D();
    pts.forEach((p, i) => {
      o.position.set(...p);
      o.updateMatrix();
      ref.current!.setMatrixAt(i, o.matrix);
    });
    ref.current!.instanceMatrix.needsUpdate = true;
    ref.current!.computeBoundingSphere();
  }, [pts]);
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, pts.length]} onClick={(e) => { e.stopPropagation(); onSelect('brd-heat'); }}>
      <boxGeometry args={[0.2, 0.0007, 0.024]} />
      <meshStandardMaterial ref={regMat} color="#cfd5dd" metalness={0.85} roughness={0.28} transparent />
    </instancedMesh>
  );
}

function DieConcept() {
  const [w, h] = PKG.die;
  const blocks: ReactNode[] = [];
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < 4; c++) {
      const bx = -w / 2 + 0.0035 + c * 0.0047 + 0.0019;
      const by = (r === 0 ? -1 : 1) * 0.0055;
      blocks.push(<Bx key={`pe${r}${c}`} id="die-pe" p={[bx, by, 0.00012]} s={[0.0038, 0.0068, 0.00022]} color={ROLE_COLOR.compute} />);
    }
  return (
    <group>
      {blocks}
      <Bx id="die-sram" p={[-0.0004, 0, 0.0001]} s={[0.0185, 0.0028, 0.0002]} color={ROLE_COLOR.memory} />
      <Bx id="die-sram" p={[-0.0004, -0.0107, 0.0001]} s={[0.0185, 0.0018, 0.0002]} color={ROLE_COLOR.memory} />
      <Bx id="die-sram" p={[-0.0004, 0.0107, 0.0001]} s={[0.0185, 0.0018, 0.0002]} color={ROLE_COLOR.memory} />
      {[-1, 1].map((sx) => (
        <Bx key={sx} id="die-phy" p={[sx * (w / 2 - 0.0012), 0, 0.0001]} s={[0.0016, h - 0.004, 0.00018]} color={ROLE_COLOR.link} />
      ))}
      <Bx id="die-noc" p={[-0.0004, 0, 0.00025]} s={[0.0185, 0.0004, 0.0001]} color="#fde68a" />
      {[0, 1, 2, 3].map((c) => (
        <Bx key={c} id="die-noc" p={[-w / 2 + 0.0035 + c * 0.0047 + 0.0019, 0, 0.00025]} s={[0.0004, 0.022, 0.0001]} color="#fde68a" />
      ))}
      <Bx id="die-ctrl" p={[-w / 2 + 0.0012, 0, 0.0001]} s={[0.0001, 0.001, 0.0001]} color="#64748b" />
    </group>
  );
}

/* ───── 카메라·애니메이션 ───── */
function Rig({ progress, azimuth, refs, collapsed }: { progress: MutableRefObject<number>; azimuth: MutableRefObject<number>; refs: Refs; collapsed: boolean }) {
  const { camera, size } = useThree();
  const keys = useMemo(() => keyframes(), []);
  const tmpT = useMemo(() => new Vector3(), []);
  const tmpD = useMemo(() => new Vector3(), []);
  const az = useRef(0);
  useFrame((_, dt) => {
    const eff = effective(progress.current);
    az.current += (azimuth.current - az.current) * Math.min(1, dt * 6);

    // 장면 애니메이션
    const slide = phase(eff, 1) * SERVER_SLIDE;
    const lift = phase(eff, 2) * CARD_LIFT;
    const open = phase(eff, 3);
    if (refs.serverRef.current) refs.serverRef.current.position.z = slide;
    if (refs.cardRef.current) refs.cardRef.current.position.y = cardCY() + lift;
    if (refs.shroudRef.current) refs.shroudRef.current.position.z = open * 0.11;
    refs.shroudMats.current.forEach((m) => { m.opacity = 1 - open * 0.88; m.depthWrite = open < 0.5; });
    if (refs.overlayRef.current) refs.overlayRef.current.visible = eff > 4.15;

    // 카메라 키프레임 보간
    const s = Math.min(keys.length - 2, Math.floor(eff));
    const t = Math.min(1, eff - s);
    const a = keys[s];
    const b = keys[s + 1];
    tmpT.lerpVectors(a.target, b.target, t);
    tmpD.lerpVectors(a.dir, b.dir, t).normalize();
    tmpD.applyAxisAngle(new Vector3(0, 1, 0), az.current);
    // 좁은 화면은 아래 설명 패널이 화면 일부를 가리므로 더 멀리·넓게 보기
    const narrow = size.width < 900;
    const fit = narrow ? (collapsed ? 1.2 : 1.6) : 1;
    const dist = Math.exp(Math.log(a.dist) * (1 - t) + Math.log(b.dist) * t) * fit;
    camera.position.copy(tmpT).addScaledVector(tmpD, dist);
    camera.lookAt(tmpT);
    const cam = camera as PerspectiveCamera;
    cam.fov = narrow ? 46 : 38;
    // 설명 패널에 가리지 않도록 화면 중심을 옮김 (데스크톱: 오른쪽 패널, 모바일: 아래 패널)
    const wide = !narrow;
    const offX = wide && !collapsed ? Math.min(420, size.width * 0.34) / 2 : 0;
    const offY = !wide ? (collapsed ? 34 : size.height * 0.23) : 0;
    cam.setViewOffset(size.width, size.height, offX, offY, size.width, size.height);
    cam.near = Math.max(0.0005, dist * 0.02);
    cam.far = Math.max(60, dist * 400);
    cam.updateProjectionMatrix();
  });
  return null;
}

/* ───── 단계별 라벨 ───── */
function Labels({ step, show }: { step: number; show: boolean }) {
  const lbl = (i: number) => show && step === i;
  const y0 = serverBottomY(TARGET_SERVER);
  const sz = SERVER_CZ + SERVER_SLIDE;
  const cw = (x: number, y: number, z: number) => cardLocalToWorld(new Vector3(x, y, z), SERVER_SLIDE, CARD_LIFT);
  const pk = (x: number, y: number, z: number) => cw(PKG_LOCAL.x + x, PKG_LOCAL.y + y, PKG_LOCAL.z + z);
  const dz = PKG.sub[2] + PKG.ip[2] + PKG.die[2];
  return (
    <>
      <Label show={lbl(0)} id="dc-rack" p={[-3, 2.3, ROW_Z[0]]} text="서버 랙 줄" />
      <Label show={lbl(0)} id="dc-cool" p={[2, 2.5, -7.6]} text="냉각 설비" />
      <Label show={lbl(0)} id="dc-net" p={[3.5, 2.7, ROW_Z[2]]} text="케이블 트레이(네트워크)" />
      <Label show={lbl(0)} p={[0, 2.5, ROW_Z[1]]} text="▼ 확대할 랙" />

      <Label show={lbl(1)} id="rack-switch" p={[0.42, RACK.h - 0.12, RACK_FRONT_Z]} text="네트워크 스위치" />
      <Label show={lbl(1)} id="rack-server" p={[-0.45, serverBottomY(4) + 0.09, RACK_FRONT_Z]} text="NXT RNGD 서버(4U)" />
      <Label show={lbl(1)} id="rack-power" p={[0.42, 0.5, RACK_FRONT_Z - 0.9]} text="전원 분배(PDU)" />

      <Label show={lbl(2)} id="srv-card" p={[0, y0 + 0.16, CARD_CZ + sz - SERVER_CZ]} text="RNGD 카드 ×8" />
      <Label show={lbl(2)} id="srv-cpu" p={[0.09, y0 + 0.11, SERVER_FRONT_Z - 0.22 + SERVER_SLIDE]} text="CPU ×2" />
      <Label show={lbl(2)} id="srv-fan" p={[0.14, y0 + 0.16, SERVER_FRONT_Z - 0.08 + SERVER_SLIDE]} text="팬" />
      <Label show={lbl(2)} id="srv-mem" p={[-0.17, y0 + 0.07, SERVER_FRONT_Z - 0.22 + SERVER_SLIDE]} text="메모리(DDR5)" />

      <Label show={lbl(3)} id="brd-heat" p={cw(-0.03, 0.04, CARD.t + 0.004)} text="패시브 방열판" />
      <Label show={lbl(3)} id="brd-edge" p={cw(0.02, -CARD.h / 2 - 0.012, 0)} text="PCIe Gen5 x16 단자" />
      <Label show={lbl(3)} p={cw(CARD.len / 2 + 0.004, 0.06, 0.012)} text="I/O 브래킷" />

      <Label show={lbl(4)} id="pkg-die" p={pk(0, 0.016, dz)} text="연산 칩(다이)" />
      <Label show={lbl(4)} id="pkg-hbm" p={pk(0.0185, -0.009, dz)} text="HBM3 스택" />
      <Label show={lbl(4)} id="pkg-interposer" p={pk(-0.0185, 0.017, PKG.sub[2] + PKG.ip[2])} text="인터포저" />
      <Label show={lbl(4)} id="pkg-sub" p={pk(-0.028, -0.024, PKG.sub[2])} text="패키지 기판" />
      <Label show={lbl(4)} id="brd-vrm" p={cw(-0.065, 0.04, 0.008)} text="전원 회로" />

      <Label show={lbl(5)} id="die-pe" p={pk(-0.006, 0.0095, dz + 0.0004)} text="연산 슬라이스(개념)" />
      <Label show={lbl(5)} id="die-sram" p={pk(0.004, 0.0014, dz + 0.0004)} text="온칩 SRAM(개념)" />
      <Label show={lbl(5)} id="die-phy" p={pk(0.0108, -0.009, dz + 0.0004)} text="HBM 연결부(개념)" />
      <Label show={lbl(5)} id="die-noc" p={pk(-0.003, -0.0004, dz + 0.0005)} text="내부 연결망(개념)" />


    </>
  );
}

export interface JourneyProps {
  progress: MutableRefObject<number>;
  azimuth: MutableRefObject<number>;
  step: number;
  settled: boolean;
  labels: boolean;
  sel: string | null;
  onSelect: (id: string) => void;
  collapsed: boolean;
}

export default function JourneyScene({ progress, azimuth, step, settled, labels, sel, onSelect, collapsed }: JourneyProps) {
  const serverRef = useRef<Group>(null);
  const cardRef = useRef<Group>(null);
  const shroudRef = useRef<Group>(null);
  const overlayRef = useRef<Group>(null);
  const shroudMats = useRef<MeshStandardMaterial[]>([]);
  const refs: Refs = { serverRef, cardRef, shroudRef, overlayRef, shroudMats };
  return (
    <Canvas
      camera={{ position: [10, 10, 14], fov: 38, near: 0.01, far: 200 }}
      dpr={[1, 1.75]}
      onPointerMissed={() => onSelect('')}
      aria-hidden="true"
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#0b1222']} />
      <fog attach="fog" args={['#0b1222', 34, 95]} />
      <hemisphereLight args={['#dbeafe', '#334155', 1.1]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[6, 12, 8]} intensity={1.25} />
      <directionalLight position={[-8, 5, -6]} intensity={0.35} color="#93c5fd" />
      <pointLight position={[0.8, 1.7, 2.6]} intensity={8} distance={6} decay={1.5} />
      <pointLight position={[0.3, 1.3, 2.0]} intensity={2.5} distance={2.5} decay={1.5} color="#e0f2fe" />
      <Sel.Provider value={{ sel, onSelect }}>
        <Hall />
        <group position={[0, 0, 0]}>
          <TargetRack {...refs} />
        </group>
        <Labels step={step} show={labels && settled} />
      </Sel.Provider>
      <Rig progress={progress} azimuth={azimuth} refs={refs} collapsed={collapsed} />
    </Canvas>
  );
}
