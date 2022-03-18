import { BufferObject } from './BufferObject';

interface IndexBufferProps {
  name?: string;
  data: Uint16Array | Uint32Array;
}

export class IndexBuffer extends BufferObject {

  readonly format: GPUIndexFormat;

  constructor(props: IndexBufferProps) {
    super({
      label: `[INDEX_BUFFER]`,
      initData: props.data,
      usage: GPUBufferUsage.INDEX,
      mappedAtCreation: true
    });
    
    this.format = this.data instanceof Uint16Array ? 'uint16' : 'uint32';
  }

  attach(device: GPUDevice, renderPass: GPURenderPassEncoder) {
    renderPass.setIndexBuffer(this.getBuffer(device), this.format);
  }

}
