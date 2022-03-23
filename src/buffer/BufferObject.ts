export type TypedArray =
  | Uint8Array
  | Uint8ClampedArray
  | Uint16Array
  | Uint32Array
  | Int8Array
  | Int16Array
  | Int32Array
  | Float32Array
  | Float64Array;

export type TypedArrayConstructor =
  | typeof Uint8Array
  | typeof Uint8ClampedArray
  | typeof Uint16Array
  | typeof Uint32Array
  | typeof Int8Array
  | typeof Int16Array
  | typeof Int32Array
  | typeof Float32Array
  | typeof Float64Array;

type ProtoConstructor<T, P> = T & {
  __proto__: {
    constructor: P
  }
}

interface BufferProps {
  label?: string;
  size?: number;
  usage?: GPUBufferUsageFlags;
  mappedAtCreation?: boolean;
  initData?: TypedArray;
}

const GPUBufferUsage = window.GPUBufferUsage;

export class BufferObject {
  
  readonly label: string;
  readonly size: number;
  readonly usage: GPUBufferUsageFlags;
  readonly mappedAtCreation: boolean;

  readonly data?: TypedArray;

  protected _buffer?: GPUBuffer;

  constructor(props: BufferProps) {
    this.label = props.label ?? '';
    this.usage = props.usage ?? (GPUBufferUsage?.VERTEX | GPUBufferUsage?.COPY_DST);
    this.mappedAtCreation = props.mappedAtCreation ?? (props.initData ? true : false);

    this.data = props.initData;
    this.size = props.initData?.byteLength ?? props.size ?? 0;
  }

  getBuffer(device: GPUDevice) {
    if (!this._buffer) {
      this._buffer = device.createBuffer({
        size: this.size,
        usage: this.usage,
        label: this.label,
        mappedAtCreation: this.mappedAtCreation,
      });

      if (this.data) {
        const ArrayClass = (this.data as ProtoConstructor<typeof this.data, TypedArrayConstructor>).__proto__.constructor;
        new ArrayClass(this._buffer.getMappedRange()).set(this.data);
        this._buffer.unmap();
      }
    }
    return this._buffer;
  }

  writeBuffer(device: GPUDevice, data: TypedArray | ArrayBufferLike, bufferOffset = 0, dataOffset = 0) {
    device.queue.writeBuffer(
      this.getBuffer(device),
      bufferOffset,
      data,
      dataOffset,
      data.byteLength,
    );
  }

  destroy() {
    this._buffer?.destroy();
    this._buffer = undefined;
  }

}