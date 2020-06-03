import 'phaser';
// import UIPlugin from 'Rex/rexuiplugin.min.js';
import WebFontLoaderPlugin from './plugins/rexwebfontloaderplugin.js';

import PreloadScene from 'Scenes/preloader-scene.js';
import PlayScene from 'Scenes/play-scene.js';
import BGScene from 'Scenes/bg-scene.js';
import UIScene from 'Scenes/ui-scene';


const config = {
  type: Phaser.AUTO,
  parent: 'phaser-scaffold',
  autoresize: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
  },
  dom: {
    createContainer: true,
  },
  // pixelArt: true,
  scene: [
    PreloadScene,
    PlayScene,
    BGScene,
    UIScene,
  ],
  plugins: {
    // scene: [{
    //   key: 'rexUI',
    //   plugin: UIPlugin,
    //   mapping: 'rexUI',
    // }],
    global: [
      {
        key: 'WebFontLoader',
        plugin: WebFontLoaderPlugin,
        start: true,
      },
    ],
  },
  // physics: {
  //   default: 'arcade',
  //   matter: {
  //     gravity: { x: 0, y: 0 },
  //     // debug: true
  //   }
  // }
};

const game = new Phaser.Game(config);
