import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'sps-card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss']
})
export class CardItemComponent implements OnInit {

  @Input("card") card:any = {}

  level = 1;
  cardImage:any;

  stats={
    abilities:[],
    mana:0,
    
    armor:0,
    
    attachType:"melee",
    attack:0,
    ranged:0,
    magic:0,

    health:0,
    speed:0
  }
  editionMap = {
    "0":"Alpha",
    "1":"Beta",
    "2":"Promo",
    "3":"Reward",
    "4":"Untamed",
    "5":"Dice",
    "6":"Gladius",
    "7":"Chaos Legion",
  };
  imageCateMap = {
    "0":"v2.2",
    "1":"beta",
    "2":"v2.2",
    "3":"beta",
    "4":"untamed",
    "5":"untamed",
    "6":"gladiator",
    "7":"chaos",
  };
  constructor() { 
  }

  ngOnInit(): void {
    this.loadImage();
    this.loadStats();
  }

  loadStats(){
    if(!(this.card.stats&&this.card.stats.abilities)){return}

    this.stats.abilities = this.card.stats.abilities[this.level-1]
​​​​
    this.stats.armor = this.card.stats.armor[this.level-1]
    ​​​​
    this.stats.attack = this.card.stats.attack[this.level-1]
    ​​​​
    this.stats.health = this.card.stats.health[this.level-1]
    ​​​​
    this.stats.magic = this.card.stats.magic[this.level-1]
    ​​​​
    this.stats.mana = this.card.stats.mana[this.level-1]
    ​​​​
    this.stats.ranged = this.card.stats.ranged[this.level-1]
    ​​​​
    this.stats.speed = this.card.stats.speed[this.level-1]

    if(this.stats.magic!=0){
      this.stats.attachType = "magic"
    }
    if(this.stats.ranged!=0){
      this.stats.attachType = "ranged"
    }

  }

  loadImage(){
    let firstEdition = String(this.card.editions.split(",")[0])
    let ext = "png"
    if(this.imageCateMap[firstEdition]=="chaos"){
      ext = "jpg"
    }
    this.cardImage = `https://d36mxiodymuqjm.cloudfront.net/cards_${encodeURI(this.imageCateMap[firstEdition])}/${encodeURI(this.card.name)}.${ext}`
  }
}
