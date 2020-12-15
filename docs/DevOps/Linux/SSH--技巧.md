SSH（Secure Shell 的缩写）是一种网络协议，用于加密两台计算机之间的通信，并且支持各种身份验证机制。

一般情况下我们可以通过 `ssh username@xxx.xxx.xxx.xxx` 登录远程服务器，如果要管理多台服务器，这样太长了。
可以在家目录的 .ssh 中新建config文件，设置别名。
比如我有一台个人的云主机。IP是120.163.163.163，端口是4722(一般都是22，这里为了安全我改为了其他)，登录用户名是ubuntu，登录方式是私钥登录。
```
# Host 可跟多个表示别名
Host cloud  alias
    HostName 120.163.163.163
    User ubuntu
    Port 4722
    # 私钥路径
    IdentityFile ~/.ssh/id_rsa
```
这样执行 `ssh cloud` 或 `ssh alias` 就无密码登录云主机了

#### 1. 执行远程命令
`ssh cloud "df -h"`
> ![image.png](https://hexo-blog.pek3b.qingstor.com/upload_images/71414-6e4fb3bd80600312.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 2. 用分号分隔多个命令，用引号引起来
`ssh cloud "df -h; ps;"`

#### 3. 遇到需要交互的命令，加 -t  参数
```
$ ssh -t cloud top
```
比如 `sudo`  开头的可能需要用户输入密码，需要 TTY。
添加 -t 参数后，ssh 会保持登录状态，直到你退出需要交互的命令。

> ![image.png](https://hexo-blog.pek3b.qingstor.com/upload_images/71414-1832a664f7095765.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

再举个实际例子：
`ssh -t flux sudo -u fueladminprd ssh 192.168.1.100`
这句话实际执行了两步：
1.  ssh -t flux #登录名为flux的服务器，因为需要交互式，加上-t
2.  sudo -u fueladminprd  ssh 192.168.1.100 # 以 fueladminprd 用户在 flux 上执行 ssh 192.168.1.100
为了安全，flux 就是跳板机，192.168.1.100 为实际测试服务器。

#### 4. 执行多行命令
```
$ ssh cloud "echo 'haha'
> pwd
> ls "
```
可以用单引号或双引号开头，然后写上几行命令，最后再用相同的引号来结束。
`>` 开头的就是输入下一行命令
如果需要在命令中使用引号，可以混合使用单双引号。
> ![image.png](https://hexo-blog.pek3b.qingstor.com/upload_images/71414-2f98740683ad8e74.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 5. 在命令中使用变量
在远程服务器执行 `ls node`，本地定义变量a，传入到命令中。达到一样的效果。
在下图的命令中为 bash 指定了 -c 参数
```
$ a=node
$ ssh cloud bash -c " '
> ls $a
> ' "
```
> ![image.png](https://hexo-blog.pek3b.qingstor.com/upload_images/71414-69eb868388ebdc0b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 6. 执行本地脚本
本地创建demo.sh，内容是：`ls node`
运行 `ssh cloud < demo.sh`
通过重定向 stdin，本地的脚本 demo.sh 在远程服务器上被执行。
> ![image.png](https://hexo-blog.pek3b.qingstor.com/upload_images/71414-a7b56ec7fbce3520.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 7. 为脚本传入参数
修改 demo.sh 内容为：
```
ls node
echo $0
echo $1
echo $2
```
执行 `ssh cloud 'bash -s'< demo.sh aa bb cc`
bash 就是 $0 第一个参数。
>  ![image.png](https://hexo-blog.pek3b.qingstor.com/upload_images/71414-2454d65cbf062ad0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 想查看更多配置，打`man ssh_config`
### 参考：
http://www.openssh.com/

https://www.cnblogs.com/sparkdev/p/6842805.html

https://www.zcfy.cc/article/top-20-openssh-server-best-security-practices
