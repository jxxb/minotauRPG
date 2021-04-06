import src from './src/index.js';

//Objects

const {
  Container,
  CanvasRenderer,
  Text,
  Texture,
  Sprite,
  KeyControls,
  ExternalServices,
  Rectangle,
  Setup,
  TileSprite,
  User,
  Item,
  Inventory,
} = src;

const setup = new Setup();
let initial;
//game setup
const w = setup.w;
const h = setup.h;
const columns = setup.columns;
const rows = setup.rows;
const cellW = setup.cellW;
const cellH = setup.cellH;
let itemMultiple = 0;
let newRoom = false;

const renderer = new CanvasRenderer(w, h);
document.querySelector('#board').appendChild(renderer.view);
const controls = new KeyControls();
const scene = new Container();
const user = new User();
const textures = {
   background: new Texture('images/background/background.png'),
   inventory: new Texture('images/inventory/inventory.png'),
   character: new Texture('images/character/Character_base.png'),
   mino: new Texture('images/enemy/Enemy.png'),
   vWall: new Texture('images/wall/wall_vertical.png'),
   hWall: new Texture('images/wall/wall_horizontal.png'),
   weaponTiles: new Texture('images/weapons/weapons_sprite.png')
};
const maze = new ExternalServices();

const background = new Sprite(textures.background);
background.size.sx = w;
background.size.sy = h;

const enemyWeapons = new Container();
const weapon = new TileSprite(textures.weaponTiles, 137, 137);
weapon.damage = 1;

const inventory = new Inventory();
const inventoryBackground = new Sprite(textures.inventory);
inventoryBackground.pos.x = -5;
inventoryBackground.pos.y = h - 96;
inventoryBackground.size.sx = w + 15;
inventoryBackground.size.sy = 100;

let currentxp;
let level;
const character = new Sprite(textures.character);
character.size.sx = 45;
character.size.sy = 45;
character.health = 800;
character.startingHealth = 800;
character.center.x = character.pos.x + character.size.sx/2;
character.center.y = character.pos.y + character.size.sy/2;


async function initialize() {

   await walls();
   let initial = user.getMassStorage();
   console.log(initial);
   currentxp = initial.playerXp || 0;
   level = initial.playerLevel || 1;
   initial.inventory.forEach((item) => {
      inventory.add(item);
   })
   console.log(currentxp);
   console.log(level);
   character.pos.x = initial.playerPosition.x;
   character.pos.y = initial.playerPosition.y;
  
}

// const mazeArray = [];
// mazeArray.push(walls());

//const nextMaze;

const healthBar = new Rectangle();
healthBar.health = character.health;
healthBar.startingHealth = character.startingHealth;
healthBar.x = character.pos.x;
healthBar.y = character.pos.y;

healthBar.update = function (dt) {
   healthBar.x = character.pos.x - healthBar.health/8 + (character.size.sx/2);
   healthBar.y = character.pos.y - 20;
   this.health = character.health;
}
//vertical wall containers
const vWalls = new Container();
//horizontal wall containers
const hWalls = new Container();

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

//wall creation
async function walls() {

   const token = user.getUserToken() || "";
   await maze.getMaze(user.getActualMazeId(),token).then(mazeWalls => {
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
   })
   .catch(err => console.log(err));
}

//Character Behavior
character.update = function (dt, t) {
   this.pos.x += controls.x * dt * 200;
   this.pos.y += controls.y * dt * 200;
   if (this.health < this.startingHealth) {
      this.health += .1;
   }
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

   //character screen boundaries wrap
   if (
      this.pos.x < 0 || 
      this.pos.x > w - this.size.sx ||
      this.pos.y < 0 ||
      this.pos.y > h - this.size.sy
      ) {
         hWalls.children.forEach((hWall) => {
            hWalls.remove(hWall);
         })
         vWalls.children.forEach((vWall) => {
            vWalls.remove(vWall);
         })
      //if (next maze doesn't exist)
        walls();
      }

   if (this.pos.x < 0) {
      this.pos.x = w - this.size.sx;
      //save curent maze
      //clear curent hWalls and Vwalls
      //render new maze
   }
   if (this.pos.x > w - this.size.sx) {
      this.pos.x = 0;
   }
   if (this.pos.y < 0) {
      this.pos.y = h - this.size.sy;
   }
   if (this.pos.y > h - this.size.sy) {
      this.pos.y = 0;
   }
}


function init() {
   scene.add(background);
   scene.add(hWalls);
   scene.add(vWalls);
   scene.add(enemyWeapons);
   scene.add(weapon);
   scene.add(character);
   scene.add(minows);
   scene.add(healthBar);
   scene.add(inventoryBackground);
   scene.add(inventory);
   scene.add(xp);
   scene.add(currentLv);
}

