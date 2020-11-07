### 模块
ansible 中的模块可以用在ansible命令行或后面要讲的playbook中。不同的模块提供不同的功能，官方提供的非常多，几千种，常用的有几十种，这里只介绍常见的几种模块。
模块是Ansible基本的可复用的单元。模块的功能范围很小，可能只针对某操作系统。

### 模块的幂等性
ansible绝大多数模块都天然具有 **幂等** 特性，只有极少数模块如`shell`和`command`模块不具备幂等性。所谓的幂等性是指多次执行同一个操作不会影响最终结果。例如，ansible的yum模块安装rpm包时，如果待安装的包已经安装过了，则再次或多次执行安装操作都不会真正的执行下去。再例如，copy模块拷贝文件时，如果目标主机上已经有了完全相同的文件，则多次执行copy模块不会真正的拷贝。ansible具有幂等性的模块在执行时，都会自动判断是否要执行。

自己编写的脚本有可能执行第二次的时候有可能带来不一样的意外或影响，而模块的幂等性可以降低一定的风险。

### ansible-doc 命令
学习ansible模块时，可以先用ansible-doc命令，阅读相关模块的说明文档
比如我想通过ansible执行拷贝文件操作，先用`ansible-doc -l | grep 'copy'`过滤出所有包含copy的模块名。

> ![image.png](https://upload-images.jianshu.io/upload_images/71414-543f9d30fefcc6f0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

`ansible-doc copy` 查看copy模块的使用详情
> ![image.png](https://upload-images.jianshu.io/upload_images/71414-0de2d6d2b6002cb9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

`ansible-doc -s copy` 查看copy模块的精简信息

### shell 和 command

查看某服务器的内存使用情况
`ansible myserver -m command -a "free -m"`
可简写, 因为 -m command 是默认
`ansible myserver -a "free -m"`
模块包括 command, script(在远程主机执行主控端的shell脚本), shell (执行远程主机的shell脚本文件)
例子
ansible myserver -m command -a "free -m"
ansible myserver -m script -a "/home/local.sh"
ansible myserver -m shell -a "/home/server.sh"

> 实际上shell模块执行命令的方式是在远程使用/bin/sh来执行的

在批量服务器上完成同一操作
`ansible merch  -m shell -a "touch demo.txt"`

查看 shell 模块提供的参数
`ansible-doc -s shell`
```
- name: Execute commands in nodes.
  shell:
      chdir:                 # cd into this directory before running the command 
                             # 执行命令前，先cd到指定目录
      creates:               # a filename, when it already exists, this step will *not* be run. 
                             # 用于判断命令是否要执行。如果指定的文件(可以使用通配符)存在，则不执行。
      executable:            # change the shell used to execute the command. Should be an absolute path to the executable.
                             # 不再使用默认的/bin/sh解析并执行命令，而是使用此处指定的命令解析。例如使用expect解析expect脚本。必须为绝对路径。
      free_form:             # (required) The shell module takes a free form command to run, as a string.  There's not an actual option
                               named "free form".  See the examples!
      removes:               # a filename, when it does not exist, this step will *not* be run. 
                               # 用于判断命令是否要执行。如果指定的文件(可以使用通配符)不存在，则不执行。
      stdin:                 # Set the stdin of the command directly to the specified value.
      warn:                  # if command warnings are on in ansible.cfg, do not warn about this particular line if set to no/false.
```
例如：
```
tasks:
   - shell: touch helloworld.txt creates=/tmp/hello.txt
```
但建议，在参数可能产生歧义的情况下，使用args来传递ansible的参数。如:
```
- shell: touch helloworld.txt
   args:
     creates: /tmp/hello.txt
```

### COPY 复制模块
实现主控端向目标主机拷贝文件，类似于scp的功能。
拷贝当前目录的 demo.png 到远程服务器的/home/ubuntu目录下，并修改文件权限
`ansible cloud -m copy -a "src=demo.png dest=/home/ubuntu mode=755"`

### template 模块
template模块用法和copy模块用法基本一致，它主要用于复制配置文件。

```
ansible-doc -s template
 - name: Templates a file out to a remote server.
   action: template
      dest  # 必填，拷贝到远程机器的目标路径
      src # 必填，Ansible控制机模板文件所在位置
      force # 是否覆盖同名文件
      group # 设置远程文件的所属组
      owner # 设置远程文件的所有者
      mode  # 设置远程文件权限，如 0644，'u+rw', 'u=rw,g=r,o=r' 等方式
      backup # 拷贝的同时也创建一个包含时间戳信息的备份文件，默认为no
```

类似的模块
file # 文件处理模块，可以递归创建目录
fetch # 拉取文件模块，从远程主机将文件拉取到本地端
rsync # 实现rsync部分功能的模块

### debug 模块
用于输出自定义的信息，类似于echo、print等输出命令。ansible中的debug主要用于输出变量值、表达式值，以及用于when条件判断时。使用方式非常简单。
`ansible-doc -s debug`
```
- name: Print statements during execution
  debug:
      msg:                   # The customized message that is printed. If omitted, prints a generic message.
                             # 输出自定义信息。如果省略，则输出普通字符。
      var:                   # A variable name to debug.  Mutually exclusive with the 'msg' option.
                             # 指定待调试的变量。只能指定变量，不能指定自定义信息，且变量不能加{{}}包围，而是直接的变量名。
      verbosity:             # A number that controls when the debug is run, if you set to 3 it will only run debug when -vvv or above
                             # 控制debug运行的调试级别，有效值为一个数值N。
```

### script 模块
script模块用于控制远程主机执行脚本。在执行脚本前，ansible会将本地脚本传输到远程主机，然后再执行。在执行脚本的时候，其采用的是远程主机上的shell环境。

例如，将ansible端/tmp/a.sh发送到各被控节点上执行，但如果被控节点的/tmp下有hello.t xt ，则不执行。

```
---
     - hosts: centos
       remote_user: root
       tasks:
         - name: execute /tmp/a.sh,but only /tmp/hello.txt is not yet created
           script: /tmp/a.sh hello
           args:
             creates: /tmp/hello.txt
 
```


### 参考
模块非常多，有什么需求先去官网查，然后看文档
[官方模块说明](https://docs.ansible.com/ansible/2.8/modules/list_of_all_modules.html)
