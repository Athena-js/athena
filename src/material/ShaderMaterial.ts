interface ShaderMaterialProps {
  name?: string;
  vertexShader: string;
  fragmentShader: string;
}

export class ShaderMaterial {
  readonly name: string;

  readonly vertexShader: string;
  readonly fragmentShader: string;

  readonly cullMode: GPUCullMode = 'back';
  readonly topology: GPUPrimitiveTopology = 'triangle-list';

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
  }

  destroy() {
    this._vertexShaderModule = undefined;
    this._fragmentShaderModule = undefined;
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

  getLayoutEntries(): GPUBindGroupLayoutEntry[] {
    return [];
  }

  getBindGroup(device: GPUDevice, layout: GPUBindGroupLayout, ...props: any): GPUBindGroup {
    return device.createBindGroup({ layout, entries: [] });
  }

}