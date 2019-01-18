function _fireshell() {
  // add the firebase script.
  $("head").append(`
    <script src="https://www.gstatic.com/firebasejs/5.5.5/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/5.5.5/firebase-firestore.js"></script>
    `);
  // wait for firebase to start, then initalise it. Keep it out of main to prevent the entire script from disabling if firebase is off.
  this.firebaseTimeout = 60;
  this.initaliseFirebase = function() {
    firebaseStarted = false;
    firedbStarted = false;
    if (!firebaseStarted) {
      try {
        var config = {
          apiKey: "AIzaSyA-sH4oDS4FNyaKX48PSpb1kboGxZsw9BQ",
          authDomain: "backbits-567dd.firebaseapp.com",
          databaseURL: "https://backbits-567dd.firebaseio.com",
          projectId: "backbits-567dd",
          storageBucket: "backbits-567dd.appspot.com",
          messagingSenderId: "894862693076"
        };
        firebase.initializeApp(config);
        firebaseStarted = true;
      } catch (e) {}
    }
    if (firebaseStarted && !firedbStarted) {
      try {
        // Initialize Cloud Firestore through Firebase
        var db = firebase.firestore();
        // Disable deprecated features
        db.settings({
          timestampsInSnapshots: true
        });
      } catch (e) {}
    }
    if (!firedbStarted) {
      __firebaseTimeout--;
      if (__firebaseTimeout > 0) {
        setTimeout(this.initialiseFirebase, 1000);
      }
    }
  };
  this.initialiseFirebase();
}

fireshell = new _fireshell();
