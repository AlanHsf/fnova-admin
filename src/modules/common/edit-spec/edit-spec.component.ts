import { Input, Output, EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from "ng-zorro-antd/notification";
@Component({
    selector: 'app-edit-spec',
    templateUrl: './edit-spec.component.html',
    styleUrls: ['./edit-spec.component.scss']
})
export class EditSpecComponent implements OnInit {
    @Input('specMap') specMap:any = {};
    @Output('specMapChange') onspecMapChange = new EventEmitter<any>();
    constructor(private notification: NzNotificationService,) { }
    
    ngOnInit() {
        if(!this.specMap) {
            this.specMap = {}
        }
        
    }

    changeSpecList(e) {
        console.log(e)
        if (e && e.length > 0) {
            e.forEach(item => {
                if(!this.specMap[item]) {
                    this.specMap[item] = [{
                        value: '',
                        price: 0,
                        vipPrice: 0
                    }]
                }
            });
        }
        let objArray = Object.keys(this.specMap)
        objArray.forEach(obj => {
            if(obj != 'specList') {
                let id = e.indexOf(obj)
                if(id == -1) {
                    delete this.specMap[obj]
                }
            }
        })
        console.log(objArray)
        console.log(this.specMap)
    }
    deleteValue(item, i) {
        if(this.specMap[item].length > 1) {
            this.specMap[item].splice(i, 1)
        } 
    }
    saveSpec() {
        this.notification.create(
            "success",
            "保存成功",
            "保存成功"
        );
        this.onspecMapChange.emit(this.specMap)
    }
    
    addValue(item) {
        this.specMap[item].push({
            value: '',
            price: ''
        })
    }

}
