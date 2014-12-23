var scene;
var camera;
var controls;
var renderer;
var container;
var boardDim;
var objects = [];
var playerId = 0;
var player;
var tooltip;
var mouseCoord = {};
var lastIntersectedObjects = [];
var intersectedObjets = [];
var SCREEN_WIDTH, SCREEN_HEIGHT;

function initGameView () {
    scene = new THREE.Scene();
    boardDim = 3000;

    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;

    // camera vars
    var VIEW_ANGLE = 45;
    var ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT;
    var NEAR = 2;
    var FAR = 10000;

    //set camera
    camera = new THREE.PerspectiveCamera ( VIEW_ANGLE, ASPECT, NEAR, FAR );
    camera.position.set ( boardDim / 2, 5000, boardDim / 2 );
    camera.lookAt( boardDim / 2, 0, boardDim / 2 );
    scene.add( camera );

    //set controls
    controls = new THREE.OrbitControls( camera );
    controls.addEventListener( 'chance', render );
    controls.noPan = true;
    controls.target = new THREE.Vector3( boardDim / 2, 0, boardDim / 2 );

    //get renderer
    if (window.WebGLRenderingContext) renderer = new THREE.WebGLRenderer();
    else renderer = new THREE.CanvasRenderer( { antialias: true } );

    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.setClearColor( 0x535353, 1 );

    container = document.getElementById( 'gameView' );
    container.appendChild( renderer.domElement );
    
    var dLight = new THREE.DirectionalLight( 0xffffff, .30 );
    dLight.position.set( boardDim, boardDim / .75, boardDim );
    scene.add( dLight );

    var aLight = new THREE.AmbientLight ( 0x9a9a9a );
    scene.add( aLight );


    playerId = 0;
    player = board.players[playerId];

    setupBoard();
    console.log(board.landableAreas)
    window.addEventListener( 'mousemove', onMouseMove, false );
    window.addEventListener( 'mousedown', onMouseDown, false );
    window.addEventListener( 'mouseup', onMouseUp, false );

}

function setupBoard () {

    var canvas = document.createElement( 'canvas' );
    canvas.width  = boardDim;
    canvas.height = boardDim

    var context = canvas.getContext( '2d' );

    var maxDim = 520;
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

        //for loop updates middle coordiante and rotation of each landable area
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



    // PLANE GEOMETRY
    var material = new THREE.MeshPhongMaterial( { color: 0x00aaff } );
    var geometry = new THREE.PlaneBufferGeometry( boardDim, boardDim );

    var mesh = new THREE.Mesh( geometry, material );
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.x = boardDim / 2;
    mesh.position.z = boardDim / 2;
    scene.add( mesh );
    // objects.push( mesh );
    

    // ALL THE LANDABLES
    var lArea;
    var height = 40;
    for (var i = 0; i < 40; i++) {
        lArea = board.landableAreas[i].dimensions;

        material = new THREE.MeshPhongMaterial( { color: 0x0a9a54 } );
        geometry = new THREE.BoxGeometry( lArea.width, height, lArea.height );
        mesh = new THREE.Mesh( geometry, material );
        mesh.rotation.y = lArea.rotation;
        mesh.position.set( lArea.xMid, height / 2, lArea.yMid);

        mesh.gameRep = board.landableAreas[i];
        objects.push( mesh );
        scene.add( mesh );      
    }

    for (var i = 0; i < board.players.length; i++) {

        //PLAYER SELECTION OUTLINES
        var geometry = new THREE.Geometry();
        var outlineMaterial = new THREE.MeshBasicMaterial( { 
            color: 0x345324, side: THREE.FrontSide, transparent: true, opacity: 0.25 } );
        var outlineMesh = new THREE.Mesh( geometry, outlineMaterial );
        outlineMesh.scale.multiplyScalar(1.05);

        player.outline = outlineMesh;
        scene.add( outlineMesh );


        //PLAYER TOKENS
        var tokenMaterial = new THREE.MeshLambertMaterial( { 
            color: 0xfafa00, shininess: 10 } );
        var tokenGeometry = new THREE.BoxGeometry( 100, 100, 100 );
        var tokenMesh = new THREE.Mesh( tokenGeometry, tokenMaterial );
        tokenMesh.position.x = board.landableAreas[0].dimensions.xMid;
        tokenMesh.position.y = 50 + height;
        tokenMesh.position.z = board.landableAreas[0].dimensions.yMid;

        tokenMesh.gameRep = board.players[i];
        player.token = tokenMesh;
        objects.push(tokenMesh );
        scene.add( tokenMesh );
    }
}

