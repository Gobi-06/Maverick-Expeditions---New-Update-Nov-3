// Interface: cards, 3D ring, photo stack, reveals, forms. Independent of WebGL.
const ICON_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>';
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(pointer: fine)').matches;

/* ---------- Nav ---------- */
const nav = document.getElementById('nav');
const onScrollNav = () => nav.classList.toggle('solid', scrollY > innerHeight * 3.6 || scrollY > document.getElementById('fly').offsetHeight - innerHeight);
addEventListener('scroll', onScrollNav, { passive: true }); onScrollNav();

/* ---------- Trip chips ---------- */
const chips = document.getElementById('chips');
['Family', 'Students', 'Corporate', 'Honeymoon', 'Pilgrimage', 'Weekend'].forEach((t, i) => {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'chip'; b.textContent = t; b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
  b.addEventListener('click', () => { chips.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', 'false')); b.setAttribute('aria-pressed', 'true'); });
  chips.appendChild(b);
});
document.getElementById('finder').addEventListener('submit', (e) => {
  e.preventDefault();
  const type = chips.querySelector('[aria-pressed="true"]').textContent;
  document.getElementById('eType').value = type === 'Weekend' ? 'Weekend trip' : type;
  const dest = document.getElementById('fDest').value, when = document.getElementById('fWhen').value, size = document.getElementById('fSize').value;
  const sel = document.getElementById('eDest');
  if ([...sel.options].some(o => o.text === dest)) sel.value = dest;
  if (when) document.getElementById('eDate').value = when + '-01';
  const n = parseInt(size, 10); if (n) document.getElementById('eCount').value = n;
  document.getElementById('eMsg').value = 'Group size: ' + size + (when ? ', any dates in that month' : '');
  const planEl = document.getElementById('plan');
  if (window.lenis) window.lenis.scrollTo(planEl, { offset: -84, duration: 1.6 }); else planEl.scrollIntoView();
  setTimeout(() => document.getElementById('eName').focus({ preventScroll: true }), 1700);
});

/* ---------- Destination tilt cards ---------- */
const dests = [
  ['Ooty', 'Tamil Nadu', 'Hill station', 'ooty'],
  ['Munnar', 'Kerala', 'Tea country', 'munnar'],
  ['Alleppey', 'Kerala', 'Backwaters', 'alleppey'],
  ['Mysore', 'Karnataka', 'Heritage', 'mysore'],
  ['Goa', 'Baga Beach', 'Beaches', 'goa'],
  ['Jaipur', 'Rajasthan', 'Forts & palaces', 'jaipur'],
  ['Kullu Manali', 'Himachal', 'Mountains', 'manali'],
];
const dgrid = document.getElementById('dgrid');
const makeCard = ([n, r, tag, img], i) => {
  const a = document.createElement('a');
  a.href = '#plan'; a.className = 'tilt reveal'; a.style.transitionDelay = (i % 5) * 80 + 'ms';
  a.dataset.dest = n;
  a.innerHTML = `<div class="card"><div class="ph"><img src="img/${img}.webp" alt="${n}, ${r}" loading="lazy"></div><div class="glare"></div><span class="tag">${tag}</span><div class="meta"><div><h3>${n}</h3><p>${r}</p></div><span class="go">${ICON_ARROW}</span></div></div>`;
  return a;
};
dests.forEach((d, i) => dgrid.appendChild(makeCard(d, i)));
const abroad = [
  ['Andaman Islands', 'Havelock & Neil, India', 'Islands', 'andaman'],
  ['Sri Lanka', 'Nine Arch Bridge, Ella', 'International', 'srilanka'],
  ['Malaysia', 'Kuala Lumpur', 'International', 'malaysia'],
  ['Thailand', 'Phi Phi Islands, Krabi', 'International', 'thailand'],
  ['Singapore', 'Marina Bay', 'International', 'singapore'],
];
const igrid = document.getElementById('igrid');
abroad.forEach((d, i) => igrid.appendChild(makeCard(d, i)));
// clicking a destination card pre-fills the enquiry
document.addEventListener('click', (e) => {
  const card = e.target.closest('.tilt[data-dest]');
  if (!card) return;
  const sel = document.getElementById('eDest');
  const name = card.dataset.dest === 'Kullu Manali' ? 'Kullu Manali' : card.dataset.dest;
  if (sel && [...sel.options].some(o => o.text === name)) sel.value = name;
});
const cta = document.createElement('a');
cta.href = '#plan'; cta.className = 'tilt cta reveal';
cta.innerHTML = `<div class="card"><svg class="compass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg><div class="inner"><h3>Somewhere else in mind?</h3><p>Kodaikanal, Coorg, Kanyakumari, Mahabalipuram, Thekkady — tell us your dates, budget and group size.</p><b style="text-decoration:underline;text-underline-offset:4px">Design a custom tour</b></div></div>`;
dgrid.appendChild(cta);

if (fine && !reduce) {
  document.querySelectorAll('.tilt').forEach(el => {
    const card = el.querySelector('.card'), glare = el.querySelector('.glare'), img = el.querySelector('.ph img');
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.transition = 'transform .12s ease-out, box-shadow .5s';
      card.style.transform = `rotateY(${(px - .5) * 18}deg) rotateX(${(.5 - py) * 16}deg) translateZ(20px)`;
      if (img) img.style.transform = `scale(1.16) translate(${(.5 - px) * 14}px, ${(.5 - py) * 14}px)`;
      if (glare) glare.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,.75), rgba(255,255,255,0) 55%)`;
    });
    el.addEventListener('pointerleave', () => {
      card.style.transition = ''; card.style.transform = '';
      if (img) img.style.transform = '';
    });
  });
}

/* ---------- 3D ring carousel ---------- */
const tours = [
  ['01', 'Student tours', 'Educational trips for schools and colleges — permissions, escorts and night stays handled.', 'students'],
  ['02', 'Family tours', 'Unhurried itineraries for kids and elders, comfortable stays and short driving days.', 'family'],
  ['03', 'Corporate tours', 'Offsites, dealer meets and team outings — GST invoicing and a single point of contact.', 'corporate'],
  ['04', 'Honeymoon', 'Quiet resorts, private transfers and a relaxed route.', 'alleppey'],
  ['05', 'Pilgrimage', 'Temple circuits across the south — darshan timings, priest coordination, pure-veg meals.', 'madurai'],
  ['06', 'Industrial visits', 'Factory and plant visits with slots confirmed in advance and reports for departments.', 'toytrain'],
  ['07', 'Weekend trips', 'Leave Friday night from Tiruppur or Coimbatore, back by Sunday.', 'ooty'],
  ['08', 'Custom tours', 'Built around your dates, budget and group size.', 'munnar'],
];
const ring = document.getElementById('ring'), stage = document.getElementById('ringstage');
const N = tours.length, STEP = 360 / N;
const slots = tours.map(([num, t, , img]) => {
  const s = document.createElement('div');
  s.className = 'slot';
  s.innerHTML = `<img src="img/${img}.webp" alt="" loading="lazy" draggable="false"><div class="lbl"><small>${num}</small><b>${t}</b></div>`;
  ring.appendChild(s); return s;
});
let radius = 0;
const layoutRing = () => {
  const w = ring.offsetWidth;
  radius = Math.round((w / 2) / Math.tan(Math.PI / N) + (innerWidth < 700 ? 30 : 70));
  slots.forEach((s, i) => s.style.transform = `rotateY(${i * STEP}deg) translateZ(${radius}px)`);
};
layoutRing(); addEventListener('resize', layoutRing);

let angle = 0, target = 0, drag = null, lastActive = -1, auto = true;
const rTitle = document.getElementById('ringTitle'), rBody = document.getElementById('ringBody');
const setActive = (i) => { if (i === lastActive) return; lastActive = i; rTitle.textContent = tours[i][1]; rBody.textContent = tours[i][2]; };
const snap = () => { target = Math.round(target / STEP) * STEP; };
document.getElementById('prev').addEventListener('click', () => { auto = false; target = Math.round(target / STEP) * STEP + STEP; });
document.getElementById('next').addEventListener('click', () => { auto = false; target = Math.round(target / STEP) * STEP - STEP; });
stage.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, t: target }; auto = false; stage.setPointerCapture(e.pointerId); });
stage.addEventListener('pointermove', (e) => { if (drag) target = drag.t + (e.clientX - drag.x) * 0.35; });
const endDrag = () => { if (drag) { drag = null; snap(); } };
stage.addEventListener('pointerup', endDrag); stage.addEventListener('pointercancel', endDrag);

let ringVisible = false;
new IntersectionObserver(([e]) => { ringVisible = e.isIntersecting; }, { threshold: 0 }).observe(stage);
let autoTimer = 0;
function ringTick(t) {
  if (ringVisible) {
    if (auto && !reduce && t - autoTimer > 3200) { autoTimer = t; target -= STEP; }
    angle += (target - angle) * (reduce ? 1 : 0.08);
    ring.style.transform = `translateZ(${-radius}px) rotateX(-6deg) rotateY(${angle}deg)`;
    slots.forEach((s, i) => {
      let a = ((i * STEP + angle) % 360 + 360) % 360; if (a > 180) a -= 360;
      const f = Math.cos(a * Math.PI / 180);
      s.style.opacity = (0.25 + 0.75 * Math.max(0, f)).toFixed(3);
      s.style.filter = `brightness(${(0.45 + 0.55 * Math.max(0, f)).toFixed(3)})`;
    });
    const idx = ((Math.round(-angle / STEP) % N) + N) % N;
    setActive(idx);
  }
  requestAnimationFrame(ringTick);
}
requestAnimationFrame(ringTick);

/* ---------- Reasons ---------- */
const reasons = [
  ['Safe & reliable', 'Verified drivers, tracked vehicles and a coordinator with every group.'],
  ['Best price guarantee', 'Itemised quotes with no hidden extras. We match comparable written offers.'],
  ['Expert local guides', 'Guides who know the sites — and the best time to arrive.'],
  ['Comfortable stays', 'Hotels we have inspected, early room blocks and group-friendly food.'],
  ['24×7 support', 'One number that reaches a real person, from enquiry to drop-off.'],
];
const ol = document.getElementById('reasons');
reasons.forEach(([t, b], i) => {
  const li = document.createElement('li'); li.className = 'reveal'; li.style.transitionDelay = i * 70 + 'ms';
  li.innerHTML = `<span class="n">0${i + 1}</span><div><h3>${t}</h3><p>${b}</p></div>`;
  ol.appendChild(li);
});

/* ---------- Floating photo stack ---------- */
const stack = document.getElementById('stack'), sw = document.getElementById('stackwrap');
let mx = 0, my = 0;
if (fine && !reduce) sw.addEventListener('pointermove', (e) => { const r = sw.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - .5; my = (e.clientY - r.top) / r.height - .5; });
sw.addEventListener('pointerleave', () => { mx = 0; my = 0; });
function stackTick() {
  const r = sw.getBoundingClientRect();
  if (r.bottom > 0 && r.top < innerHeight && !reduce) {
    const p = (r.top + r.height / 2) / innerHeight - .5; // -0.5..0.5
    stack.style.transform = `rotateX(${(p * 18 - my * 10).toFixed(2)}deg) rotateY(${(-14 + mx * 18).toFixed(2)}deg)`;
  }
  requestAnimationFrame(stackTick);
}
requestAnimationFrame(stackTick);

/* ---------- Reveal on scroll ---------- */
const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* ---------- Forms ---------- */
const WA_NUMBER = '918110849375';
const form = document.getElementById('enquiry');
const $ = (id) => document.getElementById(id);
function setErr(input, errEl, msg) {
  input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  errEl.textContent = msg || '';
}
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const v = (id) => $(id).value.trim();
  const name = v('eName'), phone = v('ePhone');
  const digits = phone.replace(/\D/g, '');
  let ok = true;
  if (name.length < 2) { setErr($('eName'), $('eNameErr'), 'Please enter your name.'); ok = false; } else setErr($('eName'), $('eNameErr'));
  if (digits.length < 10 || digits.length > 13) { setErr($('ePhone'), $('ePhoneErr'), 'Please enter a valid phone number.'); ok = false; } else setErr($('ePhone'), $('ePhoneErr'));
  if (!ok) { (name.length < 2 ? $('eName') : $('ePhone')).focus(); return; }

  const date = v('eDate') ? new Date(v('eDate') + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Flexible';
  const lines = [
    '*New trip enquiry — Maverick Expeditions website*',
    '',
    `*Name:* ${name}`,
    `*Phone:* ${phone}`,
    `*Destination:* ${v('eDest')}`,
    `*Trip type:* ${v('eType')}`,
    `*Travel date:* ${date}`,
    `*Travellers:* ${v('eCount') || 'Not specified'}`,
  ];
  if (v('eMsg')) lines.push(`*Details:* ${v('eMsg')}`);
  lines.push('', 'Please send me a free itinerary and quote.');
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;

  // Open WhatsApp straight away (app on phones, WhatsApp Web on computers)
  let opened = null;
  try { opened = window.open(url, '_blank'); if (opened) opened.opener = null; } catch (_) {}
  const done = $('done');
  done.innerHTML = `<b>Thanks, ${name.split(' ')[0]}!</b> ${opened ? 'WhatsApp has opened with your enquiry — tap <b>Send</b> to reach us.' : 'Tap the button to open WhatsApp with your enquiry, then tap <b>Send</b>.'}<br><a class="wa-btn" href="${url}" target="_blank" rel="noopener">Open WhatsApp</a><br><span style="font-size:13px">Or call +91 81108 49375 · +91 73395 76886</span>`;
  done.classList.add('show');
});
document.getElementById('news').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('newsDone').textContent = 'Thanks — the live site will add you to the monthly offers list.';
});

/* ---------- Policies & FAQ tabs ---------- */
const tabs = [...document.querySelectorAll('.tab[role="tab"]')];
function selectTab(name, focus) {
  tabs.forEach(t => {
    const on = t.dataset.tab === name;
    t.setAttribute('aria-selected', on ? 'true' : 'false');
    t.tabIndex = on ? 0 : -1;
    document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    if (on && focus) t.focus();
  });
}
tabs.forEach((t, i) => {
  t.addEventListener('click', () => selectTab(t.dataset.tab));
  t.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    selectTab(n.dataset.tab, true);
  });
});
// links elsewhere (footer, FAQ) that open a specific tab
document.querySelectorAll('a[data-tab]').forEach(a => a.addEventListener('click', () => selectTab(a.dataset.tab)));
// deep links: #privacy, #cancellation, #faq
const hashTab = { '#privacy': 'privacy', '#cancellation': 'terms', '#faq': 'faq' }[location.hash];
if (hashTab) { selectTab(hashTab); setTimeout(() => document.getElementById('policies').scrollIntoView(), 300); }
