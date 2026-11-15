/* seifshams.com — portfolio */

// ── edit here ──────────────────────────────
const IG = 'https://www.instagram.com/seif.shamss/';
const SERIES = [
  { ar: 'ما ورا فيزيا', reel: 'turbo',
    line: { ar: 'الفيزيا اللي ورا العربية: ليه التيربو بيصدّي، وليه الصوت بيتغير.', en: 'The physics behind cars: why a turbo rusts, why the sound changes.' },
    tags: { ar: ['تيربو', 'صوت العادم', 'تيوننج'], en: ['Turbo', 'Exhaust sound', 'Tuning'] },
    say: { ar: 'دي الفيزيا اللي ورا كل حاجة!', en: 'The physics behind it all!' } },
  { ar: 'حكاوي عربيات', reel: 'bmw',
    line: { ar: 'حكايات العربيات والبراندات: BMW، بورشه، وأساطير الشارع.', en: 'Stories of cars and brands: BMW, Porsche, street legends.' },
    tags: { ar: ['تاريخ', 'براندات', 'أساطير'], en: ['History', 'Brands', 'Legends'] },
    say: { ar: 'كل عربية وراها حكاية', en: 'Every car has a story' } },
  { ar: 'خلي بالك', reel: 'temp',
    line: { ar: 'غلطات بنعملها في عربياتنا وبتكلفنا فلوس.', en: 'Mistakes drivers make that cost them money.' },
    tags: { ar: ['صيانة', 'أمان', 'توفير'], en: ['Maintenance', 'Safety', 'Saving money'] },
    say: { ar: 'خلي بالك من دي!', en: 'Watch out for this one!' } },
];
const STEP_SAY = { ar: ['ابعتلي فكرتك', 'هكتبها بأسلوبي', 'مستني موافقتك', 'ونزلت!'], en: ['Send me your idea', 'I’ll write it my way', 'Waiting for your OK', 'And it’s live!'] };
const REELS = [
  // url: paste the reel link (instagram.com/reel/...) — empty = opens the profile
  { id: 'turbo',   series: 0, url: '', ar: 'ليه التيربو نصه مصدي… ونصه بيلمع؟', en: 'Why is the turbo half rusty, half shiny?' },
  { id: 'bmw',     series: 1, url: '', ar: 'مين قالك إن أقوى BMW هي الـM؟',     en: 'Who said the M is the strongest BMW?' },
  { id: 'yhx',     series: 0, url: '', ar: 'نفس الموتور… وأربع أصوات',           en: 'Same engine, four sounds' },
  { id: 'temp',    series: 2, url: '', ar: 'عداد الحرارة بيكدب عليك',            en: 'Your temperature gauge is lying' },
  { id: 'porsche', series: 1, url: '', ar: 'قبل تسلا… بورشه وريتنا عربية بتطير', en: 'Before Tesla, Porsche showed a flying car' },
];
// ───────────────────────────────────────────

