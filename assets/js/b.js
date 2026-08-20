/* Sr. Event Services — CONCEPT B choreography.
   GSAP + ScrollTrigger + Lenis when present; the page degrades to a clean
   static layout when they aren't (or under prefers-reduced-motion). */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var wide = window.matchMedia("(min-width: 861px)").matches;
  var hasGsap = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
  var motion = hasGsap && !reduced;

  /* ----- loader → b-ready (hero reveal) ----- */
  var loader = document.querySelector(".b-loader");
  var seen = /skipintro/.test(location.search);
  try { seen = seen || !!sessionStorage.getItem("ses-intro-b"); } catch (e) {}
  function ready() { document.body.classList.add("b-ready"); }
  if (loader && !seen && !reduced) {
    var num = document.getElementById("bl-num");
    var t0 = performance.now(), DUR = 1150;
    (function count(t) {
      var p = Math.min(1, (t - t0) / DUR);
      var eased = 1 - Math.pow(1 - p, 3);
      if (num) num.textContent = String(Math.round(eased * 100)).padStart(2, "0");
      if (p < 1) { requestAnimationFrame(count); return; }
      loader.classList.add("lift");
      try { sessionStorage.setItem("ses-intro-b", "1"); } catch (e) {}
      setTimeout(ready, 250);
      setTimeout(function () { loader.remove(); }, 1000);
    })(t0);
  } else {
    if (loader) loader.remove();
    requestAnimationFrame(function () { requestAnimationFrame(ready); });
  }
  if (!motion) document.body.classList.add("no-motion");

  /* ----- smooth scroll + scroll choreography ----- */
  if (motion) {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    if (typeof window.Lenis !== "undefined" && finePointer) {
      var lenis = new Lenis({ anchors: true });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
      document.documentElement.classList.add("lenis");
    }

    /* page progress — mono counter + hairline fill */
    var fill = document.getElementById("bp-fill");
    var pnum = document.getElementById("bp-num");
    ScrollTrigger.create({
      trigger: document.body, start: 0, end: "max",
      onUpdate: function (self) {
        if (fill) fill.style.transform = "scaleX(" + self.progress.toFixed(4) + ")";
        if (pnum) pnum.textContent = String(Math.round(self.progress * 100)).padStart(3, "0");
      }
    });

    /* section index 01/06 */
    var cur = document.getElementById("bi-cur");
    gsap.utils.toArray(".bs").forEach(function (sec) {
      ScrollTrigger.create({
        trigger: sec, start: "top 50%", end: "bottom 50%",
        onToggle: function (self) {
          if (self.isActive && cur) cur.textContent = sec.getAttribute("data-index") || "01";
        }
      });
    });

    /* hero drifts up faster than the field as you scroll away */
    var bhGrid = document.querySelector(".bh-grid");
    if (bhGrid) {
      gsap.to(bhGrid, {
        yPercent: -16, opacity: 0.15, ease: "none",
        scrollTrigger: { trigger: ".bs-hero", start: "top top", end: "bottom top", scrub: true }
      });
    }

    /* manifesto — line-by-line scrub */
    gsap.utils.toArray(".bm-line").forEach(function (line) {
      gsap.to(line, {
        opacity: 1, y: 0, ease: "none",
        scrollTrigger: { trigger: line, start: "top 82%", end: "top 45%", scrub: true }
      });
    });

    /* pour list — pinned horizontal rail (desktop) */
    if (wide) {
      var pour = document.querySelector(".bs-pour");
      var rail = document.getElementById("bp-rail");
      if (pour && rail) {
        pour.classList.add("js-pin");
        var dist = function () { return rail.scrollWidth - window.innerWidth; };
        var railTween = gsap.to(rail, {
          x: function () { return -dist(); },
          ease: "none",
          scrollTrigger: {
            trigger: ".bp-pin",
            start: "top top",
            end: function () { return "+=" + dist(); },
            pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true,
            onUpdate: function (self) {
              var count = document.getElementById("bp-count");
              if (count) {
                var n = Math.min(7, 1 + Math.floor(self.progress * 7));
                count.textContent = "0" + n + " / 07";
              }
            }
          }
        });
        /* drift each card image against the rail as it passes */
        gsap.utils.toArray(".bpc-img img").forEach(function (img) {
          gsap.fromTo(img, { y: "-7%" }, {
            y: "7%", ease: "none",
            scrollTrigger: {
              trigger: img.closest(".bp-card"), containerAnimation: railTween,
              start: "left right", end: "right left", scrub: true
            }
          });
        });
      }

      /* packages — stacked cards that scale away as the next covers them */
      var cards = gsap.utils.toArray(".bk-card");
      cards.forEach(function (card, i) {
        ScrollTrigger.create({
          trigger: card, start: "top top",
          endTrigger: "#bk-stack", end: "bottom bottom",
          pin: true, pinSpacing: false, anticipatePin: 1
        });
        if (i < cards.length - 1) {
          gsap.to(card, {
            scale: 0.95, "--veil": 0.55,
            transformOrigin: "center top", ease: "none",
            scrollTrigger: {
              trigger: cards[i + 1], start: "top bottom", end: "top top", scrub: true
            }
          });
        }
      });
    }

    /* services + book heads: gentle rise */
    gsap.utils.toArray(".bv-head, .bk-head, .bp-head, .bb-inner > .b-label, .bb-contacts").forEach(function (el) {
      gsap.from(el, {
        opacity: 0, y: 30, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });

    /* book headline mask reveal when it enters */
    var bookIns = gsap.utils.toArray(".bb-huge .bl-in");
    if (bookIns.length) {
      gsap.set(bookIns, { yPercent: 114 });
      gsap.to(bookIns, {
        yPercent: 0, stagger: 0.12, duration: 1.15, ease: "power4.out",
        scrollTrigger: { trigger: ".bb-huge", start: "top 82%" }
      });
    }

    window.addEventListener("load", function () { ScrollTrigger.refresh(); });
  }

  /* ----- services rows: floating image follows the cursor ----- */
  var float = document.getElementById("bv-float");
  if (float && finePointer && !reduced) {
    var fimg = float.querySelector("img");
    var fx = 0, fy = 0, tx2 = 0, ty2 = 0, fRaf = null;
    function floatFrame() {
      fx += (tx2 - fx) * 0.12; fy += (ty2 - fy) * 0.12;
      float.style.left = (fx + 26) + "px"; float.style.top = (fy - 100) + "px";
      if (Math.abs(tx2 - fx) > 0.4 || Math.abs(ty2 - fy) > 0.4) fRaf = requestAnimationFrame(floatFrame);
      else fRaf = null;
    }
    [].slice.call(document.querySelectorAll(".bv-row")).forEach(function (row) {
      row.addEventListener("pointerenter", function () {
        if (fimg) fimg.src = row.getAttribute("data-img");
        float.classList.add("show");
      });
      row.addEventListener("pointerleave", function () { float.classList.remove("show"); });
      row.addEventListener("pointermove", function (e) {
        tx2 = e.clientX; ty2 = e.clientY;
        if (!fRaf) fRaf = requestAnimationFrame(floatFrame);
      });
    });
  }

  /* ----- 3D tilt on the pour-list cards (same feel as concept A) ----- */
  if (finePointer && !reduced) {
    [].slice.call(document.querySelectorAll(".bp-card")).forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        var rx2 = ((0.5 - y) * 9).toFixed(2);
        var ry2 = ((x - 0.5) * 11).toFixed(2);
        card.style.transition = "transform .08s linear";
        card.style.transform =
          "perspective(900px) rotateX(" + rx2 + "deg) rotateY(" + ry2 + "deg) translateY(-6px)";
        card.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
        card.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
      });
      card.addEventListener("pointerleave", function () {
        card.style.transition = "transform .65s cubic-bezier(.2,.8,.2,1)";
        card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)";
      });
    });
  }

  /* ----- gold cursor halo ----- */
  var ring = document.querySelector(".cursor-ring");
  if (ring && finePointer && !reduced) {
    var rx = -100, ry = -100, mx = -100, my = -100, rafId = null, on = false;
    function ringFrame() {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.left = rx.toFixed(1) + "px"; ring.style.top = ry.toFixed(1) + "px";
      if (Math.abs(mx - rx) > 0.3 || Math.abs(my - ry) > 0.3) rafId = requestAnimationFrame(ringFrame);
      else rafId = null;
    }
    window.addEventListener("pointermove", function (e) {
      mx = e.clientX; my = e.clientY;
      if (!on) { on = true; document.body.classList.add("cursor-on"); }
      if (!rafId) rafId = requestAnimationFrame(ringFrame);
    }, { passive: true });
    document.addEventListener("mouseover", function (e) {
      ring.classList.toggle("hot", !!e.target.closest("a, button, input, .bp-card"));
    });
  }

  /* ----- Formspree: AJAX submit ----- */
  [].slice.call(document.querySelectorAll("form.quote-form")).forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = form.querySelector("button[type=submit]");
      var ok = form.querySelector(".form-ok");
      var old = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            if (ok) ok.style.display = "block";
            if (btn) btn.textContent = "Request sent ✓";
          } else {
            if (btn) { btn.disabled = false; btn.textContent = old; }
            alert("Something went wrong — please call or email us directly.");
          }
        })
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = old; }
          alert("Something went wrong — please call or email us directly.");
        });
    });
  });

  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();
