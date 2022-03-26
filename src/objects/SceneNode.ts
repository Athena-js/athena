import { Matrix3, Matrix4 } from "@/math/Matrix";
import { Vector3 } from "@/math/Vector";
import { UniformBuffer } from "@/buffer/UniformBuffer";
import { TextureObject } from "@/buffer/TextureObject";
import { Camera } from "@/camera/Camera";
import { Mesh } from "./Mesh";
import $$ from '@/utils/constants';

const GPUTextureUsage = window.GPUTextureUsage ?? {};

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

  // cube texture
  cubemap: TextureObject = new TextureObject({
    texture: {
      size: [1, 1, 6],
      format: 'rgba8unorm',
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT
    },
    view: {
      dimension: 'cube'
    }
  });

  matrixNeedsUpdate = true;

  constructor(name?: string) {
    this.name = name ?? ''; 
    this.children = [];
    this.position = Vector3.zero();
    this.rotation = Vector3.zero();
    this.scale = Vector3.one();
    this.localMatrix = new Matrix4();
    this.worldMatrix = new Matrix4();

    [
      this.position,
      this.rotation,
      this.scale
    ].forEach(v => v.onChange(() => this.matrixNeedsUpdate = true));

    this.uniform = new UniformBuffer($$.Builtins.Uniform.TransformUniform);
  }

  destroy(node = this) {
    node.uniform.destroy();
    for (const child of node.children) {
      if (child instanceof Mesh) {
        child.uniform.destroy();
        child.destroy();
      }
    }
  }

  add(node: SceneNode): SceneNode {
    this.children.push(node);
    node.setParent(this);
    return node;
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
    const normalViewMatrix = new Matrix3().fromMat4(modelViewMatrix.clone().invert().transpose());
    this.uniform.set(device, $$.Builtins.Matrix.ModelMatrix.name, modelMatrix.buffer);
    this.uniform.set(device, $$.Builtins.Matrix.ModelViewMatrix.name, modelViewMatrix.buffer);
    this.uniform.set(device, $$.Builtins.Matrix.NormalMatrix.name, normalViewMatrix.buffer);
  }

}