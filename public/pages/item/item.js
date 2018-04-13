use([
    "public/pages/item/store.js",
    "public/pages/item/itemService.js",
    "public/widget/prompt/prompt.js"
], function () {
    function init(storage, store) {
        var app = new VueRoot({
            template: 'public/pages/item/item.html',
            data: {
                storage: storage,
                'articalId': 0,
                'platFormId': 0,
                'platFormName': '',
                'platFormList': [],
                'moduleId': 0,
                'moduleName': '请选择',
                'moduleList': [],
                'isShowModule': false,
                'name': '',
                'description': '',
                'editor': ''
            },
            store: store,
            created: function () {
            },
            mounted: function () {
                this.init();

                var info = this.storage.info;
                if (info.articalId) {    // 编辑状态
                    this.articalId = info.articalId;
                    this.platFormId = info.plat_id;
                    this.name = info.name;
                    this.description = info.artical_desc;
                    this.editor = info.content;
                }
            },
            methods: {
                init: function () {
                    this.getPlatForm();
                },
                getPlatForm: function () {
                    var _this = this;
                    itemService.getPlatForm(function (res) {
                        if (res.errorCode == 0) {
                            _this.platFormList = res.data;

                            if(_this.storage.info.plat_id && res.data){    // 编辑时回显栏目
                                var data = res.data.find(function(element, index){
                                    return element['id'] == _this.storage.info.plat_id;
                                });

                                _this.platFormName = data.name;
                                _this.platFormId = data.id;
                            }else if (_this.platFormList[0]) {    // 新增时初始化栏目
                                _this.platFormName = _this.platFormList[0].name;
                                _this.platFormId = _this.platFormList[0].id;
                            }
                            _this.getModule();
                        }
                    });
                },
                getModule: function () {
                    var _this = this;
                    var config = {
                        'urlParams': {
                            'platId': this.platFormId
                        }
                    };
                    itemService.getModule(config, function (res) {
                        if (res.errorCode == 0) {
                            _this.moduleList = res.data;

                            if(_this.storage.info.module_id && res.data){
                                var data = res.data.find(function(element, index){
                                    return element['id'] == _this.storage.info.module_id;
                                });

                                _this.moduleName = data.name;
                                _this.moduleId = data.id;

                                _this.isShowModule = true;
                            }else if (_this.moduleList[0]) {
                                _this.moduleId = _this.moduleList[0].id;
                                _this.moduleName = _this.moduleList[0].name;
                                _this.isShowModule = true;
                            } else {
                                _this.moduleId = 0;
                                _this.moduleName = '请选择';
                                _this.isShowModule = false;
                            }
                        }
                    });
                },
                changePlatForm: function (item) {
                    this.platFormId = item.id;
                    this.platFormName = item.name;

                    this.storage.info.module_id = 0;

                    this.getModule();
                },
                changeModule: function (item) {
                    this.moduleId = item.id;
                    this.moduleName = item.name;
                },
                save: function () {
                    var config = {
                        urlParams: {
                            platFormId: this.moduleId || this.platFormId,
                            name: this.name,
                            desc: this.description,
                            content: this.editor
                        }
                    };

                    if (this.articalId) {
                        config.urlParams.articalId = this.articalId;
                    } else {
                        delete config.urlParams.articalId;
                    }
                    itemService.artical(config, function (res) {
                        if (res.errorCode == 0) {
                            prompts.init("success",res.msg);
                            setTimeout(function(){
                                window.location.href = '/homepage'
                            }, 3000);
                        } else {
                            prompts.init("warnning",res.msg)
                        }
                    });
                },
                cancel: function () {
                    window.location.href = '/homepage'
                }
            }
        });
        return app;
    }

    module.exports = init;
    if (typeof window != "undefined") {
        var mainComponent = init(storage, store);
        mainComponent.$mount("#app");
    }
});
