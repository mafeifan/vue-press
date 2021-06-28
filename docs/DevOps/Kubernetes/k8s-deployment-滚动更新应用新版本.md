接上篇，虽然部署完了，如果代码更新了，我们怎么发布新版本到k8s集群呢？
之前我们用k8s创建了一个deployment，deployment很强大，可以指定镜像版本，实现不停机逐渐替换镜像的Pod。

1. 更新代码，比如将 server.js中输入内容那行更新为`res.send('Hello world222\n');`
2. 重新生成镜像并推到仓库

```
docker build -t finleyma/express:v2 .
docker push finleyma/express:v2
```

docker hub上可以看到我们新的tag名为v2的镜像

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/493c7e3ed0514f0783f02fd87097f836~tplv-k3u1fbpfcp-watermark.image)

使用 kubectl set image 命令通过镜像更新将滚动更新应用于现有的名为 express-demo-deployment的Deployment

`kubectl set image deployment/[deployment名称] [容器名]=[镜像名:tag名]`

`kubectl set image deployment/express-demo-deployment express-demo=finleyma/express:v2`

监控 pods的运行状况, 旧的pod被依次删除，新的被依次创建了，因为连pod的名字都变了
`kubectl get pods -w`

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5ee669d40fb43fdb6f426c22fc7fa0f~tplv-k3u1fbpfcp-watermark.image)

再次刷新页面，内容已经变了！滚动更新成功。

deployment对于发布应用到k8s集群非常有用，我们还可以方便的回滚到某个历史版本

## 其他命令

查看详情
`kubectl describe deployment/express-demo-deployment`

验证发布
`kubectl rollout status deployment/express-demo-deployment`

查看pod中的容器的打印日志（和命令docker logs 类似）
`kubectl logs -f express-demo-deployment-XXXXXXX`

pod中的容器环境内执行命令(和命令docker exec 类似)
`kubectl exec -it express-demo-deployment-XXXXXXX -- /bin/bash`

## 参考

https://kubernetes.io/zh/docs/concepts/workloads/controllers/deployment/

https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app#cloud-shell_1
