
## 数据卷（Volume）
因为容器中的文件在磁盘上是临时存放的，所以Kubernetes定义了数据卷（Volume）以解决容器中的文件因容器重启而丢失的问题。数据卷（Volume）是Pod与外部存储设备进行数据传递的通道，也是Pod内部容器间、Pod与Pod间、Pod与外部环境进行数据共享的方式。

数据卷（Volume）定义了外置存储的细节，并内嵌到Pod中作为Pod的一部分。其实质是外置存储在Kubernetes系统的一个资源映射，当负载需要使用外置存储的时候，可以从数据卷（Volume）中查到相关信息并进行存储挂载操作。

> 数据卷（Volume）生命周期和Pod一致，即Pod被删除的时候，数据卷（Volume）也一起被删除（Volume中的数据是否丢失取决于Volume的具体类型）。

Kubernetes提供了非常丰富的Volume类型，常用的Volume类型如下：
|  数据卷（Volume）分类|描述|  
|  ----  | ----  |
|  本地存储|	适用于本地存储的数据卷，例如HostPath、emptyDir等。本地存储卷的特点是数据保存在集群的特定节点上，并且不能随着应用漂移，节点停机时数据即不再可用。|  
|  网络存储	|适用于网络存储的数据卷，例如Ceph、GlusterFS、NFS、iSCSI等。网络存储卷的特点是数据不在集群的某个节点上，而是在远端的存储服务上，使用存储卷时需要将存储服务挂载到本地使用。|  
Secret和ConfigMap|	Secret和ConfigMap是特殊的数据卷，其数据是集群的一些对象信息，该对象数据以卷的形式被挂载到节点上供应用使用。|  
|  PVC|	一种数据卷定义方式，将数据卷抽象成一个独立于Pod的对象，这个对象定义（关联）的存储信息即存储卷对应的真正存储信息，供Kubernetes负载挂载使用。|  

## 
* hostPath卷：能将主机节点文件系统上的文件或目录挂载到你的 Pod 中
* emptyDir卷：当 Pod 分派到某个节点上时，emptyDir 卷会被创建，并且在 Pod 在该节点上运行期间，卷一直存在。 就像其名称表示的那样，卷最初是空的。会随着Pod的删除而永久删除。

> 更多卷类型及具体用法见文档：https://kubernetes.io/zh/docs/concepts/storage/volumes/#volume-types

## 数据卷（Volume）使用原则
* 一个Pod可以挂载多个数据卷（Volume）。
* 一个Pod可以挂载多种类型的数据卷（Volume）。
* 每个被Pod挂载的Volume卷，可以在不同的容器间共享。
* Kubernetes环境推荐使用PVC和PV方式挂载数据卷（Volume）。
* 虽然单Pod可以挂载多个数据卷（Volume），但是并不建议给一个Pod挂载过多数据卷。

## PV和PVC
并非所有的Kubernetes数据卷（Volume）具有持久化特征，为了实现持久化的实现，容器存储需依赖于一个远程存储服务。为此Kubernetes引入了PV和PVC两个资源对象，将存储实现的细节从其如何被使用中抽象出来，并解耦存储使用者和系统管理员的职责。PV和PVC的概念如下：
* PV,PV是PersistentVolume的缩写，译为持久化存储卷。
PV在Kubernetes中代表一个具体存储类型的卷，其对象中定义了具体存储类型和卷参数。即目标存储服务所有相关的信息都保存在PV中，Kubernetes引用PV中的存储信息执行挂载操作

> PV是一个集群级别的概念，其对象作用范围是整个Kubernetes集群，而不是一个节点。PV可以有自己的独立生命周期，不依附于Pod。

* PVC, PVC是PersistentVolumeClaim的缩写，译为存储声明。

PVC是在Kubernetes中一种抽象的存储卷类型，代表了某个具体类型存储的数据卷表达。其设计意图是分离存储与应用编排，将存储细节抽象出来并实现存储的编排。这样Kubernetes中存储卷对象独立于应用编排而单独存在，在编排层面使应用和存储解耦。


## PV和PVC使用说明
### PVC和PV的绑定
PVC与PV是一一对应关系，不能一个PVC挂载多个PV，也不能一个PV挂载多个PVC。

为应用配置存储时，需要声明一个存储需求声明（PVC），而Kubernetes会通过最佳匹配的方式选择一个满足PVC需求的PV，并与之绑定。

所以从职责上PVC是应用所需要的存储对象，属于应用作用域。PV是存储平面的存储对象，属于整个存储域。

PVC只有绑定了PV之后才能被Pod使用，而PVC绑定PV的过程即是消费PV的过程，这个过程是有一定规则的，以下规则都满足的PV才能被PVC绑定：
* VolumeMode：被消费PV的VolumeMode需要和PVC一致。
* AccessMode：被消费PV的AccessMode需要和PVC一致。
* StorageClassName：如果PVC定义了此参数，PV必须有相关的参数定义才能进行绑定。
* LabelSelector：通过标签（labels）匹配的方式从PV列表中选择合适的PV绑定。
* Size：被消费PV的capacity必须大于或者等于PVC的存储容量需求才能被绑定。

### PV和PVC定义中的size字段
PVC和PV里面的size字段作用如下：
* PVC、PV绑定时，会根据各自的size进行筛选。
* 通过PVC、StorageClass动态创建PV时，有些存储类型会参考PVC的size创建相应大小的PV和后端存储。
* 对于支持Resize操作的存储类型，PVC的size作为扩容后PV、后端存储的容量值。

一个PVC、PV的size值只是在执行一些PVC和PV管控操作的时候，作为配置参数来使用。

真正的存储卷数据流写数据的时候，不会参考PVC和PV的size字段，而是依赖底层存储介质的实际容量。


## 参考
[存储基础知识](https://help.aliyun.com/document_detail/209446.html?spm=a2c4g.11174283.2.58.28ae2ceed7ew01)
