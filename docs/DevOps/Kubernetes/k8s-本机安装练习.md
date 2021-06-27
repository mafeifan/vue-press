教程版本  v1.19.3

操作系统：Windows 或 Mac，本机使用Mac
我们先本机单节点练习，先熟悉操作和命令，实际生产中，k8s至少需要3个节点，其中一个是master
建议配置越高越好，内存越大越好

按照下面步骤

https://github.com/AliyunContainerService/k8s-for-docker-desktop

其实就是用阿里源加速下载k8s所需要的镜像

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c94d53c26c243f38d1fad144e995f0d~tplv-k3u1fbpfcp-watermark.image)

测试 k8s 状态

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2887447b56c440fb05594dbdf81fbb7~tplv-k3u1fbpfcp-watermark.image)

k8s 默认提供命令行工具 `kubectl -h` 查看所有命令

执行`docker ps`发现多了很多运行的容器，这也是k8s所需要的
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/70eae6b21103484ab532560927bc4dcc~tplv-k3u1fbpfcp-watermark.image)
