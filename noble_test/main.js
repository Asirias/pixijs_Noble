var canvas = document.getElementById('canvas');

var maintext;
var nametext;
var sprite;
var fade;
var blackfade;
var playing = false;
var horizont = false;
var videoSprite;
var videoSource;
var videoPlay = false;
var videoLoad = false;
var gameStart = false;
var fontsize;
var dark_ = false;
var dark_2 = false;

var String = new Array();

var nowScenenum = 0;
var Scenenum = 0;
var msgcount = -1;
var scenemove = false;
var count = 0;
var audio = new Array();

var color = 0x000000;
var elapsed = Date.now();

var view;
var particleview;
var particle;

var filter;
var displacementfilter;
var displacementfilterOn = false;
var map;
var counter = 0;
var counter2 = 0;
var vibration = false;

var backGround;

var pic_list = new Array();
(function initLoad()
{
	var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        canvas.addEventListener('touchstart',function(e){
		clickact(e);
	},false);
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        canvas.addEventListener('touchstart',function(e){
		clickact(e);
	},false);
    }else{
	canvas.onmousedown = function( e ) {
		clickact(e);
	};
    }
	
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
console.log(canvas.width+"::"+canvas.height);
		// 画面回転時に向きをチェック
window.addEventListener('resize', checkOrientation, false);

stage = new PIXI.Container();
        renderer = PIXI.autoDetectRenderer(
        canvas.width,
        canvas.height,
        {view: canvas},false,true
    );
	var setumei = new PIXI.Text("画面をタッチしてください",{fontFamily:'Arial', fontSize:'32pt',fontWeight:'bold', fill:'#FFFFFF'});
		setumei.style.align = 'center';
		setumei.x = canvas.width/2 - 318;
		setumei.y = canvas.height/2 - 24;
		stage.addChild(setumei);
		//Render the stage
    this.renderer.render(this.stage);
	stage.removeChild(setumei);
	
	$.get("./test.txt", function(data){
		var str = data;
		String = str.split(/\r\n|\r|\n/);
		if(String[String.length - 1] == '')String.pop();
	});
backGround = new PIXI.Container();//複数テクスチャを扱えるがParticleContainerより遅い(同時に1000以下なら使用)
	particleview = new PIXI.ParticleContainer();//1つしかテクスチャを扱えない
	view = new PIXI.ParticleContainer();
				view.setProperties({
					scale: true,
					position: true,
					rotation: true,
					uvs: true,
					alpha: true
				});
				particleview.setProperties({
					scale: true,
					position: true,
					rotation: true,
					uvs: true,
					alpha: true
				});
	filter = new PIXI.filters.BlurFilter();
	filter.blur = 8;
	
	  map = PIXI.Sprite.fromImage("map.png");
  stage.addChild(map);
  displacementfilter = new PIXI.filters.DisplacementFilter(map);
  displacementfilter.scale.x = 32;
  displacementfilter.scale.y = 32;
  
  if (!displacementfilter) {
  alert("NOdisplacementfilter");
  }
  displacementfilterOn = false;
})();
function loadanimTextures()
{
	 var fromtexture = PIXI.Texture.fromImage('anime_onara07.png');
	 var Textures = [];

	 for(var y = 0;y < 8;y++)
	 {
		 for(var x = 0;x < 5;x++)
		 {
			var frame = new PIXI.Rectangle(x*192, y*192, 192, 192);
			var texture = new PIXI.Texture(fromtexture, frame);
			frame = null;
			
			Textures.push(texture);
		 }
	 }
	for (var i = 0; i < 8; i++) {
        // create an explosion AnimatedSprite
        var explosion = new PIXI.extras.AnimatedSprite(Textures);
        explosion.x = Math.random() * canvas.width;
        explosion.y = Math.random() * canvas.height;

        explosion.anchor.set(0.5);
        explosion.rotation = Math.random() * Math.PI;
        explosion.scale.set(0.75 + Math.random() * 0.5);
        explosion.gotoAndPlay(Math.random() * 27);
		explosion.animationSpeed = 0.3;
        view.addChild(explosion);
    }
	//view.alpha = 0.8;
}

function anim_textureload()
{
	var fromtexture = PIXI.Texture.fromImage('anime_onara01.png');
	var textures = [];
	for(var y = 0;y < 2;y++)
	{
		for(var x = 0;x < 5;x++)
		{
		var frame = new PIXI.Rectangle(x*192, y*192, 192, 192);
		var texture = new PIXI.Texture(fromtexture, frame);
		frame = null;
		textures.push(texture);
		}
    }
	 var fireconfig = {
	"alpha": {
		"start": 0.45,
		"end": 0
	},
	"scale": {
		"start": 0.1,
		"end": 1
	},
	"color": {
		"start": "ffffff",
		"end": "ffffff"
	},
	"speed": {
		"start": 300,
		"end": 700
	},
	"startRotation": {
		"min": 250,
		"max": 290
	},
	"rotationSpeed": {
		"min": 0,
		"max": 0
	},
	"lifetime": {
		"min": 0.5,
		"max": 0.7
	},
	"blendMode": "normal",
	"frequency": 0.001,
	"emitterLifetime": 0.31,
	"maxParticles": 256,
	"pos": {
		"x": 0,
		"y": 0
	},
	"addAtBack": false,
	"spawnType": "point"
};
	 particle = new PIXI.particles.Emitter(particleview, textures, fireconfig);
	// Center on the stage
	 particle.updateOwnerPos(window.innerWidth / 2, window.innerHeight / 2);

	 particle.emit = false;

window.destroyEmitter = function()
			{
				particle.destroy();
				particle = null;
				window.destroyEmitter = null;
			}
}

