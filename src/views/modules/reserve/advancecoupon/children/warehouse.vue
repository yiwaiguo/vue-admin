<template>
  <div class="form-section">
    <div class="panel" v-html="panelTitle"/>
    <div class="form-container">
      <div class="query-box">
        <el-form :inline="true" :model="q" class="demo-form-inline">
          <el-form-item label="券面额">
            <el-input v-model="q.price" placeholder="券面额"/>
          </el-form-item>
          <el-form-item label="券状态">
            <el-select v-model="q.useStatus" placeholder="请选择券状态">
              <el-option value="">请选择券状态</el-option>
              <el-option
                v-for="item in statusList"
                :label="item.name"
                :value="item.value"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-box">
        <el-button type="info" @click="query">查询</el-button>
        <el-button type="info" @click="clearHandle">重置</el-button>
        <el-button type="primary" @click="goback">返回</el-button>
      </div>
      <div class="tb-box">
        <el-table
          :data="tableData"
          :header-cell-style="rowClass"
          style="width: 100%"
          border
          max-height="700"
        >
          <el-table-column type="index" width="40" align="center"/>
          <el-table-column prop="id" label="id" align="left" width="60px"/>
          <el-table-column prop="couponNo" label="券批次号" align="left"/>
          <el-table-column prop="couponSn" label="券序列号" align="left"/>
          <el-table-column prop="price" label="券面额" align="right" width="120">
            <template slot-scope="scope">
              <span>{{scope.row.price | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="logincode" label="持有者" align="left" :show-overflow-tooltip="true"/>
          <el-table-column prop="couponUseEndDate" label="券最晚使用期限" align="left"/>
          <el-table-column prop="useStatus" label="券状态" align="left" width="180">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.useStatus | statusFilter"
              >{{scope.row.useStatus | formatStatus}}</el-tag>
            </template>
          </el-table-column>
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
  props:['couponNo'],
  data() {
    return {
      panelTitle: "预付款券仓库查询",
      q: {
        couponNo:this.couponNo,
        price: "",
        useStatus: ""
      },
      tableData: [],
      switchStatus: "", //子组件传给父组件的值
      statusList: [
        { value: "0", name: "初始化状态" },
        { value: "1", name: "已领取" },
        { value: "2", name: "已使用" },
        { value: "-1", name: "已销毁" },
        { value: "-2", name: "已过期" },
        { value: "-3", name: "超过使用期限" },
        { value: "-4", name: "转移机构券失效" }
      ],
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      }
    };
  },
  filters: {
    rounding(value) {
      return value.toFixed(2);
    },
    statusFilter(status) {
      switch (status) {
        case "0":
          return "success";
        case "1":
          return "success";
        case "2":
          return "danger";
        case "-1":
          return "danger";
        case "-2":
          return "danger";
        case "-3":
          return "danger";
        case "-4":
          return "danger";
        default:
          return "";
      }
    },
    formatStatus(status) {
      switch (status) {
        case "0":
          return "初始化";
        case "1":
          return "已领取";
        case "2":
          return "已使用";
        case "-1":
          return "已销毁";
        case "-2":
          return "已过期";
        case "-3":
          return "超过使用期限";
        case "-4":
          return "转移机构券失效";
        default:
          return "";
      }
    }
  },
  created() {
    this.query();
  },
  methods: {
    async query() {
      let queryParams = "&couponNo=" + this.q.couponNo +
        "&price=" + this.q.price + "&useStatus=" + this.q.useStatus;
      let r = await this._fetch(
        "/couponwarehouse/list?limit=10&page=1" + queryParams,
        {
          method: "GET"
        }
      );
      if (r.code === 0) {
        this.tableData = r.page.list;
        this.page.total = r.page.totalCount;
        this.page.pageSize = r.page.pageSize;
      } else {
        this.$message(r.msg);
      }
    },
    clearHandle() {
      this.q = {
        price: "",
        useStatus: ""
      };
    },
    goback() {
      this.switchStatus = false;
      this.$emit("goback", this.switchStatus);
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/couponwarehouse/list?limit=" + val + "&page=" + this.page.currentPage,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/couponwarehouse/list?limit=" + this.page.pageSize + "&page=" + val,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.currentPage = val;
    },
    rowClass() {
      return "text-align:center";
    }
  }
};
</script>
<style lang="scss" scoped>
.form-section {
  margin: 30px;
  .form-container {
    width: 100%;
    padding-top:15px;
    .query-box {
      padding-left: 20px;
      border-bottom: 1px solid #ddd;
    }
    .btn-box {
      padding: 10px 0 0 20px;
    }
  }
}
</style>
