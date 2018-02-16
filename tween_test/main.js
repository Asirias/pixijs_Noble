var canvas;

var sprite;
var stage;
var renderer;
var stats;
//定義したTimelineに対して一時停止、再生、逆再生をかける。
var progressBar;
var progressBarWidth;
var log;
var line;

var posX,posY;
(function initLoad()
{
	canvas = document.getElementById('canvas');
	var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        canvas.addEventListener('touchstart',function(e){
		clickact(e);
	},false);
	canvas.addEventListener('touchmove', function(e) {
		var mouseX = e.pageX;
		var mouseY = e.pageY;
		clickmove(mouseX,mouseY);
		},false);
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        canvas.addEventListener('touchstart',function(e){
		clickact(e);
	},false);
	canvas.addEventListener('touchmove', function(e) {
		var mouseX = e.pageX;
		var mouseY = e.pageY;

		},false);
    }else{
	canvas.onmousedown = function( e ) {
		clickact(e);
	};
	canvas.onmousemove = function( e ) {
		var mouseX = e.pageX;
		var mouseY = e.pageY;
		clickmove(mouseX,mouseY);
	};
    }
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	document.getElementById("time").value = 5;
	document.getElementById("rotation").value = 0;
	document.getElementById("repeat").value = 0;
	document.getElementById("delay").value = 0;
	
	log = document.getElementById("logging");

	posX = document.getElementById("posX");
	posY = document.getElementById("posY");
	
	writeLog("width:"+canvas.width + " height:" +canvas.height);
	
	stage = new PIXI.Container();
        renderer = PIXI.autoDetectRenderer(
        canvas.width,
        canvas.height,
        {view: canvas,antialiasing: true},false,true
    );
	line = new TimelineMax();
	
	Init();
})();
function writeLog(logtext)
{
	log.innerHTML += logtext + "<br>";
}
function chack_functions(source)
{
	var propNames = [];
	var o = source;
	while ( o ) {
    propNames = propNames.concat( Object.getOwnPropertyNames( o ) );
    o = Object.getPrototypeOf( o );
	}
	console.log(propNames);
}
var anims = new Array();
var times = new Array();

var x,y;
var tint;
var width,height;
var rotation;
var repeat;
var ease;
var delay;
var time;

function Add()
{
	var anim = {
	x: x?x:0,
	y: y?y:0,
	tint:tint?tint:rgb(255,255,255),/*色*/
	width: width?width:0,
	height: height?height:0,
	delay:delay?delay:undefined,
	rotation: rotation?rotation:0,//3.14*2.0
    repeat: repeat?repeat:1, // 繰り返し回数指定 -1はループ
    ease: ease?ease:Cubic.easeInOut// 加減速の種類
	};

	var list = document.getElementById("list");
	if(time == undefined){
		list.innerHTML = "時間を設定してください";
		return;
	}
	list.innerHTML = '';
	anims.push(anim);
	times.push(time);

	writeLog("アニメの数"+anims.length);
	for(var i = 0;i < anims.length;i++)
	{
		
		var animls = anims[i];
		var astr = '';
		astr += (times[i] ? times[i] : "") + ":";
		
		astr += (animls.x ? animls.x : "") + ":";
		astr += (animls.y ? animls.y : "") + ":";
		astr += (animls.tint? animls.tint : "") + ":";
		astr += (animls.width ? animls.width : "") + ":";
		astr += (animls.height ? animls.height : "") + ":";
		astr += (animls.delay ? animls.delay : "") + ":";
		astr += (animls.rotation ? animls.rotation : "") + ":";
		astr += (animls.repeat ? animls.repeat : "") + ":";
		astr += (animls.ease ? animls.ease : "") + ":" + "<br>";;

		list.innerHTML += astr;
	}
	time = undefined;
	x = undefined;
	y= undefined;
	tint= undefined;
	width= undefined;
	height= undefined;
	rotation= undefined;
	repeat= undefined;
	ease= undefined;
	delay= undefined;
}
function Remove()
{
	anims.pop();
	times.pop();
	document.getElementById("list").innerHTML += "アニメーションを戻します";
}
function allRemove()
{
	anims.length = 0;
	times.length = 0;
	document.getElementById("list").innerHTML = "アニメーションを全消去します";
}
function Clear()
{
	sprite.x = 0;
	sprite.y = 0;
	sprite.tint = rgb(255,255,255);
	sprite.width = canvas.width;
	sprite.height = canvas.height;
	sprite.rotation = 0;
	posX.value = 0;
	posY.value = 0;
	document.getElementById("rotation").value = 0;
	document.getElementById("width").value = sprite.width;
	document.getElementById("height").value = sprite.height;
	time = undefined;
	x = undefined;
	y= undefined;
	tint= undefined;
	width= undefined;
	height= undefined;
	rotation= undefined;
	repeat= undefined;
	ease= undefined;
	delay= undefined;
}
function timeSet()
{
	var timel = document.getElementById("time").value;
	if(timel)
	time = timel;
}
function posSet()
{
	var xl = posX.value;
	var yl = posY.value;
	if(xl && yl)
	{
		sprite.x = xl;
		sprite.y = yl;
		x = xl;
		y = yl;
	}
}
function colorSet()
{
	var col = $('.jscolor').val();
	if(col){
	var parse_col_val = parseInt(col, 16);//16進数文字列を10進数整数に変換
	tint = parse_col_val;
	sprite.tint = tint;
	}
}
function sizeSet()
{
	var widthl = document.getElementById("width").value;
	var heightl = document.getElementById("height").value;
	if(widthl){
	width = widthl;
	sprite.width = width;
	}
	if(heightl){
	height = heightl;
	sprite.height = height;
	}
}
function rotSet()
{
	var rotationl = document.getElementById("rotation").value;
	if(rotationl){
	rotation = ToRadians(rotationl);
	sprite.rotation = rotation;
	}
}
function repeatSet()
{
	var repeatl = document.getElementById("repeat").value;
	if(repeatl)
	repeat = repeatl;
}
function delaySet()
{
	var delayl = document.getElementById("delay").value;
	if(delayl)
	delay = delayl;
}
function easeSet()
{
	var easel = document.getElementById("select").value
	switch(easel)
	{
		case 'Back.easeIn':ease = Back.easeIn; break;
		case 'Back.easeOut':ease = Back.easeOut; break;
		case 'Back.easeInOut':ease = Back.easeInOut; break;
		
		case 'Expo.easeIn':ease = Expo.easeIn; break;
		case 'Expo.easeOut':ease = Expo.easeOut; break;
		case 'Expo.easeInOut':ease = Expo.easeInOut; break;
		
		case 'Elastic.easeIn':ease = Elastic.easeIn; break;
		case 'Elastic.easeOut':ease = Elastic.easeOut; break;
		case 'Elastic.easeInOut':ease = Elastic.easeInOut; break;
		
		case 'Cubic.easeIn':ease = Cubic.easeIn; break;
		case 'Cubic.easeOut':ease = Cubic.easeOut; break;
		case 'Cubic.easeInOut':ease = Cubic.easeInOut; break;
		default:break;
	}
}
function PlayAnim()
{
	line = new TimelineMax();

	for(var i = 0;i < anims.length;i++)
	{
		line.to(sprite,times[i]/*実行秒*/,anims[i]/*アニメ*/);
	}
	var farststate = anims[0];
	sprite.x = farststate.x;
	sprite.y = farststate.y;
	sprite.tint = farststate.tint;
	sprite.width = farststate.width;
	sprite.height = farststate.height;
	sprite.rotation = farststate.rotation;
	
	var pl = $('input[name=_radio]:checked').val();
	if(pl == 'play') {
		line.eventCallback("onComplete",function(){
		writeLog('onComplete');
	});
		line.play();
	}
	else {
		line.eventCallback("onReverseComplete",function(){
		writeLog('onReverseComplete');
	});
		line.reverse();
	}
}
function ToRadians(fDegrees) 
{ 
	return fDegrees * (3.1416 / 180.0);
}

