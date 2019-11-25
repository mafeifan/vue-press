module.exports = {
  title: 'mafeifan 的技术博客',
  description: '生命在于试错和积累',
  port: '8099',
  markdown: {
    lineNumbers: true // 代码块显示行号
  },
  themeConfig: {
    lastUpdated: '上次更新',
    activeHeaderLinks: true,
    editLinks: true,
    docsDir: 'docs',
    editLinkText: '在 GitHub 上编辑此页',
    // sidebar: 'auto',
    nav: [
      {
        text: 'DevOps',
        items: [
          {text: 'Jenkins', link: '/Jenkins/Jenkins2-学习系列1----使用Docker方式安装最新版Jenkins'},
          {text: 'Docker', link: '/Docker/Docker-学习系列1-使用-Docker-快速实现多版本PHP切换'},
          {text: 'Ansible', link: '/Ansible/Ansible-2----1-介绍与使用场景'},
          {text: 'Linux', link: '/Linux/SSH--技巧'}
        ]
      },
      {
        text: 'Frontend',
        items: [
          {text: 'Html & CSS', link: '/HTML5/'},
          // {text: 'React', link: '/React/'}
        ]
      },
      {
        text: 'Backend',
        items: [
          {text: 'Laravel', link: '/Laravel/Model/Laravel-model-tips/'},
        ]
      },
      {
        text: 'WOW',
        items: [
          {text: '游戏', link: '/_WOW/'},
          {text: '截图', link: '/_WOW/screenshots/'},
          {text: '德鲁伊', link: '/_WOW/Druid/'},
        ],
        link: '/_WOW/'
      },
      {
        text: 'Demo',
        link: '/_DEMO/'
      },
      {text: 'Home', link: '/'},

    ],
    sidebar: [
      {
        title: 'Laravel 6',
        collapsable: true,
        children: [
          ['Laravel/Model/Laravel-Fix-non-object.md', 'Model/避免 Trying to get property of non-object 错误的几种方法'],
          ['Laravel/Model/Laravel-useful-attribute.md', 'Model/模型常用属性'],
          ['Laravel/Model/Laravel-model-tips.md', 'Model/使用技巧'],
          ['Laravel/Laravel-echo构建实时应用.md', 'Laravel-echo构建实时应用'],
          ['Laravel/Doc/Laravel-事件的使用.md', 'Laravel-事件的使用'],
          ['Laravel/Doc/Laravel-使用简单的方法跟踪用户是否在线.md', 'Laravel-使用简单的方法跟踪用户是否在线'],
          ['Laravel/Doc/Laravel-实现多语言切换.md', 'Laravel-实现多语言切换'],
        ]
      },
      {
        title: 'Docker 系统',
        collapsable: true,
        children: [
          ['Docker/Dockerfile-中的-COPY-与-ADD-命令', 'Dockerfile 中的 COPY 与 ADD 命令'],
          ['Docker/Docker-学习系列1-使用-Docker-快速实现多版本PHP切换', '1 使用-Docker-快速实现多版本PHP切换'],
          ['Docker/Docker-学习系列2--保存对容器的修改', '2 保存对容器的修改'],
          ['Docker/Docker-学习系列3--提交并分享自己的镜像', '3 提交并分享自己的镜像'],
          ['Docker/Docker-学习系列4---简单总结-docker-curriculum', '4 简单总结 docker-curriculum'],
          ['Docker/Docker-学习系列5--nginx-容器', '5 Nginx-容器'],
          ['Docker/Docker-学习系列6--Docker-Compose-中的环境变量使用注意事项', '6 Docker Compose 中的环境变量使用注意事项'],
          ['Docker/Docker-学习系列7-容器化Node项目', '7 容器化Node项目'],
          ['Docker/Docker-学习系列8-结合daocloud实现持续集成', '8 结合daocloud实现持续集成'],
          ['Docker/Docker-学习系列9-Docker的技术原理介绍', '9 Docker的技术原理介绍'],
          ['Docker/Docker-学习系列10-开源图形化管理系统', '10 开源图形化管理系统'],
          ['Docker/Docker-学习系列11-多阶段镜像构建', '11 多阶段镜像构建'],
          ['Docker/Docker-学习系列12-轻松实现-MySQL-主从同步', '12 轻松实现MySQL主从同步'],
          ['Docker/Docker-学习系列13-实现-基于pxc-的mysql-多节点主主同步', '13 实现基于pxc的mysql多节点主主同步'],
          ['Docker/Docker-学习系列14-使用haproxy实现mysql集群的负载均衡', '14 使用haproxy实现mysql集群的负载均衡'],
          ['Docker/Docker-学习系列15-Docker使用xdebug配合PHPStorm调试PHP', '15 Docker使用xdebug配合PHPStorm调试PHP'],
          ['Docker/Docker-学习系列16-使用过程的一些经验总结', '16 使用过程的一些经验总结'],
          ['Docker/Docker-学习系列17-镜像和容器的导入导出', '17 镜像和容器的导入导出'],
          ['Docker/Docker-学习系列18-关于PHP5-6', '18 关于PHP5.6'],
          ['Docker/Docker-学习系列19-容器化Angular项目', '19 容器化Angular项目'],
          ['Docker/Docker-学习系列20-工具推荐，dive--分析镜像层的工具', '20 工具推荐，dive--分析镜像层的工具'],
          ['Docker/Docker-学习系列21-配置远程访问Docker', '22 配置远程访问Docker'],
          ['Docker/Docker-及-docker-compose-使用总结', 'docker 及 docker-compose 使用总结'],
          ['Docker/Docker-学习资源', 'Docker 一些相关资源'],
          // ['Docker/数据卷'],
        ]
      },
      {
        title: 'Jenkins 系列',
        collapsable: true,
        children: [
          ['Jenkins/Jenkins2-学习系列1----使用Docker方式安装最新版Jenkins', '1 使用Docker方式安装最新版Jenkins'],
          ['Jenkins/Jenkins2-学习系列2----Pipeline-介绍及基础', '2 Pipeline 介绍及基础'],
          ['Jenkins/Jenkins2-学习系列3----Groovy语法介绍', '3 Groovy语法介绍'],
          ['Jenkins/Jenkins2-学习系列4----Pipeline-post-部分', '4 Pipeline post 部分'],
          ['Jenkins/Jenkins2-学习系列5----Pipeline-中的指令', '5 Pipeline 中的指令'],
          ['Jenkins/Jenkins2-学习系列6----环境变量', '6 环境变量'],
          ['Jenkins/Jenkins2-学习系列7----构建工具', '7 构建工具'],
          ['Jenkins/Jenkins2-学习系列8----实战-使用-Generic-Webhook-Trigger-插件自动构建个人博客', '8 实战: 使用 Generic Webhook Trigger 插件自动构建个人博客'],
          ['Jenkins/Jenkins2-学习系列9----Generic-Webhook-Trigger-插件详讲', '9 Generic-Webhook-Trigger 插件详讲'],
          ['Jenkins/Jenkins2-学习系列10----多分支pipeline构建', '10 多分支pipeline构建'],
          ['Jenkins/Jenkins2-学习系列11----参数化构建', '11 参数化构建'],
          ['Jenkins/Jenkins2-学习系列12----创建和使用共享库', '12 创建和使用共享库'],
          ['Jenkins/Jenkins2-学习系列13----邮件和Slack通知', '13 邮件和Slack通知'],
          ['Jenkins/Jenkins2-学习系列14----使用-Config-File-Provider-添加邮件模板', '14 使用 Config-File-Provider 添加邮件模板'],
          ['Jenkins/Jenkins2-学习系列15----声明式Pipeline补充', '15 声明式Pipeline补充'],
          ['Jenkins/Jenkins2-学习系列16----Jenkins权限控制插件（Role-based-Authorization-Strategy）', '16 Jenkins权限控制插件(Role-based-Authorization-Strategy)'],
          ['Jenkins/Jenkins2-学习系列17----制品管理', '17 制品管理'],
          ['Jenkins/Jenkins2-学习系列18----凭证管理', '18 凭证管理'],
          ['Jenkins/Jenkins2-学习系列19----使用-Script-Console-批量修改Jenkins任务', '19 使用 Script-Console 批量修改Jenkins任务'],
          ['Jenkins/Jenkins2-学习系列20----通过SSH方法添加Slave节点', '20 通过SSH方法添加Slave节点'],
          ['Jenkins/Jenkins2-学习系列21----通过JNLP协议添加Slave节点', '21 通过JNLP协议添加Slave节点'],
          ['Jenkins/Jenkins2-学习系列22----pipeline-中-agent-使用介绍', '22 pipeline 中 agent 使用介绍'],
          ['Jenkins/Jenkins2-学习系列23----Jenkins-定期备份', '23 Jenkins 定期备份'],
          ['Jenkins/Jenkins2-学习系列24----Electron-应用的流水线设计', '24 Electron-应用的流水线设计'],
          ['Jenkins/Jenkins2-学习系列25----添加-Docker-Cloud-并构建镜像', '25 添加 Docker Cloud 并构建镜像'],
          ['Jenkins/Jenkins2-学习系列26----使用阿里云容器镜像服务', '26 使用阿里云容器镜像服务'],
          ['Jenkins/Jenkins2-学习系列27----pipeline-中-Docker-操作', '27 pipeline 中 Docker 操作'],
          ['Jenkins/Jenkins2-学习系列28----优化多分支流水线任务', '28 优化多分支流水线任务'],
          ['Jenkins/Jenkins-sh-step', 'Jenkins内置sh详讲'],
        ]
      },
      {
        title: 'Ansible',
        collapsable: true,
        children: [
          ['Ansible/Ansible-2----1-介绍与使用场景', '1 介绍与使用场景'],
          ['Ansible/Ansible-2----2-安装与配置', '2 安装与配置'],
          ['Ansible/Ansible-2----3-配置文件', '3 配置文件'],
          ['Ansible/Ansible-2----4-常用模块及常用API', '4 常用模块及常用API'],
          ['Ansible/Ansible-2----5-playbook-语法', '5 playbook 语法'],
          ['Ansible/Ansible-2----6-playbook-管理', '6 playbook 管理'],
        ]
      },
      {
        title: 'Linux',
        collapsable: true,
        children: [
          ['Linux/SSH--技巧', 'SSH--技巧']
        ]
      },
      {
        title: '前端',
        collapsable: true,
        children: [
          ['HTML5/CSS3实现未知宽高元素的垂直居中和水平居中', 'css/css3实现未知宽高元素的垂直居中和水平居中'],
          ['HTML5/巧解checkbox未选中不提交数据', '巧解checkbox未选中不提交数据'],
        ]
      },
    ]
  }
};