const EN = {
  nav_series: 'Series', nav_work: 'Work', nav_partner: 'Work with me',
  bubble_hi: 'Hey!',
  cover_line: 'Car content in Egyptian Arabic that people watch to the end.',
  cover_sub: 'Reels, YouTube episodes and brand partnerships. Got a car or a product? Let me tell its story.',
  cta_work: 'Work with me', cta_see: 'See the work',
  hello_hi: 'Hi, I’m Seif',
  hello_p: 'A robotics engineer by trade who has loved cars since I was a kid. I write every video myself, check every fact, and tell it like I’m talking to a friend. And Shams, the robot next to me, lives the story with me.',
  xp_1: 'Car content creator · 3 reel series',
  xp_2: 'YouTube «Al-Donya Men Gher» · weekly episode',
  xp_3: 'Software, robotics & AI engineer',
  where_h: 'Where I publish',
  series_sub: '3 series, each with its own audience. Your brand can join any of them.',
  reels_sub: 'Some of the work. Tap any one to open it on Instagram.',
  yt_p: '8 to 12 minute episodes about one car: how it was made, who is behind the name, and why people still love it. A relaxed space for a sponsor, said in my voice.',
  yt_cta: 'Watch the episodes',
  partner_sub: 'Your product inside the story, not an ad at the end.',
  o1_h: 'A reel in a series', o1_p: 'A full reel in «Ma Wara Fizya», «Hakawi Arabiyat» or «Khally Balak», with your product as part of the explanation.',
  o2_h: 'YouTube sponsor', o2_p: 'A segment inside an «Al-Donya Men Gher» episode, written and voiced by me.',
  o3_h: 'Car or product launch', o3_p: 'What’s new, how it works, why it matters. In Arabic, in a way people get.',
  steps_h: 'How we work',
  st_1: 'Send me the brief', st_2: 'I write it in my style', st_3: 'You approve it', st_4: 'It goes live on 4 platforms',
  f_name: 'Your name', f_brand: 'Brand / company', f_email: 'Email', f_msg: 'What should we make together?', f_send: 'Send',
  direct_h: 'Or reach me directly', wa: 'WhatsApp', dm: 'DM on Instagram', cv: 'Engineering CV',
  watch: 'Watch on Instagram',
};
const AR_WATCH = 'شوفه على إنستجرام';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let lang = 'ar';

// Shams flipbook: each pose is one image (5x5 frames). Images always show, even where
// phones block video (Low Power Mode, in-app browsers). Until a pose has loaded he stands.
const FRAMES = 25, FPS = 12.5;
const sheets = {};
const sheet = name => sheets[name] || (sheets[name] = new Promise(res => {
  const img = new Image();
  img.onload = () => res(true);
  img.onerror = () => res(false);
  img.src = `assets/sp_${name}.webp`;
}));

class Sprite {
  constructor(el) { this.el = el; this.want = 'stand'; this.raf = 0; }
  stand() {
    cancelAnimationFrame(this.raf); this.want = 'stand';
    Object.assign(this.el.style, { backgroundImage: 'url("assets/k_stand.webp")', backgroundSize: '100% 100%', backgroundPosition: '0 0' });
  }
  play(name, { loop = true, onend } = {}) {
    if (reduced) { this.stand(); onend && setTimeout(onend, 1200); return; }
    this.want = name;
    sheet(name).then(ok => {
      if (this.want !== name) return;
      if (!ok) { this.stand(); onend && onend(); return; }
      cancelAnimationFrame(this.raf);
      Object.assign(this.el.style, { backgroundImage: `url("assets/sp_${name}.webp")`, backgroundSize: '500% 500%' });
      const t0 = performance.now();
      const tick = now => {
        const f = Math.floor((now - t0) / (1000 / FPS));
        if (!loop && f >= FRAMES) { this.stand(); onend && onend(); return; }
        const i = f % FRAMES;
        this.el.style.backgroundPosition = `${(i % 5) * 25}% ${Math.floor(i / 5) * 25}%`;
        this.raf = requestAnimationFrame(tick);
      };
      this.raf = requestAnimationFrame(tick);
    });
  }
}
const REACTS = ['wave', 'shocked', 'proud', 'explain', 'thumbs', 'talk'];
const preloadReacts = () => REACTS.reduce((p, r) => p.then(() => sheet(r)), sheet('walk'));


const lazyVideo = id => `
  <video data-lazy muted loop playsinline preload="none" poster="assets/r_${id}.webp">
    <source data-src="assets/r_${id}.mp4" type="video/mp4">
  </video>`;
const reelUrl = id => (REELS.find(r => r.id === id) || {}).url || IG;

