<template>
  <div class="page-container">
    <div v-show="!switchForm" class="show-box">
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
        >
          <el-table-column type="index" width="40" align="center"/>
          <el-table-column prop="userUid" label="用户标识" align="left" width="120"/>
          <el-table-column prop="bankCardSerialNo" label="绑定标识" align="left" width="200"/>
          <el-table-column prop="id" label="审核订单ID" align="left" width="100"/>
          <el-table-column prop="amt" label="提现金额" align="left" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.amt | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="申请人备注信息" align="left" width="200" :show-overflow-tooltip="true"/>
          <el-table-column prop="withdrawSerialOrderNo" label="提现业务流水号" align="left" width="200"/>
          <el-table-column prop="requestNo" label="请求流水号" align="left" width="200"/>
          <el-table-column prop="withdrawOrderNo" label="提现单号" align="left" width="200"/>
          <el-table-column prop="name" label="审核账号" align="left" width="120"/>
          <el-table-column prop="createTime" label="申请时间" align="center" width="200"/>
          <el-table-column prop="" label="操作" align="center" width="120">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="approval(scope.$index, scope.row)">审批</el-button>
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
        <el-form ref="config" :model="checkConfig" label-width="120px">
          <el-form-item label="用户标识">
            <el-input v-model="checkConfig.userUid" placeholder="用户标识" disabled/>
          </el-form-item>
          <el-form-item label="提现业务流水号">
            <el-input v-model="checkConfig.withdrawSerialOrderNo" placeholder="提现业务流水号" disabled/>
          </el-form-item>
          <el-form-item label="提现金额">
            <el-input v-model="checkConfig.amt" placeholder="提现金额" disabled/>
          </el-form-item>
          <el-form-item label="申请人备注信息">
            <el-input v-model="checkConfig.remark" placeholder="申请人备注信息" disabled/>
          </el-form-item>
          <el-form-item label="审核账号">
            <el-input v-model="checkConfig.userName" placeholder="审核账号" disabled/>
          </el-form-item>
          <el-form-item label="审核订单id">
            <el-input v-model="checkConfig.id" placeholder="审核订单id" disabled/>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input type="textarea" v-model="checkConfig.result" placeholder="备注信息"/>
          </el-form-item>
          <el-form-item label="审核意见">
            <el-radio-group v-model="checkConfig.approvalStatus">
              <el-radio label="true">同意</el-radio>
              <el-radio label="false">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button type="warning" @click="reback">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog title="审核" :visible.sync="dialogFormVisible" width="25%" top="30vh" center>
        <el-form :model="checkConfig" class="alertBox">
          <el-form-item label="提现业务流水号" :label-width="formLabelWidth">
            <el-input v-model="checkConfig.withdrawSerialOrderNo" placeholder="提现业务流水号" disabled></el-input>
          </el-form-item>
          <el-form-item label="审批密码" :label-width="formLabelWidth">
            <el-input v-model="checkConfig.traPwd" placeholder="请输入6-20位交易密码" onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button v-if="hasPermission('corporate:audit:approve')" type="primary" @click="approvalConfirm">确 定</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
      <el-dialog title="提示" :visible.sync="subTip" width="20%" top="30vh">
        <span>确定提交？</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="subConfirm">确 定</el-button>
          <el-button @click="subTip = false">取 消</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
import { isBlank,hasPermission } from "@/utils";
export default {
  data() {
    return {
      formInline: {
        key: ""
      },
      tableData: [],
      multipleSelection: [],
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      switchForm: false,
      subTip:false,
      panelTitle: "",
      checkConfig:{
        approvalStatus:''
      },
      dialogFormVisible:false,
      formLabelWidth:'120px',
      auditorName:'',
      delTip:false
    };
  },
  filters:{
    rounding(value) {
      return (value/100).toFixed(2);
    },
  },
  created() {
    this.getDataList();
    this.getAuditUser();
  },
  methods: {
    hasPermission(val){
      return hasPermission(val)
    },
    approval(index,row) {
      this.switchForm = true;
      this.panelTitle = "审批";
      this.checkConfig = row;
      this.checkConfig.userName = this.auditorName;
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
    onSubmit() {
      console.log(this.checkConfig.staus)
      if(!this.checkConfig.approvalStatus){
        this.$message('请选择审核意见');
        return;
      }
      if(isBlank(this.checkConfig.result)){
        this.$message('备注信息不能为空');
        return;
      }
      this.checkConfig.traPwd = '';
      this.dialogFormVisible = true;
    },
    approvalConfirm(){
      this.subTip = true;
    },
    async subConfirm() {
      let r = await this._fetch('/corporate/withdrawal/approve', {
        method: "POST",
        body: this.checkConfig
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.getDataList();
      } else {
        this.$message(r.msg);
      }
        this.switchForm = false;
        this.subTip = false;
        this.dialogFormVisible = false;
    },
    reback() {
      this.switchForm = false;
    },
    async getDataList() {
      let r = await this._fetch("/corporate/withdrawal/queryauditlist?limit=10&page=1", {
        method: "GET"
      });
      if (r.code === 0) {
        this.tableData = r.page.list;
        this.page.total = r.page.totalCount;
        this.page.pageSize = r.page.pageSize;
      } else {
        console.log(r.msg)
      }
    },
    async getAuditUser() {
      let r = await this._fetch("/auditOrder/sysUser", { method: "GET" });
      this.auditorName = r.sysUserAudit.auditorName;
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/corporate/withdrawal/queryauditlist?limit=" + val + "&page=" + this.page.currentPage,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/corporate/withdrawal/queryauditlist?limit=" + this.page.pageSize + "&page=" + val,
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
.el-dialog__body {
  form {
    border:none;
  }
}
</style>

