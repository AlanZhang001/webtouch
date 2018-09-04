#### 常用命令
小白，还是多记记吧

##### grep
- 使用正则表达式搜索文本，并把匹 配的行打印出来
- 比较好的教程:<http://www.cnblogs.com/peida/archive/2012/12/17/2821195.html>
- 要记住的命令
```html
# 在php -i的输出中搜索php.ini，可以用来查找php的位置
php -i | grep php.ini

# 在多个文本中搜索文本
grep '笔记' CSS3原生变量var.md cssworld学习笔记.md

# 更具关键字搜索进程（如搜索sublime）
ps aux | grep Sublime
```

##### ps