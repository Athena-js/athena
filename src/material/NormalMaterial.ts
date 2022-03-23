import { ShaderMaterial } from "@/material/ShaderMaterial";
import vertexShader from '@/shaders/normal/vert.wgsl';
import fragmentShader from '@/shaders/normal/frag.wgsl';

export class NormalMaterial extends ShaderMaterial {
  constructor() {
    super({
      name: 'NormalMaterial',
      vertexShader,
      fragmentShader
    })
  }
}