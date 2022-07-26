let DeviceSchemas: Schemas = {}
DeviceSchemas.Device = {
  className: "Device",
  name:"智能终端",
  desc: "智能终端",
  apps: ['common'],
  displayedOperators:["edit","delete"],
  displayedColumns:["name","category","type","uuid"],
  fields: {
    uuid: {
      type: "String",
      name: "UUID",
    },
    imei: {
      type: "String",
      name: "IMEI"
    },
    category: {
      type: "String",
      name: "类别"
    },
    type: {
      type: "String",
      name: "型号"
    },
    name: {
      type: "String",
      name: "名称"
    },
    config: {
      type: "Object",
      view: "json",
      name: "参数"
    }
  }
}


export {DeviceSchemas}
