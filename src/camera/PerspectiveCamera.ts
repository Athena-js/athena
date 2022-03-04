import { Vector3 } from "@/math/Vector";
import { Camera } from "./Camera";

interface PerspectiveCameraProps {
  position?: Vector3;
  lookAt?: Vector3;
  up?: Vector3;
  fov?: number;
  aspect?: number;
  near?: number;
  far?: number;
}

export class PerspectiveCamera extends Camera {

  fov: number;
  aspect: number;
  near: number;
  far: number;

  constructor(props: PerspectiveCameraProps) {
    super({
      position: props.position,
      lookAt: props.lookAt,
      up: props.up,
    });

    this.fov = props.fov ?? 45;
    this.aspect = props.aspect ?? 0.75;
    this.near = props.near ?? 0.1;
    this.far = props.far ?? 1000;
  }

  override updateMatrix(device: GPUDevice) {
    if (this.needsUpdateViewMatrix) {
      this.needsUpdateViewMatrix = false;
      this.viewMatrix.lookAt(this.position, this.lookAt, this.up);
      this.uniform.set(
        device,
        Camera.UniformKeys.VIEW_MATRIX,
        this.viewMatrix.buffer
      );
    }

    if (this.needsUpdateProjectionMatrix) {
      this.needsUpdateProjectionMatrix = false;
      this.projectionMatrix.perspective(
        this.fov * Math.PI / 180,
        this.aspect,
        this.near,
        this.far
      );
      this.uniform.set(
        device,
        Camera.UniformKeys.PROJECTION_MATRIX,
        this.projectionMatrix.buffer
      );
    }
  }

}