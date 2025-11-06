// js/stok.js
(function(){
  const catalogGrid = document.getElementById('catalogGrid');
  const form = {
    kodeBarang: document.getElementById('kodeBarang'),
    namaBarang: document.getElementById('namaBarang'),
    jenisBarang: document.getElementById('jenisBarang'),
    edisi: document.getElementById('edisi'),
    stok: document.getElementById('stok'),
    harga: document.getElementById('harga'),
    cover: document.getElementById('cover')
  };

  function placeholderDataUrl(title){
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240"><rect width="100%" height="100%" fill="#071029"/><text x="50%" y="50%" fill="#8fb4ff" font-size="20" font-family="Arial" dominant-baseline="middle" text-anchor="middle">${title}</text></svg>`);
  }

  function renderCatalog(){
    catalogGrid.innerHTML = '';
    (window.dataKatalogBuku || []).forEach(b=>{
      const el = document.createElement('div');
      el.className = 'book card';
      const image = b.cover || placeholderDataUrl(b.namaBarang);
      el.innerHTML = `
        <img src="${image}" alt="${b.namaBarang}" onerror="this.src='${placeholderDataUrl(b.namaBarang)}'">
        <div class="book-title">${b.namaBarang}</div>
        <div class="small-muted">${b.jenisBarang} · Edisi ${b.edisi}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
          <div><div class="small-muted">${b.harga}</div><div class="small-muted">Stok: ${b.stok}</div></div>
          <div style="display:flex;flex-direction:column;gap:8px">
            <button class="btn" onclick="editBook('${b.kodeBarang}')">Edit</button>
            <button class="btn secondary" onclick="deleteBook('${b.kodeBarang}')">Hapus</button>
          </div>
        </div>
      `;
      catalogGrid.appendChild(el);
    });
  }

  window.editBook = function(kodeBarang){
    const bk = (window.dataKatalogBuku || []).find(b=>b.kodeBarang===kodeBarang);
    if(!bk) return;
    form.kodeBarang.value = bk.kodeBarang || '';
    form.namaBarang.value = bk.namaBarang || '';
    form.jenisBarang.value = bk.jenisBarang || '';
    form.edisi.value = bk.edisi || '';
    form.stok.value = bk.stok || 0;
    form.harga.value = (bk.harga||'').replace(/[^\d]/g,'');
    form.cover.value = bk.cover || '';
  };

  window.deleteBook = function(kodeBarang){
    if(!confirm('Hapus buku ini?')) return;
    const idx = (window.dataKatalogBuku || []).findIndex(b=>b.kodeBarang===kodeBarang);
    if(idx>=0){ window.dataKatalogBuku.splice(idx,1); renderCatalog(); alert('Buku dihapus (simulasi)'); }
  };

  document.getElementById('btnAdd').addEventListener('click', ()=>{
    const kodeBarang = form.kodeBarang.value.trim() || `B${String(Math.floor(Math.random()*900)+100)}`;
    const namaBarang = form.namaBarang.value.trim();
    const jenisBarang = form.jenisBarang.value.trim();
    const edisi = form.edisi.value.trim();
    const harga = Number(form.harga.value) || 0;
    const stok = Number(form.stok.value) || 0;
    const cover = form.cover.value.trim();
    if(!namaBarang){ alert('Nama buku wajib diisi'); return; }

    const existing = (window.dataKatalogBuku || []).find(b=>b.kodeBarang===kodeBarang);
    if(existing){
      existing.namaBarang = namaBarang; existing.jenisBarang = jenisBarang; existing.edisi = edisi;
      existing.harga = `Rp ${harga.toLocaleString()}`; existing.stok = stok; existing.cover = cover;
      alert('Data buku diperbarui.');
    }else{
      window.dataKatalogBuku.push({kodeBarang,namaBarang,jenisBarang,edisi,stok,harga:`Rp ${harga.toLocaleString()}`,cover});
      alert('Buku ditambahkan.');
    }
    document.getElementById('stokForm').reset();
    renderCatalog();
  });

  document.getElementById('btnClear').addEventListener('click', ()=> document.getElementById('stokForm').reset());

  renderCatalog();
})();