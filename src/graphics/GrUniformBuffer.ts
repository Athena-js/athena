import { GrGPU } from "./GrGPU";
import { GrBuffer, GrBufferType, GrBufferDataType } from "./GrBuffer";

export type UniformBufferProps = {
  gpu: GrGPU,
  dataType: GrBufferDataType,
  data: ArrayLike<number>,
  visibility?: GPUShaderStageFlags,
}

export class GrUniformBuffer extends GrBuffer {

  constructor (props: UniformBufferProps) {
    super(
      props.gpu,
      GrBufferType.VERTEX,
      props.dataType ?? GrBufferDataType.Float32Array,
      props.data.length,
      true
    );
    this.writeAtCreation(props.data);
  }

}