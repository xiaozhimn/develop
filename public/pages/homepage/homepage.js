use([
    "public/pages/homepage/store.js",
    "public/pages/homepage/homepageService.js",
    "public/pages/components/homepage/table/table.js",
    "public/widget/prompt/prompt.js"
], function() {
    function init(storage, store) {
        var app = new VueRoot({
            template: 'public/pages/homepage/homepage.html',
            data: {
                storage: storage,
                searchMessage: '',
                platFormId: 0,
                platFormName: '全部',
                platFormList: [{id:'',name:'全部'}]
            },
            store: store,
            created: function() {
            },
            mounted: function() {
                this.init();
            },
            methods: {
                init: function () {
                    this.getPlatForm();
                },
                getPlatForm: function () {
                    var _this = this;
                    homepageService.getPlatForm(function (res) {
                        if (res.errorCode == 0) {
                            _this.platFormList = _this.platFormList.concat(res.data);

                            if (_this.platFormList[0]) {
                                _this.platFormName = _this.platFormList[0].name;
                                _this.platFormId = _this.platFormList[0].id;
                            }
                        }
                    });
                },
                search: function (currentPage) {
                    var _this = this;
                    var config = {
                        urlParams: {
                            currentPage: currentPage || 1,
                            platFormId: _this.platFormId,
                            keyWord: _this.searchMessage
                        }
                    };
                    homepageService.searchUserSelfPublishedArtical(config,function (res) {
                        if (res.errorCode == 0) {
                            _this.storage.tableList = res.data
                        }else{
                            prompts.init("warnning",res.msg)
                        }
                    });
                },
                reset: function () {
                    this.searchMessage = '';
                    this.platFormId = '';
                    this.platFormName = '全部';
                    this.search();
                },
                add: function () {
                    window.location.href = '/item';
                },
                deleteSuccess: function (page) {
                    this.search(page);
                },
                changePlatForm: function (item) {
                    this.platFormId = item.id;
                    this.platFormName = item.name;
                }
            }
        });
        return app;
    }
    module.exports = init;
    if(typeof window != "undefined") {
        var mainComponent = init(storage, store);
        mainComponent.$mount("#app");
    }
});
