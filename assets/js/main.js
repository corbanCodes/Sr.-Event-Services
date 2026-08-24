/* Sr. Event Services — motion + interactions.
   All hand-rolled: pointer-parallax hero, 3D tilt cards, scroll parallax,
   staggered reveals. Everything respects prefers-reduced-motion. */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ----- intro veil (home) + headline line reveals ----- */
  var veil = document.querySelector(".intro-veil");
  var introSeen = false;
  try { introSeen = !!sessionStorage.getItem("ses-intro"); } catch (e) {}
  if (veil && !introSeen && !reduced) {
    setTimeout(function () {
      veil.classList.add("lift");
      document.body.classList.add("intro-done");
      try { sessionStorage.setItem("ses-intro", "1"); } catch (e) {}
      setTimeout(function () { veil.remove(); }, 1100);
    }, 1600);
  } else {
    if (veil) veil.remove();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { document.body.classList.add("intro-done"); });
    });
  }

  /* ----- header state + mobile nav ----- */
  var header = document.querySelector("header.site");
  var onScrollHeader = function () {
    if (header) header.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  var burger = document.querySelector(".burger");
  var nav = document.querySelector("nav.main");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("open");
        burger.classList.remove("open");
      }
    });
  }

  /* ----- staggered scroll reveals ----- */
  var revealables = [].slice.call(document.querySelectorAll(".rv"));
  if ("IntersectionObserver" in window && !reduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add("in"); });
  }

  /* ----- hero: pointer parallax on layered cards + scroll drift on bg ----- */
  var hero = document.querySelector(".hero");
  var heroBg = document.querySelector(".hero-bg");
  var layers = [].slice.call(document.querySelectorAll("[data-depth]"));
  var px = 0, py = 0, tx = 0, ty = 0, rafId = null;

  function heroFrame() {
    px += (tx - px) * 0.06;
    py += (ty - py) * 0.06;
    layers.forEach(function (el) {
      var d = parseFloat(el.getAttribute("data-depth")) || 0;
      var rot = el.getAttribute("data-rot") || "0";
      el.style.transform =
        "translate3d(" + (px * d * 46).toFixed(2) + "px," + (py * d * 34).toFixed(2) + "px,0)" +
        " rotate(" + rot + "deg)";
    });
    if (Math.abs(tx - px) > 0.001 || Math.abs(ty - py) > 0.001) {
      rafId = requestAnimationFrame(heroFrame);
    } else {
      rafId = null;
    }
  }
  if (hero && layers.length && finePointer && !reduced) {
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!rafId) rafId = requestAnimationFrame(heroFrame);
    });
    hero.addEventListener("pointerleave", function () {
      tx = 0; ty = 0;
      if (!rafId) rafId = requestAnimationFrame(heroFrame);
    });
  }

  /* ----- scroll parallax: hero bg + cinematic hero exit + .band backgrounds ----- */
  var bands = [].slice.call(document.querySelectorAll(".band .band-bg"));
  var heroInner = document.querySelector(".hero-inner");
  function parallaxFrame() {
    var vh = window.innerHeight;
    if (heroBg) {
      var y = window.scrollY;
      heroBg.style.transform = "translate3d(0," + (y * 0.28).toFixed(1) + "px,0)";
      if (heroInner && y < vh * 1.2) {
        heroInner.style.opacity = Math.max(0, 1 - y / (vh * 0.85)).toFixed(3);
        heroInner.style.transform = "translate3d(0," + (y * 0.16).toFixed(1) + "px,0)";
      }
    }
    bands.forEach(function (bg) {
      var r = bg.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var p = (r.top + r.height / 2 - vh / 2) / vh; // -0.5 .. 0.5-ish
      bg.style.transform = "translate3d(0," + (p * r.height * 0.22).toFixed(1) + "px,0)";
    });
  }
  if (!reduced && (heroBg || bands.length)) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () { parallaxFrame(); ticking = false; });
      }
    }, { passive: true });
    parallaxFrame();
  }

  /* ----- 3D tilt cards (.tilt) with glare tracking ----- */
  if (finePointer && !reduced) {
    [].slice.call(document.querySelectorAll(".tilt")).forEach(function (card) {
      var glare = card.querySelector(".glare");
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        var rx = ((0.5 - y) * 8).toFixed(2);
        var ry = ((x - 0.5) * 10).toFixed(2);
        card.style.transition = "transform .08s linear";
        card.style.transform =
          "perspective(850px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-4px)";
        if (glare) {
          card.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
          card.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
        }
      });
      card.addEventListener("pointerleave", function () {
        card.style.transition = "transform .6s cubic-bezier(.2,.8,.2,1)";
        card.style.transform = "perspective(850px) rotateX(0deg) rotateY(0deg) translateY(0)";
      });
    });
  }

  /* ----- gold cursor halo (fine pointers only) ----- */
  var ring = document.querySelector(".cursor-ring");
  if (ring && finePointer && !reduced) {
    var rx = -100, ry = -100, mx = -100, my = -100, ringRaf = null, ringOn = false;
    function ringFrame() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx.toFixed(1) + "px";
      ring.style.top = ry.toFixed(1) + "px";
      if (Math.abs(mx - rx) > 0.3 || Math.abs(my - ry) > 0.3) {
        ringRaf = requestAnimationFrame(ringFrame);
      } else {
        ringRaf = null;
      }
    }
    window.addEventListener("pointermove", function (e) {
      mx = e.clientX; my = e.clientY;
      if (!ringOn) { ringOn = true; document.body.classList.add("cursor-on"); }
      if (!ringRaf) ringRaf = requestAnimationFrame(ringFrame);
    }, { passive: true });
    document.addEventListener("mouseover", function (e) {
      ring.classList.toggle("hot", !!e.target.closest("a, button, .tilt, input, select, textarea"));
    });
    document.addEventListener("mouseleave", function () {
      document.body.classList.remove("cursor-on");
      ringOn = false;
    });
  }

  /* ----- magnetic buttons ----- */
  if (finePointer && !reduced) {
    [].slice.call(document.querySelectorAll(".btn")).forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        btn.style.transition = "transform .12s ease-out, box-shadow .35s";
        btn.style.transform = "translate3d(" + (dx * 5).toFixed(1) + "px," + (dy * 4 - 2).toFixed(1) + "px,0)";
      });
      btn.addEventListener("pointerleave", function () {
        btn.style.transition = "transform .5s cubic-bezier(.2,.8,.2,1), box-shadow .35s";
        btn.style.transform = "";
      });
    });
  }

  /* ----- Formspree forms: AJAX submit + inline confirmation ----- */
  [].slice.call(document.querySelectorAll("form.quote-form")).forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("button[type=submit]");
      var ok = form.querySelector(".form-ok");
      var old = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          if (ok) ok.style.display = "block";
          if (btn) btn.textContent = "Request sent ✓";
        } else {
          if (btn) { btn.disabled = false; btn.textContent = old; }
          alert("Something went wrong — please call or email us directly.");
        }
      }).catch(function () {
        if (btn) { btn.disabled = false; btn.textContent = old; }
        alert("Something went wrong — please call or email us directly.");
      });
    });
  });

  /* ----- dismissible partner banner ----- */
  var pb = document.getElementById("partner-banner");
  if (pb) {
    var pbGone = false;
    try { pbGone = sessionStorage.getItem("pb-dismissed") === "1"; } catch (e) {}
    if (pbGone) {
      pb.remove();
    } else {
      var pbx = pb.querySelector(".pb-close");
      if (pbx) pbx.addEventListener("click", function () {
        pb.remove();
        try { sessionStorage.setItem("pb-dismissed", "1"); } catch (e) {}
      });
    }
  }

  /* ----- current year ----- */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();
