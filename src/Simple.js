import React from 'react';
import ReactDOM from 'react-dom';
import React3 from 'react-three-renderer';
import THREE from 'three';
import OrbitControls from './OrbitControls';

export class Simple extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      cubeRotation: new THREE.Euler(),
      cameraPosition: new THREE.Vector3(0, 0, 5)
    };

    this._onAnimate = () => {
      // we will get this callback every frame
      this.controls.update();

      // pretend cubeRotation is immutable.
      // this helps with updates and pure rendering.
      // React will be sure that the rotation has now updated.
      this.setState({
        cubeRotation: new THREE.Euler(
          this.state.cubeRotation.x/* + 0.1*/,
          this.state.cubeRotation.y/* + 0.1*/,
          0
        ),
      });
    };
  }

  componentDidMount() {
    const controls = new OrbitControls(this.refs.camera, ReactDOM.findDOMNode(this.refs.react3));

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.noZoom = false;
    controls.noPan = false;

    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    controls.addEventListener('change', () => {
      this.setState({
        cameraPosition: this.refs.camera.position,
      });
    });

    this.controls = controls;
  }

  componentWillUnmount() {
    this.controls.dispose();
    delete this.controls;
  }

  render() {
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height

    return (<React3
      ref="react3"
      mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
      width={width}
      height={height}

      onAnimate={this._onAnimate}
    >
      <scene>
        <perspectiveCamera
          ref="camera"
          name="camera"
          fov={75}
          aspect={width / height}
          near={0.1}
          far={1000}
          position={this.state.cameraPosition}
        />
        <mesh
          rotation={this.state.cubeRotation}
        >
          <boxGeometry
            width={1}
            height={1}
            depth={1}
          />
          <meshBasicMaterial
            color={0x00ff00}
          />
        </mesh>
      </scene>
    </React3>);
  }
}