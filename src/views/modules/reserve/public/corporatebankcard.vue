<template>
  <div class="page-container">
    <div v-show="!switchForm" class="show-box">
      <div class="query-box">
        <el-form :inline="true" :model="q" class="demo-form-inline">
          <el-form-item
            label="机构名称"
            class="form-item"
            v-if="hasPermission('corporate:bankcard:getOrgIds')"
          >
            <el-select v-model="q.orgId" placeholder="选择机构名称">
              <el-option
                v-for="item in orgIds"
                :label="item.orgName"
                :value="item.orgId"
                :key="item.orgCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="form-item">
            <el-button v-if="hasPermission('corporate:bankcard:list')" type="info" @click="query">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-box">
        <el-button
          v-if="hasPermission('corporate:bankcard:bindcard')"
          type="primary"
          icon="el-icon-plus"
          @click="add"
        >绑卡</el-button>
      </div>
      <el-dialog title="提现密码" :visible.sync="pswTip" width="20%" top="30vh">
        <el-form>
          <el-form-item label="loginCode" :label-width="formLabelWidth">
            <el-input v-model="loginCode" placeholder="loginCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" class="wd-form">
            <el-input v-model="wdPsw" placeholder="请输入6-20字母数字密码"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="wdConfirm">确 定</el-button>
          <el-button @click="pswTip = false">取 消</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提现" :visible.sync="dialogFormVisible" width="25%" top="30vh" center>
        <el-form :model="applyData" class="alertBox">
          <el-form-item label="用户标识" :label-width="formLabelWidth">
            <el-input v-model="applyData.userUid" placeholder="用户标识" disabled></el-input>
          </el-form-item>
          <el-form-item label="绑定标识" :label-width="formLabelWidth">
            <el-input v-model="applyData.bankCardSerialNo" placeholder="绑定标识" disabled></el-input>
          </el-form-item>
          <el-form-item label="可出金额" :label-width="formLabelWidth">
            <el-input v-model="applyData.allowWithdrawal" placeholder="可出金额" disabled></el-input>
          </el-form-item>
          <el-form-item label="提现金额" :label-width="formLabelWidth">
            <el-input v-model="applyData.amt" placeholder="输入金额不能小于5元（允许两位小数）" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="备注信息" :label-width="formLabelWidth">
            <el-input type="textarea" v-model="applyData.remark" placeholder="备注信息"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="withdrawConfirm">确 定</el-button>
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
          <!-- <el-table-column type="selection" width="45" align="center"/> -->
          <el-table-column prop="bindId" label="绑定标识" align="left" width="200"/>
          <el-table-column prop="userUid" label="用户标识" align="left" width="180"/>
          <el-table-column prop="bankAccountType" label="账号类型" align="left" width="120"/>
          <el-table-column prop="channelType" label="渠道编号" align="left" width="120"/>
          <el-table-column prop="bankAccountName" label="公司名称" align="left" width="180"/>
          <el-table-column prop="province" label="所属省" align="left" width="120"/>
          <el-table-column prop="city" label="所属市" align="left" width="120"/>
          <el-table-column prop="bankName" label="银行卡名称" align="left" width="120"/>
          <el-table-column prop="bankAccountNo" label="银行卡号" align="left" width="200"/>
          <el-table-column prop="bankAccountAddress" label="银行卡支行地址" align="left" width="200"/>
          <el-table-column prop label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button
                v-if="hasPermission('corporate:bankcard:unbindcard')"
                type="danger"
                size="mini"
                @click="updateHandle(scope.$index, scope.row)"
              >解绑</el-button>
              <el-button v-show="!isAdmin" v-if="hasPermission('corporate:withdrawal:apply')" type="primary" size="mini" @click="withdrawl(scope.$index, scope.row)">提现</el-button>
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
        <el-form ref="config" :model="optData" label-width="120px">
          <el-form-item label="用户标识" v-show="!flag">
            <el-input v-model="optData.userUid" placeholder="用户标识" :disabled="!flag"/>
          </el-form-item>
          <el-form-item label="公司名称">
            <el-input v-model="optData.bankAccountName" placeholder="公司名称" :disabled="!flag"/>
          </el-form-item>
          <el-form-item label="所属省">
            <el-input v-model="optData.province" placeholder="所属省" :disabled="!flag"/>
          </el-form-item>
          <el-form-item label="所属市">
            <el-input v-model="optData.city" placeholder="所属市" :disabled="!flag"/>
          </el-form-item>
          <el-form-item label="银行名称">
            <el-select v-model="optData.bankCode" placeholder="选择银行名称" :disabled="!flag">
              <el-option
                v-for="item in bankCodes"
                :label="item.bankName"
                :value="item.bankCode"
                :key="item.bankCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="机构名称" v-show="flag">
            <el-select v-model="optData.orgId" placeholder="选择机构名称" :disabled="!flag">
              <el-option
                v-for="item in orgIds"
                :label="item.orgName"
                :value="item.orgId"
                :key="item.orgId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="银行卡号">
            <el-input v-model="optData.bankAccountNo" placeholder="银行卡号" :disabled="!flag"/>
          </el-form-item>
          <el-form-item label="银行卡支行地址">
            <el-input v-model="optData.bankAccountAddress" placeholder="银行卡支行地址" :disabled="!flag"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">提交</el-button>
            <el-button type="warning" @click="reback">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { isBlank, hasPermission } from "@/utils";
