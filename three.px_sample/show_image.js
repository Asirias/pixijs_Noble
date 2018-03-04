(function() {
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;

var renderer, scene, camera, scene2d, camera2d;
var canvas;
var mesh;
var renderer2d;
var stage;
var stats;
var count;
 var sprite;
var pos;
var string;
var setumei;
var csprite;
  init();
  animate();

  function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x000000, 1);
    renderer.autoClear = false;
	canvas = renderer.domElement;
    document.body.appendChild(canvas);
	count = 0;
	string = "Three.jsとPixi.jsを合わせた\nPixi.jsの描画データーをテクスチャ化しThree.jsで表示している。\nこの使い方は非推奨の可能性があります。"+
	"特定のブラウザだと凄まじく遅い。マジでどうすればいいのか\n"+
	"Three.jsではフォントの作成が少々厄介。\nfillTextで書く必要がある。さらに高速でゲームで使えるものとなると、\nフォントデーターはテクスチャ化せざるを得ない\n"+
	"Pixi.jsの描画データーを動的なテクスチャにすることでこの手間は省ける。\nだがメモリをその分使うわけで結局私は方法を確立できないでいる。";

	stats = new Stats();
	stats.setMode(0);
	document.body.appendChild(stats.domElement);
	
function nearPow2(n)
{
    // nが0以下の時は0とする。
    if (n <= 0) return 0;

    // (n & (n - 1)) == 0 の時は、nが2の冪乗であるため、そのままnを返す。
    if ((n & (n - 1)) == 0) return n;

    // bitシフトを用いて、2の冪乗を求める。
    var ret = 1;
    while (n > 1) { ret <<= 1; n >>= 1; }
    return ret;
}
    (function init3D() {
      camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 0.001, 1000);
      camera.position.set(0, 0, 10);
      scene = new THREE.Scene();
      scene.add(new THREE.AmbientLight(0x303030));
      var light = new THREE.DirectionalLight(0xFFFFFF);
      light.position.set(1, 1, 1);
      scene.add(light);
       mesh = new THREE.Mesh(
        new THREE.SphereGeometry(1, 20, 20),
        new THREE.MeshLambertMaterial({ambient: 0xFFFFFF})
      );
	  pos = 0;
      mesh.position.set(0, pos, 0);
      scene.add(mesh);
	
    })();
    
    (function init2D() {
	const WIDTH2d = nearPow2(WIDTH);
	const HEIGHT2d = nearPow2(HEIGHT);
      camera2d = new THREE.OrthographicCamera(WIDTH2d/-2, WIDTH2d/2, HEIGHT2d/2, HEIGHT2d/-2, 0, 256);
      scene2d = new THREE.Scene();
    
     stage = new PIXI.Container();
     
	// 画面回転時に向きをチェック
        renderer2d = new PIXI.WebGLRenderer(
        WIDTH2d,
        HEIGHT2d,
		{
			antialias:true,
			transparent: true/*キャンバスを透明化する。*/
		});
	var Texbox = PIXI.Texture.fromImage("mesframe14_blue.png",true,PIXI.SCALE_MODES.NEAREST);
	Texbox.baseTexture.addListener("loaded",function(){
	sprite = new PIXI.Sprite(Texbox);
	sprite.alpha = 1;
	sprite.x = 0;
	sprite.y = 0;
	stage.addChild(sprite);
	setumei = new PIXI.Text("",{fontFamily:'Arial', fontSize:'16pt',fontWeight:'bold', fill:'#FF00FF'});
	 
	stage.addChild(setumei);

	var texture = new THREE.Texture(renderer2d.view);
	//テクスチャ画像の更新
	texture.needsUpdate = true;
	//材質オブジェクトの宣言と生成
    var material = new THREE.SpriteMaterial({ map: texture, color: 0xFFFFFF });
    //スプライトオブジェクトの生成
	 csprite = new THREE.Sprite( material );

    csprite.scale.set( WIDTH2d, HEIGHT2d, 1);
	scene2d.add(csprite);
});
      
    })();
  }
  
  function animate() {
    requestAnimationFrame(animate);
	
    renderer.clear();
	if (stats) stats.update();
	
	if(mesh)mesh.position.set(0, Math.sin(pos)*10, 0);
	if(sprite)sprite.position.set(Math.cos(pos)*64, 0, -255);
		pos+= 0.03;
		
	if(count <= string.length){
	if(csprite)csprite.material.map.needsUpdate = true;
	// テキストフィールドにデータを渡す処理
	if(setumei)setumei.text = string.substring(0, count);
	renderer2d.render(stage);
	count++;
	}else count = 0;
	
	renderer.render(scene, camera);
    renderer.render(scene2d, camera2d);
  }
})();