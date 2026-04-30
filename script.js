// Setup tanggal minimal
document.addEventListener('DOMContentLoaded', function() {
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
});

// Select Route
function selectRoute(from, to) {
  document.getElementById('route-from').value = from;
  document.getElementById('route-to').value = to;
  scrollToBooking();
  showToast(`✅ Rute dipilih: ${from} → ${to}`, 'success');
}

// Scroll to Booking
function scrollToBooking() {
  document.querySelector('.booking-section').scrollIntoView({ behavior: 'smooth' });
}

// Submit Booking
function submitBooking() {
  const passengerName = document.getElementById('passengerName').value.trim();
  const from = document.getElementById('route-from').value;
  const to = document.getElementById('route-to').value;
  const dateInput = document.getElementById('date').value;
  const passengers = document.getElementById('passengers').value;

  // Validasi
  if (!passengerName) {
    return showToast('⚠️ Mohon masukkan nama penumpang', 'error');
  }
  
  if (!from) {
    return showToast('⚠️ Mohon pilih kota asal', 'error');
  }
  
  if (!to) {
    return showToast('⚠️ Mohon pilih kota tujuan', 'error');
  }
  
  if (!dateInput) {
    return showToast('⚠️ Mohon pilih tanggal keberangkatan', 'error');
  }
  
  if (from === to) {
    return showToast('⚠️ Kota asal dan tujuan tidak boleh sama', 'error');
  }

  // Format tanggal
  const date = new Date(dateInput).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const ADMIN_PHONE = "6281220120067";
  const message = `*🚌 PEMESANAN TIKET TRAVEL*\n\n` +
    `👤 *Nama:* ${passengerName}\n` +
    `📆 *Tanggal:* ${date}\n` +
    `📍 *Rute:* ${from} → ${to}\n` +
    `👥 *Penumpang:* ${passengers}\n\n` +
    `Mohon konfirmasi ketersediaan kursi. Terima kasih!`;

  const encoded = encodeURIComponent(message);
  const isDesktop = window.innerWidth > 768 && !/Mobile|Android/i.test(navigator.userAgent);
  const url = isDesktop 
    ? `https://web.whatsapp.com/send?phone=${ADMIN_PHONE}&text=${encoded}`
    : `https://wa.me/${ADMIN_PHONE}?text=${encoded}`;

  const toast = showToast('📤 Memproses...', 'info', true);
  const win = window.open(url, '_blank');
  
  if (!win) {
    updateToast(toast, '❌ Pop-up diblokir!', 'error');
    return;
  }

  setTimeout(() => {
    updateToast(toast, '✅ Pesanan terkirim!', 'success');
  }, 2000);
}

// Toast Notification
function showToast(text, type = 'info', loading = false) {
  let toast = document.getElementById('toast');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }

  const icons = {
    success: 'fa-check-circle',
    error: 'fa-exclamation-triangle',
    warning: 'fa-bell',
    info: 'fa-spinner'
  };
  
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#0084ff'
  };

  toast.className = '';
  toast.innerHTML = `<i class="fa-solid ${icons[type]} ${loading ? 'fa-spin' : ''}"></i> <span>${text}</span>`;
  toast.style.background = colors[type];
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 400);
  }, type === 'success' ? 5000 : 4000);

  return toast;
}

function updateToast(toast, html, type) {
  if (toast && toast.parentNode) {
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-triangle', warning: 'fa-bell' };
    const colors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b' };
    toast.innerHTML = `<i class="fa-solid ${icons[type]}"></i> <span>${html}</span>`;
    toast.style.background = colors[type];
  }
}