// AFRAME.registerComponent('house', {
//   init: function () {
//     this.el.addEventListener('model-loaded', function() {
//       // This runs after the house has finished loading
//       set3DObjectVariables();
//       floorChange(0); // hide roof
//       fixtures.visible = false; // hide fixtures

//       glasSettings(windowglas);
//     })
//   }
// });

// /*
// ------ SIDE PANEL ------
// For opening and closing sidepanel
// */

// var menuopen = false;
// var mouseOverSidepanel;

// function menuBtn(){
//   if (menuopen){
//     closeSidePanel();
//   } else {
//     openSidePanel();
//   }
// }

// function closeSidePanel(){
//   document.getElementById("sidepanel").style.left = "-230px";
//   document.getElementById("topleftbtns").style.left = "20px";
//   menuopen = false;
// }
// function openSidePanel(){
//   document.getElementById("sidepanel").style.left = "0px";
//   document.getElementById("topleftbtns").style.left = "240px";
//   menuopen = true;
//   if(savePanelOpen){
//     toggleSavePanel();
//   }
// }

// function sidePanelStart(){
//   if(screen.width > 799){
//     openSidePanel();
//   }
//   sidepanelMat();
//   sidepanelMouseOver();
// }

// // For opening and closing material sub menu in sidepanel
// function sidepanelMat(){
//   var sidepanelButtons = document.getElementsByClassName('panelMat');
//   var sidepanel = document.getElementById('sidepanel');
//   var i;
//   for (i = 0; i < sidepanelButtons.length; i++){
//     sidepanelButtons[i].addEventListener('click', function(){
//       this.classList.toggle('selectedMat');
//       sidepanel.classList.toggle('showMat');
//     })
//   } 
// }

// function sidepanelMouseOver(){
//   document.getElementById('sidepanel').onmouseover = function () {
//       mouseOverSidepanel = true;
//   }
//   document.getElementById('sidepanel').onmouseout = function () {
//       mouseOverSidepanel = false;
//   }
// }

// /*
// ------ SAVE PANEL ------
// ...
// */
// var savePanelOpen = false;
// function savePanel(){
//   if (menuopen){
//     closeSidePanel();
//   }
//   toggleSavePanel();
// }
// function toggleSavePanel(){
//   document.getElementsByClassName('savePanel')[0].classList.toggle('openSavePanel');
//   document.getElementById('savebtn').classList.toggle('hide');
//   savePanelOpen = !savePanelOpen;
// }

// /*
// ------ 3D OBJECT VARIABLES ------
// References to parts of the gltf 3D model.
// Variables noted 'parent' have children and are for turning the visibility of floors,
// while the other variables are references to meshes and are used for changing materials.
// */
// var mesh;

// var roof;
// var terraceRoof;
// var bedroomWall;
// var buildingParts;
// var fixtures;
// var structure;
// var terrace;

// var windowglas;
// var floor;
// var floorBathroom;
// var floorTerrace;
// var wallInterior0;
// var wallInterior1;

// function set3DObjectVariables(){
//   // Export the gltf model as a single file from Blender
//   mesh = document.getElementById("house").getObject3D('mesh');
//   console.log(mesh.children); // browsers have the children in different order!

//   roof = findChildByName(mesh.children, "Roof");
//   terraceRoof = findChildByName(mesh.children, "Terrace_roof");
//   bedroomWall = findChildByName(mesh.children, "Bedroom_wall");
//   buildingParts = findChildByName(mesh.children, "Building_parts");
//   fixtures = findChildByName(mesh.children, "Fixtures");
//   structure = findChildByName(mesh.children, "Structure");
//   terrace = findChildByName(mesh.children, "Terrace");

//   windowglas = findChildByName(buildingParts.children, "Building_parts_0");
//   floor = findChildByName(structure.children, "Structure_0");
//   floorBathroom = findChildByName(structure.children, "Structure_4");
//   floorTerrace = findChildByName(terrace.children, "Terrace_1");
//   wallInterior0 = findChildByName(structure.children, "Structure_2");
//   wallInterior1 = findChildByName(structure.children, "Structure_5");

