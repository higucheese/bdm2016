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

// シーンの作成
scene = new THREE.Scene();

// カメラを作成
camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
// カメラの位置を設定
camera.position.set(100, 100, 100);
// カメラの向きを設定
camera.lookAt({x: 0, y: 10, z: 0});

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

        // var material = new THREE.MeshBasicMaterial( { color: 0xeeee00 } );
        var material = new THREE.MeshBasicMaterial({map: texture});
        var shape = new THREE.Shape();
        shape.moveTo(0, 1);
        shape.lineTo(2, 1);
        shape.lineTo(1, 0);
        shape.lineTo(0, 0);
        var geometry = new THREE.ShapeGeometry(shape);
        // var geometry = new THREE.ExtrudeGeometry(shape, {amount: 100, bevelEnabled: false,
        //     extrudeMaterial: 0,
        //     material: 1,
        //     uvGenerator: BoundingUVGenerator
        // });

        polygon = new THREE.Mesh(geometry, material);
        polygon.scale.set(10, 10, 1);
        polygon.material.side = THREE.DoubleSide;
        scene.add(polygon);

        var geometry = new THREE.BoxGeometry(10, 10, 10);
        var material = new THREE.MeshBasicMaterial({map: texture});
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

BoundingUVGenerator = {
    generateTopUV: function( geometry, extrudedShape, extrudeOptions, indexA, indexB, indexC) {
        var ax = geometry.vertices[ indexA ].x,
            ay = geometry.vertices[ indexA ].y,

            bx = geometry.vertices[ indexB ].x,
            by = geometry.vertices[ indexB ].y,

            cx = geometry.vertices[ indexC ].x,
            cy = geometry.vertices[ indexC ].y,

            bb = extrudedShape.getBoundingBox(),
            bbx = bb.maxX - bb.minX,
            bby = bb.maxY - bb.minY;

        return [
            new THREE.UV( ( ax - bb.minX ) / bbx, 1 - ( ay - bb.minY ) / bby ),
            new THREE.UV( ( bx - bb.minX ) / bbx, 1 - ( by - bb.minY ) / bby ),
            new THREE.UV( ( cx - bb.minX ) / bbx, 1 - ( cy - bb.minY ) / bby )
        ];
    },

    generateBottomUV: function( geometry, extrudedShape, extrudeOptions, indexA, indexB, indexC) {
        return this.generateTopUV( geometry, extrudedShape, extrudeOptions, indexA, indexB, indexC );
    },

    generateSideWallUV: function( geometry, extrudedShape, wallContour, extrudeOptions,
                                  indexA, indexB, indexC, indexD, stepIndex, stepsLength,
                                  contourIndex1, contourIndex2 ) {
        var ax = geometry.vertices[ indexA ].x,
            ay = geometry.vertices[ indexA ].y,
            az = geometry.vertices[ indexA ].z,

            bx = geometry.vertices[ indexB ].x,
            by = geometry.vertices[ indexB ].y,
            bz = geometry.vertices[ indexB ].z,

            cx = geometry.vertices[ indexC ].x,
            cy = geometry.vertices[ indexC ].y,
            cz = geometry.vertices[ indexC ].z,

            dx = geometry.vertices[ indexD ].x,
            dy = geometry.vertices[ indexD ].y,
            dz = geometry.vertices[ indexD ].z;

        var amt = extrudeOptions.amount,
            bb = extrudedShape.getBoundingBox(),
            bbx = bb.maxX - bb.minX,
            bby = bb.maxY - bb.minY;

        if ( Math.abs( ay - by ) < 0.01 ) {
            return [
                new THREE.UV( ax / bbx, az / amt),
                new THREE.UV( bx / bbx, bz / amt),
                new THREE.UV( cx / bbx, cz / amt),
                new THREE.UV( dx / bbx, dz / amt)
            ];
        } else {
            return [
                new THREE.UV( ay / bby, az / amt ),
                new THREE.UV( by / bby, bz / amt ),
                new THREE.UV( cy / bby, cz / amt ),
                new THREE.UV( dy / bby, dz / amt )
            ];
        }
    }
};
