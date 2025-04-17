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
  usernickname:string|number,
  userpic:string|number,
  wishaddress:string|number,
  wishcontent:string|number,
  wiship:string|number,
  wishnum:string|number,
  wishtime:string|number,
  wishtype:string|number,
  assist:string|number,
  complete:string|number,
  ispublic:string|number,
  receivecode:string|number,
  receivemobile:string|number,
  receivestatue:string|number,
  updatetime:string|number,
  receiveuserid:string|number,
}

export type { TableProps ,TableColumnProps, ButtonProps, queryPorps, JsonProps, DialogProps }

