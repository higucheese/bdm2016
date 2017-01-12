var canvasFrame;
var camera;
var scene;
var renderer;

// キャンバスフレームDOM要素の取得
canvasFrame = document.getElementById('canvas_frame');
// レンダラーを作成
renderer = new THREE.WebGLRenderer();
// canvas要素のサイズを設定
renderer.setSize( window.innerWidth, window.innerHeight );
// 背景色を設定
renderer.setClearColor(0xEEEEEE, 1.0);
// body要素にcanvas要素を追加
canvasFrame.appendChild( renderer.domElement );
// シーンの作成
scene = new THREE.Scene();
// ウインドウサイズが変更された際のイベントを登録

// カメラを作成
camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );
// カメラの位置を設定
camera.position.set(100,100,100);
// カメラの向きを設定
camera.lookAt( {x: 0, y: 0, z: 0} );


// テクスチャの作成
var texture = THREE.ImageUtils.loadTexture( 'texture2.png' );
texture.anisotropy = renderer.getMaxAnisotropy();
// マテリアルオブジェクトを作成
var material = new THREE.MeshBasicMaterial( { map: texture } );

//planeを作成
var planegeometry = new THREE.PlaneGeometry( 100, 100, 64, 64 );
var plane = new THREE.Mesh( planegeometry, material );

//sceneにplaneを追加（表示）
scene.add( plane );

animate(); // アニメーションを描画
function animate() {
    // アニメーション
    requestAnimationFrame( animate );

    renderer.render( scene, camera );
}
