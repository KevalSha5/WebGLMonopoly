var scene;
var camera;
var controls;
var renderer;
var canvas;
var boardDim;
var objects = [];
var playerId = 0;
var player;
var tooltip;
var mouseCoord = {};
var mouseMoved = false;
var timeIdle = 0;
var lastTime = new Date().getTime();
var mouseDownObj = undefined;
var mouseUpObj = undefined;
var lastIntersectedObjects = [];
var intersectedObjets = [];
var SCREEN_WIDTH, SCREEN_HEIGHT;

var currentPlayer;
var moveAmount;

function endPlayerTurn () {

    if ( !currentPlayer.hasMoved ) {
        UI.alert( currentPlayer.name + " still needs to move !!!" );
        return;
    }

    startNextPlayerTurn();

}

function startNextPlayerTurn () {

    currentPlayer = board.players[ board.turn % board.players.length ];
    currentPlayer.hasMoved = false;
    UI.status( currentPlayer.name + "'s turn. Roll the die or develop." );
    board.turn++;
    // moveAmount = board.rollDie();
    // console.log( currentPlayer.name + "s turn, rolled: " + moveAmount )

}

function onMouseMove ( e ) {

    var x = e.clientX;
    var y = e.clientY;

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


    //for use in onMouseUp()
    mouseMoved = true;
    
    //for use in update()
    mouseCoord.x = x;
    mouseCoord.y = y;

    UI.pos.x = x;
    UI.pos.y = y;

    //for use in update()
    lastTime = new Date().getTime();

    //to cope with fast mouse movement
    update();
}

function onMouseDown ( e ) {

    mouseMoved = false;

    if ( intersectedObjets.length > 0 ) {

        var mouseDownObjGameRep = intersectedObjets[0].object.gameRep;

        if ( mouseDownObjGameRep instanceof Player ) {

            console.log( "token selected" );
             
            mouseDownObj = intersectedObjets[0];
            mouseDownObj.object.originalPos = mouseDownObj.object.position.clone();
            controls.noRotate = true;

        } else if ( mouseDownObjGameRep instanceof Die ) {

            mouseDownObj = intersectedObjets[0];

        } else if ( mouseDownObjGameRep instanceof GenericProperty ) {

            mouseDownObj = intersectedObjets[0];

        }else if ( mouseDownObjGameRep == "End Turn" ) {

            endPlayerTurn();

        } else {

            mouseDownObj = undefined;

        }
    }
}

function onMouseUp ( e ) {

    if ( mouseDownObj !== undefined ) {

        mouseUpObj = intersectedObjets[0];

        var mouseDownObjGameRep = mouseDownObj.object.gameRep;

        if ( mouseDownObjGameRep instanceof  Player ) {

            var destLand = board.landableAreas[ mouseDownObjGameRep.dest ];    
            var tokenCenter = mouseDownObj.object.position;
            var destDim = destLand.dimensions;
    
            var landIsValid = tokenCenter.x < destDim.xMid + destDim.width  / 2 &&
                              tokenCenter.x > destDim.xMid - destDim.width  / 2 &&
                              tokenCenter.z < destDim.yMid + destDim.height / 2 &&
                              tokenCenter.z > destDim.yMid - destDim.height / 2;
    
    
             if ( landIsValid ) {
    
                if ( mouseDownObjGameRep.pos != mouseDownObjGameRep.dest ) {
    
                    var selectedPlayer = mouseDownObjGameRep;
    
                    board.landableAreas[ selectedPlayer.dest ].land( selectedPlayer )
                    selectedPlayer.pos = selectedPlayer.dest;
                    selectedPlayer.hasMoved = true;
                    console.log( "Valid Land!")
    
                }

            } else {
    
                console.log( "resetting pos", mouseDownObj.object.originalPos );
                mouseDownObj.object.position.copy( mouseDownObj.object.originalPos );
            }

        } else if ( mouseDownObjGameRep instanceof GenericProperty ) {

            if ( !mouseMoved ) {

                console.log( "UI Property Options" );

            }

        } else if ( mouseDownObjGameRep instanceof Die ) {

            console.log(" Rolling Die " );

            if ( currentPlayer.hasMoved ) {

                UI.status( "Already moved. Can't roll again :\\" );

            } else {

                moveAmount = board.die.roll();
                currentPlayer.dest = (currentPlayer.pos + moveAmount) %
                board.landableAreas.length;
                UI.status( currentPlayer.name + " moves " + moveAmount + " spaces." );

            }

        }

    }

    mouseDownObj = undefined;
    controls.noRotate = false;
    update();

}

