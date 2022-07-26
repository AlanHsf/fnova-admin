import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-diy-color',
    templateUrl: './diy-color.component.html',
    styleUrls: ['./diy-color.component.scss']
})
export class DiyColorComponent implements OnInit {
    @Input('color') currentColor: string = ''
    @Output() onColorChange = new EventEmitter<any>();
    constructor() { }
    isShow:boolean = false;
    colors:any = [
        "#000000",
        "#545454",
        "#737373",
        "#a6a6a6",
        "#d9d9d9",
        "#ffffff",
        "#ff1616",
        "#ff5757",
        "#ff66c4",
        "#cb6ce6",
        "#8c52ff",
        "#5e17eb",
        "#03989e",
        "#00c2cb",
        "#5ce1e6",
        "#38b6ff",
        "#5271ff",
        "#004aad",
        "#008037",
        "#7ED957",
        "#C9E265",
        "#ffde59",
        "#ffbd59",
        "#ff914d",
    ]
    
    ngOnInit() {
    }
    openColorModal() {
        this.isShow = true
    }
    handleCancel() {
        this.isShow = false
    }
    changeColor(color) {
        this.currentColor = color
    }
    handleOk(){
        this.isShow = false
        this.onColorChange.emit(this.currentColor)
    }



}
