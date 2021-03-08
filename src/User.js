import ExternalServices from './ExternalServices.js';

export default class User{
    constructor(){
        this.services = new ExternalServices();
    }

    checkPassword(pass1, pass2){
        return pass1==pass2;
    }
    
    createUser(){
        const email = document.querySelector('.email').value;
        const password = document.querySelector('.password').value;
        this.login({email,password});
    }

    loadUser(){

    }

    async login(creds) {
        try {
            //TOKEN?
            const response = await this.services.loginRequest(creds);
        } catch(err) {
            console.log("WAHHHHHHH!");
        }
    }
}