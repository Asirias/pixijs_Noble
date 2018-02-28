var canvas;
var stage;
var anim;
var renderer;
var sprite;
var explosion;
var texturedata;
var texturedata_by;
var content ={
	"rect": [
	{
		'x':0,
		'y':0,
		'width':0,
		'height':0
	}
	],
	"texture": "",
	"x":0,
	"y":0,
	"speed":0
};
function ContainerCreate()
{
	stage = new PIXI.Container();

	anim = new PIXI.ParticleContainer();//1つしかテクスチャを扱えない
				anim.setProperties({
					scale: false,
					position: true,
					rotation: false,
					uvs: true,
					alpha: false
				});
	anim.maxSize = 1000;
	anim.batchSize = 1000;
	
	stage.addChild(anim);
}
function loadanimTextures(cutx,cuty,width,height,speed)
{
	if(!texturedata)return;
	
	content.texture = texturedata_by;

	if(explosion)
	anim.removeChild(explosion);
	
	 var Textures = [];
	content.rect.length = 0;

	 for(var y = 0;y < cuty;y++)
	 {
		 for(var x = 0;x < cutx;x++)
		 {
			if(texturedata.width > x*width && texturedata.height > y*height){
		    var da = 
			{
				'x':0,
				'y':0,
				'width':0,
				'height':0
			};
			da.x = x*width;
			da.y = y*height;
			da.width = width;
			da.height = height;
			content.rect.push(da);
			
			var frame = new PIXI.Rectangle(da.x, da.y, da.width, da.height);
			var texture = new PIXI.Texture(texturedata, frame);
			Textures.push(texture);
			}
		 }
	 }
	 content.speed = speed;
	 explosion = new PIXI.extras.AnimatedSprite(Textures);
	 explosion.x = width;
     explosion.y = (canvas.height/2);
	 explosion.animationSpeed = speed;
	 explosion.gotoAndPlay(0);
	 anim.addChild(explosion);

}
function loadfile()
{
	var reader = new FileReader();
	$("#ufile").change(function() {
		// 選択ファイルの有無をチェック
		if (!this.files.length) {
			alert('ファイルが選択されていません');
			return;
		}
		// Formからファイルを取得
		var file = this.files[0];
		reader.onload = function(evt) 
		{
			texturedata_by = reader.result;
			texturedata = PIXI.Texture.fromImage(texturedata_by,true, PIXI.SCALE_MODES.NEAREST);
			texturedata.baseTexture.addListener("loaded", function() {

			if(sprite){
			stage.removeChild(sprite);
			}
			sprite = new PIXI.Sprite(texturedata);
			sprite.scale.set((canvas.width/2) / sprite.width, (canvas.height/2) / sprite.height);
			stage.addChild(sprite);
			});
		};
		reader.readAsDataURL(file);
	});
}
function jsonSave()
{
	if(explosion){
	content.x = explosion.x;
	content.y = explosion.y;
	}
	var stjson = JSON.stringify(content);

	var blob = new Blob([ stjson ], { "type" : "text/plain" });
	if (window.navigator.msSaveBlob) {
       window.navigator.msSaveBlob(blob, "data.json"); 
	}else {
		var url = window.URL.createObjectURL(blob);
		document.getElementById("download").href = window.URL.createObjectURL(blob);
	}
}
function jsonLoad()
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
		if(sprite)
		{
			stage.removeChild(sprite);
		}
		var dat = JSON.parse(reader.result);
		if(dat.texture){
		var farTexture = PIXI.Texture.fromImage(dat.texture,false,PIXI.SCALE_MODES.NEAREST);
		farTexture.baseTexture.addListener("loaded", function() {
		if(explosion)
		anim.removeChild(explosion);
		
		var Textures = [];
	
		for(var i = 0;i < dat.rect.length;i++)
		{
			if(farTexture.width > dat.rect[i].x && farTexture.height > dat.rect[i].y){
			var frame = new PIXI.Rectangle(dat.rect[i].x, dat.rect[i].y, dat.rect[i].width, dat.rect[i].height);
			var texture = new PIXI.Texture(farTexture, frame);
			Textures.push(texture);
			}
		}
	 
		explosion = new PIXI.extras.AnimatedSprite(Textures);
		explosion.x = dat.rect[0].width;
		explosion.y = (canvas.height/2);
		explosion.animationSpeed = dat.speed;
		explosion.gotoAndPlay(0);
		anim.addChild(explosion);
		});
		
		}
		};
			reader.readAsText(file);
	});
}

function MyBrowser() {
	canvas = document.getElementById('canvas');
	var ua = navigator.userAgent;
	if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
		canvas.addEventListener('touchstart', function(e) {
			touchstarts(e);
		}, false);
	} else if (ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0) {
		canvas.addEventListener('touchstart', function(e) {
			touchstarts(e);
		}, false);
	} else {
		canvas.onmousedown = function(e) {
			touchstarts(e);
		};
	}
	
	var browser = "";
	var userAgent = window.navigator.userAgent.toLowerCase();
	if (userAgent.indexOf('msie') != -1 || userAgent.indexOf('trident') != -1) {
		browser = 'IE';
	} else if (userAgent.indexOf('edge') != -1) {
		browser = 'ED';
	} else if (userAgent.indexOf('chrome') != -1) {
		browser = 'CR';
	} else if (userAgent.indexOf('safari') != -1) {
		browser = 'SF';
		$('#download').attr('download', 'data.json'); //属性追加
	} else if (userAgent.indexOf('firefox') != -1) {
		browser = 'FF';
		$('#download').attr('download', 'data.json'); //属性追加
	} else if (userAgent.indexOf('opera') != -1) {
		browser = 'OP';
	} else {
		browser = '?';
	}
	return browser;
}
(function initLoad()
{
	MyBrowser();
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
	loadfile();
	$('#red').click(function(){
		var cx = parseInt ($('#cutx').val());
		var cy = parseInt ($('#cuty').val());
		var width = parseInt ($('#width').val());
		var height = parseInt ($('#height').val());
		var speed = parseFloat($('#speed').val());
		if(isNaN (cx) || isNaN (cy) || isNaN (width) || isNaN (height) || isNaN (speed))
			return;
		loadanimTextures(cx,cy,width,height,speed);
	});
	
	jsonLoad();
	enterFrameHandler();
})();
function touchstarts(e)
{
	if(explosion)
	{
		explosion.x = e.pageX - (explosion.width / 2);
		explosion.y = e.pageY - (explosion.height / 2);
	}
}
var fps = 0;
function enterFrameHandler()
{
        requestAnimationFrame(() => {
          this.enterFrameHandler()
        });
	if(fps % 2 == 0){
    //Render the stage
    this.renderer.render(this.stage);
	}
	fps++;
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
$(window).on('orientationchange resize', function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	if(renderer){
	renderer.width = canvas.width;
	renderer.height = canvas.height;
	}
});