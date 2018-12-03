<template>
  <div class="page-container">
    <div class="show-box">
      <div class="tb-box">
        <el-table :data="tableData" style="width: 100%" border>
          <el-table-column type="index" width="35" align="center"></el-table-column>
          <el-table-column type="selection" width="45" align="center"></el-table-column>
          <el-table-column prop="orderno" label="订单号" width="180"></el-table-column>
          <el-table-column prop="orderstatus" label="订单状态" width="180"></el-table-column>
          <el-table-column prop="name" label="产品类型"></el-table-column>
          <el-table-column prop="weight" label="规格"></el-table-column>
          <el-table-column prop="count" label="数量"></el-table-column>
          <el-table-column prop="bscode" label="预订单类型"></el-table-column>
          <el-table-column prop="margiused" label="预付款金额"></el-table-column>
          <el-table-column prop="openprice" label="订购价"></el-table-column>
          <el-table-column prop="createordertime" label="下单时间"></el-table-column>
          <el-table-column prop="closeordertime" label="退订时间"></el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage4"
          :page-sizes="[10, 30, 50]"
          :page-size="50"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
          background
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: []
    };
  },
  methods:{
      handleSizeChange(){

      },
      handleCurrentChange(){

      }
  }
};
</script>
<style>
</style>
