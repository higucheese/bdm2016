window.addEventListener("load", function() {

	// ## Snipet to setup user media (camera, mike) by WebRTC
	// This code is tested on GoogleChrome, <del>Firefox</del>, Opera,
	// and not on IE.
	// In addition, only web camera is checked.
	// ### Hints
	// - http://www.webrtc.org/running-the-demos
	// - http://www.html5rocks.com/en/tutorials/webrtc/basics/
	// - https://dev.mozilla.jp/2012/08/getusermedia-is-ready-to-roll/
	var setupUserMedia = function(fn) {
		var getUserMedia = navigator.getUserMedia ||
			navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
			navigator.msGetUserMedia;
		if (!getUserMedia)
			return fn("WebRTC is not supported.");
		getUserMedia.call(navigator, {
			video: true,
			audio: true,
			toString: function() { return "audio, video"; } // for legacy
		}, function(stream) {
			var video = document.createElement("video");
			if (navigator.mozGetUserMedia) {
				// directly assign `stream` to `video.src` on Firefox (see third hint)
				// ---> but not working on nightly, why?
				video.src = stream;
			} else {
				var URL = window.URL || window.webkitURL; // need prefix on Webkit
				video.src = URL.createObjectURL(stream);
			}
			// wait a moment because the video size cannot be got immediately (why?)
			video.play(); // need play in order to do that
			setTimeout(function wait() {
				if (video.videoWidth > 0)
					return fn(null, video); // OK, go next
				setTimeout(wait, 50);
			}, 10);
		}, function(err) {
			fn(err);
		});
	};



	setupUserMedia(function(err, video) {
		if (err) return console.log(err);

		var width = 400, height = 300;
		// できればWebGLRendererが良いがOperaではシェーダの関係でエラーが出る模様
		// Firefox, GoogleChromeは大丈夫そう。
		//var renderer = new THREE.WebGLRenderer({antialias: true});
		var renderer = new THREE.CanvasRenderer();
		renderer.setSize(width, height);
		document.body.appendChild(renderer.domElement);
		var camera = new THREE.PerspectiveCamera(45, width/height, 1, 10000);
		camera.position.set(0, 300, 1000);
		camera.lookAt(new THREE.Vector3(0, 0, 0));
		var scene = new THREE.Scene();

		// create mesh for video
		var canvas = document.createElement("canvas");
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;
		var ctx = canvas.getContext("2d");
		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		var texture = new THREE.Texture(canvas);
		texture.minFilter = THREE.LinearFilter;
		texture.magFilter = THREE.LinearFilter;
		var material = new THREE.MeshBasicMaterial({map: texture, overdraw: true});
		// 色々変えると楽しい
		//var geometry = new THREE.PlaneGeometry(canvas.width, canvas.height, 4, 4);
		//var geometry = new THREE.SphereGeometry(200, 16, 16);
		var geometry = new THREE.CubeGeometry(300, 300, 300);
		var videoMesh = new THREE.Mesh(geometry, material);
		scene.add(videoMesh);

		(function mainLoop() {
			requestAnimationFrame(mainLoop);
			ctx.drawImage(video, 0, 0);
			if (texture) texture.needsUpdate = true;
			videoMesh.rotation.y += 0.005;
			renderer.render(scene, camera);
		})();
	});

});
