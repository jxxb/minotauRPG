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
const sword = new Character('./images/weapons/sword_base-01.png');
const enemy = new Character('./images/enemy/Enemy.png');
character.texture.addEventListener('load', draw,false);
const px = character.pivot ? character.pivot.x : 0;
let py = character.pivot ? character.pivot.y : 0;



function loopy(ms){
   requestAnimationFrame(loopy);

   const t = ms / 1000;
   dt = t-last;
   last=t;
   //game logic code
   //ctx.save();
   ctx.save();
   angle=move.getRotate(ctx,px,py,angle);
   y+=move.getY();
   character.pivot.y +=move.getY();
   py = character.pivot.y;
   deleteImg();
   if(move.action){
      draw(sword.texture, x-50,y-85,150,150);
      console.log('Have at thee?');
   }
   draw(character.texture, x, y, 100,100);
   //ctx.restore();
   draw(enemy.texture,100,100,115,100);
   

}
requestAnimationFrame(loopy);

function draw(texture, x, y, sx, sy) {
   //circle
   ctx.drawImage(texture, x, y, sx, sy); 
}
function deleteImg(){
   ctx.clearRect(x-150,y-150, w*2, h*2);
}