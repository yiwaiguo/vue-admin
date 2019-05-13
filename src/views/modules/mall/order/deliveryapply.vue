<template>
  <div class="page-container">
    <div class="show-box">
      <div class="tb-box">
        <el-table :data="tableData" :header-cell-style="rowClass" style="width: 100%" border>
          <el-table-column type="index" width="35" align="center"/>
          <el-table-column type="selection" width="45" align="center"/>
          <el-table-column prop="orderno" label="提货申请对应订单" align="left"/>
          <el-table-column prop="mobile" label="手机号" align="left"/>
          <el-table-column prop="deliveryname" label="收货人" align="left"/>
          <el-table-column prop="address" label="收货地址" align="left"/>
          <el-table-column prop="deliverytime" label="提货申请时间" align="center"/>
          <el-table-column prop="deliverystatus" label="发货状态" align="left"/>
          <el-table-column prop="trackingNumber" label="运单号" align="left"/>
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
