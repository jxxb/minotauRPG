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

    async getMaze(mazeId, token = "") {
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
                    'Content-Type': 'application/json',
                    'Authorization' : 'Bearer ' + token
                },
            };
            action = 'loadGame';
        }
        
        const APIResponse = await fetch(base_url + action, options).then(convertToJson);
        let gridArray = [];
        localStorage.setItem('massStorage', JSON.stringify({
            maze: APIResponse.maze,
            enemyList: APIResponse.enemyList,
            inventory: APIResponse.ineventory,
            playerHealth: APIResponse.playerHealth,
            playerMaxHealth: APIResponse.playerMaxHealth,
            playerExperience: APIResponse.playerExperience,
            playerLevel: APIResponse.playerLevel,
            playerPosition: APIResponse.playerPosition,
            gameId: APIResponse._id,

        }));
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

    saveMaze(game) {
        if (singleGridArray == undefined) {
            singleGridArray = new Array();
        }
        const options = {
            method: 'PATCH',
            body:JSON.stringify({
                userId: game.userId,
                game: {
                    _id: game.mazeId,
                    maze: singleGridArray,
                    enemyList: game.enemyList,
                    playerPosition: game.playerPosition,
                    playerHealth: game.playerHealth,
                    playerMaxHealth: game.playerMaxHealth,
                    inventory: game.inventory,
                    playerExperience: game.currentXp,
                    playerLevel: game.playerLevel,
                },
            }),
            headers: {
                'Content-Type':'application/json',
                'Authorization' : 'Bearer ' + game.token
            },
        };
        console.log(options);
    
        fetch(base_url + 'saveGame', options)
        .then((x) => {
            return x.json();
        })
        .then((response) => {
            console.log(response);
        })
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
        
        //if (response.status === 200) {
            localStorage.setItem('user', JSON.stringify(response.user)); 
            localStorage.setItem('token', response.token); 
        //}
            
        

        return response;
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
        //if (response.status == 200)
            localStorage.setItem('user', JSON.stringify(response.user)); //Or a cookie
        //Redirection send an error
        console.log(response);
        return response;//.accessToken;
    }

}