const minows = new Container();

function spawnMino(x, y, speed) {
   const mino = new Sprite(textures.mino);
   mino.pos.x = x;
   mino.pos.y = y;
   mino.damage = 2;
   mino.size.sx = 30;
   mino.size.sy = 30;
   mino.center.x = mino.pos.x + mino.size.sx/2;
   mino.center.y = mino.pos.y + mino.size.sy/2;
   mino.health = 100;
   mino.startingHealth = 100;
   
   const minohealthBar = new Rectangle();
   minohealthBar.health = mino.health;
   minohealthBar.startingHealth = mino.startingHealth;
   minohealthBar.x = mino.pos.x;
   minohealthBar.y = mino.pos.y;
   scene.add(minohealthBar);

   minohealthBar.update = function (dt) {
      minohealthBar.x = mino.pos.x - mino.health/8 + (mino.size.sx/2);
      minohealthBar.y = mino.pos.y - 20;
      minohealthBar.health = mino.health;
      if (mino.health <= 0) {
         minohealthBar.dead = true;
      }
}
   mino.update = function (dt) {
      let dx = 0;
      let dy = 0;
      mino.center.x = mino.pos.x + mino.size.sx/2;
      mino.center.y = mino.pos.y + mino.size.sy/2;
      //mino attraction to character
      let differenceX = Math.abs(character.pos.x - mino.pos.x);
      let differenceY = Math.abs(character.pos.y - mino.pos.y);

      if (differenceX > differenceY) {
         if (character.pos.x < mino.pos.x) {
            dx = -100;
            textures.mino.img.src = 'images/enemy/Enemy-left.png'
         } else if (character.pos.x > mino.pos.x) {
            dx = 100;
            textures.mino.img.src = 'images/enemy/Enemy-right.png'
         }
         dy = 0;
      } else if (differenceX < differenceY) {
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



weapon.pos.x = character.pos.x - 80;
weapon.pos.y = character.pos.y - 110;

function getWeapon() {
   weapon.size.sx = 100;
   weapon.size.sy = 100;
   weapon.update = function (dt, t) {
      this.pos.x += controls.x * dt * 200;
      this.pos.y += controls.y * dt * 200;
      
      if (controls.x == 1) {
         weapon.frame.x = 1; // right
         this.pos.x = character.pos.x;
         this.pos.y = character.pos.y - 70;
      } else if (controls.x == -1) {
        weapon.frame.x = 3; //left
         this.pos.x = character.pos.x - 90;
         this.pos.y = character.pos.y - 25;
      } else if (controls.y == 1) {
         weapon.frame.x = 2; //down
         weapon.pos.x = character.pos.x - 30;
         weapon.pos.y = character.pos.y;
      } else if (controls.y == -1) {
         weapon.frame.x = 0;  //up
         weapon.pos.x = character.pos.x - 70;
         weapon.pos.y = character.pos.y - 90;
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

//scene.add(background);
// walls();
await initialize();

let nextLv = 50 * level;
let nextLvXp = 1.1;
const xp = new Text(`${currentxp}/${nextLv}`,  {
   font: "12pt sans-serif",
   fill: "yellow",
   align: "center"
 });
 xp.pos.x =w-35;
 xp.pos.y = 80;
 const currentLv = new Text(`${level}`,{
    font:"22pt sans-serif",
    fill: "white",
    align: "center"
 } );
 currentLv.pos.x = w-35;
 currentLv.pos.y = 50;

 function exponential(a,b){
    for(let i=1; i<=b; i++){
      a*=a;
    }
    return Math.round(a);
 }
//adding all elements
// walls();
// initialize();
init();

//Gather maze data and call ExternalServices' saveMaze function
//This function is being called by the user clicking a button on gamepage.html
document.getElementById('save').addEventListener("click", saveMaze);
function saveMaze() {
   var enemyList = new Array();
   for (let min of minows.children) {
      enemyList.push({
         pos: min.pos,
         health: min.health,
         maxHealth: min.startingHealth,
      });
   }
  

   maze.saveMaze({
      enemyList: enemyList,
      userId: user.getUserInfo()._id, //The logged in user ID
      playerPosition: character.pos, //Object containing x and y pos of the player
      playerHealth: character.health, //Current health of the player
      playerMaxHealth: character.startingHealth, //Max health of the player
      currentXp: currentxp, //Not stored as part of the character currently
      playerLevel: level, //Not stored as part of the character currently
      inventory: inventory.children,
      mazeId: user.getMassStorage().gameId, //The ID of the maze
      token: user.getUserToken(),
   });
}

function loopy(ms) {
   requestAnimationFrame(loopy);
   const t = ms / 1000;
   dt = t - last;
   last = t;
   //game logic code
   //ctx.save();
   //drawInventory();
   if (!gameOver && controls.action) {
      getWeapon();
      
      weapon.visible = true;
   } else {
      weapon.visible = false;
   }

   //Change weapon
   if(controls.inventory>-1){
      //console.log(inventory.children[controls.inventory]);

      if(inventory.children[controls.inventory]){
         weapon.frame.y = inventory.children[controls.inventory].frame.y;
      }
   }

   //spawn minos
   if (minows.children.length < 3) {
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
         character.health -=mino.damage;
         if (mino.texture.img.src == "http://127.0.0.1:5500/images/enemy/Enemy.png") {
            //push right
            character.pos.x += mino.damage * 3;
         }
         else if (mino.texture.img.src == "http://127.0.0.1:5500/images/enemy/Enemy-down.png") {
            //move left
            character.pos.x -= mino.damage * 3;
         }
         else if (mino.texture.img.src == "http://127.0.0.1:5500/images/enemy/Enemy-left.png") {
            //character push down
            character.pos.y += mino.damage * 3;
         } 
         else if (mino.texture.img.src == "http://127.0.0.1:5500/images/enemy/Enemy-right.png") {
            //pushes up
            character.pos.y -= mino.damage * 3;
         }
      }

      if(character.health <= 0) {
         character.dead = true;
         healthBar.dead = true;
         weapon.dead = true;
         weapon.damage = 0;
         character.health = 0;
         inventory.children = [];
      }

      dx = mino.pos.x + mino.size.sx / 2 - (weapon.pos.x + weapon.size.sx / 2);
      dy = mino.pos.y + mino.size.sy / 2 - (weapon.pos.y + weapon.size.sy / 2);
      if (weapon.visible && Math.sqrt(dx * dx + dy * dy) < (mino.size.sx / 2 + weapon.size.sx / 2)) {
         mino.health -= weapon.damage;
         if (weapon.frame.x == 0) {
            mino.pos.y -= weapon.damage * 8;
         }
         else if (weapon.frame.x == 1) {
            //console.log(weapon.frame.x);
            mino.pos.x += weapon.damage * 8;
         }
         else if (weapon.frame.x == 2) {
            mino.pos.y += weapon.damage * 8;
         } 
         else if (weapon.frame.x == 3) {
            mino.pos.x -= weapon.damage * 8;
         }

         const item = new TileSprite(textures.weaponTiles,137,137);

         if (mino.health <= 0) {
            item.pos.x = mino.pos.x;
            item.pos.y = mino.pos.y;
            item.frame.y = getRandomIntInclusive(0,3);
            item.size.sx = 100;
            item.size.sy = 100;
            item.visible = true;
            enemyWeapons.add(item);
            currentxp += 5;
         if(currentxp >= nextLv){
            level++;
            nextLv=50*level;
            nextLv *= exponential(nextLvXp,level);
         }
         xp.text = `${currentxp}/${nextLv}`;
         currentLv.text = `${level}`;
            //drop axe
            mino.dead = true;
         }
      }

      enemyWeapons.children.forEach((weapon) => {
         let dx = weapon.pos.x + weapon.size.sx / 3 - (character.pos.x + character.size.sx / 2);
         let dy = weapon.pos.y + weapon.size.sy / 3 - (character.pos.y + character.size.sy / 2);

         let inventoryLocation = 10;
         if (Math.sqrt(dx * dx + dy * dy) < (weapon.size.sx / 3 + character.size.sx / 2)) { 
               //weapon.inventory
               inventory.add(weapon);
               enemyWeapons.remove(weapon);
              
      
      inventory.children.forEach((item) => {
         if(item) {
            item.damage = item.frame.y +1 + level*.5;
            item.pos.x = inventoryLocation; 
            item.pos.y = h - 120;
            //item.quantity.pos.x =inventoryLocation+100;
            //item.quantity.pos.y = h - 20;
            item.size.sx = 50;
            item.size.sy = 50;
         }
         else { }
         inventoryLocation+=90;
            }) 
            }
                       
            
            // weapon.visible = false;
      
      })

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
   function endgame(){
      let gameOverTxt = new Text("Game Over", {
         font:"30pt sans-serif",
         fill:"Red",
         align:"center"
      });
      gameOverTxt.pos.x = w/2;
      gameOverTxt.pos.y = h/2;
      scene.add(gameOverTxt);
      scene.remove(character);
      gameOver = true;
       }
       if(character.dead){
          endgame();
          setTimeout(()=>{
             window.location = "./login.html";
          },2000);
       }
   scene.update(dt, t);
   renderer.render(scene);
   //drawInventory();
}

requestAnimationFrame(loopy);