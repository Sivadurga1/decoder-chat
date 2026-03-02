let currentTab = 'main.py';

const fileContents = {
  'main.py': `# main.py
def start():
    print("Runtime ready")

if __name__ == "__main__":
    start()`,
  'utils.py': `# utils.py
def helper():
    return "Utility loaded"`,
  'decoder.py': ``
};

const textarea   = document.getElementById('codeTextarea');
const codeRender = document.getElementById('codeRender');
const lineNums   = document.getElementById('lineNums');

function highlight(code){
  return code
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;');
}

function updateEditor(){
  const val = textarea.value;
  codeRender.innerHTML = highlight(val) + '\n';
  const lines = val.split('\n');
  lineNums.textContent = lines.map((_,i)=>i+1).join('\n');
}

function switchTab(file){
  // Update tab bar active state
  document.querySelectorAll('.tabs span').forEach(s => s.classList.remove('active'));
  const tabEl = document.getElementById('tab-' + file);
  if (tabEl) tabEl.classList.add('active');

  // Update sidebar active state
  document.querySelectorAll('.sidebar-item').forEach(s => s.classList.remove('active-file'));
  const sideEl = document.getElementById('sfile-' + file);
  if (sideEl) sideEl.classList.add('active-file');

  fileContents[currentTab] = textarea.value;
  currentTab = file;
  textarea.value = fileContents[file] || '';
  document.getElementById('leftPaneTitle').textContent = file;
  updateEditor();
}

textarea.addEventListener('input', ()=>{
  fileContents[currentTab] = textarea.value;
  updateEditor();
});

textarea.addEventListener('keyup', ()=>{
  const val = textarea.value.substring(0, textarea.selectionStart);
  const lines = val.split('\n');
  document.getElementById('cursorPos').textContent =
    `Ln ${lines.length}, Col ${lines[lines.length-1].length+1}`;
});

switchTab('main.py');
