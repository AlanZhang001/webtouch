## 学习一下搭建私有npm

## 下载并运行docker
搭建私有npm需要linux环境，使用docker是成本最低的选择，同时迁移非常方便。

docker的下载及安装见<https://github.com/AlanZhang001/dockerlearning>

## 运行linux

这里搭建了一个包含centos，git，node的基镜像。
这样进入docker的centos环境
```shell
# 1.下载
docker pull alanzhang001/base:1.0.0
# 2 启动centos
docker container run -it --privileged=true alanzhang001/base:1.0.0  /bin/bash
# 2.1退出后如何启动
docker container start [containerid]
docker container exec -it [containerID] /bin/bash
# 3. 安装几个必要的软件
yum install wget
yum install sudo
```

## 安装mysql
```shell
# 1 安装rpm
wget https://dev.mysql.com/get/mysql57-community-release-el7-9.noarch.rpm
# 2
sudo rpm -ivh mysql57-community-release-el7-9.noarch.rpm
# 3. install MySQL server:
sudo yum install mysql-server
# 4. start
sudo systemctl start mysqld
```

## 参考
- centeos上安装mysql：<https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-centos-7>
- 告诉你为何以及如何搭建一个私有的npm仓库:<https://www.colabug.com/2731929.html>