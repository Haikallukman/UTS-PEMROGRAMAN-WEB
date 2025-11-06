// js/dashboard.js
window.addEventListener("DOMContentLoaded", function () {
  const u = JSON.parse(localStorage.getItem("loggedUser") || "null");
  if (!u) { window.location.href = "login.html"; return; }
  const nama = u.nama || u.name || "Pengguna";
  document.getElementById("userName").textContent = nama;
  function getGreeting(){ const hr = new Date().getHours(); if (hr<11) return "Selamat Pagi"; if(hr<15) return "Selamat Siang"; if(hr<18) return "Selamat Sore"; return "Selamat Malam"; }
  document.getElementById("greeting").textContent = `${getGreeting()}, ${nama}`;
  const totalBuku = (window.dataKatalogBuku || []).length;
  const totalStok = (window.dataKatalogBuku || []).reduce((s,b)=>s+(b.stok||0),0);
  const totalOrders = window.dataTracking ? Object.keys(window.dataTracking).length : (window.dataOrders?window.dataOrders.length:0);
  const sg = document.getElementById("summaryGrid");
  sg.innerHTML = `
    <div class="card fade-in"><h4>Total Buku</h4><div style="font-size:22px;font-weight:700">${totalBuku}</div><div class="small-muted">Judul unik tersedia</div></div>
    <div class="card fade-in"><h4>Total Stok</h4><div style="font-size:22px;font-weight:700">${totalStok}</div><div class="small-muted">Keseluruhan stok</div></div>
    <div class="card fade-in"><h4>Pesanan</h4><div style="font-size:22px;font-weight:700">${totalOrders}</div><div class="small-muted">Pesanan tersimpan</div></div>
  `;
  const btnStok = document.getElementById("btnToStok");
  if(btnStok) btnStok.addEventListener("click", ()=> window.location.href='stok.html');
  const btnLogout = document.getElementById("btnLogout");
  if(btnLogout) btnLogout.addEventListener("click", ()=>{ localStorage.removeItem('loggedUser'); window.location.href='login.html'; });
  console.log("Dashboard loaded");
});