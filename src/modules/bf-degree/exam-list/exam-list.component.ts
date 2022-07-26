import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.scss']
})
export class ExamListComponent implements OnInit {

  constructor(private activRoute: ActivatedRoute) { }
  department: string;
  company: string;
  pCompany: string;

  /* 搜索 */
  inputValue:string = '';
  searchType:string = 'title'
  /* 表格 */
  tableLoading: boolean = false;
  filterData: any = [];
  /* 列 */
  listOfColumn: any = [
    {
      title: '考试名称',
      field: 'title',
      type: 'String',
      view: null,
      sortOrder: null,
      sortDirections: ['ascend', 'descend'],
      sortFn: (a, b) => a['title'] - b['title'],
    },
    {
      title: '分类',
      field: 'cate',
      type: 'String',
      view: null,
      sortOrder: null,
      sortDirections: ['ascend', 'descend'],
      sortFn: (a, b) => a['cate'] - b['cate'],
    },
    {
      title: '总分',
      field: 'score',
      type: 'Number',
      view: null,
      sortOrder: null,
      sortDirections: ['ascend', 'descend'],
      sortFn: (a, b) => a['score'] - b['score'],
    },
    {
      title: '开始时间',
      field: 'beginTime',
      type: 'Date',
      view: null,
      sortOrder: null,
      sortDirections: ['ascend', 'descend'],
      sortFn: (a, b) => a['beginTime'] - b['beginTime'],
    },
    {
      title: '结束时间',
      field: 'endTime',
      type: 'Date',
      view: null,
      sortOrder: null,
      sortDirections: ['ascend', 'descend'],
      sortFn: (a, b) => a['endTime'] - b['endTime'],
    },
    {
      title: '创建时间',
      field: 'createdAt',
      type: 'Date',
      view: null,
      sortOrder: null,
      sortDirections: ['ascend', 'descend'],
      sortFn: (a, b) => a['createdAt'] - b['createdAt'],
    },
    {
      title: '操作',
      field: null,
      type: null,
      view: null
    }
  ]
  pageSize: number = 10;
  pageIndex: number = 1;
  filterLen: number;

  /* 排序 */
  sort: object = {
    // "key":'title',
    // "value":"ascend"
  };
  ngOnInit(): void {
    this.activRoute.paramMap.subscribe(async (params) => {
      this.company = localStorage.getItem("company");
    })
  }

  /* ------------ 数据源 begin ----------------- */
  async getExams() {
    this.tableLoading = true;
    let queryExam = new Parse.Query("Exam");
    queryExam.descending("createdAt");
    queryExam.equalTo("company", this.company);
    queryExam.include("cates");
    queryExam.include("department");
    if (this.inputValue && this.inputValue.trim() != '') {
      queryExam.contains(this.searchType, this.inputValue);
    }
    let sort = this.sort;
    if (sort && sort['value'] == 'ascend') {
      queryExam.ascending(sort['key']);
    }
    if (sort && sort['value'] == 'descend') {
      queryExam.descending(sort['key']);
    }
    if (this.pageSize > 0) {
      queryExam.skip((this.pageIndex - 1) * this.pageSize);
    }
    console.log((this.pageIndex - 1) * this.pageSize);

    queryExam.limit(this.pageSize);
    let exams: any = await queryExam.find();
    console.log(exams);
    if (exams && exams.length) {
      this.filterData = exams;
    }
  }


  /* ------------ 数据源 end ----------------- */


  /* ------------ 数据排序 begin ----------------- */

  sortData(column, ev) {
    console.log(column, ev);
    this.sort['key'] = column.value;
    this.sort['value'] = ev;
    this.getExams()
  }

  /* ------------ 数据排序 end ----------------- */

  pageChange(e) {
    this.getExams()
  }

}
