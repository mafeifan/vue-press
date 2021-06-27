本教程教你跑一个Web NodeJS项目在google cloud k8s集群上面。

GKE 是 Google Kubernetes Engine (GKE) 集群

## 前提

1. 已经在GKE上面创建好了k8s集群

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0ff42219c7c490f9c379636563c4ddb~tplv-k3u1fbpfcp-watermark.image)

2. 本地安装好了gcloud cli，并且可以管理集群

`kubecl get nodes` 查看所有节点
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd722dfb68984dfbb6515a2de258ebc0~tplv-k3u1fbpfcp-watermark.image)

3. 制作好的镜像

源码在[github](https://github.com/mafeifan/docker-express-demo)上面非常简单，镜像也放到了[docker hub](https://hub.docker.com/repository/docker/finleyma/express)

4. 本地运行`docker run -p 3000:3000 -d finleyma/express` 可以成功

浏览器打开 http://localhost:3000, 可以看到内容，说明我们的镜像运行成功，可以分发部署了

## 部署应用到GKE

创建k8s的deployment
`kubectl create deployment express-demo-deployment --image=finleyma/express`

设置基准数量为3，因为我们有3个节点机器，所以每个节点跑一个
`kubectl scale deployment express-demo-deployment --replicas=3`

(可选)创建一个水平自动扩展调节器, 根据 CPU 负载将 Pod 数量从 3 个扩缩为 1 到 5 个之间
`kubectl autoscale deployment express-demo-deployment --cpu-percent=80 --min=1 --max=5`

查看已创建的Pod
`kubectl get pods`

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7eb6211b4c504e9984232c31eaef98a1~tplv-k3u1fbpfcp-watermark.image)

程序跑起来了，google cloud 也可以看到

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/609f64e03492449da35b531e24ec811c~tplv-k3u1fbpfcp-watermark.image)

虽然 Pod 确实具有单独分配的 IP 地址，但这些 IP 地址只能从集群内部访问。此外，GKE Pod 设计是临时的，可根据扩缩需求启动或关闭。当 Pod 因错误而崩溃时，GKE 会自动重新部署该 Pod，并且每次都会为 Pod 分配新的 IP 地址。

我们需要将集群外部公开 Kubernetes 服务，创建 LoadBalancer 类型的服务。此类型的服务会为可通过互联网访问的一组 Pod 生成外部负载平衡器 IP 地址。

`kubectl expose deployment express-demo-deployment --name=express-demo-deployment --type=LoadBalancer --port 80 --target-port 3000`
```
--port 标志指定在负载平衡器上配置的端口号
--target-port 标志指定 hello-app 容器正在侦听的端口号
```

查看服务，会看到 EXTERNAL-IP 列会自动分配一个IP，访问IP，和本地效果一样

`kubectl get service` 或  `kubectl get svc`

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3e71b923858458da55440347b870a5a~tplv-k3u1fbpfcp-watermark.image)

至此部署完成，下篇介绍如何更新镜像