function build() {
  $('#seriesTrack').innerHTML = SERIES.map((s, i) => `
    <div class="stop"><div class="board">
      <div class="board__reel">${lazyVideo(s.reel)}</div>
      <div class="board__body">
        <div class="board__head"><img src="assets/emblem.webp" alt=""><span class="board__n">SERIES 0${i + 1}</span></div>
        <h3>${s.ar}</h3>
        <p data-k="line"></p>
        <div class="board__tags" data-k="tags"></div>
        <a class="board__go" href="${reelUrl(s.reel)}" target="_blank" rel="noopener" data-k="watch"></a>
      </div>
    </div></div>`).join('');
  $$('#stepsTrack .sign').forEach(sign => { const stop = document.createElement('div'); stop.className = 'stop'; sign.replaceWith(stop); stop.append(sign); });

  $('#phones').innerHTML = REELS.map(r => `
    <a class="phone" href="${r.url || IG}" target="_blank" rel="noopener" data-reel="${r.id}">
      <div class="phone__body"><div class="phone__screen">${lazyVideo(r.id)}</div></div>
      <div class="phone__cap"><b></b><span class="series"></span></div>
    </a>`).join('');
}

function fillText() {
  $$('#seriesTrack .board').forEach((b, i) => {
    const s = SERIES[i];
    $('[data-k="line"]', b).textContent = s.line[lang];
    $('[data-k="tags"]', b).innerHTML = s.tags[lang].map(t => `<span>${t}</span>`).join('');
    $('[data-k="watch"]', b).textContent = lang === 'ar' ? AR_WATCH : EN.watch;
    b.dir = lang === 'ar' ? 'rtl' : 'ltr';
  });
  $$('#stepsTrack .sign').forEach(s => s.dir = lang === 'ar' ? 'rtl' : 'ltr');
  $$('.phone').forEach(el => {
    const r = REELS.find(x => x.id === el.dataset.reel);
    $('b', el).textContent = r[lang];
    $('.series', el).textContent = SERIES[r.series].ar;
    el.setAttribute('aria-label', r[lang]);
  });
}

const AR = {};
function setLang(l) {
  lang = l;
  document.documentElement.lang = l;
  document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
  $('#lang').textContent = l === 'ar' ? 'EN' : 'عربي';
  $$('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (!(k in AR)) AR[k] = el.innerHTML;
    el.innerHTML = l === 'ar' ? AR[k] : (EN[k] ?? AR[k]);
  });
  fillText();
  store.set('lang', l);
}

// cover: Shams walks in from the side, stops next to the photo and waves
function coverShams() {
  const box = $('#shams'), sp = new Sprite($('#coverSprite'));
  let done = false;
  const toWave = () => { if (done) return; done = true; box.classList.add('waving'); sp.play('wave'); };
  if (reduced) { box.classList.add('in'); return toWave(); }
  sp.play('walk');
  // start walking once his walk frames are in (or after 1.5 s at the latest)
  Promise.race([sheet('walk'), new Promise(r => setTimeout(r, 1500))]).then(() => {
    requestAnimationFrame(() => box.classList.add('in'));
    box.addEventListener('transitionend', toWave, { once: true });
    setTimeout(toWave, 2400);
  });
}

// Shams in a scene: walks while the page moves, stops and reacts when you stop
class Actor {
  constructor(el, say) {
    this.el = el; this.say = say;
    this.sp = new Sprite($('.sprite', el));
    this.bubble = $('.actor__bubble', el);
    this.state = 'stand'; this.turn = 0;
    el.dataset.s = 'stand';
  }
  load() { preloadReacts(); }
  set(s) { this.state = s; this.el.dataset.s = s; }
  moved(dir, stop) {
    this.stop = stop;
    clearTimeout(this.idle); clearTimeout(this.react);
    this.bubble.classList.remove('show');
    this.el.classList.toggle('back', dir < 0);
    if (reduced) return;
    if (this.state !== 'walk') { this.set('walk'); this.sp.play('walk'); }
    this.idle = setTimeout(() => this.rest(), 260);
  }
  rest() {
    this.set('stand'); this.sp.stand();
    this.el.classList.remove('back');
    this.react = setTimeout(() => {
      const r = REACTS[this.turn++ % REACTS.length];
      this.set('react');
      this.sp.play(r, { loop: false, onend: () => { if (this.state === 'react') this.set('stand'); } });
      this.bubble.textContent = this.say(this.stop);
      this.bubble.classList.add('show');
      clearTimeout(this.hide); this.hide = setTimeout(() => this.bubble.classList.remove('show'), 2600);
    }, 200);
  }
}

