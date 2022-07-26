import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild } from '@angular/core';
// 文件管理器，函数调用
import { EditFileManagerComponent } from "../../common/edit-filemanager/edit-filemanager.component";

@Component({
  selector: 'app-diy-richtext',
  templateUrl: './diy-richtext.component.html',
  styleUrls: ['./diy-richtext.component.scss']
})
export class DiyRichtextComponent implements OnInit {

  @ViewChild(EditFileManagerComponent, { static: false })
  editFilemanager: EditFileManagerComponent;
  @Input("block") block: any;
  @Output("block") onBlockChange = new EventEmitter<any>();
  @Input("index") index: any;
  @Input("type") type: string;
  @Output() delete = new EventEmitter<any>();
  editType: string = "style";

  constructor(public cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  deleteBlock() {
    this.delete.emit(this.index);
  }
  typeChange(e) {
    this.editType = e;
  }

  getEditInitOptions() {
    let that = this;

    return {
      custom_elements: "style,html,head,body,title,meta,script",//允许自定义标签存在
      plugins:
        "code link lists advlist preview  table image media  imagetools ' ",
      toolbar:
        "fullscreen preview | undo redo | bold italic | bullist numlist outdent indent | table | image media | code '",
      quickbars_image_toolbar:
        "alignleft aligncenter alignright | editimage imageoptions",
      imagetools_toolbar:
        "rotateleft rotateright | flipv fliph | editimage imageoptions",
      quickbars_selection_toolbar:
        "bold italic | formatselect | quicklink blockquote",
      language: "zh_CN",
      language_url: "/assets/js/tinymce/langs/zh_CN.js",
      menubar: true,
      statusbar: true,
      base_url: "/assets/js/tinymce/",
      file_picker_types: "file image media",
      file_picker_callback: (cb, value, meta) => {
        // let dialogEl:any = document.getElementsByClassName("tox-tinymce-aux")[0]
        // dialogEl.style.zIndex = 999;
        let options = {
          mime: "image",
          multi: false,
        };
        if (meta.filetype == "media") {
          options.mime = "video";
        }
        if (meta.filetype == "file") {
          options.mime = undefined;
        }

        that.editFilemanager.showFileManager(options, (file, files) => {
          let dialogEl2: any =
            document.getElementsByClassName("tox-tinymce-aux")[0];
          dialogEl2.style.zIndex = 1300;
          if (file && file.id) {
            // Provide file and text for the link dialog
            if (meta.filetype == "file") {
              cb(file.get("url"), { text: file.get("name") });
            }

            // Provide image and alt text for the image dialog
            if (meta.filetype == "image") {
              cb(file.get("url"), {
                title: file.get("name"),
                alt: file.get("name"),
              });
            }

            // Provide alternative source and posted for the media dialog
            if (meta.filetype == "media") {
              // callback('movie.mp4', {source2: 'alt.ogg', poster: 'image.jpg'});
              cb(file.get("url"), {
                title: file.get("name"),
                alt: file.get("name"),
              });
            }
          }
        });
      },
    };
  }

}
