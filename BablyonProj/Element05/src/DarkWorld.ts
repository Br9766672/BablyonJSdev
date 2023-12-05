import setSceneIndex from "./index";
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
    CubeTexture,
    Sprite,
    SpriteManager,
    SceneLoader,
    ActionManager,
    ExecuteCodeAction,
    AnimationPropertiesOverride,
    BaseCameraMouseWheelInput,
    Sound,
    } from "@babylonjs/core";
  import * as GUI from "@babylonjs/gui";  
  import HavokPhysics from "@babylonjs/havok";
  import { HavokPlugin, PhysicsAggregate, PhysicsShapeType } from "@babylonjs/core";

  function createSceneButton(scene: Scene, name: string, index: string, x: string, y: string, advtex) {
    let button = GUI.Button.CreateSimpleButton(name, index);
        button.left = x;
        button.top = y;
        button.width = "160px";
        button.height = "60px";
        button.color = "black";
        button.cornerRadius = 20;
        button.background = "white";

        const buttonClick = new Sound("MenuClickSFX", "./audio/menu-click.wav", scene, null, {
          loop: false,
          autoplay: false,
        });

        button.onPointerUpObservable.add(function() {
            console.log("THE BUTTON HAS BEEN CLICKED");
            buttonClick.play();
            setSceneIndex(0);
        });
        advtex.addControl(button);
        return button;
 }

  let initializedHavok;
  HavokPhysics().then((havok) => {
    initializedHavok = havok;
  });

  const havokInstance = await HavokPhysics();
  const havokPlugin = new HavokPlugin(true, havokInstance);

  globalThis.HK = await HavokPhysics();

  let keyDownMap: any[] = [];
  let currentSpeed: number = 0.1;
  let walkingSpeed: number = 0.1;
  let runningSpeed: number = 0.4;

  
  
  function importPlayerMesh(scene: Scene,collider: Mesh, x: number, y: number) {
    let tempItem = { flag: false } 
    let item = SceneLoader.ImportMesh("", "./models/", "dummy3.babylon", scene, function(newMeshes, particleSystems, skeletons) {
      let mesh = newMeshes[0];
      let skeleton = skeletons[0];
      skeleton.animationPropertiesOverride = new AnimationPropertiesOverride();
      skeleton.animationPropertiesOverride.enableBlending = true;
      skeleton.animationPropertiesOverride.blendingSpeed = 0.05;
      skeleton.animationPropertiesOverride.loopMode = 1; 

      let idleRange: any = skeleton.getAnimationRange("YBot_Idle");
      let walkRange: any = skeleton.getAnimationRange("YBot_Walk");
       // let runRange: any = skeleton.getAnimationRange("YBot_Run");
      //let leftRange: any = skeleton.getAnimationRange("YBot_LeftStrafeWalk");
      //let rightRange: any = skeleton.getAnimationRange("YBot_RightStrafeWalk");

       //Speed and Rotation Variables
       let speed: number = 0.03;
       let speedBackward: number = 0.01;
       let rotationSpeed = 0.05;

      let animating: boolean = false;
  
      scene.onBeforeRenderObservable.add(()=> {
        let keydown: boolean = false;
        let shiftdown: boolean = false;
        if (keyDownMap["w"] || keyDownMap["ArrowUp"]) {
          mesh.moveWithCollisions(mesh.forward.scaleInPlace(speed));
          //mesh.position.z += 0.1;
          //mesh.rotation.y = 0;
          keydown = true;
        }
        if (keyDownMap["a"] || keyDownMap["ArrowLeft"]) {
          mesh.rotate(Vector3.Up(), -rotationSpeed);
          //mesh.position.x -= 0.1;
          //mesh.rotation.y = 3 * Math.PI / 2;
          keydown = true;
        }
        if (keyDownMap["s"] || keyDownMap["ArrowDown"]) {
          mesh.moveWithCollisions(mesh.forward.scaleInPlace(-speedBackward));
          //mesh.position.z -= 0.1;
          //mesh.rotation.y = 2 * Math.PI / 2;
          keydown = true;
        }
        if (keyDownMap["d"] || keyDownMap["ArrowRight"]) {
          mesh.rotate(Vector3.Up(), rotationSpeed);
          //mesh.position.x += 0.1;
          //mesh.rotation.y = Math.PI / 2;
          keydown = true;
        }
        if (keyDownMap["Shift"] || keyDownMap["LeftShift"]) {
          currentSpeed = runningSpeed;
          shiftdown = true;
        } else {
          currentSpeed = walkingSpeed;
          shiftdown = false;
        }

        if (keydown) {
          if (!animating) {
            animating = true;
            scene.beginAnimation(skeleton, walkRange.from, walkRange.to, true);
          }
        } else {
          animating = false;
          scene.stopAnimation(skeleton);
        }
        if (mesh.intersectsMesh(collider)) {
          console.log("COLLIDED");
        }
        
      });
      //item = mesh;
      let playerAggregate = new PhysicsAggregate(mesh, PhysicsShapeType.CAPSULE, { mass: 0 }, scene);
      playerAggregate.body.disablePreStep = false;
    });
    return item;
  }

  

  function actionManager(scene: Scene){
    scene.actionManager = new ActionManager(scene);

    scene.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnKeyDownTrigger,
          //parameters: 'w'
        },
        function(evt) {keyDownMap[evt.sourceEvent.key] = true; }
      )
    );
    scene.actionManager.registerAction(
      new ExecuteCodeAction(
        {
          trigger: ActionManager.OnKeyUpTrigger
        },
        function(evt) {keyDownMap[evt.sourceEvent.key] = false; }
      )
    );
    return scene.actionManager;
      }
    function createBox(scene: Scene, x: number, y: number, z: number) {
      let box: Mesh = MeshBuilder.CreateBox("box", { });
      box.position.x = x;
      box.position.y = y;
      box.position.z = z;
      const boxAggregate = new PhysicsAggregate(box, PhysicsShapeType.BOX, { mass: 1 }, scene);
      return box;
    }

    function createSkull(scene: Scene, x: number, y: number, z: number){
      SceneLoader.ImportMesh("", "./models/", "skull.babylon",scene, function (newMeshes){

      var skull = newMeshes[0]
      skull.scaling.scaleInPlace(0.01);
      skull.position.set(x,y,z)
      const skullAggergate = new PhysicsAggregate(skull,PhysicsShapeType.MESH,{mass: 1},scene)
      return skull
      }
       
    );}
  
  
    function createSkybox(scene: Scene) {
      //Skybox
      const skybox = MeshBuilder.CreateBox("skyBox", {size:150}, scene);
        const skyboxMaterial = new StandardMaterial("skyBox", scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new CubeTexture("textures/skyboxBlack", scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
        skyboxMaterial.specularColor = new Color3(0, 0, 0);
        skybox.material = skyboxMaterial;
      return skybox;
    }
   
    function createAnyLight(scene: Scene, index: number, px: number, py: number, pz: number, colX: number, colY: number, colZ: number, mesh: Mesh) {
        // only spotlight, point and directional can cast shadows in BabylonJS
        switch (index) {
          case 1: //hemispheric light
            const hemiLight = new HemisphericLight("hemiLight", new Vector3(px, py, pz), scene);
            hemiLight.intensity = 0.1;
            return hemiLight;
            break;
          case 2: //spot light
            const spotLight = new SpotLight("spotLight", new Vector3(px, py, pz), new Vector3(0, -1, 0), Math.PI / 3, 10, scene);
            spotLight.diffuse = new Color3(colX, colY, colZ); //0.39, 0.44, 0.91
            let shadowGenerator = new ShadowGenerator(1024, spotLight);
            shadowGenerator.addShadowCaster(mesh);
            shadowGenerator.useExponentialShadowMap = true;
            return spotLight;
            break;
          case 3: //point light
            const pointLight = new PointLight("pointLight", new Vector3(px, py, pz), scene);
            pointLight.diffuse = new Color3(colX, colY, colZ); //0.39, 0.44, 0.91
            shadowGenerator = new ShadowGenerator(1024, pointLight);
            shadowGenerator.addShadowCaster(mesh);
            shadowGenerator.useExponentialShadowMap = true;
            return pointLight;
            break;
        }
      }
     
  
    function createLight(scene: Scene) {
      const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
      light.intensity = 0.7;
      return light;
    }
    
    function createGround(scene: Scene) {
      const ground = MeshBuilder.CreateGround("ground", {height: 10, width: 10, subdivisions: 4});
      ground.isVisible = false;
      const groundAggregate = new PhysicsAggregate(ground, PhysicsShapeType.BOX, { mass: 0 }, scene);
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
    
    export default function GameScene(engine: Engine) {
      interface SceneData {
        scene: Scene;
        importMesh?: any;
        actionManager?: any;
        box?: Mesh;
        skull?:any;
        skybox?: Mesh;
        light?: Light;
        ground?: Mesh;
        camera?: Camera;
      }
    
      let that: SceneData = { scene: new Scene(engine) };
      //that.scene.debugLayer.show();
      let advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI", true);
      let button1 = createSceneButton(that.scene, "lightbut", "Light World", "-100px", "400px", advancedTexture);
      that.scene.enablePhysics(new Vector3(0, -9.8, 0), havokPlugin);
      that.box = createBox(that.scene, 2, 2, 2);
      that.skull = createSkull(that.scene,-2,2,2);
      that.importMesh = importPlayerMesh(that.scene,that.box, 0, 0);
      that.actionManager = actionManager(that.scene);
      that.skybox = createSkybox(that.scene);
      createLight(that.scene);
      createGround(that.scene);
      createArcRotateCamera(that.scene);
      return that;
    }
  