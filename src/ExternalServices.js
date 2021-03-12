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
            { vertical: false },
            { vertical: false, horizontal: false },
        ]

        let gridArray = [];

        APIResponse.forEach((cell) => {
            if (cell.vertical && cell.horizontal) {
               // 'bottomRight'
                cell.type = 1;
                
            } else if (cell.vertical && !cell.horizontal) {
                //'right';
                cell.type = 2;
            } else if (!cell.vertical && cell.horizontal) {
               // 'bottom';
                cell.type = 3;
            } else {
               // 'empty';
                cell.type = 4;
            }
            gridArray.push(cell.type);
        })

        function listToMatrix(list, numElements) {
            let matrix = [], i, j;

            for (i=0, j=-1; i<list.length; i++) {
                if (i % numElements === 0) {
                    j++;
                    matrix[j] = [];
                }
                matrix[j].push(list[i]);
            }
            console.log(matrix);
            return matrix;

        }
        
        return listToMatrix(gridArray, 10);
        

    };
        //empty 
        //bottom          hWalls
            //v = false h = true

        //right           vWalls
        //bottomRight v & hWalls



        // for(let i = 0; i < w; i++) {
        //     for(let j = 0; j < h; j++) {
        //         if (.vertical) {

        //         }
        //         if (i.horizontal) {

        //         }
        //     }
        // }
            // if (cell.vertical) {
            //     const vWall = new Sprite(textures.vWall);
            //     textures.vWall.img.src = 'images/wall/wall_vertical.png';
                
            //     vWall.size.sx = 20;
            //     vWall.size.sy = 100;
            //     vWall.pos.x = x;
            //     vWall.pos.y = y;
            //     vWalls.add(vWall);
            // }
       
   

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
        console.log(options);
        const response = await fetch(base_url + 'signin', options).then(convertToJson);
        console.log(response);
        return response;//.accessToken;
    }

    async signUpRequest(creds) {
        //const options
    }
}