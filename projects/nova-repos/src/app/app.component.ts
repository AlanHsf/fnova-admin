import { Component,OnInit } from '@angular/core';

import { HttpClient } from "@angular/common/http";
import { Router,ActivatedRoute, RouterModule } from "@angular/router";
import { L } from 'src/typing';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'nova-repos';
  novaHost = "https://server.fmode.cn/api/";
  publicHost = "https://repos.fmode.cn/"

  dirList = []
  fileList = []
  dirPrefix = ""
  constructor(private router: Router,private actRoute:ActivatedRoute, private http: HttpClient){

  }

  ngOnInit():void{
    let path;
    if(location.pathname&&location.pathname!="/"){ 
      path = location.pathname.slice(1,);
      if(path.endsWith("/")){
      }else{
        path += "/"
      }
    }
    console.log(path)
    console.log(location.pathname)
    this.listFiles(path);
  }

  fixName(name:string){
    return name.replace(this.dirPrefix,"")
  }

  goDirectory(dir?){
    dir = dir || ""
    this.router.navigate([`/${dir}`]);
    this.listFiles(dir)
  }
  downloadFile(file){
    let url = `${this.publicHost}${file.key}`
    window.open(url,"_blank")
  }

  async listFiles(dir?){
    if(dir){
      this.dirPrefix = dir
    }else{
      this.dirPrefix = ""
    }
    let result:any = await this.getList();
    this.dirList = result.data && result.data.commonPrefixes

    // 屏蔽根目录显示repos静态页面
    if(!this.dirPrefix && this.dirPrefix!="" && this.dirPrefix!="/"){
      this.fileList = result.data && result.data.items
    }else{
      this.fileList = []
    }
  }

  getList(){
    let bucket = "nova-repos"
    let delimiter = "delimiter"
    let prefix = this.dirPrefix || ""
    return new Promise((resolve,reject)=>{
      this.http.get(this.novaHost+`storage/list?limit=1000&bucket=${bucket}&delimiter=${delimiter}&prefix=${prefix}`).subscribe(data=>{
        resolve(data)  
      })
    })
  }
}
