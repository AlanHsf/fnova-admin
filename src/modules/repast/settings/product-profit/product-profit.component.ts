import { Component, ElementRef, OnInit } from '@angular/core';
import { productCate } from '../../productcate';

@Component({
  selector: 'app-product-profit',
  templateUrl: './product-profit.component.html',
  styleUrls: ['./product-profit.component.scss']
})

export class ProductProfitComponent implements OnInit {
  // 商品分类搜索框的值
  cateSearch: string = '';
  // 左侧分类显示数据
  cate: productCate[] = [];
  // 右侧商品显示数据
  product: productCate[] = [];

  // 商品分类数据
  cateList: productCate[] = []
  // 商品数据
  subList: productCate[] = []
  constructor() { }

  ngOnInit(): void {
    // 循环生成商品分类数据
    this.cateList = [{ key: '1', name: '顶级分类', interestRate: '30', profit: true, expand: true, children: [] }]
    for (let i = 1; i < 9; i++) {
      let second = { key: '1-' + i, name: '酒水', interestRate: '20', profit: true, expand: true, children: [] }
      let three = { key: '1-' + i + '-1', name: '啤酒', interestRate: '20', profit: true, expand: true, children: [] }
      let four = { key: '1-' + i + '-1-1', name: '百威', interestRate: '20', profit: true, expand: true, price: '2.50' }
      let four2 = { key: '1-' + i + '-1-2', name: '青岛小优', interestRate: '20', profit: true, expand: true, price: '2.00' }
      three.children.push(four, four2)
    console.log(four, four2)

    console.log(three)

      second.children.push(three)

      this.cateList[0].children.push(second)
    }
    console.log(this.cateList)
    // 左侧分类显示数据
    // this.cate = this.cateList;
    this.cate = this.cateList.filter(i => i.children.filter(v => v.children.filter(s => {
      s.children = [];
      return s
    })))
    console.log(this.cate)


    // 获取商品数据
    this.cateList.forEach(i => {
      if (i.children) {
        console.log(i.children)
        let children = i.children
        children.forEach(v => {
          console.log(v.children)
          if (v.children) {
            v.children.forEach(s => {
              this.subList.push(s)
              // if(s.children) {
              //   s.children.forEach( z=> {
              //     this.subList.push(z)
              //   })
              // }

            })
          }

        })
      }

    });
    console.log(this.subList)
    this.cate.forEach(item => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });
    this.subList.forEach(item => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });

  }
  // 点击左侧分类 传该分类下的子数据 右侧table显示商品数据  
  showSubProduct(children) {
    const item = children;
    item.children.map(i => { if (i.children == []) {// 如果是最后一个父级分类
      this.subList.map(item => {
        if (item.key === i.key) {

        }
      })
      
     } })
    console.log(children)
  };

  mapOfExpandedData: { [key: string]: productCate[] } = {};
  // 控制分类表格 展开项
  collapse(array: productCate[], data: productCate, $event: boolean): void {
    console.log(data)
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }
  // 控制商品表格 展开项
  collapse2(array: productCate[], data: productCate, $event: boolean): void {
    console.log(data)
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: productCate): productCate[] {
    const stack: productCate[] = [];
    const array: productCate[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: true });// expand设为true默认展开第二级

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: true, parent: node });// expand设为true默认展开第三级
        }
      }
    }

    return array;
  }

  visitNode(node: productCate, hashMap: { [key: string]: boolean }, array: productCate[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }
  // 参与分红 switch 切换
  profitChange(e) {
    console.log("sdgvfsr")
  }

}
