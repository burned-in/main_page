import { useEffect, useRef } from 'react';
import type { BufferAttribute, BufferGeometry, Material, Object3D } from 'three';
import { homeStyles as s } from './homeStyles';

type SceneMaterialOwner = Object3D & {
  geometry?: BufferGeometry;
  material?: Material | Material[];
};

type ColorEditableMaterial = Material & {
  color?: { set: (color: number) => void };
  emissive?: { set: (color: number) => void };
  emissiveIntensity?: number;
};

type PartBase = {
  object: Object3D;
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  openX: number;
  openY: number;
  openZ: number;
  openRX: number;
  openRY: number;
  openRZ: number;
};

type BeatBar = {
  object: Object3D;
  material: Material;
  baseScaleY: number;
  phase: number;
  angle: number;
  radius: number;
};

type PulseRing = {
  object: Object3D;
  material: Material;
  phase: number;
  baseOpacity: number;
};

type WaveLoop = {
  geometry: BufferGeometry;
  radius: number;
  amplitude: number;
  phase: number;
  speed: number;
  frequency: number;
  z: number;
};

type CoreBlade = {
  object: Object3D;
  phase: number;
  baseScaleY: number;
  baseZ: number;
};

type GlassRipple = {
  object: Object3D;
  material: Material;
  phase: number;
  baseScale: number;
  spread: number;
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isCompactViewport = () =>
  typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches;

const disposeObject = (object: Object3D) => {
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();

  object.traverse((child) => {
    const owner = child as SceneMaterialOwner;

    if (owner.geometry) geometries.add(owner.geometry);

    if (Array.isArray(owner.material)) {
      owner.material.forEach((material) => materials.add(material));
      return;
    }

    if (owner.material) materials.add(owner.material);
  });

  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
};

export function HeroScene() {
  const shellRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const shell = shellRef.current;
    const canvas = canvasRef.current;
    if (!shell || !canvas) return undefined;

    shell.dataset.sceneStatus = 'loading';

    let isMounted = true;
    let cleanupScene = () => {};

    void Promise.all([
      import('three'),
      Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).catch((error: unknown) => {
        console.warn('bunIn scroll motion could not be initialized. The 3D scene will still render.', error);
        return [null, null] as const;
      }),
    ]).then(
      ([THREE, motionModules]) => {
        if (!isMounted || !shellRef.current || !canvasRef.current) return;

        const reducedMotion = prefersReducedMotion();
        const compactViewport = isCompactViewport();
        const [gsapModule, scrollTriggerModule] = motionModules;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: true,
          antialias: !compactViewport,
          powerPreference: 'high-performance',
        });

        const rig = new THREE.Group();
        const engine = new THREE.Group();
        const baseGroup = new THREE.Group();
        const platterGroup = new THREE.Group();
        const grooveGroup = new THREE.Group();
        const glassGroup = new THREE.Group();
        const waveGroup = new THREE.Group();
        const djGroup = new THREE.Group();
        const runtimeGroup = new THREE.Group();
        const opsGroup = new THREE.Group();
        const releaseGroup = new THREE.Group();
        const atmosphereGroup = new THREE.Group();
        const pointer = new THREE.Vector2(0, 0);
        const clock = new THREE.Clock();

        const segmentMaterials: Material[] = [];
        const grooveMaterials: Material[] = [];
        const waveMaterials: Material[] = [];
        const djMaterials: Material[] = [];
        const runtimeMaterials: Material[] = [];
        const opsMaterials: Material[] = [];
        const releaseMaterials: Material[] = [];
        const segmentSurfaceMaterials: Material[] = [];
        const glassRippleMaterials: Material[] = [];
        const segmentEdgeMaterials: Material[] = [];
        const parts: PartBase[] = [];
        const beatBars: BeatBar[] = [];
        const pulseRings: PulseRing[] = [];
        const waveLoops: WaveLoop[] = [];
        const glassRipples: GlassRipple[] = [];
        const coreRotors: Object3D[] = [];
        const coreBlades: CoreBlade[] = [];
        const pulseTargets: Object3D[] = [];
        const releaseNodes: Object3D[] = [];

        const colors = {
          obsidian: 0x100f0e,
          graphite: 0x231d19,
          porcelain: 0xf6efe7,
          ember: 0xff5b3e,
          emberSoft: 0xff9a63,
          amber: 0xffc27a,
          signal: 0x66f0c2,
          ice: 0x7ed8ff,
        };

        camera.position.set(0, 0.02, 5.6);
        engine.scale.setScalar(compactViewport ? 0.88 : 1.08);
        engine.position.set(0, 0, 0.02);
        engine.rotation.set(0.01, -0.02, -0.03);
        engine.add(baseGroup, platterGroup, grooveGroup, glassGroup, waveGroup, djGroup, runtimeGroup, opsGroup, releaseGroup);
        rig.add(engine, atmosphereGroup);
        scene.add(rig);

        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.06;
        renderer.setClearColor(0x11100f, 0);

        const addMaterial = <T extends Material>(material: T, bucket: Material[]) => {
          bucket.push(material);
          return material;
        };

        const setOpacity = (materials: Material[], opacity: number) => {
          materials.forEach((material) => {
            material.opacity = opacity;
            material.transparent = true;
          });
        };

        const setMaterialColor = (material: Material, color: number) => {
          (material as ColorEditableMaterial).color?.set(color);
        };

        const setMaterialEmissive = (material: Material, color: number, intensity?: number) => {
          const editableMaterial = material as ColorEditableMaterial;

          editableMaterial.emissive?.set(color);
          if (typeof intensity === 'number') editableMaterial.emissiveIntensity = intensity;
        };

        const registerPart = (
          object: Object3D,
          openX: number,
          openY: number,
          openZ: number,
          openRX = 0,
          openRY = 0,
          openRZ = 0,
        ) => {
          parts.push({
            object,
            x: object.position.x,
            y: object.position.y,
            z: object.position.z,
            rx: object.rotation.x,
            ry: object.rotation.y,
            rz: object.rotation.z,
            openX,
            openY,
            openZ,
            openRX,
            openRY,
            openRZ,
          });
          return object;
        };

        const createAnnularSegmentGeometry = (
          innerRadius: number,
          outerRadius: number,
          startAngle: number,
          endAngle: number,
          depth: number,
        ) => {
          const shape = new THREE.Shape();
          shape.moveTo(Math.cos(startAngle) * outerRadius, Math.sin(startAngle) * outerRadius);
          shape.absarc(0, 0, outerRadius, startAngle, endAngle, false);
          shape.lineTo(Math.cos(endAngle) * innerRadius, Math.sin(endAngle) * innerRadius);
          shape.absarc(0, 0, innerRadius, endAngle, startAngle, true);
          shape.lineTo(Math.cos(startAngle) * outerRadius, Math.sin(startAngle) * outerRadius);

          const geometry = new THREE.ExtrudeGeometry(shape, {
            depth,
            bevelEnabled: true,
            bevelThickness: 0.008,
            bevelSize: 0.01,
            bevelSegments: 2,
            curveSegments: 8,
          });
          geometry.center();
          return geometry;
        };

        const createArcLine = (radius: number, startAngle: number, endAngle: number, z: number) => {
          const points = [];
          const segments = compactViewport ? 44 : 76;
          for (let index = 0; index <= segments; index += 1) {
            const t = index / segments;
            const angle = startAngle + (endAngle - startAngle) * t;
            points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, z));
          }
          return new THREE.BufferGeometry().setFromPoints(points);
        };

        const createWaveLoopGeometry = (radius: number, z: number, amplitude: number, phase: number, frequency: number) => {
          const points = [];
          const segments = compactViewport ? 96 : 168;

          for (let index = 0; index < segments; index += 1) {
            const angle = (Math.PI * 2 * index) / segments;
            const modulation =
              Math.sin(angle * frequency + phase) * amplitude +
              Math.sin(angle * (frequency * 0.42) + phase * 1.7) * amplitude * 0.42;
            const liveRadius = radius + modulation;

            points.push(new THREE.Vector3(Math.cos(angle) * liveRadius, Math.sin(angle) * liveRadius, z));
          }

          return new THREE.BufferGeometry().setFromPoints(points);
        };

        const baseMaterial = new THREE.MeshPhysicalMaterial({
          color: colors.obsidian,
          roughness: 0.26,
          metalness: 0.56,
          clearcoat: 1,
          clearcoatRoughness: 0.18,
          transparent: true,
          opacity: 0.22,
          depthWrite: false,
        });
        const baseDisc = new THREE.Mesh(new THREE.CylinderGeometry(1.18, 1.18, 0.055, compactViewport ? 88 : 132), baseMaterial);
        baseDisc.rotation.x = Math.PI / 2;
        baseDisc.position.z = -0.08;
        baseDisc.visible = true;
        baseGroup.add(baseDisc);

        const outerGlowMaterial = addMaterial(
          new THREE.MeshBasicMaterial({ color: colors.ember, transparent: true, opacity: 0.42, depthWrite: false }),
          grooveMaterials,
        );
        const outerGlow = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.018, 8, compactViewport ? 100 : 152), outerGlowMaterial);
        outerGlow.position.z = 0.02;
        baseGroup.add(outerGlow);

        const segmentMaterial = (index: number, ringIndex: number) => {
          const material = addMaterial(
            new THREE.MeshPhysicalMaterial({
              color: index % 2 === 0 ? colors.obsidian : colors.graphite,
              roughness: 0.2 + ringIndex * 0.02,
              metalness: 0.48,
              transmission: 0.04,
              thickness: 0.2,
              clearcoat: 1,
              clearcoatRoughness: 0.13,
              transparent: true,
              opacity: 0.2 - ringIndex * 0.04,
              emissive: colors.ember,
              emissiveIntensity: ringIndex === 1 ? 0.018 : 0.008,
              depthWrite: false,
            }),
            segmentMaterials,
          );

          segmentSurfaceMaterials.push(material);

          return material;
        };

        const segmentEdgeMaterial = addMaterial(
          new THREE.LineBasicMaterial({
            color: colors.emberSoft,
            transparent: true,
            opacity: 0.44,
            depthWrite: false,
          }),
          segmentEdgeMaterials,
        );

        const ringSpecs = compactViewport
          ? [
              { segments: 8, inner: 0.43, outer: 1.04, z: 0.02, rotate: Math.PI / 16, open: 0.5 },
              { segments: 6, inner: 0.18, outer: 0.38, z: 0.08, rotate: Math.PI / 6, open: 0.28 },
            ]
          : [
              { segments: 12, inner: 0.43, outer: 1.05, z: 0.02, rotate: Math.PI / 24, open: 0.78 },
              { segments: 8, inner: 0.18, outer: 0.39, z: 0.09, rotate: Math.PI / 8, open: 0.46 },
            ];

        ringSpecs.forEach((spec, ringIndex) => {
          const segmentAngle = (Math.PI * 2) / spec.segments;
          const gap = ringIndex === 0 ? 0.024 : 0.034;

          for (let index = 0; index < spec.segments; index += 1) {
            const start = spec.rotate + index * segmentAngle + gap;
            const end = spec.rotate + (index + 1) * segmentAngle - gap;
            const angle = start + (end - start) / 2;
            const radialX = Math.cos(angle);
            const radialY = Math.sin(angle);
            const group = new THREE.Group();
            const geometry = createAnnularSegmentGeometry(spec.inner, spec.outer, start, end, ringIndex === 0 ? 0.055 : 0.07);
            const mesh = new THREE.Mesh(geometry, segmentMaterial(index, ringIndex));
            const edge = new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 26), segmentEdgeMaterial);

            group.add(mesh, edge);
            group.position.z = spec.z + (index % 2 === 0 ? 0.006 : -0.006);
            platterGroup.add(
              registerPart(
                group,
                radialX * spec.open,
                radialY * spec.open,
                0.42 + ringIndex * 0.2 + (index % 3) * 0.05,
                radialY * -0.16,
                radialX * 0.3,
                (index % 2 === 0 ? 1 : -1) * (0.18 + ringIndex * 0.06),
              ),
            );
          }
        });

        const grooveMaterial = addMaterial(
          new THREE.MeshBasicMaterial({ color: colors.porcelain, transparent: true, opacity: 0.18, depthWrite: false }),
          grooveMaterials,
        );
        [0.28, 0.48, 0.68, 0.88].forEach((radius, index) => {
          const groove = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.0035, 5, compactViewport ? 88 : 132), grooveMaterial);
          groove.position.z = 0.14 + index * 0.004;
          grooveGroup.add(groove);
        });

        const tickMaterial = addMaterial(
          new THREE.LineBasicMaterial({ color: colors.porcelain, transparent: true, opacity: 0.08, depthWrite: false }),
          grooveMaterials,
        );
        const tickPositions: number[] = [];
        const tickCount = compactViewport ? 28 : 40;
        for (let index = 0; index < tickCount; index += 1) {
          const angle = (Math.PI * 2 * index) / tickCount;
          const inner = index % 4 === 0 ? 1.04 : 1.1;
          const outer = 1.16;
          tickPositions.push(Math.cos(angle) * inner, Math.sin(angle) * inner, 0.15);
          tickPositions.push(Math.cos(angle) * outer, Math.sin(angle) * outer, 0.15);
        }
        const ticks = new THREE.LineSegments(new THREE.BufferGeometry(), tickMaterial);
        ticks.geometry.setAttribute('position', new THREE.Float32BufferAttribute(tickPositions, 3));
        grooveGroup.add(ticks);

        [
          { radius: 0.42, tube: 0.0048, z: 0.245, color: colors.ice, opacity: 0.42, phase: 0.2, scale: 0.92, spread: 0.2 },
          { radius: 0.6, tube: 0.0042, z: 0.255, color: colors.porcelain, opacity: 0.34, phase: 1.1, scale: 0.96, spread: 0.16 },
          { radius: 0.8, tube: 0.0038, z: 0.265, color: colors.ice, opacity: 0.3, phase: 2.0, scale: 0.98, spread: 0.12 },
          { radius: 1.06, tube: 0.0034, z: 0.275, color: colors.porcelain, opacity: 0.24, phase: 2.8, scale: 1, spread: 0.08 },
        ].forEach((spec) => {
          const material = addMaterial(
            new THREE.MeshBasicMaterial({
              color: spec.color,
              transparent: true,
              opacity: spec.opacity,
              depthTest: false,
              depthWrite: false,
              side: THREE.DoubleSide,
              blending: THREE.AdditiveBlending,
            }),
            glassRippleMaterials,
          );
          const ripple = new THREE.Mesh(new THREE.TorusGeometry(spec.radius, spec.tube, 6, compactViewport ? 96 : 160), material);

          ripple.position.z = spec.z;
          ripple.scale.setScalar(spec.scale);
          glassRipples.push({ object: ripple, material, phase: spec.phase, baseScale: spec.scale, spread: spec.spread });
          glassGroup.add(ripple);
        });

        const soundTrackMaterial = addMaterial(
          new THREE.LineBasicMaterial({ color: colors.signal, transparent: true, opacity: 0.42, depthWrite: false }),
          waveMaterials,
        );
        const warmTrackMaterial = addMaterial(
          new THREE.LineBasicMaterial({ color: colors.amber, transparent: true, opacity: 0.36, depthWrite: false }),
          waveMaterials,
        );
        [0.56, 0.74, 0.94].forEach((radius, index) => {
          const material = index === 1 ? warmTrackMaterial : soundTrackMaterial;
          const line = new THREE.Line(createArcLine(radius, -Math.PI * 0.86 + index * 0.12, Math.PI * 0.12 - index * 0.04, 0.26 + index * 0.012), material);
          line.rotation.z = -0.1 + index * 0.12;
          waveGroup.add(line);
        });

        const outerEqRailMaterial = addMaterial(
          new THREE.MeshBasicMaterial({ color: colors.emberSoft, transparent: true, opacity: 0.42, depthWrite: false }),
          waveMaterials,
        );
        const outerSignalRailMaterial = addMaterial(
          new THREE.MeshBasicMaterial({ color: colors.signal, transparent: true, opacity: 0.34, depthWrite: false }),
          waveMaterials,
        );
        [
          { radius: 1.215, tube: 0.007, material: outerEqRailMaterial, z: 0.3 },
          { radius: 1.285, tube: 0.004, material: outerSignalRailMaterial, z: 0.33 },
        ].forEach(({ radius, tube, material, z }) => {
          const rail = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 6, compactViewport ? 112 : 176), material);
          rail.position.z = z;
          waveGroup.add(rail);
        });

        [
          { radius: 1.245, amplitude: 0.012, phase: 0.2, speed: 1.65, frequency: 19, z: 0.37, material: soundTrackMaterial },
          { radius: 1.31, amplitude: 0.008, phase: 1.3, speed: -1.28, frequency: 27, z: 0.39, material: warmTrackMaterial },
        ].forEach((spec) => {
          const geometry = createWaveLoopGeometry(spec.radius, spec.z, spec.amplitude, spec.phase, spec.frequency);
          const loop = new THREE.LineLoop(geometry, spec.material);

          waveLoops.push({
            geometry,
            radius: spec.radius,
            amplitude: spec.amplitude,
            phase: spec.phase,
            speed: spec.speed,
            frequency: spec.frequency,
            z: spec.z,
          });
          waveGroup.add(loop);
        });

        const coreGroup = new THREE.Group();
        const coreBaseMaterial = addMaterial(
          new THREE.MeshPhysicalMaterial({
            color: colors.graphite,
            roughness: 0.14,
            metalness: 0.58,
            clearcoat: 1,
            clearcoatRoughness: 0.1,
            transparent: true,
            opacity: 0.72,
            emissive: colors.ember,
            emissiveIntensity: 0.1,
            depthWrite: false,
          }),
          djMaterials,
        );
        const coreGlassMaterial = addMaterial(
          new THREE.MeshPhysicalMaterial({
            color: colors.emberSoft,
            roughness: 0.08,
            metalness: 0.18,
            transmission: 0.16,
            thickness: 0.34,
            clearcoat: 1,
            clearcoatRoughness: 0.04,
            transparent: true,
            opacity: 0.54,
            emissive: colors.ember,
            emissiveIntensity: 0.34,
            depthWrite: false,
          }),
          djMaterials,
        );
        const coreSignalMaterial = addMaterial(
          new THREE.MeshBasicMaterial({ color: colors.signal, transparent: true, opacity: 0.72, depthWrite: false }),
          djMaterials,
        );
        const corePorcelainMaterial = addMaterial(
          new THREE.MeshBasicMaterial({ color: colors.porcelain, transparent: true, opacity: 0.54, depthWrite: false }),
          djMaterials,
        );
        const coreHotMaterial = addMaterial(
          new THREE.MeshBasicMaterial({ color: colors.emberSoft, transparent: true, opacity: 0.82, depthWrite: false }),
          djMaterials,
        );

        const coreBackplate = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.33, 0.065, 10), coreBaseMaterial);
        coreBackplate.rotation.x = Math.PI / 2;
        coreBackplate.rotation.z = Math.PI / 10;
        coreBackplate.position.z = 0.2;
        coreGroup.add(coreBackplate);

        const coreOuterHalo = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.012, 8, compactViewport ? 72 : 108), coreHotMaterial);
        coreOuterHalo.position.z = 0.28;
        coreGroup.add(coreOuterHalo);
        coreRotors.push(coreOuterHalo);

        const coreSignalHalo = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.006, 6, compactViewport ? 64 : 96), coreSignalMaterial);
        coreSignalHalo.position.z = 0.33;
        coreGroup.add(coreSignalHalo);
        coreRotors.push(coreSignalHalo);

        const bladeGeometry = new THREE.BoxGeometry(0.024, 0.2, 0.03);
        for (let index = 0; index < 10; index += 1) {
          const angle = (Math.PI * 2 * index) / 10 + Math.PI / 10;
          const radius = index % 2 === 0 ? 0.29 : 0.335;
          const blade = new THREE.Mesh(bladeGeometry, index % 2 === 0 ? coreHotMaterial : coreSignalMaterial);
          const baseScaleY = index % 2 === 0 ? 0.82 : 0.56;
          const baseZ = 0.43 + (index % 2) * 0.02;

          blade.rotation.z = angle - Math.PI / 2;
          blade.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, baseZ);
          blade.scale.set(1, baseScaleY, 1);
          coreBlades.push({ object: blade, phase: index * 0.64, baseScaleY, baseZ });
          coreGroup.add(blade);
        }

        const coreLens = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 0.06, 8), coreGlassMaterial);
        coreLens.rotation.x = Math.PI / 2;
        coreLens.rotation.z = Math.PI / 8;
        coreLens.position.z = 0.5;
        coreGroup.add(coreLens);
        pulseTargets.push(coreLens);

        const coreCrystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), coreGlassMaterial);
        coreCrystal.scale.set(1.2, 0.9, 0.46);
        coreCrystal.rotation.set(0.42, 0.22, Math.PI / 4);
        coreCrystal.position.z = 0.61;
        coreGroup.add(coreCrystal);
        coreRotors.push(coreCrystal);

        const coreSpindle = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.052, 0.1, 6), corePorcelainMaterial);
        coreSpindle.rotation.x = Math.PI / 2;
        coreSpindle.position.z = 0.7;
        coreGroup.add(coreSpindle);
        pulseTargets.push(coreSpindle);

        const coreBridgeGeometry = new THREE.BoxGeometry(0.014, 0.54, 0.018);
        [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].forEach((angle, index) => {
          const bridge = new THREE.Mesh(coreBridgeGeometry, index === 1 ? coreSignalMaterial : corePorcelainMaterial);

          bridge.rotation.z = angle;
          bridge.position.z = 0.67 + index * 0.008;
          bridge.scale.y = index === 1 ? 0.78 : 1;
          coreGroup.add(bridge);
          coreRotors.push(bridge);
        });

        const coreGlintGeometry = new THREE.BoxGeometry(0.01, 0.28, 0.016);
        [0, Math.PI / 2, Math.PI / 4, -Math.PI / 4].forEach((angle, index) => {
          const glint = new THREE.Mesh(coreGlintGeometry, index < 2 ? corePorcelainMaterial : coreSignalMaterial);

          glint.rotation.z = angle;
          glint.position.z = 0.76 + index * 0.006;
          glint.scale.y = index < 2 ? 0.88 : 0.54;
          coreGroup.add(glint);
          coreRotors.push(glint);
        });

        djGroup.add(coreGroup);

        [0.28, 0.42, 0.58].forEach((radius, index) => {
          const material = addMaterial(
            new THREE.MeshBasicMaterial({
              color: index === 2 ? colors.signal : colors.emberSoft,
              transparent: true,
              opacity: 0.07 + index * 0.03,
              depthWrite: false,
            }),
            djMaterials,
          );
          const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.006, 6, compactViewport ? 72 : 108), material);
          ring.position.z = 0.29 + index * 0.018;
          pulseRings.push({ object: ring, material, phase: index * 0.7, baseOpacity: 0.07 + index * 0.03 });
          djGroup.add(ring);
        });

        const beatBarMaterials = [
          addMaterial(new THREE.MeshBasicMaterial({ color: colors.emberSoft, transparent: true, opacity: 0.72, depthWrite: false }), waveMaterials),
          addMaterial(new THREE.MeshBasicMaterial({ color: colors.amber, transparent: true, opacity: 0.58, depthWrite: false }), waveMaterials),
          addMaterial(new THREE.MeshBasicMaterial({ color: colors.signal, transparent: true, opacity: 0.54, depthWrite: false }), waveMaterials),
        ];
        const beatGeometry = new THREE.BoxGeometry(0.014, 0.14, 0.018);
        const beatCount = compactViewport ? 36 : 64;
        for (let index = 0; index < beatCount; index += 1) {
          const material = beatBarMaterials[index % beatBarMaterials.length];
          const bar = new THREE.Mesh(beatGeometry, material);
          const centered = index - (beatCount - 1) / 2;
          const angle = (Math.PI * 2 * index) / beatCount - Math.PI / 2;
          const radius = 1.17 + (index % 4) * 0.006;
          const baseScaleY = 0.28 + Math.sin(index * 0.72) * 0.055 + Math.abs(centered) * 0.0025;
          const staticLength = 0.14 * baseScaleY;

          bar.rotation.z = angle - Math.PI / 2;
          bar.position.set(Math.cos(angle) * (radius + staticLength * 0.5), Math.sin(angle) * (radius + staticLength * 0.5), 0.42);
          bar.scale.set(index % 5 === 0 ? 1.24 : 1, baseScaleY, 1);
          beatBars.push({ object: bar, material, baseScaleY, phase: index * 0.46, angle, radius });
          waveGroup.add(bar);
        }

        const runtimeLineMaterial = addMaterial(
          new THREE.LineBasicMaterial({ color: colors.amber, transparent: true, opacity: 0, depthWrite: false }),
          runtimeMaterials,
        );
        for (let row = 0; row < 3; row += 1) {
          const points: number[] = [];
          const steps = compactViewport ? 44 : 72;
          for (let index = 0; index < steps; index += 1) {
            const t = index / Math.max(1, steps - 1);
            const x = -0.66 + t * 1.32;
            const y = -0.2 + row * 0.2 + Math.sin(t * Math.PI * 3 + row * 0.9) * 0.05;
            points.push(x, y, 0.32 + row * 0.02);
          }
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
          runtimeGroup.add(new THREE.Line(geometry, runtimeLineMaterial));
        }

        const opsMaterial = addMaterial(
          new THREE.MeshBasicMaterial({ color: colors.porcelain, transparent: true, opacity: 0, depthWrite: false }),
          opsMaterials,
        );
        const opsHotMaterial = addMaterial(
          new THREE.MeshBasicMaterial({ color: colors.emberSoft, transparent: true, opacity: 0, depthWrite: false }),
          opsMaterials,
        );
        const opsCount = compactViewport ? 10 : 14;
        for (let index = 0; index < opsCount; index += 1) {
          const angle = (Math.PI * 2 * index) / opsCount + 0.1;
          const radius = index % 2 === 0 ? 0.5 : 0.72;
          const node = new THREE.Mesh(new THREE.SphereGeometry(0.024, 10, 8), index % 4 === 0 ? opsHotMaterial : opsMaterial);
          node.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0.36);
          opsGroup.add(node);
        }

        const releaseLineMaterial = addMaterial(
          new THREE.LineBasicMaterial({ color: colors.amber, transparent: true, opacity: 0, depthWrite: false }),
          releaseMaterials,
        );
        const releasePath = new THREE.Line(createArcLine(0.76, -Math.PI * 0.72, Math.PI * 0.18, 0.38), releaseLineMaterial);
        releasePath.rotation.z = -0.28;
        releaseGroup.add(releasePath);
        const releaseNodeMaterial = addMaterial(
          new THREE.MeshBasicMaterial({ color: colors.amber, transparent: true, opacity: 0, depthWrite: false }),
          releaseMaterials,
        );
        [-0.68, -0.36, -0.08, 0.2].forEach((angle, index) => {
          const node = new THREE.Mesh(new THREE.OctahedronGeometry(0.05, 0), releaseNodeMaterial);
          const theta = Math.PI * angle - 0.28;
          node.position.set(Math.cos(theta) * 0.76, Math.sin(theta) * 0.76, 0.42);
          node.rotation.z = theta;
          releaseNodes.push(node);
          releaseGroup.add(node);
        });

        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = compactViewport ? 20 : 36;
        const particlePositions = new Float32Array(particleCount * 3);
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        for (let index = 0; index < particleCount; index += 1) {
          const theta = index * goldenAngle;
          const y = 1 - (index / Math.max(1, particleCount - 1)) * 2;
          const radius = Math.sqrt(Math.max(0, 1 - y * y)) * (2 + (index % 4) * 0.08);
          particlePositions[index * 3] = Math.cos(theta) * radius;
          particlePositions[index * 3 + 1] = y * 1.22;
          particlePositions[index * 3 + 2] = Math.sin(theta) * radius - 0.36;
        }
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
        const atmosphereMaterial = addMaterial(
          new THREE.PointsMaterial({ color: colors.porcelain, size: compactViewport ? 0.012 : 0.016, transparent: true, opacity: 0.08, depthWrite: false }),
          grooveMaterials,
        );
        atmosphereGroup.add(new THREE.Points(particleGeometry, atmosphereMaterial));

        setOpacity(runtimeMaterials, 0);
        setOpacity(opsMaterials, 0);
        setOpacity(releaseMaterials, 0);

        const ambientLight = new THREE.AmbientLight(0xfff2e8, 0.62);
        const keyLight = new THREE.DirectionalLight(0xfff6ec, 2.05);
        const emberLight = new THREE.PointLight(colors.ember, 4.8, 10, 2);
        const rimLight = new THREE.PointLight(colors.amber, 3.4, 10, 2);
        keyLight.position.set(2.2, 3, 4.6);
        emberLight.position.set(-0.8, 0.1, 2.2);
        rimLight.position.set(1.8, -1.5, -1.6);
        scene.add(ambientLight, keyLight, emberLight, rimLight);

        const render = () => {
          camera.lookAt(0, 0, 0.06);
          renderer.render(scene, camera);
        };

        const handleContextLost = (event: Event) => {
          event.preventDefault();
          shell.dataset.sceneStatus = 'fallback';
        };

        const handleContextRestored = () => {
          shell.dataset.sceneStatus = 'loading';
          resize();
          applySceneTheme();
          shell.dataset.sceneStatus = 'ready';
        };

        let sceneIsLightTheme = false;

        const applySceneTheme = () => {
          const lightTheme = document.documentElement.dataset.theme === 'light';

          sceneIsLightTheme = lightTheme;
          renderer.toneMappingExposure = lightTheme ? 1.18 : 1.06;

          setMaterialColor(baseMaterial, lightTheme ? 0xeadfd0 : colors.obsidian);
          setMaterialEmissive(baseMaterial, lightTheme ? 0xff8a68 : colors.ember, lightTheme ? 0.03 : 0);
          baseMaterial.opacity = lightTheme ? 0.16 : 0.22;

          segmentSurfaceMaterials.forEach((material, index) => {
            setMaterialColor(material, lightTheme ? (index % 2 === 0 ? 0xf2e7d9 : 0xd9cbb9) : index % 2 === 0 ? colors.obsidian : colors.graphite);
            setMaterialEmissive(material, lightTheme ? 0xff7a5f : colors.ember, lightTheme ? 0.045 : 0.012);
            material.opacity = lightTheme ? 0.16 : 0.2;
          });
          segmentEdgeMaterials.forEach((material) => {
            setMaterialColor(material, lightTheme ? 0xca5f45 : colors.emberSoft);
            material.opacity = lightTheme ? 0.48 : 0.44;
          });

          setMaterialColor(outerGlowMaterial, lightTheme ? colors.emberSoft : colors.ember);
          outerGlowMaterial.opacity = lightTheme ? 0.5 : 0.42;

          setMaterialColor(grooveMaterial, lightTheme ? 0x5d554d : colors.porcelain);
          grooveMaterial.opacity = lightTheme ? 0.26 : 0.18;
          setMaterialColor(tickMaterial, lightTheme ? 0x6b5f55 : colors.porcelain);
          tickMaterial.opacity = lightTheme ? 0.18 : 0.08;
          setMaterialColor(atmosphereMaterial, lightTheme ? 0x7b7066 : colors.porcelain);
          atmosphereMaterial.opacity = lightTheme ? 0.05 : 0.08;
          glassRippleMaterials.forEach((material, index) => {
            setMaterialColor(material, lightTheme ? [0xffffff, 0xffe6d8, 0xdaf5ee, 0xffffff][index] : [colors.ice, colors.porcelain, colors.ice, colors.porcelain][index]);
            material.opacity = lightTheme ? [0.2, 0.16, 0.13, 0.1][index] : [0.38, 0.3, 0.25, 0.2][index];
          });

          setMaterialColor(soundTrackMaterial, lightTheme ? 0x119e83 : colors.signal);
          setMaterialColor(warmTrackMaterial, lightTheme ? 0xd17928 : colors.amber);
          setMaterialColor(outerEqRailMaterial, lightTheme ? 0xe35f45 : colors.emberSoft);
          setMaterialColor(outerSignalRailMaterial, lightTheme ? 0x0fa98b : colors.signal);
          beatBarMaterials.forEach((material, index) => {
            const lightColors = [0xe3573f, 0xc97d25, 0x0e9b82];
            const darkColors = [colors.emberSoft, colors.amber, colors.signal];

            setMaterialColor(material, lightTheme ? lightColors[index] : darkColors[index]);
            material.opacity = lightTheme ? [0.78, 0.68, 0.62][index] : [0.72, 0.58, 0.54][index];
          });

          setMaterialColor(coreBaseMaterial, lightTheme ? 0x4b3931 : colors.graphite);
          setMaterialEmissive(coreBaseMaterial, lightTheme ? 0xff765d : colors.ember, lightTheme ? 0.16 : 0.1);
          coreBaseMaterial.opacity = lightTheme ? 0.62 : 0.72;
          setMaterialColor(coreGlassMaterial, lightTheme ? 0xff8d61 : colors.emberSoft);
          setMaterialEmissive(coreGlassMaterial, lightTheme ? 0xff6f52 : colors.ember, lightTheme ? 0.42 : 0.34);
          coreGlassMaterial.opacity = lightTheme ? 0.62 : 0.54;
          setMaterialColor(coreSignalMaterial, lightTheme ? 0x0fa98b : colors.signal);
          coreSignalMaterial.opacity = lightTheme ? 0.8 : 0.72;
          setMaterialColor(corePorcelainMaterial, lightTheme ? 0x4f453e : colors.porcelain);
          corePorcelainMaterial.opacity = lightTheme ? 0.62 : 0.54;
          setMaterialColor(coreHotMaterial, lightTheme ? 0xe6573f : colors.emberSoft);
          coreHotMaterial.opacity = lightTheme ? 0.9 : 0.82;

          setMaterialColor(runtimeLineMaterial, lightTheme ? 0xc16e1c : colors.amber);
          setMaterialColor(opsMaterial, lightTheme ? 0x554f47 : colors.porcelain);
          setMaterialColor(opsHotMaterial, lightTheme ? 0xde5d43 : colors.emberSoft);
          setMaterialColor(releaseLineMaterial, lightTheme ? 0xc16e1c : colors.amber);
          setMaterialColor(releaseNodeMaterial, lightTheme ? 0xc16e1c : colors.amber);

          ambientLight.color.set(lightTheme ? 0xffffff : 0xfff2e8);
          ambientLight.intensity = lightTheme ? 1.0 : 0.62;
          keyLight.color.set(lightTheme ? 0xffffff : 0xfff6ec);
          keyLight.intensity = lightTheme ? 2.7 : 2.05;
          emberLight.intensity = lightTheme ? 3.6 : 4.8;
          rimLight.intensity = lightTheme ? 4.2 : 3.4;

          render();
        };

        const handleSceneThemeChange = () => applySceneTheme();
        const themeObserver = new MutationObserver(handleSceneThemeChange);

        const resize = () => {
          const rect = shell.getBoundingClientRect();
          const width = Math.max(1, Math.floor(rect.width));
          const height = Math.max(1, Math.floor(rect.height));
          const pixelRatio = Math.min(window.devicePixelRatio || 1, compactViewport ? 1.25 : 1.7);

          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setPixelRatio(pixelRatio);
          renderer.setSize(width, height, false);
          render();
        };

        const scrollStage = shell.closest<HTMLElement>('[data-scroll-stage]') ?? shell;
        let targetScrollProgress = 0;
        let scrollProgress = 0;

        const updateScrollProgress = () => {
          const rect = scrollStage.getBoundingClientRect();
          const travel = Math.max(1, rect.height - window.innerHeight);

          targetScrollProgress = THREE.MathUtils.clamp(-rect.top / travel, 0, 1);
          shell.style.setProperty('--scene-progress', targetScrollProgress.toFixed(4));
        };

        let frameId = 0;
        const animate = () => {
          const delta = Math.min(clock.getDelta(), 0.04);
          const elapsed = clock.getElapsedTime();
          const idleMultiplier = reducedMotion ? 0 : 1;
          const scrollMultiplier = reducedMotion ? 0 : 1;

          scrollProgress += (targetScrollProgress - scrollProgress) * (compactViewport ? 0.12 : 0.08);
          const storyYaw = (Math.sin(scrollProgress * Math.PI * 1.8) * 0.14 + scrollProgress * 0.22) * scrollMultiplier;
          const storyPitch = Math.sin(scrollProgress * Math.PI) * -0.1 * scrollMultiplier;
          const storyRoll = Math.sin(scrollProgress * Math.PI * 1.25) * 0.05 * scrollMultiplier;
          const storyScale = 1 + Math.sin(scrollProgress * Math.PI) * (compactViewport ? 0.035 : 0.055) * scrollMultiplier;

          rig.rotation.y += (pointer.x * 0.045 + storyYaw - rig.rotation.y) * 0.08;
          rig.rotation.x += (-pointer.y * 0.035 + storyPitch - rig.rotation.x) * 0.08;
          rig.rotation.z += (storyRoll - rig.rotation.z) * 0.08;
          rig.scale.setScalar(storyScale);
          platterGroup.rotation.z += delta * 0.34 * idleMultiplier;
          grooveGroup.rotation.z += delta * 0.5 * idleMultiplier;
          waveGroup.rotation.z -= delta * 0.22 * idleMultiplier;
          baseGroup.rotation.z += delta * 0.08 * idleMultiplier;
          platterGroup.position.z = Math.sin(elapsed * 2.1) * 0.012 * idleMultiplier;
          waveGroup.position.y = Math.sin(elapsed * 1.5) * 0.018 * idleMultiplier;
          glassGroup.rotation.z += delta * 0.055 * idleMultiplier;
          atmosphereGroup.rotation.y -= delta * 0.012 * idleMultiplier;
          coreRotors.forEach((rotor, index) => {
            const direction = index % 2 === 0 ? 1 : -1;

            rotor.rotation.z += delta * (0.18 + index * 0.035) * direction * idleMultiplier;
          });

          const pulse = 0.98 + Math.sin(elapsed * 1.7) * 0.03 * idleMultiplier;
          pulseTargets.forEach((target) => target.scale.setScalar(pulse));
          glassRipples.forEach(({ object, material, phase, baseScale, spread }, index) => {
            const level = (Math.sin(elapsed * 1.8 + phase) + 1) * 0.5 * idleMultiplier;
            const darkOpacity = [0.28, 0.22, 0.18, 0.14][index] + level * [0.24, 0.18, 0.14, 0.1][index];
            const lightOpacity = [0.14, 0.11, 0.09, 0.07][index] + level * [0.1, 0.08, 0.06, 0.045][index];

            object.scale.setScalar(baseScale + level * spread);
            object.position.z = 0.245 + index * 0.012 + level * 0.018;
            material.opacity = sceneIsLightTheme ? lightOpacity : darkOpacity;
          });
          coreBlades.forEach(({ object, phase, baseScaleY, baseZ }) => {
            const beat = Math.max(0, Math.sin(elapsed * 5.8 + phase)) * 0.48 * idleMultiplier;

            object.scale.y += (baseScaleY + beat - object.scale.y) * 0.22;
            object.position.z += (baseZ + beat * 0.07 - object.position.z) * 0.18;
          });
          pulseRings.forEach(({ object, material, phase, baseOpacity }) => {
            const level = (Math.sin(elapsed * 2.8 + phase) + 1) * 0.5 * idleMultiplier;
            object.scale.setScalar(0.9 + level * 0.34);
            material.opacity = baseOpacity + level * 0.22;
          });

          waveLoops.forEach(({ geometry, radius, amplitude, phase, speed, frequency, z }) => {
            const position = geometry.getAttribute('position') as BufferAttribute;
            const count = position.count;

            for (let index = 0; index < count; index += 1) {
              const angle = (Math.PI * 2 * index) / count;
              const modulation =
                Math.sin(angle * frequency + elapsed * speed + phase) * amplitude +
                Math.sin(angle * (frequency * 0.42) + elapsed * speed * 0.62 + phase * 1.7) * amplitude * 0.48;
              const liveRadius = radius + modulation * idleMultiplier;

              position.setXYZ(index, Math.cos(angle) * liveRadius, Math.sin(angle) * liveRadius, z);
            }

            position.needsUpdate = true;
          });

          beatBars.forEach(({ object, baseScaleY, phase, angle, radius }) => {
            const primaryBeat = Math.max(0, Math.sin(elapsed * 6.2 + phase)) * 0.86;
            const fillBeat = (Math.sin(elapsed * 2.1 + phase * 0.36) + 1) * 0.16;
            const beat = (primaryBeat + fillBeat) * idleMultiplier;
            const targetScaleY = baseScaleY + beat;
            const liveLength = 0.14 * targetScaleY;
            const liveRadius = radius + liveLength * 0.55;

            object.scale.y += (targetScaleY - object.scale.y) * 0.26;
            object.position.x += (Math.cos(angle) * liveRadius - object.position.x) * 0.32;
            object.position.y += (Math.sin(angle) * liveRadius - object.position.y) * 0.32;
            object.position.z += (0.42 + beat * 0.055 - object.position.z) * 0.22;
          });

          releaseNodes.forEach((node, index) => {
            node.rotation.x += delta * (0.18 + index * 0.04) * idleMultiplier;
            node.rotation.y -= delta * 0.16 * idleMultiplier;
          });

          render();
          frameId = window.requestAnimationFrame(animate);
        };

        const handlePointerMove = (event: PointerEvent) => {
          const rect = shell.getBoundingClientRect();
          pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
          pointer.y = -(((event.clientY - rect.top) / rect.height - 0.5) * 2);
        };

        const handlePointerLeave = () => pointer.set(0, 0);

        let scrollCleanup = () => {};
        let refreshScrollTriggers = () => {};
        if (!reducedMotion && gsapModule && scrollTriggerModule) {
          try {
            const { gsap } = gsapModule;
            const { ScrollTrigger } = scrollTriggerModule;
            const sceneRail = shell.parentElement;
            const progressFill = progressRef.current;
            const progressTargets = progressFill ? [progressFill] : [];

            gsap.registerPlugin(ScrollTrigger);

            const ctx = gsap.context(() => {
              if (progressFill) gsap.set(progressFill, { scaleX: 0.08, transformOrigin: 'left center' });

              if (!compactViewport && sceneRail) {
                ScrollTrigger.create({
                  trigger: scrollStage,
                  start: 'top top',
                  end: 'bottom bottom',
                  invalidateOnRefresh: true,
                  onUpdate: () => updateScrollProgress(),
                  onRefresh: () => updateScrollProgress(),
                });
              }

              const timeline = gsap.timeline({
                defaults: { duration: 0.36, ease: 'sine.inOut' },
                scrollTrigger: {
                  trigger: scrollStage,
                  start: 'top top',
                  end: () =>
                    `+=${Math.max(
                      window.innerHeight * (compactViewport ? 2.4 : 4.8),
                      scrollStage.offsetHeight - window.innerHeight,
                    )}`,
                  scrub: compactViewport ? 0.7 : 1.05,
                  invalidateOnRefresh: true,
                  onUpdate: () => render(),
                  onRefresh: () => render(),
                },
              });

              if (progressTargets.length > 0) {
                timeline.to(progressTargets, { scaleX: 1, duration: 1.08, ease: 'none' }, 0);
              }

              timeline
              .to([baseGroup.scale, platterGroup.scale, grooveGroup.scale, glassGroup.scale, waveGroup.scale], { x: 0.86, y: 0.86, z: 0.86, duration: 0.16 }, 0.02)
              .to(djGroup.scale, { x: 0.92, y: 0.92, z: 0.92, duration: 0.16 }, 0.02)
              .to(coreGroup.scale, { x: 0.9, y: 0.9, z: 0.9, duration: 0.16 }, 0.02)
              .to(engine.rotation, { x: 0, y: 0, z: -0.02, duration: 0.18 }, 0.02)
              .to(emberLight, { intensity: 6.2, duration: 0.16 }, 0.04)
              .to([baseGroup.scale, platterGroup.scale, grooveGroup.scale, glassGroup.scale, waveGroup.scale], { x: 1.05, y: 1.05, z: 1.05, duration: 0.18 }, 0.16)
              .to(djGroup.scale, { x: 1.08, y: 1.08, z: 1.08, duration: 0.18 }, 0.16)
              .to(coreGroup.scale, { x: 1.22, y: 1.22, z: 1.22, duration: 0.22 }, 0.16)
              .to(coreGroup.rotation, { z: Math.PI * 0.18, duration: 0.28 }, 0.16)
              .to(engine.rotation, { x: -0.08, y: -0.52, z: 0.05, duration: 0.42 }, 0.22)
              .to(engine.position, { x: 0.06, y: 0.02, z: 0.04, duration: 0.42 }, 0.22)
              .to(camera.position, { x: 0.16, y: 0.08, z: 5.02, duration: 0.42 }, 0.22)
              .to(segmentMaterials, { opacity: 0.18, duration: 0.3 }, 0.24)
              .to(segmentEdgeMaterials, { opacity: 0.5, duration: 0.3 }, 0.24)
              .to(grooveMaterials, { opacity: 0.24, duration: 0.28 }, 0.24)
              .to(waveMaterials, { opacity: 0.68, duration: 0.28 }, 0.24)
              .to(djMaterials, { opacity: 0.68, duration: 0.28 }, 0.24)
              .to(runtimeMaterials, { opacity: 0.84, duration: 0.32 }, 0.3)
              .to(engine.rotation, { x: -0.03, y: -0.06, z: 0.01, duration: 0.4 }, 0.56)
              .to(coreGroup.scale, { x: 1, y: 1, z: 1, duration: 0.34 }, 0.56)
              .to(coreGroup.rotation, { z: -Math.PI * 0.1, duration: 0.34 }, 0.56)
              .to(engine.position, { x: -0.02, y: 0, z: 0.02, duration: 0.4 }, 0.56)
              .to(camera.position, { x: -0.03, y: 0.02, z: 5.34, duration: 0.38 }, 0.56)
              .to(segmentMaterials, { opacity: 0.22, duration: 0.3 }, 0.58)
              .to(segmentEdgeMaterials, { opacity: 0.42, duration: 0.3 }, 0.58)
              .to(runtimeMaterials, { opacity: 0.12, duration: 0.26 }, 0.62)
              .to(opsMaterials, { opacity: 0.86, duration: 0.3 }, 0.64)
              .to(grooveMaterials, { opacity: 0.18, duration: 0.28 }, 0.66)
              .to(waveMaterials, { opacity: 0.72, duration: 0.28 }, 0.66)
              .to(emberLight, { intensity: 3.8, duration: 0.26 }, 0.66)
              .to(rimLight, { intensity: 5.1, duration: 0.26 }, 0.66)
              .to(engine.rotation, { x: -0.1, y: 0.36, z: -0.06, duration: 0.36 }, 0.82)
              .to(coreGroup.scale, { x: 1.14, y: 1.14, z: 1.14, duration: 0.28 }, 0.82)
              .to(coreGroup.rotation, { z: Math.PI * 0.24, duration: 0.28 }, 0.82)
              .to(engine.position, { x: -0.06, y: -0.02, z: 0.06, duration: 0.36 }, 0.82)
              .to(camera.position, { x: -0.08, y: 0.06, z: 5.06, duration: 0.34 }, 0.82)
              .to(opsMaterials, { opacity: 0.12, duration: 0.24 }, 0.84)
              .to(releaseMaterials, { opacity: 0.92, duration: 0.3 }, 0.86)
              .to(djMaterials, { opacity: 0.78, duration: 0.28 }, 0.86)
              .to(waveMaterials, { opacity: 0.84, duration: 0.28 }, 0.86)
              .to(emberLight, { intensity: 5.6, duration: 0.26 }, 0.86)
              .to(rimLight, { intensity: 6.0, duration: 0.26 }, 0.86)
              .to(engine.rotation, { x: 0.01, y: -0.02, z: -0.03, duration: 0.34 }, 1.02)
              .to(coreGroup.scale, { x: 1, y: 1, z: 1, duration: 0.28 }, 1.02)
              .to(coreGroup.rotation, { z: 0, duration: 0.28 }, 1.02)
              .to(engine.position, { x: 0, y: 0, z: 0.02, duration: 0.34 }, 1.02)
              .to(camera.position, { x: 0, y: 0.02, z: 5.6, duration: 0.34 }, 1.02)
              .to(releaseMaterials, { opacity: 0.4, duration: 0.24 }, 1.04)
              .to(segmentMaterials, { opacity: 0.2, duration: 0.24 }, 1.04)
              .to(segmentEdgeMaterials, { opacity: 0.44, duration: 0.24 }, 1.04)
              .to(grooveMaterials, { opacity: 0.18, duration: 0.24 }, 1.04)
              .to(waveMaterials, { opacity: 0.62, duration: 0.24 }, 1.04)
              .to(djMaterials, { opacity: 0.68, duration: 0.24 }, 1.04);

              parts.forEach(({ object, x, y, z, rx, ry, rz, openX, openY, openZ, openRX, openRY, openRZ }, index) => {
                const offset = (index % 7) * 0.008;
                timeline
                  .to(object.position, { x: x + openX * 0.7, y: y + openY * 0.7, z: z + openZ * 0.56, duration: 0.24 }, 0.18 + offset)
                  .to(object.rotation, { x: rx + openRX * 0.64, y: ry + openRY * 0.64, z: rz + openRZ * 0.64, duration: 0.24 }, 0.18 + offset)
                  .to(object.position, { x: x + openX * 1.1, y: y + openY * 1.1, z: z + openZ * 1.08, duration: 0.32 }, 0.3 + offset)
                  .to(object.rotation, { x: rx + openRX * 1.1, y: ry + openRY * 1.1, z: rz + openRZ * 1.1, duration: 0.32 }, 0.3 + offset)
                  .to(object.position, { x: x + openX * 0.12, y: y + openY * 0.12, z: z + openZ * 0.1, duration: 0.34 }, 0.56 + offset)
                  .to(object.rotation, { x: rx + openRX * 0.1, y: ry + openRY * 0.1, z: rz + openRZ * 0.08, duration: 0.34 }, 0.56 + offset)
                  .to(object.position, { x: x + openX * 0.34, y: y + openY * 0.26, z: z + openZ * 0.28, duration: 0.28 }, 0.84 + offset)
                  .to(object.rotation, { x: rx - openRX * 0.08, y: ry + openRY * 0.2, z: rz - openRZ * 0.16, duration: 0.28 }, 0.84 + offset)
                  .to(object.position, { x, y, z, duration: 0.34 }, 1.02 + offset)
                  .to(object.rotation, { x: rx, y: ry, z: rz, duration: 0.34 }, 1.02 + offset);
              });
            }, scrollStage);

            scrollCleanup = () => ctx.revert();
            refreshScrollTriggers = () => ScrollTrigger.refresh();
          } catch (error) {
            console.warn('bunIn scroll motion failed after initialization. The 3D scene will stay visible.', error);
          }
        }

        applySceneTheme();
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
        window.addEventListener('bunin-theme-change', handleSceneThemeChange);
        canvas.addEventListener('webglcontextlost', handleContextLost);
        canvas.addEventListener('webglcontextrestored', handleContextRestored);
        resize();
        shell.dataset.sceneStatus = 'ready';
        shell.addEventListener('pointermove', handlePointerMove);
        shell.addEventListener('pointerleave', handlePointerLeave);
        window.addEventListener('resize', resize);
        updateScrollProgress();
        window.addEventListener('scroll', updateScrollProgress, { passive: true });
        window.requestAnimationFrame(refreshScrollTriggers);

        if (reducedMotion) {
          render();
        } else {
          frameId = window.requestAnimationFrame(animate);
        }

        cleanupScene = () => {
          window.cancelAnimationFrame(frameId);
          window.removeEventListener('resize', resize);
          window.removeEventListener('scroll', updateScrollProgress);
          window.removeEventListener('bunin-theme-change', handleSceneThemeChange);
          canvas.removeEventListener('webglcontextlost', handleContextLost);
          canvas.removeEventListener('webglcontextrestored', handleContextRestored);
          themeObserver.disconnect();
          shell.removeEventListener('pointermove', handlePointerMove);
          shell.removeEventListener('pointerleave', handlePointerLeave);
          scrollCleanup();
          disposeObject(rig);
          renderer.dispose();
        };
      },
    ).catch((error: unknown) => {
      if (!isMounted || !shellRef.current) return;

      shellRef.current.dataset.sceneStatus = 'fallback';
      console.error('bunIn 3D scene failed to initialize.', error);
    });

    return () => {
      isMounted = false;
      cleanupScene();
    };
  }, []);

  return (
    <div
      ref={shellRef}
      className={s.sceneShell}
      aria-label="방문자의 움직임에 맞춰 부드럽게 변하는 번인 브랜드 비주얼"
      role="img"
    >
      <div className={s.sceneFallback} data-scene-fallback aria-hidden="true" />
      <canvas ref={canvasRef} className={s.sceneCanvas} />
      <div className={s.sceneOverlay} aria-hidden="true" />
    </div>
  );
}
