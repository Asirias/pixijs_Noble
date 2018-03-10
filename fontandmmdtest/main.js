(function() {
	var viewtext = "webfontを使用して、フォントをCanvasに描き、\nそれをテクスチャ化して表示した。\nPixi.jsとThree.jsの併合に比べ、\nやはりこちらの方が高速だ。\n" + "テクスチャのuvをずらす典型的なやり方ではあるが、\n描画部分がやはりThree.js等ライブラリ使用に比べ大変。\n" + "テキストを表示するだけであればPixi.jsの方が優秀だし、\n割と用途が限られるかもしてないが個人的には満足度90%だ。\n残りの10%は文字を良く見れば分かる。";
	var fontgen = new fontGenerator(viewtext);
	fontgen.create(function() {
		var WIDTH = window.innerWidth;
		var HEIGHT = window.innerHeight;
		var light;
		var renderer, scene, camera;
		var canvas3d = document.getElementById('canvas3d');
		var meshs;
		var effect;
		var mesh;
		var windowHalfX = window.innerWidth / 2;
		var windowHalfY = window.innerHeight / 2;
		var helper;
		var clock = new THREE.Clock();
		var modelloaded = false;
		var texloaded = false;
		var stats = new Stats();
		stats.setMode(0);
		(function init3D() {
			canvas3d.width = WIDTH;
			canvas3d.height = HEIGHT;
			renderer = new THREE.WebGLRenderer({
				canvas: canvas3d
			});
			renderer.setSize(WIDTH, HEIGHT);
			renderer.setClearColor(0x000000, 1);
			renderer.autoClear = false;
			renderer.autoClearDepth = false;
			renderer.autoClearStencil = false;
			camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
			camera.position.z = 30;
			effect = new THREE.OutlineEffect(renderer);
			scene = new THREE.Scene();
			scene.add(new THREE.AmbientLight(0x666666));
			scene.background = new THREE.Color(0xffffff);
			var gridHelper = new THREE.PolarGridHelper(30, 10);
			gridHelper.position.y = -10;
			scene.add(gridHelper);
			light = new THREE.DirectionalLight(0x887766);
			light.position.set(-1, 1, 1).normalize();
			scene.add(light);
			var html_text = document.getElementById("text");
			var onProgress = function(xhr) {
				if (xhr.lengthComputable) {
					var percentComplete = xhr.loaded / xhr.total * 100;
					html_text.innerHTML = Math.round(percentComplete, 2) + '% downloaded';
				}
			};
			var onError = function(xhr) {
				html_text.innerHTML = 'Error';
			};
			document.addEventListener('click', function() {
				if (texloaded && modelloaded) {
					texloaded = false;
					modelloaded = false;
					soundload();
					html_text.innerHTML = '';
					document.body.appendChild(stats.domElement);
					window.requestAnimationFrame(glrender);
				}
			});
			var modelFile = 'MMD_/Alicia_solid.pmx';
			var vmdFiles = ['mmd/vmds/wavefile_v2.vmd'];
			helper = new THREE.MMDHelper();
			var loader = new THREE.MMDLoader();
			loader.load(modelFile, vmdFiles, function(object) {
				mesh = object;
				mesh.position.y = -10;
				scene.add(mesh);
				helper.add(mesh);
				helper.setAnimation(mesh);
				/*
				 * Note: You're recommended to call helper.setPhysics()
				 *       after calling helper.setAnimation().
				 */
				helper.setPhysics(mesh);
				helper.unifyAnimationDuration({
					afterglow: 2.0
				});
				modelloaded = true;
			}, onProgress, onError);
			window.addEventListener('resize', onWindowResize, false);
			var phongMaterials;
			var originalMaterials;

			function makePhongMaterials(materials) {
				var array = [];
				for (var i = 0, il = materials.length; i < il; i++) {
					var m = new THREE.MeshPhongMaterial();
					m.copy(materials[i]);
					m.needsUpdate = true;
					array.push(m);
				}
				phongMaterials = array;
			}
		})();

		function fullscreen(container) {
			if (container.requestFullscreen) {
				container.requestFullscreen();
			} else if (container.msRequestFullscreen) {
				container.msRequestFullscreen();
			} else if (container.mozRequestFullScreen) {
				container.mozRequestFullScreen();
			} else if (container.webkitRequestFullscreen) {
				container.webkitRequestFullscreen();
			}
		}

		function soundload() {
			var listener = new THREE.AudioListener();
			camera.add(listener);
			var audioLoader = new THREE.AudioLoader();
			sound = new THREE.PositionalAudio(listener);
			audioLoader.load('mmd/audios/wavefile_short.mp3', function(buffer) {
				sound.setBuffer(buffer);
				sound.setRefDistance(10);
				mesh.add(sound);
				sound.setVolume(1);
				setTimeout(function() {
					sound.play();
				}, 5333);
			});
		}
		// WebGLコンテキストを設定
		var canvas = document.getElementById('canvas');
		var controls = new THREE.OrbitControls(camera, canvas);

		function onWindowResize() {
			windowHalfX = window.innerWidth / 2;
			windowHalfY = window.innerHeight / 2;
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			effect.setSize(window.innerWidth, window.innerHeight);
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}
		canvas.width = WIDTH;
		canvas.height = HEIGHT;
		var gl = canvas.getContext('webgl2', {
			stencil: false,
			antialias: false,
			depth: false
		}) || canvas.getContext('bitmaprenderer', {
			stencil: false,
			antialias: false,
			depth: false
		}) || canvas.getContext('webgl', {
			stencil: false,
			antialias: false,
			depth: false
		}) || canvas.getContext('experimental-webgl', {
			stencil: false,
			antialias: false,
			depth: false
		});
		// WebGLコンテキストを設定
		var count = 0;
		var texture2d = new Texture2d(gl);
		texture2d.createTextbuffer(256); //引数:最大表示文字数(def:256)
		texture2d.addTexturebuffer(1);
		var tex = null;
		var tex2 = null;
		// テクスチャを読み込み
		var img = new Image();
		img.src = 'mesframe14_blue.png';
		var font = new Image();
		font.src = fontgen.createurl();
		texture2d.LoadManager([img, font], function() {
			texture2d.setFontTexture(font);
			texture2d.font = fontgen.createRect();
			fontgen = null; //deleteで解放せずGCに任せる
			tex = texture2d.setTexture(img);
			tex.x = -canvas.width / 2;
			tex.color = [1, 1, 1, 0.5];
			start = performance.now();
			texture2d.draw_opset();
			texloaded = true;
		});
		var timer = 0;

		function update(c) {
			mesh.position.x = 30 * Math.cos(timer);
			mesh.position.z = 30 * Math.sin(timer);
			timer += c;
		}

		function render(c) {
			helper.animate(c);
			effect.render(scene, camera);
		}
		// テキスト描画
		function glrender() {
			requestAnimationFrame(glrender);
			var c = clock.getDelta();
			if (stats) stats.update();
			gl.clearColor(0.0, 0.0, 0.0, 0.0);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			texture2d.updateTexture(tex);
			texture2d.drawTexture(tex);
			texture2d.textAlign = 'left';
			if (count > viewtext.length) count = 0;
			else count++;
			// テキストフィールドにデータを渡す処理
			texture2d.drawText(viewtext.substring(0, count), -canvas.width / 2, canvas.height / 2 - 150, [1, 1, 1, 1]);
			texture2d.fontDraw();
			gl.flush();
			update(c);
			render(c);
		}
	});
})();
