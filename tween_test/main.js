var canvas;
var sprite;
var stage;
var spriteArea;
var renderer;
var stats;
var progressBar;
var progressBarWidth;
var log;
var line;
var posX, posY;
var widthD,heightD;
var selecter;
var star;
var oldmouseposx;
var oldmouseposy;
var touchstart_bar;
var dragging;
var anims = new Array();
var times = new Array();
var x, y;
var tint;
var width, height;
var rotation;
var repeat;
var ease;
var delay;
var time;
var content;
var touchstart_bar;
const offsetX = 1.43;
const offsetY = 1.18;
(function initLoad() {
	canvas = document.getElementById('canvas');
	var ua = navigator.userAgent;
	if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
		canvas.addEventListener('touchstart', function(e) {
			touchstarts(e);
		}, false);
		canvas.addEventListener('touchmove', function(e) {
			touchmoves(e);
		}, false);
		canvas.addEventListener('touchend', function(e) {
			var mouseX = e.pageX * offsetX;
			var mouseY = e.pageY * offsetY;
			clickUpact(mouseX, mouseY);
		}, false);
	} else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
		canvas.addEventListener('touchstart', function(e) {
			touchstarts(e);
		}, false);
		canvas.addEventListener('touchmove', function(e) {
			touchmoves(e);
		}, false);
		canvas.addEventListener('touchend', function(e) {
			var mouseX = e.pageX * offsetX;
			var mouseY = e.pageY * offsetY;
			clickUpact(mouseX, mouseY);
		}, false);
	} else {
		var mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
		$('#canvas').on(mousewheelevent, function(e) {
			e.preventDefault();
			var mouseX = e.pageX * offsetX;
			var mouseY = e.pageY * offsetY;
			var delta = e.originalEvent.deltaY ? -(e.originalEvent.deltaY) : e.originalEvent.wheelDelta ? e.originalEvent.wheelDelta : -(e.originalEvent.detail);
			if (delta < 0) {
				// マウスホイールを下にスクロールしたときの処理を記載
				zoomin(mouseX, mouseY, 0.99);
			} else {
				// マウスホイールを上にスクロールしたときの処理を記載
				zoomin(mouseX, mouseY, 1.01);
			}
			widthD.value = sprite.width;
		heightD.value = sprite.height;
		});
		canvas.onmousedown = function(e) {
			mousedown(e);
		};
		canvas.onmousemove = function(e) {
			mousemove(e);
		};
		canvas.onmouseup = function(e) {
			var mouseX = e.pageX * offsetX;
			var mouseY = e.pageY * offsetY;
			clickUpact(mouseX, mouseY);
		};
	}
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	document.getElementById("time").value = 0.0;
	document.getElementById("rotation").value = 0;
	document.getElementById("repeat").value = 0;
	document.getElementById("delay").value = 0;
	log = document.getElementById("logging");
	posX = document.getElementById("posX");
	posY = document.getElementById("posY");
	widthD = document.getElementById("width");
	heightD = document.getElementById("height");
	
	writeLog("width:" + canvas.width + " height:" + canvas.height);
	selecter = false;
	dragging = false;
	time = 0.0;
	x = 0;
	y = 0;
	tint = 0;
	width = 0;
	height = 0;
	rotation = 0;
	repeat = undefined;
	ease = undefined;
	delay = undefined;
	content = {
	"pos": {
		"x": 0.5,
		"y": 0.5
	},
	"texture": "data:"
	};
	stage = new PIXI.Container();
	renderer = PIXI.autoDetectRenderer(canvas.width, canvas.height, {
		view: canvas,
		antialiasing: true,
		preserveDrawingBuffer: true
	}, false, true);
	document.body.appendChild(renderer.view);
	spriteArea = new PIXI.Container();
	line = new TimelineMax();
	jsonLoad2();
	Init();
})();

function writeLog(logtext) {
	log.innerHTML += logtext + "<br>";
}

function chack_functions(source) {
	var propNames = [];
	var o = source;
	while (o) {
		propNames = propNames.concat(Object.getOwnPropertyNames(o));
		o = Object.getPrototypeOf(o);
	}
	console.log(propNames);
}

function jsonSave() {
	var stjson = JSON.stringify(content);
	var blob = new Blob([stjson], {
		"type": "text/plain"
	});
	if (window.navigator.msSaveBlob) {
		window.navigator.msSaveBlob(blob, "data.json");
	} else {
		var url = window.URL.createObjectURL(blob);
		document.getElementById("download").href = window.URL.createObjectURL(blob);
	}
}

