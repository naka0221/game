import * as THREE from 'three';
import type { HookState } from './types';
import type { MineItem } from './Item';

const PIVOT_Y = 9;
const MIN_ANGLE = -Math.PI / 3;
const MAX_ANGLE = Math.PI / 3;
const MAX_ROPE_LENGTH = 14;
const BASE_EXTEND_SPEED = 10;
const BASE_RETRACT_SPEED = 8;
const SWING_AMPLITUDE = (MAX_ANGLE - MIN_ANGLE) / 2;
const SWING_CENTER = (MAX_ANGLE + MIN_ANGLE) / 2;

export class Hook {
  readonly group: THREE.Group;
  private rope: THREE.Mesh;
  private claw: THREE.Group;
  private leftClaw: THREE.Mesh;
  private rightClaw: THREE.Mesh;

  angle = SWING_CENTER;
  ropeLength = 1.5;
  state: HookState = 'swinging';
  swingSpeed = 1.2;
  swingTime = 0;
  attachedItem: MineItem | null = null;

  private ropeGeometry: THREE.CylinderGeometry;
  private readonly pivot = new THREE.Vector3(0, PIVOT_Y, 0);

  constructor(scene: THREE.Scene) {
    this.group = new THREE.Group();

    const armGeom = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    const armMat = new THREE.MeshStandardMaterial({ color: 0x555555, metalness: 0.6 });
    const arm = new THREE.Mesh(armGeom, armMat);
    arm.position.y = PIVOT_Y;
    this.group.add(arm);

    this.ropeGeometry = new THREE.CylinderGeometry(0.04, 0.04, 1, 6);
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    this.rope = new THREE.Mesh(this.ropeGeometry, ropeMat);
    this.group.add(this.rope);

    this.claw = new THREE.Group();
    const clawMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9 });

    const clawBase = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), clawMat);
    this.claw.add(clawBase);

    this.leftClaw = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.08), clawMat);
    this.leftClaw.position.set(-0.12, -0.25, 0);
    this.leftClaw.rotation.z = 0.3;
    this.claw.add(this.leftClaw);

    this.rightClaw = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.4, 0.08), clawMat);
    this.rightClaw.position.set(0.12, -0.25, 0);
    this.rightClaw.rotation.z = -0.3;
    this.claw.add(this.rightClaw);

    this.group.add(this.claw);
    scene.add(this.group);
    this.updateVisuals();
  }

  update(dt: number): void {
    switch (this.state) {
      case 'swinging':
        this.swingTime += dt * this.swingSpeed;
        this.angle = SWING_CENTER + Math.sin(this.swingTime) * SWING_AMPLITUDE;
        this.ropeLength = 1.5;
        break;

      case 'extending':
        this.ropeLength += BASE_EXTEND_SPEED * dt;
        if (this.ropeLength >= MAX_ROPE_LENGTH) {
          this.state = 'retracting';
        }
        break;

      case 'retracting': {
        const weight = this.attachedItem?.weight ?? 1;
        const speed = BASE_RETRACT_SPEED / weight;
        this.ropeLength -= speed * dt;
        if (this.ropeLength <= 1.5) {
          this.ropeLength = 1.5;
          this.state = 'swinging';
          this.openClaw();
        }
        break;
      }
    }

    this.updateVisuals();
    this.updateAttachedItem();
  }

  drop(): void {
    if (this.state === 'swinging') {
      this.state = 'extending';
      this.closeClaw();
    }
  }

  grab(item: MineItem): void {
    this.attachedItem = item;
    item.collected = true;
    this.state = 'retracting';
    this.closeClaw();
  }

  getTipPosition(): THREE.Vector3 {
    const dir = this.getDirection();
    return this.pivot.clone().add(dir.multiplyScalar(this.ropeLength));
  }

  getDirection(): THREE.Vector3 {
    return new THREE.Vector3(Math.sin(this.angle), -Math.cos(this.angle), 0);
  }

  isAtTop(): boolean {
    return this.state === 'swinging' && this.ropeLength <= 1.5;
  }

  consumeCollected(): MineItem | null {
    const item = this.attachedItem;
    this.attachedItem = null;
    return item;
  }

  reset(): void {
    this.state = 'swinging';
    this.ropeLength = 1.5;
    this.swingTime = 0;
    this.attachedItem = null;
    this.openClaw();
    this.updateVisuals();
  }

  private updateVisuals(): void {
    const dir = this.getDirection();
    const tip = this.pivot.clone().add(dir.clone().multiplyScalar(this.ropeLength));

    this.rope.position.copy(this.pivot).lerp(tip, 0.5);
    this.rope.scale.y = this.ropeLength;
    this.rope.lookAt(tip.clone().add(new THREE.Vector3(0, 1, 0)));
    this.rope.rotateX(Math.PI / 2);

    this.claw.position.copy(tip);
    this.claw.rotation.z = this.angle;
  }

  private updateAttachedItem(): void {
    if (!this.attachedItem) return;
    const tip = this.getTipPosition();
    this.attachedItem.mesh.position.copy(tip);
    this.attachedItem.mesh.position.y -= 0.3;
  }

  private closeClaw(): void {
    this.leftClaw.rotation.z = 0.1;
    this.rightClaw.rotation.z = -0.1;
  }

  private openClaw(): void {
    this.leftClaw.rotation.z = 0.3;
    this.rightClaw.rotation.z = -0.3;
  }

  dispose(): void {
    this.ropeGeometry.dispose();
    (this.rope.material as THREE.Material).dispose();
  }
}

export function checkHookCollision(
  hook: Hook,
  items: MineItem[],
): MineItem | null {
  if (hook.state !== 'extending') return null;

  const tip = hook.getTipPosition();
  let closest: MineItem | null = null;
  let closestDist = Infinity;

  for (const item of items) {
    if (item.collected) continue;
    const dist = tip.distanceTo(item.position);
    if (dist < item.grabRadius + 0.3 && dist < closestDist) {
      closest = item;
      closestDist = dist;
    }
  }

  return closest;
}
