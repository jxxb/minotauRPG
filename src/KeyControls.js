export default class KeyControls{
    constructor(){
        this.keys = {}
        //bind event handlers
        document.addEventListener('keydown', e=>{
            if([37,38,39,40].indexOf(e.which) >= 0){
                e.preventDefault();
            }
            this.keys[e.which] = true;
        }, false);
        document.addEventListener('keyup', e=>{
            this.keys[e.which] = false;
        }, false);
    }
    get action(){
        return this.keys[32];
    }
    getRotate(ctx, px, py, angle){
        const DegToRad = deg =>(Math.PI/180)*deg;
        
        if(this.keys[37]||this.keys[65]){
            ctx.save();
            ctx.translate(px , py ); 
            // Perform the rotation  
            ctx.rotate(DegToRad(angle));  
            // Translate back to the top left of our image  
            ctx.translate(-px, -py);
            return -1;
        }
        if(this.keys[39]||this.keys[68]){
            ctx.save();
            ctx.translate(px, py);  
            // Perform the rotation  
            ctx.rotate(DegToRad(angle));  
            // Translate back to the top left of our image  
            ctx.translate(-px, -py);
            return 1;
        }
        return 0;
    }
    getY(){
        if(this.keys[38]||this.keys[87]){
            return -1;
        }
        if(this.keys[40]||this.keys[83]){
            return 1;
        }
        return 0;
    }
    

}