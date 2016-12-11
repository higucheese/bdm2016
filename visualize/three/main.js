// -*- coding: utf-8 -*-

// display size
var WIDTH = 640;
var HEIGHT = 480;

// set scene
var scene = new THREE.Scene();

// set renderer
/* if a device is too poor, you should use CanvasRender*/
var renderer = new THREE.WebGLRenderer();
renderer.setSize(WIDTH, HEIGHT);
document.body.appendChild( renderer.domElement );

// set camera
var camera = new THREE.PerspectiveCamera( 75, WIDTH/HEIGHT, 0.1, 1000 );
camera.position.z = 5;

// set controls
var controls = new THREE.OrbitControls(camera);
// zoom
controls.userZoom = true;
controls.userZoomSpeed = 1.0;
// rotate
controls.userRotate = true;
controls.userRotateSpeed = 1.0;
// pan
controls.userPan = true;
controls.userPanSpeed = 2.0;
// auto rotate
//controls.autoRotate = true;
//controls.autoRotateSpeed = 2.0;
// polar angle
controls.minPolarAngle = 0; 
controls.maxPolarAngle = Math.PI;
// distance
controls.minDistance = 0;
controls.maxDistance = Infinity;


// draw axis
var AXIS_SIZE = 10;
var axis = new THREE.AxisHelper(AXIS_SIZE);
axis.position.x = 2;
axis.position.y = -5;
axis.position.z = -15;
scene.add( axis );

// draw grid
var GRID_SIZE = 10;
var GRID_STEP = 4;
var grid = new THREE.GridHelper(GRID_SIZE, GRID_STEP);
grid.position.x = 2;
grid.position.y = -5;
grid.position.z = -15;
scene.add( grid );

// draw cube

var geometry = new THREE.BoxGeometry( 1, 1, 1 );
var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new THREE.Mesh( geometry, material );
scene.add( cube );

// animation
var render = function () {
  requestAnimationFrame( render );

  //cube.rotation.x += 0.1;
  //cube.rotation.y += 0.1;

  controls.update();
  renderer.clear();
  renderer.render(scene, camera);
};

render();
