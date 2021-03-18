import src from './src/index.js';
import Rectangle from './src/Rectangle.js';

const {
   CanvasRenderer,
   Text,
   KeyControls,
   Texture,
   Sprite,
   Container,
   ExternalServices
} = src;

//game setup
const w = 800;
const h = 600;
const columns = 10;
const rows = 10;
const cellW = w / columns;
const cellH = h / rows;
const renderer = new CanvasRenderer(w, h);
document.querySelector('#board').appendChild(renderer.view);
const controls = new KeyControls();
const scene = new Container();
const textures = {
   character: new Texture('images/character/Character_base.png'),
   mino: new Texture('images/enemy/Enemy.png'),
   sword: new Texture('images/weapons/sword_base-01.png'),
   vWall: new Texture('images/wall/wall_vertical.png'),
   hWall: new Texture('images/wall/wall_horizontal.png'),
};
const maze = new ExternalServices();

const character = new Sprite(textures.character);
character.pos.x = 120;
character.pos.y = 400;
character.size.sx = 45;
character.size.sy = 45;
character.health = 200;
character.center.x = character.pos.x + character.size.sx/2;
character.center.y = character.pos.y + character.size.sy/2;

character.update = function (dt, t) {
   this.pos.x += controls.x * dt * 200;
   this.pos.y += controls.y * dt * 200;
   this.center.x = this.pos.x + this.size.sx/2;
   this.center.y = this.pos.y + this.size.sy/2;
   if (controls.x == 1) {
      textures.character.img.src = 'images/character/Character_right.png';
   } else if (controls.x == -1) {
      textures.character.img.src = 'images/character/Character_left.png';
   } else if (controls.y == -1) {
      textures.character.img.src = 'images/character/Character_base.png';
   } else if (controls.y == 1) {
      textures.character.img.src = 'images/character/Character_down.png';
   }

   if (this.pos.x < 0) {
      this.pos.x = 0;
   }
   if (this.pos.x > w - this.size.sx) {
      this.pos.x = w - this.size.sx;
   }
   if (this.pos.y < 0) {
      this.pos.y = 0;
   }
   if (this.pos.y > h - this.size.sy) {
      this.pos.y = h - this.size.sy;
   }
}

const healthBar = new Rectangle();
healthBar.health = character.health;
healthBar.x = character.pos.x;
healthBar.y = character.pos.y;

healthBar.update = function (dt) {
   healthBar.x = character.pos.x - healthBar.health/8 + (character.size.sx/2);
   healthBar.y = character.pos.y - 20;
}

const vWalls = new Container();

function spawnVWalls(x, y) {
   const vWall = new Sprite(textures.vWall);
   textures.vWall.img.src = 'images/wall/wall_vertical.png';
   vWall.size.sx = 15;
   vWall.size.sy = 60;
   vWall.pos.x = x + cellW;
   vWall.pos.y = y;
   vWall.center.x = vWall.pos.x + vWall.size.sx/2;
   vWall.center.y = vWall.pos.y + vWall.size.sy/2;
   vWalls.add(vWall);
}

const hWalls = new Container();

function spawnHWalls(x, y) {
   const hWall = new Sprite(textures.hWall);
   textures.hWall.img.src = 'images/wall/wall_horizontal.png';
   hWall.size.sx = 95;
   hWall.size.sy = 15;
   hWall.pos.x = x;
   hWall.pos.y = y + cellH;
   hWall.center.x = hWall.pos.x + hWall.size.sx/2;
   hWall.center.y = hWall.pos.y + hWall.size.sy/2;
   hWalls.add(hWall);
}

function walls() {
   maze.getMaze().then(mazeWalls => {
      for (let i = 0; i < mazeWalls.length; i++) {
            for (let j = 0; j < mazeWalls[i].length; j++) {
               //type 1 = br
               if (mazeWalls[j][i] === 1) {
                  spawnVWalls(cellW * i, cellH * j);
                  spawnHWalls(cellW * i, cellH * j);
               }

               //type 2 = right
               if (mazeWalls[j][i] === 2) {
                  spawnVWalls(cellW * i, cellH * j);
               }

               //type 3 = bottom

               if (mazeWalls[j][i] === 3) {
                  spawnHWalls(cellW * i, cellH * j);
               }
               //type 4 = empty
               else {
                  
               }
            }
         }
         scene.add(hWalls);
         scene.add(vWalls);
         scene.add(sword);
         scene.add(character);
         scene.add(minows);
         scene.add(healthBar);
      })
      .catch(err => console.log(err));
}

const minows = new Container();

