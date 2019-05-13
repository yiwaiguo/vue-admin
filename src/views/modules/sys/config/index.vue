<template>
  <div class="page-container">
    <div v-show="!switchForm" class="show-box">
      <div class="query-box">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label class="form-item">
            <el-input v-model.trim="formInline.key" placeholder="请输入参数名"/>
          </el-form-item>
          <el-form-item class="form-item">
            <el-button type="info" @click="query">查询</el-button>
            <el-button type="info" @click="clearHandle">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-box">
        <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="del">删除</el-button>
      </div>
      <el-dialog title="提示" :visible.sync="delTip" width="20%" top="30vh">
        <span>确定要删除选中的记录？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delTip = false">取 消</el-button>
          <el-button type="primary" @click="delConfirm">确 定</el-button>
        </span>
      </el-dialog>
      <div class="tb-box">
        <el-table
          ref="dataTable"
          :data="tableData"
          :header-cell-style="rowClass"
          style="width: 100%"
          border
          max-height="700"
          @selection-change="handleSelectionChange"
          @row-click="getRowData"
        >
          <el-table-column type="index" width="40" align="center"/>
          <el-table-column type="selection" width="45" align="center"/>
          <el-table-column prop="pvalue" label="上级参数值" align="left" width="200"/>
          <el-table-column prop="key" label="参数名" align="left" width="350"/>
          <el-table-column prop="value" label="参数值" align="left" :show-overflow-tooltip="true"/>
          <el-table-column prop="remark" label="备注" align="left" :show-overflow-tooltip="true"/>
          <el-table-column prop label="操作" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="update(scope.$index, scope.row)">修改</el-button>
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

    <div v-show="switchForm" class="form-section">
      <div class="panel" v-html="panelTitle"/>
      <div class="form-container">
        <el-form ref="config" :model="config" label-width="100px">
          <el-form-item label="参数名">
            <el-input v-model="config.key" placeholder="参数名" :disabled="tflag"/>
          </el-form-item>
          <el-form-item label="参数值">
            <el-input v-model="config.value" placeholder="参数值"/>
          </el-form-item>
          <el-form-item label="父级">
            <el-select v-model="config.pid" placeholder="请选择...">
              <el-option value="-1" label="请选择..."></el-option>
              <el-option
                v-for="item in selectedList"
                :label="item.key"
                :value="item.id"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="config.remark" placeholder="备注"/>
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
      formInline: {
        key: ""
      },
      tableData: [],
      multipleSelection: [],
      page: {
        pageSize: 50,
        total: 0,
        currentPage: 1
      },
      switchForm: false,
      delTip: false,
      config: {},
      panelTitle: "新增参数",
      selectedList: [],
      tflag: false
    };
  },
  created() {
    this.getConfigList();
    this.getPidList();
  },
  methods: {
    async query() {
      let r = await this._fetch(
        "/sys/config/list?limit=50&page=1&key=" + this.formInline.key,
        { method: "GET" }
      );
      this.tableData = r.page.list;
    },
    clearHandle() {
      this.formInline.key = "";
    },
    add() {
      this.switchForm = true;
      this.panelTitle = "新增参数";
      this.config = {};
      this.config.pid="-1";
    },
    async getPidList() {
      let r = await this._fetch("/sys/config/listPid", { method: "GET" });
      this.selectedList = r.data;
    },
    update(index, row) {
      this.tflag = true;
      this.switchForm = true;
      this.panelTitle = "参数信息更改";
      this.getConfigInfo(row.id);
    },
    async getConfigInfo(id) {
      let r = await this._fetch("/sys/config/info/" + id, { method: "GET" });
      this.config = r.config;
    },
    del() {
      if (this.multipleSelection.length < 1) {
        this.$message("请选择一条记录");
        return;
      }
      this.delTip = true;
    },
    async delConfirm() {
      let r = await this._fetch("/sys/config/delete", {
        method: "POST",
        body: this.config.ids
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.getConfigList();
        this.delTip = false;
      } else {
        this.$message(r.msg);
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.config.ids = [];
      this.multipleSelection.forEach(item => {
        this.config.ids.push(item.id);
      });
      this.rowData = this.multipleSelection[0];
      if (this.rowData) {
        this.config.id = this.rowData.id;
      }
    },
    getRowData(row) {
      this.$refs.dataTable.toggleRowSelection(row);
      this.rowData = row;
      this.config.id = this.rowData.id;
    },
    onSubmit() {
      if (this.validator()) {
        return;
      }
      var url =
        this.config.id == null ? "/sys/config/save" : "/sys/config/update";
      this.addUser(url);
    },
    async addUser(url) {
      let r = await this._fetch(url, {
        method: "POST",
        body: this.config
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.getConfigList();
        this.switchForm = false;
      } else {
        this.$message(r.msg);
      }
    },
    reback() {
      this.switchForm = false;
    },
    async getConfigList() {
      let r = await this._fetch("/sys/config/list?limit=50&page=1", {
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
    validator() {
      if (isBlank(this.config.key)) {
        this.$message("参数名不能为空");
        return true;
      }

      if (isBlank(this.config.value)) {
        this.$message("参数值不能为空");
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
  margin-bottom: 22px;
}
.form-item {
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

