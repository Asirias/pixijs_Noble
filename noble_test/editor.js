var canvas = document.getElementById('canvas');
var stage;
var spriteArea;
var particleview;
var renderer;
var sprite;
var far;
var content ={
	"pos": {
		"x": 0.5,
		"y": 0.5
	},
	"texture": ""
};
var maintext;
function navi()
{
	var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
        canvas.addEventListener('touchstart',function(e){
		clickact(e);
	},false);
	canvas.addEventListener('touchmove', function(e) {
		var mouseX = e.pageX;
		var mouseY = e.pageY;

		},false);
	canvas.addEventListener('touchend',function(e){
		
		},false);
    }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
        canvas.addEventListener('touchstart',function(e){
		clickact(e);
	},false);
		canvas.addEventListener('touchmove', function(e) {
		var mouseX = e.pageX;
		var mouseY = e.pageY;

		},false);
	canvas.addEventListener('touchend',function(e){
		
		},false);
    }else{
	canvas.onmousedown = function( e ) {
		clickact(e);
	};
	canvas.onmousemove = function( e ) {
		var mouseX = e.pageX;
		var mouseY = e.pageY;
	};
	canvas.onmouseup = function(e){

	};
  }
}
function ContainerCreate()
{
	stage = new PIXI.Container();
	spriteArea = new PIXI.Container();
	particleview = new PIXI.ParticleContainer();//1つしかテクスチャを扱えない
				particleview.setProperties({
					scale: true,
					position: true,
					rotation: true,
					uvs: true,
					alpha: true
				});
}
(function initLoad()
{
navi();

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

		// 画面回転時に向きをチェック
        renderer = PIXI.autoDetectRenderer(
        canvas.width,
        canvas.height,
        {
			preserveDrawingBuffer: true,
			view: canvas
		},false,true);

	ContainerCreate();
	textureLoad();
		jsonLoad2();
		
	maintext = new PIXI.Text("",{fontFamily:'Arial', fontSize:'16pt',fontWeight:'bold', fill:'#FF0000'});
	var fontsize = 16;
	maintext.style.fontSize = fontsize;
	maintext.style.align = 'center';
	stage.addChild(maintext);
	enterFrameHandler();
})();
function jsonSave()
{
	var stjson = JSON.stringify(content);
	var blob = new Blob([ stjson ], { "type" : "text/plain" });
	if (window.navigator.msSaveBlob) {
       window.navigator.msSaveBlob(blob, "data.json"); 
	}else {
		var url = window.URL.createObjectURL(blob);
		document.getElementById("download").href = window.URL.createObjectURL(blob);
	}
}
function jsonLoad2()
{
		var reader = new FileReader();
		 $("#jfile").change(function(){
                 // 選択ファイルの有無をチェック
                 if (!this.files.length) {
                     alert('ファイルが選択されていません');
                     return;
                 }
				  // Formからファイルを取得
                 var file = this.files[0];
				reader.onload = function(evt) {
					console.log(JSON.parse(evt.target.result));
					content = JSON.parse(evt.target.result)
		if(far)
		{
			spriteArea.removeChild(far);
		}
		    var farTexture = PIXI.Texture.fromImage(content.texture,false,PIXI.SCALE_MODES.NEAREST);

			farTexture.baseTexture.addListener("loaded",function(){
			var texture_width = farTexture.width;
			var texture_height = farTexture.height;

            far = new PIXI.Sprite(farTexture);
			far.scale.set(canvas.width/texture_width,canvas.height/texture_height);
			if(sprite){
				sprite.x = canvas.width * content.pos.x;
				sprite.y = canvas.height * content.pos.y;
			}
            spriteArea.addChild(far);
			});
		};
				reader.readAsText(file);
	});
}
function jsonLoad()
{
	$.getJSON("data.json", function(config){
		if(far)
		{
			spriteArea.removeChild(far);
		}
		    var farTexture = PIXI.Texture.fromImage(config.texture,false,PIXI.SCALE_MODES.NEAREST);

			farTexture.baseTexture.addListener("loaded",function(){
			var texture_width = farTexture.width;
			var texture_height = farTexture.height;

            far = new PIXI.Sprite(farTexture);
			far.scale.set(canvas.width/texture_width,canvas.height/texture_height);
			if(sprite){
				sprite.x = canvas.width * content.pos.x;
				sprite.y = canvas.height * content.pos.y;
			}
            spriteArea.addChild(far);
			});
});
}
function clickact(e)
{
	var mouseX = e.pageX;
	var mouseY = e.pageY;
	if(sprite){
	sprite.x = mouseX - (sprite.width / 2.0);
	sprite.y = mouseY - (sprite.height / 2.0);
	}

	//maintext.style.wordWrap = true;
	maintext.x = 0;
	maintext.y = 0;
	
	var x = Math.round(mouseX/canvas.width*100)/100;
	var y = Math.round(mouseY/canvas.height*100)/100;
	maintext.text = "X:" + x + "::" + "Y" + y;
	
	content.pos.x = x;
	content.pos.y = y;
}
function TLoad(filedata)
{
		if(far)
		{
			spriteArea.removeChild(far);
		}
		    var farTexture = PIXI.Texture.fromImage(filedata,false,PIXI.SCALE_MODES.NEAREST);
			content.texture = filedata;
			
			farTexture.baseTexture.addListener("loaded",function(){
			var texture_width = farTexture.width;
			var texture_height = farTexture.height;

            far = new PIXI.Sprite(farTexture);
			far.scale.set(canvas.width/texture_width,canvas.height/texture_height);
			
            spriteArea.addChild(far);
			});
}
function spload()
{
		var reader = new FileReader();
		 $("#ufile").change(function(){
                 // 選択ファイルの有無をチェック
                 if (!this.files.length) {
                     alert('ファイルが選択されていません');
                     return;
                 }
				  // Formからファイルを取得
                 var file = this.files[0];
				 if(!file.type.match(/image/)) {
					alert('画像ファイルを選んでください');
					return;
					}
				reader.onload = function(evt) {		
				TLoad(reader.result);
				};
				reader.readAsDataURL(file);
		});
		
		
}
function textureLoad()
{ 
	stage.addChild(spriteArea);
	spload();
	
	var farTex = PIXI.Texture.fromImage("star.png",true,PIXI.SCALE_MODES.NEAREST);
	farTex.baseTexture.addListener("loaded",function(){
	farTex.baseTexture.removeListener("loaded");
    sprite = new PIXI.Sprite(farTex);
    stage.addChild(sprite);
	});
}
function enterFrameHandler()
{
        requestAnimationFrame(() => {
          this.enterFrameHandler()
        });

    //Render the stage
    this.renderer.render(this.stage);
}
function chack_functions(source)
{
	var propNames = [];
	var o = source;
	while ( o ) {
    propNames = propNames.concat( Object.getOwnPropertyNames( o ) );
    o = Object.getPrototypeOf( o );
	}
	alert(propNames);
}
function capture() {
	var canvass = window.document.getElementById("canvas");
	var imgUrl = canvass.toDataURL("image/png");
	window.open(imgUrl);
}
$(window).on('orientationchange resize', function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	if(renderer){
	renderer.width = canvas.width;
	renderer.height = canvas.height;
	}
});