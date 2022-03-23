import { uuid } from '@/utils/uuid';

type ArrayEx<T, P extends number> =
  P extends 1 ? [T] :
  P extends 2 ? [T, T] :
  P extends 3 ? [T, T, T] :
  P extends 4 ? [T, T, T, T] :
  never;

type NumberArray<P extends number> = ArrayEx<number, P>;

export class Vector<P extends number> {

  protected readonly _array: NumberArray<P>;
  protected readonly _map: Map<string, Callback>;

  constructor(array: NumberArray<P>) {
    this._array = array;
    this._map = new Map<string, Callback>();
  }

  get size() {
    return this._array.length;
  }

  protected _get(index: number) {
    return this._array?.[index];
  }

  protected _set(index: number, value: number) {
    this._array[index] = value;
    this._trigger();
  }

  protected _trigger() {
    this._map.forEach(fn => fn());
  }

  onChange(callback: Callback) {
    const id = uuid();
    this._map.set(id, callback);
    return () => this._map.delete(id);
  }

  len() {
    return Math.sqrt(this._array.reduce((acc, t) => acc +  t * t, 0));
  }

  norminize() {
    const len = this.len();
    this._array.forEach((v, i) => this._array[i] = v / len);
    this._trigger();
    return this;
  }

  add(value: number | Vector<P>) {
    if (typeof value === 'number') {
      this._array.forEach((v, i) => this._array[i] = v + value);
    } else {
      this._array.forEach((v, i) => this._array[i] = v + value._get(i));
    }
    this._trigger();
    return this;
  }

  sub(value: number | Vector<P>) {
    if (typeof value === 'number') {
      this._array.forEach((v, i) => this._array[i] = v - value);
    } else {
      this._array.forEach((v, i) => this._array[i] = v - value._get(i));
    }
    this._trigger();
    return this;
  }

  mul(value: number | Vector<P>) {
    if (typeof value === 'number') {
      this._array.forEach((v, i) => this._array[i] = v * value);
    } else {
      this._array.forEach((v, i) => this._array[i] = v * value._get(i));
    }
    this._trigger();
    return this;
  }

  div(value: number | Vector<P>) {
    if (typeof value === 'number') {
      this._array.forEach((v, i) => this._array[i] = v / value);
    } else {
      this._array.forEach((v, i) => this._array[i] = v / value._get(i));
    }
    this._trigger();
    return this;
  }

  copy(v: Vector<P>) {
    for (let i = 0; i < this._array.length; i++) {
      this._array[i] = v._array[i];
    }
    this._trigger();
    return this;
  }

  clone(): Vector<P> {
    return new Vector<P>(this.toArray());
  }

  toArray(): NumberArray<P> {
    return [...this._array];
  }

}

export class Vector2 extends Vector<2> {

  constructor(x = 0, y = 0) {
    super([x, y]);
  }

  static one() { return new Vector2(1, 1); }
  static zero() { return new Vector2(0, 0); }

  get x() { return this._get(0); }
  set x(v: number) { this._set(0, v); }
  get y() { return this._get(1); }
  set y(v: number) { this._set(1, v); }

  set(x: number,  y: number) {
    this._array[0] = x;
    this._array[1] = y;
    this._trigger();
    return this;
  }

  override clone() {
    return new Vector2(...this.toArray());
  }

}

export class Vector3 extends Vector<3> {

  constructor(x = 0, y = 0, z = 0) {
    super([x, y, z]);
  }

  static up() { return new Vector3(0, 1, 0); }
  static bottom() { return new Vector3(0, -1, 0); }
  static right() { return new Vector3(1, 0, 0); }
  static left() { return new Vector3(-1, 0, 0); }
  static front() { return new Vector3(0, 0, 1); }
  static back() { return new Vector3(0, 0, -1); }

  static one() { return new Vector3(1, 1, 1); }
  static zero() { return new Vector3(0, 0, 0); }

  get x() { return this._get(0); }
  set x(v: number) { this._set(0, v); }
  get y() { return this._get(1); }
  set y(v: number) { this._set(1, v); }
  get z() { return this._get(2); }
  set z(v: number) { this._set(2, v); }

  set(x: number,  y: number, z: number) {
    this._array[0] = x;
    this._array[1] = y;
    this._array[2] = z;
    this._trigger();
    return this;
  }

  override clone() {
    return new Vector3(...this.toArray());
  }

  cross(v: Vector3) {
    const [ax, ay, az] = this._array;
    const [bx, by, bz] = v._array;
    this._array[0] = ay * bz - az * by;
    this._array[1] = az * bx - ax * bz;
    this._array[2] = ax * by - ay * bx;
    this._trigger();
    return this;
  }

}

export class Vector4 extends Vector<4> {

  constructor(x = 0, y = 0, z = 0, w = 0) {
    super([x, y, z, w]);
  }

  get x() { return this._get(0); }
  set x(v: number) { this._set(0, v); }
  get y() { return this._get(1); }
  set y(v: number) { this._set(1, v); }
  get z() { return this._get(2); }
  set z(v: number) { this._set(2, v); }
  get w() { return this._get(3); }
  set w(v: number) { this._set(3, v); }

  get xyz() { return [this.x, this. y, this.z]; }

  set(x: number,  y: number, z: number, w: number) {
    this._array[0] = x;
    this._array[1] = y;
    this._array[2] = z;
    this._array[3] = w;
    this._trigger();
    return this;
  }

  override clone() {
    return new Vector4(...this.toArray());
  }

}
