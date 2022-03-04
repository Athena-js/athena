import { BufferGeometry } from "@/geometry/BufferGeometry";
import { Vector3 } from '@/math/Vector';

export class CubeGeometry extends BufferGeometry {

  readonly cubeSize: Vector3;

  constructor(cubeSize = new Vector3(1, 1, 1)) {
    const { x: hx, y: hy, z: hz } = cubeSize.clone().div(2);
    super({
      position: new Float32Array([
        // top
        -hx,  hy, -hz,   hx,  hy, -hz,   hx,  hy,  hz,  -hx,  hy,  hz,
        // bottom
        -hx, -hy,  hz,   hx, -hy,  hz,   hx, -hy, -hz,  -hx, -hy, -hz,
        // front
        -hx,  hy,  hz,   hx,  hy,  hz,   hx, -hy,  hz,  -hx, -hy,  hz,
        // back
         hx,  hy, -hz,  -hx,  hy, -hz,  -hx, -hy, -hz,   hx, -hy, -hz,
        // left
        -hx,  hy, -hz,  -hx,  hy,  hz,  -hx, -hy,  hz,  -hx, -hy, -hz,
        // right
         hx,  hy,  hz,   hx,  hy, -hz,   hx, -hy, -hz,   hx, -hy,  hz,
      ]),
      uv: new Float32Array([
        0, 0,   1, 0,   1, 1,   0, 1,
        0, 0,   1, 0,   1, 1,   0, 1,
        0, 0,   1, 0,   1, 1,   0, 1,
        0, 0,   1, 0,   1, 1,   0, 1,
        0, 0,   1, 0,   1, 1,   0, 1,
        0, 0,   1, 0,   1, 1,   0, 1,
      ]),
      index: new Uint16Array([
        // top
        0, 2, 1,   0, 3, 2,
        // bottom
        4, 6, 5,   4, 7, 6,
        // front
        8, 10, 9,  8, 11, 10,
        // back
        12, 14, 13, 12, 15, 14,
        // left
        16, 18, 17, 16, 19, 18,
        // right
        20, 22, 21, 20, 23, 22,
      ])
    });
    this.cubeSize = cubeSize;
  }

}