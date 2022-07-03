import { ThrowErrorIfNull } from "@/utils/error";

export class GPUInstance {

  ctx: GPUCanvasContext;
  adapter: GPUAdapter;
  device: GPUDevice;

  preferredFormat: GPUTextureFormat;

  constructor(ctx: GPUCanvasContext, adapter: GPUAdapter, device: GPUDevice) {
    this.ctx = ctx;
    this.adapter = adapter;
    this.device = device;
    this.preferredFormat = navigator.gpu.getPreferredCanvasFormat();
  }

}

export const checkGPU = async (canvas: HTMLCanvasElement) => {
  const ctx = ThrowErrorIfNull(
    canvas.getContext('webgpu'),
    'Your browser does not support webgpu.'
  );

  const adapter = ThrowErrorIfNull(
    await navigator.gpu.requestAdapter({
      powerPreference: 'high-performance',
    }),
    'Cannot get gpu adapter.'
  );

  const device = ThrowErrorIfNull(
    await adapter.requestDevice(),
    'Cannot get gpu device.'
  );

  return new GPUInstance(ctx, adapter, device);
}