function rgb(r,g,b)
{
	return ((((r)&0xff)<<16)|(((g)&0xff)<<8)|((b)&0xff))
}
function setSprite_State()
{
	timeSet();
	posSet();
	colorSet();
	sizeSet();
	rotSet();
	repeatSet();
	delaySet();
	easeSet();
}
function Init()
{
	var farTex = PIXI.Texture.fromImage("beath.jpg",false,PIXI.SCALE_MODES.NEAREST);
	farTex.baseTexture.addListener("loaded",function(){
	farTex.baseTexture.removeListener("loaded");

    sprite = new PIXI.Sprite(farTex);
	sprite.width = canvas.width;
	sprite.height = canvas.height;
	posX.value = 0;
	posY.value = 0;
	document.getElementById("width").value = sprite.width;
	document.getElementById("height").value = sprite.height;

	/*var anim1 = {
		x: 0,
		y: 0,
		tint:rgb(255,255,0),
		width: canvas.width * 0.5,
		height: canvas.height * 0.5,
		rotation: ToRadians(360),
        repeat: 0,// 繰り返し回数指定 -1はループ
        ease: Cubic.easeInOut // 加減速の種類
	};
	var anim2 = {
		x: 200,
		y: 0,
		tint:0xFF0000,
		width: canvas.width * 0.5,
		height: canvas.height * 0.5,
		rotation: 0,
		delay:1,
        repeat: 0
       // ease: Cubic.easeInOut,
		/*onComplete : function(){
		writeLog('comp');
		} // 処理完了後に呼ばれる関数を指定できます。
	};
	tl.to(sprite,3.0,anim1);
	tl.to(sprite,2.0,anim2);
	tl.to(sprite,1.0,anim1);
	tl.pause();
*/
    stage.addChild(sprite);
	
	progressBar = new PIXI.DisplayObjectContainer();
	progressBar.position.set(0, canvas.height - 8)
	stage.addChild(progressBar);

	//Create the black background rectangle
	let innerBar = new PIXI.Graphics();
	innerBar.beginFill(0xFFFFFF);
	innerBar.lineStyle(2, 0xFFFFFF);//枠線の太さと色を指定
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

function clickact(e)
{
	var mouseX = e.pageX*1.43;
	var mouseY =  e.pageY*1.19;

	sprite.x = mouseX;
	sprite.y = mouseY;
	posX.value = mouseX;
	posY.value = mouseY;
}
function clickmove(mouseX,mouseY)
{
	
}
function enterFrameHandler()
{
        requestAnimationFrame(() => {
          this.enterFrameHandler()
        });
		if(stats)stats.update();
		if(line.isActive())
		{
			var prog = line.progress();
			if(prog != 1.0){
			progressBar.outer.width = progressBarWidth*prog;
			}
		}
    //Render the stage
    this.renderer.render(this.stage);
}

function checkOrientation() {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
	if(renderer){
	renderer.width = canvas.width;
	renderer.height = canvas.height;
	}
}
