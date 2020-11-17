1 生成公私钥对 

`ssh-keygen -t rsa -b 4096 -C "yourName@companyName.com"`

默认会在当前用户目录创建.ssh目录并生成id_ras私钥和id_ras.pub公钥
为了无密码登录服务器，需要将公钥上传到服务器的`authorized_keys`的文件中
就是说我用ssh方式敲你的门，我提供私钥，你提供公钥，算法匹配成功，就让我进去。

2. 添加公钥到服务器 

端口22不用特别指定

`ssh-copy-id -i ~/.ssh/id_rsa.pub 用户名@对方机器IP`

指定端口

`ssh-copy-id -i ~/.ssh/id_rsa.pub -p 5722 用户名@对方机器IP`
