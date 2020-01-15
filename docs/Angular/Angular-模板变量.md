https://angular.cn/guide/template-syntax#expression-context


1. 模板变量可以循环


```
  <div class="device-wrapper">
    <div
      class="device-item-wrapper"
      *ngFor="let device of listService.activeNode.items_mapping; let i = index"
      [ngStyle]="{ 'top.%': device.y * 100, 'left.%': device.x * 100 }"
    >
      <img
        [src]="'https://s2.ax1x.com/2019/12/23/lpUFje.png'"
        alt=""
        class="device"
        nz-tooltip
        [nzTooltipTitle]="titleTemplate"
      />
      <ng-template #titleTemplate>
        <p>{{ device.info.name }}</p>
        <p>{{ device.info.category }}</p>
      </ng-template>
    </div>
  </div>
```

