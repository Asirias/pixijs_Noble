var canvas = document.getElementById('canvas');

var maintext;
var nametext;
var sprite;
var fade;
var blackfade;
var loaded = false;
var horizont = false;
var videoSprite;

var gameStart = false;
var fontsize;

var String = new Array();

var msgcount = -1;
var count = 0;
var audio = new Array();

var color = 0x000000;
var elapsed = Date.now();

var view;
var particle;

var filter;
var displacementfilter;
var displacementfilterOn = false;
var map;

var pic_list = new Array();
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
	window.onkeydown = function( event ) {
		clickact();
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
	var setumei = new PIXI.Text("何かキーを入力するか,タッチしてください",{fontFamily:'Arial', fontSize:'32pt',fontWeight:'bold', fill:'#FFFFFF'});
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

	view = new PIXI.ParticleContainer();
				view.setProperties({
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
function anim_textureload()
{
	
	PIXI.loader
    .add('spritesheet', 'gold_anim.json')
    .load(onAssetsLoaded);

function onAssetsLoaded() {

    // create an array to store the textures
    var explosionTextures = [],
        i;

    for (i = 0; i < 6; i++) {
         var texture = PIXI.Texture.fromFrame('gold_' + (i+1) + '.png');
         explosionTextures.push(texture);
    }
  
    for (i = 0; i < 16; i++) {
        // create an explosion AnimatedSprite
        var explosion = new PIXI.extras.AnimatedSprite(explosionTextures);

        explosion.x = Math.random() * canvas.width;
        explosion.y = Math.random() * canvas.height;
        explosion.anchor.set(0.5);
        explosion.rotation = Math.random() * Math.PI;
        explosion.scale.set(0.75 + Math.random() * 0.5);
        explosion.gotoAndPlay(Math.random() * 27);
		
		explosion.animationSpeed = 0.3;
        view.addChild(explosion);
    }
	
	var textures = [];
	for (var i = 0; i < 6; i++) {
         var texture = PIXI.Texture.fromFrame('gold_' + (i+1) + '.png');
         textures.push(texture);
    }
	 var fireconfig = {
					"alpha": {
						"start": 1,
						"end": 0.8
					},
					"scale": {
						"start": 0.5,
						"end": 0.5
					},
					"color": {
						"start": "ffffff",
						"end": "ffffff"
					},
					"speed": {
						"start": 200,
						"end": 100
					},
					"startRotation": {
						"min": 0,
						"max": 0
					},
					"rotationSpeed": {
						"min": 0,
						"max": 0
					},
					"lifetime": {
						"min": 0.5,
						"max": 0.7
					},
					"frequency": 0.05,
					"emitterLifetime": 0.31,
					"maxParticles": 1000,
					"pos": {
						"x": 0,
						"y": 0
					},
					"addAtBack": false,
					"spawnType": "ring",
					"spawnCircle": {
						"x": 0,
						"y": 0,
						"r": 40,
						"minR": 39
					}
				};

	 particle = new PIXI.particles.Emitter(view, textures, fireconfig);

	 //particle.particleConstructor = PIXI.particles.AnimatedParticle;

	// Center on the stage
	 particle.updateOwnerPos(window.innerWidth / 2, window.innerHeight / 2);
	 canvas.addEventListener('mouseup', function(e){
				if(!particle) return;
				particle.emit = true;
				particle.resetPositionTracking();
				particle.updateOwnerPos(e.offsetX || e.layerX, e.offsetY || e.layerY);
			});
}
window.destroyEmitter = function()
			{
				particle.destroy();
				particle = null;
				window.destroyEmitter = null;
			}
}
function Init()
{
	loaded = false;

			var farTex = PIXI.Texture.fromImage("F-16_June_2008.jpg",false,PIXI.SCALE_MODES.NEAREST);
			farTex.baseTexture.addListener("loaded",function(){
			farTex.baseTexture.removeListener("loaded");
            sprite = new PIXI.Sprite(farTex);
			sprite.scale.set(canvas.width/farTex.width,canvas.height/farTex.height);
            stage.addChild(sprite);
			pic_list.push(sprite);
			
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
			
			nametext = new PIXI.Text("",{fontFamily:'Arial', fontSize:'16pt',fontWeight:'bold', fill:'#000000'});
			nametext.style.fontSize = fontsize * 2;
			nametext.style.align = 'center';
			//nametext.style.wordWrap = true;
			nametext.x = Texboxsprite.x + 24 * 2;
			nametext.y = Texboxsprite.y + 16;
			stage.addChild(nametext);
			
			nametext.text = "POWERS";
			anim_textureload();
			
			loaded = true;
			});

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

      });
//playmp4('testVideo.mp4');
//Start the game loop
}

function fadeIn_Out()
{
	if(fade.alpha > 0){
		fade.alpha -= 0.01;
		if(fade.alpha < 0)fade.alpha = 0;
		}
}
var counter = 0;
function moveDisplacementfilter()
{
	counter += 0.5;
    map.position.x = counter;
    map.position.y = counter;
}

function enterFrameHandler()
{
        requestAnimationFrame(() => {
          this.enterFrameHandler()
        });
		
		if(loaded){
		var time = Date.now();
		
		fadeIn_Out();
		textview();
		if (particle)particle.update((time - elapsed)/1000);

		if(displacementfilterOn)moveDisplacementfilter()
	
		elapsed = time;
		}
    //Render the stage
    this.renderer.render(this.stage);
}
function audioLoad()
{
	audio[0] = new Audio("bomb.mp3");
	audio[1] = new Audio("decision9.mp3");
	audio[2] = new Audio("decision18.mp3");
	audio[3] = new Audio("atari_01.wav");

	for(var i = 0;i < 4;i++)
		audio[i].load();
}
function audioplaying()
{
	var Msg = String[msgcount];
	if(Msg.slice(0,1) == "[" && Msg.slice(-1) == "]"){
		switch(Msg)
		{
			case "[sound1]":
			if (audio[0].paused)audio[0].play();
			color = 0xFF0000;
			if(view)
			stage.addChild(view);
			break;
			case "[sound2]":
			if (audio[1].paused)audio[1].play();
			color = 0x00FF00;
			pic_list[0].filters = [filter];
			break;
			case "[sound3]":
			if (audio[2].paused)audio[2].play();
			color = 0xFFFF00;
			pic_list[0].filters = null;
			displacementfilterOn = true;
			pic_list[0].filters = [displacementfilter];
			break;
			case "[voice1]":
			if (audio[3].paused)audio[3].play();
			color = 0x0FFF00;
			fade.alpha = 1.0;
			displacementfilterOn = false;
			pic_list[0].filters = null;
			if(view)
			stage.removeChild(view);
			
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

function playmp4(filename)
{
if(videoSprite)stage.removeChild(videoSprite);
var videoTexture = PIXI.Texture.fromVideo(filename);
//var source = videoTexture.baseTexture.source;
videoTexture.baseTexture.addListener("loaded",function(){
videoTexture.baseTexture.removeListener("loaded");
// 画面サイズにリサイズ
 videoSprite = new PIXI.Sprite(videoTexture);
videoSprite.width = renderer.width;
  videoSprite.height = renderer.height;
stage.addChild(videoSprite);
//source.pause();
});
}
function clickact()
{	
	if(!gameStart){
		gameStart = true;
		audioLoad();
		Init();
		this.enterFrameHandler();
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