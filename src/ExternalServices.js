const base_url = "http://backendminotaurpg.herokuapp.com/";

function convertToJson(jeff) {
    if (jeff.ok) return jeff.json();

    else {
        const jsonResponse = jeff.json();
        throw {name: 'servicesError in jeff', message: jsonResponse};
    }
}

export default class ExternalServices {
    constructor() {}

    getMaze() {
        
        //if cell.verical = true call spawnVWall(cell);
        const APIResponse = [
            { vertical: true, horizontal: false },
            { vertical: true, horizontal: false },
            { vertical: true, horizontal: false },
            { vertical: false, horizontal: false },
            { vertical: false, horizontal: true },
            { vertical: false, horizontal: false },
            { vertical: true, horizontal: false },
            { vertical: false, horizontal: true },
            { vertical: false, horizontal: true },
            { horizontal: false },
            { vertical: false, horizontal: true },
            { vertical: true, horizontal: false },
            { vertical: false, horizontal: true },
            { vertical: false, horizontal: false },
            { vertical: true, horizontal: true },
            { vertical: true, horizontal: false },
            { vertical: true, horizontal: true },
            { vertical: false, horizontal: false },
            { vertical: false, horizontal: true },
            { horizontal: true },
            { vertical: false, horizontal: true },
            { vertical: true, horizontal: false },
            { vertical: false, horizontal: true },
            { vertical: true, horizontal: true },
            { vertical: true, horizontal: false },
            { vertical: false, horizontal: false },
            { vertical: false, horizontal: true },
            { vertical: false, horizontal: true },
            { vertical: false, horizontal: false },
            { horizontal: true },
            { vertical: false, horizontal: true },
            { vertical: false, horizontal: true },
            { vertical: false, horizontal: false },
            { vertical: true, horizontal: true },
            { vertical: true, horizontal: false },
            { vertical: true, horizontal: false },
            { vertical: false, horizontal: false },
            { vertical: false, horizontal: false },
            { vertical: false, horizontal: false },
            { horizontal: true },
            { vertical: false, horizontal: false },
            { vertical: false, horizontal: true },
            { vertical: false, horizontal: true },
            { vertical: true, horizontal: false },
            { vertical: true, horizontal: false },
            { vertical: true, horizontal: false },
            { vertical: true, horizontal: false },
            { vertical: true, horizontal: true },
            { vertical: false, horizontal: true },
            { horizontal: false },
            { vertical: false, horizontal: true },
            { vertical: true, horizontal: true },
            { vertical: false, horizontal: false },
            { vertical: true, horizontal: true },
            { vertical: false, horizontal: false },
            { vertical: true, horizontal: true },
            { vertical: false, horizontal: true },
            { vertical: false, horizontal: false },
            { vertical: true, horizontal: true },
            { horizontal: false },
            { vertical: false, horizontal: true },
            { vertical: false, horizontal: true },
            { vertical: false, horizontal: true },
            { vertical: true, horizontal: false },
            { vertical: false, horizontal: false },
            { vertical: true, horizontal: false },
            { vertical: false, horizontal: false },
            { vertical: true, horizontal: true },
            { vertical: false, horizontal: true },
            { horizontal: true },
            { vertical: true, horizontal: false },
            { vertical: false, horizontal: false },
            { vertical: false, horizontal: false },
            { vertical: true, horizontal: false },
            { vertical: true, horizontal: true },
            { vertical: true, horizontal: false },
            { vertical: false, horizontal: false },
            { vertical: true, horizontal: true },
            { vertical: false, horizontal: true },
            { horizontal: false },
            { vertical: false, horizontal: false },
            { vertical: true, horizontal: false },
            { vertical: true, horizontal: true },
            { vertical: false, horizontal: true },
            { vertical: false, horizontal: true },
            { vertical: true, horizontal: false },
            { vertical: false, horizontal: false },
            { vertical: false, horizontal: false },
            { vertical: false, horizontal: true },
            { horizontal: false },
            { vertical: true },
            { vertical: true },
            { vertical: false },
            { vertical: false },
            { vertical: false },
            { vertical: true },
            { vertical: true },
            { vertical: true },
            { vertical: false }
        ]


        for(let i = 0; i < APIResponse.length; i++) {
            for(let j = 0; j < APIResponse.length; j++) {
                if (i.vertical) {

                }
                if (i.horizontal) {

                }
            }
        }
            if (cell.vertical) {
                const vWall = new Sprite(textures.vWall);
                textures.vWall.img.src = 'images/wall/wall_vertical.png';
                
                vWall.size.sx = 20;
                vWall.size.sy = 100;
                vWall.pos.x = x;
                vWall.pos.y = y;
                vWalls.add(vWall);
            }
            return vWall;
        });
    }

    saveMaze() {

    }

    async loginRequest(creds) {
        const options = {
            method: 'POST',
            body:JSON.stringify(creds),
            header: {
                'Content-Type':'application/json'
            },
        };
        const response = await fetch(base_url + 'signin', options).then(convertToJson);
        console.log(response);
        return response;//.accessToken;
    }

    async signUpRequest(creds) {
        const options
    }
}