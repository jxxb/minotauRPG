import User from './User.js';

const user = new User();

document.querySelector('#button').addEventListener('click', (e) => {
    e.preventDefault();
    user.createUser();
})

// function packageUser(formData){
//     const dataArray =formData.entries();
//     console.log(dataArray);
//     dataArray.map(item)
// }
// const passwordCompare = myUser.checkPassword(formData.get('password'), formData.get('confirm-password'))
// if(passwordCompare){
//     //create user
//     packageUser(formData);
//     //remove passwords from formData --look in CheckoutProcess for formData tutorial
// }
// else{
//     //let user know password problem
// }