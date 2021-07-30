let googleUser;

window.onload = (event) => {
  // Use this to retain user state between html pages.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('Logged in as: ' + user.displayName);
      googleUser = user;
      const googleUserId = user.uid;
      getNotes(googleUserId);
    } else {
      // If not logged in, navigate back to login page.
      window.location = 'index.html'; 
    };
  });
};

const getNotes = (userId) => {
  const notesRef = firebase.database().ref(`users/${userId}`);
  notesRef.on('value', (snapshot) => {
    const data = snapshot.val();
    renderData(data);
  });
};

const renderData = (data) => {
    const destination = document.querySelector('#app');
    destination.innerHTML = "";
    for (let key in data) {
        const note = data[key];
        destination.innerHTML += createCard(note, key);
    }
};

const createCard = (note, noteId) => {
    return `<div class="column is-one-quarter">
                <div class="card"> 
                    <header class="card-header"> 
                        <p class="card-header-title"> 
                            ${note.title} 
                        </p> 
                    </header> 
                    <div class="card-content"> 
                        <div class="content">
                            ${note.text} 
                        </div>
                    </div> 
                    <footer class = "card-footer">
                        <a href = "#" class = "card-footer-item" onclick = "deleteNote('${noteId}')">Delete</a>
                        <a href = "#" class = "card-footer-item" onclick = "editNote('${noteId}')">Edit</a>
                    </footer>
                </div>
            </div>`;
};

const deleteNote = (noteId) => {
    console.log("here")
    const deleteNoteDB = firebase.database().ref(`users/${googleUser.uid}/${noteId}`)
    deleteNoteDB.remove();
}

const editNote = (noteId) => {
    console.log("here")
    const editsDB = firebase.database().ref(`users/${googleUser.uid}/${noteId}`)
    editsDB.on("value", (snapshot) => {
        const note = snapshot.val()
        const editModal = document.querySelector("#editModal");
        const editTitle = document.querySelector("#editTitle");
        const editText = document.querySelector("#editText");
        const noteeditID = document.querySelector("#noteeditID");
        noteeditID.setAttribute("editID", noteId);
    editModal.classList.add('is-active');
    editTitle.value = note.title; 
    editText.value = note.text;
    noteeditID.innerHTML = noteId;
    //noteId = noteID.value;    
    //editTitle.innerHTML +=  note.title;
    //editText.innerHTML += note.text;
    })
    
    
}

const closeModal = () => {
    const editModal = document.querySelector("#editModal");
    editModal.classList.remove('is-active');
}

const saveChanges = () => {
    console.log("here");
    const editTitle = document.querySelector("#editTitle");
    const editText = document.querySelector("#editText");
    const noteIdElement = document.querySelector("#noteeditID");
    const noteId = noteIdElement.getAttribute("editID");
    const saveChangesRef = firebase.database().ref(`users/${googleUser.uid}/${noteId}`)
    //const noteID = document.querySelector("#noteID");

    title = editTitle.value; 
    text = editText.value 
    saveChangesRef.update({
        title: title, 
        text: text,
    });

    closeModal();
}