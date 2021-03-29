import Text from "./Text.js";
import TileSprite from "./TileSprite.js";


export default class Item extends TileSprite{
   constructor(texture, w, h) {
      super(texture, w, h);
      this.quantity = new Text(1,{font: "12pt sans-serif",
      fill: "Black",
      align: "center"})
   }
}