// ── MOBILE NAV SWITCHING ────────────────────────────────────
let activeMobilePanel = 'editor';

window.mobileNavSwitch = function(panel) {
  // Only apply mobile logic on small screens
  if (window.innerWidth > 640) return;

  activeMobilePanel = panel;

  // Update panel visibility
  document.querySelectorAll('.mobile-panel').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('panel-' + panel);
  if (target) target.classList.add('active');

  // Update nav button active state
  document.querySelectorAll('.mob-nav-btn').forEach(b => b.classList.remove('active'));
  const navBtn = document.getElementById('nav-' + panel);
  if (navBtn) navBtn.classList.add('active');

  // Clear badge when opening decoder
  if (panel === 'decoder') {
    document.getElementById('mobBadge').style.display = 'none';
  }
};

// ── SIDEBAR DRAWER ───────────────────────────────────────────
window.toggleSidebar = function() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const isOpen   = sidebar.classList.contains('open');
  if (isOpen) {
    closeSidebar();
  } else {
    sidebar.classList.add('open');
    overlay.classList.add('open');
  }
};

window.closeSidebar = function() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
};

// ── MOBILE SEND ──────────────────────────────────────────────
window.updateCharCountMob = function() {
  const val = document.getElementById('msgMob').value;
  document.getElementById('charCountMob').textContent = val.length + ' / 200';
};

window.sendMob = function() {
  const ta   = document.getElementById('msgMob');
  const text = ta.value.trim();
  if (!text) return;

  messagesRef.push({
    text,
    sender: myId,
    timestamp: Date.now()
  });

  ta.value = '';
  updateCharCountMob();
  showToast('Packet transmitted');

  // Switch back to editor after sending
  mobileNavSwitch('editor');
};

// ── RESPONSIVE LAYOUT ADJUSTMENTS ───────────────────────────
function applyResponsiveLayout() {
  const isMobile = window.innerWidth <= 640;

  // On desktop: ensure panels reset to default flex flow
  if (!isMobile) {
    document.querySelectorAll('.mobile-panel').forEach(p => {
      p.classList.remove('active');
    });
    // The split-wrapper handles everything on desktop
    document.getElementById('panel-editor').classList.add('active');

    // Restore sidebar (not a drawer on desktop)
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebarOverlay').classList.remove('open');
  } else {
    // Ensure active panel is visible
    const active = document.querySelector('.mobile-panel.active');
    if (!active) {
      document.getElementById('panel-editor').classList.add('active');
    }
  }
}

window.addEventListener('resize', applyResponsiveLayout);
applyResponsiveLayout();

// ── PREVENT SCROLL BOUNCE ON IOS ────────────────────────────
document.addEventListener('touchmove', function(e) {
  if (e.target.closest('.decoder-scroll, .code-highlight, .mobile-msg-textarea')) return;
  e.preventDefault();
}, { passive: false });

// ── FIX VIEWPORT HEIGHT ON MOBILE (address bar issues) ──────
function setVh() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--real-vh', `${vh}px`);
}
setVh();
window.addEventListener('resize', setVh);
