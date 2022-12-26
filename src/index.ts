import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { Team } from "./team";

// CAMERA
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    1500
);
camera.position.set(-35, 70, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));

// RENDERER
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    antialias: true,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// WINDOW RESIZE HANDLING
export function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize);

// SCENE
const scene: THREE.Scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5);

// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI / 2.5;
export function animate() {
    dragObject();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// ambient light
let hemiLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(hemiLight);

//Add directional light
let dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(-30, 40, -30);
scene.add(dirLight);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.left = -70;
dirLight.shadow.camera.right = 70;
dirLight.shadow.camera.top = 200;
dirLight.shadow.camera.bottom = -70;
function createFloor() {
    let pos = { x: 0, y: -1.5, z: 3 };
    let scale = { x: 80, y: 2, z: 80 };

    let blockPlane = new THREE.Mesh(
        new THREE.BoxBufferGeometry(),
        new THREE.MeshPhongMaterial({ color: 0xf9c834 })
    );
    blockPlane.position.set(pos.x, pos.y, pos.z);
    blockPlane.scale.set(scale.x, scale.y, scale.z);
    const cubeGeo = new THREE.BoxGeometry(0.1, 0.5, 0.1);
    const brown = new THREE.MeshBasicMaterial({ color: 0x5f3725 });
    const black = new THREE.MeshBasicMaterial({ color: 0x000000 });
    let cube = new THREE.Mesh(cubeGeo, brown);
    [-0.45, -0.35, -0.25, -0.15, -0.05, 0.05, 0.15, 0.25].forEach((x) => {
        [-0.45, -0.35, -0.25, -0.15, -0.05, 0.05, 0.15, 0.25].forEach((z) => {
            if ((z * 100 - 5) % 20 == 0) {
                cube = new THREE.Mesh(
                    cubeGeo,
                    (x * 100 - 5) % 20 == 0 ? brown : black
                );
            } else {
                cube = new THREE.Mesh(
                    cubeGeo,
                    (x * 100 - 5) % 20 == 0 ? black : brown
                );
            }
            cube.position.set(x + 0.1, 0.8, z + 0.1);
            cube.castShadow = true;
            cube.receiveShadow = true;
            blockPlane.add(cube);
        });
    });
    blockPlane.castShadow = true;
    blockPlane.receiveShadow = true;
    scene.add(blockPlane);

    blockPlane.userData.ground = true;
}

function createSphere(c: string) {
    let radius = 3.2;
    let pos = { x: 0, y: 6, z: 0 };
    const color: number = c == "b" ? 0x121222 : 0xffffff;

    let sphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(radius, 22, 20),
        new THREE.MeshPhongMaterial({ color: color })
    );
    sphere.position.set(pos.x, pos.y, pos.z);
    return sphere;
}

function createCylinder(x: number, z: number, c: string) {
    let radius = 2.5;
    let height = 12;
    let pos = { x: x, y: 7, z: z };
    const color: number = c == "b" ? 0x121222 : 0xffffff;
    // threejs
    let cylinder = new THREE.Mesh(
        new THREE.CylinderBufferGeometry(radius - 1, radius, height, 32),
        new THREE.MeshPhongMaterial({ color: color })
    );
    cylinder.position.set(pos.x, pos.y, pos.z);
    // cylinder.castShadow = true;
    // cylinder.receiveShadow = true;
    cylinder.add(createSphere(c));
    scene.add(cylinder);

    cylinder.userData.draggable = true;
    cylinder.userData.turn = true;
    cylinder.userData.type = c;
    cylinder.userData.name = "CYLINDER";
}
const whiteTeam = new Team("w", scene);
whiteTeam.createTeam();
const blackTeam = new Team("b", scene);
blackTeam.createTeam();
const raycaster = new THREE.Raycaster(); // create once
const clickMouse = new THREE.Vector2(); // create once
const moveMouse = new THREE.Vector2(); // create once
var draggable: THREE.Object3D;

function intersect(pos: THREE.Vector2) {
    raycaster.setFromCamera(pos, camera);
    return raycaster.intersectObjects(scene.children);
}

window.addEventListener("click", (event) => {
    if (draggable != null) {
        console.log(`dropping draggable ${draggable.userData.name}`);
        draggable.position.y = draggable.position.y - 2;
        draggable.position.x = getXpos(draggable.position.x);
        draggable.position.z = getZpos(draggable.position.z);
        // console.log(fo)
        // draggable.userData.turn = false;
        draggable = null as any;
        return;
    }

    // THREE RAYCASTER
    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const found = intersect(clickMouse);
    if (found.length > 0) {
        if (
            found[0].object.userData.draggable &&
            found[0].object.userData.turn
        ) {
            draggable = found[0].object;
            console.log(`found draggable ${draggable.userData.name}`);
            // console.log(draggable.position.x);
        }
    }
});

window.addEventListener("mousemove", (event) => {
    moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function dragObject() {
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

function getXpos(x: number): number {
    if (-41 <= x && x <= -24.17) return xPosition[0];
    else if (-24.17 < x && x <= -15.74) return xPosition[1];
    else if (-15.74 < x && x <= -8.22) return xPosition[2];
    else if (-8.22 < x && x <= 0) return xPosition[3];
    else if (0 < x && x <= 8.06) return xPosition[4];
    else if (8.06 < x && x <= 16.21) return xPosition[5];
    else if (16.21 < x && x <= 24.38) return xPosition[6];
    else if (24.38 < x && x <= 41) return xPosition[7];
    else if (41 < x) return xPosition[7];
    return 0;
}
function getZpos(z: number): number {
    if (-41 <= z && z <= -24.17) return zPosition[0];
    else if (-24.17 < z && z <= -15.74) return zPosition[1];
    else if (-15.74 < z && z <= -8.22) return zPosition[2];
    else if (-8.22 < z && z <= 0) return zPosition[3];
    else if (0 < z && z <= 8.06) return zPosition[4];
    else if (8.06 < z && z <= 16.21) return zPosition[5];
    else if (16.21 < z && z <= 24.38) return zPosition[6];
    else if (24.38 < z && z <= 41) return zPosition[7];
    else if (41 < z) return zPosition[7];
    return 0;
}
const xPosition: number[] = [-29, -20, -12, -4, 4, 12, 20, 29];
const zPosition: number[] = [-26, -17, -9, -1, 7, 15, 23, 31];

createFloor();

animate();
