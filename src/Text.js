class Text {
  constructor(text = "", style = {}, label) {
    this.pos = { x: 0, y: 0 };
    this.text = text;
    this.style = style;
    this.label = label;
  }
}
export default Text;
