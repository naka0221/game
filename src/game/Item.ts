import * as THREE from 'three';
import { ITEM_DEFS, type ItemType } from './types';

export class MineItem {
  readonly mesh: THREE.Mesh;
  readonly type: ItemType;
  readonly value: number;
  readonly weight: number;
  readonly grabRadius: number;
  collected = false;

  constructor(type: ItemType, x: number, z: number, customValue?: number) {
    const def = ITEM_DEFS[type];
    this.type = type;
    this.value = customValue ?? (type === 'money_bag' ? randomMoneyBagValue() : def.value);
    this.weight = def.weight;
    this.grabRadius = def.size * 0.8;

    const geometry = createItemGeometry(type, def.size);
    const material = new THREE.MeshStandardMaterial({
      color: def.color,
      metalness: type.includes('gold') || type === 'diamond' ? 0.8 : 0.2,
      roughness: type === 'rock' ? 0.9 : 0.3,
      emissive: type === 'diamond' ? 0x004444 : 0x000000,
      emissiveIntensity: type === 'diamond' ? 0.3 : 0,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(x, def.size * 0.5, z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.userData.mineItem = this;
  }

  get position(): THREE.Vector3 {
    return this.mesh.position;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
}

function createItemGeometry(type: ItemType, size: number): THREE.BufferGeometry {
  switch (type) {
    case 'gold_small':
    case 'gold_large':
      return new THREE.SphereGeometry(size, 16, 12);
    case 'rock':
      return new THREE.DodecahedronGeometry(size, 0);
    case 'diamond':
      return new THREE.OctahedronGeometry(size, 0);
    case 'money_bag':
      return new THREE.SphereGeometry(size, 8, 6);
  }
}

function randomMoneyBagValue(): number {
  return Math.floor(Math.random() * 150) + 50;
}
