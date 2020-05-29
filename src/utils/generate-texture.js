export class GenerateTexture {
  static rectFilled(scene, key, width, height, fillColor, alpha = 1) {
    if (scene.textures.get(key).key === key)
      scene.textures.remove(key);

    const graphics = new Phaser.GameObjects.Graphics(scene)
      .fillStyle(fillColor, alpha)
      .fillRect(0, 0, width, height)
      .generateTexture(key, width, height)
      .destroy(true);
  }

  static rectRound(scene, key, width, height, fillColor, fillAlpha = 1, strokeColor, lineWidth = 2, strokeAlpha = 1) {
    if (scene.textures.get(key).key === key)
      scene.textures.remove(key);

    const radius = this.calculateRadius(width, height);
    const offset = lineWidth / 2;

    const graphics = new Phaser.GameObjects.Graphics(scene);
    graphics
      .fillStyle(fillColor, fillAlpha)
      .fillRoundedRect(offset, offset, width, height, radius);

    graphics
      .lineStyle(lineWidth, strokeColor, strokeAlpha)
      .strokeRoundedRect(offset, offset, width, height, radius);

    graphics
      .generateTexture(key, width + lineWidth, height + lineWidth)
      .destroy(true);
  }

  static rectRoundFilled(scene, key, width, height, fillColor, alpha = 1) {
    if (scene.textures.get(key).key === key)
      scene.textures.remove(key);

    const radius = this.calculateRadius(width, height);

    const graphics = new Phaser.GameObjects.Graphics(scene)
      .fillStyle(fillColor, alpha)
      .fillRoundedRect(0, 0, width, height, radius)
      .generateTexture(key, width, height)
      .destroy(true);
  }

  static rectRoundStroked(scene, key, width, height, color, lineWidth) {
    if (scene.textures.get(key).key === key)
      scene.textures.remove(key);

    const radius = this.calculateRadius(width, height);

    const graphics = new Phaser.GameObjects.Graphics(scene)
      .lineStyle(lineWidth, color)
      .strokeRoundedRect(lineWidth / 2, lineWidth / 2, width, height, radius)
      .generateTexture(key, Math.ceil(width + lineWidth), Math.ceil(height + lineWidth))
      .destroy(true);
  }

  static tick(scene, key, side, fillColor) {
    if (scene.textures.get(key).key === key)
      scene.textures.remove(key);

    const thickness = side / 5;
    const length = side;
    const radius = side / 15;
    const x = -thickness;

    const graphics = new Phaser.GameObjects.Graphics(scene)
      .fillStyle(fillColor)
      .fillRoundedRect(x, thickness + thickness * 0.75, thickness, length - thickness * 2, radius)
      .fillRoundedRect(x, side - thickness * 0.75, length, thickness, radius)
      .setAngle(-50)
      .generateTexture(key, side * Math.sqrt(2), side)
      .destroy(true);
  }

  static circle(scene, key, radius, lineWidth, fillColor, strokeColor) {
    const graphics = new Phaser.GameObjects.Graphics(scene)
      .lineStyle(lineWidth, strokeColor)
      .fillStyle(fillColor)
      .fillCircle(radius, radius, radius)
      .strokeCircle(radius, radius, radius - lineWidth / 2)
      .generateTexture(key, radius * 2, radius * 2)
      .destroy(true);
  }

  static circleFill(scene, key, radius, fillColor, alpha) {
    const graphics = new Phaser.GameObjects.Graphics(scene)
      .fillStyle(fillColor, alpha)
      .fillCircle(radius, radius, radius)
      .generateTexture(key, radius * 2, radius * 2)
      .destroy(true);
  }

  static calculateRadius(width, height) {
    const min = 2;
    const max = Math.min(width, height) / 2;
    const calculated = (width + height) / 50;
    return Phaser.Math.Clamp(calculated, min, max);
  }

  static polygon(scene, key, vertices, width, height, fillColor, alpha = 1) {
    if (scene.textures.get(key).key === key)
      scene.textures.remove(key);

    const poly = new Phaser.Geom.Polygon(vertices);

    const graphics = new Phaser.GameObjects.Graphics(scene)
      .fillStyle(fillColor, alpha)
      .fillPoints(poly.points, true)
      .generateTexture(key, width, height)
      .destroy(true);
  }
}
