// globals.js
let currentUser = null;

module.exports = {
  setCurrentUser: (user) => { currentUser = user; console.log(user); },
  getCurrentUser: () => currentUser
};
