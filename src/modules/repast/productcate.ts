
  export interface productCate {
    key: string;
    name: string;
    interestRate: string;
    interest?: string;
    price?: string;
    level?: number;
    expand?: boolean;
    profit: boolean;
    children?: productCate[],
    parent?: productCate;
  }
    // // 表格数据
    // listOfMapData: productCate[] = [
    //   {
    //     key: `1`,
    //     name: '顶级分类',
    //     interestRate: '30',
    //     profit: true,
    //     expand: true,
    //     children: [
    //       {
    //         key: `1-1`,
    //         name: '酒水',
    //         interestRate: '20',
    //         profit: true,
    //         expand: true,
    //         children: [
    //           {
    //             key: `1-1-1`,
    //             name: '啤酒',
    //             interestRate: '20',
    //             profit: true,
    //             children: [
    //               {
    //                 key: `1-1-1-1`,
    //                 name: '百威',
    //                 price: '12.00',
    //                 interestRate: '20',
    //                 interest: '2.40',
    //                 profit: true,
    //               },
    //               {
    //                 key: `1-1-1-2`,
    //                 name: '青岛小优',
    //                 price: '10.00',
    //                 interestRate: '20',
    //                 interest: '2.00',
    //                 profit: true,
    //               }
    //             ]
    //           },
    //           {
    //             key: `1-1-2`,
    //             name: '饮料',
    //             interestRate: '60',
    //             profit: true,
    //           }
    //         ]
    //       },
    //       {
    //         key: `1-2`,
    //         name: '主食',
    //         interestRate: '60',
    //         profit: true,
    //         expand: true,
    //         children: [
    //           {
    //             key: `1-2-1`,
    //             name: '面食',
    //             interestRate: '60',
    //             profit: true,
    //           },
    //           {
    //             key: `1-2-2`,
    //             name: '米饭',
    //             interestRate: '60',
    //             profit: true,
    //           }
    //         ]
    //       },
    //       {
    //         key: `1-3`,
    //         name: '水果',
    //         interestRate: '60',
    //         profit: true,
  
    //       },
    //       {
    //         key: `1-4`,
    //         name: '家常',
    //         interestRate: '60',
    //         profit: true,
    //         children: [
    //           {
    //             key: `1-4-1`,
    //             name: '家常菜',
    //             interestRate: '60',
    //             profit: true,
    //           }
    //         ]
    //       },
    //       {
    //         key: `1-5`,
    //         name: '时令凉菜',
    //         interestRate: '20',
    //         profit: true,
    //         children: [
    //           {
    //             key: `1-5-1`,
    //             name: '凉菜',
    //             interestRate: '60',
    //             profit: true,
    //           }
    //         ]
    //       },
    //       {
    //         key: `1-6`,
    //         name: '时令海鲜',
    //         interestRate: '20',
    //         profit: true,
    //         children: [
    //           {
    //             key: `1-6-1`,
    //             name: '风味海鲜',
    //             interestRate: '60',
    //             profit: true,
    //           }
    //         ]
    //       },
    //       {
    //         key: `1-7`,
    //         name: '招牌',
    //         interestRate: '20',
    //         profit: true,
    //         children: [
    //           {
    //             key: `1-7-1`,
    //             name: '招牌必点',
    //             interestRate: '60',
    //             profit: true,
    //           }
    //         ]
    //       },
    //       {
    //         key: `1-8`,
    //         name: '时令蔬菜',
    //         interestRate: '20',
    //         profit: true,
    //         children: [
    //           {
    //             key: `1-8-1`,
    //             name: '时蔬',
    //             interestRate: '60',
    //             profit: true,
    //           }
    //         ]
    //       },
    //       {
    //         key: `1-9`,
    //         name: '对比展示',
    //         interestRate: '20',
    //         profit: true,
    //         children: [
    //           {
    //             key: `1-9-1`,
    //             name: '对比',
    //             interestRate: '60',
    //             profit: true,
    //           }
    //         ]
    //       },
    //     ]
    //   }
  
    // ];