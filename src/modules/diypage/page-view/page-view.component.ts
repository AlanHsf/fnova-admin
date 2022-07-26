import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import * as Parse from "parse";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "nova-page-view",
  templateUrl: "./page-view.component.html",
  styleUrls: ["./page-view.component.scss"]
})
export class PageViewComponent implements OnInit {
  @Input("blocks") blocks: Array<any>;
  @Output("blocks") onBlocksChange = new EventEmitter<any>();
  @Input("titleBar") titleBar: any;
  @Input("isEditable") isEditable: Boolean = false;
  @Output("selected") onSelected = new EventEmitter<any>();
  selected(index, name) {
    if (this.isEditable == false) {
      return;
    }
    console.log(index, name)
    this.onSelected.emit({ i: index, name: name });
  }
  diypage: any;
  currentIndex = 0; //当前选中的下标志
  filterDataMap = {};
  constructor(
    public activRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    public router: Router
  ) {}
  defaultImg: any =
    "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/1j0c1g.jpg";

  ngOnInit() {}
  refreshPage() {
    this.activRoute.paramMap.subscribe(async paramMap => {
      if (paramMap.get("PclassName") == "CompanyCard") {
        let query = new Parse.Query("CompanyCard");
        this.diypage = await query.get(paramMap.get("PobjectId"));
        if (this.diypage) {
          this.blocks = this.diypage.get("blocks") || [];
          this.titleBar = this.diypage.get("titleBar") || {};
        }
      }
      if (paramMap.get("PclassName") == "DiyPage") {
        let query = new Parse.Query("DiyPage");
        this.diypage = await query.get(paramMap.get("PobjectId"));
        if (this.diypage) {
          this.blocks = this.diypage.get("blocks") || [];
          this.titleBar = this.diypage.get("titleBar") || {};
        }
      }
      console.log(this.blocks);
      this.blocks.forEach((block, index) => {
        if (block.type == "article") {
          // block = {
          //   type: "article",
          //   data: [],
          //   srctype: "filter",
          //   className: "Article",
          //   filters: [
          //     // {type:"equalTo",value:{key:"category",value:{__type:"Pointer",className:"Category",objectId:""}}},
          //     { type: "descending", value: "updatedAt" },
          //     { type: "limit", value: 5 },
          //     {
          //       type: "equalTo",
          //       value: {
          //             key : "company",
          //             value: {
          //                     __type: "Pointer",
          //                     className: "Company",
          //                     objectId: localStorage.getItem("company"),
          //             }
          //       },
          //     },
          //   ],
          // };

          // TODOLIST：写好自定义文章规则后，这段代码可以删除，直接读取data作为自定义文章
          this.blocks[index].data = [];
          if (!block.className) {
            block.srctype = "filter";
            block.className = "Article";
          }
          if (!block.filters) {
            block.filters = [
              { type: "descending", value: "updatedAt" },
              { type: "limit", value: 5 }
            ];
          }

          console.log(block);
          if (block.srctype && block.srctype == "filter") {
            if (block.filters) {
              console.log(block.className);
              let queryA = new Parse.Query(block.className);
              queryA.equalTo("company", this.diypage.get("company"));
              block.filters.forEach(filter => {
                switch (filter.type) {
                  case "equalTo":
                    queryA.equalTo(filter.value.key, filter.value.value);
                    break;
                  case "limit":
                    queryA.limit(filter.value);
                    break;
                  case "descending":
                    queryA.descending(filter.value);
                    break;
                  case "ascending":
                    queryA.ascending(filter.value);
                    break;
                  default:
                    break;
                }
                queryA[filter.type] = filter.value;
              });
              queryA.find().then(data => {
                // this.filterDataMap[index] = data&&data.map(item=>item.toJSON())
                this.blocks[index].data =
                  (data && data.map(item => item.toJSON())) || [];
                console.log(111111111);
                console.log(this.blocks);
                // this.cdRef.detectChanges();
              });
            }
          }
        }
      }); // End of forEach
    });
  }
  drop(event: CdkDragDrop<string[]>) {
    if (this.isEditable == false) {
      return;
    }
    console.log(event);
    moveItemInArray(this.blocks, event.previousIndex, event.currentIndex);
    this.currentIndex = event.currentIndex;
    console.log(this.blocks)
    this.onBlocksChange.emit(this.blocks);
  }
}
