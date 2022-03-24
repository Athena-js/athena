import { ShaderMaterial } from "@/material/ShaderMaterial";
import { TextureObject } from "@/buffer/TextureObject";
import vertexShader from '@/shaders/skybox/vert.wgsl';
import fragmentShader from '@/shaders/skybox/frag.wgsl';

export class SkyboxMaterial extends ShaderMaterial {

  texture: TextureObject;

  readonly cullMode: GPUCullMode = 'front';

  protected _bindGroup?: GPUBindGroup;

  constructor(texture: TextureObject) {
    super({
      name: 'SkyboxMaterial',
      vertexShader,
      fragmentShader
    });

    this.texture = texture;
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
      this.texture.getSampler(device);
      this._bindGroup = device.createBindGroup({
        layout,
        entries: [
          {
            binding: 0,
            resource: this.texture.getView(device)
          },
          {
            binding: 1,
            resource: this.texture.getSampler(device)
          }
        ]
      });
    }
    return this._bindGroup;
  }

}