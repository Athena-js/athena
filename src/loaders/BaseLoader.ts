import { SceneNode } from "@/objects/SceneNode";

export abstract class BaseLoader {
  abstract loadAsync(url: string): Promise<SceneNode>;
}