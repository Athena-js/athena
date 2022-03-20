export class FrameController {

  protected _active = false;

  callback: Callback;

  constructor(callback: Callback) {
    this.callback = callback;
  }

  get isActive() {
    return this._active;
  }

  start() {
    this._active = true;
    this._loop();
  }

  pause() {
    this._active = false;
  }

  private _loop() {
    if (this._active) {
      requestAnimationFrame(this._loop.bind(this));
      this.callback();
    }
  }
}