// }

// function findChildByName(meshChildren, name){
//   var i;
//   for (i = 0; i < meshChildren.length; i++){
//     if(meshChildren[i].name == name){
//       return meshChildren[i];
//     }
//   }
// }

// /* 
// ------ READINESS LEVEL CHANGING ------ 
// For changing between Basic, Almost ready and Ready to move
// */
// var activeReadinessLevel = 1;

// function rlevelChange(level){
//   if(level == 0){
//     // Basic readiness level
//     buildingParts.visible = false;
//     fixtures.visible = false;
//     themeChange(0);
//   }
//   if(level == 1){
//     // Almost ready
//     buildingParts.visible = true;
//     fixtures.visible = false;
//     themeChange(activeTheme);
//   }
//   if(level == 2){
//     // Ready to Move
//     buildingParts.visible = true;
//     fixtures.visible = true;
//     themeChange(activeTheme);
//   }
// }

// /* 
// ------ Theme CHANGING ------ 
// For changing between material themes
// */
// var activeTheme = 2;

// function themeChange(theme){
//   if(theme == 0){
//     console.log("Basic theme");
//     setMat(floor, concreteTex);
//     setMat(floorBathroom, concreteTex);
//     //setMat(floorBathroom, concreteTex);
//     setMat(wallInterior0, plywoodTex);
//     setMat(wallInterior1, plywoodTex);
//     //activeTheme = 0;
//   }
//   if(theme == 1){
//     //Light theme
//     setMat(floor, woodFloorLightTex);
//     setMat(floorBathroom, tileFloorLightTex);
//     setMat(floorTerrace, terraceFloorNaturalTex);
//     setMat(wallInterior0, whitePaintTex);
//     setMat(wallInterior1, whitePaintTex);
//     activeTheme = 1;
//   }
//   if(theme == 2){
//     //Natural theme
//     setMat(floor, woodFloorNaturalTex);
//     setMat(floorBathroom, tileFloorNaturalTex);
//     setMat(floorTerrace, terraceFloorDarkTex);
//     setMat(wallInterior0, whitePaintTex);
//     setMat(wallInterior1, brownPaintTex);
//     activeTheme = 2;
//   }
//   if(theme == 3){
//     //Dark theme
//     setMat(floor, woodFloorDarkTex);
//     setMat(floorBathroom, tileFloorDarkTex);
//     setMat(floorTerrace, terraceFloorDarkTex);
//     setMat(wallInterior0, whitePaintTex);
//     setMat(wallInterior1, greyPaintTex);
//     activeTheme = 3;
//   }
// }

// /* 
// ------ FLOOR CHANGING ------ 
// For hiding and showing floors
// */
// var activeFloor = 0;

// function floorChange(floor){
//   if(floor == 0){
//     activeFloor = 0;
//     roof.visible = false;
//     terraceRoof.visible = false;
//   }
//   if(floor == 1){
//     activeFloor = 1;
//     roof.visible = true;
//     terraceRoof.visible = true;
//   }
// }

// /*
// ------ CHANGE MATERIALS ------
// For changing material settings
// */
// var plywoodTex = 'textures/PlywoodNew0080_6.jpg';
// var concreteTex = 'textures/ConcreteBare0428.jpg';
// var plasterTex = 'textures/Plaster_wall.jpg';

// var tileFloorLightTex = 'textures/MarbleTilesLight.jpg';
// var tileFloorNaturalTex = 'textures/MarbleTilesNatural.jpg';
// var tileFloorDarkTex = 'textures/MarbleTilesDark.jpg';

// var woodFloorLightTex = 'textures/parquet_light.jpg';
// var woodFloorNaturalTex = 'textures/parquet_natural.jpg';
// var woodFloorDarkTex = 'textures/parquet_dark.jpg';

// //var terraceFloorTex = 'textures/terrace_floor.jpg';
// var terraceFloorNaturalTex = 'textures/wood_balls_light.jpg';
// var terraceFloorDarkTex = 'textures/wood_balls_brown.jpg';

