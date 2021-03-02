import KeyControls from './KeyControls.js';

let character = new KeyControls();

export default class Character{
    constructor(texture){
        this.texture = new Image();
        this.texture.src = texture;
        this.pos = {x:0,y:0};
        this.anchor = {x:0, y:0};
        this.scale = {x:1, y:1};
        this.pivot = {x:0, y:0};
    }
    moveChar(){
        let x=character.getX();
        let y=character.getY();
        this.pos.x = x;
        this.pos.y = y;
    }
    rotateChar(){
        
    }
}