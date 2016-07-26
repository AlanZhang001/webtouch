##前言

最近又开始开发公司的后台管理系统，由于整个页面的架构是通过iframe来进行区域划分，所以经常需要通过 父窗口来调用子窗口方法或者子窗口获取父窗口变量等窗口的情况，所以整理一下相关的用法，避免遗忘！

###一.top,parent,self,window，opener之间的区别和关系

**self: 当前窗口的引用**

与winow,window.self等价。

**top: 顶层窗口对像**

与window.top等价；如果窗口本身就处于顶层，则top与window,window.top对象等价。

**parent: 当前窗口的父窗口**

与window.parent等价;如果窗口本身就处于顶层，则top与parent,window.parent对象等价。

**opener: 属性是一个可读可写的属性，返回创建当前窗口的 Window 对象的引用；**

语法：window.opener

说明：

- window.opener特指通过window.open 方法打开的 新窗口的 那个窗口，例如：A窗口通过 wndow.open方法(不能通过其他方式)，打开B窗口，则windowB.opener == windowA;
- window.opener 与window.parent 无直接关系，只有当iframe窗口是 父窗口通过 window.open(url,frameName) 打开时,window.opener才与window.parent等价！


举个栗子：（我曾长期对此迷惑不解，囧）

A.html
```

	<!DOCTYPE html>
	<html lang="en">
	    <head>
	        <meta charset="UTF-8">
	        <title>Document</title>
	        <script type="text/javascript" scr="../jquery1.10.2.min.js"></script>
	    </head>
	    <body>
	        <iframe id="contFrame" name="contFrame"></iframe>
	    </body>
	    <script type="text/javascript">
	        window.open("B.html","contFrame")
	    </script>
	</html>
```
B.html
```

	<!DOCTYPE html>
	<html lang="en">
	    <head>
	        <meta charset="UTF-8">
	        <title>Document</title>
	    </head>
	    <body>
	        <p>我是被打开的页面</p>
	    </body>
	    <script type="text/javascript">
	        var equalAble = window.opener == window.parent;
	        console.log(equalAble);// true
	    </script>
	</html>

```
这个情况下，window.opener == window.parent;

 

###二.contentWindow，contentDocument 及iframe的获取方式

**定义：**

contentWindow：子窗口的 window 对象，所有主要浏览器都支持 contentWindow 属性,但是他并不是标准的一部分；

contentDocument ：子窗口的 document 对象，以 HTML 对象返回框架容纳的文档。可以通过所有标准的 DOM 方法来处理被返回的对象，IE需要IE8+才能支持，

 

**获取iframe：**

想要获取一个iframe元素有如2种方式：

1.document.getElementById("iframeId")

2.window.frames["iframeName"]

通过上面2种方式获得的iframe对象来获取代表当前iframe窗口的window和document对象 也对应2种方式。

 

**获取window，document对象：**

如果是通过dom直接获取的iframe，则获取docuemen和window的方式是：

doc= document.getElementById('iframeName' ).contentDocument; //文档对象

wind= document.getElementById('iframeName' ).contentWindow;  //window对象
如果是通过window.iframes["name]的方式来获取iframe,则获取docuemen和window的方式是：

doc = document.frames['iframeId'].document;

window = window.frames["iframeId"].window;
 

**区别**：在梳理iframe知识的时候，我认为contentWindow 与window可能会有区别，梳理完之后才意识到这个疑惑本身就有问题，contentWindow就是子窗口的window对象，在子窗口中，其window对象通过关键字window表示，指向其窗口引用，在父级窗口中，可以通过contentWindow属性获得子窗口的window对象。只是表示方式不一样罢了！看来梳理一下知识还是挺有用的！

 

###参考文档：

- <http://www.runoob.com/jsref/prop-frame-contentwindow.html>

- <http://www.jb51.net/article/39489.htm>


所有主要浏览器都支持 contentWindow 属性