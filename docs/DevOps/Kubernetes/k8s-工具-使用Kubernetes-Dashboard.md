只使用 kubectl 命令行有时候不够直观，kubernetes官方提供了名为Dashboard 项目，它可以给用户提供一个可视化的 Web 界面来查看当前集群的各种信息。

用户可以用 Kubernetes Dashboard 部署容器化的应用、监控应用的状态、执行故障排查任务以及管理 Kubernetes 各种资源。

先检查dashboard版本与kubernetes版本兼容性：https://github.com/kubernetes/dashboard/releases
发现dashboard v2.0.5 与我们的Kubernetes 1.19兼容，ok，就装他吧！

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e4bd7bf1edc43ebad908bf46ef250d4~tplv-k3u1fbpfcp-watermark.image)


执行yaml文件直接部署：
`kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.5/aio/deploy/recommended.yaml`

k8s中，创建资源需要一个配置文件，配置文件的格式要求是yaml

当然我们也可以把这个yaml文件先下载下来，编辑后再执行。

检查 kubernetes-dashboard 应用状态

`kubectl get pod -n kubernetes-dashboard`

开启 API Server 访问代理

`kubectl proxy`

通过如下 URL 访问 Kubernetes dashboard

http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/

### 配置控制台访问令牌

对于Mac环境

`TOKEN=$(kubectl -n kube-system describe secret default| awk '$1=="token:"{print $2}')
kubectl config set-credentials docker-for-desktop --token="${TOKEN}"
echo $TOKEN`


对于Windows环境

`$TOKEN=((kubectl -n kube-system describe secret default | Select-String "token:") -split " +")[1]
kubectl config set-credentials docker-for-desktop --token="${TOKEN}"
echo $TOKEN`

登录dashboard的时候,选择令牌


![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/964c3a072586490685b0b710b157cddc~tplv-k3u1fbpfcp-watermark.image)

输入上文控制台输出的内容

或者选择 Kubeconfig 文件,路径如下：


Mac: $HOME/.kube/config
Win: %UserProfile%\.kube\config

点击登陆，进入Kubernetes Dashboard


![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/692a2f2613664123b050c139bb1dcb30~tplv-k3u1fbpfcp-watermark.image)


