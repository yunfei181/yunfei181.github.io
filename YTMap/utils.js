
//回车直接点击按钮
function SubmitKeyClick(id, evt) {
    var e = evt ? evt : (window.event ? window.event : "");
    keyCode = evt.keyCode ? evt.keyCode : (evt.which ? evt.which : evt.charCode);
    if (keyCode == 13) {
        var btn = document.getElementById(id);
        btn.click();
        if (btn != undefined) {
            btn.focus();
        }
        e.returnValue = false;
        return false;
    }
}

//去除字符串左右的空格
function alltrim(str) {
    for (var i = 0; i < str.length && str.charAt(i) == " "; i++);
    for (var j = str.length; j > 0 && str.charAt(j - 1) == " "; j--);
    if (i > j) return "";
    return str.substring(i, j);
}

//用正则表达式将前后空格用空字符串替代
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

function trim(str) {
    for (var i = 0; i < str.length && str.charAt(i) == " "; i++);
    for (var j = str.length; j > 0 && str.charAt(j - 1) == " "; j--);
    if (i > j) return "";
    return str.substring(i, j);
}

//将字符串拆分成字符数组
function splitString(str) {
    var split = str.split(",")
    return split;
}

//获取当前网页的根路径
function getRootPath() {
    var strFullPath = window.document.location.href;
    var strPath = window.document.location.pathname;
    var pos = strFullPath.indexOf(strPath);
    var prePath = strFullPath.substring(0, pos);
    var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
    return (prePath + postPath);
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}


//删除单个记录确认
function checkDel() {
    if (confirm("确定删除吗？")) {
        return true;
    }
    else {
        return false;
    }
}

function makevisible(cur, which) {
    if (which == 0)
        cur.filters.alpha.opacity = 100;
    else
        cur.filters.alpha.opacity = 30;
}

function ConfirmClose() {
    if (confirm("您有内容需要保存，确定要关闭吗？"))
        return true;
    else
        return false;
}