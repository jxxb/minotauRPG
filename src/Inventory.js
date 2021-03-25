import Container from "./Container.js";
import Item from "./Item.js";

export default class Inventory extends Container{
    constructor(){
     super();
    }
    add(child){
        let isThere = this.children.find((item)=>{
            item.texture == child.texture;
        })
        if(!isThere){
        child = new Item(child.texture, child.tileW, child.tileH);
        this.children.push(child);
        }
        else{
            isThere.quantity++;
        }
    }


}