function jsonLoad2() {
	var reader = new FileReader();
	$("#jfile").change(function() {
		// 選択ファイルの有無をチェック
		if (!this.files.length) {
			alert('ファイルが選択されていません');
			return;
		}
		// Formからファイルを取得
		var file = this.files[0];
		reader.onload = function(evt) {
			content = JSON.parse(evt.target.result)
			if (sprite) {
				spriteArea.removeChild(sprite);
			}
			var farTexture = PIXI.Texture.fromImage(content.texture, false, PIXI.SCALE_MODES.NEAREST);
			farTexture.baseTexture.addListener("loaded", function() {
				var texture_width = farTexture.width;
				var texture_height = farTexture.height;
				sprite = new PIXI.Sprite(farTexture);
				sprite.scale.set(canvas.width / texture_width, canvas.height / texture_height);
				posX.value = 0;
				posY.value = 0;
				widthD.value = sprite.width;
				heightD.value = sprite.height;
				if (star) {
					star.x = canvas.width * content.pos.x;
					star.y = canvas.height * content.pos.y;
				}
				spriteArea.addChild(sprite);
			});
		};
		reader.readAsText(file);
	});
}

function TLoad(filedata) {
	if (sprite) {
		spriteArea.removeChild(sprite);
	}
	var farTexture = PIXI.Texture.fromImage(filedata, false, PIXI.SCALE_MODES.NEAREST);
	content.texture = filedata;
	farTexture.baseTexture.addListener("loaded", function() {
		var texture_width = farTexture.width;
		var texture_height = farTexture.height;
		sprite = new PIXI.Sprite(farTexture);
		posX.value = 0;
		posY.value = 0;
		widthD.value = sprite.width;
		heightD.value = sprite.height;
		spriteArea.addChild(sprite);
	});
}

function spload() {
	var reader = new FileReader();
	$("#ufile").change(function() {
		// 選択ファイルの有無をチェック
		if (!this.files.length) {
			alert('ファイルが選択されていません');
			return;
		}
		// Formからファイルを取得
		var file = this.files[0];
		if (!file.type.match(/image/)) {
			alert('画像ファイルを選んでください');
			return;
		}
		reader.onload = function(evt) {
			TLoad(reader.result);
		};
		reader.readAsDataURL(file);
	});
}

function Add() 
{
	posSet();
	sizeSet();
	var anim = {
		x: x ? x : 0,
		y: y ? y : 0,
		tint: tint ? tint : undefined,
		/*色*/
		width: width ? width : undefined,
		height: height ? height : undefined,
		delay: delay ? delay : undefined,
		rotation: rotation ? rotation : 0, //3.14*2.0
		repeat: repeat ? repeat : 0, // 繰り返し回数指定 -1はループ
		ease: ease ? ease : undefined // 加減速の種類
	};
	var list = document.getElementById("list");
	if (time == 0) {
		list.innerHTML = "時間が0です";
		return;
	}
	list.innerHTML = '';
	anims.push(anim);
	times.push(time);
	writeLog("アニメの数" + anims.length);
	for (var i = 0; i < anims.length; i++) {
		var animls = anims[i];
		var astr = '';
		astr += (times[i] ? times[i] : "") + ":";
		astr += (animls.x ? animls.x : "") + ":";
		astr += (animls.y ? animls.y : "") + ":";
		astr += (animls.tint ? animls.tint : "") + ":";
		astr += (animls.width ? animls.width : "") + ":";
		astr += (animls.height ? animls.height : "") + ":";
		astr += (animls.delay ? animls.delay : "") + ":";
		astr += (animls.rotation ? animls.rotation : "") + ":";
		astr += (animls.repeat ? animls.repeat : "") + ":";
		astr += (animls.ease ? animls.ease : "") + "<br>";
		list.innerHTML += astr;
	}

	x = 0;
	y = 0;
	tint = 0;
	width = 0;
	height = 0;
	rotation = 0;
	repeat = undefined;
	ease = undefined;
	delay = undefined;
}

function Remove() {
	anims.pop();
	times.pop();
	document.getElementById("list").innerHTML += "アニメーションを戻します<br>";
}

function allRemove() {
	anims.length = 0;
	times.length = 0;
	document.getElementById("list").innerHTML = "アニメーションを全消去します";
}

function Clear() {
	sprite.x = 0;
	sprite.y = 0;
	sprite.tint = rgb(255, 255, 255);
	sprite.width = canvas.width;
	sprite.height = canvas.height;
	sprite.rotation = 0;
	posX.value = 0;
	posY.value = 0;
	document.getElementById("rotation").value = 0;
	widthD.value = sprite.width;
	heightD.value = sprite.height;

	x = 0;
	y = 0;
	tint = 0;
	width = 0;
	height = 0;
	rotation = 0;
	repeat = undefined;
	ease = undefined;
	delay = undefined;
}
function timeSet() {
	var timel = document.getElementById("time").value;
	if (timel) time = timel;
}

