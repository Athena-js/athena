import { Matrix4 } from "@/math/Matrix";
import { Vector3 } from "@/math/Vector";
import { UniformBuffer } from "@/buffer/UniformBuffer";

interface CameraProps {
  position?: Vector3;
  lookAt?: Vector3;
  up?: Vector3;
}

export abstract class Camera {

  readonly position: Vector3;
  readonly lookAt: Vector3;
  readonly up: Vector3;

  readonly viewMatrix: Matrix4;
  readonly projectionMatrix: Matrix4;

  readonly uniform: UniformBuffer;

  static readonly UniformKeys = {
    VIEW_MATRIX: 'ViewMatrix',
    PROJECTION_MATRIX: 'ProjectionMatrix',
  }

  needsUpdateViewMatrix: boolean;
  needsUpdateProjectionMatrix: boolean;

  constructor(props: CameraProps) {
    this.position = props.position ?? new Vector3(3, 3, 3);
    this.lookAt = props.lookAt ?? new Vector3(0, 0, 0);
    this.up = props.up ?? Vector3.up();
    this.viewMatrix = new Matrix4();
    this.projectionMatrix = new Matrix4();
    this.needsUpdateViewMatrix = true;
    this.needsUpdateProjectionMatrix = true;
    this.uniform = new UniformBuffer({
      binding: 0,
      name: 'CameraUniform',
      items: [
        { name: Camera.UniformKeys.VIEW_MATRIX, size: 4 * 16 },
        { name: Camera.UniformKeys.PROJECTION_MATRIX, size: 4 * 16 },
      ]
    });
  }

  destroy() {
    this.uniform.destroy();
  }

  abstract updateMatrix(device: GPUDevice): void;

}