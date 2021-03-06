import { BufferGeometry } from "@/geometry/BufferGeometry";
import { ShaderMaterial } from "@/material/ShaderMaterial";
import { SceneNode } from "./SceneNode";

interface MeshProps {
  name?: string;
  geometry: BufferGeometry;
  material: ShaderMaterial;
}

export class Mesh extends SceneNode {

  geometry: BufferGeometry;
  material: ShaderMaterial;

  constructor(props: MeshProps) {
    super(props?.name);
    this.geometry = props.geometry;
    this.material = props.material;
  }

  destroy() {
    this.geometry.destroy();
    this.material.destroy();
  }

}