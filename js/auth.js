// js/auth.js
(function(){
  const btnLogin = document.getElementById('btnLogin');
  const btnForgot = document.getElementById('btnForgot');
  const btnRegister = document.getElementById('btnRegister');
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');

  function showModal(html){
    modalContent.innerHTML = html;
    modal.classList.add('active');
    modal.addEventListener('click', (e)=>{
      if(e.target === modal) modal.classList.remove('active');
    });
  }

  btnForgot.addEventListener('click', ()=>{
    showModal(`<h3>Lupa Password</h3>
      <p class="small-muted">Masukkan email untuk reset (simulasi)</p>
      <input id="fpEmail" class="input" placeholder="email@domain.com">
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end"><button class="btn" id="fpSend">Kirim</button><button class="btn secondary" onclick="document.getElementById('modal').classList.remove('active')">Tutup</button></div>`);
    document.getElementById('fpSend').addEventListener('click', ()=>{
      const e = document.getElementById('fpEmail').value.trim();
      alert(`Jika email ${e} terdaftar, tautan reset akan dikirim (simulasi).`);
      modal.classList.remove('active');
    });
  });

  btnRegister.addEventListener('click', ()=>{
    showModal(`<h3>Daftar Akun</h3>
      <p class="small-muted">Membuat akun baru (simulasi)</p>
      <div style="display:flex;gap:8px;flex-direction:column">
        <input id="rEmail" class="input" placeholder="email">
        <input id="rName" class="input" placeholder="Nama">
        <input id="rPass" class="input" type="password" placeholder="Password">
      </div>
      <div style="margin-top:12px;display:flex;gap:8px;justify-content:flex-end"><button class="btn" id="rCreate">Daftar</button><button class="btn secondary" onclick="document.getElementById('modal').classList.remove('active')">Batal</button></div>`);
    document.getElementById('rCreate').addEventListener('click', ()=>{
      const email=document.getElementById('rEmail').value.trim();
      const name=document.getElementById('rName').value.trim();
      const pass=document.getElementById('rPass').value.trim();
      if(!email||!name||!pass){ alert('Isi semua form'); return; }
      if(!window.dataPengguna) window.dataPengguna = [];
      if(window.dataPengguna.some(u=>u.email===email)){ alert('Email sudah terdaftar'); return; }
      const newid = window.dataPengguna.length ? Math.max(...window.dataPengguna.map(u=>u.id))+1 : 1;
      window.dataPengguna.push({id:newid,nama:name,email,password:pass,role:"User"});
      alert('Akun dibuat (simulasi). Silakan login.');
      modal.classList.remove('active');
    });
  });

  btnLogin.addEventListener('click', ()=>{
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    if(!window.dataPengguna) window.dataPengguna = [];
    const user = window.dataPengguna.find(u=>u.email===email && u.password===password);
    if(!user){ alert('email/password yang anda masukkan salah'); return; }
    localStorage.setItem('loggedUser', JSON.stringify({id:user.id,email:user.email,nama:user.nama}));
    window.location.href = 'dashboard.html';
  });
})();