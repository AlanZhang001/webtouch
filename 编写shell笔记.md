# 干掉shell

#### shell和shell脚本的概念
- shell是指一种应用程序，这个应用程序提供了一个界面，用户通过这个界面访问操作系统内核的服务。sh 就是一种shell应用程序。
- shell脚本（shell script），是一种为shell编写的脚本程序。业界所说的shell通常都是指shell脚本，但读者朋友要知道，shell和shell script是两个不同的概念。
- shell编程跟java、php编程一样，只要有一个能编写代码的文本编辑器和一个能解释执行的脚本解释器就可以了。

#### bash VS sh

两者都是解释器

###### sh
即Bourne shell，POSIX（Portable Operating System Interface）标准的shell解释器，它的二进制文件路径通常是`/bin/sh`

###### bash

Bash是Bourne shell的替代品，属GNU Project，二进制文件路径通常是/bin/bash。业界通常混用bash、sh、和shell

#### 基本解释

##### 编写

demo.sh

```shell
#!/bin/sh
cd ~
```
- `#!`是一个约定的标记，它告诉系统这个脚本需要什么解释器来执行。
- `/bin/sh`表示：
- 扩展名并不影响脚本执行，见名知意就好

##### 运行

#### 参考

- [入门](https://github.com/qinjx/30min_guides/blob/master/shell.md)