function onMouseMove ( e ) {

    var x, y;

    if (e.offsetX !== undefined) {
        x = e.offsetX;
        y = e.offsetY;
    } else {
        x = e.layerX;
        y = e.layerY;
    }

    //for use in update()
    mouseCoord.x = x;
    mouseCoord.y = y;

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

    lastIntersectedObjects = intersectedObjets;
    intersectedObjets = raycaster.intersectObjects( objects );

    //to cope with fast mouse movement
    update();
}

function onMouseDown ( e ) {

    if ( intersectedObjets.length > 0 ) {

        if ( intersectedObjets[0].object.gameRep instanceof Player ) {
            player.selectedObj = intersectedObjets[0];
            controls.noRotate = true;
        }

    }

}

function onMouseUp ( e ) {

    player.selectedObj = undefined;
    controls.noRotate = false;

}

function update () {

    controls.update();

    // $("#tooltip").show();
    // $("#tooltip").offset( { left: mouseCoord.x + 40 , top:  mouseCoord.y - 200 - 40 } ); 

    // var hoveredItemsChanged = !objsIdenticalUuid( intersectedObjets, lastIntersectedObjects );
    // if ( !hoveredItemsChanged ) return;

    if ( player.selectedObj !== undefined && intersectedObjets.length > 1 ) {
        /*
            This means token is selected, and as long mouse intersects
            at least two items (one is token) update the token pos
        */

        var ground;
        for ( var i = 0; i < intersectedObjets.length; i++ )
            if ( intersectedObjets[i].object.gameRep instanceof GenericLandableArea ) {
                ground = intersectedObjets[i];
                break;            
            }
        player.selectedObj.object.position.x = ground.point.x;
        player.selectedObj.object.position.z = ground.point.z;
    }



    if ( intersectedObjets.length > 0 ) {

        player.outline.visible = true;
        player.outline.geometry = intersectedObjets[0].object.geometry.clone();
        player.outline.position.copy( intersectedObjets[0].object.position );
        player.outline.rotation.copy( intersectedObjets[0].object.rotation );

    } else {

        player.outline.visible = false;
    }   

}

function fillTooltipLandableArea ( landableArea ) {

    //clear the tooltip
    $("#tooltip").html("");
    $("#tooltip").removeClass();    

    if (landableArea instanceof Street) {
        $("#tooltip").html("<p>" + landableArea.name + "</p>");
        $("#tooltip").addClass("Street");

    } else if (landableArea instanceof Railroad) {
        $("#tooltip").html("<p>" + landableArea.name + "</p>");
        $("#tooltip").addClass("Railroad");

    } else if (landableArea instanceof Utility) {
        $("#tooltip").html("<p>" + landableArea.name + "</p>");
        $("#tooltip").addClass("Utility");

    } else if (landableArea instanceof GenericLandableArea) {
        $("#tooltip").html("<p>" + landableArea.name + "</p>");
        $("#tooltip").addClass("GenericLandableArea"); //probably not proper to call this "generalland..."
    }

}

function objsIdenticalUuid ( array1, array2 ) {

    if ( array1.length !== array2.length ) return false;

    for (var i = 0; i < array1.length; i++)
        if (array1[i].object.uuid !== array2[i].object.uuid) 
            return false;

    return true;

}

function animate () {
    requestAnimationFrame( animate );
    render();
    update();
}

function render () {
    renderer.render( scene, camera );
}

function startGameView () {
    initGameView();
    animate();
}