function posSet() {
	var xl = posX.value;
	var yl = posY.value;
	if (xl && yl) {
		x = xl;
		y = yl;
	}
}

function colorSet() {
	var col = $('.jscolor').val();
	if (col) {
		var parse_col_val = parseInt(col, 16); //16進数文字列を10進数整数に変換
		tint = parse_col_val;
	}
}

function sizeSet() {
	var widthl = widthD.value;
	var heightl = heightD.value;
	if (widthl) {
		width = widthl;
	}
	if (heightl) {
		height = heightl;
	}
}

function rotSet() {
	var rotationl = document.getElementById("rotation").value;
	if (rotationl) {
		rotation = ToRadians(rotationl);
	}
}

function repeatSet() {
	var repeatl = document.getElementById("repeat").value;
	if (repeatl) repeat = repeatl;
}

function delaySet() {
	var delayl = document.getElementById("delay").value;
	if (delayl) delay = delayl;
}

function selectSpriteSet() {
	var selects = document.getElementById("selectSprite").value;
	switch (selects) {
		case 'Sprite':
			selecter = false;
			break;
		case 'Star':
			selecter = true;
			break;
		default:
			break;
	}
}

function easeSet() {
	var easel = document.getElementById("select").value
	switch (easel) {
		case 'No':
			ease = undefined;
			break;
		case 'Back.easeIn':
			ease = Back.easeIn;
			break;
		case 'Back.easeOut':
			ease = Back.easeOut;
			break;
		case 'Back.easeInOut':
			ease = Back.easeInOut;
			break;
		case 'Expo.easeIn':
			ease = Expo.easeIn;
			break;
		case 'Expo.easeOut':
			ease = Expo.easeOut;
			break;
		case 'Expo.easeInOut':
			ease = Expo.easeInOut;
			break;
		case 'Elastic.easeIn':
			ease = Elastic.easeIn;
			break;
		case 'Elastic.easeOut':
			ease = Elastic.easeOut;
			break;
		case 'Elastic.easeInOut':
			ease = Elastic.easeInOut;
			break;
		case 'Cubic.easeIn':
			ease = Cubic.easeIn;
			break;
		case 'Cubic.easeOut':
			ease = Cubic.easeOut;
			break;
		case 'Cubic.easeInOut':
			ease = Cubic.easeInOut;
			break;
		default:
			break;
	}
}

function PlayAnim() {
	line = new TimelineMax();
	for (var i = 0; i < anims.length; i++) {
		line.to(sprite, times[i] /*実行秒*/ , anims[i] /*アニメ*/ );
	}
	var farststate = anims[0];
	sprite.x = farststate.x;
	sprite.y = farststate.y;
	sprite.tint = farststate.tint;
	sprite.width = farststate.width;
	sprite.height = farststate.height;
	sprite.rotation = farststate.rotation;
	var pl = $('input[name=_radio]:checked').val();
	if (pl == 'play') {
		line.eventCallback("onComplete", function() {
			writeLog('onComplete');
		});
		line.play();
	} else {
		line.eventCallback("onReverseComplete", function() {
			writeLog('onReverseComplete');
		});
		line.reverse();
	}
}

function ToRadians(fDegrees) {
	return fDegrees * (3.1416 / 180.0);
}

function rgb(r, g, b) {
	return ((((r) & 0xff) << 16) | (((g) & 0xff) << 8) | ((b) & 0xff))
}

function Init() {
	stage.addChild(spriteArea);
	spload();
	sprite = new PIXI.Sprite(null);
	var farTex2 = PIXI.Texture.fromImage("https://asirias.github.io/pixijs_Noble/noble_test/star.png", true, PIXI.SCALE_MODES.NEAREST);
	farTex2.baseTexture.addListener("loaded", function() {
		farTex2.baseTexture.removeListener("loaded");
		star = new PIXI.Sprite(farTex2);
		star.x = canvas.width / 2;
		star.y = canvas.height / 2;
		stage.addChild(star);
		progressBar = new PIXI.DisplayObjectContainer();
		progressBar.position.set(0, canvas.height - 8)
		stage.addChild(progressBar);
		//Create the black background rectangle
		let innerBar = new PIXI.Graphics();
		innerBar.beginFill(0xFFFFFF);
		innerBar.lineStyle(2, 0xFFFFFF); //枠線の太さと色を指定
		innerBar.drawRect(0, 0, 128, 8);
		innerBar.endFill();
		progressBar.addChild(innerBar);
		//Create the front red rectangle
		let outerBar = new PIXI.Graphics();
		outerBar.beginFill(0xFF3300);
		outerBar.drawRect(0, 0, 128, 8);
		outerBar.endFill();
		progressBar.addChild(outerBar);
		progressBar.outer = outerBar;
		progressBarWidth = progressBar.outer.width;
	});
	// 画面回転時に向きをチェック
	window.addEventListener('resize', checkOrientation, false);
	stats = new Stats();
	stats.setMode(0);
	document.body.appendChild(stats.domElement);
	this.enterFrameHandler();
}

