var scene;
var camera;
var controls;
var renderer;
var container;
var boardDim;

function initGameView () {
	scene = new THREE.Scene();
	boardDim = 1000;

	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight;

	var VIEW_ANGLE = 45;
	var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
	var NEAR = 1;
	var FAR = 1500;

	camera = new THREE.PerspectiveCamera ( VIEW_ANGLE, ASPECT, NEAR, FAR );
	scene.add( camera );

	camera.position.set ( 0, 1000, 0 );
	camera.lookAt( 0, 0, 0 );

	controls = new THREE.OrbitControls( camera );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	renderer.shadowMapEnabled = true;
	renderer.shadowMapSoft = true;
	renderer.setClearColor( 0xafafaf, 1 );

	container = document.getElementById( 'gameView' );
	container.appendChild( renderer.domElement );

	var aLight = new THREE.AmbientLight ( 0xafafaf );
	scene.add( aLight );

	setupBoardTexture();

}

function setupBoardTexture () {
	var canvas = document.createElement( 'canvas' );
	canvas.width  = 1000;
	canvas.height = 1000;

	var context = canvas.getContext( '2d' );


	var maxDim = 125;
	var minDim = (canvas.width - 2 * maxDim) / 9;
	var xMid = canvas.width - maxDim / 2;
	var yMid = canvas.height - maxDim / 2;


	for (var i = 0; i < 4; i++){
	
		var xMid = canvas.width - maxDim / 2;

		context.rect(xMid - maxDim/2, yMid - maxDim/2, maxDim, maxDim);
		for (var j = 0; j < 9; j++) {
			xMid -= minDim;
			context.rect(xMid - maxDim/2, yMid - maxDim/2, minDim, maxDim);
		}

		context.translate( canvas.width / 2, canvas.height / 2 );
		context.rotate( Math.PI / 2);
		context.translate( -canvas.width / 2, -canvas.height /2 );

	}


	context.lineWidth = 1;
	context.strokeStyle = 'white';
	context.stroke();
	context.stroke();

	var texture = new THREE.Texture( canvas );
	texture.needsUpdate = true;

	var material = new THREE.MeshBasicMaterial( { map: texture } );

	var geometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
	var mesh = new THREE.Mesh( geometry, material );

	mesh.rotation.x = -Math.PI/2;

	scene.add( mesh );

}

function getMouse3D(mouseEvent) {
    var x, y;
    //
    if (mouseEvent.offsetX !== undefined) {
        x = mouseEvent.offsetX;
        y = mouseEvent.offsetY;
    } else {
        x = mouseEvent.layerX;
        y = mouseEvent.layerY;
    }
 
    var pos = new THREE.Vector3(0, 0, 0);
    var pMouse = new THREE.Vector3(
        (x / renderer.domElement.width) * 2 - 1,
       -(y / renderer.domElement.height) * 2 + 1,
       1
    );
    //
    projector.unprojectVector(pMouse, camera);
 
    var cam = camera.position;
    var m = pMouse.y / ( pMouse.y - cam.y );
 
    pos.x = pMouse.x + ( cam.x - pMouse.x ) * m;
    pos.z = pMouse.z + ( cam.z - pMouse.z ) * m;
 
    return pos;
}

function animate () {
	requestAnimationFrame( animate );
	render();
	update();
}

function render () {
	if (renderer) renderer.render( scene, camera );
}

function update () {
	//update game state
}

function startGameView () {
	initGameView();
	animate();
}