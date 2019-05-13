<template>
  <div>
    <div class="form-section" v-show="!switchForm">
      <div class="panel" v-html="panelTitle"/>
      <div class="form-container">
        <div class="btn-box">
          <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
          <el-button type="primary" icon="el-icon-delete" @click="del">删除</el-button>
          <el-button type="info" @click="query">查询</el-button>
          <el-button type="info" @click="goback">返回</el-button>
        </div>
        <div class="tb-box">
          <el-table
            ref="dataTable"
            :data="tableData"
            :header-cell-style="rowClass"
            style="width: 100%"
            border
            max-height="700"
            @row-click="getRowData"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="index" width="40" align="center"/>
            <el-table-column type="selection" width="45" align="center"/>
            <el-table-column prop="id" label="id" align="left" width="80"/>
            <el-table-column prop="levelCode" label="等级编号" align="left" width="100"/>
            <el-table-column prop="cycleType" label="周期类型" align="left" width="120">
              <template slot-scope="scope">
                <span>{{scope.row.cycleType | formatType}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="是否启用该限制条件" align="left" width="120">
              <template slot-scope="scope">
                <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | formatStatus}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="maxOrderNum" label="最大订单数" align="left" width="120"/>
            <el-table-column prop="maxWeightAu" label="最大克重 ( 金 )" align="left" width="150"/>
            <el-table-column prop="maxWeightAg" label="最大克重 ( 银 )" align="left" width="150"/>
            <el-table-column prop="maxNetAdvance" label="最大预付款" align="left" width="150"/>
            <el-table-column prop="maxAdvance" label="最大净预付款" align="left" width="150"/>
            <el-table-column prop="createTime" label="数据增加时间" align="center" width="200"/>
            <el-table-column prop="updateTime" label="数据修改时间" align="center" width="200"/>
            <el-table-column prop="remarks" label="备注" align="left" width="200"/>
            <el-table-column prop label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="updateHandle(scope.$index, scope.row)"
                >修改</el-button>
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
          />
        </div>
      </div>
    </div>

    <div v-show="switchForm" class="form-section">
      <div class="panel" v-html="panelTitle"/>
      <div class="form-container child-form">
        <el-form label-width="140px">
          <el-form-item label="等级编号">
            <el-input v-model="levelCode" placeholder="等级编号" disabled/>
          </el-form-item>
          <el-form-item label="等级名称">
            <el-select label="周期类型" v-model="s.cycleType">
              <el-option value>选择周期类型</el-option>
              <el-option value="D">日</el-option>
              <el-option value="M">月</el-option>
              <el-option value="Y">年</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否启用该限制条件">
            <el-select v-model="s.status">
              <el-option value="FLAG_YES">是</el-option>
              <el-option value="FLAG_NO">否</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最大订单数">
            <el-input v-model="s.maxOrderNum" placeholder="最大订单数"/>
          </el-form-item>
          <el-form-item label="最大克重 ( 金 )">
            <el-input v-model="s.maxWeightAu" placeholder="最大克重 ( 金 )"/>
          </el-form-item>
          <el-form-item label="最大克重 ( 银 )">
            <el-input v-model="s.maxWeightAg" placeholder="最大克重 ( 银 )"/>
          </el-form-item>
          <el-form-item label="最大预付款">
            <el-input v-model="s.maxAdvance" placeholder="最大预付款"/>
          </el-form-item>
          <el-form-item label="最大净预付款">
            <el-input v-model="s.maxNetAdvance" placeholder="最大净预付款"/>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="s.remarks" placeholder="备注"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确定</el-button>
            <el-button type="warning" @click="reback">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { isBlank } from "@/utils";
export default {
  data() {
    return {
      panelTitle: "商城用户等级限制查询",
      switchForm: false,
      tableData: [],
      multipleSelection: [],
      level: {},
      s: {},
      page: {
        pageSize: 10,
        total: 1,
        currentPage: 1
      }
    };
  },
  filters: {
    formatType(status) {
      switch (status) {
        case "D":
          return "日";
        case "M":
          return "月";
        case "W":
          return "周";
        default:
          return "-";
      }
    },
    statusFilter(status) {
      switch (status) {
        case "FLAG_YES":
          return "success";
        default:
          return "danger";
      }
    },
    formatStatus(status) {
      switch (status) {
        case "FLAG_YES":
          return "是";
        default:
          return "否";
      }
    }
  },
  created() {
    this.query();
  },
  computed: {
    levelCode() {
      return this.$store.state.app.levelCode;
    }
  },
  methods: {
    add() {
      this.panelTitle = "新增";
      this.switchForm = true;
      this.s = {};
    },
    del() {},
    updateHandle(index, row) {
      this.s = row;
      this.s.id = row.id;
      this.s.levelcode = this.levelCode;
      this.switchForm = true;
      this.panelTitle = "修改";
    },
    goback() {
      this.$emit("goback");
    },
    async query() {
      let queryParams = "&levelCode=" + this.levelCode;
      let r = await this._fetch(
        "/syslevelinfocycle/list?type=0&limit=10&page=1" + queryParams,
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
    onSubmit() {
      if (this.validator()) {
        return;
      }
      var url = this.s.id == null ? "/syslevelinfo/save" : "/syslevelinfo/update";
      this.addUser(url);
    },
    async addUser(url) {
      let r = await this._fetch(url, {
        method: "POST",
        body: this.s
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.query();
        this.switchForm = false;
      } else {
        this.$message(r.msg);
      }
    },
    reback() {
      this.switchForm = false;
    },
    getRowData(row) {
      console.log(row);
      this.$refs.dataTable.toggleRowSelection(row);
      this.rowData = row;
      this.level.id = this.rowData.id;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.level.Ids = [];
      this.multipleSelection.forEach(item => {
        this.level.Ids.push(item.id);
      });
      this.rowData = this.multipleSelection[0];
      if (this.rowData) {
        this.level.id = this.rowData.id;
      }
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/syslevelinfocycle/list?limit=" +
          val +
          "&page=" +
          this.page.currentPage,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/syslevelinfocycle/list?limit=" + this.page.pageSize + "&page=" + val,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.currentPage = val;
    },
    validator: function() {
      if (isBlank(this.s.levelCode)) {
        this.$message("等级编号不能为空");
        return true;
      }
      if (isBlank(this.s.cycleType)) {
        this.$message("周期类型不能为空");
        return true;
      }
      if (isBlank(this.s.status)) {
        this.$message("是否启用该限制条件不能为空");
        return true;
      }
    },
    rowClass() {
      return "text-align:center";
    }
  }
};
</script>
<style lang="scss" scoped>
.form-container {
  width: 100%;
  padding: 10px;
}
.child-form {
  width: 50%;
  margin-top: 10px;
}
</style>


