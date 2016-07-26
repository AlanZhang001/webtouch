<h2>前言</h2>
<p>　　今天整理QQ邮箱时，无意发现 QQ邮箱的选与不选中又多出一个状态(图一)，我以为是通过模拟达成的效果，F12查看才发现，貌似是原生效果(图二)，关键就是这个</p>
<div class="cnblogs_code">
<pre><span style="color: #0000ff;">this</span>.middleStatus = <span style="color: #0000ff;">this</span>.indeterminate;</pre>
</div>
<p>&nbsp;</p>
<p>　　<img src="http://images2015.cnblogs.com/blog/688158/201511/688158-20151121143713671-2139697667.png" alt="" width="202" height="164" />&nbsp; &nbsp; &nbsp;&nbsp;<img src="http://images2015.cnblogs.com/blog/688158/201511/688158-20151121144128077-1880913469.png" alt="" /></p>
<p>　　　　　　图一　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　图二</p>
<p>百度了下这个middleStatus没什么发现，倒是indeterminate有些内容，原来好多人也在好奇QQ邮箱的这个效果，所以就来谈谈这个indeterminate状态！</p>
<h2>一. checkbox 的几种状态及实现</h2>
<p>　　很明显，上面已经知道checxbox除了不选unchecked&nbsp;和 选checked&nbsp;以外还多了一种不确定indeterminate的状态。</p>
<p>　　checkbox默认就是不选，通过在标签中加上 checked 关键字即可显示为可选 或者通过js控制，那么不确定的indeterminate的状态是否可以通过 在标签中设置属性来改变样式呢？</p>
<p>答案是否定的，在<a title="checkbox属性" href="http://www.w3school.com.cn/jsref/dom_obj_checkbox.asp" target="_blank">W3C</a>上查了下其标签属性 并没有 发现indeterminate的踪影。再次百度，在一篇css-tricks.com上的文章才得出结论， 对于不确定的indeterminate状态只能通过js来控制，看下面代码：</p>
<div class="cnblogs_code" style="text-align: left;">
<pre><span style="color: #0000ff;">&lt;</span><span style="color: #800000;">input </span><span style="color: #ff0000;">type</span><span style="color: #0000ff;">="checkbox"</span><span style="color: #ff0000;"> id</span><span style="color: #0000ff;">="checkdemo_unchecked"</span><span style="color: #0000ff;">/&gt;</span>checkdemo_unchecked <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">br</span><span style="color: #0000ff;">/&gt;</span>
<span style="color: #0000ff;">&lt;</span><span style="color: #800000;">input </span><span style="color: #ff0000;">type</span><span style="color: #0000ff;">="checkbox"</span><span style="color: #ff0000;"> id</span><span style="color: #0000ff;">="checkdemo_checked"</span><span style="color: #0000ff;">/&gt;</span>checkdemo_checked<span style="color: #0000ff;">&lt;</span><span style="color: #800000;">br</span><span style="color: #0000ff;">/&gt;</span>
<span style="color: #0000ff;">&lt;</span><span style="color: #800000;">input </span><span style="color: #ff0000;">type</span><span style="color: #0000ff;">="checkbox"</span><span style="color: #ff0000;"> id</span><span style="color: #0000ff;">="checkdemo_indeterminate"</span><span style="color: #0000ff;">/&gt;</span>checkdemo_indeterminate<span style="color: #0000ff;">&lt;</span><span style="color: #800000;">br</span><span style="color: #0000ff;">/&gt;</span>
<span style="color: #0000ff;">&lt;</span><span style="color: #800000;">script </span><span style="color: #ff0000;">type</span><span style="color: #0000ff;">="text/javascript"</span><span style="color: #ff0000;"> src</span><span style="color: #0000ff;">="http://apps.bdimg.com/libs/jquery/1.9.1/jquery.js"</span><span style="color: #0000ff;">&gt;&lt;/</span><span style="color: #800000;">script</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #0000ff;">&lt;</span><span style="color: #800000;">script</span><span style="color: #0000ff;">&gt;<br /></span><span style="background-color: #f5f5f5; color: #000000;">　　　 //设置true或false来这只选与不选
　　　 $(</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">#checkdemo_checked</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">).prop(</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">checked</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">,</span><span style="background-color: #f5f5f5; color: #0000ff;">true</span><span style="background-color: #f5f5f5; color: #000000;">);<br />　　　 //设置true或false来设置不确定状态和不选
      $(</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">#checkdemo_indeterminate</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">).prop(</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">indeterminate</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">,</span><span style="background-color: #f5f5f5; color: #0000ff;">true</span><span style="background-color: #f5f5f5; color: #000000;">);
