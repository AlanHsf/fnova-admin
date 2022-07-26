import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as Parse from "parse";
/*   sql查询下  Pointer字段只有id，需要修改结构为 {id:'',name: ''} 后传入 */
@Component({
  selector: 'ncnqx-edit-test',
  templateUrl: './edit-test.component.html',
  styleUrls: ['./edit-test.component.scss']
})
export class EditTestComponent implements OnInit {
  @Input() fields: any[];
  @Input() object: any;
  @Input() route: any;
  company?: string;
  constructor(private cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.company = localStorage.getItem('company')

  }

  ngModelChange(e) {
    // console.log(this.object)
  }



  // @editForm when type == Pointer
  selectPointerList: Array<any> = []; // 用于Pointer选项暂存
  selectPointerMap = {}; // 用于Pointer选项暂存，key为<objectId>
  async searchPointer(event) {
    let { ev, field } = event;
    console.log(ev, field, this.object);
    let className = field.targetClass;
    let key = field.key;
    let searchString;
    if (ev) {
      searchString = String(ev);
    }
    let query = new Parse.Query(className);
    query.equalTo("company", this.company)

    // 当该pointer有值时，搜索过滤该值
    if (this.object[key]?.objectId) {
      console.log(this.object[key].objectId);

      query.notEqualTo(
        "objectId",
        this.object[key].objectId
      );
    }
    // 各类对象手动输入搜索条件
    if (searchString) {
      query.contains("name", searchString);

    }
    // 检测路由限制条件
    // if (field.filters) {
    //   field.filters.forEach((filter) => {
    //     switch (filter.fun) {
    //       case "pobject":
    //         if (this.object[filter.value]) {
    //           query.equalTo(filter.targetField, this.object[filter.value].id);
    //         }
    //         break;
    //     }
    //   });
    // }
    query.limit(20);
    let data = await query.find();
    console.log(data);

    if (data && data.length > 0) {
      this.selectPointerList = data
      this.selectPointerMap[field.key] = data
      this.cdRef.detectChanges();
    } else {
      this.selectPointerList = data
      this.selectPointerMap[field.key] = data
      this.cdRef.detectChanges();
    }
  }
  pointerChange(event) {
    console.log(event);
    let { ev, key } = event;
    this.object[key] = ev.toJSON();
    console.log(ev, this.object['department']);

  }
}
