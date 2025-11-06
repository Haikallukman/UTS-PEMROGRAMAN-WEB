// js/checkout.js
(function(){
  const productListEl = document.getElementById('productList');
  const orderSummaryEl = document.getElementById('orderSummary');
  const custName = document.getElementById('custName');
  const custPhone = document.getElementById('custPhone');
  const custAddress = document.getElementById('custAddress');
  const payMethod = document.getElementById('payMethod');

  let cart = JSON.parse(localStorage.getItem('cart') || '[]');

  function parseHarga(str){ return Number(String(str).replace(/[^\d]/g,'')) || 0; }

  function renderProducts(){
    productListEl.innerHTML = '';
    (window.dataKatalogBuku || []).forEach(b=>{
      const div = document.createElement('div');
      div.className = 'book card';
      const image = b.cover || '';
      div.innerHTML = `<img src="${image}" alt="${b.namaBarang}" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=&quot;http://www.w3.org/2000/svg&quot; width=&quot;400&quot; height=&quot;240&quot;><rect width=&quot;100%&quot; height=&quot;100%&quot; fill=&quot;%23071229&quot;/><text x=&quot;50%&quot; y=&quot;50%&quot; fill=&quot;%238fb4ff&quot; font-size=&quot;18&quot; font-family=&quot;Arial&quot; dominant-baseline=&quot;middle&quot; text-anchor=&quot;middle&quot;>No Image</text></svg>'"> 
        <div class="book-title">${b.namaBarang}</div>
        <div class="small-muted">${b.jenisBarang} · Edisi ${b.edisi}</div>
        <div class="small-muted">Harga: ${b.harga} · Stok: ${b.stok}</div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <input type="number" min="1" max="${Math.max(1,b.stok)}" value="1" style="width:100px" id="qty-${b.kodeBarang}">
          <button class="btn" onclick="addToCart('${b.kodeBarang}')">Tambah</button>
        </div>`;
      productListEl.appendChild(div);
    });
  }

  window.addToCart = function(kodeBarang){
    const qty = Number(document.getElementById(`qty-${kodeBarang}`).value) || 1;
    const book = (window.dataKatalogBuku || []).find(b=>b.kodeBarang===kodeBarang);
    if(!book) return alert('Buku tidak ditemukan');
    if(qty > book.stok) return alert('Qty melebihi stok');
    const existing = cart.find(c=>c.kodeBarang===kodeBarang);
    if(existing) existing.qty += qty; else cart.push({kodeBarang, qty});
    localStorage.setItem('cart', JSON.stringify(cart));
    renderSummary();
    alert('Item ditambahkan ke keranjang (simulasi)');
  };

  function renderSummary(){
    if(cart.length===0){ orderSummaryEl.textContent = 'Belum ada item.'; return; }
    const rows = cart.map(c=>{
      const b = (window.dataKatalogBuku || []).find(x=>x.kodeBarang===c.kodeBarang) || {namaBarang:'Unknown',harga:'Rp 0'};
      const hargaNum = parseHarga(b.harga);
      return `${b.namaBarang} — ${c.qty} × ${b.harga} = Rp ${(hargaNum * c.qty).toLocaleString()}`;
    }).join('\n');
    const total = cart.reduce((s,c)=>{ const b = (window.dataKatalogBuku || []).find(x=>x.kodeBarang===c.kodeBarang) || {harga:'Rp 0'}; return s + parseHarga(b.harga) * c.qty; },0);
    orderSummaryEl.textContent = rows + `\n\nTotal: Rp ${total.toLocaleString()}`;
  }

  document.getElementById('btnPlace').addEventListener('click', ()=>{
    if(cart.length===0) return alert('Keranjang kosong');
    if(!custName.value.trim() || !custPhone.value.trim() || !custAddress.value.trim()) return alert('Isi data pemesan lengkap');
    const orderId = `O${Math.floor(Math.random()*9000)+1000}`;
    const doNumber = `DO-${new Date().getFullYear()}${String(Math.floor(Math.random()*900)+100)}`;
    const total = cart.reduce((s,c)=> { const b = (window.dataKatalogBuku || []).find(x=>x.kodeBarang===c.kodeBarang)||{harga:'Rp 0'}; return s + parseHarga(b.harga) * c.qty; },0);
    const order = { doNumber, orderId, name: custName.value, expedition: "JNE Regular", shipDate: new Date().toISOString().slice(0,10), packageType: "Reguler", total, statusIndex: 1, items: cart.map(c=> ({kodeBarang:c.kodeBarang, qty:c.qty})) };
    window.dataOrders = window.dataOrders || [];
    window.dataOrders.push(order);
    // update dataTracking for quick lookup
    window.dataTracking = window.dataTracking || {};
    window.dataTracking[doNumber] = { nomorDO: doNumber, nama: custName.value, status: "Diproses", ekspedisi: order.expedition, tanggalKirim: order.shipDate, paket: order.packageType, total: `Rp ${total.toLocaleString()}`, perjalanan: [] };
    // reduce stok simulasi
    cart.forEach(c=>{ const b = (window.dataKatalogBuku || []).find(x=>x.kodeBarang===c.kodeBarang); if(b) b.stok = Math.max(0, b.stok - c.qty); });
    localStorage.removeItem('cart'); cart = []; renderProducts(); renderSummary();
    alert(`Pesanan dibuat. DO Number: ${doNumber}\nTotal: Rp ${total.toLocaleString()}`);
  });

  document.getElementById('btnClearCart').addEventListener('click', ()=>{ if(!confirm('Kosongkan keranjang?')) return; cart = []; localStorage.removeItem('cart'); renderSummary(); });

  renderProducts();
  renderSummary();
})();