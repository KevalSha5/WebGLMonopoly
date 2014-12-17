var scene;
var camera;
var controls;
var renderer;
var container;
var boardDim;
var projector;

function initGameView () {
	scene = new THREE.Scene();
	boardDim = 1000;

	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight;

	var VIEW_ANGLE = 45;
	var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
	var NEAR = 1;
	var FAR = 10000;

	camera = new THREE.PerspectiveCamera ( VIEW_ANGLE, ASPECT, NEAR, FAR );
	scene.add( camera );

	camera.position.set ( 0, 5000, 0 );
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

	setupBoard();
	console.log(board.landableAreas)
	// projector = new THREE.Projector();
	window.addEventListener( 'mousemove', onMouseMove, false );
}

function setupBoard () {

	var scale = 5;

	var canvas = document.createElement( 'canvas' );
	canvas.width  = 1000 * scale;
	canvas.height = 1000 * scale;

	var context = canvas.getContext( '2d' );

	var maxDim = 140 * scale;
	var minDim = (canvas.width - 2 * maxDim) / 9;
	var avgDim = (maxDim + minDim) / 2;

	var xMid = canvas.width - maxDim / 2;
	var yMid = canvas.height - maxDim / 2;
	var rotation = 0;


	for (var i = 0; i < 40; i++) {


		board.landableAreas[i].dimensions = {};
		board.landableAreas[i].dimensions.xMid = xMid;
		board.landableAreas[i].dimensions.yMid = yMid;
		board.landableAreas[i].dimensions.width = (i % 10 == 0) ? maxDim : minDim;
		board.landableAreas[i].dimensions.height = maxDim;
		board.landableAreas[i].dimensions.rotation = rotation;
		

		if (i == 0) {			
			xMid -= avgDim;
			rotation = 0;
		} else if (i < 9) {
			xMid -= minDim;
		} else if (i == 9) {
			xMid -= avgDim;
			rotation = Math.PI / 2;
		} else if (i == 10) {
			yMid -= avgDim;
		} else if (i < 19) {
			yMid -= minDim;
		} else if (i == 19) {
			yMid -= avgDim;
			rotation = Math.PI;
		} else if (i == 20) {
			xMid += avgDim;
		} else if (i < 29) {
			xMid += minDim;
		} else if (i == 29) {
			xMid += avgDim;
			rotation = 3 * Math.PI / 2;
		} else if (i == 30) {
			yMid += avgDim;
		} else if (i < 40) {
			yMid += minDim;
		}
	}


	var grd = context.createLinearGradient(0, 0, 0, maxDim);
	grd.addColorStop(0, '#000000');
	grd.addColorStop(1, '#8ED6FF');

	context.font  = "normal 40px Arial";


	for (var i = 0; i < 40; i++) {
		var dim = board.landableAreas[i].dimensions;
		var name = board.landableAreas[i].name;
		context.save();
		context.translate( dim.xMid, dim.yMid );
		context.rotate( dim.rotation );


		context.fillStyle = grd;
		context.fillRect( -dim.width / 2, -dim.height / 2, dim.width, dim.height);
		context.rect( -dim.width / 2, -dim.height / 2, dim.width, dim.height);

			context.fillStyle = "#FFFFFF";
			console.log(name)
			context.textBaseline = "middle";
			context.textAlign = "center";			
			context.fillText(name, 0, 0, dim.width)

		context.restore();
	}


	// context.fill();

	context.lineWidth = 1 * scale;
	context.strokeStyle = 'white';
	context.stroke();
	context.stroke();

	var texture = new THREE.Texture( canvas );
	texture.needsUpdate = true;

	var material = new THREE.MeshBasicMaterial( { map: texture } );
	var geometry = new THREE.PlaneBufferGeometry( 5000, 5000 );

	var mesh = new THREE.Mesh( geometry, material );
	mesh.rotation.x = -Math.PI / 2;
	

	// var baseMaterial = new THREE.MeshBasicMaterial( {color: 0x8ED6FF } );
	// var baseGeometry = new THREE.BoxGeometry( 5000, 5000, 10 );
	// var baseMesh = new THREE.Mesh( baseGeometry, baseMaterial );
	// baseMesh.rotation.x = -Math.PI / 2;
	// baseMesh.position.y = -10;

	//TODO merge the geometries

	// scene.add( baseMesh );
	scene.add( mesh );

}

function onMouseMove( e ) {
	console.log( getMouse3D(e) );
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
	renderer.render( scene, camera );
}

function update () {
	//update game state
}

function startGameView () {
	initGameView();
	animate();
}