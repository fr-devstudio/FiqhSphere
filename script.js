// FiqhSphere — interaction logic
(function(){
  'use strict';

  /* ===== View routing ===== */
  const navLinks = document.querySelectorAll('[data-nav]');
  const views = document.querySelectorAll('.view');
  function showView(id){
    views.forEach(v => v.classList.toggle('active', v.id === 'view-'+id));
    navLinks.forEach(l => l.classList.toggle('active', l.dataset.nav === id));
    window.scrollTo({top:0,behavior:'smooth'});
    document.getElementById('navMenu').classList.remove('open');
  }
  navLinks.forEach(l => l.addEventListener('click', e => {
    e.preventDefault();
    showView(l.dataset.nav);
  }));
  document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', e => {
    showView(b.dataset.go);
  }));

  /* ===== Mobile nav ===== */
  document.getElementById('navToggle').addEventListener('click', () => {
    document.getElementById('navMenu').classList.toggle('open');
  });

  /* ===== YouTube facade — show thumbnail, load iframe on click ===== */
  document.querySelectorAll('.yt-facade').forEach(el => {
    el.addEventListener('click', () => {
      const vid = el.dataset.vid;
      el.innerHTML = '<iframe src="https://www.youtube.com/embed/'+vid+'?autoplay=1" allowfullscreen allow="autoplay"></iframe>';
      el.classList.remove('yt-facade');
    });
  });

  /* ===== Solat tabs ===== */
  const solatTabs = document.querySelectorAll('.solat-tab');
  const solatPanes = document.querySelectorAll('.solat-pane');
  solatTabs.forEach(t => t.addEventListener('click', () => {
    solatTabs.forEach(x => x.classList.remove('active'));
    solatPanes.forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    document.getElementById('pane-'+t.dataset.tab).classList.add('active');
  }));

  /* ===== Topic cards trigger Solat detail ===== */
  document.querySelectorAll('.topic').forEach(t => t.addEventListener('click', () => {
    if(t.classList.contains('topic-locked')) return;
    const id = t.dataset.topic;
    document.querySelectorAll('.topic').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    if(id === 'solat'){
      document.getElementById('solatDetail').scrollIntoView({behavior:'smooth', block:'start'});
    } else {
      // For non-solat topics, show a friendly note
      const detail = document.getElementById('solatDetail');
      const header = detail.querySelector('.solat-header h2');
      const tagEl = detail.querySelector('.solat-tag');
      const sub = detail.querySelector('.solat-header p');
      const labels = {
        zakat:{h:'Zakat',t:'Rukun Islam Ketiga',s:'Modul Zakat akan dimuatkan menerusi sub-tab di bawah. Buat masa ini, sila terokai modul Solat sebagai contoh kandungan penuh.'},
        puasa:{h:'Puasa',t:'Rukun Islam Keempat',s:'Modul Puasa Ramadan dan puasa-puasa sunat akan dilancarkan tidak lama lagi.'},
        haji:{h:'Haji & Umrah',t:'Rukun Islam Kelima',s:'Modul Haji & Umrah lengkap dengan manasik akan tersedia dalam fasa seterusnya.'}
      };
      const m = labels[id];
      if(m){
        header.textContent = m.h;
        tagEl.textContent = m.t;
        sub.textContent = m.s;
      }
      detail.scrollIntoView({behavior:'smooth', block:'start'});
    }
    // Reset to solat content if user clicks solat
    if(id === 'solat'){
      document.querySelector('.solat-header h2').textContent = 'Solat';
      document.querySelector('.solat-tag').textContent = 'Tiang Agama';
      document.querySelector('.solat-header p').textContent = 'Solat adalah ibadah utama yang menghubungkan hamba dengan Penciptanya. Pelajari setiap aspeknya secara berperingkat dan mendalam.';
    }
  }));

  /* ===== Rukun accordion ===== */
  document.querySelectorAll('.rukun-h').forEach(h => h.addEventListener('click', () => {
    h.parentElement.classList.toggle('open');
  }));

  /* ===== Quiz ===== */
  const QUIZ = [
    {q:'Berapakah jumlah rukun solat?', opts:['11','12','13','14'], a:2,
     e:'Rukun solat berjumlah 13 perkara, bermula dari niat sehingga tertib.'},
    {q:'Apakah rukun pertama dalam solat?', opts:['Takbiratul Ihram','Niat','Berdiri betul','Membaca Al-Fatihah'], a:1,
     e:'Niat adalah rukun pertama yang wajib hadir di dalam hati ketika memulakan solat.'},
    {q:'Solat fardhu yang mempunyai 4 rakaat ialah:', opts:['Subuh dan Maghrib','Zohor dan Asar','Maghrib sahaja','Subuh sahaja'], a:1,
     e:'Solat Zohor dan Asar masing-masing mempunyai 4 rakaat. Isyak juga 4 rakaat.'},
    {q:'Bilakah waktu solat Subuh tamat?', opts:['Sebelum matahari naik segalah','Selepas tergelincir matahari','Sebelum tengah malam','Apabila matahari mula terbit'], a:3,
     e:'Waktu Subuh berakhir apabila matahari mula terbit di ufuk timur.'},
    {q:'Antara berikut, manakah BUKAN syarat sah solat?', opts:['Suci dari hadas','Menutup aurat','Berniat puasa','Menghadap kiblat'], a:2,
     e:'Berniat puasa bukan syarat solat. Syarat sah solat termasuk suci dari hadas, menutup aurat dan menghadap kiblat.'},
    {q:'Perkara berikut membatalkan solat KECUALI:', opts:['Berkata-kata dengan sengaja','Makan dan minum','Bersin','Berhadas'], a:2,
     e:'Bersin tidak membatalkan solat. Perkara seperti berkata-kata, makan, minum dan berhadas akan membatalkan solat.'},
    {q:'Peristiwa Israk dan Mikraj berlaku pada tahun:', opts:['Tahun ke-5 kenabian','Tahun ke-10 kenabian','Tahun ke-11 kenabian','Tahun Hijrah'], a:1,
     e:'Israk dan Mikraj berlaku pada tahun ke-10 atau 11 kenabian, di mana solat 5 waktu difardhukan.'},
    {q:'Berapa rakaatkah solat Maghrib?', opts:['2 rakaat','3 rakaat','4 rakaat','5 rakaat'], a:1,
     e:'Solat Maghrib dilakukan sebanyak 3 rakaat, dengan duduk tahiyat awal selepas rakaat kedua.'},
    {q:'Hikmah utama solat dalam kehidupan ialah:', opts:['Menambah rezeki sahaja','Mencegah perbuatan keji dan mungkar','Mendapat pujian manusia','Sebagai senaman fizikal'], a:1,
     e:'Allah berfirman bahawa solat itu mencegah perbuatan keji dan mungkar (Al-Ankabut: 45).'},
    {q:'Apakah hukum meninggalkan solat fardhu dengan sengaja tanpa uzur?', opts:['Sunat','Harus','Makruh','Dosa besar'], a:3,
     e:'Meninggalkan solat fardhu dengan sengaja tanpa uzur syarie adalah dosa besar dalam Islam.'}
  ];
  let qIndex = 0, qScore = 0, qLocked = false;

  const elQNum = document.getElementById('qNum');
  const elQTitle = document.getElementById('qTitle');
  const elQText = document.getElementById('qText');
  const elQOpts = document.getElementById('qOpts');
  const elQFeedback = document.getElementById('qFeedback');
  const elQProgress = document.getElementById('qProgress');
  const elQScore = document.getElementById('qScore');
  const elQNext = document.getElementById('qNext');
  const elQuizStage = document.getElementById('quizStage');
  const elQuizResult = document.getElementById('quizResult');

  function renderQuestion(){
    qLocked = false;
    const item = QUIZ[qIndex];
    const total = QUIZ.length;
    elQNum.textContent = `Soalan ${String(qIndex+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;
    elQTitle.textContent = 'Topik Solat';
    elQText.textContent = item.q;
    elQOpts.innerHTML = '';
    item.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'q-opt';
      btn.innerHTML = `<span class="q-opt-letter">${String.fromCharCode(65+i)}</span><span class="q-opt-text">${opt}</span>`;
      btn.addEventListener('click', () => answer(i, btn));
      elQOpts.appendChild(btn);
    });
    elQFeedback.classList.remove('show','wrong');
    elQNext.style.display = 'none';
    elQProgress.style.width = ((qIndex)/total*100) + '%';
    elQScore.innerHTML = `Skor: <span class="gold">${qScore}</span> / ${total}`;
  }

  function answer(idx, btn){
    if(qLocked) return;
    qLocked = true;
    const item = QUIZ[qIndex];
    const opts = elQOpts.querySelectorAll('.q-opt');
    opts.forEach((o,i) => {
      o.classList.add('disabled');
      if(i === item.a) o.classList.add('correct');
      if(i === idx && idx !== item.a) o.classList.add('wrong');
    });
    const correct = idx === item.a;
    if(correct) qScore++;
    elQFeedback.classList.add('show');
    elQFeedback.classList.toggle('wrong', !correct);
    elQFeedback.innerHTML = `
      <div class="qf-h">${correct ? '✓ Tahniah, jawapan betul!' : '✗ Jawapan kurang tepat'}</div>
      <div class="qf-t">${item.e}</div>
    `;
    elQNext.style.display = 'inline-flex';
    elQNext.textContent = qIndex === QUIZ.length-1 ? 'Lihat Keputusan →' : 'Soalan Seterusnya →';
    elQProgress.style.width = ((qIndex+1)/QUIZ.length*100) + '%';
    elQScore.innerHTML = `Skor: <span class="gold">${qScore}</span> / ${QUIZ.length}`;
  }

  elQNext.addEventListener('click', () => {
    if(qIndex === QUIZ.length-1){ showResult(); return; }
    qIndex++;
    renderQuestion();
  });

  function showResult(){
    elQuizStage.style.display = 'none';
    elQuizResult.classList.add('show');
    const total = QUIZ.length;
    document.getElementById('qrScoreNum').textContent = qScore;
    document.getElementById('qrScoreOf').textContent = '/' + total;
    let msg = '';
    if(qScore === total) msg = 'Cemerlang! Anda menguasai topik Solat dengan sangat baik. Teruskan usaha!';
    else if(qScore >= 7) msg = 'Bagus sekali! Sedikit ulang kaji dan anda akan menjadi lebih mahir.';
    else if(qScore >= 5) msg = 'Anda boleh! Mari semak semula nota dan video pengajaran untuk memantapkan ilmu.';
    else msg = 'Jangan berputus asa. Pelajari semula modul Solat dan cuba lagi — anda pasti boleh!';
    document.getElementById('qrMsg').textContent = msg;
  }

  document.getElementById('qrRetry').addEventListener('click', () => {
    qIndex = 0; qScore = 0;
    elQuizResult.classList.remove('show');
    elQuizStage.style.display = 'block';
    renderQuestion();
  });

  renderQuestion();

  /* ===== Quiz topic picker ===== */
  const qtpSolat = document.getElementById('qtpSolat');
  if(qtpSolat){
    qtpSolat.addEventListener('click', () => {
      document.getElementById('quizPanel').scrollIntoView({behavior:'smooth', block:'start'});
    });
  }

  /* ===== Quiz platform external launchers ===== */
  document.querySelectorAll('.quiz-platform').forEach(p => p.addEventListener('click', () => {
    const url = p.dataset.url;
    if(url){ window.open(url, '_blank', 'noopener'); }
  }));

  /* ===== Scroll reveal ===== */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.12});
  document.querySelectorAll('.scroll-reveal').forEach(el => io.observe(el));

  /* ===== Live waktu solat indicator ===== */
  function updateNowWaktu(){
    const h = new Date().getHours();
    let active = 'subuh';
    if(h >= 5 && h < 13) active = 'subuh';
    if(h >= 13 && h < 16) active = 'zohor';
    if(h >= 16 && h < 19) active = 'asar';
    if(h >= 19 && h < 20) active = 'maghrib';
    if(h >= 20 || h < 5) active = 'isyak';
    document.querySelectorAll('.waktu').forEach(w => {
      w.classList.toggle('now', w.dataset.waktu === active);
    });
  }
  updateNowWaktu();
  setInterval(updateNowWaktu, 60000);
})();
