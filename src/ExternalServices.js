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

    }

    saveMaze() {

    }

    async loginRequest(creds) {
        const options = {
            method: 'POST',
            header: {
                'Content-Type':'application/json'
            },
            body:JSON.stringify(creds),
        };
        const response = await fetch(base_url + 'login', options).then(convertToJson);
        console.log(response);
        return response;//.accessToken;
    }
}