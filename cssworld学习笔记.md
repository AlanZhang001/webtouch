## css world 学习笔记

#### chapter 10 元素的显示与隐藏

```
1. 元素display：none时，背景图片的加载情况

2. display与元素的显隐
- 对于ol有序列表（每行前面会显示1，2，3）中的li，display：none的元素不计入计算；但是visibility：hidden的元素仍然会计入计算，只是hidden的元素不可见而已
- display：none的表单元素仍然会在form表单中被提交，但是disabled的元素不会

3. visiblity与元素的显隐
- 父元素设置visibility：hidden，子元素也会看不见，子元素也会继承该属性，但是当给子元素重新加上visibility：hidden的时候，子元素会再次显示出来（挺神奇的）

4. display的显隐控制，不影响animation动画的执行，即每次隐藏再显示，animation动画还是会重新执行，但是会影响transition的过度效果，即每次隐藏再显示，过度效果是出不来的。但是visibility不影响transition的过度效果。
```

#### chapter 11 用户界面样式

```
1. 万万不可在全局设置outline:0 none
这在无障碍访问方面非常有用， 对于没有鼠标输入的情况下，可以通过TAB键来切换当前的焦点，默认情况下，对于处于focus状态的元素，浏览器会通过outline（比如黄色或者蓝色）来做区分。

2. 光标属性cursor
有些场景会希望文本不会被选中，因此会对元素做如下处理：
.notselect:{
     -webkit-user-select:none;
     -moz-user-select:none;
     -ms-use-select:none;
     user-select:none;
}
设置了user-select：none的元素，其cursor值默认是text（效果是鼠标显示为“I”，类似鼠标聚焦input框是的效果）；文本既然不能被选中，但是又显示为cursor：text的效果，会给有误导性，因此，设置select：none;时，需要设置cursor；default;

.notselect:{                   
     -webkit-user-select:none; 
     -moz-user-select:none;    
     -ms-use-select:none;      
     user-select:none;         
     cursor:default;
}                              
说明：在chrome上并没有发现select：none带来的影响，firefox会有这个问题

3. 自定义光标
 - IE 8 不支持 cursor：none;属性，但是可以通过自定义光标属性来模拟
 - IE系列自定义光标只支持`.cur`后缀的图片格式
 - chrome等现代浏览器可以直接使用png格式的图片来制作管标
 curosr_diy{
     cursor:url(cursor.cur);// for ie  
     cursor:url(cursor.png);// for chrome
 }
 ```

