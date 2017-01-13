// ユーザーエージェントから表示方法を変更
var ua = navigator.userAgent;
if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0) {
    var sp = true;
} else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
    var sp = true;
}
sp = false;

// キャンバスフレームDOM要素の取得
var canvasFrame = document.getElementById('canvas_frame');

// レンダラーを作成
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeeeee, 1.0);
// DOMに登録
canvasFrame.appendChild(renderer.domElement);

// CLOCK
var clock = new THREE.Clock();

// シーンの作成
var scene = new THREE.Scene();

// カメラを作成
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.copy(new THREE.Vector3(0, 0, 1));
// camera.position.copy(new THREE.Vector3(0, 0, 1));
camera.lookAt(new THREE.Vector3(0, -100, 0));
// camera.lookAt(new THREE.Vector3(0, -100, 0));

// マウスでのカメラのコントロール
// var controls = new THREE.TrackballControls(camera);
// var controls = new THREE.OrbitControls(camera);
if (sp) {
    var controls = new THREE.DeviceOrientationControls(camera, renderer.domElement);
} else {
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
}

/*
* テクスチャの作成
*/
// loaderの作成
var loader = new THREE.TextureLoader();
loader.crossOrigin = '*';
offset = {x: 0, y: 0, z: 0};
radian = 0 * Math.PI / 180;

// 各画像を貼り付け
loader.load('img/top.png', texture => { // onLoad
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({map: texture}));
    plane.position.set(offset.x, 50 + offset.y, offset.z);
    plane.rotation.x = 90 * Math.PI / 180;
    plane.rotation.z = 180 * Math.PI / 180 - radian;
    scene.add(plane);
});
loader.load('img/bottom.png', texture => { // onLoad
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({map: texture}));
    plane.rotation.x = 270 * Math.PI / 180;
    plane.rotation.z = 0 * Math.PI / 180 + radian;
    plane.position.set(offset.x, -50 + offset.y, offset.z);
    scene.add(plane);
});
loader.load('img/right.png', texture => { // onLoad
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({map: texture}));
    plane.rotation.y = 270 * Math.PI / 180 + radian;
    plane.position.set(50 * Math.cos(radian) + offset.x, offset.y, -50 * Math.sin(radian) + offset.z);
    scene.add(plane);
});
loader.load('img/left.png', texture => { // onLoad
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({map: texture}));
    plane.rotation.y = 90 * Math.PI / 180 + radian;
    plane.position.set(-50  * Math.cos(radian) + offset.x, offset.y, 50 * Math.sin(radian) + offset.z);
    scene.add(plane);
});
loader.load('img/front.png', texture => { // onLoad
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({map: texture}));
    plane.rotation.y = 0 * Math.PI / 180 + radian;
    plane.position.set(-50 * Math.sin(radian) + offset.x, offset.y, -50 * Math.cos(radian) + offset.z);
    scene.add(plane);
});
loader.load('img/back.png', texture => { // onLoad
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({map: texture}));
    plane.rotation.y = 180 * Math.PI / 180 + radian;
    plane.position.set(50 * Math.sin(radian) + offset.x, offset.y, 50 * Math.cos(radian) + offset.z);
    scene.add(plane);
});

animate(); // アニメーションを描画
function animate() {
    // アニメーション
    requestAnimationFrame(animate);
    // 加速度センサに応じてちょうどよく回転する
    controls.update();
    renderer.render(scene, camera);
}
