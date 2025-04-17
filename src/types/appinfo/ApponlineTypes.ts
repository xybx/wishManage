interface TableProps{
    pid?:number | string;
}

interface TableColumnProps{
    prop:string,
    label:string,
    list?:any
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
  appname:string|number,
  useronline:string|number,
  appram:string|number,
  totalcpu:string|number,
  createtime:string|number,
  updatetime:string|number,
}

export type { TableProps ,TableColumnProps, ButtonProps, queryPorps, JsonProps, DialogProps }

