import { Component, OnInit } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-edit-income-ratio',
  templateUrl: './edit-income-ratio.component.html',
  styleUrls: ['./edit-income-ratio.component.scss']
})
export class EditIncomeRatioComponent implements OnInit {

  number_1:any;
  number_2:any;
  number_3:any;
  @Input() testData:any = {};


  @Output() testDataChange = new EventEmitter<any>();  
  constructor() { }

  ngOnInit(): void {
    let testData = {
      "1": 0,
      "2": 0,
      "3": 0
    }
  if(!this.testData){
      this.testData = testData
  }
  this.number_1 = this.testData['1'] 
  this.number_2 = this.testData['2'] 
  this.number_3 = this.testData['3']
} 
change_1(e){
  this.testData['1']= e/100
  this.testDataChange.emit(this.testData)
}
change_2(e){
  this.testData['2']= e
  this.testDataChange.emit(this.testData)

}
change_3(e){
  this.testData['3']= e
  this.testDataChange.emit(this.testData)

}

}
