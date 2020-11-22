可以为playbook中的任务打tag标签，方便在ansible-playbook中设置只执行哪些被打上tag的任务或忽略被打上tag的任务。

### 使用 tag 为 task 分类

```yaml
tasks:
    - name: make sure apache is running
      service: name=httpd state=started
      tags: apache
    - name: make sure mysql is running
      service: name=mysqld state=started
      tags: mysql
```
以下是ansible-playbook命令关于tag的选项。
```
--list-tags           # list all available tags
-t TAGS, --tags=TAGS  # only run plays and tasks tagged with these values
--skip-tags=SKIP_TAGS # only run plays and tasks whose tags do not match these values
```

### 使用 include，import 和 roles 提高 playbook 的复用性
如果playbook很大，task很多，或者某task要经常使用，可以考虑拆分位独立文件。

Ansible 2.4 起引入 include 和 import 的概念

* import 是静态导入，会在playbooks解析阶段将父和子task变量全部读取并加载
import_playbook, import_tasks 等
* include 是动态导入，执行play之前才加载变量
include_tasks, include_role 等
###### 导入 task
导入task可以使用 
import_tasks：
include_tasks 
```yaml
# playbook.yaml
# -- task/ntupdate.yml
---
     - hosts: centos7
       tasks:
        - import_tasks: task/ntupdate.yaml

# ntupdate.yml
---
     - name: execute ntpdate
       shell: /usr/sbin/ntpdate ntp1.aliyun.com
```

> 虽然仍然可以用 `include: task/ntupdate.yaml` 来直接导入 task 或 playbook 已经不推荐这么做，将来会被废弃

###### 导入 playbook
即加载一个或多个play
导入playbook可以使用  import_playbook
```yaml
---
  - name: first demo
    hosts: cloud
    vars:
      name: finley
    tasks:
      - name: execute date cmd
        shell: echo date
      - name: create hello
        shell: touch helloworld.txt
        args:
          creates: /tmp/hello.txt # 存在此文件就不执行 shell
      - include_tasks: tasks/task-hello.yml
  - import_playbook: playbooks/web.yml
```

### Role 
role 需要一个特定的目录结构，执行时会自动加载定义好的文件如vars_files,tasks,handles等
通过role进行内容分组方便与其他用户分享role。

roles 可以解决文件混乱和playbook臃肿的问题

示例项目结构
```yaml
site.yml
webservers.yml
fooservers.yml
roles/
   common/
     tasks/
     handlers/
     files/
     templates/
     vars/
     defaults/
     meta/
   webservers/
     tasks/
     defaults/
     meta/
```

* tasks 目录：存放task列表。若role要生效，此目录必须要有一个主task文件main.yml，在main.yml中可以使用 include包含同目录(即tasks)中的其他文件。 
* handlers 目录: 存放handlers的目录，若要生效，则文件必须名为main.yml文件。
* files目录：在task中执行copy或script模块时，如果使用的是相对路径，则会到此目录中寻找对应的文件。
* templates 目录：在task中执行template模块时，如果使用的是相对路径，则会到此目录中寻找对应的模块文件。
* vars目录：定义专属于该role的变量，如果要有var文件，则必须为main.yml文件。
* defaults 目录：定义角色默认变量，角色默认变量的优先级最低，会被任意其他层次的同名变量覆盖。如果要有var文件，则必须为main.yml文件。 
* meta 目录：用于定义角色依赖(dependencies)，如果要有角色依赖关系，则文件必须为main.yml。

### 参考
[https://docs.ansible.com/ansible/latest/user_guide/playbooks_reuse.html](https://docs.ansible.com/ansible/latest/user_guide/playbooks_reuse.html)
