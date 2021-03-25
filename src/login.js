//Imports
import User from './User.js';
//Objects
const user = new User(); // redirect to game PAGE
//Elements
const button = document.querySelector('#button');
const logOut = document.querySelector('#logout');
const loginForm = document.querySelector('#loginForm');
const loadForm = document.querySelector('#loadForm');
const formContent = document.querySelector('#formContent');

//listeners
//Option listener (just added when the element is created)
formContent.addEventListener('dblclick', (e) => {
    const gameId = e.target.getAttribute("for");
    user.setActualMaze(gameId);
    window.location.href = "gamepage.html";
});

logOut.addEventListener('click', (e) => {
    e.preventDefault();
    user.logOutUser();
    cleanLoadForm();
    toggleForms();
})

button.addEventListener('click', (e) => {
    e.preventDefault();
    user.loginUser().then(response => {
        console.log(response);
        console.log(response.user._id);
        console.log(user.getUserInfo);
        for (let game of response.user.games){
            const newButton = document.createElement('input');
            const newLabel = document.createElement('label');
            newLabel.setAttribute("for",game);
            newLabel.textContent = game;
            newButton.type = "radio";
            newButton.name = "savedGame";
            newButton.id = game;
            newButton.textContent = game;

            formContent.appendChild(newButton);
            formContent.appendChild(newLabel);
            formContent.appendChild(document.createElement("br"));
        }
        toggleForms();
    });
    
})

window.addEventListener('load', (e) => {
    toggleForms();
})

//Js Behavior
const toggleForms = () => {
    if (!user.getUserInfo()) {
        loginForm.style.display = "flex";
        loadForm.style.display = "none";
    } else {
        loginForm.style.display = "none";
        loadForm.style.display = "flex";
    }
}

const cleanLoadForm = () => {
    formContent.innerHTML = "";
}