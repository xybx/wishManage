interface TableProps{
  pid?:number | string;
}

interface TableColumnProps{
  sortable?: boolean;
  prop:string
  label:string
  list?:any
  sort?:boolean
  align?:any
}

interface ButtonProps{
  name?:string;
  size?:any;
  icon?:string;
  color?:string;
  funName?:string;
}

interface JsonProps {
  parentEleTag?:string;
  parentOptions?:any;
  parentEvent?:any;
  tableColumns?:TableColumnProps[] | [];
  formatColumns?:string;
  bindVal?:string;
  curEleTag?:string;
  curOptions?:any;
  childEleTag?:string;
  childOptions?:any;
  opearEleTag?:string;
  opearOptions?:any;
  opearBtnTag?:string;
  opearBtnData?:ButtonProps[] | [];
}

interface DialogProps extends JsonProps {
  modeType?:string;
  subEleTag?:string;
  subOptions?:any;
  subItemEleTag?:string;
  subItemOptions?:any;
  subChildEleTag?:string;
  subChildOptions?:any;
  subData?:any,
  title?:string;
  pid?:number | string;
}




interface queryPorps {
  name:string,
  password:string|number,
  username:string,
  type:string,
  des:string,
  projectinfopid?:string|number,
  url?:string,
  drivermsgpid?:string|number,
  schemaname?:string,
  dsname?:string,
  datasource?:string,
  value?:string,
  templatestylepid?:string|number,
  typepid?:string | number,
  img?:string,
  path?:string,
  sort?:number|string,
  packName?:string,
  controllerName?:string,
  domianName?:string,
  serviceName?:string,
  serviceImplName?:string,
  mapperName?:string,
  xmlName?:string,
  pojoName?:string,
  grouppid?:number
}


export type { TableProps ,TableColumnProps, ButtonProps, queryPorps, JsonProps, DialogProps }