// var whitePaintTex = 'textures/Paint_white.jpg';
// var brownPaintTex = 'textures/Paint_brown.jpg';
// var greyPaintTex = 'textures/Paint_grey.jpg';

// function setMat(target, tex){ // target is one of the nonparent 3D object variables above
//   if(target != null){
//     var texture = new THREE.TextureLoader().load(tex);
//     texture.wrapS = THREE.RepeatWrapping;
//     texture.wrapT = THREE.RepeatWrapping;
//     texture.flipY = false;
//     texture.encoding = 3001; // texture.encoding = target.material.map.encoding; //only works if it was originally a texture, not a color
//     target.material.map = texture;
//     target.material.color.r = 1;
//     target.material.color.g = 1;
//     target.material.color.b = 1;
//     target.material.needsUpdate = true;
//   } else {
//     console.log("Target is null");
//   }
// }

// /* 
// ------ AMBIENT REFLECTIONS ------
// For window settings, reflection, opacity, roughness and metalness
// */

// function glasSettings(target){
//   //var refMap = new THREE.TextureLoader().load(texSrc);
//   var refCube = new new THREE.CubeTextureLoader().load( [
// 		'textures/cubemap/px.png',
// 		'textures/cubemap/nx.png',
// 		'textures/cubemap/py.png',
// 		'textures/cubemap/ny.png',
// 		'textures/cubemap/pz.png',
// 		'textures/cubemap/nz.png'
//   ] );
//   var glass = target.material;
//   glass.envMap = refCube;
//   glass.opacity = 0.15;
//   glass.transparent = true;
//   glass.roughness = 0;
//   glass.metalness = 0.1;
//   glass.refractionRatio = 1.5;
//   glass.envMapIntensity = 10;
//   target.material.needsUpdate = true;
//   //console.log(glass);
// }


/*
------ CAMERA ------
Custom camera settings, mainly movement
*/

var registerComponent = AFRAME.registerComponent;
var THREE = window.THREE;
var utils = AFRAME.utils;
var bind = utils.bind;
//var PolyfillControls = AFRAME.utils.device.PolyfillControls;

// To avoid recalculation at every mouse movement tick
var GRABBING_CLASS = 'a-grabbing';
var PI_2 = Math.PI / 2;

var checkHasPositionalTracking = utils.device.checkHasPositionalTracking;

var oldHypotenuse = 0; // [+] added for touch zoom

/**
 * look-controls. Update entity pose, factoring mouse, touch, and WebVR API data.
 */
