<template>
  <div class="show-box1">
    <div class="query-box1">
      <el-form :inline="true" :model="q" class="demo-form-inline">
        <el-form-item label="用户名">
          <el-input v-model.trim="q.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model.trim="q.mobile" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item label="审批角色名">
          <el-input v-model.trim="q.auditorName" placeholder="请输入审批角色名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="query">查询</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="tb-box1">
      <el-table :data="tableData" border style="width: 100%" max-height="700" :header-cell-style="rowClass">
        <el-table-column type="index" width="40"/>
        <el-table-column prop="userId" label="用户ID" align="left"></el-table-column>
        <el-table-column prop="userName" label="用户名" align="left"></el-table-column>
        <el-table-column prop="email" label="邮箱" align="left" width="180"></el-table-column>
        <el-table-column prop="mobile" label="手机号" align="left"></el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | formatStatus}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="userType" label="用户类型" align="left">
          <template slot-scope="scope">
            <span>{{scope.row.userType | formatType}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="auditorName"
          label="审批角色名"
          align="left"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column
          prop="auditUserGroup.groupId"
          label="审批组ID"
          align="left"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="auditUserGroup.groupName" label="审批组名" align="left"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="200"></el-table-column>
        <el-table-column prop label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.auditorName"
              size="mini"
              type="primary"
              @click="add(scope.$index, scope.row)"
            >新增</el-button>
            <el-button v-else size="mini" type="warning" @click="update(scope.$index, scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
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
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" width="20%" top="30vh">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.userName" placeholder="用户名" disabled></el-input>
        </el-form-item>
        <el-form-item v-if="false" label="审批角色名" :label-width="formLabelWidth">
          <el-input v-model="form.auditorName" placeholder="审批角色名" disabled></el-input>
        </el-form-item>
        <el-form-item label="所属角色组" :label-width="formLabelWidth">
          <el-select v-model="form.groupId" placeholder="请选择所属角色组">
            <el-option value>请选择所属角色组</el-option>
            <el-option
              v-for="group in userGroups"
              :value="group.id"
              :label="group.name"
              :key="group.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isBlank } from "@/utils";
export default {
  data() {
    return {
      q: {
        userName: "",
        mobile: "",
        auditorName: ""
      },
      tableData: [],
      page: {
        total: 0,
        pageSize: 10,
        currentPage: 1
      },
      queryParams: "",
      dialogFormVisible: false,
      form: {},
      formLabelWidth: "100px",
      userGroups: [],
      formTitle: "",
      handleUrl: ""
    };
  },
  filters: {
    statusFilter(value) {
      switch (value) {
        case 0:
          return "danger";
        case 1:
          return "success";
        default:
          return "";
      }
    },
    formatStatus(value) {
      switch (value) {
        case 0:
          return "禁用";
        case 1:
          return "正常";
        default:
          return "-";
      }
    },
    formatType(value) {
      switch (value) {
        case -1:
          return "超管";
        case 0:
          return "子超管";
        case 1:
          return "普通用户";
        default:
          return "-";
      }
    }
  },
  created() {
    setTimeout(() => {
      this.getUserGroups();
    }, 20);
  },
  methods: {
    async getUserGroups() {
      let r = await this._fetch("/audit/getGroup", { method: "GET" });
      if (r.rc == 200) {
        this.userGroups = r.data;
      } else {
        console.log(r.msg);
      }
    },
    async query() {
      this.queryParams =
        "&userName=" +
        this.q.userName +
        "&mobile=" +
        this.q.mobile +
        "&auditorName=" +
        this.q.auditorName;
      let r = await this._fetch(
        "/sysUser/list?limit=10&page=1" + this.queryParams,
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
        userName: "",
        mobile: "",
        auditorName: ""
      };
    },
    add(index, row) {
      console.log(row);
      if (row.status == 0) {
        this.$message("该用户已被禁用，无法进行修改");
        return;
      }
      this.form.groupId = "";
      this.getInfo(row.userId);
      this.formTitle = "添加";
      this.handleUrl = "/sysUser/add";
      this.dialogFormVisible = true;
    },
    update(index, row) {
      if (row.status == 0) {
        this.$message("该用户已被禁用，无法进行修改");
        return;
      }
      this.getInfo(row.userId);
      this.formTitle = "修改";
      this.handleUrl = "/sysUser/update";
      this.dialogFormVisible = true;
    },
    async getInfo(id) {
      let r = await this._fetch("/sysUser/info/" + id, { method: "GET" });
      console.log(r)
      if (r) {
        this.form = r.sysUserAudit;
      }
    },
    async handleConfirm() {
      if (this.validator()) {
        return;
      }
      this.form.auditorName = this.form.userName;
      let r = await this._fetch(this.handleUrl, { method: "POST", body: this.form });
      if (r.code === 0) {
        this.$message("操作成功");
        this.query();
      } else {
        this.$message(r.msg);
      }
      this.dialogFormVisible = false;
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/sysUser/list?limit=" +
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
        "/sysUser/list?limit=" +
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
    validator() {
      if (isBlank(this.form.userName)) {
        this.$message("用户名不能为空");
        return true;
      }
      //   if (isBlank(this.user.auditorName)) {
      //     this.$message("审批角色名不能为空");
      //     return true;
      //   }
      if (isBlank(this.form.groupId)) {
        this.$message("所属角色组不能为空");
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
.show-box1 {
  padding-left: 30px;
  .query-box1 {
    padding-top: 15px;
    border-bottom: 1px solid #ddd;
  }
}
</style>

