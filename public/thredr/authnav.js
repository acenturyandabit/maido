var roomName;
$(() => {
    //If there is a chat link, open the relevant chat
    k = new URLSearchParams(window.location.search);
    if (k.has("room")) {
        roomName = k.get("room");
        initialiseConversation();
    } else {
        //redirect to homepage
        window.location.href = "index.html";
    }
    /*var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // Start loading the page.*/
    /*
    }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
    });*/
})

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

userdata = {};

function initialiseConversation() {
    document.title = roomName;
    $(".titlebar").text(name);
    //Check for localstorage session
    //prompt the user for password
    if (localStorage['userdata']) {
        try {
            userdata = JSON.parse(localStorage['userdata']);
            if (userdata.passwords[name]) {
                showLoading();
                tryLogin(userdata.passwords[name]);
            } else {
                requestPassword();
            }
        } catch (e) {
            createNewUser();
            requestPassword();
            //something went wrong
        }

    } else {
        createNewUser();
        requestPassword();
    }
}

function createNewUser() {
    userdata['uid'] = guid();
    localStorage['userdata'] = JSON.stringify(userdata);
}

function tryLogin(password) {
    loadMessages();
}

function requestPassword(password) {
    loadMessages();
}