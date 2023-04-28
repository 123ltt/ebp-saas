// 一级菜单的 icon
import {
  ApplicationOne,
  ShieldAdd,
  Currency,
  EveryUser,
  Permissions,
  Deposit,
  BroadcastOne,
  AdProduct,
  ListView,
  Truck,
  Ship,
  DatabaseProportion,
  IncomeOne,
  ExpensesOne,
  Financing,
  ImportAndExport,
  CooperativeHandshake,
  Warehousing,
  Expenses,
  Communication,
  FinancingOne,
  Shop
} from '@icon-park/vue-next'

/** key 对应 菜单数据（ routes 接口）中的 label 字段 */
const icons = {
  /** 安全合规 */
  ss: ShieldAdd,
  /** 汇率系统 */
  ers: Currency,
  /** 租户管理系统 */
  opms: EveryUser,
  /** 权限管理系统 */
  system: Permissions,
  /** 刊登定价管理系统 */
  pps: Deposit,
  /** 刊登管理系统 */
  lms: BroadcastOne,
  /** 产品管理系统 */
  pms: AdProduct,
  /** 订单管理系统 */
  oms: ListView,
  /** 物流管理系统 */
  tms: Truck,
  /** 头程管理系统 */
  ftms: Ship,
  /** 库存管理系统 */
  ims: DatabaseProportion,
  /** 平台应收结算系统 */
  prs: IncomeOne,
  /** 物流应付管理系统 */
  lps: ExpensesOne,
  /** 成本管理系统 */
  ccst: Financing,
  /** 出口退税管理系统 */
  trs: ImportAndExport,
  /** 供应商管理系统 */
  supplier: CooperativeHandshake,
  /** 采购管理系统 */
  purchase: Warehousing,
  /** 采购应付管理系统 */
  cfps: Expenses,
  /** 客服管理系统 */
  cms_1: Communication,
  /** 财务管理系统 */
  fas: FinancingOne,
  /** 店铺管理系统 */
  sams: Shop
}

/** 获取 icon */
export default function getMenuIcon (key?: keyof typeof icons & string) {
  return key && icons[key] ? icons[key] : ApplicationOne
}