function Texboxs_Load()
{
	var Texbox = PIXI.Texture.fromImage("mesframe14_blue.png",false,PIXI.SCALE_MODES.NEAREST);
	Texbox.baseTexture.addListener("loaded",function(){
	var Texboxsprite = new PIXI.Sprite(Texbox);
	Texboxsprite.alpha = 0.5;
	Texboxsprite.x = (canvas.width / 2) - (Texboxsprite.width / 2);
	Texboxsprite.y = canvas.height - Texboxsprite.height;
	stage.addChild(Texboxsprite);
	
	maintext = new PIXI.Text("",{fontFamily:'Arial', fontSize:'16pt',fontWeight:'bold', fill:'#FF0000'});
	fontsize = 16;
	maintext.style.fontSize = fontsize;
	maintext.style.align = 'center';
	//maintext.style.wordWrap = true;
	maintext.x = Texboxsprite.x + 24;
	maintext.y = Texboxsprite.y + 64;
	stage.addChild(maintext);
	
	nametext = new PIXI.Text("POWERS",{fontFamily:'Arial', fontSize:'32pt',fontWeight:'bold', fill:'#000000'});
	nametext.style.align = 'center';
	//nametext.style.wordWrap = true;
	nametext.x = Texboxsprite.x + 24 * 2;
	nametext.y = Texboxsprite.y + 16;
	nametext.text = "POWERS";
	stage.addChild(nametext);
	
	playing = true;
	});
}
function pic_lists_Load()
{
	var farTex = PIXI.Texture.fromImage("beath.png",false,PIXI.SCALE_MODES.NEAREST);
	farTex.baseTexture.addListener("loaded",function(){
	farTex.baseTexture.removeListener("loaded");
    sprite = new PIXI.Sprite(farTex);
	sprite.scale.set(canvas.width/farTex.width,canvas.height/farTex.height);
	backGround.addChild(sprite);
    stage.addChild(backGround);
	pic_list.push(sprite);
	//
	var farTex2 = PIXI.Texture.fromImage("hip.jpg",false,PIXI.SCALE_MODES.NEAREST);
	farTex2.baseTexture.addListener("loaded",function(){
	farTex2.baseTexture.removeListener("loaded");
	var sprite2 = new PIXI.Sprite(farTex2);
	sprite2.scale.set(canvas.width/farTex2.width,canvas.height/farTex2.height);
	pic_list.push(sprite2);
	
	Texboxs_Load();
	stage.addChild(view);
	stage.addChild(particleview);
	fade_Load();
	});
	});
}
function fade_Load()
{
	blackfade = new PIXI.Graphics();
	blackfade.beginFill(0x000000,1);
	blackfade.drawRect(0, 0, canvas.width, canvas.height);//x,y,width,height
    blackfade.endFill();
    stage.addChild(blackfade);//作成した四角をシーンに追加
	blackfade.alpha = 0;
	
	fade = new PIXI.Graphics();
	fade.beginFill(0xFFFF00,1);
	fade.drawRect(0, 0, canvas.width, canvas.height);//x,y,width,height
    fade.endFill();
    stage.addChild(fade);//作成した四角をシーンに追加
	fade.alpha = 0;
}

function Init()
{
	playing = false;
	pic_lists_Load();
	anim_textureload();
	loadanimTextures();
}

function fadeIn_Out()
{
	if(fade.alpha > 0){
		fade.alpha -= 0.01;
		if(fade.alpha < 0)fade.alpha = 0;
	}
}
function dark()
{
	if(blackfade.alpha < 0.5){
		blackfade.alpha += 0.05;
		if(blackfade.alpha > 0.5)blackfade.alpha = 0.5;
	}
}
function light()
{
	if(blackfade.alpha > 0){
		blackfade.alpha -= 0.05;
		if(blackfade.alpha < 0)blackfade.alpha = 0;
	}
}
function scenechange(num)
{
	if(nowScenenum == num)return;
	
	if(!dark_ && blackfade.alpha < 1){
		blackfade.alpha += 0.01;
		if(blackfade.alpha > 1){
			blackfade.alpha = 1;
			dark_ = true;
			change_background(num);
		}
	}
	if(dark_ && blackfade.alpha > 0){
	blackfade.alpha -= 0.01;
	if(blackfade.alpha < 0){
		blackfade.alpha = 0;
		nowScenenum = num;
		dark_ = false;
		scenemove = false;
	}
  }
}

