<template>
  <div class="page-container">
    <div class="show-box">
      <div class="query-box">
        <el-form :inline="true" :model="q" class="demo-form-inline">
          <el-form-item label="订单号">
            <el-input v-model="q.subNumber" placeholder="请输入查询订单号"/>
          </el-form-item>
          <el-form-item label="用户ID">
            <el-input v-model="q.userId" placeholder="请输入用户ID"/>
          </el-form-item>
          <el-form-item label="订单查询类型">
            <el-select v-model="q.orderType" placeholder="请选择订单类型">
              <el-option label="预付款订单" value="1"/>
              <el-option label="全额订单" value="2"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button v-if="hasPermission('fullBill:list')" type="primary" @click="onSubmit">查询</el-button>
            <el-button type="primary" @click="clear">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="tb-box">
        <el-table :data="tableData" :header-cell-style="rowClass" style="width: 100%" border max-height="720">
          <el-table-column type="index" width="40" align="center"/>
          <el-table-column prop="shopName" label="商城名称" align="left" width="150"/>
          <el-table-column prop="subNumber" label="订单号" align="left" width="250"/>
          <el-table-column prop="userId" label="订购用户ID" align="left" width="150" :show-overflow-tooltip="true"/>
          <el-table-column prop="userName" label="订购用户名称" align="left" width="150"/>
          <el-table-column prop="subId" label="订购ID" align="left"/>
          <el-table-column prop="prodName" label="产品名称" align="left" width="250" :show-overflow-tooltip="true"/>
          <el-table-column prop="actualTotal" label="实际总额" align="right"/>
          <el-table-column prop="distCommisAmount" label="分销的佣金总额" align="right" width="150"/>
          <el-table-column prop="score" label="使用积分数" align="left" width="100"/>
          <el-table-column prop="isCod" label="是否货到付款" align="left">
            <template slot-scope="scope">
              <el-tag :type="scope.row.isCod | statusFilter">{{scope.row.isCod | formatStata}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="couponOffPrice" label="使用的优惠券金额" width="180" align="right"/>
          <el-table-column prop="subDate" label="订购时间" width="180" align="center" :formatter="formatDate"/>
          <el-table-column prop="isNeedInvoice" label="是否需要发票" align="left">
            <template slot-scope="scope">
              <el-tag :type="scope.row.isNeedInvoice | invoiceFilter">{{scope.row.isNeedInvoice | formatInvoice}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="dvyType" label="配送类型" align="left"/>
          <el-table-column prop="refundState" label="退换货状态" align="left" width="100">
            <template slot-scope="scope">
              <el-tag :type="scope.row.refundState | refundFilter">{{scope.row.refundState | formatRefund}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="productNums" label="订单商品总数" align="left"/>
          <el-table-column prop="status" label="订单状态" align="left" width="200">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | orderStatusFilter">{{scope.row.status | formatorderStatus}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updateDate" label="订单更新日期" align="center" width="180" :formatter="formatDate2"/>
          <el-table-column prop="discountPrice" label="优惠总金额" align="right" width="100"/>
          <el-table-column prop="payManner" label="支付方式" align="left" width="120">
            <template slot-scope="scope">
              <el-tag :type="scope.row.payManner | payFilter">{{scope.row.payManner | formatPay}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="redpackOffPrice" label="使用的红包金额" width="100" align="right"/>
          <el-table-column prop="total" label="总值" align="right" width="100"/>
          <el-table-column prop="deleteStatus" label="用户订单删除状态" align="left" width="150">
            <template slot-scope="scope">
              <el-tag :type="scope.row.deleteStatus | delFilter">{{scope.row.deleteStatus | formatDel}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="freightAmount" label="订单运费" align="right"/>
          <el-table-column prop="isBill" label="是否结算" align="left">
            <template slot-scope="scope">
              <el-tag :type="scope.row.isBill | billFilter">{{scope.row.isBill | formatStata}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="isPayed" label="是否已经支付" align="left" width="120">
            <template slot-scope="scope">
              <el-tag :type="scope.row.isPayed | billFilter">{{scope.row.isPayed | formatIsPayed}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          :current-page="page.currentPage"
          :page-sizes="[10, 20, 30]"
          :page-size="page.pageSize"
          :total="page.total"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { formatDateTime,hasPermission } from '@/utils';
export default {
  data() {
    return {
      q: {
        subNumber: "",
        userId: "",
        orderType: ""
      },
      tableData: [],
      page: {
        pageSize: 30,
        total: 0,
        currentPage: 1
      },
      queryParams:''
    };
  },
  filters: {
    // el-tag类型转换
    statusFilter(status) {
      const statusMap = {
        'false': "primary",
        'true': "warning"
      };
      return statusMap[status];
    },
    // 状态显示转换
    formatStata(status) {
      const statusMap = {
        'false': "否",
        'true': "是"
      };
      return statusMap[status];
    },
    invoiceFilter(status) {
      const statusMap = {
        0: "info",
        1: "warning"
      };
      return statusMap[status];
    },
    formatInvoice(status) {
      const statusMap = {
        0: "不需要",
        1: "需要"
      };
      return statusMap[status];
    },
    refundState(status) {
      const statusMap = {
        0: "info",
        1: "warning",
        1: "success"
      };
      return statusMap[status];
    },
    formatRefund(status) {
      const statusMap = {
        0: "没有退款",
        1: "在处理",
        1: "处理完成"
      };
      return statusMap[status];
    },
    refundFilter(status) {
      switch(status){
        case '0' :return 'info';
        case '1' :return 'warning';
        default :return '';
      }
    },
    formatRefund(status) {
      switch(status){
        case '0' :return '没有退款';
        case '1' :return '有退款';
        default :return '-';
      }
    },
    orderStatusFilter(status) {
      const statusMap = {
        1: "warning",
        2: "warning",
        3: "warning",
        4: "success",
        5: "danger"
      };
      return statusMap[status];
    },
    formatorderStatus(status) {
      const statusMap = {
        1: "没有付款",
        2: "已经付款,但卖家没有发货",
        3: "发货，导致实际库存减少",
        4: "交易成功，购买数增加1",
        5: "交易失败.,还原库存"
      };
      return statusMap[status];
    },
    payFilter(status) {
      const statusMap = {
        1: "primary",
        2: "success"
      };
      return statusMap[status];
    },
    formatPay(status) {
      const statusMap = {
        1: "货到付款",
        2: "在线支付"
      };
      return statusMap[status];
    },
    delFilter(status) {
      const statusMap = {
        0: "info",
        1: "info",
        2: "info",
      };
      return statusMap[status];
    },
    formatDel(status) {
      const statusMap = {
        0: "没有删除",
        1: "回收站",
        2: "永久删除"
      };
      return statusMap[status];
    },
    billFilter(status){
      const statusMap = {
        'false': "warning",
        'true': "success"
      };
      return statusMap[status];
    },
    formatIsPayed(status){
      const statusMap = {
        'false': "没有支付过",
        'true': "已经支付过"
      };
      return statusMap[status];
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    hasPermission(val){
      return hasPermission(val)
    },
    async getDataList() {
      let r = await this._fetch("/fullBill/list?limit=30&page=1", {
        method: "GET"
      });
      if(r.code === 0){
        this.tableData = r.page.list;
      this.page.total = r.page.totalCount;
      this.page.pageSize = r.page.pageSize;
      }else{
        console.log(r.msg)
      }
    },
    async onSubmit() {
      this.queryParams =
        "&subNumber=" +
        this.q.subNumber +
        "&userId=" +
        this.q.userId +
        "&orderType=" +
        this.q.orderType;
      let r = await this._fetch(
        "/fullBill/list?limit="+this.page.pageSize+"&page="+this.page.currentPage + this.queryParams,
        {
          method: "GET"
        }
      );
      this.tableData = r.page.list;
      this.page.total = r.page.totalCount;
    },
    clear(){
      this.q = {
        subNumber: "",
        userId: "",
        orderType: ""
      }
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/fullBill/list?limit=" + val + "&page=" + this.page.currentPage + this.queryParams,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/fullBill/list?limit=" + this.page.pageSize + "&page=" + val + this.queryParams,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.currentPage = val;
    },
    formatDate(val){
      return formatDateTime(parseInt(val.subDate));
    },
    formatDate2(val){
      return formatDateTime(parseInt(val.updateDate));
    },
    rowClass() {
      return "text-align:center";
    }
  }
};
</script>
<style lang='scss' scoped>
.el-form-item {
  margin-bottom: 0;
}
form {
  padding-bottom: 15px;
  border-bottom: 1px solid #ddd;
}
.btn-box {
  padding-top: 15px;
}
</style>
