let db;
let messagesRef;
let myId;
let latestPacketKey = null;

const firebaseConfig = {
  apiKey: "AIzaSyCOjZBKezzBnWhNn8mzuNcfMGInj0gAuyw",
  authDomain: "realtime-snippet-runner.firebaseapp.com",
  databaseURL: "https://realtime-snippet-runner-default-rtdb.firebaseio.com",
  projectId: "realtime-snippet-runner",
  storageBucket: "realtime-snippet-runner.firebasestorage.app",
  messagingSenderId: "1039172978176",
  appId: "1:1039172978176:web:2e6c90fb8677e2af47bae5"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    myId = user.uid;
    db = firebase.database();
    messagesRef = db.ref("packets");

    messagesRef.off();

    messagesRef.on("child_added", snapshot => {
      const data = snapshot.val();
      if (!data) return;
      if (data.sender === myId) return;

      latestPacketKey = snapshot.key;
      renderIncoming(data.text);
    });

    document.getElementById("loginBox").style.display = "none";
    document.getElementById("app").style.display = "block";

  } else {
    if (messagesRef) messagesRef.off();
    document.getElementById("loginBox").style.display = "block";
    document.getElementById("app").style.display = "none";
  }
});

window.login = function () {
  const email    = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!email || !password) { alert("Enter email and password"); return; }
  firebase.auth()
    .signInWithEmailAndPassword(email, password)
    .catch(err => alert(err.message));
};

window.logout = function () {
  firebase.auth().signOut();
};
