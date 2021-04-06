// from Sitepoint HTML5 Games: Novice to Ninja
class CanvasRenderer {
    constructor(w, h, sx, sy) {
      const canvas = document.createElement("canvas");
      this.w = canvas.width = w;
      this.h = canvas.height = h;
      this.view = canvas;
      this.ctx = canvas.getContext("2d");
    }
    render(container, clear = true) {
      const { ctx } = this;
      function renderRec(container) {
        // Render the container children
        container.children.forEach((child) => {
          if (child.visible == false) {
            return;
          }
          ctx.save();
          // Draw the leaf node
          if (child.pos) {
            ctx.translate(Math.round(child.pos.x), Math.round(child.pos.y));
          }
          if (child.text) {
            const { font, fill, align } = child.style;
            if (font) ctx.font = font;
            if (fill) ctx.fillStyle = fill;
            if (align) ctx.textAlign = align;
            ctx.fillText(child.text, 0, 0);
          } else if (child.tileW) {
            //const img = '../images/weapons/weapons_sprite.png';
            const img = child.texture.img;
            ctx.drawImage(
              img,
              child.frame.x * child.tileW, //source x
              child.frame.y * child.tileH, //source y
              child.tileW, child.tileH,    //width & height
              0,0,                         //destination x & y
              child.tileW, child.tileH     //destination width & height
            );
            if(child.quantity){
            const { font, fill, align } = child.quantity.style;
            if (font) ctx.font = font;
            if (fill) ctx.fillStyle = fill;
            if (align) ctx.textAlign = align;
            ctx.fillText(child.quantity.text, 90, 110);
            }
          } 
          else if (child.texture) {
            ctx.drawImage(child.texture.img, 0, 0, child.size.sx, child.size.sy);
          } 
          // else {
          //   ctx.drawImage(img, 0, 0);
          // }
          else if (!child.text && !child.texture) {
            //console.log(child.health);
            let health = child.startingHealth;
            if (child.health > health *.6) {
              ctx.fillStyle = 'rgba(0,225,0,0.75)';
              ctx.fillRect(child.x, child.y, child.health/4, 10);
            } else if (child.health < health *.6 && child.health > health *.3) {
              ctx.fillStyle = 'rgba(255,255,0,0.75)';
              ctx.fillRect(child.x, child.y, child.health/4, 10);
            } else if (child.health < health *.3) {
              ctx.fillStyle = 'rgba(225,0,0,0.75)';
              ctx.fillRect(child.x, child.y, child.health/4, 10);
            } 
          } else if (child.box) {
            
          }
          // Handle the child types
          if (child.children) {
            renderRec(child);
          }
          ctx.restore();
        });
      }
      if (clear) {
        ctx.clearRect(0, 0, this.w, this.h);
      }
      renderRec(container);
    }
  }
  export default CanvasRenderer;
  