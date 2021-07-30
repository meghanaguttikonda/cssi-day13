const signInRef = firebase.database().ref();
const username = document.querySelector("#username");
const password = document.querySelector("#password")

const getCredentials = () => {
  signInRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderData(data);
  });
};

const renderData = (data) => {
    let user_username = username.value; 
    let user_password = password.value;
    for (let key in data) {
        const cred = data[key];
        if(cred.username == user_username && cred.password == user_password){
            window.location = "writeNote.html"
        }
        else{
            window.location = "index.HTML"
        }
       
    }
};

const signup = () => {
 window.location = "signup.html";
}
