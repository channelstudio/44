import React, { useState, useEffect, useRef } from 'react';
import { Viewport } from 'pixi-viewport';
import * as PIXI from 'pixi.js';

import Overlay from './Overlay';
import './App.css';

// first lets make some random colors to represent clusters
const colors = [];
for(let i = 0; i < 10; i ++) {
  //this function makes a random hex code color
  colors.push(Math.floor(Math.random()*16777215))
}

function App() {
  const [overlay, setOverlay] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const canvas = useRef(null);


  const setupCanvas = (data) => {
    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      view: canvas.current,
      backgroundColor: 0xffffff,
      resizeTo: canvas.current
    });

    const viewport = new Viewport({
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        worldWidth: 2000,
        worldHeight: 2000,
        interaction: app.renderer.plugins.interaction // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
    });

    let resizeTimeout = null;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        viewport.screenWidth = canvas.current.width;
        viewport.screenHeight = canvas.current.height;
      }, 10);
    });

    // add the viewport to the stage
    app.stage.addChild(viewport)

    // activate plugins
    viewport
        .drag()
        .pinch()
        .wheel()
        .decelerate()

    viewport.zoom(10000);


    let positionDict = {}

    for(let index in data){
        const circle = new PIXI.Graphics();
        const umapPos = data[index].umap_pos;

        const xPos = 5 * app.renderer.width * (umapPos[0] * 2 - 1);
        const yPos = 5 * app.renderer.width * (umapPos[1] * 2 - 1);

        const radius = 40;
        circle.hitArea = new PIXI.Circle(xPos, yPos, radius);
        circle.interactive = true;
        // circle.lineStyle (1, 0x000000, 1);

        // get a random color by our k-means cluster number
        const color = colors[data[index].cluster_num];
        circle.beginFill(color, 1);
        circle.drawCircle(xPos, yPos, radius);
        circle.endFill();

        circle.interactive = true;


        const name = data[index].speech_data.speech_name;
        positionDict[name] = data[index];
        circle.speech_data = data[index];
        circle.on('click', () => {
          setOverlay(circle.speech_data);
        });
        circle.on('mouseover', ({data}) => {
          document.body.style.cursor = 'pointer';
          setTooltip({
            name: circle.speech_data.speech_data.name,
            pos: data.global
          });
        });
        circle.on('mouseout', () => {
          document.body.style.cursor = 'default';
          setTooltip(null);
        });

        viewport.addChild(circle);
    }
  }

  useEffect(() => {
    fetch('lookup.json').then((resp) => {
      resp.json().then((data) => {
        setupCanvas(data);
      });
    });
  }, [])

  return (
    <div className="App">
      <canvas
        ref={canvas}
      />
      <div className="App__instructions">
        <p>scroll (don't pinch) to zoom</p>
        <p>click on a point to read the speech</p>
      </div>
      {tooltip &&
        <p className="App__tooltip" style={{
          top: tooltip.pos.y,
          left: tooltip.pos.x
        }}>{tooltip.name}</p>}
      {overlay &&
        <Overlay
          details={overlay}
          setOverlay={setOverlay}
        />
      }
    </div>
  );
}

export default App;
