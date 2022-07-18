import { GrGPU } from "./GrGPU";
import { GrBuffer, GrBufferType, GrBufferDataType } from "./GrBuffer";

type VertexBufferAttribute = {
  name: string;
  format: GPUVertexFormat;
}

export type VertexBufferProps = {
  gpu: GrGPU,
  dataType?: GrBufferDataType,
  data: ArrayLike<number>,
  strideLength: number,
  stepMode?: GPUVertexStepMode,
  attributes: VertexBufferAttribute[],
}

export class GrVertexBuffer extends GrBuffer {

  /** the stride, in elements, between elements of this array */
  readonly strideLength: number;

  /** can be 'vertex' | 'instance' */
  readonly stepMode: GPUVertexStepMode;

  /** vertex attributes */
  readonly attributes: VertexBufferAttribute[];
  

  constructor (props: VertexBufferProps) {
    super(
      props.gpu,
      GrBufferType.VERTEX,
      props.dataType ?? GrBufferDataType.Float32Array,
      props.data.length,
      true
    );
    this.writeAtCreation(props.data);
    this.stepMode = props.stepMode ?? 'vertex';
    this.strideLength = props.strideLength;
    this.attributes = props.attributes;
  }


  static GetVertexLayouts (buffers: GrVertexBuffer[]) {
    let loc = 0;
    const vertexLayouts = buffers.map((buffer) => {
      const stepMode = buffer.stepMode;
      const arrayStride = buffer.strideLength * buffer.byteLength;
      const attributes = buffer.attributes.reduce((acc, cur) => {
        acc.attributes.push({
          shaderLocation: loc++,
          offset: acc.offset,
          format: cur.format
        });
        acc.offset += GrBuffer.SizeOfGPUVertexFormat(cur.format);
        return acc;
      }, { offset: 0, attributes: [] as GPUVertexAttribute[] }).attributes;
      return {
        stepMode,
        arrayStride,
        attributes
      } as GPUVertexBufferLayout;
    });
    return vertexLayouts;
  }

}