<template>
  <div class="wrapper-box">
    <div class="show-box1" v-show="!switchForm">
      <div class="panel" v-html="panelTitle"/>
      <div class="tb-box1">
        <div class="query-section">
          <el-form :inline="true" :model="q" class="demo-form-inline">
            <el-form-item label="服务商名称">
              <el-input v-model="q.dealerName" placeholder="服务商名称"></el-input>
            </el-form-item>
            <el-form-item label="服务商编号">
              <el-input v-model="q.dealerCode" placeholder="服务商编号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" @click="query">查询</el-button>
              <el-button type="info" @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="tb-section">
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            max-height="700"
            :header-cell-style="rowClass"
          >
            <el-table-column type="index" width="40"></el-table-column>
            <el-table-column prop="dealerName" label="服务商名称"></el-table-column>
            <el-table-column prop="dealerFullName" label="服务商全称"></el-table-column>
            <el-table-column prop="dealerCode" label="服务商编号"></el-table-column>
            <el-table-column prop="baseInfoName" label="签约名称"></el-table-column>
            <el-table-column prop label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="!scope.row.auditorName"
                  size="mini"
                  type="primary"
                  @click="detailHandle(scope.$index, scope.row)"
                >详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="block1">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.currentPage"
            :page-sizes="[10, 30, 50]"
            :page-size="page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total"
          ></el-pagination>
        </div>
      </div>
    </div>

    <div class="show-box1" v-show="switchForm">
      <div class="panel">
        <span>{{panelTitle}}</span>
        <el-button type="warning" @click="reback" size="small">返回</el-button>
      </div>
      <div class="form-section">
        <el-form label-position="right" label-width="80px" :model="form">
          <el-form-item label="服务商名称">
            <el-input v-model="form.dealerName" disabled></el-input>
          </el-form-item>
          <el-form-item label="服务商全称">
            <el-input v-model="form.dealerFullName" disabled></el-input>
          </el-form-item>
          <el-form-item label="证件类型">
            <el-input v-model="form.baseInfoIDType" disabled></el-input>
          </el-form-item>
          <el-form-item label="证件号码">
            <el-input v-model="form.baseInfoIDCard" disabled></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="form.baseInfoTelephone" disabled></el-input>
          </el-form-item>
          <el-form-item label="服务商编号">
            <el-input v-model="form.dealerCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="签约名称">
            <el-input v-model="form.baseInfoName" disabled></el-input>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input type="textarea" v-model="form.remarks" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      switchForm: false,
      panelTitle: "服务商列表",
      q: {
        dealerName: "",
        dealerCode: ""
      },
      tableData: [],
      page: {
        currentPage: 1,
        pageSize: 50,
        total: 0
      },
      queryParams: "",
      form: {}
    };
  },
  methods: {
    async query() {
      this.queryParams =
        "&dealerName=" +
        this.q.dealerName +
        "&dealerCode=" +
        this.q.dealerCode;
      let r = await this._fetch(
        "/org/dealer/facilitatorList?limit=50&page=1" + this.queryParams,
        { method: "GET" }
      );
      if (r.code === 0) {
        this.tableData = r.page.list;
        this.page.total = r.page.totalCount;
        this.page.currentPage = r.page.currPage;
      } else {
        this.$message(r.msg);
      }
    },
    reset() {
      this.q = {
        dealerName: "",
        dealerCode: ""
      };
    },
    detailHandle(index, row) {
      this.getInfo(row.dealerId);
      this.panelTitle = "服务商详情";
      this.switchForm = true;
    },
    async getInfo(id) {
      let r = await this._fetch("/org/dealer/info/" + id, { method: "GET" });
      if(r.code === 0){
          this.form = r.bmOrganization
      }else{
          console.log(r.msg)
      }
    },
    reback() {
      this.switchForm = false;
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/org/dealer/facilitatorList?limit=" +
          val +
          "&page=" +
          this.page.currentPage +
          this.queryParams,
        { method: "GET" }
      );
      if (r.code === 0) {
        this.tableData = r.page.list;
        this.page.total = r.page.totalCount;
        this.page.pageSize = val;
      } else {
        console.log(r.msg);
      }
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/org/dealer/facilitatorList?limit=" +
          this.page.pageSize +
          "&page=" +
          val +
          this.queryParams,
        { method: "GET" }
      );
      if (r.code === 0) {
        this.tableData = r.page.list;
        this.page.total = r.page.totalCount;
        this.page.currentPage = val;
      } else {
        console.log(r.msg);
      }
    },
    rowClass() {
      return "text-align:center";
    }
  }
};
</script>
<style lang="scss" scoped>
.wrapper-box {
  padding: 10px 30px;
  .show-box1 {
    border: 1px solid #ddd;
    border-radius: 4px;
    padding-bottom: 15px;
    .panel {
      height: 40px;
      line-height: 40px;
      background-color: #f5f5f5;
      font-size: 14px;
      padding-left: 10px;
      border-bottom: 1px solid #ddd;
    }
    .tb-box1 {
      padding: 0 20px;
      .query-section {
        padding-top: 15px;
      }
      .tb-section {
        margin-bottom: 15px;
      }
    }

    .panel {
        position: relative;
        .el-button {
          position: absolute;
          right: 40px;
          top: 3px;
        }
      }
    .form-section {
      width: 50%;
      margin: 30px auto;
      border: none;
    }
  }
}
</style>
