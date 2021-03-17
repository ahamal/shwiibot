import { Component } from 'react';
import * as THREE from 'three';

import './style.css';

import oc from 'three-orbit-controls';
const OrbitControls = oc(THREE);


class RobotView extends Component {
  componentDidMount() {
    const
      width = this.el.clientWidth,
      height = this.el.clientHeight;

    this.scene = new THREE.Scene();
    this.models = [];

    this.camera = new THREE.PerspectiveCamera( 50, width / height, 0.1, 1000);
    this.camera.position.z = 30;
    this.camera.position.x = 0;
    this.camera.position.y = 20;
    this.camera.lookAt(0, 0, 0);

    // add control
    this.orbitControls = new OrbitControls(this.camera, this.el);

    // add axishelper

    const axesHelper = new THREE.AxesHelper( 5 );
    this.scene.add( axesHelper );

    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor('#000000');
    this.renderer.setSize(width, height);

    var globalLight = new THREE.AmbientLight(0xffffff, .7);
    this.scene.add(globalLight);
    var shadowLight = new THREE.DirectionalLight(0xffffff, 1);
    this.scene.add(shadowLight);

    const dirLight1 = new THREE.DirectionalLight( 0xffffff );
    dirLight1.position.set( 1, 1, 1 );
    this.scene.add( dirLight1 );

    const dirLight2 = new THREE.DirectionalLight( 0x002288 );
    dirLight2.position.set( - 1, - 1, - 1 );
    this.scene.add( dirLight2 );

    this.el.appendChild(this.renderer.domElement);
    this.start();
  }

  componentWillUnmount() {
    this.el.removeChild(this.renderer.domElement);
    this.stop();
  }

  start = () => {
    if (!this.frameId)
      this.frameId = window.requestAnimationFrame(this.animate);
  }

  stop = () => {
    cancelAnimationFrame(this.frameId);
  }

  animate = () => {
    this.renderScene();
    this.frameId = window.requestAnimationFrame(this.animate);
    this.models.forEach(m => {
      if (m.animate)
        m.animate();
    });

    // this.orbitControls.update();
  }

  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
  }

  add = (model) => {
    this.models.push(model);
    this.scene.add(model.mesh);
  }

  render() {
    return (
      <div
        className="three-d-stage"
        style={{ width: '640px', height: '400px' }}
        ref={(el) => {
          this.el = el;
        }}
      />
    );
  }
}

export default RobotView