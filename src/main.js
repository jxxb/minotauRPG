import KeyControls from './KeyControls.js';

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
const img = new Image();       
img.src = './images/character/Character_base.png'; 
img.addEventListener('load', draw,false);



function loopy(ms){
   requestAnimationFrame(loopy);

   const t = ms / 1000;
   dt = t-last;
   last=t;
   //game logic code

   x+=move.getX();
   console.log(move.getX());
   y+=move.getY();
   if(!move.action){}
   deleteImg();
   draw();

}
requestAnimationFrame(loopy);

function draw() {
  //rainbow
  /* for (let i = 0; i < 6; i++) {
      
      ctx.fillStyle = `hsl(${i * (250/6)}, 90%, 55%)`;
      ctx.fillRect(0, i*20,200,20);  
   }*/
   //circle
         
   ctx.drawImage(img, x, y, 100,100); 
   console.log(x +', '+y);
}
function deleteImg(){
   ctx.clearRect(-400,-300, w, h);
}