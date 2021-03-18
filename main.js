import src from './src/index.js';

const {
   CanvasRenderer,
   Text,
   KeyControls,
   Texture,
   Sprite,
   Container,
   ExternalServices,
   TileSprite
} = src;

//game setup
const w = 800;
const h = 600;
const columns = 10;
const rows = 10;
const cellW = w / columns;
const cellH = h / rows;
let itemMultiple = 0;
const renderer = new CanvasRenderer(w, h);
document.querySelector('#board').appendChild(renderer.view);
const controls = new KeyControls();
const scene = new Container();
const textures = {
   inventory: new Texture('images/inventory/inventory.png'),
   character: new Texture('images/character/Character_base.png'),
   mino: new Texture('images/enemy/Enemy.png'),
   //sword: new Texture('images/weapons/sword_up.png'),
   axe: new Texture('images/weapons/axe_base.png'),
   spear: new Texture('images/weapons/spear_base.png'),
   mace: new Texture('images/weapons/mace_base.png'),
   vWall: new Texture('images/wall/wall_vertical.png'),
   hWall: new Texture('images/wall/wall_horizontal.png'),
   weaponTiles: new Texture('images/weapons/weapons_sprite.png')
};
const maze = new ExternalServices();
const weaponTile = new TileSprite(textures.weaponTiles,0,0);

// function drawInventory() {
//    renderer.ctx.strokeStyle = 'black';
//    renderer.ctx.fillStyle = 'rgba(225,180,150,0.75)';
//    renderer.ctx.strokeRect(0, h-50, w, 50);
//    renderer.ctx.fillRect(0, h-50, w, 50);
//    console.log('it drew me!');
// }

const inventory = new Container();
const inventoryBackground = new Sprite(textures.inventory);
inventoryBackground.pos.x = -5;
inventoryBackground.pos.y = h - 96;
inventoryBackground.size.sx = w + 15;
inventoryBackground.size.sy = 100;




const character = new Sprite(textures.character);
character.pos.x = 120;
character.pos.y = 400;
character.size.sx = 45;
character.size.sy = 45;
character.update = function (dt, t) {
   this.pos.x += controls.x * dt * 200;
   this.pos.y += controls.y * dt * 200;

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

const vWalls = new Container();

function spawnVWalls(x, y) {
   const vWall = new Sprite(textures.vWall);
   textures.vWall.img.src = 'images/wall/wall_vertical.png';
   vWall.size.sx = 15;
   vWall.size.sy = 60;
   vWall.pos.x = x + cellW;
   vWall.pos.y = y;
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
   hWalls.add(hWall);
}

const enemyWeapons = new Container();

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
         scene.add(enemyWeapons);
         scene.add(weaponTile);
         scene.add(character);
         scene.add(minows);
         scene.add(inventoryBackground);
         scene.add(inventory);
      })
      .catch(err => console.log(err));
}

const minows = new Container();

