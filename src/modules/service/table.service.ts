import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  constructor() { }
    // 删除
  confirm(e,d){
     
     return  d.filter(d => d.id !== e.id);   //e=选择的条目 d=dataset 
  }
  // 全选
  

}
