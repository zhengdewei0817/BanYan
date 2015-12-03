var ejs = require('ejs');
var __cache = {};
ejs.cache = {
    get: function(key){
        return __cache[key];
    },
    set: function(key, val){
        __cache[key] = val;
    },
    reset: function(){
        __cache = {};
    }
};
ejs._with = false;
module.exports = ejs.__express;