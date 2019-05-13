<template>
  <div class="page-container">
    <div class="show-box">
      <div class="query-box">
        <el-form :inline="true" :model="q" class="demo-form-inline">
          <el-form-item label="用户名">
            <el-input v-model="q.userName" placeholder="请输入用户名"/>
          </el-form-item>
          <el-form-item label="登录账号">
            <el-input v-model="q.loginCode" placeholder="登录账号"/>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="q.phone" placeholder="请输入用户手机号"/>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-box">
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
        <el-button v-if="hasPermission('sys:user:update')" type="primary" icon="el-icon-edit-outline" @click="update">修改</el-button>
      </div>
      <div class="tb-box">
        <el-table
          ref="dataTable"
          :data="tableData"
          :header-cell-style="rowClass"
          style="width: 100%"
          border
          max-height="700"
          @select="select"
          @row-click="getRowData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="index" width="40" align="center"/>
          <el-table-column type="selection" width="45" align="center"/>
          <el-table-column prop="loginCode" label="登录账号" align="left" width="350"/>
          <el-table-column prop="userName" label="客户姓名" align="left"/>
          <el-table-column prop="phone" label="联系电话" align="left"/>
          <el-table-column prop="levelName" label="用户等级" align="left"/>
          <el-table-column prop="serviceNum" label="所属服务商" align="left"/>
          <el-table-column prop="bmOrgNum" label="所属机构" align="left"/>
          <el-table-column prop="amMarginRemain" label="账户余额" align="right"/>
          <el-table-column prop="intoTime" label="注册时间" align="center" width="280"/>
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

      <el-dialog title="密码设置" :visible.sync="dialogFormVisible" width="20%" top="35vh" center>
        <el-form :model="q" class="alertbox">
          <el-form-item label="原手机号" label-width="80px">
            <el-input v-model="phone" disabled></el-input>
          </el-form-item>
          <el-form-item label="新手机号" label-width="80px">
            <el-input v-model="newPhone" placeholder="请输入新手机号"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { hasPermission } from "@/utils";
export default {
  data() {
    return {
      q: {
        phone:'',
        userName:'',
        loginCode:''
      },
      phone:'',
        userName:'',
        loginCode:'',
        newPhone:'',
      tableData: [],
      multipleSelection:{},
      page: {
        pageSize: 50,
        total: 0,
        currentPage: 1
      },
      dialogFormVisible:false
    };
  },
  created() {
    this.getDataList();
  },
  methods: {
    hasPermission(val){
      return hasPermission(val)
    },
    async query() {
      let r = await this._fetch(
        "/modificationPhoneNum/list?limit=50&page=1&phone=" +
          this.q.phone +
          "&userName=" +
          this.q.userName +
          "&loginCode=" +
          this.q.loginCode,
        { method: "GET" }
      );
      if(r.code === 0){
        this.tableData = r.page.list;
      }else{
        this.$message(r.msg)
      }
    },
    reset() {
      this.q = {
        phone: "",
        userName: "",
        loginCode: ""
      };
    },
    update() {
      if (!this.multipleSelection.phone) {
        this.$message("请选择一条记录");
        return;
      };
      this.newPhone = '';
      this.dialogFormVisible = true;
      this.phone = this.multipleSelection.phone;
      this.loginCode = this.multipleSelection.loginCode;
      this.userName = this.multipleSelection.userName;
    },
    async getDataList() {
      let r = await this._fetch("/modificationPhoneNum/list?limit=50&page=1", {
        method: "GET"
      });
      this.tableData = r.page.list;
      this.page.total = r.page.totalCount;
      this.page.pageSize = r.page.pageSize;
    },
    async saveOrUpdate(){
      let postData = {phone:this.phone,loginCode:this.loginCode,newPhone:this.newPhone,userName:this.userName};
      let r = this._fetch('/modificationPhoneNum/update',{
        method:'POST',
        body:postData
      });
      if(r.status == 200){
        this.$message('操作成功,修改号码五分钟内刷新');
        this.query();
      }else{
        this.$message('手机号已存在，请重新输入')
      }
    },
    select(selection, row) {
      if (selection.length > 1) {
        selection.shift();
      }
      this.multipleSelection = row;
    },
    //限制全选
    handleSelectionChange(val){
      if(val.length > 2){
        this.$message('请选择一条记录');
        this.$refs.dataTable.clearSelection()
      }
    },
    getRowData(row) {
      this.$refs.dataTable.toggleRowSelection(row);
      this.multipleSelection = row;
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/modificationPhoneNum/list?limit=" + val + "&page=" + this.page.currentPage,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/modificationPhoneNum/list?limit=" + this.page.pageSize + "&page=" + val,
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
.query-box {
  .el-form-item {
    margin-bottom: 0;
  }
}
form {
  padding-bottom: 15px;
  border-bottom: 1px solid #ddd;
}
.btn-box {
  padding-top: 15px;
}
</style>

