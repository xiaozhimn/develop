use([], function() {
    Vue.component('sliderComponent', {
        pageName: "common",
        template: "public/pages/components/common/slider/slider.html",
        props: ["sliderData", "articalId", "platId", "moduleId"],
        data:function() {
            return {}
        },
        created: function() {

        },
        mounted: function() {

        },
        methods: {
            handelClick: function (id, treeNode){
                var isActive = treeNode.isActive ? false : true;
                if (treeNode.touched && treeNode.children && treeNode.children.length) {
                    this.$set(treeNode, 'isActive', isActive);
                }
                if (!treeNode.touched) {
                  this.getSubMenuData(id, treeNode);
                }
            },
            getSubMenuData: function (id, treeNode){
                var self = this;
                var config = {
                    urlParams: {
                        platId: id
                    }
                };
                Api.get('/api/v1/getArticalMenuItems', config, function(result){
                  if (result.errorCode == 0) {
                    self.$set(treeNode, 'touched', true);
                    if (result.data.length) {
                      self.addSubMenuToSlider(treeNode, result.data)
                    }
                  }
                });
            },
            // getSubMenuData: function (id, treeNode){
            //     var self = this;
            //     tools.getSubMenuData(id, function(result){
            //       if (result.errorCode == 0) {
            //         self.$set(treeNode, 'touched', true);
            //         if (result.data.length) {
            //           self.addSubMenuToSlider(treeNode, result.data)
            //         }
            //       }
            //     });
            // },
            addSubMenuToSlider: function (treeNode, menuItems){
                if(treeNode.children && treeNode.children.length){
                    return;
                }else {
                  this.$set(treeNode, 'isActive', true);
                  this.$set(treeNode, 'children', menuItems);
                }
            }
        }
    });
});
