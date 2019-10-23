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
- 注释以`#`开头


#### 4. 运行

运行Shell脚本有两种方法

##### 作为可执行程序

```shell
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

```shell
#!/bin/sh
cd ./demos/shells
/bin/sh demo.sh
```

这种方式运行的脚本，不需要在第一行指定解释器信息。

#### 5. 变量

```
#!/bin/sh

# 定义变量
# 1. 定义变量时，变量名不加美元符号$，重新定义变量也不需要加$
# 2. 变量名和等号之间不能有空格
name="alan"

# 3. 使用变量需要在在变量名前面加美元符号$
# 4. 使用变量，变量名外面的花括号是可选的，加不加都行
# 5. 使用花括号的场景多在为了区分变量与字符串
# 6. 推荐给所有变量加上花括号，这是个好的编程习惯
echo $name
echo ${name}
echo my name is ${name}zhang

```

#### 6. 字符串 

```
#!/bin/sh
# 1. 字符串可以用单引号，也可以用双引号，也可以不用引号
# 2. 如果不用引号，只能定义没有空格的字符串，否者必须用引号
str1=my_nameisalan;
str2='my name is alan';
str3="my name is alan";

# 3. 单引号里的任何字符都会原样输出，单引号字符串中的变量是无效的
# 4. 单引号中不能有单引号
firstname='zhang'
str4='my first name is $firstname';
```

## 参考

- [入门](https://github.com/qinjx/30min_guides/blob/master/shell.md)