function moveDisplacementfilter()
{
	counter += 0.5;
    map.position.x = counter;
    map.position.y = counter;
}
function videostop()
{
	videoSource.pause();
	stage.removeChild(videoSprite);
	videoSprite.destroy();
	videoPlay = false;
	videoLoad = false;
	playing = true;
}
function Vibration()
{
	if(vibration){
	counter2++;
	sprite.x = Math.cos(counter2)*4.0;
	}else if(sprite.x != 0){sprite.x = 0;counter2 = 0;}
}
function enterFrameHandler()
{
        requestAnimationFrame(() => {
          this.enterFrameHandler()
        });
		if(videoPlay){
			if(videoSource.ended)videostop();
			this.renderer.render(this.stage);
			return;
		}
		if(playing){
		var time = Date.now();
		fadeIn_Out();
		textview();
		Vibration();
		if(scenemove)scenechange(Scenenum);
		else{
		if(dark_2)dark();
		else light();
		}

		if (particle)particle.update((time - elapsed)/1000);
		if(displacementfilterOn)moveDisplacementfilter()
		elapsed = time;
		}
    //Render the stage
    this.renderer.render(this.stage);
}
function audioLoad()
{
	var soundList = [
	"bomb.mp3","decision9.mp3","decision18.mp3","atari_01.wav"
	];

	for(var i = 0;i < 4;i++){
		audio[i] = new Audio(soundList[i]);
		audio[i].load();
	}
}
function change_background(num)
{
	backGround.removeChild(sprite);
	sprite = pic_list[num];
	backGround.addChild(sprite);
}
function audioplaying()
{
	var Msg = String[msgcount];
	if(Msg.slice(0,1) == "[" && Msg.slice(-1) == "]"){
		displacementfilterOn = false;
		switch(Msg)
		{
			case "[sound1]":
			if (audio[0].paused)audio[0].play();
			color = 0xFF0000;

			break;
			case "[sound2]":
			if (audio[1].paused)audio[1].play();
			color = 0x00FF00;			
			break;
			case "[sound3]":
			if (audio[2].paused)audio[2].play();
			color = 0xFFFF00;
			break;
			case "[voice1]":
			if (audio[3].paused)audio[3].play();
			color = 0x0FFF00;
			break;
			case "[pika]":
			fade.alpha = 1.0;
			break;
			case "[vib]":
			vibration = true;
			break;
			case "[vibend]":
			vibration = false;
			break;
			case "[blur]":
			pic_list[0].filters = [filter];
			break;
			case "[displace]":
			displacementfilterOn = true;
			pic_list[0].filters = [displacementfilter];
			break;
			case "[effend]":
			pic_list[0].filters = null;
			break;
			case "[dark]":
			scenemove = false;
			dark_2 = true;
			break;
			case "[darkend]":
			scenemove = false;
			dark_2 = false;
			break;
			case "[change1]":
			scenemove = true;
			Scenenum = 1;
			break;
			case "[change2]":
			scenemove = true;
			Scenenum = 0;
			break;
			case "[move]":
			playing = false;
			videoLoad = true;
			break;
			default:
			break;
		}
		msgcount++;
	}
}
function textview()
{
	color = 0x000000;
	audioplaying();
	if(count == 0){
		maintext.style.fill = color;
	}
	if(count <= String[msgcount].length){
	// テキストフィールドにデータを渡す処理
	maintext.text = String[msgcount].substring(0, count);
	count++;
	}
}
function getRandomInt(min, max) {
  return Math.floor( Math.random() * (max - min + 1) ) + min;
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
function playmp4(filename)
{
if(videoSprite)stage.removeChild(videoSprite);
var videoTexture = PIXI.Texture.fromVideo(filename);
videoTexture.baseTexture.addListener("loaded",function(){
videoTexture.baseTexture.removeListener("loaded");
videoSource = videoTexture.baseTexture.source;
// 画面サイズにリサイズ
videoSprite = new PIXI.Sprite(videoTexture);
videoSprite.width = renderer.width;
videoSprite.height = renderer.height;
stage.addChild(videoSprite);
videoPlay = true;
});
}
function clickact(e)
{
	if(!gameStart){
		gameStart = true;
		audioLoad();
		Init();
		this.enterFrameHandler();
	}
	
	if(videoPlay){
		videoSource.currentTime+=8.0;
		return;
	}else if(!playing && videoLoad) {
		videoLoad = false;
		playmp4('testVideo.mp4');
		return;
	}
	if(scenemove)return;
	if(particle){
	particle.emit = true;
	particle.resetPositionTracking();
	particle.updateOwnerPos(e.pageX, e.pageY);
	}
	count = 0;
	if(msgcount < String.length)msgcount++;
	if(msgcount == String.length)msgcount = 0;
}

function checkOrientation() {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
	if(renderer){
	renderer.width = canvas.width;
	renderer.height = canvas.height;
	}
}
