class Sprite {
  constructor(texture,damage) {
    this.texture = texture;
    this.pos = { x: 0, y: 0 };
    this.size = { sx:0, sy:0};
    this.center = {x:0, y:0 };
    this.damage = damage;
  }
}
export default Sprite;
