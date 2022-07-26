import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'filter-tools',
  templateUrl: './filter-tools.component.html',
  styleUrls: ['./filter-tools.component.scss']
})
export class FilterToolsComponent implements OnInit {
  @Input() filterConfig: Array<Array<any>> = [] //  筛选组
  @Output() filterChange = new EventEmitter() //  筛选组发生改变的回调
  constructor(
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
  }
  resetMap: any = {}
  resetDatePickerMap: any = {}  //  日报表,月报表 切换 更改选择器样式
  modelChange(field) {
    let form: any = {}
    form.currentChange = field
    this.filterConfig.forEach((block, blockI) => {
      block.forEach((item, itemI) => {
        let key = item.field  //  字段名
        let value = item.value  //  字段值

        if (value instanceof Date) {
          let type = this.filterConfig[blockI][itemI].type
          //  处理时间格式
          if (['dateEnd', 'settleEnd'].includes(key)) {
            if (type === 'date') {
              value = this.datePipe.transform(value, "yyyy-MM-dd 23:59:59")
            } else if (type === 'month') {
              const timestamp = new Date(value.getFullYear(), value.getMonth() + 1).getTime() - 1
              value = this.datePipe.transform(timestamp, "yyyy-MM-dd 23:59:59")
            }
          } else if (['dateBegin', 'settleBegin'].includes(key)) {
            if (type === 'date') {
              value = this.datePipe.transform(value, "yyyy-MM-dd 00:00:00")
            } else if (type === 'month') {
              const timestamp = new Date(value.getFullYear(), value.getMonth()).getTime()
              value = this.datePipe.transform(timestamp, "yyyy-MM-dd 00:00:00")
            }
          }
        }

        form[key] = value
        if (this.resetMap[key]) {
          this.filterConfig[blockI][itemI].value = 0
          form[key] = 0
          delete this.resetMap[key]
        }
      })
    })
    // if (form.dateBegin && !form.dateEnd) {
    //   if (form.dateOrMonth === 'month') {
    //     let now = new Date(form.dateBegin)
    //     let timestamp = new Date(now.getFullYear(), now.getMonth() + 1).getTime() - 1
    //     form.dateEnd = this.datePipe.transform(timestamp, "yyyy-MM-dd 23:59:59")
    //   } else {
    //     form.dateEnd = this.datePipe.transform(form.dateBegin, "yyyy-MM-dd 23:59:59")
    //   }
    // }
    this.filterChange.emit(form)
    this.resetMap = {}
  }
  panel: any =
    {
      active: false,
      disabled: true,
      name: '更多选项',
      icon: 'double-right',
      customStyle: {
        // background: '#fff',
        'border-radius': '4px',
        'margin-bottom': '24px',
        border: '0px'
      }
    }

}
