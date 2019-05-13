<template>
  <div class="page-container">
    <div v-show="!switchForm" class="show-box">
      <div class="query-box">
        <el-form :inline="true" :model="q" class="demo-form-inline">
          <el-form-item label="用户标识" class="form-item">
            <el-input v-model="q.username" placeholder="请输入用户标识"></el-input>
          </el-form-item>
          <el-form-item label="用户等级" class="form-item">
            <el-select v-model="q.level" placeholder="请选择等级">
              <el-option
                v-for="item in levelList"
                :label="item.levelname"
                :value="item.levelcode"
                :key="item.levelcode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态" class="form-item">
            <el-select v-model="q.status" placeholder="请选择审核状态">
              <el-option
                v-for="item in statusList"
                :label="item.statusName"
                :value="item.statusId"
                :key="item.statusId"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="form-item">
            <el-button type="info" @click="query">查询</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-dialog title="提示" :visible.sync="subTip" width="20%" top="30vh">
        <span>确定提交？</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="subConfirm">确 定</el-button>
          <el-button @click="subTip = false">取 消</el-button>
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
          @row-click="getRowData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="index" width="40" align="center"/>
          <!-- <el-table-column type="selection" width="45" align="center"/> -->
          <el-table-column
            prop="logincode"
            label="用户唯一标识"
            align="left"
            width="200"
            :show-overflow-tooltip="true"
          />
          <el-table-column prop="prelevelcode" label="申请前等级编号" align="left" width="120"/>
          <el-table-column prop="targetlevelcode" label="申请等级编号" align="left" width="120"/>
          <el-table-column prop="status" label="审核状态" align="left" width="120">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | formatStatus}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createtime" label="申请时间" align="center" width="200"/>
          <el-table-column prop="verifytime" label="审核时间" align="center" width="200"/>
          <el-table-column prop="updatetime" label="修改时间" align="center" width="200"/>
          <el-table-column prop="operator" label="新建用户（操作者）" align="left" width="180"/>
          <el-table-column prop="remark" label="审核备注" align="left" width="200"/>
          <el-table-column prop label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button v-if="hasPermission('syslevelapply:update')" type="danger" size="mini" @click="auditHandle(scope.$index, scope.row)">审核</el-button>
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

    <div v-show="switchForm" class="form-section">
      <div class="panel" v-html="panelTitle"/>
      <div class="form-container">
        <el-form ref="config" :model="s" label-width="140px">
          <el-form-item label="用户唯一标识">
            <el-input v-model="s.logincode" placeholder="用户唯一标识" :disabled="edit"/>
          </el-form-item>
          <el-form-item label="申请前等级编号">
            <el-select v-model="s.prelevelcode" :disabled="edit">
              <el-option
                v-for="item in levelList"
                :label="item.levelname"
                :value="item.levelcode"
                :key="item.levelcode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="申请等级编号">
            <el-select v-model="s.targetlevelcode" :disabled="edit">
              <el-option
                v-for="item in levelList"
                :label="item.levelname"
                :value="item.levelcode"
                :key="item.levelcode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态">
            <el-radio-group v-model="s.status" :disabled="edit">
              <el-radio label="APPLY_CREATED">申请中</el-radio>
              <el-radio label="APPLY_PASS">审核通过</el-radio>
              <el-radio label="APPLY_FAIL">审核不通过</el-radio>
            </el-radio-group>
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
import { isBlank,hasPermission } from "@/utils";
export default {
  data() {
    return {
      q: {
        level: "",
        username: "",
        status: ""
      },
      tableData: [],
      multipleSelection: [],
      page: {
        pageSize: 10,
        total: 1,
        currentPage: 1
      },
      switchForm: false,
      subTip: false,
      s: {},
      panelTitle: "",
      applyData: {},
      dialogFormVisible: false,
      formLabelWidth: "80px",
      levelList: [],
      statusList: [
        { statusName: "申请中", statusId: "APPLY_CREATED" },
        { statusName: "审核通过", statusId: "APPLY_PASS" },
        { statusName: "审核不通过", statusId: "APPLY_FAIL" }
      ],
      rowData: {}, //选中行数据
      multipleSelection: [],
      level: {},
      showDetails: true,
      edit:false
    };
  },
  filters: {
    statusFilter(status) {
      switch (status) {
        case "APPLY_PASS":
          return "success";
        case "APPLY_FAIL":
          return "danger";
        case "APPLY_CREATED":
          return "warning";
        default:
          return "";
      }
    },
    formatStatus(status) {
      switch (status) {
        case "APPLY_CREATED":
          return "申请中";
        case "APPLY_PASS":
          return "审核通过";
        case "APPLY_FAIL":
          return "审核不通过";
        default:
          return "-";
      }
    }
  },
  created() {
    this.getLevelList();
  },
  methods: {
    hasPermission(val){
      return hasPermission(val)
    },
    async query() {
      let queryParams =
        "&level=" +
        this.q.level +
        "&username=" +
        this.q.username +
        "&status=" +
        this.q.status;
      let r = await this._fetch(
        "/syslevelapply/list?type=0&limit=50&page=1" + queryParams,
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
    reset() {
      this.q = {
        level: "",
        username: "",
        status: ""
      };
    },
    async getLevelList() {
      let r = await this._fetch("/syslevelinfo/getLevels/?_=123", {
        method: "GET"
      });
      this.levelList = r.list;
    },
    auditHandle(index, row) {
      if (row.status != "APPLY_CREATED") {
        this.$message("该记录已经审核！");
        return;
      }
      this.s = row;
      this.s.id = row.id;
      this.edit = true;
      this.switchForm = true;
      this.panelTitle = "等级信息更改";
    },
    onSubmit() {
      var url =
        this.s.id == null ? "/syslevelapply/save" : "/syslevelapply/update";
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
    async subConfirm() {
      console.log(123);
      let r = await this._fetch("//corporate/withdrawal/preapplication", {
        method: "POST",
        body: this.applyData
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.getAdminList();
        this.subTip = false;
      } else {
        this.$message(r.msg);
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
  padding: 5px 0;
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
.el-dialog__body {
  form {
    border: none;
  }
}
</style>