</span><span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">script</span><span style="color: #0000ff;">&gt;</span></pre>
</div>
<p>只在chrome和Firefox上测试了效果，Firefox的效果倒是看起来更加舒服！</p>
<p><img src="http://images2015.cnblogs.com/blog/688158/201511/688158-20151121150256311-1574839920.png" alt="" />&nbsp;&nbsp;<img src="http://images2015.cnblogs.com/blog/688158/201511/688158-20151121150304968-372553608.png" alt="" /></p>
<h2>二. 兼容性如何</h2>
<p>&nbsp; 　这个indeterminate的属性一来用的少，而且我也并没有发现什么特别好的工具来检测兼容性，除非不同浏览器来看效果，引用其他同学的话，这个属性的兼容性从IE4.0就开始支持了，</p>
<p>但我并未发现 这个结论的出处，暂且记着。</p>
<p>&nbsp;</p>
<h2>三. 使用场景及好处</h2>
<p><span style="line-height: 1.5;">　　这个属性应该主要用在多选框嵌套的时候，比如QQ邮箱以及下面的应用，　　</span></p>
<p><span style="line-height: 1.5;">　　　<img src="http://images2015.cnblogs.com/blog/688158/201511/688158-20151121153220077-1021872762.png" alt="" /></span></p>
<p>　　平时没有这个不确定的状态也没觉得什么不妥，用上之后倒是觉得更加舒服，最大的优点估计就是是系统看起来更加人性化，更加舒适，交互性也强些吧！</p>
<h2>四. input 之checkbox 标签 checked属性设置不起作用</h2>
<p>　　 在低版本的jQuery中，特别是1.6左右的，使用attr()方法来改变checked，通过attr("checked") 获取属性值，显示出来的checkbox并不总是和其属性相对应，所见不是所得，这似乎是1.6版本的bug，那时候做课程设计的时候，为此纠结好久；下面是例子：</p>
<div class="cnblogs_code">
<pre><span style="color: #0000ff;">&lt;!</span><span style="color: #ff00ff;">DOCTYPE html</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #0000ff;">&lt;</span><span style="color: #800000;">html </span><span style="color: #ff0000;">lang</span><span style="color: #0000ff;">="en"</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #0000ff;">&lt;</span><span style="color: #800000;">head</span><span style="color: #0000ff;">&gt;</span>
    <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">meta </span><span style="color: #ff0000;">charset</span><span style="color: #0000ff;">="UTF-8"</span><span style="color: #0000ff;">&gt;</span>
    <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">title</span><span style="color: #0000ff;">&gt;</span>Checkbox Demo<span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">title</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">head</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #0000ff;">&lt;</span><span style="color: #800000;">body</span><span style="color: #0000ff;">&gt;</span>
    <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">input </span><span style="color: #ff0000;">type</span><span style="color: #0000ff;">="checkbox"</span><span style="color: #ff0000;"> id</span><span style="color: #0000ff;">="checkdemo_checked"</span><span style="color: #0000ff;">/&gt;</span>全选<span style="color: #0000ff;">&lt;</span><span style="color: #800000;">br</span><span style="color: #0000ff;">/&gt;</span>
    <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">input </span><span style="color: #ff0000;">type</span><span style="color: #0000ff;">="checkbox"</span><span style="color: #ff0000;"> id</span><span style="color: #0000ff;">="checkbox1"</span><span style="color: #0000ff;">/&gt;</span>我根据全选或全不选来改变<span style="color: #0000ff;">&lt;</span><span style="color: #800000;">br</span><span style="color: #0000ff;">/&gt;</span>

    <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">script </span><span style="color: #ff0000;">type</span><span style="color: #0000ff;">="text/javascript"</span><span style="color: #ff0000;"> src</span><span style="color: #0000ff;">="http://apps.bdimg.com/libs/jquery/1.6.1/jquery.js"</span><span style="color: #0000ff;">&gt;&lt;/</span><span style="color: #800000;">script</span><span style="color: #0000ff;">&gt;</span>
    <span style="color: #0000ff;">&lt;</span><span style="color: #800000;">script</span><span style="color: #0000ff;">&gt;</span><span style="background-color: #f5f5f5; color: #000000;">
        $(</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">#checkdemo_checked</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">).bind({
            click:</span><span style="background-color: #f5f5f5; color: #0000ff;">function</span><span style="background-color: #f5f5f5; color: #000000;"> (argument) {
                </span><span style="background-color: #f5f5f5; color: #0000ff;">var</span><span style="background-color: #f5f5f5; color: #000000;"> status </span><span style="background-color: #f5f5f5; color: #000000;">=</span><span style="background-color: #f5f5f5; color: #000000;"> $(</span><span style="background-color: #f5f5f5; color: #0000ff;">this</span><span style="background-color: #f5f5f5; color: #000000;">).attr(</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">checked</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">);

                </span><span style="background-color: #f5f5f5; color: #0000ff;">if</span><span style="background-color: #f5f5f5; color: #000000;">(status){
                    $(</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">#checkbox1</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">).attr(</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">checked</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">,</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">checked</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">);
                }</span><span style="background-color: #f5f5f5; color: #0000ff;">else</span><span style="background-color: #f5f5f5; color: #000000;">{
                    
                    </span><span style="background-color: #f5f5f5; color: #008000;">//</span><span style="background-color: #f5f5f5; color: #008000;">错误的做法</span>
<span style="background-color: #f5f5f5; color: #000000;">                    $(</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">#checkbox1</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">).attr(</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">checked</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">,</span><span style="background-color: #f5f5f5; color: #000000;">""</span><span style="background-color: #f5f5f5; color: #000000;">);

                    </span><span style="background-color: #f5f5f5; color: #008000;">//</span><span style="background-color: #f5f5f5; color: #008000;">正确的做法</span>
                    <span style="background-color: #f5f5f5; color: #008000;">//</span><span style="background-color: #f5f5f5; color: #008000;">$("#checkbox1").removeAttr('checked');</span>
<span style="background-color: #f5f5f5; color: #000000;">                }
                console.log($(</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">#checkbox1</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">).attr(</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">checked</span><span style="background-color: #f5f5f5; color: #000000;">"</span><span style="background-color: #f5f5f5; color: #000000;">));
            }
        });
    </span><span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">script</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">body</span><span style="color: #0000ff;">&gt;</span>
<span style="color: #0000ff;">&lt;/</span><span style="color: #800000;">html</span><span style="color: #0000ff;">&gt;</span></pre>
</div>
<p>结果：</p>
<p><img src="http://images2015.cnblogs.com/blog/688158/201511/688158-20151121162422249-735288948.png" alt="" /></p>
<p>在1.6版本中，想要取消选中，只能通过去除属性的方式</p>
<div class="cnblogs_code">
<pre> //正确的做法</pre>
<pre>$("#checkbox1").removeAttr('checked');</pre>
</div>
<p>&nbsp;</p>
<p>在较新的jQuery版本中，attr()方法的这个问题已经不存在了，但是还是建议使用prop属性来取代attr设置checked属性。而且官方也建议使用prop方法来改变值为boolean的属性；</p>
<p>&nbsp;</p>
<h2>五. 总结</h2>
<ul>
<li>checkbox 除了 选中，不选以外 还有indeterminate 状态，意味不确定</li>
<li>设置indeterminate属性只能通过 js来设置，不能通过在标签中加属性来完成</li>
<li>兼容IE4浏览器，但是在不同的浏览器上表现不一样</li>
<li>多用于 checkbox嵌套的场景下，使页面交互性更强，页面更舒适</li>
<li>建议使用jQuery &nbsp;prop方法设置 checkbox的checked属性</li>
</ul>
<p>&nbsp;</p>
<h2>参考文档</h2>
<https://css-tricks.com/indeterminate-checkboxes>
<http://lemmychrist.blog.163.com/blog/static/98732963201391485225489/>
