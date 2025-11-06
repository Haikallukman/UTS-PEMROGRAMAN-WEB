// js/tracking.js
(function(){
  const btnCari = document.getElementById('btnCari');
  const doInput = document.getElementById('doInput');
  const resultArea = document.getElementById('resultArea');

  function renderResult(order){
    resultArea.innerHTML = '';
    if(!order){
      resultArea.innerHTML = `<div class="card"><p class="small-muted">Nomor DO tidak ditemukan.</p></div>`;
      return;
    }
    const statuses = ['Diproses','Dikirim','Dalam Perjalanan','Tiba di Tujuan','Selesai'];
    const statusIndex = statuses.indexOf(order.status);
    const progressPercent = Math.min(100, ((statusIndex+1)/statuses.length) * 100) || 0;
    let perjalananHTML = '';
    if(order.perjalanan && order.perjalanan.length){
      perjalananHTML = `<h4>Riwayat Pengiriman</h4><ul class="small-muted">${order.perjalanan.map(p=>`<li>${p.waktu} — ${p.keterangan}</li>`).join('')}</ul>`;
    }
    resultArea.innerHTML = `
      <div class="card fade-in">
        <h3>Hasil Pencarian</h3>
        <div class="small-muted">Nama Pemesan: <strong>${order.nama}</strong></div>
        <div class="small-muted">Nomor DO: <strong>${order.nomorDO}</strong></div>
        <div style="margin-top:8px">
          <div class="small-muted">Status Pengiriman: <strong>${order.status}</strong></div>
          <div style="margin-top:8px" class="progress"><span style="width:${progressPercent}%"></span></div>
        </div>
        <div style="margin-top:12px" class="small-muted">
          <div>Ekspedisi: ${order.ekspedisi}</div>
          <div>Tanggal Kirim: ${order.tanggalKirim}</div>
          <div>Jenis Paket: ${order.paket}</div>
          <div>Total Bayar: ${order.total}</div>
        </div>
        <div style="margin-top:12px">${perjalananHTML}</div>
      </div>
    `;
  }

  btnCari.addEventListener('click', ()=>{
    const q = doInput.value.trim();
    if(!q) return alert('Masukkan nomor DO');
    const order = (window.dataTracking || {})[q];
    renderResult(order);
  });

  doInput.addEventListener('keypress', (e)=>{ if(e.key==='Enter') btnCari.click(); });
})();