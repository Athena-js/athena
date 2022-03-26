import { ShaderMaterial } from "@/material/ShaderMaterial";
import { TextureObject } from "@/buffer/TextureObject";
import vertexShader from '@/shaders/physical/vert.wgsl';
import fragmentShader from '@/shaders/physical/frag.wgsl';

interface PhysicalMaterialProps {
  baseColorTexture: TextureObject;
  normalTexture: TextureObject;
  metallicRoughnessTexture: TextureObject;
  emissiveTexture: TextureObject;
  aoTexture: TextureObject;
}

export class PhysicalMaterial extends ShaderMaterial {

  baseColorTexture: TextureObject;
  normalTexture: TextureObject;
  metallicRoughnessTexture: TextureObject;
  emissiveTexture: TextureObject;
  aoTexture: TextureObject;

  protected _bindGroup?: GPUBindGroup;

  constructor(props: PhysicalMaterialProps) {
    super({
      name: 'PhysicalMaterial',
      vertexShader,
      fragmentShader
    });

    this.baseColorTexture = props.baseColorTexture;
    this.normalTexture = props.normalTexture;
    this.metallicRoughnessTexture = props.metallicRoughnessTexture;
    this.emissiveTexture = props.emissiveTexture;
    this.aoTexture = props.aoTexture;
  }

  override getLayoutEntries(): GPUBindGroupLayoutEntry[] {
    return [
      {
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT,
        sampler: {
          type: 'filtering'
        }
      },
      
      { 
        binding: 1,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {
          sampleType: 'float',
          viewDimension: 'cube'
        }
      },
      { 
        binding: 2,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {
          sampleType: 'float'
        }
      },
      { 
        binding: 3,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {
          sampleType: 'float'
        }
      },
      { 
        binding: 4,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {
          sampleType: 'float'
        }
      },
      { 
        binding: 5,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {
          sampleType: 'float'
        }
      },
      { 
        binding: 6,
        visibility: GPUShaderStage.FRAGMENT,
        texture: {
          sampleType: 'float'
        }
      },
    ]
  }

  override getBindGroup(device: GPUDevice, layout: GPUBindGroupLayout, cubemap: TextureObject) {
    if (!this._bindGroup) {
      this.baseColorTexture.getSampler(device);
      this._bindGroup = device.createBindGroup({
        layout,
        entries: [
          {
            binding: 0,
            resource: this.baseColorTexture.getSampler(device)
          },
          {
            binding: 1,
            resource: cubemap.getView(device)
          },
          {
            binding: 2,
            resource: this.baseColorTexture.getView(device)
          },
          {
            binding: 3,
            resource: this.normalTexture.getView(device)
          },
          {
            binding: 4,
            resource: this.metallicRoughnessTexture.getView(device)
          },
          {
            binding: 5,
            resource: this.emissiveTexture.getView(device)
          },
          {
            binding: 6,
            resource: this.aoTexture.getView(device)
          },
        ]
      });
    }
    return this._bindGroup;
  }

}