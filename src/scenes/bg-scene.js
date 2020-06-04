import RLC from '../services/responsive-layout-calculator';
import { rndArrayItem } from '../utils/general-utils';
import { SCENARIOS } from '../services/assets-data';

const TILE_SIZE = 128;

export default class BGScene extends Phaser.Scene {
  constructor() {
    super('BGScene');
  }

  create(data) {
    this.mainCam = this.cameras.main;
    // this.mainCam.setBackgroundColor(BACKGROUND_COLOR);
    this.mainCam.fadeIn(200);

    this.playScene = data.playScene;

    this.scenario = rndArrayItem(SCENARIOS);

    const canvasTexture = this.textures.createCanvas('bg_tile', 768, 1024);
    this.canvasTexture = canvasTexture;
    
    this.bg_tile = this.add.image(RLC.CENTER_X, RLC.CENTER_Y, 'bg_tile');
    this.drawCanvasBg();

    // Events
    // this.events.on('add-points', this.setScore, this);

    // Resize issue
    this.scale.on('resize', this.onResize, this);
    this.onResize();
  }

  removeListeners() {
    // this.events.off('add-points');
  }

  onResize(gameSize, baseSize, displaySize, resolution) {
    // this.mainCam.setSize(this.scale.gameSize.width, this.scale.gameSize.height);
    this.children.list.forEach(children => { if (children.resize) children.resize(); });
    this.mainCam.setZoom(RLC.SCALE);
    this.mainCam.centerOn(RLC.CENTER_X, RLC.CENTER_Y);
    // this.drawCanvasBg();
  }

  update(time, delta) {
    this.children.list.forEach(children => { if (children.update) children.update(); });
  }

  ceilTiledSize(dimension) {
    return Math.ceil(dimension / (TILE_SIZE * 2)) * (TILE_SIZE * 2);
  }

  drawCanvasBg() {
    const { canvasTexture } = this;
    const width = RLC.TOTAL_WIDTH;
    const height = RLC.TOTAL_HEIGHT;
    const toGridDimensions = {
      x: this.ceilTiledSize(width),
      y: this.ceilTiledSize(height),
    };
    if (toGridDimensions.x > this.bg_tile.width || toGridDimensions.y > this.bg_tile.height) {
      const atlasTexture = this.textures.get('jpg_atlas');
      const bgImgTexture = atlasTexture.get(this.scenario.bg);
      // const brickImgTextures = this.scenario.tiles.map(value => atlasTexture.get(value));

      // const toGridDimensions = {
      //   x: this.ceilTiledSize(width),
      //   y: this.ceilTiledSize(height),
      // };
      // console.log(toGridDimensions)

      canvasTexture.clear();
      canvasTexture.setSize(toGridDimensions.x, toGridDimensions.y);

      const canvasMidPoint = {
        x: toGridDimensions.x / 2,
        y: toGridDimensions.y / 2,
      };

      const bgImgPosition = {
        x: canvasMidPoint.x - (bgImgTexture.width / 2),
        y: canvasMidPoint.y - (bgImgTexture.height / 2),
      };

      canvasTexture.drawFrame('jpg_atlas', this.scenario.bg, bgImgPosition.x, bgImgPosition.y);
      const drawn = {
        width: 768,
        height: 1024,
      };

      const xPos = {
        left: canvasMidPoint.x - bgImgTexture.halfWidth - TILE_SIZE,
        right: canvasMidPoint.x + bgImgTexture.halfWidth,
      };
      while (drawn.width < width) {
        const vTileAmount = toGridDimensions.y / TILE_SIZE;
        for (let i = 0; i < vTileAmount; i++) {
          canvasTexture.drawFrame('jpg_atlas', rndArrayItem(this.scenario.tiles), xPos.left, i * TILE_SIZE);
          canvasTexture.drawFrame('jpg_atlas', rndArrayItem(this.scenario.tiles), xPos.right, i * TILE_SIZE);
        }
        xPos.left -= TILE_SIZE;
        xPos.right += TILE_SIZE;
        drawn.width += TILE_SIZE * 2;
      }

      const yPos = {
        top: canvasMidPoint.y - bgImgTexture.halfHeight - TILE_SIZE,
        bottom: canvasMidPoint.y + bgImgTexture.halfHeight,
      };
      while (drawn.height < height) {
        const hTileAmount = toGridDimensions.x / TILE_SIZE;
        for (let i = 0; i < hTileAmount; i++) {
          canvasTexture.drawFrame('jpg_atlas', rndArrayItem(this.scenario.tiles), i * TILE_SIZE, yPos.top);
          canvasTexture.drawFrame('jpg_atlas', rndArrayItem(this.scenario.tiles), i * TILE_SIZE, yPos.bottom);
        }
        yPos.top -= TILE_SIZE;
        yPos.bottom += TILE_SIZE;
        drawn.height += TILE_SIZE * 2;
      }
      canvasTexture.refresh();
      this.bg_tile.setTexture('bg_tile');
    }
  }
}
