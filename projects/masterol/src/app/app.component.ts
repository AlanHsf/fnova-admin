import { Component, NgModule } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'masterol';

  ngOnInit() {
    let departmentId = localStorage.getItem('departmentId')
    var test = window.location.pathname;
    console.log(test);
    console.log(departmentId);
    
    if (departmentId == "bpbCdCQpJl" || test.search("xbsfdx") != -1) {
      document.title = '西北师范大学大数据技术工程师学习中心';
    } else {
      document.title = '硕士在线100分课堂';
    }
  }
}
