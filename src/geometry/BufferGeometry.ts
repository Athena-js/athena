import { IndexBuffer } from "@/buffer/IndexBuffer";
import { VertexBuffer } from "@/buffer/VertexBuffer";
import { Vector3 } from "@/math/Vector";

interface BufferGeometryProps {
  position: Float32Array;
  uv?: Float32Array;
  normal?: Float32Array;
  color?: Float32Array;
  index: Uint16Array;
}

export class BufferGeometry {

  readonly position: VertexBuffer;
  readonly uv: VertexBuffer;
  readonly normal: VertexBuffer;
  readonly color: VertexBuffer;
  readonly index: IndexBuffer;
  readonly vertexBufferLayouts: GPUVertexBufferLayout[];

  constructor(props: BufferGeometryProps) {
    this.position = new VertexBuffer({
      name: 'position',
      location: 0,
      strideLength: 3,
      format: 'float32x3',
      data: props.position
    });

    this.uv = new VertexBuffer({
      name: 'uv',
      location: 1,
      strideLength: 2,
      format: 'float32x2',
      data: props.uv ?? new Float32Array()
    });

    this.color = new VertexBuffer({
      name: 'normal',
      location: 3,
      strideLength: 3,
      format: 'float32x3',
      data: props.color ?? new Float32Array()
    });

    this.index = new IndexBuffer({
      data: props.index
    });

    this.normal = new VertexBuffer({
      name: 'normal',
      location: 2,
      strideLength: 3,
      format: 'float32x3',
      data: props.normal ?? this.computeVertexNormals()
    });

    this.vertexBufferLayouts = [
      this.position,
      this.uv,
      this.normal,
      this.color,
    ].map(buffer => buffer.bufferLayout);
  }

  get indexCount() {
    return this.index.data!.length;
  }

  destroy() {
    this.position.destroy()
    this.uv.destroy();
    this.normal.destroy();
    this.color.destroy();
    this.index.destroy();
  }
  
  attachVertexBuffer(device: GPUDevice, passEncoder: GPURenderPassEncoder) {
    this.position.attach(device, passEncoder);
    this.uv.attach(device, passEncoder);
    this.normal.attach(device, passEncoder);
    this.color.attach(device, passEncoder);
  }

  attachIndexBuffer(device: GPUDevice, passEncoder: GPURenderPassEncoder) {
    this.index.attach(device, passEncoder);
  }

  computeVertexNormals() {
    const vertices = this.position.data!;
    const indices = this.index.data!;
    const tmp: [Vector3, number][][] = Array(vertices.length / 3).fill(0).map(() => []);

    for (let i = 0; i < indices.length; i += 3) {
      const [i0, i1, i2] = [indices[i + 0], indices[i + 1], indices[i + 2]];
      const p0 = new Vector3(vertices[i0 * 3], vertices[i0 * 3 + 1], vertices[i0 * 3 + 2]);
      const p1 = new Vector3(vertices[i1 * 3], vertices[i1 * 3 + 1], vertices[i1 * 3 + 2]);
      const p2 = new Vector3(vertices[i2 * 3], vertices[i2 * 3 + 1], vertices[i2 * 3 + 2]);
      const p01 = p1.clone().sub(p0);
      const p02 = p2.clone().sub(p0);
      const p12 = p2.clone().sub(p1);
      const p20 = p0.clone().sub(p2);
      const p21 = p1.clone().sub(p2);
      const n0 = p01.clone().cross(p02);
      const n1 = p01.clone().cross(p12);
      const n2 = p20.clone().cross(p21);
      const l0 = p12.len();
      const l1 = p20.len();
      const l2 = p01.len();
      const h = (l0 + l1 + l2) / 2;
      const area = Math.sqrt(h * (h - l0) * (h - l1) * (h - l2));
      tmp[i0].push([n0, area]);
      tmp[i1].push([n1, area]);
      tmp[i2].push([n2, area]);
    }

    const normals = tmp.map(p => {
      let weight = 0;
      const normal = Vector3.zero();
      for (const [n, w] of p) {
        normal.add(n.mul(w));
        weight += w;
      }
      return weight ? normal.div(weight).toArray() : normal;
    });

    return new Float32Array(normals.flat() as number[]);
  }

}