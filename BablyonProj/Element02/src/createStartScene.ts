//import "@babylonjs/core/Debug/debugLayer";
//import "@babylonjs/inspector";
import {
  Scene,
  ArcRotateCamera,
  Vector3,
  Color3,
  HemisphericLight,
  MeshBuilder,
  Mesh,
  StandardMaterial,
  SpriteManager,
  Sprite,
  Texture,
  CubeTexture,
  Light,
  Camera,
  Engine,
} from "@babylonjs/core";

function createTerrain(scene: Scene) {
  const largeGroundMat = new StandardMaterial("largeGroundMat");
  largeGroundMat.diffuseTexture = new Texture(
    "./src/textures/valleygrass.png"
  );

  const largeGround = MeshBuilder.CreateGroundFromHeightMap(
    "largeGround",
    "./src/textures/villageheightmap.png",
    { width: 150, height: 150, subdivisions: 20, minHeight: 0, maxHeight: 10 }
  );
  largeGround.material = largeGroundMat;
  return largeGround;
}

function createSkyBox(scene: Scene) {
  const skybox = MeshBuilder.CreateBox("skyBox", { size: 150 }, scene);
  const skyboxMaterial = new StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new CubeTexture("textures/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
  skyboxMaterial.specularColor = new Color3(0, 0, 0);
  skybox.material = skyboxMaterial;
  return skybox;
}

function createTrees(scene: Scene) {
  const spriteManagerTrees = new SpriteManager(
    "treesManager",
    "./src/textures/palmtree.png",
    2000,
    { width: 512, height: 1024 },
    scene
  );
  //We create trees at random positions
  for (let i = 0; i < 500; i++) {
    const tree = new Sprite("tree", spriteManagerTrees);
    tree.position.x = Math.random() * -30;
    tree.position.z = Math.random() * 20 + 8;
    tree.position.y = 0.5;
  }
  for (let i = 0; i < 500; i++) {
    const tree = new Sprite("tree", spriteManagerTrees);
    tree.position.x = Math.random() * 25 + 7;
    tree.position.z = Math.random() * -35 + 8;
    tree.position.y = 0.5;
  }
  return spriteManagerTrees;
}
function createLight(scene: Scene) {
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.7;
  return light;
}

function createBox(scene: Scene) {
  const box = MeshBuilder.CreateBox("box", {});
  box.position.y = 0.5;
  return box;
}

function createRoof(scene: Scene) {
  const roof = MeshBuilder.CreateCylinder("roof", {
    diameter: 1.3,
    height: 1.2,
    tessellation: 3,
  });
  roof.scaling.x = 0.75;
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 1.22;

  return roof;
}

function createHouse(scene: Scene) {
  const box = createBox(scene);
  const roof = createRoof(scene);
  const house = Mesh.MergeMeshes([box, roof]);
  return house;
}
function createArcRotateCamera(scene: Scene) {
  let camAlpha = -Math.PI / 2,
    camBeta = Math.PI / 2.5,
    camDist = 10,
    camTarget = new Vector3(0, 0, 0);
  let camera = new ArcRotateCamera(
    "camera1",
    camAlpha,
    camBeta,
    camDist,
    camTarget,
    scene
  );
  camera.attachControl(true);
  return camera;
}

export default function createStartScene(engine: Engine) {
  interface SceneData {
    scene: Scene;
    box?: Mesh;
    roof?: Mesh;
    terrain?: Mesh;
    light?: Light;
    camera?: Camera;
    skybox?: Mesh;
    trees?: SpriteManager;
    house?: Mesh;
  }

  let that: SceneData = { scene: new Scene(engine) };
  //that.scene.debugLayer.show();
  that.box = createBox(that.scene);
  that.roof = createRoof(that.scene);
  that.terrain = createTerrain(that.scene);
  that.light = createLight(that.scene);
  that.camera = createArcRotateCamera(that.scene);
  that.skybox = createSkyBox(that.scene);
  that.trees = createTrees(that.scene);
  return that;
}
