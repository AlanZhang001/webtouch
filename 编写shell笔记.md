# 干掉shell

#### 1. shell和shell脚本的概念
- shell是指一种应用程序，这个应用程序提供了一个界面，用户通过这个界面访问操作系统内核的服务。sh 就是一种shell应用程序。
- shell脚本（shell script），是一种为shell编写的脚本程序。业界所说的shell通常都是指shell脚本，但读者朋友要知道，shell和shell script是两个不同的概念。
- shell编程跟java、php编程一样，只要有一个能编写代码的文本编辑器和一个能解释执行的脚本解释器就可以了。

#### 2. bash VS sh

两者都是解释器

##### sh
即Bourne shell，POSIX（Portable Operating System Interface）标准的shell解释器，它的二进制文件路径通常是`/bin/sh`

##### bash

Bash是Bourne shell的替代品，属GNU Project，二进制文件路径通常是/bin/bash。业界通常混用bash、sh、和shell

#### 3. 基本解释

##### 编写

demo.sh

```shell
#!/bin/sh
cd ~
```
- `#!`是一个约定的标记，它告诉系统这个脚本需要什么解释器来执行。当一个文件找那个开头的2个字符是`#!`时，内核会扫描该行的其余的部分，看看是否存在可用来执行程序的解释器的完整路径
- `/bin/sh`表示：执行程序的解释器的完整路径
- 扩展名并不影响脚本执行，见名知意就好

#### 4. 运行

运行Shell脚本有两种方法

##### 作为可执行程序

```
cd ./demos/shells
# 让脚本获得可执行权限
chmod +x demo.sh
# 执行脚本
./demo.sh
```

注意：
- 一定要写成`./demo.sh`，而不是`demo.sh`，运行其它二进制的程序也一样；
- 直接写`demo.sh`，linux系统会去PATH里寻找有没有叫`demo.sh`的程序，`./demo.sh`告诉系统说，就在当前目录找
- 通过这种方式运行bash脚本，第一行一定要写对，好让系统查找到正确的解释器。

##### 作为解释器参数

这种运行方式是，直接运行解释器，其参数就是shell脚本的文件名，如：

```
cd ./demos/shells
/bin/sh demo.sh
```

这种方式运行的脚本，不需要在第一行指定解释器信息。

##### 注释
注释以`#`开头

```sh
#!/bin/sh
# 本文参考：https://github.com/qinjx/30min_guides/blob/master/shell.md

```

## 参考

- [入门](https://github.com/qinjx/30min_guides/blob/master/shell.md)