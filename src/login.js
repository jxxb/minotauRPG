import User from './User.js';
import ExternalServices from './ExternalServices.js';

const user = new User(); // redirect to game PAGE

document.querySelector('#button').addEventListener('click', (e) => {
    e.preventDefault();
    user.createUser();
})