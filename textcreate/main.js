(function() {
	var viewtext = "webfontを使用して、フォントをCanvasに描き、\nそれをテクスチャ化して表示した。\nPixi.jsとThree.jsの併合に比べ、\nやはりこちらの方が高速だ。\n" + "テクスチャのuvをずらす典型的なやり方ではあるが、\n描画部分がやはりThree.js等ライブラリ使用に比べ大変。\n" + "テキストを表示するだけであればPixi.jsの方が優秀だし、\n割と用途が限られるかもしてないが個人的には満足度90%だ。\n残りの10%は文字を良く見れば分かる。";
	
	var fontgen = new fontGenerator(viewtext);
	fontgen.create(function(){
		var WIDTH = window.innerWidth;
		var HEIGHT = window.innerHeight;
		var light;
		var renderer, scene, camera;
		var canvas3d = document.getElementById('canvas3d');
		var meshs;

		(function init3D() {
			canvas3d.width = WIDTH;
			canvas3d.height = HEIGHT;
			renderer = new THREE.WebGLRenderer({
				canvas: canvas3d
			});
			renderer.setSize(WIDTH, HEIGHT);
			renderer.setClearColor(0x000000, 1);
			renderer.autoClear = false;
			renderer.autoClearColor = false;
			renderer.autoClearDepth = false;
			renderer.autoClearStencil = false;
			camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 0.001, 1000);
			camera.position.set(0, 0, 10);
			scene = new THREE.Scene();
			scene.add(new THREE.AmbientLight(0x303030));
			light = new THREE.DirectionalLight(0xFFFFFF);
			light.position.set(1, 1, 1);
			scene.add(light);
			const CELL_NUM = 15;
			const geometry = new THREE.Geometry();
			// Box
			for (let i = 0; i < CELL_NUM; i++) {
				for (let j = 0; j < CELL_NUM; j++) {
					for (let k = 0; k < CELL_NUM; k++) {
						// 立方体個別の要素を作成
						const sampleGeometry = new THREE.BoxGeometry(2, 2, 2);
						// 座標調整の行列を作成
						const matrix = new THREE.Matrix4();
						matrix.makeTranslation(4 * (i - CELL_NUM / 2), 4 * (j - CELL_NUM / 2), 4 * (k - CELL_NUM / 2));
						// ジオメトリをマージ（結合）
						geometry.merge(sampleGeometry, matrix);
					}
				}
			}
			// マテリアルを作成
			const material = new THREE.MeshNormalMaterial();
			// メッシュを作成
			meshs = new THREE.Mesh(geometry, material);
			scene.add(meshs);
		})();

		// WebGLコンテキストを設定
		var canvas = document.getElementById('canvas');
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
		
		
		var stats = new Stats();
		stats.setMode(0);
		document.body.appendChild(stats.domElement);
		// WebGLコンテキストを設定
		
		var texture2d = new Texture2d(gl); 

		texture2d.createTextbuffer(256);//引数:最大表示文字数(def:256)

		var tex = null;
		var tex2 = null;
		// テクスチャを読み込み
		var img = new Image();
		img.src = 'beath.jpg';
		var img2 = new Image();
		img2.src = 'mesframe14_blue.png';
		
		var font = new Image();
		font.src = fontgen.createurl();
		
		texture2d.LoadManager([img,img2,font],function(){
			texture2d.setFontTexture(font);
			texture2d.font = fontgen.createRect();
			tex = texture2d.setTexture(img);
			tex.y = -canvas.height / 2;
			tex2 = texture2d.setTexture(img2);
			tex2.x = -canvas.width / 2;
			glrender();
		});
		
		var count = 0;
		var test = 0;

		// テキスト描画
		function glrender() {
			requestAnimationFrame(glrender);
			if (stats) stats.update();
			gl.clearColor(0.0, 0.0, 0.0, 0.0);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			texture2d.drawTexture(tex);
			texture2d.drawTexture(tex2);

			texture2d.textAlign = 'left';
			test++;
			if (test % 4 == 0) {
				count++;
				if (count > viewtext.length) {
					count = 0;
				}
				// テキストフィールドにデータを渡す処理
				texture2d.drawText(viewtext.substring(0, count), -canvas.width / 2, canvas.height / 2 - 42,[1, 1, 1, 1]);
				
			}

			texture2d.fontDraw();
			
			
			gl.flush();
			meshs.rotation.x += Math.PI / 180;
			meshs.rotation.y += Math.PI / 180;
			renderer.render(scene, camera);
		}
		
		});
})();