class Scene {
  constructor(el, say) {
    this.el = el; this.pin = $('.scene__pin', el); this.track = $('.scene__track', el);
    this.stops = $$('.stop', el); this.bgs = $$('.scene__bg', el); this.dots = $$('.scene__dots i', el);
    this.pan = $('.scene__bg--pan', el);
    this.actor = new Actor($('[data-actor]', el), say);
    this.p = -1;
    new IntersectionObserver(es => { if (es[0].isIntersecting) this.actor.load(); }, { rootMargin: '60% 0px' }).observe(el);
  }
  update() {
    const r = this.el.getBoundingClientRect(), vh = innerHeight;
    if (r.bottom < 0 || r.top > vh) return;
    const p = Math.min(1, Math.max(0, -r.top / (r.height - vh)));
    const n = this.stops.length, stopW = this.stops[0].offsetWidth;
    this.track.style.transform = `translate3d(${-p * Math.max(0, (n - 1) * stopW)}px, 0, 0)`;
    const i = Math.round(p * (n - 1));
    this.bgs.forEach((b, k) => b.classList.toggle('on', this.bgs.length === 1 || k === i));
    this.dots.forEach((d, k) => d.classList.toggle('on', k === i));
    if (this.pan) this.pan.style.transform = `translate3d(${-p * 12}%, 0, 0)`;
    if (this.p >= 0 && Math.abs(p - this.p) > .0004) this.actor.moved(Math.sign(p - this.p), i);
    this.p = p;
  }
}

function observe() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    io.unobserve(e.target);
  }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  $$('.reveal, .phone').forEach(el => io.observe(el));

  const vio = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) {
      const srcs = $$('source[data-src]', v);
      if (srcs.length) { srcs.forEach(s => { s.src = s.dataset.src; s.removeAttribute('data-src'); }); v.load(); }
      v.play().catch(() => {});
    } else v.pause();
  }), { threshold: .25 });
  $$('video[data-lazy]').forEach(v => vio.observe(v));
}

function scrollFx(scenes) {
  const bar = $('.bar');
  const darks = [...$$('.dark'), ...$$('.scene')];
  let ticking = false;
  const onScroll = () => {
    const y = scrollY, probe = bar.offsetHeight / 2;
    bar.classList.toggle('solid', y > 30);
    bar.classList.toggle('on-dark', darks.some(d => { const r = d.getBoundingClientRect(); return r.top <= probe && r.bottom >= probe; }));
    scenes.forEach(s => s.update());
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();
}

// collab form: send to FormSubmit (email) in the background, thank the person in place
function form() {
  const f = $('form[name="collab"]');
  f.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = $('button[type="submit"]', f);
    btn.disabled = true;
    const local = /^(localhost|127\.|0\.0\.0\.0)/.test(location.hostname);
    try {
      if (!local) {
        const r = await fetch('https://formsubmit.co/ajax/seif.shams6655@gmail.com', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(f))) });
        if (!r.ok) throw new Error(r.status);
      }
      f.innerHTML = `<div class="sent"><img src="assets/emblem.webp" alt=""><p>${lang === 'ar' ? 'وصلت! هرد عليك قريب.' : 'Got it! I’ll get back to you soon.'}</p></div>`;
    } catch {
      btn.disabled = false;
      alert(lang === 'ar' ? 'حصلت مشكلة، ابعتلي إيميل على طول.' : 'Something went wrong, please email me directly.');
    }
  });
}

// start: show the page first, then wire each part on its own so one failure can't blank the page
document.body.classList.add('ready');
const safe = f => { try { f(); } catch (e) { console.error(e); } };
let scenes = [];
safe(build);
safe(form);
safe(() => { if (store.get('lang') === 'en') setLang('en'); else fillText(); });
safe(() => { scenes = [new Scene($('#seriesScene'), i => SERIES[i].say[lang]), new Scene($('#stepsScene'), i => STEP_SAY[lang][i])]; });
safe(observe);
safe(() => scrollFx(scenes));
safe(() => $('#lang').addEventListener('click', () => setLang(lang === 'ar' ? 'en' : 'ar')));
safe(coverShams);
