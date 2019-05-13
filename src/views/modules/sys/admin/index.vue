<template>
  <div class="page-container">
    <div v-show="!switchForm" class="show-box">
      <div class="query-box">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label class="form-item">
            <el-input v-model.trim="formInline.user" placeholder="请输入用户名"/>
          </el-form-item>
          <el-form-item class="form-item">
            <el-button type="info" @click="query">查询</el-button>
            <el-button type="info" @click="clearHandle">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-box">
        <el-button v-if="hasPermission('sys:user:save')" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button v-if="hasPermission('sys:user:delete')" type="danger" icon="el-icon-delete" @click="del">删除</el-button>
      </div>
      <el-dialog title="密码设置" :visible.sync="dialogFormVisible" width="20%" top="30vh" center>
        <el-form :model="user" class="alertbox">
          <el-form-item label="原密码" :label-width="formLabelWidth" v-if="tflag">
            <el-input v-model="user.traPwd"></el-input>
          </el-form-item>
          <el-form-item label="新密码" :label-width="formLabelWidth">
            <el-input v-model="user.newTraPwd"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="setTraPwd">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="20%" top="30vh">
        <span>确定重置审批密码吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="resetTraPwd">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="delTip" width="20%" top="30vh">
        <span>确定要删除选中的记录？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delTip = false">取 消</el-button>
          <el-button type="primary" @click="delConfirm">确 定</el-button>
        </span>
      </el-dialog>
      <div class="tb-box">
        <el-table
          :data="tableData"
          :header-cell-style="rowClass"
          style="width: 100%"
          border
          max-height="600"
          @row-click="getRowData"
          ref="dataTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="index" width="40" align="center"/>
          <el-table-column type="selection" width="45" align="center"/>
          <el-table-column prop="userId" label="用户ID" width="120" align="left"/>
          <el-table-column prop="username" label="用户名" align="left"/>
          <el-table-column prop="email" label="邮箱" align="left"/>
          <el-table-column prop="mobile" label="手机号" align="left"/>
          <el-table-column prop="traPwd" label="审批密码" align="left" v-if="false"/>
          <el-table-column prop="status" label="状态" align="left">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | formatStata}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"/>
          <el-table-column prop label="操作" align="center" width="400">
            <template slot-scope="scope">
              <el-button v-if="hasPermission('sys:user:update')" type="primary" size="mini" @click="update(scope.$index, scope.row)">修改</el-button>
              <el-button
                v-if="hasPermission('sys:user:addOrUpdatePwd')"
                type="primary"
                size="mini"
                @click="uptDraPwd(scope.$index, scope.row)"
              >审批密码设置</el-button>
              <el-button v-if="hasPermission('sys:user:resetPwd')" type="primary" size="mini" @click="reset(scope.$index, scope.row)">审批密码重置</el-button>
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
        <el-form ref="form" :model="user" label-width="100px">
          <el-form-item label="用户名">
            <el-input
              v-model="user.username"
              placeholder="登录账号"
              name="username"
              :disabled="active"
            />
          </el-form-item>
          <el-form-item label="密码" v-show="!active">
            <el-input v-model="user.password" placeholder="密码" name="password"/>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="user.email" placeholder="邮箱" name="email"/>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="user.mobile" placeholder="手机号" name="mobile"/>
          </el-form-item>
          <el-form-item v-if="hasPermission('org:dealer:list')" v-show="showDealers" label="所属服务商">
            <el-select v-model="user.dealerId" placeholder="请选择所属服务商" @change="showOrg">
              <el-option
                v-for="item in dealers"
                :label="item.dealerCode"
                :value="item.dealerId"
                :key="item.dealerId"
              />
            </el-select>
            <el-button type="primary" @click="cancelDealers">取消选择</el-button>
          </el-form-item>
          <el-form-item v-if="hasPermission('org:bmorganization:list')" v-show="showOrgSelect" label="所属机构">
            <input type="hidden" v-model="user.orgId">
            <input
              v-model="user.orgName"
              placeholder="请点击查询所属机构"
              class="input"
              @click="showOrgTree"
            >
            <el-button type="primary" @click="cancelOrg">取消选择</el-button>
          </el-form-item>
          <el-form-item v-show="showOrgList" label="选择机构">
            <ul id="menuTree" class="ztree"/>
          </el-form-item>
          <el-form-item label="超管子账号" v-if="showSuperUser">
            <el-checkbox-group v-model="user.userType" @change="changeType">
              <el-checkbox label name="type"/>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="角色">
            <el-checkbox-group v-model="user.roleIdList" @change="selectRoleList">
              <el-checkbox
                v-for="item in checkAbleRoleList"
                :key="item.roleId"
                :label="item.roleId"
              >{{item.roleName}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="user.status">
              <el-radio label="0">禁用</el-radio>
              <el-radio label="1">正常</el-radio>
            </el-radio-group>
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
      formInline: {
        user: "",
        region: ""
      },
      tableData: [],
      rowData: {}, //选中行数据
      multipleSelection: [],
      page: {
        pageSize: 50,
        total: 0,
        currentPage: 1
      },
      tflag: false,
      switchForm: false, //切换form表单
      showDealers: true, //显示服务商列表
      showOrgSelect: true, //显示机构选框
      showOrgList: false, //显示机构树
      showSuperUser: false,
      active: false,
      user: {},
      panelTitle: "",
      dealers: [],
      roleList: [],
      checkAbleRoleList: [],
      setting: {
        data: {
          simpleData: {
            enable: true,
            idKey: "orgId",
            pIdKey: "parentId"
            // rootPId: -1
          },
          key: {
            url: "nourl",
            name: "orgName"
          }
        },
        callback: {
          onClick: this.setOrg
        }
      },
      orgTree: [],
      dialogFormVisible: false,
      formLabelWidth: "60px",
      showTraPwd: false,
      dialogVisible: false,
      delTip: false,
      isAdmin: false
    };
  },
  // mounted() {
  //   this.initOrgTree();
  // },
  created() {
    this.getAdminList();
    this.getOrgTree();
    this.getRoleList();
  },
  filters: {
    // el-tag类型转换
    statusFilter(status) {
      const statusMap = {
        1: "success",
        2: "danger"
      };
      return statusMap[status];
    },
    // 状态显示转换
    formatStata(status) {
      const statusMap = {
        1: "正常",
        2: "错误"
      };
      return statusMap[status];
    }
  },
  methods: {
    hasPermission(val){
      return hasPermission(val)
    },
    async query() {
      let r = await this._fetch(
        "/sys/user/list?limit=50&page=1&username=" + this.formInline.user,
        { method: "GET" }
      );
      this.tableData = r.page.list;
    },
    clearHandle() {
      this.formInline.user = "";
    },
    add() {
      this.switchForm = true;
      this.panelTitle = "新增用户";
      this.isAdmin = false;
      this.active = false;
      this.user = { status: "1", roleIdList: [], traPwd: "" };
      this.getDealerList();
      this.initOrgTree();
    },
    update(index, row) {
      this.switchForm = true;
      this.active = true;
      this.panelTitle = "用户信息更改";
      if (this._adminEd === "true") {
        this.showSuperUser = true;
      } else {
        this.showSuperUser = false;
      }
      this.getUser(row.userId);
    },
    del() {
      if (this.multipleSelection.length < 1) {
        this.$message("请选择一条记录");
        return;
      }
      this.delTip = true;
    },
    uptDraPwd() {
      this.dialogFormVisible = true;
      if (isBlank(this.rowData.traPwd)) {
        //无审批密码，添加
        this.tflag = false;
      } else {
        //有审批密码，修改
        this.tflag = true;
      }
      this.user.traPwd = "";
      this.user.newTraPwd = "";
    },
    reset() {
      this.dialogVisible = true;
    },
    onSubmit() {
      if (this.validator()) {
        return;
      }
      this.user.adminEd = this.isAdmin;
      var url =
        this.user.userId == null ? "/sys/user/save" : "/sys/user/update";
      this.addUser(url);
    },
    async addUser(url) {
      let r = await this._fetch(url, {
        method: "POST",
        body: this.user
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.getAdminList();
        this.switchForm = false;
      } else {
        this.$message(r.msg);
      }
    },
    reback() {
      this.switchForm = false;
    },
    showOrg() {
      this.showOrgSelect = false;
    },
    cancelDealers() {
      this.showOrgSelect = true;
      this.user.dealerId = "";
    },
    showOrgTree() {
      this.showDealers = false;
      this.showOrgList = true;
    },
    cancelOrg() {
      this.showDealers = true;
      this.showOrgList = false;
      this.user.orgId = "";
      this.user.orgName = "";
    },
    async getOrgTree() {
      this.orgTree = await this._fetch("/org/bmorganization/list?_=123", {
        method: "GET"
      });
    },
    initOrgTree() {
      const ztree = $.fn.zTree.init($("#menuTree"), this.setting, this.orgTree);
      // 展开所有节点
      ztree.expandAll(false);
    },
    //选中节点
    setOrg(event, treeId, treeNode, clickFlag) {
      this.user.orgName = treeNode.orgName;
      this.user.orgId = treeNode.orgId;
      this.showDealers = false;
      this.showOrgList = !this.showOrgList;
    },
    getOrgSelected() {
      if (this.user.orgId !== undefined) {
        this.orgTree.forEach(value => {
          if (this.user.orgId + "" === value.orgId) {
            this.user.orgName = value.orgName;
          }
        });
      }
    },
    async getAdminList() {
      let r = await this._fetch("/sys/user/list?limit=50&page=1", {
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
    getRowData(row) {
      this.$refs.dataTable.toggleRowSelection(row);
      this.rowData = row;
      this.user.userId = this.rowData.userId;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.user.userIds = [];
      this.multipleSelection.forEach(item => {
        this.user.userIds.push(item.userId);
      });
      this.rowData = this.multipleSelection[0];
      if (this.rowData) {
        this.user.userId = this.rowData.userId;
      }
    },
    async setTraPwd() {
      if (this.tflag) {
        if (isBlank(this.user.traPwd)) {
          this.$message("原密码不能为空");
          return;
        }
        if (isBlank(this.user.newTraPwd)) {
          this.$message("新密码不能为空");
          return;
        }
      } else {
        if (isBlank(this.user.newTraPwd)) {
          this.$message("密码不能为空");
          return;
        }
      }
      if (
        !(this.user.newTraPwd.length > 5 && this.user.newTraPwd.length < 21)
      ) {
        this.$message("请输入6-20位密码");
        return;
      }
      let r = await this._fetch("/sys/user/addOrUpdatePwd", {
        method: "POST",
        body: this.user
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.dialogFormVisible = false;
      } else {
        this.$message(r.msg);
      }
    },
    async resetTraPwd() {
      this.user = {};
      this.user.userId = this.rowData.userId;
      this.user.traPwd = " ";
      let r = await this._fetch("/sys/user/reset", {
        method: "POST",
        body: this.user
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.dialogVisible = false;
      } else {
        this.$message(r.msg);
      }
    },
    async delConfirm() {
      let r = await this._fetch("/sys/user/delete", {
        method: "POST",
        body: this.user.userIds
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.getAdminList();
        this.delTip = false;
      } else {
        this.$message(r.msg);
      }
    },
    async getUser(userId) {
      let r = await this._fetch("/sys/user/info/" + userId + "?_=123", {
        method: "GET"
      });
      if (r) {
        this.user = r.user;
        this.user.status = r.user.status.toString();
        this.user.password = null;
        this.user.traPwd = null;
        this.isAdmin = this.user.userType == 0 ? true : false;;
        // this.isAdmin = this.user.userType == 0 ? true : false;
        this.initOrgTree();
        this.getDealerList(this.user.dealerId);
        this.getOrgSelected();
        this.selectRoleList();
      }
    },
    async getRoleList() {
      let r = await this._fetch("/sys/role/select", { method: "GET" });
      this.roleList = r.list;
      this.selectRoleList();
    },
    selectRoleList(item) {
      this.checkAbleRoleList = new Array();
      // if (this.isAdmin) {
      //   for (var i = 0; i < this.roleList.length; i++) {
      //     if (this.roleList[i].roleType === 0) {
      //       this.checkAbleRoleList.push(this.roleList[i]);
      //     }
      //   }
      // } else {
      //   for (var i = 0; i < this.roleList.length; i++) {
      //     if (this.roleList[i].roleType === 1) {
      //       this.checkAbleRoleList.push(this.roleList[i]);
      //     }
      //   }
      // }
        for(var i = 0;i < this.roleList.length; i++){
          this.checkAbleRoleList.push(this.roleList[i]);
        }
    },
    changeType(item) {
      console.log(item);
    },
    async getDealerList(dealerId) {
      let r = await this._fetch("/org/dealer/ids", { method: "POST" });
      if (r) {
        this.dealers = r.dealers;
        if (this.user.dealerId) {
          this.user.dealerId = dealerId.toString(); //this.user.dealerId为字符串类型
        }
      }
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/sys/user/list?limit=" + val + "&page=" + this.page.currentPage,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/sys/user/list?limit=" + this.page.pageSize + "&page=" + val,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.currentPage = val;
    },
    validator() {
      if (isBlank(this.user.username)) {
        this.$message("用户名不能为空");
        return true;
      }

      if (this.user.userId == null && isBlank(this.user.password)) {
        this.$message("密码不能为空");
        return true;
      }
      var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
      if (!isBlank(this.user.email) && !reg.test(this.user.email)) {
        this.$message("邮箱格式不正确");
        return true;
      }
      if (!isBlank(this.user.mobile)) {
        if (!/^1[34578]\d{9}$/.test(this.user.mobile)) {
          this.$message("手机号格式不正确");
          return true;
        }
      }
    },
    //表头居中
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
.input.input {
  padding-left: 14px;
}
.input::-webkit-input-placeholder {
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

