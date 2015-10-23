function queryToJson(){
    var temp = {};
    var query = location.search;
    query = query.substr(1, query.length);
    var arr = query.split('&');
    var len = arr.length;
    var item;
    for(var i=0; i<len; i++){
        item = arr[i].split('=');
        temp[item[0]] = item[1];
    }

    return temp;
};

(function(){
    var srcollIntoView = true;
    window.addEventListener("resize", function(){
        if(document.activeElement.tagName=="INPUT"){
            window.setTimeout(function(){
                document.activeElement.scrollIntoView(srcollIntoView);
                srcollIntoView = false;
            },0);
        }
    })

})();
