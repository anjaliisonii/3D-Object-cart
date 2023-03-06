// Initialize three.js scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Initialize renderer and add it to the page
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("canvas-container").appendChild(renderer.domElement);

// Load 3D T-shirt model
const loader = new THREE.GLTFLoader();
loader.load("models/tshirt.glb", function (gltf) {
  const tshirt = gltf.scene.children[0];
  scene.add(tshirt);

  // Add controls for changing T-shirt color
  const colorPicker = document.getElementById("color-picker");
  colorPicker.value = "#ffffff";
  colorPicker.addEventListener("input", function (event) {
    const color = new THREE.Color(event.target.value);
    tshirt.material.color = color;
  });

  // Add controls for adding text overlay
  const textButton = document.getElementById("text-button");
  textButton.addEventListener("click", function (event) {
    const text = prompt("Enter text:");
    if (text) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = canvas.height = 512;
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "64px sans-serif";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const geometry = new THREE.PlaneGeometry(1, 1);
      const overlay = new THREE.Mesh(geometry, material);
      overlay.position.set(0, 1, 0);
      overlay.scale.set(0.25, 0.25, 0.25);
      tshirt.add(overlay);
    }
  });

  // Add rotation controls for T-shirt
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 10;
  controls.maxDistance = 50;
  controls.maxPolarAngle = Math.PI / 2;

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
  }
  animate();
});

// Resize canvas when window is resized
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
