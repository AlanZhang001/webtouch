## git笔记

## git 仓库图

![git](asserts/git1.png)

## 常用命令

![gitapi](asserts/git2.png)

## 笔记

######  1. 当我们commit之后突然发现漏掉了一个文件, 这个时候不可能对一个文件再进行commit一次, 这样做就显得很多余, 而如果版本回退之前再添加也比较麻烦. 这个时候就可以使用这个amend命令.如下:

```
$ git commit -m "版本1.5开发代码"
 
# 正当你松了一口气的时候发现配置文件忘记修改了, 你赶紧修改,并适合用add到暂存区
$ git add project.property
$ git commit --amend        
# 你会神奇的发现你没有增加任何多余的操作就把漏掉的文件补齐到最后一次提交中

```

###### 2. .gitignore无效，不能过滤某些文件
利用.gitignore过滤文件，如编译过程中的中间文件等等，这些文件不需要被追踪管理。

**现象：**
在.gitignore添加file1文件，以过滤该文件，但是通过git status查看仍显示file1文件的状态。

**原因：**
在git库中已存在了这个文件，之前push提交过该文件。
.gitignore文件只对还没有加入版本管理的文件起作用，如果之前已经用git把这些文件纳入了版本库，就不起作用了

**解决：**
需要在git库中删除该文件，并更新。
然后再次git status查看状态，file1文件不再显示状态。

###### 3. 更新submodule的URL
```
- 更新 .gitsubmodule中对应submodule的条目URL

- 更新 .git/config 中对应submodule的条目的URL

- 执行 git submodule sync
```

###### 4. 增加子模块
 
- 添加子模块： `git submodule add http://gitlab.futunn.com/alanzhang/[componentname].git ./submodule/[componentname]`
- 更新各个子模块： `git submodule init;git submodule update;git submodule foreach "git checkout master;git pull origin master;"`
- 批量执行任务:`git submodule foreach 'commend ...'`
 
##### 5. 重写提交历史说明
- git commit --amend -m'这是新的提交说明'
- 不能对已经push的提交做修改comment

## progit 书籍查看进度

`Git 基础 - 记录每次更新到仓库`

## 学习参考链接
- 常用 Git 命令清单<http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html>
- Git版本控制软件结合GitHub从入门到精通常用命令学习手册<http://www.ihref.com/read-16369.html>
- 图解Git<https://my.oschina.net/xdev/blog/114383?p=2&temp=1482048713873#blog-comments-list>

