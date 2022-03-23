import { ShaderMaterial } from "@/material/ShaderMaterial";
import { UniformBuffer } from "@/buffer/UniformBuffer";
import { TextureObject } from "@/buffer/TextureObject";
import vertexShader from '@/shaders/physical/vert.wgsl';
import fragmentShader from '@/shaders/physical/frag.wgsl';

interface PhysicalMaterialProps {
  baseColorTexture: TextureObject;
}

export class PhysicalMaterial extends ShaderMaterial {

  baseColorTexture: TextureObject;

  protected _bindGroup?: GPUBindGroup;

  constructor(props: PhysicalMaterialProps) {
    super({
      name: 'PhysicalMaterial',
      vertexShader,
      fragmentShader
    });

    this.baseColorTexture = props.baseColorTexture;
  }

  override getLayoutEntries(): GPUBindGroupLayoutEntry[] {
    return [
      { 
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {
          sampleType: 'float'
        }
      },
      {
        binding: 1,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: {
          type: 'filtering'
        }
      }
    ]
  }

  override getBindGroup(device: GPUDevice, layout: GPUBindGroupLayout) {
    if (!this._bindGroup) {
      this.baseColorTexture.getSampler(device);
      this._bindGroup = device.createBindGroup({
        layout,
        entries: [
          {
            binding: 0,
            resource: this.baseColorTexture.getView(device)
          },
          {
            binding: 1,
            resource: this.baseColorTexture.getSampler(device)
          }
        ]
      });
    }
    return this._bindGroup;
  }

}