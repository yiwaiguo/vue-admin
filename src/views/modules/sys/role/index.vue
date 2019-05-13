<template>
  <div class="page-container">
    <div v-show="!switchForm" class="show-box">
      <div class="query-box">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label class="form-item">
            <el-input v-model.trim="formInline.roleName" placeholder="请输入角色名称"/>
          </el-form-item>
          <el-form-item class="form-item">
            <el-button type="info" @click="query">查询</el-button>
            <el-button type="info" @click="clearHandle">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-box">
        <el-button v-if="hasPermission('sys:role:save')" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button v-if="hasPermission('sys:role:delete')" type="danger" icon="el-icon-delete" @click="del">删除</el-button>
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
          <el-table-column prop="roleId" label="角色ID" align="left" width="200"/>
          <el-table-column prop="roleName" label="角色名称" align="left" width="300"/>
          <el-table-column prop="remark" label="备注" align="left"/>
          <el-table-column prop="createTime" label="创建时间" align="center"/>
          <el-table-column prop="" label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-if="hasPermission('sys:role:update')" type="primary" size="mini" @click="update(scope.$index, scope.row)">修改</el-button>
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
        <el-form ref="role" :model="role" label-width="100px">
          <el-form-item label="角色名称">
            <el-input v-model="role.roleName" placeholder="角色名称"/>
          </el-form-item>
          <el-form-item label="超管角色" v-if="showSuperRole">
            <el-checkbox-group v-model="role.roleType" @change="selectRoleType">
              <el-checkbox label name="type" :disabled="isUpdate"/>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="role.remark" placeholder="备注"/>
          </el-form-item>
          <el-form-item label="授权">
            <ul id="menuTree" class="ztree"/>
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
var ztree;
export default {
  data() {
    return {
      formInline: {
        roleName: ""
      },
      tableData: [],
      isAdminRole: false,
      isUpdate: false,
      showSuperRole: false,
      multipleSelection: [],
      page: {
        pageSize: 50,
        total: 0,
        currentPage: 1
      },
      switchForm: false,
      delTip: false,
      role: {},
      panelTitle: "",
      setting: {
        data: {
          simpleData: {
            enable: true,
            idKey: "menuId",
            pIdKey: "parentId",
            rootPId: -1
          },
          key: {
            url: "nourl"
          }
        },
        check: {
          enable: true,
          nocheckInherit: true
        }
      },
      orgTree: []
    };
  },
  created() {
    this.getRoleList();
    this.getOrgTree();
  },
  methods: {
    hasPermission(val){
      return hasPermission(val)
    },
    async query() {
      let r = await this._fetch(
        "/sys/role/list?limit=50&page=1&roleName=" + this.formInline.roleName,
        { method: "GET" }
      );
      this.tableData = r.page.list;
    },
    clearHandle() {
      this.formInline.roleName = "";
    },
    add() {
      this.isUpdate = false;
      if (this._adminEd === "true") {
        this.showSuperRole = true;
      }
      this.role = {};
      this.switchForm = true;
      this.panelTitle = "新增角色";
      this.initOrgTree();
    },
    //选择超管角色
    selectRoleType(val) {
      if (val) {
        this.isAdminRole = 0;
      } else {
        this.isAdminRole = 1;
      }
    },
    update(index,row) {
      this.isUpdate = true;
      if (this._adminEd === "true") {
        this.showSuperRole = true;
      }
      this.switchForm = true;
      this.panelTitle = "角色信息更改";
      this.initOrgTree(row.roleId);
    },
    del() {
      if (this.multipleSelection.length < 1) {
        this.$message("请选择一条记录");
        return;
      }
      this.delTip = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.role.roleIds = [];
      this.multipleSelection.forEach(item => {
        this.role.roleIds.push(item.roleId);
      });
      this.rowData = this.multipleSelection[0];
      if (this.rowData) {
        this.role.roleId = this.rowData.roleId;
      }
    },
    getRowData(row) {
      this.$refs.dataTable.toggleRowSelection(row);
      this.rowData = row;
      this.role.roleId = this.rowData.roleId;
    },
    onSubmit() {
      if (isBlank(this.role.roleName)) {
        this.$message("角色名不能为空");
        return true;
      }
      var nodes = ztree.getCheckedNodes(true);
      var menuIdList = new Array();
      for (var i = 0; i < nodes.length; i++) {
        menuIdList.push(nodes[i].menuId);
      }
      this.role.menuIdList = menuIdList;
      this.role.roleType = this.isAdminRole ? 0 : 1;
      var url =
        this.role.roleId == null ? "/sys/role/save" : "/sys/role/update";
      this.addUser(url);
    },
    async addUser(url) {
      let r = await this._fetch(url, {
        method: "POST",
        body: this.role
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.getRoleList();
        this.switchForm = false;
      } else {
        this.$message(r.msg);
      }
    },
    async delConfirm() {
      let r = await this._fetch("/sys/role/delete", {
        method: "POST",
        body: this.role.roleIds
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.getRoleList();
        this.delTip = false;
      } else {
        this.$message(r.msg);
      }
    },
    reback() {
      this.switchForm = false;
    },
    async getOrgTree() {
      this.orgTree = await this._fetch("/sys/menu/roleMenu?_=123", {
        method: "GET"
      });
    },
    initOrgTree(roleId) {
      // console.log(this.orgTree)
      ztree = $.fn.zTree.init($("#menuTree"), this.setting, this.orgTree);
      // 展开所有节点
      ztree.expandAll(false);
      if (roleId != null) {
        this.getRole(roleId);
      }
    },
    async getRole(roleId) {
      let r = await this._fetch("/sys/role/info/" + roleId, {
        method: "GET"
      });
      this.role = r.role;
      this.isAdminRole = r.role.roleType == 0 ? true : false;
      //勾选角色所拥有的菜单
      var menuIds = this.role.menuIdList;
      for (var i = 0; i < menuIds.length; i++) {
        var node = ztree.getNodeByParam("menuId", menuIds[i]);
        ztree.checkNode(node, true);
      }
    },
    //选中节点
    setOrg(event, treeId, treeNode, clickFlag) {
      this.user.orgName = treeNode.orgName;
      this.user.orgId = treeNode.orgId;
      this.showDealers = false;
      this.showOrgList = !this.showOrgList;
    },
    async getRoleList() {
      let r = await this._fetch("/sys/role/list?limit=50&page=1", {
        method: "GET"
      });
      this.tableData = r.page.list;
      this.page.total = r.page.totalCount;
      this.page.pageSize = r.page.pageSize;
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/sys/role/list?limit=" + val + "&page=" + this.page.currentPage,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/sys/role/list?limit=" + this.page.pageSize + "&page=" + val,
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

