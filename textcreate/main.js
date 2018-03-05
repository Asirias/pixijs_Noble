(function() {
	   	var viewtext = "webfontを使用して、フォントをCanvasに描き、\nそれをテクスチャ化して表示した。\nPixi.jsとThree.jsの併合に比べ、\nやはりこちらの方が高速だ。\n" + "テクスチャのuvをずらす典型的なやり方ではあるが、\n描画部分がやはりThree.js等ライブラリ使用に比べ大変。\n" + "テキストを表示するだけであればPixi.jsの方が優秀だし、\n割と用途が限られるかもしてないが個人的には満足度90%だ。\n残りの10%は文字を良く見れば分かる。";
	   var f = new fontGenerator(viewtext);
	   f.create(function()
	{
		var WIDTH = window.innerWidth;
		var HEIGHT = window.innerHeight;

		// WebGLコンテキストを設定
		var canvas = document.getElementById('canvas');

		canvas.width = WIDTH;
		canvas.height = HEIGHT;
		var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

		var stats = new Stats();
		stats.setMode(0);
		document.body.appendChild(stats.domElement);
		// WebGLコンテキストを設定
		Font.init(gl);
		var font = new Font(512); //引数:最大表示文字数(def:256)
		// テクスチャを読み込み
		var img = new Image();
		img.onload = function() {
			font.setTexture(img);
			font.font = f.createRect();
			glrender();
		};
		img.src = f.createurl();
		var count = 0;
		// テキスト描画
		function glrender() {
			requestAnimationFrame(glrender);
			if (stats) stats.update();
			gl.clearColor(0.0, 0.5, 0.5, 1.0);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			
			font.textAlign = 'left';
			count++;
			if (count <= viewtext.length) {
				// テキストフィールドにデータを渡す処理
				font.drawText(viewtext.substring(0, count), -canvas.width / 2, canvas.height / 2 - 42);
			} else count = 0;
			font.draw();

			gl.flush();

		}
	});
})();