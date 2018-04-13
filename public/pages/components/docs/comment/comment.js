use(["public/widget/prompt/prompt.js"], function() {
    var wangEditor={};
    Vue.component('commentComponent', {
        pageName: "docs",
        template: "public/pages/components/docs/comment/comment.html",
        data:function() {
            return {
                isThumbUp:false,
                articalId:0,
                curUserName:''
            }
        },
        props: ["pageComment"],
        created: function() {},
        mounted: function() {
            this.$nextTick(function () {
                var E = window.wangEditor;
                wangEditor = new E('#comment-area');
                wangEditor.create();

                // 根据获取的值来显示评论


                this.articalId = this.GetUrlParam("id");

                this.curUserName = cookie.get("fullName");

            })
        },
        filters:{
            utcToLocal:function (utc) {
                var date = new Date(utc)
                return date.toLocaleString();
                
            }

        },
        methods: {
            GetUrlParam: function (paraName) {
            var url = document.location.toString();
            var arrObj = url.split("?");

            if (arrObj.length > 1) {
                var arrPara = arrObj[1].split("&");
                var arr;

                for (var i = 0; i < arrPara.length; i++) {
                    arr = arrPara[i].split("=");

                    if (arr != null && arr[0] == paraName) {
                        return arr[1];
                    }
                }
                return "";
            }
            else {
                return "";
                }
            },
            getContent:function () {
                var text = wangEditor.txt.html();
                return text;
            },
            comment:function () { // 评论
                var date = new Date().format('yyyy-MM-dd hh:mm:ss');

                var htmlWithOutlabel = this.getContent().replace(/<.*?>/ig,"");
                var htmlwithOutBlank = htmlWithOutlabel.replace(/[ ]|[&nbsp;]/g, '')

                if(htmlwithOutBlank == ''){
                    return;
                }

                var config = {
                    urlParams: {
                        articalId:this.articalId,
                        content:this.getContent()
                    }
                };
                var _this = this;

                docsService.comment(config,function (res) {

                    if (res.errorCode == 0) {

                        _this.pageComment.list.push({
                            "id": res.data.id,
                            "username": _this.curUserName,
                            "comment_content": _this.getContent(),
                            "create_time": date,
                            "replerList":[]
                        })
                        wangEditor.txt.html('<p></p>'); // 富文本编辑器设置为空

                    }else{
                        prompts.init("warnning",res.msg)
                    }

                })

            },
            praise:function () { //  点赞
                //发消息 同时设置标志位

               var _this = this;

                var config={
                    urlParams: {
                        articalId:this.articalId
                    }
                }

                docsService.thumbUpForArtical(config,function (res) {
                    if (res.errorCode != 0) {
                        prompts.init("warnning",res.msg)
                    }else{
                        _this.pageComment.thumUpCount++;
                    }

                })
            },
            showLeftWord:function (item) {
                if(item.authorReplayDetail.length <= 500){
                    item.leftWord = 500 - item.authorReplayDetail.length;
                }else{
                    item.authorReplayDetail = item.authorReplayDetail.substr(0,500)
                }

            },
            authorReplay:function (item) { // 点击评论的时候，给结构增加两个字段用于控制和传值
                if (typeof item.authorReplayComment == 'undefined'){
                    Vue.set(item,"authorReplayComment",true)
                }else{
                    item.authorReplayComment = true;
                }

                if(typeof item.authorReplayDetail == 'undefined'){
                    Vue.set(item,"authorReplayDetail",'')
                }else{
                    item.authorReplayDetail =''
                }

                if(typeof item.leftWord == 'undefined'){
                    Vue.set(item,"leftWord",500)
                }else{
                    item.leftWord =500
                }

            },
            authorReplaySummit:function (item) {  //评论回复提交

                if(!item.authorReplayDetail.trim()){
                    return;
                }

                var config ={
                    urlParams: {
                        commentId:item.id,
                        content:item.authorReplayDetail
                    }
                }

                var _this = this;
                var date = new Date().format('yyyy-MM-dd hh:mm:ss');

                docsService.replyCommenter(config,function (res) {
                    if (res.errorCode != 0) {
                        prompts.init("warnning",res.msg)
                    }else{
                        item.authorReplayComment=false;

                        item.replerList.push({
                            "id": item.id,
                            "username": _this.curUserName,
                            "create_time": date,
                            "content": item.authorReplayDetail
                        })
                    }

                })

                // item.authorReplayDetail =''
            }
            

        }
    });
});
