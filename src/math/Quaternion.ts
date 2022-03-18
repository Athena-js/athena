import { quat } from "gl-matrix";
import { Vector3 } from "./Vector";

export class Quaternion {

  private _array: quat;

  constructor(value?: quat) {
    this._array = value ?? quat.create();
  }

  get array() {
    return this._array as Float32Array;
  }

  get buffer() {
    return this.array.buffer;
  }

  identity() {
    quat.identity(this._array);
    return this;
  }

  copy(v: Quaternion) {
    quat.copy(this._array, v._array);
    return this;
  }

  clone() {
    return new Quaternion(new Float32Array(this._array));
  }

  getEuler() {
    const [x, y, z, w] = [...this._array];
    const [x2, y2, z2, w2] = [x * x, y * y, z * z, w * w];
    const unit = x2 + y2 + z2 + w2;
    const test = x * w - y * z;
    const out = new Vector3();
    if (test > 0.499995 * unit) {
      out.set(
        Math.PI / 2,
        2 * Math.atan2(y, x),
        0
      );
    } else if (test < -0.499995 * unit) {
      out.set(
        -Math.PI / 2,
        2 * Math.atan2(y, x),
        0
      );
    } else {
      out.set(
        Math.asin(2 * (x * z - w * y)),
        Math.atan2(2 * (x * y + z * w), 1 - 2 * (y2 + z2)),
        Math.atan2(2 * (x * y + z * w), 1 - 2 * (y2 + z2))
      );
    }
    return out;
  }
  
}