const base_url = "http://backendminotaurpg.herokuapp.com/";
var singleGridArray;
import Setup from "./Setup.js";
// const base_url = "http://localhost:3000/";

function convertToJson(jeff) {
    if (jeff.ok) return jeff.json();

    else {
        const jsonResponse = jeff.json();
        throw { name: 'servicesError in jeff', message: jsonResponse };
    }
}

let setup = new Setup();

export default class ExternalServices {
    constructor() { }

    async getMaze(mazeId, userId = "") {
        let options;
        let action;
        if (mazeId.includes('_noId')) {
            options = {
                method: 'POST',
                body: JSON.stringify({
                    h: setup.getColumns,
                    w: setup.getRows,
                    cH: setup.getH,
                    cW: setup.getW,
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
            };
            action = 'newGame';
        } else {
            options = {
                method: 'POST',
                body: JSON.stringify({
                    gameId: mazeId
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
            };
            action = 'loadGame';
        }
        
        const APIResponse = await fetch(base_url + action, options).then(convertToJson);
        let gridArray = [];
        localStorage.setItem('massStorage', JSON.stringify({
            maze: fwe,///,
            playerPos: wejio,

        }));
        console.log(APIResponse);
        singleGridArray = APIResponse.maze;
        APIResponse.maze.forEach((cell) => {
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
            gridArray.push(cell);
        })

        // console.log(gridArray);
        // singleGridArray = gridArray;
        function listToMatrix(list, numElements) {
            let matrix = [], i, j;

            for (i = 0, j = -1; i < list.length; i++) {
                if (i % numElements === 0) {
                    j++;
                    matrix[j] = [];
                }
                matrix[j].push(list[i].type);
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



    saveMaze(enemies, userId, playerPos, playerHealth, playerMaxHealth, currentXp, playerLevel, mazeId) {
        if (singleGridArray == undefined) {
            singleGridArray = new Array();
        }
        const options = {
            method: 'PATCH',
            body:JSON.stringify({
                userId: userId,
                game: {
                    _id: mazeId,
                    maze: singleGridArray,
                    enemyList: enemies,
                    userIndex: playerPos,
                    playerHealth: playerHealth,
                    playerMaxHealth, playerMaxHealth,
                    currentXp: currentXp,
                    playerLevel: playerLevel,
                    mazeId: mazeId,
                },
            }),
            headers: {
                'Content-Type':'application/json'
            },
        };
        console.log(options);
    
        // fetch(base_url + 'saveGame', options);
    }

    async loginRequest(creds) {
        const options = {
            method: 'POST',
            body: JSON.stringify(creds),
            headers: {
                'Content-Type': 'application/json'
            },
        };

        const response = await fetch(base_url + 'signin', options).then(convertToJson);
        //
        if (response.status === 200)
            localStorage.setItem('user', JSON.stringify(response.user)); //Or a cookie
        //Redirection send an error

        return response;//.accessToken;
    }

    async signupRequest(creds) {
        const options = {
            method: 'POST',
            body: JSON.stringify(creds),
            headers: {
                'Content-Type': 'application/json'
            },
        };

        const response = await fetch(base_url + 'signup', options).then(convertToJson);
        if (response.status == 200)
            localStorage.setItem('user', JSON.stringify(response.user)); //Or a cookie
        //Redirection send an error
        console.log(response);
        return response;//.accessToken;
    }

}