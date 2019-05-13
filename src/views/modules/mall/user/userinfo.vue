<template>
  <div class="page-container">
    <div class="show-box" v-show="!switchForm">
      <div class="query-box">
        <el-form :inline="true" :model="q" class="demo-form-inline">
          <el-form-item label="用户名" class="form-item">
            <el-input v-model.trim="q.username" placeholder="请输入用户名"/>
          </el-form-item>
          <el-form-item label="商家" class="form-item">
            <el-select v-model="q.region" placeholder="选择商家">
              <el-option
                v-for="item in dealerList"
                :label="item.dealerName"
                :value="item.dealerId"
                :key="item.dealerId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="form-item">
            <el-button type="info" @click="query">查询</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-box">
        <el-button  v-if="hasPermission('dfmalluserlevelinfo:save')" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button v-if="hasPermission('dfmalluserlevelinfo:update')" type="primary" icon="el-icon-edit-outline" @click="update">修改</el-button>
        <el-button v-if="hasPermission('dfmalluserlevelinfo:delete')" type="danger" icon="el-icon-delete" @click="del">删除</el-button>
      </div>
      <div class="tb-box">
        <el-table
          :data="tableData"
          :header-cell-style="rowClass"
          style="width: 100%"
          border
          max-height="700"
          @row-click="getRowData"
          ref="dataTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="index" width="40" align="center"/>
          <el-table-column type="selection" width="45" align="center"/>
          <el-table-column prop="u_user_logincode" label="登录账号" align="left" width="350"/>
          <el-table-column prop="user_name" label="用户名" align="left"/>
          <el-table-column prop="levelName" label="用户等级" align="left"/>
          <el-table-column prop="u_is_serialcode" label="是否有推荐码" align="left">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.u_is_serialcode | codeFilter"
              >{{scope.row.u_is_serialcode | formatCode}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="u_is_risk" label="是否同意签订风险揭示书" align="left">
            <template slot-scope="scope">
              <el-tag :type="scope.row.u_is_risk | codeFilter">{{scope.row.u_is_risk | formatCode}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="u_is_auth" label="是否实名认证" align="left">
            <template slot-scope="scope">
              <el-tag :type="scope.row.u_is_auth | codeFilter">{{scope.row.u_is_auth | formatCode}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="gmt_create" label="数据插入时间" align="center" width="200"/>
          <el-table-column prop="gmtModified" label="数据修改时间" align="center" width="200"/>
          <el-table-column prop="remarks" label="备注" align="left" width="200"/>
        </el-table>
      </div>
      <el-dialog title="提示" :visible.sync="delTip" width="20%" top="30vh">
        <span>确定要删除选中的记录？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delTip = false">取 消</el-button>
          <el-button type="primary" @click="delConfirm">确 定</el-button>
        </span>
      </el-dialog>
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
          <el-form-item label="登录账号">
            <el-input v-model="user.uuserLogincode" placeholder="登录账号" name="username" :disabled="edit"/>
          </el-form-item>
          <el-form-item label="用户级别id">
            <el-select v-model="user.ulevelId" :disabled="edit">
              <el-option v-for="item in levels" :label="item.ulLevelName" :value="item.ulId" :key="item.ulId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否有推荐码">
            <el-radio-group v-model="user.uisSerialcode" :disabled="edit">
              <el-radio label="0">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否同意签订风险揭示书">
            <el-radio-group v-model="user.uisRisk" :disabled="edit">
              <el-radio label="0">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否实名认证">
            <el-radio-group v-model="user.uisAuth" :disabled="edit">
              <el-radio label="0">否</el-radio>
              <el-radio label="1">是</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="user.remarks" placeholder="备注" name="remark"/>
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
import { hasPermission } from "@/utils";
export default {
  data() {
    return {
      labelPosition: "right",
      q: {
        username: "",
        region: "",
        type: ""
      },
      activeNames: [],
      tableData: [],
      page: {
        pageSize: 50,
        total: 0,
        currentPage: 1
      },
      dealerList: [],
      queryParams: "",
      switchForm:false,
      panelTitle:'',
      user:{},
      levels:[],
      edit:false,
      multipleSelection:[],
      delTip:false
    };
  },
  filters: {
    codeFilter(status) {
      if (status == 1) {
        return "success";
      } else {
        return "danger";
      }
    },
    formatCode(status) {
      if (status == 1) {
        return "是";
      } else {
        return "否";
      }
    }
  },
  created() {
    this.getDealerList();
    this.getLevels();
  },
  methods: {
    hasPermission(val){
      return hasPermission(val)
    },
    async query() {
      this.queryParams = "&username=" + this.q.username;
      let r = await this._fetch(
        "/dfmalluserinfo/list?limit=50&page=1" + this.queryParams,
        { method: "GET" }
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
      this.q.username = '';
    },
    add() {
      this.switchForm = true;
      this.panelTitle = "新增用户";
      this.edit = false;
    },
    update() {
      if (this.multipleSelection.length != 1) {
        this.$message("请选择一条记录");
        return;
      }
      this.switchForm = true;
      this.panelTitle = "用户信息更改";
      this.edit = true;
      this.getInfo(this.user.id);
    },
    del() {
      if (this.multipleSelection.length < 1) {
        this.$message("请选择一条记录");
        return;
      }
      this.delTip = true;
    },
    async delConfirm() {
      let r = await this._fetch("/dfmalluserinfo/delete", {
        method: "POST",
        body: this.user.Ids
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.query();
        this.delTip = false;
      } else {
        this.$message(r.msg);
      }
    },
    onSubmit(){
      var url =
        this.user.id == null ? "/dfmalluserinfo/save" : "/dfmalluserinfo/update";
      this.addUser(url);
    },
    async addUser(url) {
      let r = await this._fetch(url, {
        method: "POST",
        body: this.user
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.query();
        this.switchForm = false;
      } else {
        this.$message(r.msg);
      }
    },
    reback(){
      this.switchForm = false;
    },
    async getDealerList() {
      let r = await this._fetch("/org/dealer/ids", { method: "POST" });
      if (r.code != 0) {
        this.$message(r.msg);
        return;
      }
      this.dealerList = r.dealers;
    },
    async getLevels(){
      let r = await this._fetch('/dfmalluserlevelinfo/getLevels/',{method:'GET'});
      this.levels = r.list;
    },
    async getInfo(id){
      let r = await this._fetch('/dfmalluserinfo/info/' + id,{method:'GET'});
      if(r){
        this.user = r.dfMallUserInfo;
        this.user.uisSerialcode = r.dfMallUserInfo.uisSerialcode.toString();
        this.user.uisRisk = r.dfMallUserInfo.uisRisk.toString();
        this.user.uisAuth = r.dfMallUserInfo.uisAuth.toString();
      }else{
        this.$message(r.msg)
      }
    },
    getRowData(row) {
      console.log(row)
      this.$refs.dataTable.toggleRowSelection(row);
      this.rowData = row;
      this.user.id = this.rowData.id;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.user.Ids = [];
      this.multipleSelection.forEach(item => {
        this.user.Ids.push(item.id);
      });
      this.rowData = this.multipleSelection[0];
      if (this.rowData) {
        this.user.id = this.rowData.id;
      }
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/dfmalluserinfo/list?limit=" +
          val +
          "&page=" +
          this.page.currentPage +
          this.queryParams,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/dfmalluserinfo/list?limit=" +
          this.page.pageSize +
          "&page=" +
          val +
          this.queryParams,
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

