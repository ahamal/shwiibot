import * as THREE from 'three';



function getServo(px, py, pz) {
  const
    gear = new THREE.CylinderGeometry( .2, .2, .4, 22 ),
    gearMesh = new THREE.Mesh(gear, materials['grey']);
  
  gearMesh.position.x = .3;
  gearMesh.position.y = 1.1;
  gearMesh.position.z = 0;

  const
    body = new THREE.BoxGeometry(2, 2, 1),
    bodyMesh = new THREE.Mesh(body, materials['blue']);

  var mesh = new THREE.Group();
  mesh.add(gearMesh);
  mesh.add(bodyMesh);
  mesh.position.x = px;
  mesh.position.y = py;
  mesh.position.z = pz;

  mesh.castShadow = true;
  return mesh;
}


function getBody() {
  const body = new THREE.Group();

  const
    head = getCubeMesh({
      dimension: [4, 3, .2,],
      position: [0, 6.5, .1],
      color: 'lightBrown',
    }),
    torso = getCubeMesh({
      dimension: [12, 4, .2],
      color: 'lightBrown',
      position: [0, 2, .1],
    });

  const servo1 = getServo(5, 3, -0.6);
  servo1.rotation.z = - Math.PI / 2;
  
  const servo2 = getServo(-5, 3, -0.6);
  servo2.rotation.z = - Math.PI / 2;
  servo2.rotation.y = - Math.PI;

  body.add(servo1)
  body.add(servo2)
  body.add(torso);
  body.add(head);

  return body;
}

function getJoint() {
  const arm = new THREE.Group();

  const
    board = getCubeMesh({
      dimension: [.2, 2, 3],
      position: [-.1, 0, 0],
      color: 'lightBrown',
    }),
    joint = getCubeMesh({
      dimension: [.4, .4, .4],
      position: [0, 0, 0],
      color: 'black'
    }),
    servo = getServo(-0.8, 0, 0.3);
  
  servo.rotation.z = - Math.PI;
  servo.rotation.y = - Math.PI / 2;

  arm.add(board);
  arm.add(servo);
  arm.add(joint);

  return arm;
}


function getArm1() {
  const r = new THREE.Group();
  const joint = getJoint();
  r.add(joint);
  return r;
}

function getArm2() {
  const arm = new THREE.Group();

  const
    board = getCubeMesh({
      dimension: [3, 8, .2],
      position: [0, -3, .2],
      color: 'lightBrown',
    }),
    joint = getCubeMesh({
      dimension: [.4, .4, .4],
      position: [0, 0, .2],
      color: 'black'
    }),
    servo = getServo(0, -6, -0.6);
  
  servo.rotation.z = - Math.PI;

  arm.add(board);
  arm.add(servo);
  arm.add(joint);

  return arm;
}


function getArm3() {
  const r = new THREE.Group();
  const joint = getJoint();
  r.add(joint);
  return r;
}

function getArm4() {
  const g = new THREE.Group();

  const
    board = getCubeMesh({
      dimension: [2, 2.5, .2],
      position: [0, 0, .2],
      color: 'lightBrown',
    }),
    board2 = getCubeMesh({
      dimension: [2, 2.5, .2],
      position: [0, -1.2, -1],
      color: 'lightBrown',
    }),
    center = getCubeMesh({
      dimension: [.4, .4, .4],
      position: [0, 0, .2],
      color: 'black'
    }),
    rodGeom = new THREE.CylinderGeometry( .2, .2, 6, 22 ),
    rod = new THREE.Mesh(rodGeom, materials['red']);

  board2.rotation.x = Math.PI / 2;

  rod.position.y = -4;
  rod.position.z = -1.2

  g.add(board);
  g.add(board2);
  g.add(center);
  g.add(rod);
  return g;
}



