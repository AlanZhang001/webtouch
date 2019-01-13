## 学习一下搭建私有npm

## 下载并运行docker
搭建私有npm需要linux环境，使用docker是成本最低的选择，同时迁移非常方便。

docker的下载及安装见<https://github.com/AlanZhang001/dockerlearning>

## 运行linux

这里搭建了一个包含centos，git，node的基镜像。
这样进入docker的centos环境
```
# 下载
docker pull alanzhang001/base:1.0.0
# 启动centos
docker container run -it alanzhang001/base:1.0.0  /bin/bash
```