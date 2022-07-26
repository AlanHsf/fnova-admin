import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-staff-ratio',
  templateUrl: './edit-staff-ratio.component.html',
  styleUrls: ['./edit-staff-ratio.component.scss']
})
export class EditStaffRatioComponent implements OnInit {

  id: string;
  name: string;
  age: string;
  address: string;
  i = 0;
  editId: string | null = null;
  @Input() bonusType:any;
  @Input() listOfData: any = [];
  @Output() listOfDataChange = new EventEmitter<any>();  
  startEdit(id: string): void {
    this.editId = id;
  }

  stopEdit(): void {
    this.editId = null;
    this.listOfDataChange.emit(this.listOfData)
  }

  addRow(): void {
    if(!this.listOfData){
      this.listOfData = [
        {
          id: `${this.i}`,
          min: 0,
          max: 0,
          ratio: 0,
          type:this.bonusType
        }
      ];
    }else{
      this.i = this.listOfData.length
      this.listOfData = [...this.listOfData];
    }
    
  }
  addData(){
    if(!this.listOfData){
      this.listOfData = [
        {
          id: `${this.i}`,
          min: 0,
          max: 0,
          ratio: 0,
          type:this.bonusType
        }
      ];
    }else{
      this.i = this.listOfData.length
      this.listOfData = [
        ...this.listOfData,
        {
          id: `${this.i}`,
          min: 0,
          max: 0,
          ratio: 0,
          type:this.bonusType
        }
      ];
    }
    
    this.i++;
  }

  deleteRow(id: string): void {
    this.listOfData = this.listOfData.filter(d => d.id !== id);
    this.listOfDataChange.emit(this.listOfData)

  }

  ngOnInit(): void {
    console.log(this.bonusType)
    console.log(this.listOfData)
    if(!this.bonusType){
      this.bonusType="rate"
    }
    this.addRow();
  }

}
