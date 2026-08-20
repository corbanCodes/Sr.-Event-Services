/* Sr. Event Services — CONCEPT B: gold-dust particle field (Three.js, module).
   Fixed canvas behind the page; slow drift + pointer sway. Skipped entirely
   under prefers-reduced-motion (CSS also hides the canvas). */
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canvas = document.getElementById("gl");

if (canvas && !reduced) {
  try {
    const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.min.js");

    const small = window.innerWidth < 861;
    const COUNT = small ? 1200 : 3200;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.75);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" });
    renderer.setPixelRatio(DPR);
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 60);
    camera.position.z = 11;

    // soft round gold sprite
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,235,190,1)");
    grad.addColorStop(0.3, "rgba(227,192,126,.55)");
    grad.addColorStop(1, "rgba(200,162,94,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    const sprite = new THREE.CanvasTexture(c);

    const pos = new Float32Array(COUNT * 3);
    const seed = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;       // x — wide
      pos[i * 3 + 1] = (Math.random() - 0.5) * 16;   // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;   // z — depth
      seed[i * 3] = Math.random() * Math.PI * 2;
      seed[i * 3 + 1] = 0.15 + Math.random() * 0.5;  // speed
      seed[i * 3 + 2] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({
      size: small ? 0.09 : 0.075,
      map: sprite,
      transparent: true,
      opacity: 0.5,
      color: 0xe3c07e,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    });
    const points = new THREE.Points(geo, mat);
    scene.add(points);

    let px = 0, py = 0;
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      window.addEventListener("pointermove", (e) => {
        px = (e.clientX / window.innerWidth - 0.5) * 2;
        py = (e.clientY / window.innerHeight - 0.5) * 2;
      }, { passive: true });
    }

    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    const base = pos.slice();
    renderer.setAnimationLoop((time) => {
      if (document.hidden) return;
      const t = time / 1000;
      const arr = geo.attributes.position.array;
      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3;
        const ph = seed[i3], sp = seed[i3 + 1], m = seed[i3 + 2];
        arr[i3] = base[i3] + Math.sin(t * sp * 0.35 + ph) * (0.6 + m);
        arr[i3 + 1] = base[i3 + 1] + Math.cos(t * sp * 0.28 + ph * 1.7) * 0.5 + Math.sin(t * 0.05 + ph) * 0.3;
        arr[i3 + 2] = base[i3 + 2] + Math.sin(t * sp * 0.2 + ph * 0.6) * 0.4;
      }
      geo.attributes.position.needsUpdate = true;
      // slow field rotation + pointer sway + gentle scroll drift
      points.rotation.y = t * 0.012 + px * 0.06;
      points.rotation.x = py * 0.04;
      points.position.y = -(window.scrollY || 0) * 0.0006;
      renderer.render(scene, camera);
    });
  } catch (e) {
    /* CDN unavailable — the page simply runs without the field */
  }
}
