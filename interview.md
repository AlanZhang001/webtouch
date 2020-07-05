<https://www.cxymsg.com/guide/mechanism.html#javascript%E6%89%A7%E8%A1%8C>

[TOC]

> 遗漏知识点补齐

# 前端基础
### JavaScript基础
#### 解释下变量提升✓

1. 浏览器内核、引擎、V8之间的关系是什么？
    - 浏览器内核包括：渲染引擎 + js引擎，因为js引擎比较独立，所以目前所指的浏览器内核 是指 渲染引擎，如：chrome的blink，ie的trident
    - v8是js引擎的一种。
    - JavaScript在浏览器中运行的过程分为两个阶段预解释阶段和执行阶段,这部分是js引擎上做的。
2. 为什么let不存在变量提升？
    - 这个文章解释的非常清楚：https://zhuanlan.zhihu.com/p/28140450
    - 主要原因是这个几个：
        - 不管是var还是let，声明变量存在这个过程：创建、初始化、赋值
        - 创建: 在执行环境(活动对象)中创建该变量
        - 初始化：给一个值undefined
        - 赋值：字面意思，赋值
    - var，let，function的声明过程是这样的：
        - let 的「创建」过程被提升了，但是初始化没有提升。由于暂时性死区的限制，未初始化时是无法使用的，所以这行代码会报错:`
        let x = 'global'; {
            console.log(x) // Uncaught ReferenceError: x is not defined
            let x = 1
        }`,只要对作用域中的变量组了创建，那么console.log()就会找本作用域中的x，而由于没有初始化，所以会报错。
        - var 的「创建」和「初始化」都被提升了。所以他有个默认值为undefined
        - function 的「创建」「初始化」和「赋值」都被提升了。


3. 暂时性死区

    - let/const声明的变量，当它们包含的词法环境(Lexical Environment)被实例化时会被创建，但只有在变量的词法绑定(LexicalBinding)已经被求值运算后，才能够被访问。
    - 当程序的控制流程在新的作用域(module, function或block作用域)进行实例化时，在此作用域中的用let/const声明的变量会先在作用域中被创建出来，但因此时还未进行词法绑定（就是初始化），也就是对声明语句进行求值运算，所以是不能被访问的，访问就会抛出错误。所以在这运行流程一进入作用域创建变量，到变量开始可被访问之间的一段时间，就称之为TDZ(暂时死区)。

#### 一段JavaScript代码是如何执行的？【未完成】

1. JavaScript运行时（JavaScript Runtime）是什么？
    - 全称叫做JavaScript Runtime Environment
    - 想让JavaScript真正运作起来，单单靠JavaScript Engine是不够的，JavaScript Engine的工作是编译并执行 JavaScript 代码，完成内存分配、垃圾回收等,但是缺乏与外部交互的能力。
    - 比如单靠一个V8引擎是无法进行ajax请求、设置定时器、响应事件等操作的，这就需要JavaScript运行时（JavaScript Runtime）的帮助
    - 对于这些外部接口，可以在运行时供JS调用，另外还有JS的事件循环和回调队列， 这些称为运行时。浏览器运行时和node运行时是不同的。

2. 一段JavaScript代码的运行

JavaScript并非简单的一行行解释执行，而是将JavaScript代码分为一块块的可执行代码块进行执行，有三类代码块：
- 函数代码块（Function code）
- 全局代码块（Global code）
- eval代码块（Eval code）

一行代码必然是三类代码块中的一个，然后执行过程可以分为两个阶段:

- 编译阶段：由编译器完成，将代码翻译成可执行代码
    - 分词/词法分析（Tokenizing/Lexing）：这个过程将字符串分解成词法单元，如 var a = 2; 会被分解成词法单元 var、 a、 = 、2、;。空格一般没意义会被忽略
    - 解析/语法分析（Parsing）：这个过程会将词法单元转换成 抽象语法树（Abstract Syntax Tree,AST）
    - 代码生成：将AST转换成可执行的代码，存放于内存中，并分配内存和转化为一些机器指令
- 执行阶段：由引擎完成，主要任务是执行可执行代码
    - 创建执行上下文
    - 通过调用栈执行代码


#### 理解闭包吗？✓
#### JavaScript的作用域链理解吗？✓
#### ES6模块与CommonJS模块有什么区别✓
#### js有哪些类型？✓
- 还有一个没有正式发布但即将被加入标准的原始类型BigInt。
#### 为什么会有BigInt的提案？✓
#### null与undefined的区别是什么？✓
#### 0.1+0.2为什么不等于0.3？【很重要，未开始】
#### 类型转换的规则有哪些？【很重要，未开始】
![](https://cloudmain.futunn.com/alanzhang/type-3d7db14268d923bcc53652d22d0ba8f7.png?_=1591622604696)





