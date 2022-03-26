import { mat4, mat3 } from "gl-matrix";
import { Vector3 } from "./Vector";

export class Matrix4 {

  private _array: mat4;

  constructor(value?: mat4) {
    this._array = value ?? mat4.create();
  }

  get array() {
    return this._array as Float32Array;
  }

  get buffer() {
    return this.array.buffer;
  }

  identity() {
    mat4.identity(this._array);
    return this;
  }

  lookAt(eye: Vector3, center: Vector3, up: Vector3) {
    mat4.lookAt(this._array, eye.toArray(), center.toArray(), up.toArray());
    return this;
  }

  perspective(fov: number, aspect: number, near: number, far: number) {
    mat4.perspective(this._array, fov, aspect, near, far);
    return this;
  }

  mulLeft(v: Matrix4) {
    mat4.mul(this._array, v._array, this._array);
    return this;
  }

  mulRight(v: Matrix4) {
    mat4.mul(this._array, this._array, v._array);
    return this;
  }

  invert() {
    mat4.invert(this._array, this._array);
    return this;
  }

  transpose() {
    mat4.transpose(this._array, this._array);
    return this;
  }

  translate(v: Vector3) {
    mat4.translate(this._array, this._array, v.toArray());
    return this;
  }

  scale(v: Vector3) {
    mat4.scale(this._array, this._array, v.toArray());
    return this;
  }

  rotate(radians: number, axis: Vector3) {
    mat4.rotate(this._array, this._array, radians, axis.toArray());
    return this;
  }

  copy(v: Matrix4) {
    mat4.copy(this._array, v._array);
    return this;
  }

  clone() {
    return new Matrix4(new Float32Array(this._array));
  }
  
}

export class Matrix3 {

  private _array: mat3;

  constructor(value?: mat3) {
    this._array = value ?? mat3.create();
  }

  get array() {
    return this._array as Float32Array;
  }

  get buffer() {
    return this.array.buffer;
  }

  identity() {
    mat3.identity(this._array);
    return this;
  }

  mulLeft(v: Matrix3) {
    mat3.mul(this._array, v._array, this._array);
    return this;
  }

  mulRight(v: Matrix3) {
    mat3.mul(this._array, this._array, v._array);
    return this;
  }

  invert() {
    mat3.invert(this._array, this._array);
    return this;
  }

  transpose() {
    mat3.transpose(this._array, this._array);
    return this;
  }

  copy(v: Matrix3) {
    mat3.copy(this._array, v._array);
    return this;
  }

  clone() {
    return new Matrix3(new Float32Array(this._array));
  }

  fromMat4(v: Matrix4) {
    mat3.fromMat4(this._array, v.array);
    return this;
  }
  
}