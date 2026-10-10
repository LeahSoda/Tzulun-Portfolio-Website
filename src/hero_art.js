document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('hero-hover-canvas');
  if (!container || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
  camera.position.z = 1;

  const uniforms = {
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uHover: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uSeed: { value: Math.random() * 1000 }
  };

  //interactive hero section
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }',
    fragmentShader: `
      uniform float uTime, uHover, uSeed;
      uniform vec2 uMouse, uResolution;
      varying vec2 vUv;

      float randomValue(vec2 point) {
        point = fract(point * vec2(123.34, 345.45) + uSeed);
        point += dot(point, point + 34.345);
        return fract(point.x * point.y);
      }

      void main() {
        vec2 gridSize = max(uResolution / 11.5, vec2(1.0));
        vec2 point = vUv * gridSize;

        float rowSeed = randomValue(vec2(floor(point.y), 13.0));
        float columnSeed = randomValue(vec2(floor(point.x), 37.0));
        point.x += sin(point.y * 0.13 + rowSeed * 6.283 + uTime * 0.16) * 0.27;
        point.y += sin(point.x * 0.15 + columnSeed * 6.283 + uTime * 0.13) * 0.25;

        vec2 cursorDelta = (vUv - uMouse) * gridSize;
        float cursorDistance = length(cursorDelta);
        vec2 pushDirection = cursorDelta / max(cursorDistance, 0.001);
        float cursorField = exp(-cursorDistance * cursorDistance / 180.0) * uHover;
        point += pushDirection * cursorField * 4.0;

        float verticalDistance = abs(point.x - floor(point.x + 0.5));
        float horizontalDistance = abs(point.y - floor(point.y + 0.5));
        float verticalIndex = floor(point.x + 0.5);
        float horizontalIndex = floor(point.y + 0.5);

        float verticalKeep = step(0.13, randomValue(vec2(verticalIndex, floor(point.y)) + vec2(19.0, uSeed)));
        float horizontalKeep = step(0.13, randomValue(vec2(floor(point.x), horizontalIndex) + vec2(uSeed, 71.0)));
        float verticalLine = (1.0 - smoothstep(0.035, 0.12, verticalDistance)) * verticalKeep;
        float horizontalLine = (1.0 - smoothstep(0.035, 0.12, horizontalDistance)) * horizontalKeep;

        float nodeDistance = length(vec2(verticalDistance, horizontalDistance));
        float nodeSeed = randomValue(vec2(verticalIndex, horizontalIndex) + vec2(43.0, uSeed));
        float node = (1.0 - smoothstep(0.055, 0.14, nodeDistance)) * step(0.68, nodeSeed);

        float opening = mix(1.0, smoothstep(2.1, 6.4, cursorDistance), uHover);
        float linework = max(verticalLine, horizontalLine) * opening;
        node *= opening;

        float accent = step(0.985, randomValue(vec2(verticalIndex, horizontalIndex) + vec2(uSeed, 109.0)));
        float tearEdge = smoothstep(1.9, 2.8, cursorDistance) * (1.0 - smoothstep(5.8, 7.0, cursorDistance)) * uHover;
        vec3 lineColor = mix(vec3(0.86, 0.89, 0.88), vec3(1.0, 0.30, 0.16), max(accent, tearEdge * 0.22));
        float opacity = linework * 0.26 + node * 0.30 + max(verticalLine, horizontalLine) * tearEdge * 0.62;
        gl_FragColor = vec4(lineColor, opacity);
      }
    `,
    transparent: true
  });

  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  let targetHover = 0;
  const clock = new THREE.Clock();

  const resizeRenderer = () => {
    const bounds = container.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    renderer.setSize(bounds.width, bounds.height);
    uniforms.uResolution.value.set(bounds.width, bounds.height);
  };

  resizeRenderer();
  new ResizeObserver(resizeRenderer).observe(container);
  window.addEventListener('resize', resizeRenderer);

  container.addEventListener('pointermove', (event) => {
    const bounds = container.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    uniforms.uMouse.value.set(
      (event.clientX - bounds.left) / bounds.width,
      1.0 - (event.clientY - bounds.top) / bounds.height
    );
    targetHover = 1.0;
  });

  container.addEventListener('pointerleave', () => { targetHover = 0.0; });

  (function animate() {
    requestAnimationFrame(animate);
    uniforms.uTime.value = clock.getElapsedTime();
    uniforms.uHover.value += (targetHover - uniforms.uHover.value) * 0.1;
    renderer.render(scene, camera);
  })();
});