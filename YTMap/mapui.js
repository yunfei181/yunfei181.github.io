
function changeFullsrnState() {
    if ($("#mapMiddle").css("top") == "0px") {
        $("#toolbar_fullsrn_txt").text("全屏");
        $("#mapMiddle").css("top", "71px");
        $("#mapRight").css("left", "300px");
        $("#mapExpander").css("display", "inline");
    } else {
        resetExpanderState();
        $("#toolbar_fullsrn_txt").text("退出全屏");
        $("#mapMiddle").css("top", "0px");
        $("#mapRight").css("left", "0px");
        $("#mapExpander").css("display", "none");
    }
    map.updateSize();
}

function changeMapExpanderState() {
    if ($("#mapExpander").attr("class") == "expander-right") {
        $("#mapExpander").attr("class", "expander-left");
        $("#mapRight").css("left", "0px"); //之所以去掉动画是因为在有些IE版本下移动缓慢
        $("#mapLeft").css("left", "-300px");
    } else {
        resetExpanderState();
    }
    map.updateSize(); //chrome下需要重新刷新地图位置
}

function resetExpanderState() {
    $("#mapExpander").attr("class", "expander-right");
    $("#mapRight").css("left", "300px");
    $("#mapLeft").css("left", "0px");
}