//module.exports.Component = registerComponent('look-controls', {
AFRAME.registerComponent('comet-camera', {
  dependencies: ['position', 'rotation'],

  schema: {
    enabled: {default: true},
    hmdEnabled: {default: true},
    pointerLockEnabled: {default: false},
    reverseMouseDrag: {default: false},
    touchEnabled: {default: true}
  },

  init: function () {
    this.previousHMDPosition = new THREE.Vector3();
    this.hmdQuaternion = new THREE.Quaternion();
    this.hmdEuler = new THREE.Euler();
    this.position = new THREE.Vector3();
    // To save / restore camera pose
    this.savedRotation = new THREE.Vector3();
    this.savedPosition = new THREE.Vector3();
    //this.polyfillObject = new THREE.Object3D();
    //this.polyfillControls = new PolyfillControls(this.polyfillObject);
    this.rotation = {};
    this.deltaRotation = {};
    this.savedPose = null;
    this.pointerLocked = false;
    this.setupMouseControls();
    this.bindMethods();

    this.savedPose = {
      position: new THREE.Vector3(),
      rotation: new THREE.Euler()
    };

    //[+] Start rotations
    this.pitchObject.rotation.x = -35 * Math.PI / 180;
    //this.yawObject.rotation.y = 0;

    // Call enter VR handler if the scene has entered VR before the event listeners attached.
    if (this.el.sceneEl.is('vr-mode')) { this.onEnterVR(); }
  },

  update: function (oldData) {
    var data = this.data;

    // Disable grab cursor classes if no longer enabled.
    if (data.enabled !== oldData.enabled) {
      this.updateGrabCursor(data.enabled);
    }

    // Reset pitch and yaw if disabling HMD.
    if (oldData && !data.hmdEnabled && !oldData.hmdEnabled) {
      this.pitchObject.rotation.set(0, 0, 0);
      this.yawObject.rotation.set(0, 0, 0);
    }

    if (oldData && !data.pointerLockEnabled !== oldData.pointerLockEnabled) {
      this.removeEventListeners();
      this.addEventListeners();
      if (this.pointerLocked) { document.exitPointerLock(); }
    }
  },

  tick: function (t) {
    var data = this.data;
    if (!data.enabled) { return; }
    this.updateOrientation();
  },

  play: function () {
    this.addEventListeners();
  },

  pause: function () {
    this.removeEventListeners();
  },

  remove: function () {
    this.removeEventListeners();
  },

  bindMethods: function () {
    this.onMouseDown = bind(this.onMouseDown, this);
    this.onMouseMove = bind(this.onMouseMove, this);
    this.onMouseUp = bind(this.onMouseUp, this);
    this.onMouseWheel = bind(this.onMouseWheel, this);
    this.onTouchStart = bind(this.onTouchStart, this);
    this.onTouchMove = bind(this.onTouchMove, this);
    this.onTouchEnd = bind(this.onTouchEnd, this);
    this.onEnterVR = bind(this.onEnterVR, this);
    this.onExitVR = bind(this.onExitVR, this);
    this.onPointerLockChange = bind(this.onPointerLockChange, this);
    this.onPointerLockError = bind(this.onPointerLockError, this);
  },

 /**
  * Set up states and Object3Ds needed to store rotation data.
  */
  setupMouseControls: function () {
    this.mouseDown = false;
    this.pitchObject = new THREE.Object3D();
    this.yawObject = new THREE.Object3D();
    this.yawObject.position.y = 10;
    this.yawObject.add(this.pitchObject);
  },

  /**
   * Add mouse and touch event listeners to canvas.
   */
  addEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl.canvas;

    // Wait for canvas to load.
    if (!canvasEl) {
      sceneEl.addEventListener('render-target-loaded', bind(this.addEventListeners, this));
      return;
    }

    // Mouse events.
    canvasEl.addEventListener('mousedown', this.onMouseDown, false);
    window.addEventListener('mousemove', this.onMouseMove, false);
    window.addEventListener('mouseup', this.onMouseUp, false);
    window.addEventListener('wheel', this.onMouseWheel, false);

    // Touch events.
    canvasEl.addEventListener('touchstart', this.onTouchStart);
    window.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('touchend', this.onTouchEnd);

    // sceneEl events.
    sceneEl.addEventListener('enter-vr', this.onEnterVR);
    sceneEl.addEventListener('exit-vr', this.onExitVR);

    // Pointer Lock events.
    if (this.data.pointerLockEnabled) {
      document.addEventListener('pointerlockchange', this.onPointerLockChange, false);
      document.addEventListener('mozpointerlockchange', this.onPointerLockChange, false);
      document.addEventListener('pointerlockerror', this.onPointerLockError, false);
    }
  },

  /**
   * Remove mouse and touch event listeners from canvas.
   */
  removeEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl && sceneEl.canvas;

    if (!canvasEl) { return; }

    // Mouse events.
    canvasEl.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('wheel', this.onMouseWheel);

    // Touch events.
    canvasEl.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);

    // sceneEl events.
    sceneEl.removeEventListener('enter-vr', this.onEnterVR);
    sceneEl.removeEventListener('exit-vr', this.onExitVR);

    // Pointer Lock events.
    document.removeEventListener('pointerlockchange', this.onPointerLockChange, false);
    document.removeEventListener('mozpointerlockchange', this.onPointerLockChange, false);
    document.removeEventListener('pointerlockerror', this.onPointerLockError, false);
  },

  /**
   * Update orientation for mobile, mouse drag, and headset.
   * Mouse-drag only enabled if HMD is not active.
   */
  updateOrientation: function () {
    var el = this.el.parentElement; //[+] .parentElement added. This sets the rotation on the parent instead
    var hmdEuler = this.hmdEuler;
    var pitchObject = this.pitchObject;
    var yawObject = this.yawObject;
    var sceneEl = this.el.sceneEl;

    // In VR mode, THREE is in charge of updating the camera rotation.
    if (sceneEl.is('vr-mode') && sceneEl.checkHeadsetConnected()) { return; }

    // Calculate polyfilled HMD quaternion.
    //this.polyfillControls.update();
    //hmdEuler.setFromQuaternion(this.polyfillObject.quaternion, 'YXZ');

    // On mobile, do camera rotation with touch events and sensors.
    el.object3D.rotation.x = Math.min(0, hmdEuler.x + pitchObject.rotation.x); //[+] Math.min(0, ...) added to avoid viewing below model
    el.object3D.rotation.y = hmdEuler.y + yawObject.rotation.y;
  },

  /**
   * Translate mouse drag into rotation.
   *
   * Dragging up and down rotates the camera around the X-axis (yaw).
   * Dragging left and right rotates the camera around the Y-axis (pitch).
   */
  onMouseMove: function (event) {
    var direction;
    var movementX;
    var movementY;
    var pitchObject = this.pitchObject;
    var previousMouseEvent = this.previousMouseEvent;
    var yawObject = this.yawObject;

    // Not dragging or not enabled.
    if (!this.data.enabled || (!this.mouseDown && !this.pointerLocked)) { return; }

    // Calculate delta.
    if (this.pointerLocked) {
      movementX = event.movementX || event.mozMovementX || 0;
      movementY = event.movementY || event.mozMovementY || 0;
    } else {
      movementX = event.screenX - previousMouseEvent.screenX;
      movementY = event.screenY - previousMouseEvent.screenY;
    }
    this.previousMouseEvent = event;

    // Calculate rotation.
    direction = this.data.reverseMouseDrag ? 1 : -1;
    yawObject.rotation.y += movementX * 0.002 * direction;
    pitchObject.rotation.x += movementY * 0.002 * direction;
    pitchObject.rotation.x = Math.max(-PI_2, Math.min(0, pitchObject.rotation.x)); //[+] changed PI_2 to 0
  },

  /**
   * Register mouse down to detect mouse drag.
   */
  onMouseDown: function (evt) {
    if (!this.data.enabled) { return; }
    // Handle only primary button.
    if (evt.button !== 0) { return; }

    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl && sceneEl.canvas;

    this.mouseDown = true;
    this.previousMouseEvent = evt;
    document.body.classList.add(GRABBING_CLASS);

    if (this.data.pointerLockEnabled && !this.pointerLocked) {
      if (canvasEl.requestPointerLock) {
        canvasEl.requestPointerLock();
      } else if (canvasEl.mozRequestPointerLock) {
        canvasEl.mozRequestPointerLock();
      }
    }
  },

  /**
   * Register mouse up to detect release of mouse drag.
   */
  onMouseUp: function () {
    this.mouseDown = false;
    document.body.classList.remove(GRABBING_CLASS);
  },

  /**
   * [+] Register mouse scroll wheel to detect zoom.
   * The zoom delta is clamped.
   * The resulting zoom is also clamped to a min and max domain.
   */
  onMouseWheel: function (e) {
    if(!mouseOverSidepanel){
      var e = window.event || e; //old IE support
      var cam = document.getElementById("camera");
      var clampDelta = Math.max(-1, Math.min(1, e.deltaY));
      cam.object3D.position.z += clampDelta;
      cam.object3D.position.z = Math.max(1, Math.min(25, cam.object3D.position.z));
    }
  },

  /**
   * Register touch down to detect touch drag.
   */
  onTouchStart: function (evt) {
    if (evt.touches.length !== 1 || !this.data.touchEnabled) { return; }
    this.touchStart = {
      x: evt.touches[0].pageX,
      y: evt.touches[0].pageY
    };
    this.touchStarted = true;
  },

  /**
   * Translate touch move to rotation.
   */
  onTouchMove: function (evt) {
    var canvas = this.el.sceneEl.canvas;
    var deltaY;
    var deltaX; //[+] added
    var pitchObject = this.pitchObject; //[+] added
    var yawObject = this.yawObject;

    if (!this.touchStarted || !this.data.touchEnabled) { return; }

    if (evt.touches.length == 1){
      deltaY = 2 * Math.PI * (evt.touches[0].pageX - this.touchStart.x) / canvas.clientWidth;
      deltaX = 2 * Math.PI * (evt.touches[0].pageY - this.touchStart.y) / canvas.clientHeight; //[+] added

      // Change yaw and pitch objects.
      yawObject.rotation.y -= deltaY * 0.5;
      pitchObject.rotation.x -= deltaX * 0.5; //[+] added
      this.touchStart = {
        x: evt.touches[0].pageX,
        y: evt.touches[0].pageY
      };
    } else {
      //Touch zoom
      var hypotenuse = 0;
      var s1 = evt.touches[0].pageX - evt.touches[1].pageX;
      var s2 = evt.touches[0].pageY - evt.touches[1].pageY;
      var hypotenuse = Math.sqrt( s1*s1 + s2*s2);
      var hDelta = hypotenuse - oldHypotenuse;
      oldHypotenuse = hypotenuse;

      var cam = document.getElementById("camera");
      var clampDelta = Math.max(-1, Math.min(1, hDelta));
      cam.object3D.position.z -= clampDelta; //- for pinch zoom out
      cam.object3D.position.z = Math.max(1, Math.min(25, cam.object3D.position.z));
    }
  },

  /**
   * Register touch end to detect release of touch drag.
   */
  onTouchEnd: function () {
    this.touchStarted = false;
  },

  /**
   * Save pose.
   */
  onEnterVR: function () {
    this.saveCameraPose();
  },

  /**
   * Restore the pose.
   */
  onExitVR: function () {
    this.restoreCameraPose();
    this.previousHMDPosition.set(0, 0, 0);
  },

  /**
   * Update Pointer Lock state.
   */
  onPointerLockChange: function () {
    this.pointerLocked = !!(document.pointerLockElement || document.mozPointerLockElement);
  },

  /**
   * Recover from Pointer Lock error.
   */
  onPointerLockError: function () {
    this.pointerLocked = false;
  },

  /**
   * Toggle the feature of showing/hiding the grab cursor.
   */
  updateGrabCursor: function (enabled) {
    var sceneEl = this.el.sceneEl;

    function enableGrabCursor () { sceneEl.canvas.classList.add('a-grab-cursor'); }
    function disableGrabCursor () { sceneEl.canvas.classList.remove('a-grab-cursor'); }

    if (!sceneEl.canvas) {
      if (enabled) {
        sceneEl.addEventListener('render-target-loaded', enableGrabCursor);
      } else {
        sceneEl.addEventListener('render-target-loaded', disableGrabCursor);
      }
      return;
    }

    if (enabled) {
      enableGrabCursor();
      return;
    }
    disableGrabCursor();
  },

  /**
   * Save camera pose before entering VR to restore later if exiting.
   */
  saveCameraPose: function () {
    var el = this.el;
    var hasPositionalTracking = this.hasPositionalTracking !== undefined
      ? this.hasPositionalTracking
      : checkHasPositionalTracking();

    if (this.hasSavedPose || !hasPositionalTracking) { return; }

    this.savedPose.position.copy(el.object3D.position);
    this.savedPose.rotation.copy(el.object3D.rotation);
    this.hasSavedPose = true;
  },

  /**
   * Reset camera pose to before entering VR.
   */
  restoreCameraPose: function () {
    var el = this.el;
    var savedPose = this.savedPose;
    var hasPositionalTracking = this.hasPositionalTracking !== undefined
      ? this.hasPositionalTracking
      : checkHasPositionalTracking();

    if (!this.hasSavedPose || !hasPositionalTracking) { return; }

    // Reset camera orientation.
    el.object3D.position.copy(savedPose.position);
    el.object3D.rotation.copy(savedPose.rotation);
    this.hasSavedPose = false;
  }
});