# 安装

Returns a CheerioWrapper around the rendered HTML of the current node's subtree.

Note: can only be called on a wrapper of a single node.
推荐使用 npm 的方式安装，它能更好地和 [webpack](https://webpack.js.org/) 打包工具配合使用。

<div class="tip">我们建议使用 CDN 引入 Element 的用户在链接地址上锁定版本，以免将来 Element 升级时受到非兼容性更新的影响。锁定版本的方法请查看 </div>

#### Returns

`CheerioWrapper`: The resulting Cheerio object



#### Examples

``There is a literal backtick (`) here.``


```jsx
function Foo() {
  return (<div className="in-foo"></div>);
}
```

```jsx
function Bar() {
  return (
    <div className="in-bar">
      <Foo />
    </div>
  );
}
```

```jsx
var hello = "hhh";
const wrapper = shallow(<Bar />);
expect(wrapper.find('.in-foo')).to.have.length(0);
expect(wrapper.find(Foo).render().find('.in-foo')).to.have.length(1);
```

```jsx
require(loadList, function ($, angular) {
        $(function () {
            angular.bootstrap(document, ['blogApp']);
        });
        hljs.initHighlightingOnLoad();
});
```

```css
@font-face {
  font-family: Chunkfive; src: url('Chunkfive.otf');
}

body, .usertext {
  color: #F0F0F0; background: #600;
  font-family: Chunkfive, sans;
}

@import url(print.css);
@media print {
  a[href^=http]::after {
    content: attr(href)
  }
}
```
