import { UniformBuffer } from "@/buffer/UniformBuffer";

interface ShaderMaterialProps {
  name?: string;
  vertexShader: string;
  fragmentShader: string;
  uniforms?: UniformBuffer[];
}

export class ShaderMaterial {
  readonly name: string;

  readonly vertexShader: string;
  readonly fragmentShader: string;
  readonly uniformBuffers: UniformBuffer[];

  protected _vertexShaderModule?: GPUShaderModule;
  protected _fragmentShaderModule?: GPUShaderModule;

  protected static _cachedShader = new Map<string, GPUShaderModule>();

  static clearCache() {
    ShaderMaterial._cachedShader.clear();
  }

  constructor(props: ShaderMaterialProps) {
    this.name = props.name ?? 'ShaderMaterial';
    this.vertexShader = props.vertexShader;
    this.fragmentShader = props.fragmentShader;

    this.uniformBuffers = [
      new UniformBuffer({
        binding: 0,
        name: 'transform',
        items: [
          { name: 'ModelMatrix', size: 4 * 16 },
          { name: 'ViewMatrix', size: 4 * 16 },
          { name: 'ModelViewMatrix', size: 4 * 16 },
          { name: 'ProjectionMatrix', size: 4 * 16 },
          { name: 'NormalMatrix', size: 4 * 16 },
        ]
      }),
      ...(props.uniforms ?? [])
    ];
  }

  destroy() {
    this.uniformBuffers.forEach(buffer => {
      buffer.destroy();
    });
  }

  createShaderModule(device: GPUDevice, code: string) {
    let shaderModule = ShaderMaterial._cachedShader.get(code);
    if (!shaderModule) {
      shaderModule = device.createShaderModule({ code });
      ShaderMaterial._cachedShader.set(code, shaderModule);
    }
    return shaderModule;
  }

  getVertexShaderModule(device: GPUDevice) {
    if (!this._vertexShaderModule) {
      this._vertexShaderModule = this.createShaderModule(device, this.vertexShader);
    }
    return this._vertexShaderModule;
  }

  getFragmentShaderModule(device: GPUDevice) {
    if (!this._fragmentShaderModule) {
      this._fragmentShaderModule = this.createShaderModule(device, this.fragmentShader);
    }
    return this._fragmentShaderModule;
  }

  get uTransform() {
    return this.uniformBuffers[0];
  }

}