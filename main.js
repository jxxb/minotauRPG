import src from './src/index.js';

const {CanvasRenderer, Text, KeyControls, Texture, Sprite, Container} = src;

//game setup
const w = 800;
const h = 600;
const renderer = new CanvasRenderer(w,h);
document.querySelector('#board').appendChild(renderer.view);
const controls = new KeyControls();
const scene = new Container();
const textures ={
   character: new Texture('images/character/Character_base.png'),
   mino: new Texture('images/enemy/Enemy.png'),
   sword: new Texture('images/weapons/sword_base-01.png')
};

const character = new Sprite(textures.character);
character.pos.x = 120;
character.pos.y = h/2-16;
character.size.sx = 100;
character.size.sy = 100;
character.update = function(dt,t){
   this.pos.x += controls.x * dt * 200;
   this.pos.y += controls.y * dt * 200;
 
   if (controls.x == 1) {
      textures.character.img.src = 'images/character/Character_right.png';
   } else if (controls.x == -1) {
      textures.character.img.src = 'images/character/Character_left.png';
   } else if (controls.y == -1) {
      textures.character.img.src = 'images/character/Character_base.png';
   } else if (controls.y == 1){
      textures.character.img.src = 'images/character/Character_down.png';
   }
   
   if(this.pos.x < 0){this.pos.x = 0;}
   if(this.pos.x > w - this.size.sx){this.pos.x = w - this.size.sx;}
   if(this.pos.y < 0){this.pos.y = 0;}
   if(this.pos.y > h - this.size.sy){this.pos.y = h - this.size.sy;}
}
const minows = new Container();
function spawnMino(x, y, speed){
   const mino = new Sprite(textures.mino);
   mino.pos.x = x;
   mino.pos.y = y;
   mino.size.sx = 120;
   mino.size.sy = 100;
   mino.update = function (dt){
   let dx = 0;
   let dy = 0;

      let differenceX = Math.abs(character.pos.x - mino.pos.x);
      let differenceY = Math.abs(character.pos.y - mino.pos.y);

      if (differenceX > differenceY) {
         mino.size.sx = 100;
         mino.size.sy = 120;
         if (character.pos.x < mino.pos.x) {
            dx = -100;
            textures.mino.img.src = 'images/enemy/Enemy-left.png'
         } else if (character.pos.x > mino.pos.x) {
            dx = 100;
            textures.mino.img.src = 'images/enemy/Enemy-right.png'
         }
         dy = 0;
      } else if (differenceX < differenceY) {
         mino.size.sx = 120;
         mino.size.sy = 100;
         if (character.pos.y < mino.pos.y) {
            dy = -100;
            textures.mino.img.src = 'images/enemy/Enemy.png'
         } else if (character.pos.y > mino.pos.y) {
            dy = 100;
            textures.mino.img.src = 'images/enemy/Enemy-down.png'
         }
         dx = 0;
      }    
      
      mino.pos.x += dt * dx;
      mino.pos.y += dt * dy;
   };
   minows.add(mino);
}

const sword = new Sprite(textures.sword);
sword.pos.x = character.pos.x -80;
sword.pos.y = character.pos.y -110;

function drawSword(){
   sword.size.sx = 200;
   sword.size.sy = 200;
   sword.update = function(dt, t){
      this.pos.x += controls.x * dt * 200;
      this.pos.y += controls.y * dt * 200;

      if (controls.x == 1) {
         textures.sword.img.src = 'images/weapons/sword_right.png'
         this.pos.x = character.pos.x;
         this.pos.y = character.pos.y - 80;
      } else if (controls.x == -1) {
         textures.sword.img.src = 'images/weapons/sword_left.png'
         this.pos.x = character.pos.x - 110;
         this.pos.y = character.pos.y - 20;
      } else if (controls.y == 1) {
         textures.sword.img.src = 'images/weapons/sword_down.png'
         sword.pos.x = character.pos.x - 10;
         sword.pos.y = character.pos.y;
      } else if (controls.y == -1) {
         textures.sword.img.src = 'images/weapons/sword_base-01.png'
         sword.pos.x = character.pos.x - 80;
         sword.pos.y = character.pos.y - 110;
      }
 
      if(this.pos.x + this.sx/2 < 0){this.pos.x = this.sx/2;}
      if(this.pos.x + this.sx/2 > w){this.pos.x = w - this.sx/2;}
   }
}

scene.add(sword);
scene.add(character);
scene.add(minows);

let dt = 0;
let last = 0;

let gameOver = false;

function getRandomIntInclusive(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
 }

function loopy(ms){
   requestAnimationFrame(loopy);
   const t = ms / 1000;
   dt = t-last;
   last=t;
   //game logic code
   //ctx.save();
   console.log(minows);
   if(controls.action){
      drawSword();
      sword.visible = true;
   }
   else{sword.visible = false;}
  
   if(minows.children.length < 1){
      spawnMino(getRandomIntInclusive(50, 700),getRandomIntInclusive(50, 700),0);
   }

   minows.children.forEach((mino) => {

      const dx = mino.pos.x + mino.size.sx/2 - (sword.pos.x + sword.size.sx/2);
      const dy = mino.pos.y + mino.size.sy/2 - (sword.pos.y + sword.size.sy/2);
      if (sword.visible && Math.sqrt(dx * dx +dy * dy) < (mino.size.sx/2 + sword.size.sx/2)){
         mino.dead = true;
      }
   });

   scene.update(dt,t);
   renderer.render(scene);
}
requestAnimationFrame(loopy);

