import ExternalServices from './ExternalServices.js';

export default class User{
    constructor(){
        this.services = new ExternalServices();
    }

    checkPassword(pass1, pass2){
        return pass1==pass2;
    }

    getUserInfo() {
        return JSON.parse(localStorage.getItem('user'));
    }
    
    loginUser(){
        const email = document.querySelector('.email').value;
        const password = document.querySelector('.password').value;
        // const confPass = document.querySelector('.confPass').value;
        // const name = document.querySelector('.username').value;
        return this.login({email,password});
    }

    logOutUser(){
        localStorage.removeItem('user');
        localStorage.removeItem('actualMaze');
    }

    setActualMaze(id){
        localStorage.setItem('actualMaze',id);
    }

    getMassStorage() {
        return JSON.parse(localStorage.getItem('massStorage'));
    }

    getActualMazeId(){
        return localStorage.getItem('actualMaze');
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
            return await this.services.loginRequest(creds);
        } catch(err) {
            console.log("WAHHHHHHH!");
        }
    }
    async signup(creds) {
        try {
            //TOKEN?
            return await this.services.signupRequest(creds);
        } catch(err) {
            console.log("WAHHHHHHH!");
        }
    }
}