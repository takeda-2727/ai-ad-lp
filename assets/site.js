// AIコマーシャル+ 全ページ共通スクリプト
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ハンバーガーメニュー（1080px 以下）：開閉、Esc とリンクで閉じる
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.global-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      root.classList.toggle('menu-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    };
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('menu-open')) { setOpen(false); toggle.focus(); }
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1080) setOpen(false); });
  }

  // ヘッダーの影
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // サービスのカードの動画：assets/service-*.mp4 が読み込めたら、イラストと入れ替える
  document.querySelectorAll('.slot-video').forEach(function (v) {
    v.addEventListener('loadeddata', function () {
      v.parentElement.classList.add('has-video');
      if (!reduce) v.play().catch(function () {});
    });
  });

  // ヒーローの背景動画：assets/hero.mp4 が読み込めたら表示（無ければ仮のビジュアルのまま）
  var video = document.querySelector('.hero-video');
  if (video) {
    video.addEventListener('loadeddata', function () {
      video.classList.add('is-ready');
      if (!reduce) video.play().catch(function () {});
    });
  }

  // ここまで来たら、スクロールで表示する演出を有効にする（スクリプトが動かないときは最初から全部見える）
  root.classList.add('reveal-ready');

  // デモの案と工程バーは、少しずつずらして出す
  document.querySelectorAll('.demo-grid > div, .tl > *').forEach(function (el) {
    var i = Array.prototype.indexOf.call(el.parentElement.children, el);
    el.style.transitionDelay = 0.2 + i * 0.12 + 's';
  });

  // 追従の相談ボタン：CTA 帯やフッターが見えたら隠す（ボタンの重なり防止）
  var floatBtn = document.querySelector('.consult-float');
  if (floatBtn && 'IntersectionObserver' in window) {
    var visible = new Set();
    var fio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); });
      floatBtn.classList.toggle('is-hidden', visible.size > 0);
    });
    document.querySelectorAll('.cta-band, .site-footer').forEach(function (t) { fio.observe(t); });
  }

  // セクションごとにふわっと表示：スクロールのたびに位置を見て、画面の下から 12% の線を越えたものを出す
  var pending = Array.prototype.slice.call(document.querySelectorAll('main > section'));
  var steps = document.querySelector('.flow-steps');
  var pendingSteps = steps ? Array.prototype.slice.call(steps.querySelectorAll(':scope > li')) : [];
  var check = function () {
    var line = window.innerHeight * 0.88;
    pending = pending.filter(function (sec) {
      if (sec.getBoundingClientRect().top > line) return true;
      sec.classList.add('is-revealed');
      if (sec.querySelector('#demo-prompt')) typePrompt();
      return false;
    });
    // 流れ：ステップを順に出して、左の線をそこまで伸ばす
    var grew = false;
    pendingSteps = pendingSteps.filter(function (li) {
      if (li.getBoundingClientRect().top > window.innerHeight * 0.85) return true;
      li.classList.add('is-in'); grew = true;
      return false;
    });
    if (grew) {
      var last = 0;
      steps.querySelectorAll(':scope > li.is-in').forEach(function (li) { last = Math.max(last, li.offsetTop); });
      steps.style.setProperty('--flow-line', last + 'px');
    }
  };
  window.addEventListener('scroll', check, { passive: true });
  window.addEventListener('resize', check);
  window.addEventListener('load', check);
  // 念のため、全部出しきるまで 0.5 秒ごとにも確認する
  var poll = setInterval(function () { check(); if (!pending.length && !pendingSteps.length) clearInterval(poll); }, 500);
  check();

  // デモの依頼文を、打ち込むように表示
  function typePrompt() {
    var el = document.getElementById('demo-prompt');
    if (!el || reduce) return;
    var text = el.textContent, i = 0;
    el.textContent = '';
    (function tick() {
      el.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(tick, 45);
    })();
  }
})();
