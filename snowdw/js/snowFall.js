/*!
 * snowFall Jquery plugin
 * Date: 2016-02-02 15:04
 * fall snow effect based on jquery and three.js
 * author 此生唯晴 http://weibo.com/cishengweiqing/
 * This is licensed under the GNU LGPL, version 2.1 or later.
 * For details, see: http://creativecommons.org/licenses/LGPL/2.1/
 */

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
//容器
var container;
//雪花例子
var particle;
//摄像机
var camera;
//场景
var scene;
//渲染器
var renderer;

var mouseX = 0;
var mouseY = 0;
//粒子在垂直（Y轴）方向运动范围
var particleY_Range = 0;
//粒子在垂直（X轴）方向运动范围
var particleX_Range = 0;

//风力权重，正值向右，负值向左，0表示无风
var wind_weight = 0;

var windowHalfX = SCREEN_WIDTH / 2;
var windowHalfY = SCREEN_HEIGHT / 2;

var particles = []; 
//粒子图片

var js=document.scripts;
//获取相对当前js目录的雪花图片路径
var path=js[js.length-1].src.substring(0,js[js.length-1].src.lastIndexOf("/"));
var imageSrc=path.substring(0,path.lastIndexOf("/")+1)+"images/ParticleSmoke.png";

var particleImage = new Image();//THREE.ImageUtils.loadTexture( "img/ParticleSmoke.png" );
particleImage.src = imageSrc; 

function onDocumentMouseMove( event ) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - particleY_Range / 2;
}

function onDocumentTouchStart( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - particleY_Range / 2;
	}
}

function onDocumentTouchMove( event ) {

	if ( event.touches.length == 1 ) {

		event.preventDefault();

		mouseX = event.touches[ 0 ].pageX - windowHalfX;
		mouseY = event.touches[ 0 ].pageY - particleY_Range / 2;
	}
}

//

function loop() {
	for(var i = 0; i<particles.length; i++)
	{
		var particle = particles[i]; 
		particle.updatePhysics(); 
		with(particle.position)
		{
			if(y<-particleY_Range / 2) y+=particleY_Range; 
//			Z轴位置不变
			if(x>windowHalfX) x-=SCREEN_WIDTH; 
			else if(x<-windowHalfX) x+=SCREEN_WIDTH; 
			//风力偏向效果
			x+=wind_weight;
//			if(z>1000) z-=2000; 
//			else if(z<-1000) z+=2000; 
		}				
	}

	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
	camera.lookAt(scene.position); 

	renderer.render( scene, camera );
}
//绑定jquery方法
jQuery.extend({
	snowFall:function(options){
		 var defaults = {     
			//创建粒子数量，密度
			particleNo: 500,
			//粒子下拉速度
			particleSpeed:15,
			//粒子在垂直（Y轴）方向运动范围
			particleY_Range:1300,
			//粒子在垂直（X轴）方向运动范围
			particleX_Range:1000,
			//是否绑定鼠标事件
		    bindMouse: false,
		    //相机离Z轴原点距离
		    zIndex:600,
		    //风力强度，正值向右，负值向左
		    wind_weight:0,
		    //摄像机视野角度
		    angle:55
		  };     
		var opts = $.extend(defaults, options);     
		
		particleY_Range=opts.particleY_Range;
		particleX_Range=opts.particleX_Range;
		
		wind_weight=opts.wind_weight;
		
		container = document.createElement('div');
		document.body.appendChild(container);
//		透视相机，物体大小随距离摄像机远近改变，对比投影相机
//		相机的上方向为Y轴，右方向为X轴，沿着Z轴垂直朝里（视野角：fov； 纵横比：aspect； 相机离视最近的距离：near； 相机离视体积最远距离：far）
		camera = new THREE.PerspectiveCamera( opts.angle, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
		//设置摄像机z坐标位置距离原点向外距离
		camera.position.z = opts.zIndex;
		//创建场景
		scene = new THREE.Scene();
		scene.add(camera);
		//创建渲染器
		renderer = new THREE.CanvasRenderer();
		renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
		//创建材料
		var material = new THREE.ParticleBasicMaterial( { map: new THREE.Texture(particleImage) } );
			
		for (var i = 0; i < opts.particleNo; i++) {

			particle = new Particle3D( material);
			particle.position.x = Math.random() * SCREEN_WIDTH - windowHalfX;
			particle.position.y = Math.random() * SCREEN_HEIGHT * 2 - SCREEN_HEIGHT;
			particle.position.z = Math.random() * opts.zIndex * 4 - opts.zIndex*2;
			particle.scale.x = particle.scale.y =  1;
			scene.add( particle );
			
			particles.push(particle); 
		}

		container.appendChild( renderer.domElement );
		if(opts.bindMouse){
			document.addEventListener( 'mousemove', onDocumentMouseMove, false );
			document.addEventListener( 'touchstart', onDocumentTouchStart, false );
			document.addEventListener( 'touchmove', onDocumentTouchMove, false );
		}	
		setInterval( loop, opts.particleSpeed );
	}
});