var adminEd = localStorage.getItem("adminEd");
export default {
  data() {
    return {
      q: {
        orgId: ""
      },
      tableData: [],
      multipleSelection: [],
      page: {
        pageSize: 10,
        total: 1,
        currentPage: 1
      },
      isAdmin: false,
      switchForm: false,
      subTip: false,
      optData: {},
      panelTitle: "",
      orgIds: [],
      bankCodes: [],
      flag: false,
      applyData: {},
      dialogFormVisible: false,
      formLabelWidth: "80px",
      pswTip: false,
      loginCode: "",
      wdPsw: ""
    };
  },
  created() {
    this.getOrgIds();
    this.getBankCodes();
    this.isAdmin = adminEd === "true" ? true : false;
  },
  methods: {
    hasPermission(val) {
      return hasPermission(val);
    },
    async query() {
      if (this.isAdmin) {
        if (isBlank(this.q.orgId)) {
          this.$message("机构名称不能为空");
          return;
        }
      }
      let r = await this._fetch(
        "/corporate/bankcard/list?limit=50&page=1&orgId=" + this.q.orgId,
        { method: "GET" }
      );
      if (r.code === 0) {
        this.tableData = r.page;
      } else {
        this.$message(r.msg);
      }
    },
    clearHandle() {
      this.formInline.key = "";
    },
    add() {
      this.switchForm = true;
      this.panelTitle = "绑卡";
      this.optData = {};
      this.flag = true;
    },
    async getOrgIds() {
      let r = await this._fetch("/corporate/bankcard/getOrgIds", {
        method: "GET"
      });
      this.loginCode = r.data[0].loginCode;
      this.orgIds = r.data;
      // this.applyData.allowWithdrawal = this.orgIds[0].allowWithdrawal; //可出金额
    },
    async getBankCodes() {
      let r = await this._fetch("/corporate/bankcard/getBankCodes", {
        method: "GET"
      });
      this.bankCodes = r.data;
    },
    updateHandle(index, row) {
      this.optData = row;
      this.optData.id = row.userUid;
      this.switchForm = true;
      this.panelTitle = "解绑";
      this.flag = false;
    },
    onSubmit() {
      if (this.validator()) {
        return;
      }
      this.bankCodes.map(item => {
        if (this.optData.bankCode == item.bankCode) {
          this.optData.bankName = item.bankName;
        }
      });
      var url =
        this.optData.id == null
          ? "/corporate/bankcard/bindcard"
          : "/corporate/bankcard/unbindcard";
      this.addUser(url);
    },
    async addUser(url) {
      let r = await this._fetch(url, {
        method: "POST",
        body: this.optData
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
    withdrawl(index, row) {
      this.applyData.bankCardSerialNo = row.bindId;
      this.applyData.userUid = row.userUid;
      this.wdPsw = "";
      this.pswTip = true;
      this.orgIds.forEach(item => {
        if (this.q.orgId == item.orgId) {
          this.loginCode = item.loginCode;
        }
      });
    },
    async wdConfirm() {
      if (isBlank(this.wdPsw)) {
        this.$message("提现密码不能为空");
        return;
      }
      if (!/^[a-zA-Z0-9]{6,20}$/.test(this.wdPsw)) {
        this.$message("密码格式不对");
        return;
      }
      let subData = { loginCode: this.loginCode, password: this.wdPsw };
      let r = await this._fetch("/corporate/bankcard/getAllowWithdrawal", {
        method: "POST",
        body: subData
      });
      if (r.rc === 200) {
        this.dialogFormVisible = true;
        this.pswTip = false;
        this.applyData.allowWithdrawal = r.data[0].amWithdrawable;
      } else {
        this.$message(r.msg);
      }
    },
    withdrawConfirm() {
      if (this.validator2()) {
        return;
      }
      var amtNum = parseFloat(this.applyData.amt) * 100;
      var amtCount = amtNum.toFixed(0);
      this.applyData.withdrawlAmt = amtCount.toString();
      this.subConfirm();
    },
    async subConfirm() {
      console.log(123);
      let r = await this._fetch("//corporate/withdrawal/preapplication", {
        method: "POST",
        body: this.applyData
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.query();
        this.pswTip = false;
        this.dialogFormVisible = false;
      } else {
        this.$message(r.msg);
      }
      this.subTip = false;
    },
    validator() {
      if (!this.flag) {
        //绑卡时验证
        if (isBlank(this.optData.userUid)) {
          this.$message("用户标识不能为空");
          return true;
        }
      }
      if (!/^[A-Za-z0-9]+$/.test(this.optData.bankAccountNo)) {
        this.$message("请输入正确的银行卡号");
        return true;
      }
      if (isBlank(this.optData.bankAccountName)) {
        this.$message("公司名称不能为空");
        return true;
      }
      if (isBlank(this.optData.province)) {
        this.$message("所属省不能为空");
        return true;
      }
      if (isBlank(this.optData.city)) {
        this.$message("所属市不能为空");
        return true;
      }
      if (this.flag) {
        if (isBlank(this.optData.bankCode)) {
          this.$message("银行名称不能为空");
          return true;
        }
        if (isBlank(this.optData.orgId)) {
          this.$message("机构名称不能为空");
          return true;
        }
      }
      if (isBlank(this.optData.bankAccountNo)) {
        this.$message("银行卡号不能为空");
        return true;
      }
      if (isBlank(this.optData.bankAccountAddress)) {
        this.$message("银行卡支行地址不能为空");
        return true;
      }
    },
    validator2() {
      if (isBlank(this.applyData.amt)) {
        this.$message("提现金额不能为空");
        return true;
      }
      if (this.applyData.amt < 5) {
        this.$message("提现金额不能小于5元");
        return true;
      }
      if (!/^[0-9]+([.]{1}[0-9]{1,2})?$/.test(this.applyData.amt.trim())) {
        this.$message("输入金额只允许两位小数");
        this.applyData.amt = "";
        this.this.$messageTip = false;
        this.this.$messageTip = true;
        return true;
      }
      if (!parseFloat(this.applyData.amt)) {
        this.$message("提现金额不能为0");
        return true;
      }
      if (this.applyData.amt > this.applyData.allowWithdrawal) {
        this.$message("提现金额不能大于可出金额");
        return true;
      }
      if (isBlank(this.applyData.remark)) {
        this.$message("备注信息不能为空");
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

