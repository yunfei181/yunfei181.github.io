//JS分页控件
function Pager(callback, objName, pagerDivId) {
    this.callback = callback;
    this.objName = objName;
    this.pagerDivId = pagerDivId;
}

Pager.prototype = {
    constructor: Pager,

    config: function (options, totalPage, pageSize) {
        this.currentPage = 1;
        this.options = options;
        this.totalPage = totalPage;
        this.pageSize = pageSize;//每页的个数
        this.refreshPageDiv(this.currentPage);
    },

    refreshPageDiv: function (currentPage) {

        if (currentPage < 1) currentPage = 1;

        if (this.totalPage > 1) {
            var firstPageHTML = '';
            var lastPageHTML = '';
            var prePageHTML = '';
            var nextPageHTML = '';

            if (currentPage == 1) {
                //firstPageHTML='<span class="a2">首页</span>';
            } else {
                prePageHTML = " <a href='javascript:" + this.objName + ".doPrePage(" + currentPage + ");'>上页</a> ";
            }

            if (currentPage == this.totalPage) {
                //lastPageHTML='<span class="a2">末页</span>';            
            } else {
                lastPageHTML = " <a href='javascript:" + this.objName + ".doLastPage();'>末页</a> ";
                nextPageHTML = " <a href='javascript:" + this.objName + ".doNextPage(" + currentPage + ");'>下页</a> ";
            }

            var pageHTML = '';

            // calculate(totalPage,currentPage,pageSize); 
            var beginNum = currentPage - 2;
            if (beginNum < 1) beginNum = 1;
            var endNum = beginNum + 4;
            if (endNum > this.totalPage) endNum = this.totalPage;

            if (currentPage >= 5) {
                firstPageHTML = " <a href='javascript:" + this.objName + ".doFirstPage();'>首页</a> ";
            }

            for (var k = beginNum; k <= endNum; k++) {
                if (k == currentPage) {
                    pageHTML = pageHTML + "<span class='curPage'> " + k + " </span>";
                    continue;
                }
                pageHTML = pageHTML + " <a href='javascript:" + this.objName + ".trunPages(" + k + ")'>" + k + "</a> ";
            }

            var in3_content_b = document.getElementById(this.pagerDivId);
            if (in3_content_b != null) {
                in3_content_b.innerHTML = firstPageHTML + prePageHTML + pageHTML + nextPageHTML;
            }
        } else {
            var in3_content_b = document.getElementById(this.pagerDivId);
            if (in3_content_b != null) {
                in3_content_b.innerHTML = "";
            }
        }
        this.currentPage = currentPage;
        this.callback(this.options, currentPage, this.pageSize);

    },

    trunPages: function (pageNumber) {
        this.refreshPageDiv(pageNumber);
    },

    doPrePage: function (currentPage) {
        currentPage = currentPage - 1;
        this.refreshPageDiv(currentPage);
    },

    doNextPage: function (currentPage) {
        currentPage = currentPage + 1;
        this.refreshPageDiv(currentPage);
    },

    doFirstPage: function () {
        this.refreshPageDiv(1);
    },

    doLastPage: function () {
        this.refreshPageDiv(this.totalPage);
    }
}