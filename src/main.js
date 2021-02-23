const canvas = document.querySelector('#board canvas');
const ctx = canvas.getContext('2d');
const {width: w, height: h} = canvas;
ctx.translate(w/2,h/2);

draw();

function draw() {

  //rainbow
   for (let i = 0; i < 6; i++) {
      
      ctx.fillStyle = `hsl(${i * (250/6)}, 90%, 55%)`;
      ctx.fillRect(0, i*20,200,20);  
   }
}