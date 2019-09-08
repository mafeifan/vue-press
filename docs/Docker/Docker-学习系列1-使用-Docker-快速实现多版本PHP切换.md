多谢此文：https://blog.eriksen.com.br/en/docker-image-multi-version-php-development

最近一个新的后台API项目需要运行在PHP5.3环境中，而无论是本地还是测试服务器都安装的是PHP7.x
PHP5.3官方已经不维护了，通过源码安装配置也很麻烦，我又不想污染现有的环境。
所以想到了docker
我觉得docker适合以下情况：

1. 运行特定的开发环境，比如要运行两个项目。一个要求PHP5.6，一个PHP7.0。不想来回切换。
2. 喜欢尝鲜，折腾，docker有很强的隔离性。在docker里搞坏也不会破坏本地，用到的时候docker run 启动镜像和容器，不想用了docker rm 删掉即可。

新项目是基于 ThinkPHP3.2
想通过docker跑起来，可以按如下步骤：

1. 安装 docker，略
记得一定要切换为国内源，不然速度巨慢，还容易报错，推荐免费的https://www.daocloud.io/mirror#accelerator-doc
2. 下载镜像
`docker pull eriksencosta/php-dev`
3. 项目目录是已经存在的
路径是 `D:/projects/live-ranking-api`
4. 运行容器  其中参数：-p 端口映射  -v 挂载目录，冒号前是宿主机目录，后面的是容器内目录
 -t -i 参数 表示已交互方式运行容器，运行成功后会执行 /bin/bash  就是进去终端
`docker run -t -i  -p 8088:80 -v D:/projects/live-ranking-api:/var/www -d "eriksencosta/php-dev:latest" /bin/bash`
> ![image.png](https://hexo-blog.pek3b.qingstor.com/upload_images/71414-55b0e9da91db9375.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

5. 打开浏览器输入 `localhost:8088` 正常的话项目已经成功跑起来了
6. 切换PHP版本，在容器内的终端内输入 `phpenv命令` 列出当前可选择的PHP版本
```shell
# phpenv versions
  5.3
  5.3.29
  5.4
  5.4.35
  5.5
  5.5.19
  5.6
* 5.6.3 (set by /opt/phpenv/version)
```
执行 phpenv global 5.4
```shell
# phpenv global 5.4
# php -v
PHP 5.4.35 (cli) (built: Dec 14 2014 00:35:12)
Copyright (c) 1997-2014 The PHP Group
Zend Engine v2.4.0, Copyright (c) 1998-2014 Zend Technologies
    with Zend OPcache v7.0.3, Copyright (c) 1999-2014, by Zend Technologies
    with Xdebug v2.2.6, Copyright (c) 2002-2014, by Derick Rethans
```
启动nginx
```shell
# webserver start
Starting PHP-FPM (PHP version 5.3) server.
Starting Nginx server.
Done.
```

#### 参考：
* https://hub.docker.com/r/eriksencosta/php-dev/
* https://github.com/eriksencosta/silex-docker-example
