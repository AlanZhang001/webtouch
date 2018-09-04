## PC端兼容性总结

重要针对于IE8，firfox等PC端浏览器

#### js

-  Firefox对于类似“2010-12-20 15:55:00”这种时间的转换格式不感冒，返回NaN，查了查资料，把“-”替换为“/”就可以了；
- 当函数在严格模式下的时候，访问arguments.callee会出错，arguments.caller也会报错！
- jQuery    
    - jQ2.X相关已经不支持IE9以下的IE浏览器，如果你想继续支持IE6/7/8，请使用jQuery 1.x版本
    - jQ1.8 以上，ajaxStart、ajaxStop方法只能绑定在document上，而不能绑定在具体的dom元素上。
- Fireofox 不支持 cursor:hand;建议使用兼容性搞得cursor:point;
- 火狐不支持background-position-x/y属性，这个也是标准
- IE8及以下版本不支持修改input的type属性值
- event.x 与 event.y 问题
    - 现有问题 
    在IE 中，event 对象有 x, y 属性，火狐中没有。 
    - 解决方法 
    ```
    var ee = e || window.event,
        postion = {};

    postion.x = ee.x || ee.pageX;
    postion.y = ee.y || ee.pageY;
    return postion;
    ```

- 火狐的body在body标签没有被浏览器完全读入之前就存在，而IE则必须在body完全被读入之后才存在
- 在火狐中，自己定义的属性必须getAttribute()取得，而固有属性可通过对象的方式进行获取
- input[type=checkbox]:checked+label选择器在IE8 无效，IE8不支持：checked选择器
- IE8浏览器在使用before，afer的时候必须使用单个：，现代浏览器使用:: 
- IE8不支持 Date.now()

#### css

##### 兼容IE8 RGBA的写法，见demo <demos/IErgba.html>
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
]