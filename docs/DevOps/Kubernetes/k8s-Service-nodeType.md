### 存在问题：
每个Pod都会分配一个单独的Pod IP，然而却存在如下两问题：

- Pod IP 会随着Pod的重建产生变化
- Pod IP 仅仅是集群内可见的虚拟IP，外部无法访问
- 需要一种机制，为前端系统屏蔽后端系统的 Pod（容器组）在销毁、创建过程中所带来的 IP 地址的变化。

### 解决问题：
Kubernetes 中的 Service（服务） 提供了这样的一个抽象层，它选择具备某些特征的 Pod（容器组）并为它们定义一个访问方式。

Service 为一组 Pod（通过 labels 来选择）提供一个统一的入口，并为它们提供负载均衡和自动服务发现。

一个 Service（服务）选定哪些 Pod（容器组） 通常由 LabelSelector(标签选择器) 来决定。

### Service类型

* ClusterIP: 在群集中的内部IP上公布服务,外界无法访问，集群内可访问（默认）
* LoadBalance：在云环境中（需要云供应商可以支持）创建一个集群外部的负载均衡器，并为使用该负载均衡器的 IP 地址作为服务的访问地址。此时 ClusterIP 和 NodePort 的访问方式仍然可用。
* NodePort：使用 NAT 在集群中每个的同一端口上公布服务。这种方式下，可以通过访问集群中任意节点+端口号的方式访问服务 <NodeIP>:<NodePort>。此时 ClusterIP 的访问方式仍然可用

作为编写 Service 清单的替代方法，可以使用 kubectl expose 公开 Deployment，以创建 Service。

`kubectl expose deployment my-deployment --name my-cip-service \ 
--type ClusterIP --protocol TCP --port 80 --target-port 8080`

查看服务
kubectl get svc

#### NodeType类型的Service

通过一个例子了解NodeType类型的Service
首先创建一个deployment，里面会运行一个web服务，暴露端口是50000
然后基于这个deployment创建NodeType类型的service，会把外部来的32049端口的流量转发到这个pod内部的50000端口

my-deployment-50000.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-deployment-50000
spec:
  selector:
    matchLabels:
      app: metrics
      department: engineering
  # 我们的节点数有3个，这里副本是也设置为3，等于每个节点跑一个Pod
  replicas: 3 
  template:
    metadata:
      labels:
        app: metrics
        department: engineering
    spec:
      containers:
        - name: hello
          image: "gcr.io/google-samples/hello-app:2.0"
          env:
            - name: "PORT"
              value: "50000"
```

my-np-service.yaml
```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-np-service
spec:
  type: NodePort
  selector:
    app: metrics
    department: engineering
  ports:
    - protocol: TCP
      # port是暴露在cluster ip上的端口，:port提供了集群内部客户端访问service的入口
      # 默认情况下，为了方便起见，`targetPort` 被设置为与 `port` 字段相同的值。
      port: 80
      # nodePort 提供了集群外部客户端访问 Service 的一种方式
      # nodePort 提供了集群外部客户端访问 Service 的端口，通过 nodeIP:nodePort 提供了外部流量访问k8s集群中service的入口。
      # 指定绑定的node的端口(默认的取值范围是:30000-32767), 如果不指定，会默认分配
      nodePort: 32049
      # targetPort是pod上的端口
      targetPort: 50000
```


kubectl apply -f my-deployment-50000.yaml

kubectl get pods

kubectl apply -f my-np-service.yaml

kubectl get service my-np-service --output yaml

// 记下任意一个 EXTERNAL-IP，如 35.236.136.94 | 35.194.201.238 |  35.234.56.229
kubectl get nodes --output wide

访问 EXTERNAL-IP:nodePort,三个节点的IP都可以访问成功
