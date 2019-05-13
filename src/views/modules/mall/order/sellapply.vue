<template>
  <div class="page-container">
    <div class="show-box">
      <div class="tb-box">
        <el-table :data="tableData" :header-cell-style="rowClass" style="width: 100%" border>
          <el-table-column type="index" width="35" align="center"/>
          <el-table-column type="selection" width="45" align="center"/>
          <el-table-column prop="orderno" label="订单号"/>
          <el-table-column prop="mobile" label="联系电话"/>
          <el-table-column prop="account" label="银行卡号"/>
          <el-table-column prop="createtime" label="申请时间"/>
          <el-table-column prop="sellstatus" label="回购状态"/>
          <el-table-column prop="sellno" label="申请单号"/>
          <el-table-column prop="updatetime" label="更新时间"/>
          <el-table-column prop="voucherPath" label="凭证"/>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          :current-page="page.currentPage"
          :page-sizes="[10, 30, 50]"
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
export default {
  data() {
    return {
      tableData: [],
      page: {
        pageSize: 50,
        total: 0,
        currentPage: 1
      },
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    async getDataList() {
      let r = await this._fetch("/deliveryapply/list?limit=50&page=1", {
        method: "GET"
      });
      this.tableData = r.page.list;
      this.page.total = r.page.totalCount;
      this.page.pageSize = r.page.pageSize;
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/sys/config/list?limit=" + val + "&page=" + this.page.currentPage,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/sys/config/list?limit=" + this.page.pageSize + "&page=" + val,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.currentPage = val;
    },
    rowClass() {
      return 'text-align:center'
    }
  }
}
</script>
<style>
</style>