function onClick ( e ) {
    console.log( " :O " );
}

function onDoubleClick ( e ) {

    if ( intersectedObjets.length > 0 ) {

        var mouseDownObjGameRep = intersectedObjets[0].object.gameRep;

        if ( mouseDownObjGameRep instanceof GenericProperty ) {
            
            console.log( "Develop ops" )
            
        }
        
    }

}

function update () {

    controls.update();
    UI.update();

    timeIdle = new Date().getTime() - lastTime;
    // console.log( timeIdle );    


    // TODO - Some minor root canaling 


    var hoveredItemsChanged = !objsIdenticalUuid( intersectedObjets, lastIntersectedObjects );
    for (var i = 0; i < intersectedObjets.length; i++) 
        if (intersectedObjets[i].object.gameRep instanceof Player)
            hoveredItemsChanged = true;


    // if ( timeIdle > 5000 || !hoveredItemsChanged ) UI.showTooltip = true;
    // else UI.showTooltip = false;

    if ( timeIdle > 250 ) UI.showTooltip = true;
    else if ( UI.showTooltip && !hoveredItemsChanged && intersectedObjets.length > 0) UI.showTooltip = true;
    else UI.showTooltip = false;

    if ( !hoveredItemsChanged ) return;

    if ( mouseDownObj !== undefined && intersectedObjets.length > 1 ) {

        if ( mouseDownObj.object.gameRep instanceof Player ) {
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
            mouseDownObj.object.position.x = ground.point.x;
            mouseDownObj.object.position.z = ground.point.z;
        
        }
    }



    if ( intersectedObjets.length > 0 ) {

        UI.tooltip( intersectedObjets[0].object.gameRep );

        player.outline.visible = true;
        player.outline.geometry = intersectedObjets[0].object.geometry.clone();
        player.outline.position.copy( intersectedObjets[0].object.position );
        player.outline.rotation.copy( intersectedObjets[0].object.rotation );

    } else {

        UI.tooltip( "" );
        player.outline.visible = false;
    }   

}


function objsIdenticalUuid ( array1, array2 ) {

    if ( array1.length !== array2.length ) return false;

    for (var i = 0; i < array1.length; i++)
        if (array1[i].object.uuid !== array2[i].object.uuid) 
            return false;

    return true;

}

