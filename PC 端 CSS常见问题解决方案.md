# PC 端 CSS常见问题解决方案

## 写在最前

工作以后，记忆力不像学生时代那样好，踩过的坑，看过的知识,去过的分享时间久了也记不住，有必要做个记录！

移动端的相关问题及解决方案在这里 <https://github.com/AlanZhang001/HTML5-FAQ>

#### Chrome谷歌浏览器下不支持css字体小于12px的解决办法
chrome下css设置字体大小为12px及以下时，显示都是一样大小，都是默认12px；
对于旧版的chrome添加私有属性webkit-text-size-adjust:none;新版无效，需要通过其他方式来处理。
```
<div class="smallFont">
     这里是12号字体<span>CHROME下小字体测试8px</span>
</div>

.smallFont{
    font-size: 12px;
    width: 300px;
    padding: 25px;
    background-color: #333;
    color: #fff;
    margin-bottom: 20px;
}
.smallFont span{
    font-size:8px;/*其他浏览器直接设置字体即可*/
    -webkit-text-size-adjust:none;/*老版本chrome支持*/
    -webkit-transform:scale(0.66); /*chrome下通过缩放解决小字体显示问题*/
    transform-origin:0;/*改变基点*/
    display: inline-block;
}
```

#### 去除inline-block元素间间距的N种方法及研究
解决办法详见：[inline-block 前世今生](http://www.iyunlu.com/view/css-xhtml/64.html)

#### 兼容IE8 RGBA的写法，见demo <demos/IErgba.html>
ie8不支持rgba()函数，要在IE8中设置半透明，需要通过filter来解决此类问题
```
<body>
    <div>
        看看是不是透明的
    </div>
</body>
<style>
html,body{
    width: 100%;
    height: 100%;
    background-color: #863737;
}
div{
    width: 300px;
    height: 300px;
    background: rgba(255,255,255,.5);
    filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=#7Fffffff,endColorstr=#7Fffffff);
}
</style>
```
这里#后面的7F是rgba透明度为0.5 的IEfilter值。gradient本身是用来做渐变的，由于不需要渐变，所以两个颜色都设置成了相同的颜色。

透明度从0.1到0.9每个数字对应一个IEfilter值。对应关系如下：

| rgba透明度值 | IEfilter值 |
| ----- |:------:|
| 0.1 | 19 |
| 0.2 | 33 |
| 0.3 | 4C |
| 0.4 | 66 |
| 0.5 | 7F |
| 0.6 | 99 |
| 0.7 | B2 |
| 0.8 | C8 |
| 0.9 | E5 |

>将透明度值\*255向下取整，转换成16进制即可。Math.floor(255\*0.1) = 0x19

#### 让readonly的元素没有输入框
```
<input type="text" readonly="true"/>

<!--添加样式-->
<style>
    -webkit-user-select:none;
    user-select: none;
    -ms-user-select: none;
    -moz-user-select: -moz-none;
</style>
<!--设置属性-->
<script type="text/javascript">
    intputNode.setAttribute('unselectable','on');
</script>
```