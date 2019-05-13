<template>
  <div class="page-container">
    <div class="show-box">
      <div class="query-box">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label>
            <el-input v-model="formInline.key" placeholder="用户名、用户操作"/>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="query">查询</el-button>
            <el-button type="info" @click="clearHandle">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="tb-box">
        <el-table
          :data="tableData"
          :header-cell-style="rowClass"
          style="width: 100%"
          border
          max-height="750"
        >
          <el-table-column type="index" width="40" align="center"/>
          <el-table-column prop="id" label="id" align="left" width="100"/>
          <el-table-column prop="username" label="用户名" align="left" width="120"/>
          <el-table-column prop="operation" label="用户操作" align="left" width="150"/>
          <el-table-column prop="method" label="请求方法" align="left" :show-overflow-tooltip="true"/>
          <el-table-column prop="params" label="请求参数" align="left" :show-overflow-tooltip="true"/>
          <el-table-column prop="time" label="执行时长(毫秒)" align="left" width="150"/>
          <el-table-column prop="ip" label="IP地址" align="left"/>
          <el-table-column prop="createDate" label="创建时间" align="center"/>
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
      formInline: {
        key: ""
      },
      tableData: [],
      page: {
        pageSize: 50,
        total: 0,
        currentPage: 1
      }
    };
  },
  created() {
    this.getLogList();
  },
  methods: {
    async query() {
      let r = await this._fetch(
        "/sys/log/list?limit=50&page=1&key=" + this.formInline.key,
        { method: "GET" }
      );
      this.tableData = r.page.list;
    },
    clearHandle() {
      this.formInline.key = "";
    },
    async getLogList() {
      let r = await this._fetch("/sys/log/list?limit=50&page=1", {
        method: "GET"
      });
      if (r.code === 0) {
        this.tableData = r.page.list;
        this.page.total = r.page.totalCount;
        this.page.pageSize = r.page.pageSize;
      } else {
        this.$message(r.msg);
      }
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/sys/log/list?limit=" + val + "&page=" + this.page.currentPage,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/sys/log/list?limit=" + this.page.pageSize + "&page=" + val,
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
.input {
  display: inline-block;
  width: 200px;
  height: 36px;
  line-height: 36px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
}
.input:hover {
  border-color: #c0c4cc;
}
.input:focus {
  border-color: #409eff;
}
.input::-webkit-input-placeholder {
  padding-left: 14px;
  color: #bbb;
}
.el-form-item {
  margin-bottom: 0;
}
</style>

