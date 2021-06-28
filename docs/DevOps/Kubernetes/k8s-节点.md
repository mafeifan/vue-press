Kubernetes 使用 Pod 来管理容器，**每个 Pod 可以包含一个或多个紧密关联的容器**。
Pod 是一组紧密关联的容器集合，它们共享 PID、IPC、Network 和 UTS namespace，是 Kubernetes 调度的基本单位。Pod 内的多个容器共享网络和文件系统，可以通过进程间通信和文件共享这种简单高效的方式组合完成服务。

创建 `pod_nginx.yaml` 内容如下：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx
    ports:
    - containerPort: 80
```

`kubectl create -f pod_nginx.yaml`

# 查看 pod
`kubectl get pods`

# 查看更详细的信息
`kubectl get pods -o wide`

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6c3dbf87a40e4aaa9aa23267976ba4f9~tplv-k3u1fbpfcp-watermark.image)

刷新dashboard页面也可以看到Pods信息

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e61b14cfb9b84f0b912521255b0128ea~tplv-k3u1fbpfcp-watermark.image)

但是外界并不能访问，另外`docker ps`，确实多了一个容器，但 ports 是空的，端口映射管理需要 k8s 创建service进行配置，接下来几篇会重点讲解

另外通过 `kubectl describe pods nginx` 可以查看更多信息