function spawnMino(x, y, speed) {
   const mino = new Sprite(textures.mino);
   mino.pos.x = x;
   mino.pos.y = y;
   mino.size.sx = 30;
   mino.size.sy = 30;
   mino.center.x = mino.pos.x + mino.size.sx/2;
   mino.center.y = mino.pos.y + mino.size.sy/2;
   mino.health = 100;
   mino.update = function (dt) {
      let dx = 0;
      let dy = 0;
      mino.center.x = mino.pos.x + mino.size.sx/2;
      mino.center.y = mino.pos.y + mino.size.sy/2;
      //mino attraction to character
      let differenceX = Math.abs(character.pos.x - mino.pos.x);
      let differenceY = Math.abs(character.pos.y - mino.pos.y);

      if (differenceX > differenceY) {
         // mino.size.sx = 45;
         // mino.size.sy = 54;
         if (character.pos.x < mino.pos.x) {
            dx = -100;
            textures.mino.img.src = 'images/enemy/Enemy-left.png'
         } else if (character.pos.x > mino.pos.x) {
            dx = 100;
            textures.mino.img.src = 'images/enemy/Enemy-right.png'
         }
         dy = 0;
      } else if (differenceX < differenceY) {
         // mino.size.sx = 54;
         // mino.size.sy = 45;
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
sword.pos.x = character.pos.x - 80;
sword.pos.y = character.pos.y - 110;

function drawSword() {
   sword.size.sx = 100;
   sword.size.sy = 100;
   sword.update = function (dt, t) {
      this.pos.x += controls.x * dt * 200;
      this.pos.y += controls.y * dt * 200;

      if (controls.x == 1) {
         textures.sword.img.src = 'images/weapons/sword_right.png'
         this.pos.x = character.pos.x;
         this.pos.y = character.pos.y - 40;
      } else if (controls.x == -1) {
         textures.sword.img.src = 'images/weapons/sword_left.png'
         this.pos.x = character.pos.x - 60;
         this.pos.y = character.pos.y - 10;
      } else if (controls.y == 1) {
         textures.sword.img.src = 'images/weapons/sword_down.png'
         sword.pos.x = character.pos.x - 10;
         sword.pos.y = character.pos.y;
      } else if (controls.y == -1) {
         textures.sword.img.src = 'images/weapons/sword_base-01.png'
         sword.pos.x = character.pos.x - 40;
         sword.pos.y = character.pos.y - 60;
      }

      if (this.pos.x + this.sx / 2 < 0) {
         this.pos.x = this.sx / 2;
      }
      if (this.pos.x + this.sx / 2 > w) {
         this.pos.x = w - this.sx / 2;
      }
   }
}



let dt = 0;
let last = 0;

let gameOver = false;

function getRandomIntInclusive(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

walls();

function loopy(ms) {
   requestAnimationFrame(loopy);
   const t = ms / 1000;
   dt = t - last;
   last = t;
   //game logic code
   //ctx.save();
   if (controls.action) {
      drawSword();
      sword.visible = true;
   } else {
      sword.visible = false;
   }

   //spawn minos
   if (minows.children.length < 50) {
      spawnMino(getRandomIntInclusive(100, 600), getRandomIntInclusive(100, 500), 0);
   }

   //horizontal character wall colision detection
   hWalls.children.forEach((hWall) => {

      const colisionYDistance = hWall.size.sy / 2 + character.size.sy / 2;
      const colisionXDistance = hWall.size.sx / 2 + character.size.sx / 2;
      let colisionX = (hWall.pos.x + (hWall.size.sx / 2)) - (character.pos.x + (character.size.sx / 2)); // y colision area
      let colisionY = (hWall.pos.y + (hWall.size.sy / 2)) - (character.pos.y + (character.size.sy / 2));

      colisionX *= 1.2;
      colisionY *= 1.2;

      if (Math.abs(colisionX) <= Math.abs(colisionXDistance) && Math.abs(colisionY) <= Math.abs(colisionYDistance * .9)) {
         if (hWall.pos.y < character.pos.y) {
            character.pos.y += hWall.size.sy / 4;
         } else if (hWall.pos.y > character.pos.y) {
            character.pos.y -= hWall.size.sy / 4;
         }
      }
   });

   //vertical character wall colision detection
   vWalls.children.forEach((vWall) => {

      const colisionYDistance = vWall.size.sy / 2 + character.size.sy / 2;
      const colisionXDistance = vWall.size.sx / 2 + character.size.sx / 2;
      let colisionX = (vWall.pos.x + (vWall.size.sx / 2)) - (character.pos.x + (character.size.sx / 2)); // y colision area
      let colisionY = (vWall.pos.y + (vWall.size.sy / 2)) - (character.pos.y + (character.size.sy / 2));
      colisionX *= 1.2;
      colisionY *= 1.2;

      if (Math.abs(colisionY) <= Math.abs(colisionYDistance) && Math.abs(colisionX) <= Math.abs(colisionXDistance * .9)) {
         if (vWall.pos.x < character.pos.x) {
            character.pos.x += vWall.size.sx / 4;
         } else if (vWall.pos.x > character.pos.x) {
            character.pos.x -= vWall.size.sx / 4;
         }
      }
   });

   //enemy sword collision detection
   minows.children.forEach((mino) => {
      let dx = mino.pos.x + mino.size.sx / 2 - (character.pos.x + character.size.sx / 2);
      let dy = mino.pos.y + mino.size.sy / 2 - (character.pos.y + character.size.sy / 2);
      if (Math.sqrt(dx * dx + dy * dy) < (mino.size.sx / 2 + character.size.sx / 2)) {
         character.health -=1;
         healthBar.health -=1;
         //console.log(character.health);
         if(character.health <= 0) {
            //character.dead = true;
         }
      }

      dx = mino.pos.x + mino.size.sx / 2 - (sword.pos.x + sword.size.sx / 2);
      dy = mino.pos.y + mino.size.sy / 2 - (sword.pos.y + sword.size.sy / 2);
      if (sword.visible && Math.sqrt(dx * dx + dy * dy) < (mino.size.sx / 2 + sword.size.sx / 2)) {
         mino.dead = true;
      }

      //mino - horizontal wall colision detection
      hWalls.children.forEach((hWall) => {
         //horizontal wall mino colision detection
         const colisionYDistance = Math.abs(hWall.size.sy / 2 + mino.size.sy / 2);
         const colisionXDistance = Math.abs(hWall.size.sx / 2 + mino.size.sx / 2);
         let colisionX = (hWall.center.x + (hWall.size.sx / 2)) - (mino.center.x + (hWall.size.sx / 2)); // y colision area
         let colisionY = (hWall.center.y + (hWall.size.sy / 2)) - (mino.center.y + (hWall.size.sy / 2));
         colisionX *= 1.2;
         colisionY *= 1.2;
         if (hWall.pos.y > mino.pos.y) {
            if (Math.abs(colisionX) <= colisionXDistance && Math.abs(colisionY) <= colisionYDistance) {
               mino.pos.y -= hWall.size.sy / 8;
            }
         }

         if (hWall.pos.y < mino.pos.y) {
            if (Math.abs(colisionX) <= colisionXDistance && Math.abs(colisionY) <= colisionYDistance) {
               mino.pos.y += hWall.size.sy / 8;
            }
         }
      });

      //mino vertical wall colision detection
      vWalls.children.forEach((vWall) => {
         //vertical wall mino colision detection
         const colisionYDistance = vWall.size.sy / 2 + mino.size.sy / 2;
         const colisionXDistance = vWall.size.sx / 2 + mino.size.sx / 2;
         let colisionX = (vWall.center.x + (vWall.size.sx / 2)) - (mino.center.x + (vWall.size.sx / 2)); // y colision area
         let colisionY = (vWall.center.y + (vWall.size.sy / 2)) - (mino.center.y + (vWall.size.sy / 2));
         colisionX *= 1.2;
         colisionY *= 1.2;
         if (vWall.center.x < mino.center.x) {
            if (Math.abs(colisionY) <= Math.abs(colisionYDistance) && Math.abs(colisionX) <= Math.abs(colisionXDistance)) {
               mino.pos.x += vWall.size.sx / 8;
            }
         }

         if (vWall.center.x > mino.center.x) {
            if (Math.abs(colisionY) <= Math.abs(colisionYDistance) && Math.abs(colisionX) <= Math.abs(colisionXDistance)) {
               mino.pos.x -= vWall.size.sx / 8;
            }
         }
      });

      //mino - mino colision detection
      minows.children.forEach((mino2) => {

         if (mino != mino2) {
            //horizontal wall mino colision detection
            const dx = mino.pos.x + mino.size.sx / 2 - (mino2.pos.x + mino2.size.sx / 2);
            const dy = mino.pos.y + mino.size.sy / 2 - (mino2.pos.y + mino2.size.sy / 2);
            if (Math.sqrt(dx * dx + dy * dy) < (mino.size.sx / 2 + mino2.size.sx / 2)) {
               mino.pos.x += dx / 32;
               mino.pos.y += dy / 32;
            }
         }
      });
   });

   scene.update(dt, t);
   renderer.render(scene);
}

requestAnimationFrame(loopy);