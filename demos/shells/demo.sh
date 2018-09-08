#!/bin/sh

# 定义变量
# 1. 定义变量时，变量名不加美元符号$
# 2. 变量名和等号之间不能有空格
name="alan"

# 3. 使用变量需要在在变量名前面加美元符号$
# 4. 使用变量，变量名外面的花括号是可选的，加不加都行
# 5. 使用花括号的场景多在为了区分变量与字符串
echo $name
echo ${name}
echo my name is ${name}zhang

# 字符串
# 1. 字符串可以用单引号，也可以用双引号，也可以不用引号
# 2. 如果不用引号，只能定义没有空格的字符串，否者必须用引号
str1=my_nameisalan;
str2='my name is alan';
str3="my name is alan";

echo ${str1};
echo ${str2};
echo ${str3};

# 3. 单引号里的任何字符都会原样输出，单引号字符串中的变量是无效的
firstname='zhang'
str4='my first name is $firstname';
echo $str4;