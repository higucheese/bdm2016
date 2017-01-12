var canvasFrame;
var camera;
var scene;
var controls;
var renderer;

// キャンバスフレームDOM要素の取得
canvasFrame = document.getElementById('canvas_frame');
// レンダラーを作成
renderer = new THREE.WebGLRenderer();
// canvas要素のサイズを設定
renderer.setSize(window.innerWidth, window.innerHeight);
// 背景色を設定
renderer.setClearColor(0xeeeeee, 1.0);
// body要素にcanvas要素を追加
canvasFrame.appendChild(renderer.domElement);

// CLOCK
var clock = new THREE.Clock();

// シーンの作成
scene = new THREE.Scene();

// カメラを作成
camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
// カメラの位置を設定
camera.position.set(0, 0, 0);
// カメラの向きを設定
camera.lookAt({x: 1, y: 0, z: 0});

// マウスでのカメラのコントロール
// controls = new THREE.TrackballControls(camera);

// テクスチャの作成
// instantiate a loader
var loader = new THREE.TextureLoader();
loader.crossOrigin = '*';
loader.load('top.png',
texture => { // onLoad
    //planeを作成
    var planegeometry = new THREE.PlaneGeometry(100, 100);
    var material = new THREE.MeshBasicMaterial({map: texture});
    var plane = new THREE.Mesh(planegeometry, material);
    plane.position.set(0,50,0);
    plane.rotation.x = 90 * Math.PI / 180;
    plane.rotation.z = 180 * Math.PI / 180;
    scene.add(plane);
}
);
loader.load('bottom.png',
texture => { // onLoad
    //planeを作成
    var planegeometry = new THREE.PlaneGeometry(100, 100);
    var material = new THREE.MeshBasicMaterial({map: texture});
    var plane = new THREE.Mesh(planegeometry, material);
    plane.rotation.x = 270 * Math.PI / 180;
    plane.rotation.z = 270 * Math.PI / 180;
    plane.position.set(0,-50,0);
    scene.add(plane);
}
);
loader.load('right.png',
texture => { // onLoad
    //planeを作成
    var planegeometry = new THREE.PlaneGeometry(100, 100);
    var material = new THREE.MeshBasicMaterial({map: texture});
    var plane = new THREE.Mesh(planegeometry, material);
    plane.rotation.y = 180 * Math.PI / 180;
    plane.position.set(0, 0, 50);
    scene.add(plane);
}
);
loader.load('left.png',
texture => { // onLoad
    //planeを作成
    var planegeometry = new THREE.PlaneGeometry(100, 100);
    var material = new THREE.MeshBasicMaterial({map: texture});
    var plane = new THREE.Mesh(planegeometry, material);
    plane.rotation.y = 0 * Math.PI / 180;
    plane.position.set(0, 0, -50);
    scene.add(plane);
}
);
loader.load('front.png',
texture => { // onLoad
    //planeを作成
    var planegeometry = new THREE.PlaneGeometry(100, 100);
    var material = new THREE.MeshBasicMaterial({map: texture});
    var plane = new THREE.Mesh(planegeometry, material);
    plane.rotation.y = -90 * Math.PI / 180;
    plane.position.set(50, 0, 0);
    scene.add(plane);
}
);
loader.load('back.png', texture => { // onLoad
    //planeを作成
    var planegeometry = new THREE.PlaneGeometry(100, 100);
    var material = new THREE.MeshBasicMaterial({map: texture});
    var plane = new THREE.Mesh(planegeometry, material);
    plane.rotation.y = 90 * Math.PI / 180;
    plane.position.set(-50, 0, 0);
    scene.add(plane);
});


z_int = 0;

var threshold = 0.3;
var zeroVector = new THREE.Vector3(0, 0, 0);
var gravity = { x: 0, y: 0, z: 0 };
var gravityRatio = {};
var gravityVector = new THREE.Vector3(50, 50, 0);

camera.position.copy(zeroVector);
camera.lookAt(gravityVector);

window.addEventListener("devicemotion", function(evt){

    var x = evt.accelerationIncludingGravity.x || 0;
    var y = evt.accelerationIncludingGravity.y || 0;
    var z = evt.accelerationIncludingGravity.z || 0;

    if (Math.abs(gravity.x - x) > threshold) {
        gravity.x = x;
        gravityRatio.x = gravity.x / 9.8;
        gravityVector.x = gravityRatio.x * 150;
    }
    if (Math.abs(gravity.y - y) > threshold) {
        gravity.y = y;
        gravityRatio.y = gravity.y / 9.8;
        gravityVector.z = gravityRatio.y * 150; // y upなのでyとzを逆にする
    }
    if (Math.abs(gravity.z - z) > threshold) {
        gravity.z = z;
        gravityRatio.z = gravity.z / 9.8;
        gravityVector.y = gravityRatio.z * 150; // y upなのでyとzを逆にする
    }

    camera.position.copy(zeroVector);
    camera.lookAt(gravityVector);

    // console.log(camera.position, gravityVector);
    // console.log(gravityVector);

}, true);


// window.addEventListener("devicemotion", function(e){
//     //傾き(重力加速度)
//     var acc_g = e.accelerationIncludingGravity;
//     var gx = obj2NumberFix(acc_g.x, 5);
//     var gy = obj2NumberFix(acc_g.y, 5);
//     var gz = obj2NumberFix(acc_g.z, 5);
//     var rota_r = e.rotationRate;
//     var a = obj2NumberFix(rota_r.alpha, 5); //z方向
//     var b = obj2NumberFix(rota_r.beta, 5); //x方向
//     var g = obj2NumberFix(rota_r.gamma, 5); // y方向
//     // function
//     var time = clock.getElapsedTime();
//     dt = time - old_time;
//     old_time = time;
//     z_int += a * dt;
//     console.log(z_int);
//
//     // camera.lookAt(new THREE.Vector3(100 * g_x, 100 * g_z, 0));
//     // camera.lookAt(new THREE.Vector3(g_z, 1, 0));
//     camera.rotation.x += g_x;
//
//     function obj2NumberFix(obj, fix_deg){
//         return Number(obj).toFixed(fix_deg);
//     }
// });


animate(); // アニメーションを描画
i = 0;
var old_time = 0;
function animate() {
    // アニメーション
    requestAnimationFrame( animate );
    // controls.update();
    // camera.position.x = 100 * Math.sin(theta);
    // camera.position.y = 30 * Math.cos(theta) + 31; // 水面下に入らないように+100
    // camera.position.z = 100 * Math.cos(theta);
    // camera.lookAt(new THREE.Vector3(0, 0, 0));
    // camera.lookAt(new THREE.Vector3(Math.sin(theta), Math.cos(theta), Math.cos(theta)));
    renderer.render( scene, camera );
}
