通过ssh登录服务器，然后执行git pull, npm build等构建命令 
需要提前在github仓库的setting页面配置ssh host，password，user等环境变量

```yaml
# This is a basic workflow to help you get started with Actions

name: CI

# Controls when the action will run. Triggers the workflow on push or pull request
# events but only for the master branch
on:
  push:
    branches: [ master, develop ]
  pull_request:
    branches: [ master ]

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:

    # Runs a single command using the runners shell
    - name: Run a one-line script
      run: echo Hello, world!

    # Runs a set of commands using the runners shell
    - name: SSH Remote Commands
      uses: appleboy/ssh-action@v0.1.2
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.PRIVATE_KEY }}
        port: ${{ secrets.PORT }}
        script: cd /home/mafei20191103/IntoGolfV3 && git reset --hard origin/develop && git pull && npm run prod && php artisan migrate && composer install && php artisan telescope:prune && composer dump-autoload -o;

    # Slack Notification
    - name: Slack Notification
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        fields: repo,message,commit,author,action,eventName,ref,workflow,job,took # selectable (default: repo,message)
      env:
        GITHUB_TOKEN: ${{ secrets.PERSONAL_TOKEN }} # optional
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }} # required
      if: always() # Pick up events even if the job fails or is canceled.

```
