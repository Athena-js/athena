import { Mesh } from '@/objects/Mesh';
import { Camera } from '@/camera/Camera';
import { Vector2 } from '@/math/Vector';
import { SceneNode } from '@/objects/SceneNode';
import { PerspectiveCamera } from '@/camera/PerspectiveCamera';
import { ShaderMaterial } from '@/material/ShaderMaterial';
import { GPUInstance, checkGPU } from './GPUInstance';
import { RenderPipeline } from './RenderPipeline';

interface RendererProps {
  canvas: HTMLCanvasElement;
  scene: SceneNode;
  camera: Camera;
}

export class Renderer {
  canvas: HTMLCanvasElement;
  scene: SceneNode;
  camera: Camera;

  // check webgpu support
  gpu?: GPUInstance;
  promise?: Promise<GPUInstance>;
  gpuChecking = true;

  // msaa, must be 1 or 4
  sampleCount = 1;

  // resolution
  presentationSize = new Vector2();

  // texture format
  presentationFormat: GPUTextureFormat = 'bgra8unorm';
  
  // textures
  protected _renderTarget?: GPUTexture;
  protected _depthTexture?: GPUTexture;

  // render pass configuration
  protected _renderPassDescriptor?: GPURenderPassDescriptor;
  protected _colorAttachments?: GPURenderPassColorAttachment[];

  // piplines
  protected _cachedPipline = new Map<ShaderMaterial, RenderPipeline>();

  constructor(props: RendererProps) {
    this.canvas = props.canvas;
    this.scene = props.scene;
    this.camera = props.camera;

    this.promise = checkGPU(this.canvas).then((gpu) => {
      this.gpu = gpu;
      this.gpuChecking = false
      this.presentationFormat = this.gpu.preferredFormat;
      return gpu;
    });
  }

  render() {
    if (this.gpuChecking) return;
    this._handleResize();
    this.camera.updateMatrix(this.gpu!.device);
    this._renderNode(this.scene);
  }

  protected _renderNode(node: SceneNode) {
    node.updateMatrix();

    if (node instanceof Mesh) {
      this._renderMesh(node);
    }

    for (const child of node.children) {
      this._renderNode(child);
    }
  }

  protected _renderMesh(node: Mesh) {
    const gpu = this.gpu!;
    const { camera, presentationFormat } = this;
    const { device, ctx } = gpu;
    const { geometry, material } = node;

    const uniforms = [camera.uniform, node.uniform];

    node.updateUniform(device, camera);

    // get redner pipeline from cache
    let renderPipeline = this._cachedPipline.get(material);

    if (!renderPipeline) {
      const bindGroupLayoutEntry = uniforms.map(u => u.layoutEntry);

      // create render pipeline
      renderPipeline = new RenderPipeline(gpu, {
        bindGroupLayouts: [bindGroupLayoutEntry],
        vertexBufferLayouts: geometry.vertexBufferLayouts,
        vertexShaderModule: material.getVertexShaderModule(device),
        fragmentShaderModule: material.getFragmentShaderModule(device),
        presentationFormat: presentationFormat,
      });
      this._cachedPipline.set(material, renderPipeline);
    }

    const bindGroup = device.createBindGroup({
      layout: renderPipeline.pipeline.getBindGroupLayout(0),
      entries: uniforms.map(u => u.getBindGroupEntry(device)),
    });

    this._colorAttachments![0].view = ctx.getCurrentTexture().createView();

    const commandEncoder = device.createCommandEncoder();
    const passEncoder = commandEncoder?.beginRenderPass(this._renderPassDescriptor!);
    
    passEncoder.setPipeline(renderPipeline.pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    geometry.attach(device, passEncoder);
    passEncoder.drawIndexed(geometry.indexCount);

    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
  }

  protected _handleResize(force = false) {
    const { ctx, device } = this.gpu!;

    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    const width = this.canvas.clientWidth ?? 800;
    const height = this.canvas.clientHeight ?? 600;
    this.presentationSize.set(width * devicePixelRatio, height * devicePixelRatio);

    const neeedResize =
      this.canvas.width !== this.presentationSize.x || 
      this.canvas.height !== this.presentationSize.y;

    if (neeedResize || force) {
      this.canvas.width = this.presentationSize.x;
      this.canvas.height = this.presentationSize.y;

      ctx.configure({
        device,
        format: this.presentationFormat,
        size: this.presentationSize.toArray(),
      });

      // update render target
      this._renderTarget?.destroy();
      this._renderTarget = device.createTexture({
        size: this.presentationSize.toArray(),
        sampleCount: this.sampleCount,
        format: this.presentationFormat,
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      });

      this._colorAttachments = [{
        view: this._renderTarget.createView(),
        storeOp: 'store',
        loadOp: 'clear',
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
      }];

      // update depth texture
      this._depthTexture?.destroy();
      this._depthTexture = device.createTexture({
        size: this.presentationSize.toArray(),
        format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT,
      });

      this._renderPassDescriptor = {
        colorAttachments: this._colorAttachments,
        depthStencilAttachment: {
          view: this._depthTexture.createView(),
          depthLoadOp: 'clear',
          depthClearValue: 1.0,
          depthStoreOp: 'store'
        }
      };

      if (this.camera instanceof PerspectiveCamera) {
        this.camera.aspect = width / height;
        this.camera.needsUpdateProjectionMatrix = true;
      }

      return neeedResize;
    }
  }
  
}