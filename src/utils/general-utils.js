// import getImageOutline from 'image-outline';
// import { decomp } from "poly-decomp";

import { FONT_FAMILY, FONT_COLOR, FONT_STROKE_COLOR } from "../services/game-settings";

const rnd = Phaser.Math.Between;

export const validateEmail = email => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export const rmArrayItem = (item, array) => array.splice(array.indexOf(item), 1);

export const rndArrayItem = array => array[rnd(0, array.length - 1)];


export const createText = (scene, config) => {
  const txt = scene.make.text({
    x: config.x || 0,
    y: config.y || 0,
    text: config.text || 'Test',
    style: {
      fontSize: config.size || '64px',
      fontFamily: config.fontFamily ? `"${config.fontFamily}"` : FONT_FAMILY,
      color: config.color || FONT_COLOR,
      align: 'center',
      // stroke: config.strokeColor || FONT_STROKE_COLOR,
      // strokeThickness: config.strokeThickness || 4,
    },
    add: true
  })
    .setOrigin(0.5);

  return txt;
}

export const setTextGradient = (text, gradientData) => {
  var gradient = text.context.createLinearGradient(0, 0, 0, text.displayHeight);
  gradientData.forEach(element => { gradient.addColorStop(element.percent, element.color); });
  text.setFill(gradient);
}

// export const traceImage = (scene, imageKey, jsonKey, simplifyThreshold = 33) => {
//   const image = scene.textures.get(imageKey).source[0].image;

//   let imageVerticesData = [];
//   let imagePolygonData = [];

//   imageVerticesData = getImageOutline(image, {
//     opacityThreshold: 63,
//     simplifyThreshold, // from 1 to 500
//   });

//   if (imageVerticesData.length) {
//     imagePolygonData = decomp(imageVerticesData);

//     let edges = { left: image.width, top: image.height };

//     // imagePolygonData[0].forEach((vertex) => {
//     //   if (vertex.x < edges.left)
//     //     edges.left = vertex.x;

//     //   if (vertex.y < edges.top)
//     //     edges.top = vertex.y;
//     // });

//     imagePolygonData = imagePolygonData[0].map(vertex => {
//       if (vertex.x < edges.left)
//         edges.left = vertex.x;

//       if (vertex.y < edges.top)
//         edges.top = vertex.y;

//       const array = [vertex.x, vertex.y];
//       return array;
//     });

//     const offsetX = edges.left / image.width;
//     const offsetY = edges.top / image.height;

//     const shapeData = {
//       type: 'fromPhysicsTracer',
//       label: imageKey,
//       vertices: imagePolygonData,
//       offset: [offsetX, offsetY],
//       image: { width: image.width, height: image.height },
//       // offset: { x: offsetX, y: offsetY },
//     };

//     if (jsonKey) scene.cache.json.add(jsonKey, shapeData);

//     return shapeData;
//   } else {
//     console.warn('Trace Image: Unable to outline');
//   }
// }

export const createVerticalGradient = function (scene, key, width, height, color1, color2, stop) {
  const texture = scene.textures.createCanvas(key, width, height);
  const context = texture.getContext();
  const grd = context.createLinearGradient(0, 0, 0, stop);

  grd.addColorStop(0, color1);
  grd.addColorStop(1, color2);

  context.fillStyle = grd;
  context.fillRect(0, 0, width, height);

  texture.refresh();
}
