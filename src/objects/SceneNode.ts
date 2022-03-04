import { Matrix4 } from "@/math/Matrix";
import { Vector3 } from "@/math/Vector";
import { UniformBuffer } from "@/buffer/UniformBuffer";
import $$ from '@/utils/constants';

import type { Camera } from "@/camera/Camera";

export class SceneNode {

  name: string;

  parent?: SceneNode;
  readonly children: SceneNode[];

  readonly position: Vector3;
  readonly rotation: Vector3;
  readonly scale: Vector3;

  readonly localMatrix: Matrix4;
  readonly worldMatrix: Matrix4;

  readonly uniform: UniformBuffer;

  matrixNeedsUpdate: boolean;

  constructor(name?: string) {
    this.name = name ?? ''; 
    this.children = [];
    this.position = Vector3.zero();
    this.rotation = Vector3.zero();
    this.scale = Vector3.one();
    this.localMatrix = new Matrix4();
    this.worldMatrix = new Matrix4();
    this.matrixNeedsUpdate = true;

    [
      this.position,
      this.rotation,
      this.scale
    ].forEach(v => v.onChange(() => this.matrixNeedsUpdate = true));

    this.uniform = new UniformBuffer($$.Builtins.Uniform.TransformUniform);
  }

  add(node: SceneNode) {
    this.children.push(node);
    node.setParent(this);
  }

  setParent(node: SceneNode) {
    this.parent = node;
    this.matrixNeedsUpdate = true;
  }

  updateMatrix(force = false) {
    if (this.matrixNeedsUpdate || force) {
      this.matrixNeedsUpdate = false;

      // update local matrix
      this.localMatrix
        .identity()
        .translate(this.position)
        .rotate(this.rotation.x, Vector3.right())
        .rotate(this.rotation.y, Vector3.up())
        .rotate(this.rotation.z, Vector3.front())
        .scale(this.scale);

      // update world matrix
      this.worldMatrix.copy(this.parent?.worldMatrix ?? new Matrix4()).mulRight(this.localMatrix);

      // update children
      this.children.forEach(child => child.matrixNeedsUpdate = true);
    }
  }

  updateUniform(device: GPUDevice, camera: Camera) {
    const modelMatrix = this.worldMatrix;
    const modelViewMatrix = modelMatrix.clone().mulLeft(camera.viewMatrix);
    const normalViewMatrix = modelViewMatrix.clone().invert().transpose();
    this.uniform.set(device, $$.Builtins.Matrix.ModelMatrix.name, modelMatrix.buffer);
    this.uniform.set(device, $$.Builtins.Matrix.ModelViewMatrix.name, modelViewMatrix.buffer);
    this.uniform.set(device, $$.Builtins.Matrix.NormalMatrix.name, normalViewMatrix.buffer);
  }

}