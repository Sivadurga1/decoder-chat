let packetQueue = [];
let latestPacket = null;
let currentRunText = null;

let paneTimer = null;
let outputTimer = null;

function updateCharCount(){
  const val = document.getElementById('msg').value;
  document.getElementById('charCount').textContent = val.length + ' / 200';
}

window.send = function(){
  const text = document.getElementById('msg').value.trim();
  if(!text) return;

  messagesRef.push({ 
    text, 
    sender: myId, 
    timestamp: Date.now() 
  });

  document.getElementById('msg').value = '';
  updateCharCount();
};

window.renderIncoming = function(text){
  latestPacket = text;
  currentRunText = text;

  const code = buildDecoderCode(text);

  document.getElementById('decoderScroll').innerHTML =
    `<pre>${escHtml(code)}</pre>`;

  document.getElementById('runBtn').style.display = 'inline-block';

  openRightPane(); // This now controls its own timer
};

window.runDecoder = function(){
  const scroll = document.getElementById('decoderScroll');

  const outputBlock = document.createElement('div');
  outputBlock.className = 'output-block';
  outputBlock.innerHTML = `
    <div class="output-header">
      OUTPUT
      <span class="output-timer-badge">3s</span>
    </div>
    <div class="output-body">${escHtml(currentRunText)}</div>
  `;

  scroll.appendChild(outputBlock);

  // Clear old timer if exists
  if(outputTimer){
    clearTimeout(outputTimer);
  }

  let remaining = 3;
  const badge = outputBlock.querySelector('.output-timer-badge');

  const countdown = setInterval(()=>{
    remaining--;
    if(remaining > 0){
      badge.textContent = remaining + 's';
    }
  },1000);

  outputTimer = setTimeout(()=>{
    clearInterval(countdown);
    outputBlock.remove();
  },3000);
};

window.openRightPane = function(){
  const pane = document.getElementById('rightPane');

  pane.classList.add('open');

  // Clear existing timer
  if(paneTimer){
    clearTimeout(paneTimer);
  }

  paneTimer = setTimeout(()=>{
    closeRightPane();
  },5000);
};

window.closeRightPane = function(){
  const pane = document.getElementById('rightPane');
  pane.classList.remove('open');
};