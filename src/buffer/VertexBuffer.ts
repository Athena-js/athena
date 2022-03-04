import { BufferObject, TypedArray } from './BufferObject';

interface VertexBufferProps {
  location: number;
  strideLength: number;
  format: GPUVertexFormat;
  name?: string;
  data?: TypedArray;
  strideSize?: number;
}

export class VertexBuffer extends BufferObject {

  readonly name: string;
  readonly location: number;
  readonly format: GPUVertexFormat;
  readonly strideLength: number;
  readonly strideSize: number;

  readonly attribute: GPUVertexAttribute;
  readonly bufferLayout: GPUVertexBufferLayout;
  
  constructor(props: VertexBufferProps) {
    const name = props.name ?? '';

    super({
      initData: props.data,
      label: `[VERTEX_BUFFER] ${name}`,
      usage: GPUBufferUsage.VERTEX,
    });

    this.name = name;
    this.format = props.format;
    this.location = props.location;
    this.strideLength = props.strideLength;
    this.strideSize = props.strideSize ?? props.strideLength * (props.data?.BYTES_PER_ELEMENT ?? 4);

    this.attribute = {
      shaderLocation: this.location,
      format: this.format,
      offset: 0,
    }

    this.bufferLayout = {
      arrayStride: this.strideSize,
      attributes: [this.attribute],
    }
  }

  attach(device: GPUDevice, passEncoder: GPURenderPassEncoder) {
    passEncoder.setVertexBuffer(this.location, this.getBuffer(device));
  }

}
