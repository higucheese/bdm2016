// キャンバスフレームDOM要素の取得
var canvasFrame = document.getElementById('canvas_frame');

// レンダラーを作成
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeeeee, 1.0);
// DOMに登録
canvasFrame.appendChild(renderer.domElement);

canvas = $("canvas#videoCanvas")[0];
canvasContext = canvas.getContext("2d");

// CLOCK
var clock = new THREE.Clock();

// Background Texture
var backgroundTexture;

if (navigator.webkitGetUserMedia) {
    video = document.createElement('video');
    document.body.appendChild(video);
    navigator.webkitGetUserMedia({video:true},function(stream) {
        video.src=window.URL.createObjectURL(stream);

        video.autoplay=true;

        // create texture of the video stream
        backgroundTexture = new THREE.Texture(canvas);
    },
    function(error){
        alert('errored!');
        console.log("Faild to get a stream due to", error)
        loadAlternativlyBackground();
    });
} else {
    alert('not corresponded');
    loadAlternativlyBackground();
}
function loadAlternativlyBackground() {
    // load alternativly background
    var loader = new THREE.TextureLoader();
    loader.load('front.png', texture => {
        backgroundTexture = texture; // onLoad
        var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({map: backgroundTexture}));
        plane.rotation.y = 0 * Math.PI / 180;
        plane.position.set(0, 0, -50);
        scene.add(plane);
    });
}

// シーンの作成
var scene = new THREE.Scene();

// カメラを作成
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.copy(new THREE.Vector3(0, 0, 1));
camera.lookAt(new THREE.Vector3(100, 0, 0));

// マウスでのカメラのコントロール
var controls = new THREE.TrackballControls(camera);
// var controls = new THREE.OrbitControls(camera);
// var controls = new THREE.DeviceOrientationControls(camera);

/*
* テクスチャの作成
*/
// loaderの作成
// var loader = new THREE.TextureLoader();
// loader.crossOrigin = '*';
offset = {x: 200, y: 0, z: 0};

// // 各画像を貼り付け
// loader.load('top.png', texture => { // onLoad
//     var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({map: texture}));
//     plane.position.set(offset.x, 50 + offset.y, offset.z);
//     plane.rotation.x = 90 * Math.PI / 180;
//     plane.rotation.z = 180 * Math.PI / 180;
//     scene.add(plane);
// });
// loader.load('bottom.png', texture => { // onLoad
//     var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({map: texture}));
//     plane.rotation.x = 270 * Math.PI / 180;
//     plane.rotation.z = 270 * Math.PI / 180;
//     plane.position.set(offset.x, -50 + offset.y, offset.z);
//     scene.add(plane);
// });
// loader.load('right.png', texture => { // onLoad
//     var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({map: texture}));
//     plane.rotation.y = 180 * Math.PI / 180;
//     plane.position.set(offset.x, offset.y, 50 + offset.z);
//     scene.add(plane);
// });
// loader.load('left.png', texture => { // onLoad
//     var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({map: texture}));
//     plane.rotation.y = 0 * Math.PI / 180;
//     plane.position.set(offset.x, offset.y, -50 + offset.z);
//     scene.add(plane);
// });
// loader.load('front.png', texture => { // onLoad
//     var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({map: texture}));
//     plane.rotation.y = -90 * Math.PI / 180;
//     plane.position.set(50 + offset.x, offset.y, offset.z);
//     scene.add(plane);
// });
// loader.load('back.png', texture => { // onLoad
//     var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({map: texture}));
//     plane.rotation.y = 90 * Math.PI / 180;
//     plane.position.set(-50 + offset.x, offset.y, offset.z);
//     scene.add(plane);
// });

animate(); // アニメーションを描画
function animate() {
    // アニメーション
    requestAnimationFrame(animate);
    // 加速度センサに応じてちょうどよく回転する
    controls.update();
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.drawImage(video, 0, 0,video.videoWidth, video.videoHeight);
    // if (video.readyState === video.HAVE_ENOUGH_DATA) {
    //     if (backgroundTexture) backgroundTexture.needsUpdate = true;
    // }
    renderer.render(scene, camera);
}
