var canvas = document.getElementById('canvas');

var sprite;
var stage;
var renderer;
var stats;
//定義したTimelineに対して一時停止、再生、逆再生をかける。
var tl;
var rev = false;

(function initLoad()
{
	var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        canvas.addEventListener('touchstart',function(e){
		clickact();
	},false);
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        canvas.addEventListener('touchstart',function(e){
		clickact();
	},false);
    }else{
	window.onmousedown = function( event ) {
		clickact();
	};
    }
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	document.getElementById("list").innerHTML = "width:"+canvas.width + " height:" +canvas.height;
	
	stage = new PIXI.Container();
        renderer = PIXI.autoDetectRenderer(
        canvas.width,
        canvas.height,
        {view: canvas,antialiasing: true},false,true
    );
	tl = new TimelineMax();
	Init();
})();
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
var onComplete;/*関数*/
function Add()
{
	var anim = {
	x: x?x:undefined,
	y: y?y:undefined,
	tint:tint?tint:undefined,/*色*/
	width: width?width:undefined,
	height: height?height:undefined,
	delay:delay?delay:undefined,
	rotation: rotation?rotation:undefined,//3.14*2.0
    repeat: repeat?repeat:undefined, // 繰り返し回数指定 -1はループ
    ease: ease?ease:undefined,// 加減速の種類
	onComplete : onComplete?function(){}:undefined
	};
	var animlist = 
	x?x:undefined + ":" + 
	y?y:undefined + ":" + 
	tint?tint:undefined + ":" + 
	width?width:undefined + ":" + 
	height?height:undefined + ":" + 
	delay?delay:undefined + ":" + 
	rotation?rotation:undefined + ":" + 
	repeat?repeat:undefined + ":" + 
	ease?ease:undefined + ":" + 
	onComplete + "<br>";
	document.getElementById("list").innerHTML += animlist;
	
	anims.push(anim);
	times.push(time);
	
	x = undefined;
	y= undefined;
	tint= undefined;
	width= undefined;
	height= undefined;
	rotation= undefined;
	repeat= undefined;
	ease= undefined;
	delay= undefined;
	onComplete= undefined;/*関数*/
}
function Remove()
{
	anims.pop();
	times.pop();
}
function allRemove()
{
	anims.clear();
	times.clear();
}
function timeSet()
{
	var timel = document.getElementById("time").value;
	if(timel)
	time = timel;
}
function posSet()
{
	var xl = document.getElementById("posX").value;
	var yl = document.getElementById("posY").value;
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
	var rl = document.getElementById("colorR").value;
	var gl = document.getElementById("colorG").value;
	var bl = document.getElementById("colorB").value;
	if(rl && gl && bl){
	tint = rgb(rl,gl,bl);
	}
}
function sizeSet()
{
	var widthl = document.getElementById("width").value;
	var heightl = document.getElementById("height").value;
	if(widthl)
	width = widthl;
	if(heightl)
	height = heightl;
}
function rotSet()
{
	var rotationl = document.getElementById("rotation").value;
	if(rotationl)
	rotation = ToRadians(rotationl);
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
	var line = new TimelineMax();
	
	for(var i = 0;i < anims.length;i++)
	{
		line.to(sprite,times[i],anims[i]);
	}
	var pl = $('input[name=_radio]:checked').val();
	if(pl == 'play') line.Play();
	else line.reverse();
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
	
	var listhtml = document.getElementById("list");
	listhtml.innerHTML = "width:"+canvas.width + " height:" +canvas.height;
	
	for(var i = 0;i < anims.length;i++)
	{
		listhtml.innerHTML += "time:"+times[i] + " anims:" + anims[i] + "<br>";
	}
}
function Init()
{
	var farTex = PIXI.Texture.fromImage("beath.jpg",false,PIXI.SCALE_MODES.NEAREST);
	farTex.baseTexture.addListener("loaded",function(){
	farTex.baseTexture.removeListener("loaded");

    sprite = new PIXI.Sprite(farTex);
	sprite.width = canvas.width;
	sprite.height = canvas.height;

	var anim1 = {
		x: 0,
		y: 0,
		tint:rgb(255,255,0),/*色*/
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
        repeat: 0,
       // ease: Cubic.easeInOut,
		onComplete : function(){
		alert('comp');
		} // 処理完了後に呼ばれる関数を指定できます。
	};
	tl.to(sprite,3.0/*秒指定*/,anim1);
	tl.to(sprite,2.0,/*秒指定*/anim2);
	tl.to(sprite,1.0/*秒指定*/,anim1);

	tl.pause();

    stage.addChild(sprite);
	});
	
	// 画面回転時に向きをチェック
	window.addEventListener('resize', checkOrientation, false);
	stats = new Stats();
	stats.setMode(0);
	document.body.appendChild(stats.domElement);
    this.enterFrameHandler();
}
function Play()
{
	if(rev){
		tl.reverse();
	}
	else {
		tl.play();
	}
	rev = !rev;
}
function clickact()
{
}
function enterFrameHandler()
{
        requestAnimationFrame(() => {
          this.enterFrameHandler()
        });
		if(stats)stats.update();
		if(tl.isActive())
		{
			
		}
		/*tl.progress()*/
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