document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('three-cursor-canvas');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(
    window.innerWidth / -2, window.innerWidth / 2,
    window.innerHeight / 2, window.innerHeight / -2,
    0.1, 1000
  );
  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();

  // Core Dot
  const coreGeo = new THREE.SphereGeometry(9, 32, 32);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0xF03E18, transparent: true, opacity: 0.95 });
  group.add(new THREE.Mesh(coreGeo, coreMat));

  // Outer Halo
  const haloGeo = new THREE.SphereGeometry(18, 32, 32);
  const haloMat = new THREE.MeshBasicMaterial({ color: 0xF03E18, transparent: true, opacity: 0.35 });
  group.add(new THREE.Mesh(haloGeo, haloMat));

  scene.add(group);

  let mouse = { x: 0, y: 0 };
  let current = { x: 0, y: 0 };
  let vel = { x: 0, y: 0 };

  const stiffness = 0.15;
  const damping = 0.72;

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX - window.innerWidth / 2;
    mouse.y = -(e.clientY - window.innerHeight / 2);
  });

  function animate() {
    requestAnimationFrame(animate);

    const forceX = (mouse.x - current.x) * stiffness;
    const forceY = (mouse.y - current.y) * stiffness;

    vel.x = (vel.x + forceX) * damping;
    vel.y = (vel.y + forceY) * damping;

    current.x += vel.x;
    current.y += vel.y;

    group.position.set(current.x, current.y, 0);

    const speed = Math.hypot(vel.x, vel.y);
    const angle = Math.atan2(vel.y, vel.x);
    const stretch = Math.min(speed * 0.04, 1.2);

    group.rotation.z = angle;
    group.scale.set(1 + stretch, Math.max(0.4, 1 - stretch * 0.5), 1);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.left = window.innerWidth / -2;
    camera.right = window.innerWidth / 2;
    camera.top = window.innerHeight / 2;
    camera.bottom = window.innerHeight / -2;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});