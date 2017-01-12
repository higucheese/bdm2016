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
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);

// マウスでのカメラのコントロール
// var controls = new THREE.TrackballControls(camera);

/*
* テクスチャの作成
*/

// loaderの作成
var loader = new THREE.TextureLoader();
loader.crossOrigin = '*';

// 各画像を貼り付け
loader.load('top.png', texture => { // onLoad
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({map: texture}));
    plane.position.set(0,50,0);
    plane.rotation.x = 90 * Math.PI / 180;
    plane.rotation.z = 180 * Math.PI / 180;
    scene.add(plane);
});
loader.load('bottom.png', texture => { // onLoad
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({map: texture}));
    plane.rotation.x = 270 * Math.PI / 180;
    plane.rotation.z = 270 * Math.PI / 180;
    plane.position.set(0,-50,0);
    scene.add(plane);
});
loader.load('right.png', texture => { // onLoad
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({map: texture}));
    plane.rotation.y = 180 * Math.PI / 180;
    plane.position.set(0, 0, 50);
    scene.add(plane);
});
loader.load('left.png', texture => { // onLoad
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({map: texture}));
    plane.rotation.y = 0 * Math.PI / 180;
    plane.position.set(0, 0, -50);
    scene.add(plane);
});
loader.load('front.png', texture => { // onLoad
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({map: texture}));
    plane.rotation.y = -90 * Math.PI / 180;
    plane.position.set(50, 0, 0);
    scene.add(plane);
});
loader.load('back.png', texture => { // onLoad
    var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({map: texture}));
    plane.rotation.y = 90 * Math.PI / 180;
    plane.position.set(-50, 0, 0);
    scene.add(plane);
});


/*
* カメラ周り
*/

var threshold = 0.3;
var gravity = new THREE.Vector3(0, 0, 0);
var g_v = new THREE.Vector3(0, 0, 0);

camera.position.copy(new THREE.Vector3(0, 0, 0));
camera.lookAt(new THREE.Vector3(50, 50, 0));

window.addEventListener("devicemotion", function(evt){
    var acc_g = evt.accelerationIncludingGravity;
    var rota_r = evt.rotationRate;

    if (Math.abs(gravity.x - acc_g.x) > threshold) {
        g_v.x = acc_g.x / 9.8 * 150;
        gravity.x = acc_g.x;
    }
    if (Math.abs(gravity.y - acc_g.y) > threshold) {
        g_v.z = acc_g.y / 9.8 * 150; // y upなのでyとzを逆にする
        gravity.y = acc_g.y;
    }
    if (Math.abs(gravity.z - acc_g.z) > threshold) {
        g_v.y = acc_g.z / 9.8 * 150; // y upなのでyとzを逆にする
        gravity.z = acc_g.z;
    }

    camera.position.copy(new THREE.Vector3(0, 0, 0));
    camera.lookAt(g_v);
}, true);

animate(); // アニメーションを描画
i = 0;
var old_time = 0;
function animate() {
    // アニメーション
    requestAnimationFrame( animate );
    // controls.update();
    renderer.render( scene, camera );
}
