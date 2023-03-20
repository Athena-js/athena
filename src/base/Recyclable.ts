import { Observable } from "./Observable";

export abstract class Recyclable {

  private _destoryed$ = new Observable<void>();

  abstract onDestroy (): void;

  destroy () {
    this.onDestroy?.();
    this._destoryed$.emit();
    this._destoryed$.destroy();
  }

}