import { GPUInstance } from "./GPUInstance";

interface RenderPipelineProps {
  bindGroupLayouts?: GPUBindGroupLayoutEntry[][];
  vertexBufferLayouts: GPUVertexBufferLayout[];
  vertexShaderModule: GPUShaderModule;
  fragmentShaderModule?: GPUShaderModule;
  premitive?: GPUPrimitiveState;
  depthStencil?: GPUDepthStencilState;
  presentationFormat?: GPUTextureFormat;
}

export class RenderPipeline {

  gpu: GPUInstance;
  
  protected _vertexShaderModule: GPUShaderModule;
  protected _fragmentShaderModule?: GPUShaderModule;
  protected _presentationFormat?: GPUTextureFormat;

  protected _vertexState: GPUVertexState;
  protected _fragmentState?: GPUFragmentState;

  protected _bindGroupLayoutEntries?: GPUBindGroupLayoutEntry[][];
  protected _vertexBufferLayouts: GPUVertexBufferLayout[];

  protected _premitive: GPUPrimitiveState;
  protected _depthStencil: GPUDepthStencilState;

  protected _pipeline: GPURenderPipeline;
  protected _pipelineLayout?: GPUPipelineLayout;

  constructor(gpu: GPUInstance, props: RenderPipelineProps) {
    const { device, preferredFormat } = gpu;

    this.gpu = gpu;
    this._bindGroupLayoutEntries = props.bindGroupLayouts;
    this._vertexBufferLayouts = props.vertexBufferLayouts;
    this._vertexShaderModule = props.vertexShaderModule;
    this._fragmentShaderModule = props.fragmentShaderModule;
    this._presentationFormat = props.presentationFormat ?? preferredFormat;

    this._premitive = props.premitive ?? {
      topology: 'triangle-list',
      cullMode: 'back',
    };
    
    this._depthStencil = props.depthStencil ?? {
      depthWriteEnabled: true,
      depthCompare: 'less',
      format: 'depth24plus',
    };

    if (this._bindGroupLayoutEntries) {
      this._pipelineLayout = device.createPipelineLayout({
        bindGroupLayouts: this._bindGroupLayoutEntries.map(entries => 
          device.createBindGroupLayout({ entries })
        ),
      });
    }

    this._vertexState = {
      module: this._vertexShaderModule,
      buffers: this._vertexBufferLayouts,
      entryPoint: 'main'
    }

    if (this._fragmentShaderModule && this._presentationFormat) {
      this._fragmentState = {
        module: this._fragmentShaderModule,
        entryPoint: 'main',
        targets: [
          { format: this._presentationFormat },
        ],
      }
    }

    this._pipeline = device.createRenderPipeline({
      layout: this._pipelineLayout!,
      vertex: this._vertexState,
      fragment: this._fragmentState,
      primitive: this._premitive,
      depthStencil: this._depthStencil,
    });
  }

  get pipeline() {
    return this._pipeline;
  }
  
}