import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from "@angular/core";

@Component({
  selector: "app-diy-intro",
  templateUrl: "./diy-intro.component.html",
  styleUrls: ["./diy-intro.component.scss"],
})
export class DiyIntroComponent implements OnInit {
  @Input("block") block: any;
  @Output("block") onBlockChange = new EventEmitter<any>();
  @Input("index") index: any;
  @Input("type") type: string;
  @Output() delete = new EventEmitter<any>();
  editType: string = "style";
  grid: any = []
  constructor(public cdRef: ChangeDetectorRef) { }

  addIcon() {
    let count = this.block.data.list.length
    let gridCount = this.grid.length
    if (gridCount > count) {
      this.block.data.list.push({
        image: this.grid[count].get('image'),
        name: this.grid[count].get('name'),
        desc: this.grid[count].get('desc'),
        url: this.grid[count].get('url')
      });
    } else {
      this.block.data.list.push({
        image: "http://cloud.file.futurestack.cn/i3cwsEHS4U/20200818/1j0c1g.jpg",
        name: "人物名称",
        desc: "这里是人物简介",
        url: ""
      })
    }
  }
  onDelete(i) {
    let list = this.block.data.list
    list.splice(i, 1)
    this.block.data.list = list
  }
  reset(field, type) {
    switch (type) {
      case "color":
        this.block.style[field] = "";
        break;
      case "margin":
        this.block.style[field] = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        };
        break;
      case "padding":
        this.block.style[field] = {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        };
        break;
      default:
        break;
    }
  }

  columnChange(e) {
    console.log(e);
  }

  deleteBlock() {
    this.delete.emit(this.index);
  }

  typeChange(e) {
    this.editType = e;
  }

  urlChange(e, index) {
    this.block.data.list[index].url = e
  }

  ngOnInit(): void { }
}
