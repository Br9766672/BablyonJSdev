//import "@babylonjs/core/Debug/debugLayer";
//import "@babylonjs/inspector";
import {
    Scene,
    ArcRotateCamera,
    Vector3,
    Vector4,
    HemisphericLight,
    MeshBuilder,
    Mesh,
    StandardMaterial,
    Texture,
    Light,
    Camera,
    Engine,
  } from "@babylonjs/core";
  
  
  function createBox(scene: Scene , px: number, py: number, pz: number , sx: number , sy: number ,sz: number ) {
    let box = MeshBuilder.CreateBox("box",{size: 1}, scene);
    box.position = new Vector3(px, py, pz)
    box.scaling = new Vector3(sx, sy, sz)
    return box;
  }
  const mat = new StandardMaterial("mat");
  const texture = new Texture("https://assets.babylonjs.com/environments/numbers.jpg");
  mat.diffuseTexture = texture;

  var columns = 6;
  var rows = 1;

  const faceUV = new Array(6);

  for (let i = 0; i < 6; i++) {
      faceUV[i] = new Vector4(i / columns, 0, (i + 1) / columns, 1 / rows);
  }

  const options = {
      faceUV: faceUV,
      wrap: true
  };
  function createFacedBox(scene: Scene , px : number, py : number, pz : number)
  {
    let facedBox = MeshBuilder.CreateBox("facedBox",{size: 1}, scene)
    facedBox.position = new Vector3(px, py, pz)
    facedBox.material = mat
    return facedBox;
  }
  
  
  function createLight(scene: Scene) {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.7;
    return light;
  }
  
  function createSphere(scene: Scene) {
    let sphere = MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 2, segments: 32 },
      scene,
    );
    sphere.position.y = 1;
    return sphere;
  }
  
  function createGround(scene: Scene) {
    let ground = MeshBuilder.CreateGround(
      "ground",
      { width: 6, height: 6 },
      scene,
    );
    return ground;
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
      scene,
    );
    camera.attachControl(true);
    return camera;
  }
  
  export default function createStartScene(engine: Engine) {
    interface SceneData {
      scene: Scene;
      box?: Mesh;
      facedBox?: Mesh;
      light?: Light;
      sphere?: Mesh;
      ground?: Mesh;
      camera?: Camera;
    }
  
    let that: SceneData = { scene: new Scene(engine) };
    //that.scene.debugLayer.show();

    createBox(that.scene , 5 , 5 , 10 , 1 , 1 , 2);
    createFacedBox(that.scene, 10, 1 ,5)
    createLight(that.scene);
    createSphere(that.scene);
    createGround(that.scene);
    createArcRotateCamera(that.scene);
    return that;
  }
