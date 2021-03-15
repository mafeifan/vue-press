安装rabbitmq最简单的方式是用Docker
镜像名用rabbitmq:management，还带一个后台管理平台

`docker run -d --name myrabbitmq --hostname my-rabbit -e RABBITMQ_DEFAULT_USER=admin -e RABBITMQ_DEFAULT_PASS=admin -p 15673:15672 -p 5673:5672 rabbitmq:management`


## 参考
https://www.rabbitmq.com/getstarted.html

https://www.rabbitmq.com/download.html
