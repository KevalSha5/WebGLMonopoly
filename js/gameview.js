var scene;
var camera;
var controls;
var renderer;
var container;
var boardDim;
var objects = [];
var scale = 5;
var playerId = 0;
var tooltip;
var mouseCoord = {};
var blankGeometry = new THREE.Geometry();
var selectionChanged;

function initGameView () {
    scene = new THREE.Scene();
    boardDim = 1000 * scale;

    var SCREEN_WIDTH = window.innerWidth;
    var SCREEN_HEIGHT = window.innerHeight;

    var VIEW_ANGLE = 60;
    var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
    var NEAR = 2;
    var FAR = 10000;

    camera = new THREE.PerspectiveCamera ( VIEW_ANGLE, ASPECT, NEAR, FAR );
    scene.add( camera );

    camera.position.set ( boardDim / 2, 5000, boardDim / 2 );
    camera.lookAt( boardDim / 2, 0, boardDim / 2 );

    controls = new THREE.OrbitControls( camera );
    controls.addEventListener( 'chance', render );


    if (window.WebGLRenderingContext) renderer = new THREE.WebGLRenderer();
    else renderer = new THREE.CanvasRenderer( { antialias: true } );

    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.setClearColor( 0xafafaf, 1 );

    container = document.getElementById( 'gameView' );
    container.appendChild( renderer.domElement );
    
    var dLight = new THREE.DirectionalLight( 0xffffff, .25 );
    dLight.position.set( boardDim, boardDim, boardDim );
    scene.add( dLight );

    var aLight = new THREE.AmbientLight ( 0x9a9a9a );
    scene.add( aLight );


    setupBoard();
    console.log(board.landableAreas)
    window.addEventListener( 'mousemove', onMouseMove, false );
}

function setupBoard () {

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


    // var grd = context.createLinearGradient(0, 0, 0, maxDim);
    // grd.addColorStop(0, '#000000');
    // grd.addColorStop(1, '#8ED6FF');

    // context.font  = "normal 40px Arial";


    // for (var i = 0; i < 40; i++) {
    //  var dim = board.landableAreas[i].dimensions;
    //  var name = board.landableAreas[i].name;
    //  context.save();
    //  context.translate( dim.xMid, dim.yMid );
    //  context.rotate( dim.rotation );


    //  context.fillStyle = grd;
    //  context.fillRect( -dim.width / 2, -dim.height / 2, dim.width, dim.height);
    //  context.rect( -dim.width / 2, -dim.height / 2, dim.width, dim.height);

    //      context.fillStyle = "#FFFFFF";
    //      console.log(name)
    //      context.textBaseline = "middle";
    //      context.textAlign = "center";           
    //      context.fillText(name, 0, 0, dim.width)

    //  context.restore();


    // }


    // context.fill();

    // context.lineWidth = 1 * scale;
    // context.strokeStyle = 'white';
    // context.stroke();
    // context.stroke();

    // var texture = new THREE.Texture( canvas );
    // texture.needsUpdate = true;

    // var material = new THREE.MeshBasicMaterial( { map: texture } );


    var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
    var geometry = new THREE.PlaneBufferGeometry( boardDim, boardDim );

    var mesh = new THREE.Mesh( geometry, material );
    mesh.rotation.x = -Math.PI / 2;
    scene.add( mesh );
    mesh.position.x = boardDim / 2;
    mesh.position.z = boardDim / 2;
    

    var lArea;
    var height = 40;
    for (var i = 0; i < 40; i++) {
        lArea = board.landableAreas[i].dimensions;

        material = new THREE.MeshPhongMaterial( { color: 0x0a9a54 } );
        geometry = new THREE.BoxGeometry( lArea.width, height, lArea.height );
        mesh = new THREE.Mesh( geometry, material );
        mesh.rotation.y = lArea.rotation;
        mesh.position.set( lArea.xMid, height / 2, lArea.yMid);
        mesh.boardObject = board.landableAreas[i];

        objects.push( mesh );
        scene.add( mesh );      
    }

    for (var i = 0; i < board.players.length; i++) {

        var player = board.players[i];


        //player selection outline 
        var geometry = new THREE.Geometry();
        var outlineMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, side: THREE.FrontSide, transparent: true, opacity: 0.25} );
        var outlineMesh = new THREE.Mesh( geometry, outlineMaterial );
        outlineMesh.scale.multiplyScalar(1.05);

        player.outlineMesh = outlineMesh;
        player.hoveredObject = undefined;
        player.hoveredObjectPrev = undefined;

        scene.add( outlineMesh );


        //player tokens
        var tokenMaterial = new THREE.MeshPhongMaterial( {color: 0xfafa00 } );
        var tokenGeometry = new THREE.BoxGeometry( 100, 100, 100 );
        var tokenMesh = new THREE.Mesh( tokenGeometry, tokenMaterial );
        tokenMesh.position.x = board.landableAreas[0].dimensions.xMid;
        tokenMesh.position.y = 50 + height;
        tokenMesh.position.z = board.landableAreas[0].dimensions.yMid;

        player.token = tokenMesh;
        objects.push (tokenMesh );
        scene.add ( tokenMesh ); //only add token for first player for the time being
    }
}

