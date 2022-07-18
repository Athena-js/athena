type SubFunc<T> = (value: T) => any;

interface Subscription {
  destroy: () => boolean;
}

export class Observable<T = void> {

  private _subFuncSet = new Set<SubFunc<T>>();

  emit (value: T) {
    this._subFuncSet.forEach((cb) => cb(value));
  }

  subscribe (callback: SubFunc<T>, destroyOb?: Observable<any>): Subscription | null {
    if (this._subFuncSet.has(callback)) return null;
    this._subFuncSet.add(callback);
    const destroy = () => this._subFuncSet.delete(callback);
    destroyOb?.subscribeOnce(destroy);
    return {
      destroy
    }
  }

  subscribeOnce (callback: SubFunc<T>): Subscription | null {
    if (this._subFuncSet.has(callback)) return null;
    const wrapFn = (value: T) => {
      callback(value);
      this._subFuncSet.delete(wrapFn);
    }
    this._subFuncSet.add(wrapFn);
    return {
      destroy: () =>  this._subFuncSet.delete(wrapFn)
    }
  }

  destroy () {
    this._subFuncSet.clear();
  }

}