export class Bot {
  constructor() {
    this.mesh = new THREE.Group();

    // Body
    this.body = getBody();

    // Left ARM 
    const leftArm1 = this.leftArm1 = getArm1();
    leftArm1.position.x = 6.3;
    leftArm1.position.y = 2.7;
    leftArm1.position.z = -.6;
    leftArm1.rotation.y = Math.PI;
    leftArm1.rotation.x =  Math.PI;
    
    const leftArm2 = this.leftArm2 = getArm2();
    leftArm2.position.x = -.9;
    leftArm2.position.y = -1.2;

    leftArm1.add(leftArm2);
    leftArm2.rotation.y = Math.PI;
    leftArm2.rotation.x = 3 * Math.PI / 2;

    const leftArm3 = this.leftArm3 = getArm3();
    leftArm2.add(leftArm3);
    leftArm3.position.x = -.3;
    leftArm3.position.y = -7.4;
    leftArm3.position.z = -.6;
    leftArm3.rotation.z = Math.PI / 2;
    leftArm3.rotation.y = Math.PI;


    const leftArm4 = this.leftArm4 = getArm4();
    leftArm3.add(leftArm4);
    leftArm4.rotation.x = Math.PI/ 2;
    leftArm4.rotation.z = - Math.PI/ 2;
    leftArm4.position.x = -0.8;
    leftArm4.position.y = -1.2;


    // Right Arm
    const rightArm1 = this.rightArm1 = getArm1();
    rightArm1.position.x = -6.3;
    rightArm1.position.y = 2.7;
    rightArm1.position.z = -.6;
    rightArm1.rotation.y = 0;
    rightArm1.rotation.x = 3 * Math.PI / 2;
    
    const rightArm2 = this.rightArm2 = getArm2();
    rightArm2.position.x = -.9;
    rightArm2.position.y = -1.2;
    rightArm2.rotation.z = Math.PI;

    rightArm1.add(rightArm2);
    rightArm2.rotation.y = Math.PI;
    rightArm2.rotation.x = 3 * Math.PI / 2;

    const rightArm3 = this.rightArm3 = getArm3();
    rightArm2.add(rightArm3);
    rightArm3.position.x = -.3;
    rightArm3.position.y = -7.4;
    rightArm3.position.z = -.6;
    rightArm3.rotation.z = Math.PI / 2;
    rightArm3.rotation.y = Math.PI;


    const rightArm4 = this.rightArm4 = getArm4();
    rightArm3.add(rightArm4);
    rightArm4.rotation.x = Math.PI/ 2;
    rightArm4.rotation.z = - Math.PI/ 2;
    rightArm4.position.x = -0.8;
    rightArm4.position.y = -1.2;

    this.body.add(this.leftArm1);
    this.body.add(this.rightArm1);
    

    this.mesh.add(this.body);
  }

  dir1 = 1;
  dir2 = 1;
  a1 = 0;
  a2 = 0;

  animate() {
    if (this.a1 < 0 || this.a1 > 1) this.dir1 *= -1;
    if (this.a2 < 0 || this.a2 > 1) this.dir2 *= -1;
    this.a1 += this.dir1 * .007;
    this.a2 += this.dir2 * .01;
    this.setAngles('r3', this.a1);
    this.setAngles('r4', this.a2);
    this.setAngles('r1', this.a1);
    this.setAngles('r2', this.a2);
  }


  ranges = {
    l1: ['leftArm1', 'x', Math.PI * (1/2 + 1/12), Math.PI * (3/2 - 1/12)],
    l2: ['leftArm2', 'z', -Math.PI * (1/2 + 1/12), Math.PI * (1/2 - 1/12)],
    l3: ['leftArm3', 'y', Math.PI * (1/2 + 1/12), Math.PI * (3/2 - 1/12)],
    l4: ['leftArm4', 'z', -Math.PI * (1/2 + 1/12), Math.PI * (1/2 - 1/12)],

    r1: ['rightArm1', 'x', Math.PI * (1/2 + 1/12), Math.PI * (3/2 - 1/12)],
    r2: ['rightArm2', 'z', Math.PI * (1/2 + 1/12), Math.PI * (3/2 - 1/12)],
    r3: ['rightArm3', 'y', Math.PI * (1/2 + 1/12), Math.PI * (3/2 - 1/12)],
    r4: ['rightArm4', 'z', -Math.PI * (1/2 - 1/12), Math.PI * (1/2 - 1/12)],
  }

  setAngles(key, val) {
    const [name, axis, a0, a1] =  this.ranges[key]; 
    this[name].rotation[axis] = a0 + (a1 - a0) * val;
  }
}



export var colors = {
  blue: 0x1717f7,
  black: 0x100707,
  black2: 0x302727,
  grey: 0x999999,
  brown: 0xb44b39,
  green: 0x7abf8e,
  pink: 0xdc5f45,
  red: 0xdc0000,
  lightBrown: 0xe07a57,
  white: 0xa49789,
  skin: 0xff9ea5
}

export var materials = {};
for (var k in colors) {
  materials[k] = new THREE.MeshPhongMaterial({
    color: colors[k],
    shininess: 0,
    flatShading: true,
  })
};

export function getCubeMesh({ dimension, color, position, translate, rotation, center }) {
  var geom = new THREE.BoxGeometry(...dimension);

  if (translate)
    geom.translate(...translate);

  var mesh = new THREE.Mesh(geom, materials[color]);

  if (position) {
    mesh.position.x = position[0];
    mesh.position.y = position[1];
    mesh.position.z = position[2];
  }

  if (rotation) {
    mesh.rotation.x = rotation[0];
    mesh.rotation.y = rotation[1];
    mesh.rotation.z = rotation[2];
  }

  mesh.castShadow = true;
  return mesh;
}