function clickact(mouseX, mouseY) {
	if (selecter) {
		content.pos.x = Math.round(mouseX / canvas.width * 100) / 100;
		content.pos.y = Math.round(mouseY / canvas.height * 100) / 100;
		star.x = mouseX;
		star.y = mouseY;
	} else {
		dragging = true;
		oldmouseposx = mouseX;
		oldmouseposy = mouseY;
	}
}

function clickdrag(mouseX, mouseY) {
	if (dragging) {
		sprite.position.x += (mouseX - oldmouseposx);
		sprite.position.y += (mouseY - oldmouseposy);

		oldmouseposx = mouseX;
		oldmouseposy = mouseY;
	}
}

function zoomin(x, y, bairitu) {
	if (sprite) {
		sprite.scale.x *= bairitu;
		sprite.scale.y *= bairitu;
		sprite.x = x - canvas.width / 2;
		sprite.y = y - canvas.height / 2;
	}
}

function mousedown(e) {
	var mouseX = e.pageX * offsetX;
	var mouseY = e.pageY * offsetY;
	clickact(mouseX, mouseY);
}

function mousemove(e) {
	if (!selecter) {
		var mouseX = e.pageX * offsetX;
		var mouseY = e.pageY * offsetY;
		clickdrag(mouseX, mouseY);
	}
}

function touchmoves(e) {
	var pagex = e.touches[0].pageX * offsetX;
	var pagey = e.touches[0].pageY * offsetY;
	if (!selecter) {
		//2本指だったらAndroidではgesturestartは使えない
		if (e.touches.length > 1) {
			var pagex2 = e.touches[1].pageX * offsetX;
			var pagey2 = e.touches[1].pageY * offsetY;
			var centor_posX = (pagex + pagex2) / 2.0;
			var centor_posY = (pagey + pagey2) / 2.0;
			//絶対値を取得
			var w_abs_move = Math.abs(pagex2 - pagex);
			var h_abs_move = Math.abs(pagey2 - pagey);
			//ムーブした時の面積
			var touchmove_bar = w_abs_move * h_abs_move;
			//はじめに2タッチ面積からムーブした時の面積を引く
			var area_bar = touchstart_bar - touchmove_bar;
			touchstart_bar = touchmove_bar;
			if (area_bar < 0) { //拡大する
				zoomin(centor_posX, centor_posY, 1.02);
			} else if (area_bar > 0) { //縮小する
				zoomin(centor_posX, centor_posY, 0.98);
			}
		}
		clickdrag(pageX, pageY);
	}
}

function touchstarts(e) {
	var pagex = e.touches[0].pageX * offsetX;
	var pagey = e.touches[0].pageY * offsetY;
	if (!selecter) {
		touchstart_bar = 0;
		//2本指だったらAndroidではgesturestartは使えない
		if (e.touches.length > 1) {
			//絶対値を取得
			var w_abs_start = Math.abs(e.touches[1].pageX * offsetX - pageX);
			var h_abs_start = Math.abs(e.touches[1].pageY * offsetY - pageY);
			//はじめに2本指タッチした時の面積
			touchstart_bar = w_abs_start * h_abs_start;
		}
	}
	clickact(pagex, pagey);
}

function clickUpact(mouseX, mouseY) {
	dragging = false;
	if (!selecter) {
		posX.value = sprite.position.x;
		posY.value = sprite.position.y;
		posSet();
		widthD.value = sprite.width;
		heightD.value = sprite.height;
		sizeSet();
	}
}

function capture() {
	progressBar.alpha = 0;
	renderer.render(spriteArea);
	var imgUrl = renderer.view.toDataURL("image/png");
	window.open(imgUrl);
	progressBar.alpha = 1;
}

function enterFrameHandler() {
	requestAnimationFrame(() => {
		this.enterFrameHandler()
	});
	if (stats) stats.update();
	if (line.isActive()) {
		var prog = line.progress();
		if (prog != 1.0) {
			progressBar.outer.width = progressBarWidth * prog;
		}
	}
	//Render the stage
	renderer.render(this.stage);
}

function checkOrientation() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	if (renderer) {
		renderer.width = canvas.width;
		renderer.height = canvas.height;
	}
}
