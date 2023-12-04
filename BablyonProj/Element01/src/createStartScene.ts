import {
    Scene,
    ArcRotateCamera,
    Vector3,
    Vector4,
    HemisphericLight,
    SpotLight,
    MeshBuilder,
    Mesh,
    Light,
    Camera,
    Engine,
    StandardMaterial,
    Texture,
    Color3,
    Space,
    ShadowGenerator,
    PointLight,
    DirectionalLight,
    CreateCylinder,
  } from "@babylonjs/core";
 
  function createBox(scene: Scene, px: number, py: number, pz: number, sx: number, sy: number, sz: number, rotation: boolean) {
    let box = MeshBuilder.CreateBox("box",{size: 1}, scene);
    box.position = new Vector3(px, py, pz);
    box.scaling = new Vector3(sx, sy, sz);

    if (rotation) {
      scene.registerAfterRender(function () {
        box.rotate(new Vector3(4, 8, 2)/*axis*/, 0.02/*angle*/, Space.LOCAL);
      });
    }
    return box;
  }

  
  function createFacedBox(scene: Scene, px: number, py: number, pz: number) {
    const mat = new StandardMaterial("mat");
    const texture = new Texture("./src/textures/numbers.jpg");
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

    let box = MeshBuilder.CreateBox("tiledBox", options, scene);
    box.material = mat;
    box.position = new Vector3(px, py, pz);

    scene.registerAfterRender(function () {
        box.rotate(new Vector3(2, 6, 4)/*axis*/, 0.02/*angle*/, Space.LOCAL);
    });
    return box;
  }

  function createTorus(scene: Scene, px: number, py: number, pz: number,sx: number,sy: number, sz: number,rotation: boolean,rx: number,ry: number,rz: number,rs: number) {
    const torus = MeshBuilder.CreateTorus("torus", {});
    torus.position = new Vector3(px, py, pz);
    torus.scaling = new Vector3(sx, sy, sz)
    if (rotation){
      scene.registerAfterRender(function () {
      torus.rotate(new Vector3(rx, ry, rz)/*axis*/, rs/*angle*/, Space.LOCAL);
      
    });}
    
    return torus;
  }

  function createPolyhedra(scene: Scene, t: number, s: number, px: number, py: number, pz: number) {
    const polyhedra = MeshBuilder.CreatePolyhedron("shape", {type: t, size: s}, scene);
    polyhedra.position = new Vector3(px, py, pz);
    scene.registerAfterRender(function () {
      polyhedra.rotate(new Vector3(0, 8, 0)/*axis*/, 0.02/*angle*/, Space.LOCAL);
    });
    return polyhedra;
  }

  function createAnyLight(scene: Scene, index: number, px: number, py: number, pz: number, colX: number, colY: number, colZ: number, mesh: Mesh) {
    switch (index) {
      case 1: 
        const hemiLight = new HemisphericLight("hemiLight", new Vector3(px, py, pz), scene);
        hemiLight.intensity = 0.1;
        return hemiLight;
        break;
      case 2: 
        const spotLight = new SpotLight("spotLight", new Vector3(px, py, pz), new Vector3(0, -1, 0), Math.PI / 3, 10, scene);
        spotLight.diffuse = new Color3(colX, colY, colZ); //0.39, 0.44, 0.91
        let shadowGenerator = new ShadowGenerator(1024, spotLight);
        shadowGenerator.addShadowCaster(mesh);
        shadowGenerator.useExponentialShadowMap = true;
        return spotLight;
        break;
      case 3: 
        const pointLight = new PointLight("pointLight", new Vector3(px, py, pz), scene);
        pointLight.diffuse = new Color3(colX, colY, colZ); //0.39, 0.44, 0.91
        shadowGenerator = new ShadowGenerator(1024, pointLight);
        shadowGenerator.addShadowCaster(mesh);
        shadowGenerator.useExponentialShadowMap = true;
        return pointLight;
        break;
        default:
          return null;
    }
  }
 
  function createHemiLight(scene: Scene) {
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    light.intensity = 0.3;
    return light;
  }

  function createSphere(scene: Scene,px: number, py: number, pz: number) {
    
    let sphere = MeshBuilder.CreateSphere(
      "sphere",
      { diameter: 2, segments: 32 },
      scene,
    );
    sphere.position = new Vector3(px, py, pz);
    sphere.rotation = new Vector3(135,0,0);
    scene.registerAfterRender(function () {
      sphere.rotate(new Vector3(0, 2, 0)/*axis*/, 0.02/*angle*/, Space.LOCAL);
    });

    var spheremat = new StandardMaterial("mat2");
    spheremat.emissiveTexture = new Texture("./src/textures/Earthmap.jpg", scene);
    sphere.material = spheremat;
    return sphere;
  }

  function createCylinder(scene: Scene,px: number, py: number, pz: number,sx: number,sy: number,sz: number) {
    let cylinder = CreateCylinder(
      "cylinder",
      { height: 1, diameter: 0.7 },
      scene
    );
    cylinder.position = new Vector3(px, py, pz)
    cylinder.scaling = new Vector3(sx,sy,sz);
      scene.registerAfterRender(function () {
        cylinder.rotate(new Vector3(4, 8, 2)/*axis*/, 0.02/*angle*/, Space.LOCAL);
      });
    
    return cylinder;
  }
  
  function createCone(scene: Scene,px: number, py: number, pz: number,sx: number,sy: number,sz: number) {
    let cone = MeshBuilder.CreateCylinder(
      "cone",
      { height: 1, diameterBottom: 0.7, diameterTop: 0 },
      scene
    );
    cone.position = new Vector3(px, py, pz)
    cone.scaling = new Vector3(sx,sy,sz);

    scene.registerAfterRender(function () {
      cone.rotate(new Vector3(4, 8, 6)/*axis*/, 0.02/*angle*/, Space.LOCAL);
    });
    return cone;
  }
  
  function createGround(scene: Scene, w: number, h: number, px: number) {
    let ground = MeshBuilder.CreateGround(
      "ground",
      { width: w, height: h },
      scene,
    );
    ground.receiveShadows = true;
    ground.position.x = px;
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
      faceBox?: Mesh;
      light?: Light;
      hemisphericLight?: HemisphericLight;
      sphere?: Mesh;
      cylinder?: Mesh;
      cone?:Mesh;
      torus?: Mesh;
      polyhedra?: Mesh;
      ground?: Mesh;
      camera?: Camera;
    }
  
    let that: SceneData = { scene: new Scene(engine) };
    that.scene.debugLayer.show();
  
   
    that.hemisphericLight = createHemiLight(that.scene);

    that.faceBox = createFacedBox(that.scene, -10, 2, 0);
    that.light = createAnyLight(that.scene, 2, -10, 5, 0, 1, 0., 0, that.faceBox);

    
    //that.box = createBox(that.scene, -5, 2, 0, 3, 2, 1, true);
    that.cylinder = createCylinder(that.scene, -5.5, 2, 0, 3, 3, 3);

  
    that.torus = createTorus(that.scene, 0, 5, 0, 3, 1, 3,true,2, 6, 4, 0.06);
   
    that.sphere = createSphere(that.scene,5,2,0);  
    
    //that.polyhedra = createPolyhedra(that.scene, 1, 1, 0, 5, 0);
   
    that.torus = createTorus(that.scene, 0, 5, 0, 1, 0.5, 1,true,2, 6, 4, 0.02);
    that.light = createAnyLight(that.scene, 2, 0, 7, 0, 0, 1, 0, that.torus);



    that.cone = createCone(that.scene, 10, 2, 0, 3, 3, 3)
    //that.polyhedra = createPolyhedra(that.scene, 12, 1, 10, 2, 0);
    that.light = createAnyLight(that.scene, 2, 10, 5, 0, 0, 0, 1, that.cone);

    
    that.box = createBox(that.scene, -13, 2.5, 0, 0.5, 5, 9, false); //wall 
    that.box = createBox(that.scene, -8, 2.5, 0, 0.5, 5, 9, false); //wall
    that.box = createBox(that.scene, -3, 2.5, 0, 0.5, 5, 9, false); //wall 
    that.box = createBox(that.scene, 3, 2.5, 0, 0.5, 5, 9, false); //wall 
    that.box = createBox(that.scene, 7, 2.5, 0, 0.5, 5, 9, false); //wall 
    that.box = createBox(that.scene, 12, 2.5, 0, 0.5, 5, 9, false); //wall 

    
    that.ground = createGround(that.scene, 25, 10, -0.5);
    that.camera = createArcRotateCamera(that.scene);
    return that;
  }