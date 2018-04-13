use([], function() {
    Vue.component('tableComponent', {
        pageName: "homepage",
        template: "public/pages/components/homepage/table/table.html",
        props: ["totalCount","currentPage","pageSize","tableBody"],
        data:function() {
            return {}
        },
        created: function() {
        },
        mounted: function() {
            this.pagination();
        },
        updated:function(){
            this.pagination();
        },
        methods: {
            edit: function (item) {
                window.location.href = '/item?id='+item.id;
            },
            del: function (item) {
                var _this = this ;
                var config = {
                    urlParams: {
                        articalId: item.id
                    }
                };
                var msg = "确定要删除吗？";
                if(confirm(msg)==true){
                    homepageService.deleteSingleArtical(config, function(res){
                        if(res.errorCode == 0){
                            _this.$emit('getTableData',_this.currentPage);
                        }else{
                            prompts.init("warnning","删除错误！")
                        }
                    });
                }else{
                    return false;
                }

            },
            pagination: function() {
                var _this = this;
                function changePage(current){
                    _this.$emit('getTableData',current);
                }
                setTimeout(function(){
                    $("#pagination").initPage(_this.totalCount,_this.currentPage,changePage);
                },10)
            }
        }
    });
});