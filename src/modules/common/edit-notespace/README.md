# 文档空间的模块组件 EditNoteSpace
功能介绍：在任意angular环境，可以快速打开协作文档空间的组件

# 引用使用
## 依赖引入

``` js
import { EditNotespaceComponent } from "../../common/edit-notespace/edit-notespace.component";
```

## 绑定页面

### 在html中对应区域填写标签

``` html
<!-- Modal Edit NoteSpace: 对象编辑组件 -->
    <ng-container *ngIf="noteSpace">
    <app-edit-notespace [noteSpace]="noteSpace"></app-edit-notespace>
    <!-- End of Modal Edit NoteSpace -->
    </ng-container>
<!-- Modal Edit NoteSpace: 对象编辑组件 -->
```
### 通过ViewChild控制

``` js
@ViewChild(EditNotespaceComponent,{static:true}) editNotespace: EditNotespaceComponent;
```


# 核心方法
## setNoteSpace（笔记空间初始化）
```
this.editNotespace.setNoteSpace(this.noteSpace);

```