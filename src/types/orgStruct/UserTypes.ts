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
  city:string|number,
  country:string|number,
  createdby:string|number,
  createdtime:string|number,
  email:string|number,
  gradeid:string|number,
  headpic:string|number,
  headpicmid:string|number,
  imgsign:string|number,
  logindate:string|number,
  nickname:string|number,
  openid:string|number,
  ordernum:string|number,
  password:string|number,
  passwordupdate:string|number,
  remark:string|number,
  sex:string|number,
  shortname:string|number,
  status:string|number,
  truename:string|number,
  unionid:string|number,
  updatedby:string|number,
  updatedtime:string|number,
  wishpower:string|number,
  loginaddress:string|number,
  loginip:string|number,
  phonenumber:string|number,
  province:string|number,
}

export type { TableProps ,TableColumnProps, ButtonProps, queryPorps, JsonProps, DialogProps }

