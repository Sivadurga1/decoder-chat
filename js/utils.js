function escHtml(s){
  return s.replace(/&/g,'&amp;')
          .replace(/</g,'&lt;')
          .replace(/>/g,'&gt;');
}

function toBinary(text){
  return text.split('')
    .map(c=>c.charCodeAt(0).toString(2).padStart(8,'0'))
    .join(' ');
}

function buildDecoderCode(text){
  const binary = toBinary(text);
  return `# decoder.py
packet = "${binary}"

def decode_packet(binary):
    chars = binary.split()
    return ''.join(chr(int(b,2)) for b in chars)

print(decode_packet(packet))`;
}