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
 
   if(this.pos.x < 24){
     this.pos.x = 24;
   }
   if(this.pos.x >w){this.pos.x = w;}
}
const minows = new Container();
function spawnMino(x, y, speed){
   const mino = new Sprite(textures.mino);
   mino.pos.x = x;
   mino.pos.y = y;
   mino.size.sx = 120;
   mino.size.sy = 100;
   mino.update = function (dt){
      this.pos.x += speed*dt;
   };
   minows.add(mino);
}
const sword = new Sprite(textures.sword);
function drawSword(){
sword.pos.x = character.pos.x -80;
sword.pos.y = character.pos.y -110;
sword.size.sx = 200;
sword.size.sy = 200;
sword.update = function(dt, t){
   this.pos.x += controls.x * dt * 200;
   this.pos.y += controls.y * dt * 200;
 
   if(this.pos.x < 24){
     this.pos.x = 24;
   }
   if(this.pos.x >w){this.pos.x = w;}
}
}

scene.add(sword);
scene.add(character);
scene.add(minows);

let dt = 0;
let last = 0;

let gameOver = false;
let minowsNum = 0;

function loopy(ms){
   requestAnimationFrame(loopy);
   const t = ms / 1000;
   dt = t-last;
   last=t;
   //game logic code
   //ctx.save();
   if(controls.action){
      drawSword();
      sword.visible = true;
   }
   else{sword.visible = false;}
   if(minowsNum == 0){
      spawnMino(50,50,0);
      minowsNum++;
   }

   minows.children.forEach((mino) => {

      const dx = mino.pos.x + mino.size.sx/2 - (sword.pos.x + sword.size.sx/2);
      const dy = mino.pos.y + mino.size.sy/2 - (sword.pos.y + sword.size.sy/2);
      if (Math.sqrt(dx * dx +dy * dy) < (mino.size.sx/2 + sword.size.sx/2)){
         mino.dead = true;
      }
   });

   scene.update(dt,t);
   renderer.render(scene);
}
requestAnimationFrame(loopy);

