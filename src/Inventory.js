import Container from "./Container.js";
import Item from "./Item.js";

export default class Inventory extends Container{
    constructor(){
     super();
    }
    add(child){
        let isThere = false;
        this.children.forEach((item)=>{
            if(item.frame.y === child.frame.y){
                isThere = true;
            }
        });
        if(!isThere){
        let item = new Item(child.texture, child.tileW, child.tileH);
        item.frame.y = child.frame.y;
        item.quantity.pos.x = 125;
        item.quantity.pos.y = 125;
        this.children.push(item);
        }
        else{
            this.children.forEach((item)=>{
                if(item.frame.y === child.frame.y){
                    item.quantity.text++;
                    console.log(item.quantity.text);
                }
            });
        }
    }


}