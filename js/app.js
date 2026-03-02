let latestPacket = null;
let currentRunText = null;
let outputTimer = null;

function updateCharCount() {
  const val = document.getElementById('msg').value;
  document.getElementById('charCount').textContent = val.length + ' / 200';
}

window.send = function () {
  const text = document.getElementById('msg').value.trim();
  if (!text) return;

  messagesRef.push({
    text,
    sender: myId,
    timestamp: Date.now()
  });

  document.getElementById('msg').value = '';
  updateCharCount();

  showToast('Packet transmitted');
};

window.renderIncoming = function (text) {
  latestPacket = text;
  currentRunText = text;

  const code = buildDecoderCode(text);
  const codeHtml = `<pre>${escHtml(code)}</pre>`;

  // Update BOTH desktop right pane and mobile decoder panel
  const desktopScroll = document.getElementById('decoderScroll');
  const mobileScroll = document.getElementById('decoderScrollMob');

  desktopScroll.innerHTML = codeHtml;
  mobileScroll.innerHTML = codeHtml;

  // Show run buttons in both
  const runBtn = document.getElementById('runBtn');
  const runBtnMob = document.getElementById('runBtnMob');
  if (runBtn) runBtn.style.display = 'inline-block';
  if (runBtnMob) runBtnMob.style.display = 'inline-block';

  openRightPane();

  // Show badge indicators
  const tabBadge = document.getElementById('tab-badge');
  const sidebarBadge = document.getElementById('sidebar-badge');
  const mobBadge = document.getElementById('mobBadge');
  if (tabBadge) tabBadge.classList.add('show');
  if (sidebarBadge) sidebarBadge.classList.add('show');
  if (mobBadge) mobBadge.style.display = 'flex';

  // On mobile: auto-switch to decoder tab and show a toast
  if (window.innerWidth <= 640) {
    mobileNavSwitch('decoder');
  }

  showToast('📦 New packet received');
};

window.runDecoder = function () {
  if (!currentRunText) return;

  // Determine which scroll container is active
  const isMobile = window.innerWidth <= 640;
  const scroll = isMobile
    ? document.getElementById('decoderScrollMob')
    : document.getElementById('decoderScroll');

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
  scroll.scrollTop = scroll.scrollHeight;

  // Hide run buttons
  const runBtn = document.getElementById('runBtn');
  const runBtnMob = document.getElementById('runBtnMob');
  if (runBtn) runBtn.style.display = 'none';
  if (runBtnMob) runBtnMob.style.display = 'none';

  // Clear badges
  const tabBadge = document.getElementById('tab-badge');
  const sidebarBadge = document.getElementById('sidebar-badge');
  const mobBadge = document.getElementById('mobBadge');
  if (tabBadge) tabBadge.classList.remove('show');
  if (sidebarBadge) sidebarBadge.classList.remove('show');
  if (mobBadge) mobBadge.style.display = 'none';

  if (outputTimer) { clearTimeout(outputTimer); outputTimer = null; }

  let remaining = 3;
  const badge = outputBlock.querySelector('.output-timer-badge');

  const countdown = setInterval(() => {
    remaining--;
    if (remaining > 0) badge.textContent = remaining + 's';
  }, 1000);

  outputTimer = setTimeout(() => {
    clearInterval(countdown);
    outputBlock.remove();

    if (typeof latestPacketKey !== 'undefined' && latestPacketKey) {
      messagesRef.child(latestPacketKey).remove();
      latestPacketKey = null;
    }

    closeRightPane();
    currentRunText = null;

    // Reset both decoder panels to waiting state
    const waitingHtml = `<div class="waiting-state">
      <div class="waiting-icon">⌛</div>
      <div>Waiting for incoming packet</div>
      <div class="waiting-dots"><span>.</span><span>.</span><span>.</span></div>
    </div>`;
    document.getElementById('decoderScroll').innerHTML = waitingHtml;
    document.getElementById('decoderScrollMob').innerHTML = waitingHtml;

  }, 3000);
};

window.openRightPane = function () {
  const pane = document.getElementById('rightPane');
  const divider = document.getElementById('splitDivider');
  if (pane) pane.classList.add('open');
  if (divider) divider.classList.add('visible');
};

window.closeRightPane = function () {
  const pane = document.getElementById('rightPane');
  const divider = document.getElementById('splitDivider');
  if (pane) pane.classList.remove('open');
  if (divider) divider.classList.remove('visible');
};

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}
