interface TableProps{
    pid?:number | string;
}

interface TableColumnProps{
    sortable?: boolean;
    prop:string
    label:string
    list?:any
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
  bgtime:string|number,
  edtime:string|number,
  introduction:string|number,
  joinpeople:string|number,
  rewardnum:string|number,
  region:string|number,
  award:string|number,
  payment:string|number,
  awardtips:string|number,
  updatetime:string|number,
  updatebyuser:string|number,
  showbgtime:string|number,
  isenable:string|number,
  hideedtimg:string|number,
  adduser:string|number,
  addtime:string|number,
}

export type { TableProps ,TableColumnProps, ButtonProps, queryPorps, JsonProps, DialogProps }

