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

interface SelectProps{
    label?:string;
    value?:string|number;
}

interface queryPorps {
  name:string|number,
  remark:string|number,
  url:string|number,
  status:string|number,
  kind:string|number,
  maptype:string|number,
  prjtype:string|number,
  createdby:string|number,
  createdtime:string|number,
  updatedby:string|number,
  updatedtime:string|number,
  isBaseMap:string|number,
  isElevation:string|number,
  tileinfo:string|number,
  istiandi:string|number,
}

export type { TableProps ,TableColumnProps, ButtonProps, queryPorps, JsonProps, DialogProps }

