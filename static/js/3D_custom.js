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
    var e = window.event || e; //old IE support
    var cam = document.getElementById("camera");
    var clampDelta = Math.max(-1, Math.min(1, e.deltaY));
    cam.object3D.position.z += clampDelta;
    cam.object3D.position.z = Math.max(1, Math.min(75, cam.object3D.position.z));
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
      cam.object3D.position.z = Math.max(1, Math.min(75, cam.object3D.position.z));
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