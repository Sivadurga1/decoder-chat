let db, messagesRef, myId;

window.addEventListener('load', function(){

  const firebaseConfig = {
    apiKey: "AIzaSyCG9O3OwxU-4f6IDsNNSGL1BRDDgYMFuUw",
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

  myId = localStorage.getItem("devsnippet_id");
  if(!myId){
    myId = crypto.randomUUID();
    localStorage.setItem("devsnippet_id", myId);
  }

  messagesRef.on("child_added", snapshot=>{
    const data = snapshot.val();
    if(!data) return;
    if(data.sender === myId) return;

    renderIncoming(data.text);
    setTimeout(()=> snapshot.ref.remove(), 3000);
  });
});