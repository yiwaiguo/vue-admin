<template>
  <div class="page-container">
    <div class="show-box">
      <div class="query-box">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="用户名或用户操作">
            <el-input v-model="formInline.user" placeholder="用户名、用户操作"></el-input>
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
          style="width: 100%"
          border
          max-height="500"
        >
          <el-table-column type="index" width="35" align="center"></el-table-column>
          <el-table-column prop="id" label="id" align="center"></el-table-column>
          <el-table-column prop="username" label="用户名" align="center"></el-table-column>
          <el-table-column prop="operation" label="用户操作" align="center"></el-table-column>
          <el-table-column prop="method" label="请求方法" align="center"></el-table-column>
          <el-table-column prop="params" label="请求参数" align="center"></el-table-column>
          <el-table-column prop="time" label="执行时长(毫秒)" align="center"></el-table-column>
          <el-table-column prop="ip" label="IP地址" align="center"></el-table-column>
          <el-table-column prop="createDate" label="创建时间" align="center"></el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
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
      formInline: {
        user: "",
        region: ""
      },
      tableData: [],
      currentPage: 1
    };
  },
  methods: {
    query() {
      let queryData = { user: this.formInline.user };
      this._fetch("/query", {
        method: "POST",
        body: queryData
      });
    },
    clearHandle() {
      this.formInline.user = "";
    },
    getAdminList() {
      //   this._fetch("/admin", { method: "GET" });
    },
    handleSizeChange() {},
    handleCurrentChange() {}
  },
  created() {
    this.getAdminList();
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
  margin-bottom:0;
}
</style>

