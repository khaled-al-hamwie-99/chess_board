import * as THREE from "three";
import { Scene } from "three";

export class Team {
    type: string;
    scene: THREE.Scene;
    color: number = 0xffffff;
    turn: boolean = false;
    xPosition: number[] = [-29, -20, -12, -4, 4, 12, 20, 29];
    zPosition: number[] = [-26, -17, -9, -1, 7, 15, 23, 31];
    piecesPos = [
        [0, 0],
        [0, 0],
        [0, 0],
    ];
    pieces: THREE.Mesh[] = [];
    constructor(type: string, scene: THREE.Scene) {
        this.scene = scene;
        this.type = type;
        this.color = this.type == "w" ? 0xffffff : 0x121222;
    }
    createTeam() {
        let randomX = new Set<number>();
        randomX.add(Math.floor((Math.random() * 10) % 8));
        randomX.add(Math.floor((Math.random() * 10) % 8));
        randomX.add(Math.floor((Math.random() * 10) % 8));
        randomX.add(Math.floor((Math.random() * 10) % 8));
        randomX.add(Math.floor((Math.random() * 10) % 8));
        randomX.add(Math.floor((Math.random() * 10) % 8));
        let array = Array.from(randomX);
        if (this.type == "w") {
            this.turn = true;
            this.pieces.push(
                this.createPiece(this.xPosition[array[0]], this.zPosition[7]),
                this.createPiece(this.xPosition[array[1]], this.zPosition[7]),
                this.createPiece(this.xPosition[array[2]], this.zPosition[7])
            );
            this.piecesPos[0] = [this.xPosition[array[0]], this.zPosition[7]];
            this.piecesPos[1] = [this.xPosition[array[1]], this.zPosition[7]];
            this.piecesPos[2] = [this.xPosition[array[2]], this.zPosition[7]];
        }
        if (this.type == "b") {
            this.turn = false;
            this.pieces.push(
                this.createPiece(this.xPosition[array[2]], this.zPosition[0]),
                this.createPiece(this.xPosition[array[1]], this.zPosition[0]),
                this.createPiece(this.xPosition[array[0]], this.zPosition[0])
            );
            this.piecesPos[0] = [this.xPosition[array[2]], this.zPosition[0]];
            this.piecesPos[1] = [this.xPosition[array[1]], this.zPosition[0]];
            this.piecesPos[2] = [this.xPosition[array[0]], this.zPosition[0]];
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
        cylinder.userData.turn = this.turn;
        cylinder.userData.type = this.type;
        cylinder.userData.name = "CYLINDER";
        this.scene.add(cylinder);
        return cylinder;
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
    // public isAvailable(x: number, z: number) {
    //     switch (x) {
    //         case this.xPosition[0]:
    //             if (this.type == "w") {
    //             }
    //             break;

    //         default:
    //             break;
    //     }
    // }
    public setTurn(turn: boolean) {
        this.turn = turn;
        this.pieces.forEach((element) => {
            element.userData.turn = turn;
        });
    }
}
// rules 1 see what is the selected pieces on click
// then the user drag
// get where he can move
// when the user left the piece we will check on the team
// then we will check if there is a piece for my team or other team
// if it is my team ican't move
// if it is the other team i will kill it
// check where i can move
