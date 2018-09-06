

class NetUtil {
    constructor() {

    }

    parameterize(parameterObj, baseUrl) {
        // console.log(parameterObj);
        // console.log(baseUrl);
        var keys = Object.keys(parameterObj);
        var parameterStr = ""
        keys.forEach(function (val, idx) {

            var str = idx == 0 ? `${val}=${parameterObj[val].toString()}` : `&${val}=${parameterObj[val].toString()}`
            parameterStr += str;
        });
        // console.log(parameterStr);
        let finalStr = `${baseUrl}?${parameterStr}`;
        return finalStr;
    }

}

export { NetUtil };