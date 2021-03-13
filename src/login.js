import User from './User.js';

const user = new User(); // redirect to game PAGE

document.querySelector('#button').addEventListener('click', (e) => {
    e.preventDefault();
    user.loginUser();
})