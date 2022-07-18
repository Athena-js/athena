import { Recyclable } from "@/base/Recyclable";
import { NullValueError } from "@/utils/errors";
import { GrVertexBuffer, VertexBufferProps } from "./GrVertexBuffer";

export class GrGPU extends Recyclable {

  /** canvas dom element */
  private _canvas?: HTMLCanvasElement;

  /** gpu context */
  private _context?: GPUCanvasContext;

  /** gpu adapter */
  private _adapter?: GPUAdapter;

  /** gpu device */
  private _device?: GPUDevice;


  /**
   * canvas dom element, must call initAsync first.
   */
    get canvas () {
    if (!this._canvas) throw new NullValueError();
    return this._canvas;
  }

  /**
   * webgpu context, must call initAsync first.
   */
  get context () {
    if (!this._context) throw new NullValueError();
    return this._context;
  }

  /** gpu device, must call initAsync first. */
  get device () {
    if (!this._device) throw new NullValueError();
    return this._device;
  }

  /** exact pixel dimensions of the canvas */
  get presentationSize () {
    return [
      this.canvas.width,
      this.canvas.height
    ] as ATypes.VEC2;
  }

  /**
   * Initialize webgpu context & device.
   * @param canvas canvas element
   */
  async initAsync (canvas: HTMLCanvasElement) {
    this._canvas = canvas;

    const context = canvas.getContext('webgpu');
    if (!context) throw new NullValueError();
    this._context = context;

    const adapter = await navigator?.gpu?.requestAdapter?.();
    if (!adapter) throw new NullValueError();
    this._adapter = adapter;

    const device =  await adapter?.requestDevice?.();
    if (!device) throw new NullValueError();
    this._device = device;

    this._trackCanvasResize();

    return this;
  }

  onDestroy () {
    
  }

  /** Create Vertex Buffer Object. */
  createVertexBuffer (props: Omit<VertexBufferProps, 'gpu'>) {
    return new GrVertexBuffer({ gpu: this, ...props });
  }

  private _trackCanvasResize () {
    const canvas = this.canvas;
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.target != canvas) continue;
        canvas.width = entry.devicePixelContentBoxSize[0].inlineSize;
        canvas.height = entry.devicePixelContentBoxSize[0].blockSize;
      }
    });
    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }
  
}

export const getWebGPUInstance = () => {
}