function setupBoard () {

    // the client player
    playerId = 0;
    player = board.players[playerId];

    // current player
    currentPlayer = board.players[0];
    moveAmount = 0;

    var maxDim = 450;
    var minDim = (boardDim - 2 * maxDim) / 9;
    var avgDim = (maxDim + minDim) / 2;

    var xMid = boardDim - maxDim / 2;
    var yMid = boardDim - maxDim / 2;
    var rotation = 0;

    // used to rotate width & height
    var lAreaRot;
    var width, height, temp;



    for (var i = 0; i < 40; i++) {    

        width = (i % 10 == 0) ? maxDim : minDim;
        height = maxDim;

        lAreaRot = rotation;        
        while ( lAreaRot > 0 ) {
            temp = width;
            width = height;
            height = temp;
            lAreaRot -= Math.PI / 2;
        }

        board.landableAreas[i].dimensions = {};
        board.landableAreas[i].dimensions.xMid = xMid;
        board.landableAreas[i].dimensions.yMid = yMid;
        board.landableAreas[i].dimensions.width = width;
        board.landableAreas[i].dimensions.height = height;
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
    // scene.add( mesh );
    // objects.push( mesh );

    
    // ALL THE LANDABLES
    var lArea;
    var height = 40;
    for (var i = 0; i < 40; i++) {

        lArea = board.landableAreas[i].dimensions;

        //GET THE 2D CONTEXT
        var canvas = document.createElement( 'canvas' );
        canvas.width  = lArea.width;
        canvas.height = lArea.height;

        var context = canvas.getContext( '2d' );

        // CREATE IMAGE FOR LANDALBE AREA

        // context.stroke();

        context.fillStyle = "#CDE6D0"
        context.fillRect( 0, 0, canvas.width, canvas.height );

        context.save();

        context.translate( lArea.width / 2, lArea.height / 2 )

        context.rotate( lArea.rotation );
        if (i % 10 == 0) context.rotate( -Math.PI / 4 ); // rotate more for cornor areas

        var canvasXMid;

        if ( lArea.rotation == Math.PI / 2 || lArea.rotation == 3 * Math.PI / 2){
            context.translate( -lArea.height / 2, -lArea.width / 2 );
            canvasXMid = lArea.height / 2;

         } else {   
             context.translate( -lArea.width / 2, -lArea.height / 2 );
             canvasXMid = lArea.width / 2;

         }


        var propColor;

        // FILL STREET COLOR
        if ( board.landableAreas[i] instanceof Street) {
            propColor = board.landableAreas[i].color;
            context.fillStyle = propColor;
            context.fillRect( 0, 0, lArea.width, 100 )
        } else {

            propColor = "#CDE6D0";

        }


        // console.log( lArea.rotation );

        context.font = '27pt Calibri';
        context.textAlign = 'center';
        context.fillStyle = 'black';
        context.textBaseline = "middle";

        
        var name = board.landableAreas[i].name;
        var lines = name.split("\n");
        // console.log( lines.length )
        // var line = "";

        var offset = 0;
        if (board.landableAreas[i] instanceof Street) offset = 100;

        for ( var j = 0; j < lines.length; j++ ) {

            context.fillText( lines[j], canvasXMid, offset + (40 * (j + 1)), lArea.width )

        }

        // PROPERTY PRICE
        if ( board.landableAreas[i] instanceof GenericProperty ) {

            var bottom = lArea.height;
            if ( lArea.rotation == Math.PI / 2 || lArea.rotation == 3 * Math.PI / 2)
                bottom = lArea.width;

            var cost = board.landableAreas[i].cost;
            context.fillText( "$" + cost, canvasXMid, bottom - 30, lArea.width)

        }

        // context.fillText( board.landableAreas[i].name, canvasXMid, 50, lArea.width )
       
        if (board.landableAreas[i] instanceof Street)
            context.rect( 0, 0, canvas.width, offset );

        context.restore();
                
        context.lineWidth = 5;
        context.strokeStyle = 'black';
        context.rect( 0, 0, canvas.width, canvas.height );
        context.stroke();

        // context.fill();


        var texture = new THREE.Texture( canvas );
        canvas.remove();
        texture.needsUpdate = true;

        var mainFaceMaterial = new THREE.MeshBasicMaterial( { map: texture } );
        var backFaceMaterial = new THREE.MeshBasicMaterial( { color: propColor } );
        var defaultMaterial  = new THREE.MeshPhongMaterial( { color: 0x0a9a54 } );

        materials = [
            defaultMaterial,
            defaultMaterial,
            mainFaceMaterial,
            defaultMaterial,
            defaultMaterial,
            defaultMaterial
        ];

        var backFaceIndex;
        if ( lArea.rotation == 0 )               backFaceIndex = 5;
        if ( lArea.rotation == Math.PI / 2 )     backFaceIndex = 0;
        if ( lArea.rotation == Math.PI )         backFaceIndex = 4;
        if ( lArea.rotation == 3 * Math.PI / 2 ) backFaceIndex = 1;

        if (board.landableAreas[i] instanceof Street)
            materials[ backFaceIndex ] = backFaceMaterial;

        // 0 - 6
        // 1 - 1
        // 2 - 5
        // 3 - 2

        geometry = new THREE.BoxGeometry( lArea.width, height, lArea.height );
        mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
        // mesh.rotation.y = lArea.rotation;
        mesh.position.set( lArea.xMid, height / 2, lArea.yMid);

        mesh.gameRep = board.landableAreas[i];
        objects.push( mesh );
        scene.add( mesh );
    }

    for (var i = 0; i < board.players.length; i++) {

        //PLAYER SELECTION OUTLINES
        var geometry = new THREE.Geometry();
        var outlineMaterial = new THREE.MeshBasicMaterial( { 
            color: 0xff0000, side: THREE.FrontSide, transparent: true, opacity: 0.25 } );
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

    // END TURN BUTTON
    var turnGeometry = new THREE.CylinderGeometry( 100, 100, 100 );
    var turnMaterial = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
    var turnMesh = new THREE.Mesh( turnGeometry, turnMaterial );

    turnMesh.position.set( 3 * boardDim / 4, 50, 3 * boardDim / 4 );
    turnMesh.gameRep = "End Turn";

    objects.push( turnMesh );
    scene.add( turnMesh );

    // ADD DIE
    var dieGeometry = new THREE.BoxGeometry( 200, 200, 200 );
    var dieMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
    var dieMesh = new THREE.Mesh( dieGeometry, dieMaterial );

    dieMesh.position.set( boardDim / 2, 100, boardDim / 2 );
    dieMesh.gameRep = board.die;

    objects.push( dieMesh );
    scene.add( dieMesh );
}



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
    camera.position.set ( boardDim / 2, 3000, boardDim / 2 );
    camera.lookAt( boardDim / 2, 0, boardDim / 2 );
    scene.add( camera );
    
    //get renderer
    if (window.WebGLRenderingContext) renderer = new THREE.WebGLRenderer();
    else renderer = new THREE.CanvasRenderer( { antialias: true } );

    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;
    renderer.setClearColor( 0x535353, 1 );

    canvas = document.getElementById( 'gameView' );
    canvas.appendChild( renderer.domElement );
    
    var container = document.getElementById( "ui-wrapper" );

    //set controls
    controls = new THREE.OrbitControls( camera );
    controls.addEventListener( 'chance', render );    
    controls.target = new THREE.Vector3( boardDim / 2, 0, boardDim / 2 );

    var dLight1 = new THREE.DirectionalLight( 0xffffff, .30 );
    dLight1.position.set( boardDim, boardDim / .75, boardDim );
    scene.add( dLight1 );

    // var dLight2 = new THREE.DirectionalLight( 0xffffff, .30 );
    // dLight2.position.set( 0, boardDim / .75, 0 );
    // dLight2.target.position.set( boardDim, 0, boardDim );
    // scene.add( dLight2 );

    var aLight = new THREE.AmbientLight ( 0x9a9a9a );
    scene.add( aLight );


    addListeners();
    setupBoard();
    startNextPlayerTurn();

    // UI.auction( board.landableAreas[1] );
}

var eventListeners = {
    "mousemove": onMouseMove,
    "mousedown": onMouseDown,
    "mouseup"  : onMouseUp,
    "dblclick" : onDoubleClick
}

function removeListeners () {
    for ( var key in eventListeners )
        window.removeEventListener( key, eventListeners[ key ] );
}

function addListeners () {
    for ( var key in eventListeners )
        window.addEventListener( key, eventListeners[ key ] );
}

function getControlValues () {
    console.log( controls.phiDelta )
    // return {phiDelta: controls.noPan, thetaDelta: controls.thetaDelta, scale: controls.scale}
}

function compareControlValues () {

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