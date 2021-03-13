import ExternalServices from './ExternalServices.js';

export default class User{
    constructor(){
        this.services = new ExternalServices();
    }

    checkPassword(pass1, pass2){
        return pass1==pass2;
    }
    
    loginUser(){
        const email = document.querySelector('.email').value;
        const password = document.querySelector('.password').value;
        // const confPass = document.querySelector('.confPass').value;
        // const name = document.querySelector('.username').value;
        this.login({email,password});
    }

    createUser(){
        const email = document.querySelector('.email').value;
        const password = document.querySelector('.password').value;
        const confirmPassword = document.querySelector('.confPass').value;
        const username = document.querySelector('.username').value;
        this.signup({email,password,confirmPassword,username});
    }

    async login(creds) {
        try {
            //TOKEN?
            const response = await this.services.loginRequest(creds);
        } catch(err) {
            console.log("WAHHHHHHH!");
        }
    }
    async signup(creds) {
        try {
            //TOKEN?
            const response = await this.services.signupRequest(creds);
        } catch(err) {
            console.log("WAHHHHHHH!");
        }
    }
}