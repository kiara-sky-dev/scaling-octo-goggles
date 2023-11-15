// live version of this found in assets/redirect-on-invalid-token.js

class TimestampEncoder {
  constructor() {
    this.base62Chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  }

  encodeBase62(num) {
    let encoded = '';
    while (num) {
      encoded = this.base62Chars[num % 62] + encoded;
      num = Math.floor(num / 62);
    }
    return encoded;
  }

  decodeBase62(str) {
    let decoded = 0;
    if (!str || typeof str !== 'string') return decoded;
    for (let i = 0; i < str.length; i++) {
      decoded = decoded * 62 + this.base62Chars.indexOf(str[i]);
    }
    return decoded;
  }

  validate(str) {
    const now = Date.now();
    const decoded = this.decodeBase62(str);
    const twentyFourHours = 24 * 60 * 60 * 1000;

    return ((now - twentyFourHours) < decoded) && ((now + twentyFourHours) > decoded);
  }
}

const encoder = new TimestampEncoder();

document.querySelector('#input').addEventListener('focus', (e) => {
  document.querySelector('.alert').classList.add('invisible');
});

document.querySelector('#input').addEventListener('input', (e) => {
  e.target.checkValidity();
  const url = e.target.value.split('?')[0];

  if (e.target.checkValidity() && url.trim().length > 0) {
    const token = encoder.encodeBase62(Date.now());
    const output = `${url}?token=${token}`;
    document.querySelector('#output').value = output;
  } else {
    document.querySelector('#output').value = 'Please enter a valid URL.';
  }
});

document.querySelector('#copy').addEventListener('click', (e) => {
  const output = document.querySelector('#output');
  if (output.value === 'Please enter a valid URL.' || output.value === '') return;

  output.select();
  output.setSelectionRange(0, 99999);
  document.execCommand('copy');
  document.querySelector('.alert').classList.remove('invisible');
});