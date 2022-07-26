import * as Parse from "parse";

import {Component, Injectable, OnInit, Input,ViewChild} from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser"

import { ChangeDetectorRef } from "@angular/core"
import { EditObjectComponent } from "../../common/edit-object/edit-object.component";
import { ActivatedRoute, Router } from "@angular/router";
import { EditNotespaceComponent } from "../../common/edit-notespace/edit-notespace.component";

@Component({
  selector: 'app-note-edit',
  templateUrl: './note-edit.component.html',
  styleUrls: ['./note-edit.component.scss'],
})
export class NoteEditComponent implements OnInit {
  @Input("noteSpace") noteSpace:any;
  @ViewChild(EditObjectComponent,{static:true}) editObject: EditObjectComponent;
  @ViewChild(EditNotespaceComponent,{static:true}) editNotespace: EditNotespaceComponent;


  ngOnInit() {
    this.route.paramMap.subscribe(async params => {
      let spaceId = params.get("id");
      if(spaceId){
        let query = new Parse.Query("NoteSpace");
        this.noteSpace = await query.get(spaceId);
        this.editNotespace.setNoteSpace(this.noteSpace);
      }
    })
    
  }
 
  constructor(
    private cdRef:ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    ) {
  }

}
