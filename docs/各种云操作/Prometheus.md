版本
prometheus-2.11.1
node_exporter-0.18.1

#### 安装略

不用安装，因为下载的是二进制包，直接启动 Prometheus 和 node_exporter

修改配置文件
```
# Prometheus server's global configuration
global:
  scrape_interval:     15s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 15s # Evaluate rules every 15 seconds. The default is every 1 minute.
  # scrape_timeout is set to the global default (10s).

# Alertmanager configuration
alerting:
  alertmanagers:
  - static_configs:
    - targets:
      # - alertmanager:9093

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: 'prometheus'

    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.

    static_configs:
    - targets: ['localhost:9090']

  - job_name: 'node'
    static_configs:
    - targets: ['localhost:9100']
```

先来到监控界面
[http://localhost:9090/targets](http://localhost:9090/targets)
> ![image.png](https://upload-images.jianshu.io/upload_images/71414-33b36eea65b6db4a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
这里只是抓取本机的数据

还可以查看当前配置
> ![image.png](https://upload-images.jianshu.io/upload_images/71414-726ea269bdcf9639.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


<relabel_config> 配置是通过修改 label 来控制某些 target 不被抓取

<metric_relabel_configs> 配置是通过修改 label 来控制某些时间序列不被抓取

<relabel_config> 配置是通过修改 label 来控制某些 alert 不被发送给Alertmanager

<relabel_config> 配置是通过修改 label 来控制某些时间序列不被写入远端
relabel行为中，drop and keep行为(特殊)类似与过滤器，如果label不匹配，相应数据会被丢弃；而其它的relabel行为，会继续处理数据(不论匹配与否)
