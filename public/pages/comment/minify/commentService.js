var commentService={urls:{getCommentForAtrical:"/api/v1/getCommentForAtrical",thumbUpForArtical:"/api/v1/thumbUpForArtical",publishCommentForAtical:"/api/v1/publishCommentForAtical"},getCommentForAtrical:function(t,i){Api.get(this.urls.getCommentForAtrical,t,i)},thumbUpForArtical:function(t,i){Api.get(this.urls.thumbUpForArtical,t,i)},comment:function(t,i){Api.post(this.urls.publishCommentForAtical,t,i)}};module.exports=commentService;