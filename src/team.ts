import * as THREE from "three";
import { Scene } from "three";
var draggable: THREE.Object3D;



export class Team {
    type: string;
    scene: THREE.Scene;
    color: number = 0xffffff;

    xPosition: number[] = [-29, -20, -12, -4, 4, 12, 20, 29];
    zPosition: number[] = [-26, -17, -9, -1, 7, 15, 23, 31];
    constructor(type: string, scene: THREE.Scene) {
        this.scene = scene;
        this.type = type;
        this.color = this.type == "w" ? 0xffffff : 0x121222;
    }
    createTeam() {
        let x = new Set<number>();
        x.add(Math.floor((Math.random() * 10) % 8));
        x.add(Math.floor((Math.random() * 10) % 8));
        x.add(Math.floor((Math.random() * 10) % 8));
        x.add(Math.floor((Math.random() * 10) % 8));
        x.add(Math.floor((Math.random() * 10) % 8));
        x.add(Math.floor((Math.random() * 10) % 8));
        let array = Array.from(x);
        if (this.type == "w") {
            this.createPiece(this.xPosition[array[0]], this.zPosition[7]);
            this.createPiece(this.xPosition[array[1]], this.zPosition[7]);
            this.createPiece(this.xPosition[array[2]], this.zPosition[7]);
        }
        if (this.type == "b") {
            this.createPiece(this.xPosition[array[2]], this.zPosition[0]);
            this.createPiece(this.xPosition[array[1]], this.zPosition[0]);
            this.createPiece(this.xPosition[array[0]], this.zPosition[0]);
        }
    }
    createPiece(x: number, z: number) {
        let radius = 2.5;
        let height = 12;
        let pos = { x: x, y: 7, z: z };
        let cylinder = new THREE.Mesh(
            new THREE.CylinderBufferGeometry(radius - 1, radius, height, 32),
            new THREE.MeshPhongMaterial({ color: this.color })
        );
        cylinder.position.set(pos.x, pos.y, pos.z);
        cylinder.add(this.createSphere());
        cylinder.userData.draggable = true;
        cylinder.userData.turn = true;
        cylinder.userData.type = this.type;
        cylinder.userData.name = "CYLINDER";
        this.scene.add(cylinder);
    }
    private createSphere() {
        let radius = 3.2;
        let pos = { x: 0, y: 6, z: 0 };
        let sphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry(radius, 22, 20),
            new THREE.MeshPhongMaterial({ color: this.color })
        );
        sphere.position.set(pos.x, pos.y, pos.z);
        return sphere;
    }

     dragObject() {
         if (draggable != null) {
             const found = intersect(moveMouse);
             if (found.length > 0) {
                 for (let i = 0; i < found.length; i++) {
                     if (!found[i].object.userData.ground) continue;
                     let target = found[i].point;
                     draggable.position.x = target.x;
                     draggable.position.z = target.z;
                     draggable.position.y = target.y + 10;
                 }
             }
         }
     }
}
