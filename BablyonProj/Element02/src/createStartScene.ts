import {
  Scene,
  ArcRotateCamera,
  Vector3,
  Vector4,
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
    "./textures/valleygrass.png"
  );

  const largeGround = MeshBuilder.CreateGroundFromHeightMap(
    "largeGround",
    "./textures/villageheightmap.png",
    { width: 150, height: 150, subdivisions: 20, minHeight: 0, maxHeight: 10 }
  );
  largeGround.material = largeGroundMat;
  return largeGround;
}

function createSkyBox(scene: Scene) {
  const skybox = MeshBuilder.CreateBox("skyBox", { size: 150 }, scene);
  const skyboxMaterial = new StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new CubeTexture("./textures/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
  skyboxMaterial.specularColor = new Color3(0, 0, 0);
  skybox.material = skyboxMaterial;
  return skybox;
}

function createTrees(scene: Scene) {
  const spriteManagerTrees = new SpriteManager(
    "treesManager",
    "./textures/palmtree.png",
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
   for (let i = 0; i < 500; i++) {
    const tree = new Sprite("tree", spriteManagerTrees);
    tree.position.x = Math.random() * 25 + 10;
    tree.position.z = Math.random() *30+ 5;
    tree.position.y = 0.5;
  }
   
  return spriteManagerTrees;
}
function createLight(scene: Scene) {
  const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
  light.intensity = 0.7;
  return light;
}

function createBox(scene: Scene, width: number) {
  const boxMat = new StandardMaterial("boxMat");
  if (width == 2) {
    boxMat.diffuseTexture = new Texture("./textures/semihouse.png") 
  }
  else {
     boxMat.diffuseTexture = new Texture("./textures/cubehouse.png");   
  }

  //options parameter to set different images on each side
  const faceUV: Vector4[] = [];
  if (width == 2) {
    faceUV[0] = new Vector4(0.6, 0.0, 1.0, 1.0); //rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.4, 1.0); //front face
    faceUV[2] = new Vector4(0.4, 0, 0.6, 1.0); //right side
    faceUV[3] = new Vector4(0.4, 0, 0.6, 1.0); //left side
  }
  else {
    faceUV[0] = new Vector4(0.5, 0.0, 0.75, 1.0); //rear face
    faceUV[1] = new Vector4(0.0, 0.0, 0.25, 1.0); //front face
    faceUV[2] = new Vector4(0.25, 0, 0.5, 1.0); //right side
    faceUV[3] = new Vector4(0.75, 0, 1.0, 1.0); //left side
     //only need to set four faces as the top and bottom cannot be seen

  
  }
  const box = MeshBuilder.CreateBox("box", {faceUV: faceUV, wrap: true});
    box.position.y = 0.5;
    box.material = boxMat;
    return box;
}
function createRoof(scene: Scene, width: number) {
  const roofMat = new StandardMaterial("roofMat");
  roofMat.diffuseTexture = new Texture("./textures/roof.jpg");

  const roof = MeshBuilder.CreateCylinder("roof", {
    diameter: 1.3,
    height: 1.2,
    tessellation: 3,
  });
  roof.material = roofMat;
  roof.scaling.x = 0.75;
  roof.rotation.z = Math.PI / 2;
  roof.position.y = 1.22;

  return roof;
}

function createHouse(scene: Scene, width: number) {
  const box = createBox(scene, width);
  const roof = createRoof(scene, width);
  const house: any = Mesh.MergeMeshes([box, roof], true, false, undefined, false, true);
  //for the UNDEFINED parameter - the BabylonJS Documentation says to use null instead of undefined but this is in JAVASCRIPT.
  //TypeScript does not accept null.
  return house;
}

function cloneHouse(scene: Scene) {
  const detached_house = createHouse(scene, 1); //.clone("clonedHouse");
  detached_house.rotation.y = -Math.PI / 16;
  detached_house.position.x = -6.8;
  detached_house.position.z = 2.5;
  //detached_house.position.y = 6.2;

  const semi_house = createHouse(scene, 2); //.clone("clonedHouse");
  semi_house.rotation.y = -Math.PI / 16;
  semi_house.position.x = -4.5;
  semi_house.position.z = 10;
  //semi_house.position.y = 6.2;

  //each entry is an array [house type, rotation, x, z]
  const places: number[] [] = []; 
  places.push([1, -Math.PI / 16, -6.8, 2.5 ]);
  places.push([2, -Math.PI / 16, -4.5, 3 ]);
  places.push([2, -Math.PI / 16, -1.5, 4 ]);
  places.push([2, -Math.PI / 3, 1.5, 6 ]);
  places.push([2, 15 * Math.PI / 16, -6.4, -1.5 ]);
  places.push([1, 15 * Math.PI / 16, -4.1, -1 ]);
  places.push([2, 15 * Math.PI / 16, -2.1, -0.5 ]);
  places.push([1, 5 * Math.PI / 4, 0, -1 ]);
  places.push([1, Math.PI + Math.PI / 2.5, 0.5, -3 ]);
  places.push([2, Math.PI + Math.PI / 2.1, 0.75, -5 ]);
  places.push([1, Math.PI + Math.PI / 2.25, 0.75, -7 ]);
  places.push([2, Math.PI / 1.9, 4.75, -1 ]);
  places.push([1, Math.PI / 1.95, 4.5, -3 ]);
  places.push([2, Math.PI / 1.9, 4.75, -5 ]);
  places.push([1, Math.PI / 1.9, 4.75, -7 ]);
  places.push([2, -Math.PI / 3, 5.25, 2 ]);
  places.push([1, -Math.PI / 3, 6, 4 ]);

  const houses: Mesh[] = [];
  for (let i = 0; i < places.length; i++) {
    if (places[i][0] === 1) {
        houses[i] = detached_house.createInstance("house" + i);
    }
    else {
        houses[i] = semi_house.createInstance("house" + i);
    }
      houses[i].rotation.y = places[i][1];
      houses[i].position.x = places[i][2];
      houses[i].position.z = places[i][3];
  }

  return houses;
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
  //Camera restrtaints
  camera.lowerRadiusLimit = 9;
  camera.upperRadiusLimit = 25;
  camera.lowerAlphaLimit = 0;
  camera.upperAlphaLimit = Math.PI * 2;
  camera.lowerBetaLimit = 0;
  camera.upperBetaLimit = Math.PI / 2.02;

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
    house?: any;
  }

  let that: SceneData = { scene: new Scene(engine) };

  //housing
  that.house = cloneHouse(that.scene);

  that.terrain = createTerrain(that.scene);
  that.light = createLight(that.scene);
  that.camera = createArcRotateCamera(that.scene);
  that.skybox = createSkyBox(that.scene);
  that.trees = createTrees(that.scene);

  
  
  return that;
}
