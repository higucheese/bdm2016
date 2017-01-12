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
renderer.setSize( window.innerWidth, window.innerHeight );
// 背景色を設定
renderer.setClearColor(0xeeeeee, 1.0);
// body要素にcanvas要素を追加
canvasFrame.appendChild( renderer.domElement );

// シーンの作成
scene = new THREE.Scene();

// カメラを作成
camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
// カメラの位置を設定
camera.position.set(100, 100, 100);
// カメラの向きを設定
camera.lookAt( {x: 0, y: 10, z: 0} );

// マウスでのカメラのコントロール
controls = new THREE.TrackballControls(camera);

// テクスチャの作成
// instantiate a loader
var loader = new THREE.TextureLoader();
loader.crossOrigin = '*';
loader.load('texture2.png',
    texture => { // onLoad
        //planeを作成
        var planegeometry = new THREE.PlaneGeometry(100, 100);
        var material = new THREE.MeshBasicMaterial({map: texture});
        var plane = new THREE.Mesh(planegeometry, material);
        plane.material.side = THREE.DoubleSide;
        plane.position.set(0,0,0);
        plane.rotation.x = 90 * Math.PI / 180;

        //sceneにplaneを追加（表示）
        scene.add(plane);

        var geometry = new THREE.BoxGeometry(10, 10, 10);
        var material = new THREE.MeshBasicMaterial({ map: texture });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 20, 0);
        scene.add(cube);
    }
);

animate(); // アニメーションを描画
function animate() {
    // アニメーション
    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
}
