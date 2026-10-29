// AIコマーシャル+ 全ページ共通スクリプト
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };
  if (reduce) root.classList.add('no-glow');

  // ---------- 全画面メニュー ----------
  var menuBtn = $('.menu-btn');
  var setMenu = function (open) {
    root.classList.toggle('menu-open', open);
    if (menuBtn) {
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuBtn.querySelector('.menu-word').textContent = open ? 'Close' : 'Menu';
    }
  };
  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(!root.classList.contains('menu-open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('menu-open')) { setMenu(false); menuBtn.focus(); } });
  $$('.menu a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });

  // ---------- オープニング：数字が 000 → 100 に進む ----------
  var loaderNum = $('.loader b');
  if (loaderNum && root.classList.contains('intro')) {
    var t0 = performance.now();
    (function count() {
      var p = Math.min((performance.now() - t0) / 1800, 1);
      loaderNum.textContent = String(Math.round(p * 100)).padStart(3, '0');
      if (p < 1) requestAnimationFrame(count);
    })();
    // CSS のフェードアウトが動かない環境でも、必ず消して中身を見せる
    setTimeout(function () { var l = $('.loader'); if (l) l.style.display = 'none'; }, 2700);
  }

  // ---------- 文字を 1 文字ずつに分ける（見出しのせり上がり用） ----------
  $$('[data-split]').forEach(function (el) {
    var i = 0;
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split('').forEach(function (c) {
            var outer = document.createElement('span'); outer.className = 'ch';
            var inner = document.createElement('span'); inner.textContent = c; inner.style.setProperty('--i', i++);
            outer.appendChild(inner); frag.appendChild(outer);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
    el.classList.add('split-chars');
  });

  // ---------- スクロールに合わせて光る文章：1 文字ずつに分ける ----------
  var glows = $$('.glow-text').map(function (el) {
    var spans = [];
    var walk = function (node, hl) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split('').forEach(function (c) {
            var s = document.createElement('span'); s.className = 'w' + (hl ? ' hl' : ''); s.textContent = c;
            frag.appendChild(s); spans.push(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n, hl || n.tagName === 'EM');
      });
    };
    walk(el, false);
    var scene = el.closest('[data-scene]');
    return { el: el, spans: spans, lit: 0, scene: scene, stage: scene && $('.scene-stage', scene) };
  });

  // ヒーローとページ見出しの文字を出す
  $$('.hero, .page-head').forEach(function (top) {
    requestAnimationFrame(function () { top.classList.add('in'); $$('[data-split]', top).forEach(function (el) { el.classList.add('in'); }); });
  });

  // ---------- ヒーローの言葉の入れ替え ⟨Cheaper.⟩ ⟨Faster.⟩ … ----------
  var rot = $('.rot');
  if (rot && !reduce) {
    var words = rot.getAttribute('data-words').split('|'), wi = 0;
    var type = function (word, cb) {
      var i = 0;
      (function step() { rot.textContent = word.slice(0, ++i); if (i < word.length) setTimeout(step, 55); else cb(); })();
    };
    var erase = function (cb) {
      (function step() { rot.textContent = rot.textContent.slice(0, -1); if (rot.textContent.length) setTimeout(step, 30); else cb(); })();
    };
    var cycle = function () { setTimeout(function () { erase(function () { wi = (wi + 1) % words.length; type(words[wi], cycle); }); }, 2200); };
    setTimeout(cycle, root.classList.contains('intro') ? 3000 : 1200);
  }

  // ---------- 動画：画面に入っているあいだだけ再生（重くならないように） ----------
  var heroVideo = $('.hero-video');
  if (heroVideo) {
    // hero.mp4 → hero-2.mp4 → … と交互に流す。2 本目が無ければ 1 本目をくり返す
    var srcs = [heroVideo.getAttribute('src')], idx = 0;
    if (heroVideo.dataset.next) {
      srcs.push(heroVideo.dataset.next);
      var pre = document.createElement('video');
      pre.muted = true; pre.preload = 'auto';
      pre.addEventListener('error', function () { srcs = [srcs[0]]; heroVideo.loop = true; });
      pre.src = heroVideo.dataset.next;
    } else heroVideo.loop = true;
    heroVideo.addEventListener('loadeddata', function () {
      heroVideo.classList.add('is-ready');
      if (!reduce) heroVideo.play().catch(function () {});
    });
    heroVideo.addEventListener('ended', function () { idx = (idx + 1) % srcs.length; heroVideo.src = srcs[idx]; });
    heroVideo.addEventListener('error', function () { if (idx === 0) return; srcs = [srcs[0]]; idx = 0; heroVideo.loop = true; heroVideo.src = srcs[0]; });
  }
  var autoVideos = $$('video[data-auto]');
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (reduce) return;
        if (e.isIntersecting) e.target.play().catch(function () {}); else e.target.pause();
      });
    }, { threshold: 0.2 });
    autoVideos.forEach(function (v) { vio.observe(v); });
  }
  // サービスの行：マウスを乗せたときだけプレビュー動画を再生
  $$('.row').forEach(function (row) {
    var v = $('.row-preview video', row);
    if (!v) return;
    row.addEventListener('mouseenter', function () { if (!reduce) v.play().catch(function () {}); });
    row.addEventListener('mouseleave', function () { v.pause(); });
  });

  // ---------- スクロール演出：場面ごとの進み具合（0〜1）を --p に渡す ----------
  var scenes = $$('[data-scene]');
  var chapters = $$('[data-chapters]').map(function (el) {
    return { el: el, items: $$('.chapter', el), videos: $$('.ch-media video', el), count: $('.ch-count b', el), now: -1 };
  });
  var setChapter = function (c, n) {
    if (n === c.now) return;
    c.now = n;
    c.items.forEach(function (li, i) { li.classList.toggle('is-on', i === n); });
    c.videos.forEach(function (v, i) {
      v.classList.toggle('is-on', i === n);
      if (i === n && !reduce) v.play().catch(function () {}); else v.pause();
    });
    if (c.count && n >= 0) c.count.textContent = String(n + 1).padStart(2, '0');
  };
  var stepScenes = $$('[data-steps]').map(function (el) {
    return { el: el, stage: $('.scene-stage', el), steps: $$('[data-step]', el) };
  });
  var sceneQueued = false;
  var updateScenes = function () {
    sceneQueued = false;
    var vh = window.innerHeight;
    scenes.forEach(function (el) {
      var r = el.getBoundingClientRect();
      // 画面に留まる場面は「留まっているあいだ」、data-scene="pass" は「画面を通り過ぎるあいだ」で 0 → 1
      var p = el.dataset.scene === 'pass' ? (vh - r.top) / (vh + r.height) : -r.top / Math.max(1, r.height - vh);
      el.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(4));
    });
    chapters.forEach(function (c) {
      var r = c.el.getBoundingClientRect();
      // 画面の外では動画を止める。戻ってきたら今の章からまた再生
      if (r.bottom < 0 || r.top > vh) { setChapter(c, -1); return; }
      var p = -r.top / Math.max(1, r.height - vh);
      setChapter(c, Math.max(0, Math.min(c.items.length - 1, Math.floor(p * c.items.length))));
    });
    // 数字の場面：留まっているあいだに 1 つずつ出して、スクロールに合わせて数える
    stepScenes.forEach(function (s) {
      var pinned = !reduce && getComputedStyle(s.stage).position === 'sticky';
      if (!pinned) {
        // 画面の大きさが変わって留めなくなったら、数字は最終の値で見せる
        if (s.el.dataset.pinned) {
          delete s.el.dataset.pinned;
          s.steps.forEach(function (st) { st.style.removeProperty('--q'); });
          $$('[data-count]', s.el).forEach(function (c) { c.textContent = c.getAttribute('data-count'); });
        }
        return;
      }
      s.el.dataset.pinned = '1';
      var r = s.el.getBoundingClientRect();
      var p = Math.max(0, Math.min(1, -r.top / Math.max(1, r.height - vh)));
      s.steps.forEach(function (st, i) {
        var q = Math.max(0, Math.min(1, (p - 0.05 - i * 0.25) / 0.25));
        st.style.setProperty('--q', q.toFixed(3));
        $$('[data-count]', st).forEach(function (c) { c.textContent = Math.round(parseFloat(c.getAttribute('data-count')) * q); });
      });
    });
  };
  var queueScenes = function () { if (!sceneQueued) { sceneQueued = true; requestAnimationFrame(updateScenes); } };
  window.addEventListener('scroll', queueScenes, { passive: true });
  window.addEventListener('resize', queueScenes);
  updateScenes();

  // ---------- 追従の相談ボタン：お問い合わせ欄やフッターが見えたら隠す ----------
  var floatCta = $('.float-cta');
  if (floatCta && 'IntersectionObserver' in window) {
    var seen = new Set();
    var fio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target); });
      floatCta.classList.toggle('is-hidden', seen.size > 0);
    });
    $$('.hero, .contact, .footer').forEach(function (t) { fio.observe(t); });
  }

  // ---------- スクロール連動：表示・数字・光る文章・目盛り・カプセルの出し入れ ----------
  root.classList.add('reveal-ready');
  var pending = $$('[data-reveal]');
  var counters = $$('[data-count]');
  var ticks = $('.ticks');
  if (ticks) for (var k = 0; k < 24; k++) ticks.appendChild(document.createElement('i'));
  var tickEls = ticks ? $$('i', ticks) : [];
  var capsule = $('.capsule');
  var lastY = window.scrollY;

  var countUp = function (el) {
    var to = parseFloat(el.getAttribute('data-count'));
    if (reduce) { el.textContent = to; return; }
    var s = performance.now();
    (function step(t) {
      var p = Math.min((t - s) / 1400, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    })(s);
  };

  var check = function () {
    var vh = window.innerHeight;
    pending = pending.filter(function (el) {
      if (el.getBoundingClientRect().top > vh * 0.88) return true;
      el.classList.add('in');
      return false;
    });
    counters = counters.filter(function (el) {
      // 留まっている数字の場面では、スクロールに合わせて数える（updateScenes）
      var steps = el.closest('[data-steps]');
      if (steps && steps.dataset.pinned) return false;
      if (el.getBoundingClientRect().top > vh * 0.9) return true;
      countUp(el);
      return false;
    });
    if (!reduce) glows.forEach(function (g) {
      var r = g.el.getBoundingClientRect(), p;
      // 画面に留まる場面の中なら、留まっているあいだの前 3/4 で光りきる
      if (g.stage && getComputedStyle(g.stage).position === 'sticky') {
        var sr = g.scene.getBoundingClientRect();
        p = Math.max(0, Math.min(1, -sr.top / Math.max(1, sr.height - vh) / 0.75));
      } else p = Math.max(0, Math.min(1, (vh * 0.85 - r.top) / (r.height + vh * 0.3)));
      var n = Math.round(p * g.spans.length);
      if (n === g.lit) return;
      for (var i = Math.min(n, g.lit); i < Math.max(n, g.lit); i++) g.spans[i].classList.toggle('on', i < n);
      g.lit = n;
    });
    var max = document.documentElement.scrollHeight - vh;
    var prog = max > 0 ? window.scrollY / max : 0;
    var cur = Math.round(prog * (tickEls.length - 1));
    tickEls.forEach(function (t, i) { t.classList.toggle('on', i < cur); t.classList.toggle('now', i === cur); });
    if (capsule && !root.classList.contains('menu-open')) {
      var y = window.scrollY;
      capsule.classList.toggle('is-hidden', y > lastY && y > 300);
      lastY = y;
    }
  };
  window.addEventListener('scroll', check, { passive: true });
  window.addEventListener('resize', check);
  window.addEventListener('load', check);
  // スクロールイベントが届かない環境でも、出しきるまで 0.5 秒ごとに確認する
  var poll = setInterval(function () { check(); if (!pending.length && !counters.length) clearInterval(poll); }, 500);
  check();
})();
