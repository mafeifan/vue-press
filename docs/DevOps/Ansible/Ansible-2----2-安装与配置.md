ansible 的安装有很多方式，这里以Mac为例
1. 安装 `brew install ansible`
他会顺便安装依赖的python3
打 `ansible --version`
```
➜ ansible --version
ansible 2.7.1
  config file = /Users/mafei/.ansible.cfg
  configured module search path = ['/Users/mafei/.ansible/plugins/modules', '/usr/share/ansible/plugins/modules']
  ansible python module location = /usr/local/Cellar/ansible/2.7.1/libexec/lib/python3.7/site-packages/ansible
  executable location = /usr/local/bin/ansible
  python version = 3.7.1 (default, Nov  6 2018, 18:46:03) [Clang 10.0.0 (clang-1000.11.45.5)]
```
2. 创建目录和配置文件
/etc/ansible/host
3. 添加要连接的 host 主机节点信息，内容如下：
[主机组名称]
ip:端口 ansible_user=登录的用户名
```
[cloud]
140.122.182.183:1234 ansible_user=ubuntu
```
4. `ansible <host-pattern> [options]` 为一组主机运行单一task
下面的命令检查指定主机的连通性
`ansible all -m ping -vvv`
看能否访问到所有主机
也可以用指定主机 `ansible cloud -m ping -vvv`

-m 等于 --module-name
ping 就是模块名

> 可以使用 `ansible-doc <模块名>` 查看模块的帮助信息。 如 `ansible-doc ping` 非常方便。

使用ping模块测试被管节点。能成功，说明ansible能控制该节点。

> 如果要指定非root用户运行ansible命令，则加上"--sudo"或"-s"来提升为sudo_user配置项所指定用户的权限。`ansible webservers -m ping -u ubuntu --sudo` ；或者使用 become 提升权限 `ansible webservers -m ping -b --become-user=root --become-method=sudo`

5. 我们更新下host文件，添加一组主机
```
[cloud]
140.122.182.183:1234 ansible_user=ubuntu
[fxa]
145.130.287.79:22 ansible_user=devuser
145.130.287.79:25 ansible_user=devuser
145.130.287.79:31 ansible_user=devuser
```
也可以用下面的写法
```
[cloud]
40.122.182.183  ansible_port=1234 ansible_user=ubuntu

[merch]
mer22 ansible_host=145.130.287.79 ansible_port=22 ansible_user=devuser
mer25 ansible_host=145.130.287.79 ansible_port=25 ansible_user=devuser
mer31 ansible_host=145.130.287.79 ansible_port=31 ansible_user=devuser

[fuelx]
135.104.35.167 ansible_port=22 ansible_user=maf ansible_private_key_file=~/.ssh/github_id_rsa
```
然后针对某主机进行操作
```
➜ ansible mer31 -a uptime
mer31 | CHANGED | rc=0 >>
 11:14:38 up 485 days, 15:52,  2 users,  load average: 1.57, 0.58, 0.28
```
