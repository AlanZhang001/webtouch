/**
 * 手写Promise
 * https://zhuanlan.zhihu.com/p/83965949
 */

const PENDGING = 'pending';
const RESOLVE = 'fulfilled';
const REJECT = 'rejected';

const isFunction = function(obj){
    return Object.prototype.toString.call(obj) === '[object Function]';
};

const isObject = function (obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
};

// “thenable” is an object or function that defines a then method.
const isThenable = function(obj){
    (isFunction(obj) || isObject(obj)) && 'then' in obj;
};

const isPromise = function(promise){
    return promise instanceof PromiseA;
};

class PromiseA{
    constructor(exectuorFn){
        this.STATUS = PENDGING;
        this.value = null;
        this.resolveCallbacks = [];
        this.rejectCallbacks = [];

        // resolve
        const resolve = (value)=>{
            if(this.STATUS === PENDGING){
                this.value = value;
                this.STATUS = RESOLVE;
                this.resolveCallbacks.forEach((fn)=>{
                    isFunction(fn) && fn(value);
                });
            }
        };

        // reject
        const reject = (value)=>{
            if(this.STATUS === PENDGING){
                this.value = value;
                this.STATUS = REJECT;
                this.rejectCallbacks.forEach((fn)=>{
                    isFunction(fn) && fn(value);
                });
            }
        };

        try{
            isFunction(exectuorFn) && exectuorFn(resolve,reject);
        }catch(e){
            reject(e);
        }
    }

    /**
     * 支持链式调用
     * “promise” is an object or function with a then method whose behavior conforms to this specification.
     */
    then(onFulfilled,onRejected){
        const handle = (resove,reject,onFulfilled,onRejected) => {
            if(this.STATUS === RESOLVE) {
                isFunction(onFulfilled) && resove(onFulfilled(this.value));
            // reject
            } else if(this.STATUS === REJECT){
                isFunction(onRejected) && reject(onRejected(this.value));
            }
        };

        const promise = new Promise((resove,reject)=>{
            // resolve,reject
            if(this.STATUS !== PENDGING) {
                // onFulfilled or onRejected must not be called until the execution context stack contains only platform code.
                // 用setimtout来保证是异步执行的
                setTimeout(() => {
                    handle(resove,reject,onFulfilled,onRejected);
                }, 0);
            // pending
            } else {
                this.resolveCallbacks.push(onFulfilled);
                this.rejectCallbacks.push(onRejected);
            }
        });
        return promise;
    }

    /**
     * 捕获异常
     * 在 A+ 规范里，并没有描述 catch 方法，以及 Promsie.resolve, Promise.reject, Promise.all, Promise.race 等静态方法。
     */
    static catch(catchFn){
        this.then(null,catchFn);
    }

    static resolve(onFulfilled){
        return new PromiseA((resolve)=>{
            resolve(onFulfilled);
        });
    }

    static reject(onRejected){
        return new PromiseA((resolve,reject)=>{
            reject(onRejected);
        });
    }
}