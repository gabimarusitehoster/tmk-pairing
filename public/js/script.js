document.getElementById('pairForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const phone = document.getElementById('phone').value;
  const res = await fetch('/pair', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  });
  const data = await res.json();
  document.getElementById('codeResult').innerText = `Your 8-digit Pairing Code: ${data.code}`;
}); 