function spawnMino(x, y, speed) {
   const mino = new Sprite(textures.mino);
   mino.pos.x = x;
   mino.pos.y = y;
   mino.size.sx = 45;
   mino.size.sy = 45;
   mino.update = function (dt) {
      let dx = 0;
      let dy = 0;

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

const weapon = new Sprite(textures.weaponTile);


weapon.pos.x = character.pos.x - 80;
weapon.pos.y = character.pos.y - 110;

function getWeapon() {
   weapon.size.sx = 100;
   weapon.size.sy = 100;
   weapon.update = function (dt, t) {
      this.pos.x += controls.x * dt * 200;
      this.pos.y += controls.y * dt * 200;

     weaponTile
      
      if (controls.x == 1) {
         textures.weapon.img.src = 'images/weapons/sword_right.png'
         this.pos.x = character.pos.x;
         this.pos.y = character.pos.y - 40;
      } else if (controls.x == -1) {
         textures.weapon.img.src = 'images/weapons/sword_left.png'
         this.pos.x = character.pos.x - 60;
         this.pos.y = character.pos.y - 10;
      } else if (controls.y == 1) {
         textures.weapon.img.src = 'images/weapons/sword_down.png'
         weapon.pos.x = character.pos.x - 10;
         weapon.pos.y = character.pos.y;
      } else if (controls.y == -1) {
         textures.weapon.img.src = 'images/weapons/sword_up.png'
         weapon.pos.x = character.pos.x - 40;
         weapon.pos.y = character.pos.y - 60;
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
   //drawInventory();
   if (controls.action) {
      getWeapon();
      
      weapon.visible = true;
   } else {
      weapon.visible = false;
   }

   //spawn minos
   if (minows.children.length < 3) {
      spawnMino(getRandomIntInclusive(100, 600), getRandomIntInclusive(100, 500), 0);
   }

   //horizontal character wall colision detection
   hWalls.children.forEach((hWall) => {

      const colisionYDistance = hWall.size.sy / 2 + character.size.sy / 2;
      const colisionXDistance = hWall.size.sx / 2 + character.size.sx / 2;
      const colisionX = (hWall.pos.x + (hWall.size.sx / 2)) - (character.pos.x + (character.size.sx / 2)); // y colision area
      const colisionY = (hWall.pos.y + (hWall.size.sy / 2)) - (character.pos.y + (character.size.sy / 2));

      if (Math.abs(colisionX) <= Math.abs(colisionXDistance) && Math.abs(colisionY) <= Math.abs(colisionYDistance * .9)) {
         if (hWall.pos.y < character.pos.y) {
            character.pos.y += hWall.size.sy / 6;
         } else if (hWall.pos.y > character.pos.y) {
            character.pos.y -= hWall.size.sy / 6;
         }
      }
   });

   //vertical character wall colision detection
   vWalls.children.forEach((vWall) => {

      const colisionYDistance = vWall.size.sy / 2 + character.size.sy / 2;
      const colisionXDistance = vWall.size.sx / 2 + character.size.sx / 2;
      const colisionX = (vWall.pos.x + (vWall.size.sx / 2)) - (character.pos.x + (character.size.sx / 2)); // y colision area
      const colisionY = (vWall.pos.y + (vWall.size.sy / 2)) - (character.pos.y + (character.size.sy / 2));

      if (Math.abs(colisionY) <= Math.abs(colisionYDistance) && Math.abs(colisionX) <= Math.abs(colisionXDistance * .9)) {
         if (vWall.pos.x < character.pos.x) {
            character.pos.x += vWall.size.sx / 6;
         } else if (vWall.pos.x > character.pos.x) {
            character.pos.x -= vWall.size.sx / 6;
         }
      }
   });

   //enemy sword collision detection
   minows.children.forEach((mino) => {
      let dx = mino.pos.x + mino.size.sx / 2 - (character.pos.x + character.size.sx / 2);
      let dy = mino.pos.y + mino.size.sy / 2 - (character.pos.y + character.size.sy / 2);
      if (Math.sqrt(dx * dx + dy * dy) < (mino.size.sx / 2 + character.size.sx / 2)) {
         console.log("ew! he tuched me!");
         //character.dead = true;
      }

      dx = mino.pos.x + mino.size.sx / 2 - (weapon.pos.x + weapon.size.sx / 2);
      dy = mino.pos.y + mino.size.sy / 2 - (weapon.pos.y + weapon.size.sy / 2);
      if (weapon.visible && Math.sqrt(dx * dx + dy * dy) < (mino.size.sx / 2 + weapon.size.sx / 2)) {

         //drop axe
         let thing = null;
         switch(getRandomIntInclusive(1,4)) {
            case 1: thing = textures.axe;
            break;
            case 2: thing = textures.mace;
            break;
            case 3: thing = textures.spear;
            break;
            case 4: thing = textures.sword;
            break;
         }

         const item = new Sprite(thing);
         enemyWeapons.add(item);
         item.pos.x = mino.pos.x;
         item.pos.y = mino.pos.y;
         item.size.sx = 50;
         item.size.sy = 100;
         item.visible = true;
         mino.dead = true;
      }

      enemyWeapons.children.forEach((weapon) => {
         let dx = weapon.pos.x + weapon.size.sx / 3 - (character.pos.x + character.size.sx / 2);
         let dy = weapon.pos.y + weapon.size.sy / 3 - (character.pos.y + character.size.sy / 2);

         if (Math.sqrt(dx * dx + dy * dy) < (weapon.size.sx / 3 + character.size.sx / 2)) {
            if(!inventory.children.some((item) => {
               item.Texture === weapon.Texture
               console.log(item.Texture);
               console.log(weapon.Texture);
            })) {

               let inventoryLocation = 0;

               weapon.inventory
                inventory.add(weapon);
                
                inventory.children.forEach((item) => {
              
               
               if(item) {
               item.pos.x = inventoryLocation + 60; 
               item.pos.y = h - 80;
               }
               

               inventoryLocation+=60;
            }) 
            } else {
               itemMultiple++;
               console.log(itemMultiple);
            }
            
            enemyWeapons.remove(weapon);
            // weapon.visible = false;
         };
      })

      //mino - horizontal wall colision detection
      hWalls.children.forEach((hWall) => {
         //horizontal wall mino colision detection
         const colisionYDistance = Math.abs(hWall.size.sy / 2 + mino.size.sy / 2);
         const colisionXDistance = Math.abs(hWall.size.sx / 2 + mino.size.sx / 2);
         const colisionX = (hWall.pos.x + (hWall.size.sx / 2)) - (mino.pos.x + (hWall.size.sx / 2)); // y colision area
         const colisionY = (hWall.pos.y + (hWall.size.sy / 2)) - (mino.pos.y + (hWall.size.sy / 2));

         if (hWall.pos.y > mino.pos.y) {
            if (Math.abs(colisionX) <= colisionXDistance && Math.abs(colisionY) <= colisionYDistance * 1.65) {
               mino.pos.y -= hWall.size.sy / 8;
            }
         }

         if (hWall.pos.y < mino.pos.y) {
            if (Math.abs(colisionX) <= colisionXDistance && Math.abs(colisionY) <= colisionYDistance / 3) {
               mino.pos.y += hWall.size.sy / 8;
            }
         }
      });

      //mino vertical wall colision detection
      vWalls.children.forEach((vWall) => {
         //vertical wall mino colision detection
         const colisionYDistance = vWall.size.sy / 2 + mino.size.sy / 2;
         const colisionXDistance = vWall.size.sx / 2 + mino.size.sx / 2;
         const colisionX = (vWall.pos.x + (vWall.size.sx / 2)) - (mino.pos.x + (vWall.size.sx / 2)); // y colision area
         const colisionY = (vWall.pos.y + (vWall.size.sy / 2)) - (mino.pos.y + (vWall.size.sy / 2));

         if (vWall.pos.x < mino.pos.x) {
            if (Math.abs(colisionY) <= Math.abs(colisionYDistance) && Math.abs(colisionX) <= Math.abs(colisionXDistance / 3)) {
               mino.pos.x += vWall.size.sx / 8;
            }
         }

         if (vWall.pos.x > mino.pos.x) {
            if (Math.abs(colisionY) <= Math.abs(colisionYDistance) && Math.abs(colisionX) <= Math.abs(colisionXDistance * 1.65)) {
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
   //drawInventory();
}

requestAnimationFrame(loopy);