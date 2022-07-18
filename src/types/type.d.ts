declare namespace ATypes {

  type Nullable<T> = T | null | undefined;

  type TypedArray =
    | Uint8Array
    | Uint8ClampedArray
    | Uint16Array
    | Uint32Array
    | Int8Array
    | Int16Array
    | Int32Array
    | Float32Array
    | Float64Array;

  type TypedArrayConstructor =
    | typeof Uint8Array
    | typeof Uint8ClampedArray
    | typeof Uint16Array
    | typeof Uint32Array
    | typeof Int8Array
    | typeof Int16Array
    | typeof Int32Array
    | typeof Float32Array
    | typeof Float64Array;

}