let db, messagesRef, myId;
let latestPacketKey = null;

window.addEventListener('load', function () {

  const firebaseConfig = {
    apiKey: "AIzaSyCOjZBKezzBnWhNn8mzuNcfMGInj0gAuyw",
    authDomain: "realtime-snippet-runner.firebaseapp.com",
    databaseURL: "https://realtime-snippet-runner-default-rtdb.firebaseio.com",
    projectId: "realtime-snippet-runner",
    storageBucket: "realtime-snippet-runner.firebasestorage.app",
    messagingSenderId: "1039172978176",
    appId: "1:1039172978176:web:2e6c90fb8677e2af47bae5"
  };

  firebase.initializeApp(firebaseConfig);

  db = firebase.database();
  messagesRef = db.ref("packets");

  // Unique browser ID
  myId = localStorage.getItem("devsnippet_id");
  if (!myId) {
    myId = crypto.randomUUID();
    localStorage.setItem("devsnippet_id", myId);
  }

  messagesRef.on("child_added", snapshot => {
    const data = snapshot.val();
    if (!data) return;
    if (data.sender === myId) return;

    latestPacketKey = snapshot.key; // store packet key
    renderIncoming(data.text);
  });

});