import KeyControls from './KeyControls.js';
import Character from './Character.js';

const canvas = document.querySelector('#board canvas');
const ctx = canvas.getContext('2d');
const {width: w, height: h} = canvas;
ctx.translate(w/2,h/2);

//game setup
let dt = 0;
let last = 0;
let x = -50;
let y = -50;
const move = new KeyControls();
//const img = new Image();       
//img.src = './images/character/Character_base.png'; 
//img.addEventListener('load', draw,false);
let angle = 0;
const character = new Character('./images/character/Character_base.png');
character.texture.addEventListener('load', draw,false);
const px = character.pivot ? character.pivot.x : 0;
const py = character.pivot ? character.pivot.y : 0;



function loopy(ms){
   requestAnimationFrame(loopy);

   const t = ms / 1000;
   dt = t-last;
   last=t;
   //game logic code

   angle=move.getRotate(ctx,px,py,angle);
   y+=move.getY();
   character.pivot.y +=move.getY();
   console.log(character.pivot.y);
   if(!move.action){}
   deleteImg();
   draw();
   //ctx.restore();
   

}
requestAnimationFrame(loopy);

function draw() {
   //circle
         
   ctx.drawImage(character.texture, x, y, 100,100); 
}
function deleteImg(){
   ctx.clearRect(-400,-300, w*2, h*2);
}