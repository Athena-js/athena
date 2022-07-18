import { GrGPU } from "./GrGPU";

export enum GrBufferType {
  INDEX   = 'INDEX',
  VERTEX  = 'VERTEX',
  UNIFORM = 'UNIFORM',
}

export enum GrBufferDataType {
  Uint8Array        = 'Uint8Array',
  Uint8ClampedArray = 'Uint8ClampedArray',
  Uint16Array       = 'Uint16Array',
  Uint32Array       = 'Uint32Array',
  Int8Array         = 'Int8Array',
  Int16Array        = 'Int16Array',
  Int32Array        = 'Int32Array',
  Float32Array      = 'Float32Array',
  Float64Array      = 'Float64Array',
}

enum DataSourceType {
  NumberArray = 'NumberArray',
  TypedArray  = 'TypedArray',
}

export class GrBuffer {
  
  /** enum of gpu buffer type */
  static readonly BufferType = GrBufferType;

  /** enum of buffer data type */
  static readonly DataType = GrBufferDataType;

  /** enum of buffer data source type */
  static readonly DataSourceType = DataSourceType;

  /** determine TypedArrayConstructor based on GrBufferDataType  */
  static readonly TypedArrayConstructorMap = {
    [GrBufferDataType.Uint8Array]:        Uint8Array,
    [GrBufferDataType.Uint8ClampedArray]: Uint8ClampedArray,
    [GrBufferDataType.Uint16Array]:       Uint16Array,
    [GrBufferDataType.Uint32Array]:       Uint32Array,
    [GrBufferDataType.Int8Array]:         Int8Array,
    [GrBufferDataType.Int16Array]:        Int16Array,
    [GrBufferDataType.Int32Array]:        Int32Array,
    [GrBufferDataType.Float32Array]:      Float32Array,
    [GrBufferDataType.Float64Array]:      Float64Array,
  }

  /** determine GPUBufferUsageFlags based on BufferType */
  static readonly BufferUsageMap = {
    [GrBufferType.INDEX]:   GPUBufferUsage.COPY_DST | GPUBufferUsage.INDEX,
    [GrBufferType.VERTEX]:  GPUBufferUsage.COPY_DST | GPUBufferUsage.VERTEX,
    [GrBufferType.UNIFORM]: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
  }

  /** determine the write method based on DateSourceType */
  static readonly WriteFuncMap = {
    [DataSourceType.NumberArray]: GrBuffer.WriteByNumberArray,
    [DataSourceType.TypedArray]:  GrBuffer.WriteByTypedArray
  }  

  /** kinds of gpu buffer, can be IBO, VBO, UBO, etc. */
  readonly bufferType: GrBufferType;

  /** kinds of typed array of buffer data, like Float32Array, Uint8Array, etc. */
  readonly dataType: GrBufferDataType;

  /** buffer size */
  readonly bytes: number;

  /** buffer element counnt */
  readonly length: number;

  /** bytes per element */
  readonly byteLength: number;

  /** webgpu buffer object. it's associated with gpu instance. */
  readonly gpuBuffer: GPUBuffer;

  /** TypedArray constructor  */
  private readonly _TypedArrayClass: ATypes.TypedArrayConstructor;

  /** gpu instance */
  private readonly _gpu: GrGPU;


  constructor (
    gpu: GrGPU,
    buffeType: GrBufferType,
    dataType: GrBufferDataType,
    length: number,
    mappedAtCreation = false,
  ) {
    this._gpu = gpu;
    this._TypedArrayClass = GrBuffer.TypedArrayConstructorMap[dataType];

    this.bufferType = buffeType;
    this.dataType = dataType;
    this.length = length;
    this.byteLength = this._TypedArrayClass.BYTES_PER_ELEMENT;
    this.bytes = length * this.byteLength;

    this.gpuBuffer = gpu.device.createBuffer({
      size: this.bytes,
      usage: GrBuffer.BufferUsageMap[buffeType],
      mappedAtCreation
    });
  }

  /** 
   * Set gpu buffer byte TypedArray.
   */
  static WriteByTypedArray (
    buffer: GrBuffer,
    data: ATypes.TypedArray,
    targetOffset?: number,
    sourceOffset?: number,
    sourceLength?: number,
  ) {
    buffer._gpu.device.queue.writeBuffer(
      buffer.gpuBuffer,
      (targetOffset ?? 0) * buffer.byteLength,
      data,
      sourceOffset ?? 0,
      sourceLength ?? data.length
    );
  }

  /** 
   * Set gpu buffer by NumberArray.
   */
  static WriteByNumberArray (
    buffer: GrBuffer,
    data: Array<number>,
    targetOffset?: number,
    sourceOffset?: number,
    sourceLength?: number,
  ) {
    buffer._gpu.device.queue.writeBuffer(
      buffer.gpuBuffer,
      (targetOffset ?? 0) * buffer.byteLength,
      new buffer._TypedArrayClass(data),
      sourceOffset ?? 0,
      sourceLength ?? data.length
    );
  }

  /** Get size of GPUVertexFormat */
  static SizeOfGPUVertexFormat (format: GPUVertexFormat) {
    const matches = /^[a-z]+([0-9]+)x?([0-9]?)$/.exec(format);
    const unitSize = Number(matches![1]) / 8;
    const unitCount = Number(matches![2]) ?? 1;
    return unitSize * unitCount;
  }

  /** 
   * Write data to gpu buffer
   * @param source source data, can be TypedArry or Array<Number>
   * @param targetOffset gpu buffer offset, in elements (not in bytes)
   * @param sourceOffset given data offset, in elements (not in bytes)
   * @param sourceLength given data length, in elements (not in bytes)
   */
  write (
    source: ATypes.TypedArray | Array<number>,
    targetOffset?: number,
    sourceOffset?: number,
    sourceLength?: number,
  ) {
    const sourceType = Array.isArray(source) 
      ? DataSourceType.NumberArray
      : DataSourceType.TypedArray;
    const func = GrBuffer.WriteFuncMap[sourceType];
    func(this, source as any, targetOffset, sourceOffset, sourceLength);
  }

  /**
   * Write buffer data at creation.
   * mappedAtCreation must be true when GrBuffer is constructed.
   * @param data can be NumberArray or TypedArray
   */
  writeAtCreation (data: ArrayLike<number>) {
    const TypedArrayClass = GrBuffer.TypedArrayConstructorMap[this.dataType];
    new TypedArrayClass(this.gpuBuffer.getMappedRange()).set(data);
    this.gpuBuffer.unmap();
  }

  /** destroy the gpu buffer */
  destroy () {
    this.gpuBuffer.destroy();
  }

}
