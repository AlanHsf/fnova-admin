import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { analyzeIDCard as formatAge } from '../server/compute_age'
interface SearchItem {
  value: string,
  label: string
}
@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  displayedColumns: Array<SearchItem> = [
    {
      value: 'name',
      label: '姓名'
    },
    {
      value: 'idcard',
      label: '身份证号'
    },
    {
      value: 'title',
      label: '社区'
    }
  ]
  listOfData: object[] = [];
  searchInputText: string = ''
  isLoading: boolean = false
  hostUrl = "https://server.fmode.cn/api/"
  company: string = localStorage.getItem("company")
  current_column: string = this.displayedColumns[0].value
  PageSize: 20

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.searchInputChange('num', 'asc')
  }
  searchInputChange(value?: string, sort?: string) {
    let that = this
    this.isLoading = true
    let sql = `select pf."objectId" as id ,pf.remark,pf.name,pf.idcard,pf.mobile,pf.title,pf.address, pf.bonus,pf.desc,
      coalesce(num."count",0) num,
      coalesce((select sum(fd.price) from "FoodOrder" as fd where fd.profile = pf."objectId" and fd."isPay" is not null) , 0)as price,
      coalesce((pf.bonus - (select sum(fd.price) from "FoodOrder" as fd where fd.profile = pf."objectId" and fd."isPay" is not null)), bonus) as balance
      from "Profile" as pf
      left join (select profile,sum("order"."val") as "count" from 
      (select fd."objectId", fd."profile",key, sum(value::numeric) val from "FoodOrder" as "fd",
      jsonb_each_text("specMap")
        group by fd."objectId" , key
        ) as "order"
        group by "order"."profile") as num 
        on pf."objectId" = num."profile"
      where pf."company" = '${this.company}'
      and pf."identyType" = 'benefit'
      and pf.bonus is not null
      ${this.current_column == 'name' ? "and pf.name like '%" + this.searchInputText + "%'" : ''}
      ${this.current_column == 'idcard' ? "and pf.idcard like '%" + this.searchInputText + "%'" : ''}
      ${this.current_column == 'title' ? "and pf.title like '%" + this.searchInputText + "%'" : ''}
      order by ${value ? value : 'num'} ${sort ? sort : 'desc'} 
    `
    console.log(sql);

    that.http.post(this.hostUrl + 'novaql/select', { sql })
      .subscribe(async (res) => {
        console.log(res)
        let result: any = res
        let data = result.data
        data.reduce((arr, item) => {
          if (item.idcard) {
            item.age = formatAge(item.idcard)
          }
          arr.push(item)
          return arr
        }, [])
        that.listOfData = data
        that.isLoading = false
      })
  }

  searchColNameChange(e) {
    console.log(e);
    this.current_column = e.value
  }

  onSelect() {
    console.log(this.searchInputText);
    this.searchInputChange()
  }

  export() {
    let data: any = this.listOfData
    let table = `<table border="1px" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th>姓名</th>
            <th>身份证号</th>
            <th>年龄</th>
            <th>社区</th>
            <th>地址</th>
            <th>联系电话</th>
            <th>剩余公益金</th>
            <th>已补公益金</th>
            <th>已配送次数</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
        `;
    // table += '<thead>';
    // table += '<th>姓名</th>';
    // table += '<th>工号</th>';
    // table += '<th>部门</th>';
    // table += '<th>分数</th>';
    // table += '</thead>';
    // table += '<tbody>';
    let _body = "";
    for (var row = 0; row < this.listOfData.length; row++) {
      _body += '<tr>';
      _body += '<td>';
      _body += `${data[row].name}`;
      _body += '</td>';

      _body += '<td>';
      _body += ` &nbsp;${data[row].idcard}`;
      _body += '</td>';

      _body += '<td>';
      _body += `${data[row].age}`;
      _body += '</td>';

      _body += '<td>';
      _body += `${data[row].title}`;
      _body += '</td>';

      _body += '<td>';
      _body += `${data[row].address}`;
      _body += '</td>';

      _body += '<td>';
      _body += `${data[row].mobile}`;
      _body += '</td>';

      _body += '<td>';
      _body += `${data[row].balance}`;
      _body += '</td>';

      _body += '<td>';
      _body += `${data[row].price}`;
      _body += '</td>';

      _body += '<td>';
      _body += `${data[row].num}`;
      _body += '</td>';

      _body += '<td>';
      _body += `${data[row].desc ? data[row].desc : '无'}`;
      _body += '</td>';
      _body += '</tr>';
    }
    table += _body;
    table += '</tbody>';
    table += '</table>';
    let title = '助餐记录'
    this.excel(table, `${title}.xls`);
  }
  excel(data, filename) {
    let html =
      "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
    html += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    html += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
    html += '; charset=UTF-8">';
    html += "<head>";
    html += "</head>";
    html += "<body>";
    html += data
    html += "</body>";
    html += "</html>";
    let uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(html);
    // window.open(uri)
    let link = document.createElement("a");
    link.href = uri;
    link.download = `${filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  SortOrderChange(value, e) {
    console.log(value, e);
    let switchFn = {
      'ascend': 'asc',
      'descend': 'desc',
    }
    let sort = switchFn[e]
    if (sort) {
      this.searchInputChange(value, sort)
    }
  }
}
