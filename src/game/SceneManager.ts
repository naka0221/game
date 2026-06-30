import * as THREE from 'three';
import type { LevelConfig } from './types';
import { MineItem } from './Item';
import { Hook } from './Hook';

export class SceneManager {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly hook: Hook;

  private items: MineItem[] = [];
  private ground!: THREE.Mesh;

  constructor(canvas: HTMLCanvasElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb);
    this.scene.fog = new THREE.Fog(0x87ceeb, 20, 50);

    this.camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    this.camera.position.set(0, 14, 18);
    this.camera.lookAt(0, 2, 3);

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.setupLights();
    this.setupEnvironment();
    this.hook = new Hook(this.scene);

    window.addEventListener('resize', this.onResize);
  }

  private setupLights(): void {
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(5, 20, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 40;
    sun.shadow.camera.left = -15;
    sun.shadow.camera.right = 15;
    sun.shadow.camera.top = 15;
    sun.shadow.camera.bottom = -15;
    this.scene.add(sun);
  }

  private setupEnvironment(): void {
    const groundGeom = new THREE.PlaneGeometry(24, 16);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x8b6914, roughness: 0.9 });
    this.ground = new THREE.Mesh(groundGeom, groundMat);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.position.set(0, 0, 4);
    this.ground.receiveShadow = true;
    this.scene.add(this.ground);

    const wallGeom = new THREE.BoxGeometry(24, 3, 0.5);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x5c3d1e });
    const backWall = new THREE.Mesh(wallGeom, wallMat);
    backWall.position.set(0, 1.5, 12);
    backWall.receiveShadow = true;
    this.scene.add(backWall);

    const machineGeom = new THREE.BoxGeometry(2, 1.5, 1.5);
    const machineMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.5 });
    const machine = new THREE.Mesh(machineGeom, machineMat);
    machine.position.set(0, 0.75, -1);
    machine.castShadow = true;
    this.scene.add(machine);

    const poleGeom = new THREE.CylinderGeometry(0.15, 0.15, 9, 8);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.7 });
    const pole = new THREE.Mesh(poleGeom, poleMat);
    pole.position.set(0, 4.5, 0);
    pole.castShadow = true;
    this.scene.add(pole);
  }

  loadLevel(config: LevelConfig): void {
    this.clearItems();
    this.hook.reset();
    this.hook.swingSpeed = config.hookSwingSpeed;

    for (const itemCfg of config.items) {
      const item = new MineItem(itemCfg.type, itemCfg.x, itemCfg.z, itemCfg.value);
      this.items.push(item);
      this.scene.add(item.mesh);
    }
  }

  getItems(): MineItem[] {
    return this.items;
  }

  removeItem(item: MineItem): void {
    this.scene.remove(item.mesh);
    item.dispose();
    this.items = this.items.filter((i) => i !== item);
  }

  private clearItems(): void {
    for (const item of this.items) {
      this.scene.remove(item.mesh);
      item.dispose();
    }
    this.items = [];
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  private onResize = (): void => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  dispose(): void {
    window.removeEventListener('resize', this.onResize);
    this.clearItems();
    this.hook.dispose();
    this.renderer.dispose();
  }
}
