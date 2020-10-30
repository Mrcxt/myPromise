(() => {
    class $Promise {
        state = 'pending'; //  fulfilled or rejected
        callbacks = []; // 任务队列
        val = null; // 结果

        constructor(fn) {
            fn(this.#resolve.bind(this), this.#reject.bind(this));
        }
        // then方法
        then(onFulfilled, onRejected) {
            return new $Promise((resolve, reject) => {
                this.#then({
                    onFulfilled: onFulfilled || null,
                    onRejected: onRejected || null,
                    resolve: resolve,
                    reject: reject,
                })
            })
        }
        // catch方法
        catch (onError) {
            return this.then(null, onError);
        }
        // finally方法
        finally(onDone) {
            let _Promise = this.constructor;
            return this.then(val => _Promise.resolve(onDone()).then(() => val))
                .catch(err => _Promise.resolve(onDone()).then(() => {
                    throw err
                }))
        }

        // 

        /*=============================================
        =            私有方法            =
        =============================================*/

        // 
        #resolve(val) {
            // 处理cb返回值是Promise的情况
            if (val && (typeof val === 'object' || typeof val === 'function')) {
                const then = val.then;
                if (typeof then === 'function') {
                    then.call(val, this.#resolve.bind(this))
                    return
                }
            }

            // 
            this.state = 'fulfilled'; // 变更状态
            this.val = val; // 保存值
            this.callbacks.forEach(oCb => this.#then(oCb)); // 执行回调队列
        }
        // 
        #reject(val) {
            this.state = 'rejected';
            this.val = val;
            this.callbacks.forEach(oCb => this.#then(oCb));
        }
        // 
        #then(oCb) {
            if (this.state === 'pending') {
                this.callbacks.push(oCb);
                return; //
            }

            const cb = this.state === 'fulfilled' ? oCb.onFulfilled : oCb.onRejected
            // 如果没有回调参数
            if (!cb) {
                cb(this.val)
                return; //
            }

            try {
                const res = cb(this.val)
                oCb.resolve(res)
            } catch (err) {
                oCb.reject(err)
            }
        }

        /*=====  End of 私有方法  ======*/

        // 

        /*=============================================
        =            静态方法            =
        =============================================*/

        static resolve() {}
        static reject() {}
        static allSettled() {}
        static all() {}
        static any() {}
        static race() {}

        /*=====  End of 静态方法  ======*/


    }

    
    /*=============================================
    =            测试用例            =
    =============================================*/
    
    let $p = new $Promise(resolve => {
        setTimeout(() => {
            resolve('1')
        }, 1000);
    })
    $p.then(res => console.log(res)).then(() => {
        console.log('then');
        return 1
    }).then(res => {
        console.log(res);
    });
    $p.then(res => {
        throw 'catch'
    }).catch(err => console.log(err))
    
    /*=====  End of 测试用例  ======*/
    
    
})();
