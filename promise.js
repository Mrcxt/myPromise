(() => {
    class $Promise {
        state = 'pending'; //  fulfilled or rejected
        callbacks = []; // 任务队列
        val = null; // 结果

        constructor(fn) {
            fn(this.#resolve.bind(this), this.#reject.bind(this));
        }

        then(cb) {
            return new $Promise(resolve => {
                this.#then({
                    cb: cb || null,
                    resolve: resolve
                })
            })
        }

        // 

        /*=============================================
        =            私有方法            =
        =============================================*/


        // 
        #resolve(val) {
            // 处理cb返回值是Promise的情况
            if (val&&(typeof val === 'object'|| typeof val === 'function')) {
                const then = val.then;
                if (typeof then === 'function') {
                    then.call(val, this.#resolve.bind(this))
                    return
                }
            }

            this.state = 'fulfilled';
            this.val = val;
            this.callbacks.forEach(oCb => this.#then(oCb));
        }
        // 
        #reject(val) {
            this.state = 'rejected';
            this.val = val;
        }
        // 
        #then(oCb) {
            if (this.state === 'pending') {
                this.callbacks.push(oCb);
                return; //
            }

            // 如果没有回调参数
            if (!oCb.cb) {
                oCb.resolve(this.val)
                return; //
            }
            const res = oCb.cb(this.val);
            oCb.resolve(res);
        }

        /*=====  End of 私有方法  ======*/

        // 

        /*=============================================
        =            静态方法            =
        =============================================*/

        static resolve(){}
        static reject(){}
        static allSettled(){}
        static all(){}
        static any(){}
        static race(){}

        /*=====  End of 静态方法  ======*/


    }

    let $p = new $Promise(resolve => {
        setTimeout(() => {
            resolve('1')
        }, 1000);
    })
    $p.then(res => console.log(res)).then(() => {
        console.log('object');
        return 1
    }).then(res => {
        console.log(res);
    })
})();

(() => {

})();
