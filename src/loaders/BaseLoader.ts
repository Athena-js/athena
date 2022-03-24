export abstract class BaseLoader {
  abstract loadAsync(url: string): Promise<any>;
}