function onMouseMove( e ) {

    //update previously selected to be currently selected

    var x, y;

    if (e.offsetX !== undefined) {
        x = e.offsetX;
        y = e.offsetY;
    } else {
        x = e.layerX;
        y = e.layerY;
    }

    var mouseVector = new THREE.Vector3 (
             (x / renderer.domElement.width) * 2 - 1,
            -(y / renderer.domElement.height) * 2 + 1,
            1
        );

    mouseVector.unproject( camera );
    mouseVector.sub( camera.position );
    mouseVector.normalize();

    var raycaster = new THREE.Raycaster(); //TODO - make raycaster a global variable, for better performance
    raycaster.ray.set( camera.position, mouseVector );
    var intersects = raycaster.intersectObjects( objects );



    var player = board.players[playerId]

    // if (player.hoveredObjectPrev !== undefined) console.log(player.hoveredObjectPrev.object)
    // if (player.hoveredObject !== undefined) console.log(player.hoveredObject.object)

    player.hoveredObjectPrev = player.hoveredObject;
    player.hoveredObject = intersects[0];

    var hOP = player.hoveredObjectPrev;
    var hO = player.hoveredObject;

    if (typeof hO !== typeof hOP) selectionChanged = true;
    else if (hO !== undefined && hOP !== undefined &&
             hO.object.uuid != hOP.object.uuid) selectionChanged = true;
    else selectionChanged = false;

    //for use in update()
    mouseCoord.x = x;
    mouseCoord.y = y;

    //to cope with fast mouse movement
    update();
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

    controls.update();
   

    //do the following for ALL players
    for (var i = 0; i < board.players.length; i++) {
         //update token positions (WILL NEED THIS HERE FOR INTERACTIVITY)
        var lAreaDim = board.landableAreas[board.players[i].pos].dimensions;
        board.players[i].token.position.x = lAreaDim.xMid;
        board.players[i].token.position.z = lAreaDim.yMid;  
    }

    //TODO - PRIORITY - only update things that changed
    //TODO - the FOR-LOOP can be optimized more by using a flag to identify previously selected item


    //do the following for THIS player 

    var player = board.players[playerId]

    if ( !selectionChanged ) return;

    //if nothing is selected
    if (player.hoveredObject === undefined) { 

        //clear player selection            
        player.outlineMesh.geometry.dispose(); 
        player.outlineMesh.geometry = blankGeometry.clone();

        //hide the tooltip //TODO - MOVE OUTSIDE OF IF STATEMENT ??
        $("#tooltip").hide();
        $("#tooltip").html("");
        $("#tooltip").removeClass();


    //if selection has changed  
    } else { 

        //move players outline to this object
        player.outlineMesh.geometry = player.hoveredObject.object.geometry.clone();
        player.outlineMesh.position.copy( player.hoveredObject.object.position );
        player.outlineMesh.rotation.copy( player.hoveredObject.object.rotation );


        //fill tooltip with the relevant info
        if (player.hoveredObject.object.boardObject instanceof GenericLandableArea) {
            fillTooltipLandableArea(player.hoveredObject.object.boardObject)
        } 
        
        //show the tooltip
        $("#tooltip").offset( { left: mouseCoord.x + 15 ,top: mouseCoord.y + 15 } );
        $("#tooltip").show();
    }


}

function fillTooltipLandableArea (landableArea) {

    if (landableArea instanceof Street) {
        $("#tooltip").html("<p>" + landableArea.name + "</p>");
        $("#tooltip").addClass("Street");

    } else if (landableArea instanceof Railroad) {
        $("#tooltip").html("<p>" + landableArea.name + "</p>");
        $("#tooltip").addClass("Railroad");
    }

}
function startGameView () {
    initGameView();
    animate();
}