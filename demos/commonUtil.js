/**
 * 工具方法
 * @module
 * @private
 */
let commonUtil = {
    /**
     * [keys description]
     * @param  {Object} obj  对象
     * @return {Array} keys 数组
     */
    keys(obj) {
        if(!obj) {
            return [];
        }

        let result = [];

        for(let k in obj) {
            if(obj.hasOwnProperty(k)) {
                result.push(k);
            }
        }
        return result;
    },

    /**
     * [serializeArray 将map格式的数据转换为二维数组[ [key,value],[key,value] ]]
     * @function
     * @param  {*} data [description]
     * @param  {Booelean} encodeAble [是否需要转义]
     * @return {Array}      [description]
     */
    serializeToArray(data,encodeAble) {
        let args = [];

        if(!data){
            return args;
        }

        if (data instanceof Object) {
            this.keys(data).forEach(key => {
                let item = data[key];
                if (Array.isArray(item)) {
                    let arrayName = key + '[]';
                    item.forEach(_item => {
                        args.push([arrayName,encodeAble ? encodeURIComponent(_item) : _item]);
                    });
                } else {
                    args.push([key, encodeAble ? encodeURIComponent(item) : item]);
                }
            });
        } else {
            args.push([data.toString()]);
        }

        return args;
    },

    /**
     * [serialize 将map结构序列换]
     * @param  {Array} data [description]
     * @param  {Boolean} encodeAble [是否进行转义]
     * @return {String}     [description]
     */
    serializeToString(data,encodeAble) {
        let args = this.serializeToArray(data,encodeAble);
        let result = args.map(item => {
            return item.join('=');
        });

        return result.join('&');
    }
};