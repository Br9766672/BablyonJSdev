import { Engine } from "@babylonjs/core";
import LightWorld from "./LightWorld";
import Darkworld from "./DarkWorld";
import './main.css';

const CanvasName = "renderCanvas";

let canvas = document.createElement("canvas");
canvas.id = CanvasName;

canvas.classList.add("background-canvas");
document.body.appendChild(canvas);

let scene;
let scenes: any [] = [];

let eng = new Engine(canvas,true,{}, true);

scenes[0]= LightWorld(eng);
scenes[1]= Darkworld(eng);

scene = scenes[0].scene;
setSceneIndex(0);

export default function setSceneIndex(i: number )
{
    eng.runRenderLoop(() => { scenes[i].scene.render();
    });
    
}

// let eng = new Engine(canvas, true, {}, true);
// let startScene = createStartScene(eng);
// eng.runRenderLoop(() => {
//     startScene.scene.render();
// });                  
