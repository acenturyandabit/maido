function startFBLogin() {
	firebase.auth().signInWithPopup(provider).then(function (result) {
		// This gives you a Facebook Access Token. You can use it to access the Facebook API.
		var token = result.credential.accessToken;
		// The signed-in user info.
		var user = result.user;
		console.log(user);
		db.collection("users").doc(user.uid).get().then((doc) => {
			if (doc.exists) {
				//yay a user exists lets get all their data
				udata = doc.data();
			} else {
				db.collection("users").doc(user.uid).set({
					email: user.email
				});
				//create a new document.
			}
		});
		// ...
	}).catch(function (error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		console.log(errorMessage);
		// The email of the user's account used.
		var email = error.email;
		// The firebase.auth.AuthCredential type that was used.
		var credential = error.credential;
		// ...
	});
}
var currentUser;
firebase.auth().onAuthStateChanged(function (user) {
	if (user) {
		// User is signed in.
		//get the username
		let username;
		username=user.displayName;
		if (!username)userName=user.email;
		$("displayName").text(userName);
		if (user.photoURL)$("#userPic")[0].src=user.photoURL;
		// show main screen
		$("#splash").hide();
		currentUser=user;
		
	} else {
		// No user is signed in.
	}
});

function startEmailLogin() {
	$("#innerSplash").hide();
	$("#emailLogin").show();
}

function continueEmailLogin() {
	//Do some checking of the password
	var email = $("#siem")[0].value;
	var password = $("#sipas")[0].value;
	firebase.auth().createUserWithEmailAndPassword(email, password).catch(function (error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// ...
	});

}
