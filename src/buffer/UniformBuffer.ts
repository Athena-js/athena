import { BufferObject, TypedArray } from './BufferObject';

interface UniformItem {
  name: string;
  size: number;
  offset?: number;
}

interface UniformBufferProps {
  binding: number;
  items: UniformItem[];
  name?: string;
  visibility?: GPUShaderStageFlags;
}

const GPUBufferUsage = window.GPUBufferUsage;
const GPUShaderStage = window.GPUShaderStage;

export class UniformBuffer extends BufferObject {

  readonly binding: number;
  readonly name: string;
  readonly visibility: GPUShaderStageFlags;
  readonly items: UniformItem[];
  readonly layoutEntry: GPUBindGroupLayoutEntry;

  protected _bindGroupEntry?: GPUBindGroupEntry;
  
  protected readonly _offsetMap = new Map<string, number>();

  constructor(props: UniformBufferProps) {
    const name = props.name ?? '';
    const size = props.items.reduce((acc, item) => acc + item.size, 0);

    super({
      label: `[UNIFORM_BUFFER] ${name}`,
      usage: GPUBufferUsage?.UNIFORM | GPUBufferUsage?.COPY_DST,
      size
    });

    this.name = name;
    this.binding = props.binding;
    this.visibility = props.visibility ?? (GPUShaderStage?.VERTEX | GPUShaderStage?.FRAGMENT);
    
    this.items = props.items;
    for (let i = 0; i < this.items.length; ++i) {
      const lastItem = this.items?.[i - 1];
      const offset = (lastItem?.offset ?? 0) + (lastItem?.size ?? 0);
      this.items[i].offset = offset;
      this._offsetMap.set(this.items[i].name, offset);
    }
    
    this.layoutEntry = {
      binding: this.binding,
      visibility: this.visibility,
      buffer: {
        type: 'uniform'
      }
    };
  }

  getBindGroupEntry(device: GPUDevice) {
    if (!this._bindGroupEntry) {
      this._bindGroupEntry = {
        binding: this.binding,
        resource: {
          offset: 0,
          buffer: this.getBuffer(device),
          size: this.size
        }
      }
    }
    return this._bindGroupEntry;
  }


  set(device: GPUDevice, name: string, data: ArrayBufferLike) {
    if (this._offsetMap.has(name)) {
      this.writeBuffer(device, data, this._offsetMap.get(name));
    }
  }

}
