<template>
  <div class="page-container">
    <div class="show-box" v-show="!switchForm">
      <div class="tb-box">
        <el-table
          :data="tableData"
          :header-cell-style="rowClass"
          style="width: 100%"
          border
          max-height="780"
        >
          <el-table-column type="index" width="40" align="center"/>
          <el-table-column prop="id" label="审核订单ID" align="left" width="120"/>
          <el-table-column prop="requestNo" label="请求编号" align="left" width="250"/>
          <el-table-column prop="orderNo" label="订单号" align="left" width="200"/>
          <el-table-column prop="productName" label="产品名称" align="left" width="200"/>
          <el-table-column prop="amt" label="回购金额" align="left" width="100"/>
          <el-table-column prop="purchasPrice" label="购买总金额" align="left" width="100"/>
          <el-table-column prop="bankAccountName" label="账号行名称" align="left" width="100"/>
          <el-table-column prop="bankAccountNo" label="银行卡号" align="left" width="200"/>
          <el-table-column prop="branchBankAccountName" label="账号分行名称" align="left" width="200"/>
          <el-table-column prop="payTYpe" label="支付类型" align="left" width="100">
            <template slot-scope="scope">
              <el-tag :type="scope.row.payTYpe | payFilter">{{scope.row.payTYpe | formatPay}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="loginCode"
            label="用户标识"
            align="left"
            width="250"
            :show-overflow-tooltip="true"
          />
          <el-table-column prop="mall" label="商城名称" align="left"/>
          <el-table-column prop="applyUser" label="审批发起人" align="left" width="120"/>
          <el-table-column prop="name" label="审批组名" align="left" width="120"/>
          <el-table-column prop="applyStatus" label="审批状态" align="left">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.applyStatus | statusFilter"
              >{{scope.row.applyStatus | formatStatus}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="applyTime" label="审核时间" align="center" width="180"/>
          <el-table-column prop="createTime" label="创建时间" align="center" width="180"/>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button type="danger" size="mini" @click="auditHandle(scope.$index, scope.row)">审批</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="handleDetails(scope.$index, scope.row)"
              >订单详情</el-button>
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
        <el-form ref="form" :model="order" label-width="100px">
          <el-form-item label="审批用户名">
            <el-input v-model="order.userName" placeholder="审批用户名" disabled/>
          </el-form-item>
          <el-form-item label="审核订单ID">
            <el-input v-model="order.id" placeholder="审核订单ID" disabled/>
          </el-form-item>
          <el-form-item label="回购金额">
            <el-input v-model="order.amt" placeholder="回购金额" disabled/>
          </el-form-item>
          <el-form-item label="回购单号">
            <el-input v-model="order.requestNo" placeholder="回购单号" disabled/>
          </el-form-item>
          <el-form-item label="订单号">
            <el-input v-model="order.orderNo" placeholder="订单号" disabled/>
          </el-form-item>
          <el-form-item label="产品名称">
            <el-input v-model="order.productName" placeholder="产品名称" disabled/>
          </el-form-item>
          <el-form-item label="商城名称">
            <el-input v-model="order.mall" placeholder="商城名称" disabled/>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input type="textarea" v-model="order.result" placeholder="备注信息"/>
          </el-form-item>
          <el-form-item label="确认方式">
            <el-radio-group v-model="order.smsStatus">
              <el-radio label>审批密码</el-radio>
              <el-radio label="ACTIVE">短信验证码</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核意见">
            <el-radio-group v-model="order.approvalStatus">
              <el-radio label="true">同意</el-radio>
              <el-radio label="false">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确定</el-button>
            <el-button type="warning" @click="reback">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog title="审批密码" :visible.sync="dialogFormVisible" width="20%" top="30vh" center>
      <el-form :model="order" class="alertbox">
        <el-form-item label="订单号" label-width="80px">
          <el-input
            v-model="order.orderNo"
            placeholder="请输入审批密码"
            onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"
          ></el-input>
        </el-form-item>
        <el-form-item label="审批密码" label-width="80px" v-show="order.smsStatus == ''">
          <el-input v-model="order.traPwd"></el-input>
        </el-form-item>
        <el-form-item
          label="验证码"
          label-width="60px"
          v-show="order.smsStatus == 'ACTIVE'"
          placeholder="请输入短信验证码"
        >
          <el-input v-model="order.smsCode"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="fillAuditPwd">确 定</el-button>
      </div>
    </el-dialog>

    <div v-show="showDetails" class="wrap-box">
      <div class="form-section form-details">
        <div class="panel">
          <span>订单详情</span>
          <el-button type="warning" @click="rebackDetails" size="small">返回</el-button>
        </div>
        <div class="form-container">
          <el-form label-position="right" label-width="120px" :model="d">
            <el-form-item label="订购ID">
              <el-input v-model="d.subId" disabled placeholder="订购ID"></el-input>
            </el-form-item>
            <el-form-item label="订购流水号">
              <el-input v-model="d.subNumber" disabled placeholder="订购流水号"></el-input>
            </el-form-item>
            <el-form-item label="产品名称">
              <el-input v-model="d.prodName" disabled placeholder="产品名称"></el-input>
            </el-form-item>
            <el-form-item label="订单商品总数">
              <el-input v-model="d.productNums" disabled placeholder="订单商品总数"></el-input>
            </el-form-item>
            <el-form-item label="订单类型">
              <el-input v-model="d.subType" disabled placeholder="订单类型"></el-input>
            </el-form-item>
            <el-form-item label="订购用户名称">
              <el-input v-model="d.userName" disabled placeholder="订购用户名称"></el-input>
            </el-form-item>
            <el-form-item label="服务商编号">
              <el-input v-model="d.serverNum" disabled placeholder="服务商编号"></el-input>
            </el-form-item>
            <el-form-item label="总值">
              <el-input v-model="d.total" disabled placeholder="总值"></el-input>
            </el-form-item>
            <el-form-item label="实际总值">
              <el-input v-model="d.actualTotal" disabled placeholder="实际总值"></el-input>
            </el-form-item>
            <el-form-item label="使用积分">
              <el-input v-model="d.score" disabled placeholder="使用积分"></el-input>
            </el-form-item>
            <el-form-item label="优惠总金额">
              <el-input v-model="d.discountPrice" disabled placeholder="优惠总金额"></el-input>
            </el-form-item>
            <el-form-item label="退差价金额">
              <el-input v-model="d.priceRefund" disabled placeholder="退差价金额"></el-input>
            </el-form-item>
            <el-form-item label="订购时间">
              <el-input v-model="d.subDate" disabled placeholder="订购时间"></el-input>
            </el-form-item>
            <el-form-item label="购买时间">
              <el-input v-model="d.payDate" disabled placeholder="购买时间"></el-input>
            </el-form-item>
            <el-form-item label="完成时间">
              <el-input v-model="d.finallyDate" disabled placeholder="完成时间"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { isBlank } from "@/utils";
export default {
  data() {
    return {
      tableData: [],
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      switchForm: false,
      showDetails: false,
      order: {},
      panelTitle: "",
      auditorName: "",
      d: {},
      dialogFormVisible: false
    };
  },
  filters: {
    payFilter(status) {
      switch (status) {
        case "ONLINEL":
          return "success";
        case "OFFLINE":
          return "warning";
      }
    },
    formatPay(status) {
      switch (status) {
        case "ONLINEL":
          return "线上充值";
        case "OFFLINE":
          return "人工打款";
        default:
          "";
      }
    },
    statusFilter(status) {
      if (status) {
        return "success";
      } else {
        return "danger";
      }
    },
    formatStatus(status) {
      if (status) {
        return "已通过";
      } else {
        return "未审批";
      }
    }
  },
  created() {
    this.getDataList();
    this.getAuditUser();
  },
  methods: {
    async getDataList() {
      let r = await this._fetch("/auditOrder/list?limit=10&page=1", {
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
    auditHandle(index, row) {
      this.order = row;
      this.order.userName = this.auditorName;
      this.order.taskId = this.order.id;
      this.order.smsStatus = "";
      this.switchForm = true;
      this.panelTitle = "回购单审批";
    },
    async getAuditUser() {
      let r = await this._fetch("/auditOrder/sysUser", { method: "GET" });
      this.auditorName = r.sysUserAudit.auditorName;
    },
    handleDetails(index, row) {
      this.showDetails = true;
      this.switchForm = true;
      let params = "?subNumber=" + row.orderNo + "&mall=" + row.mall;
      this.getOrderInfo(params);
    },
    async getOrderInfo(params) {
      this.d = await this._fetch("/auditOrder/detail" + params, {
        method: "GET"
      });
    },
    onSubmit() {
      this.dialogFormVisible = true;
    },
    async addAudit() {
      if (
        this.order.payTYpe === "OFFLINE" ||
        this.order.approvalStatus === "false"
      ) {
        this.order.type = "ack";
        let r = await this._fetch("//auditOrder/check", {
          method: "POST",
          body: this.order
        });
        if (r.code === 0) {
          this.$message("操作成功");
          this.query();
          this.switchForm = false;
        } else {
          setTimeout(() => {
            this.$message(r.msg);
            this.switchForm = false;
          }, 1000);
        }
      } else if (this.order.payTYpe === "ONLINEL") {
        this.order.type = "apply";
        let r = await this._fetch("//auditOrder/check", {
          method: "POST",
          body: this.order
        });
        if (r.code === 0) {
          this.order.applyBankSerialOrderNo =
            r.data.data.applyBankSerialOrderNo;
          this.switchForm = false;
          this.order.smsCode = "";
          this.order.traPwd = "";
        } else {
          setTimeout(() => {
            this.$message(r.msg);
          }, 1000);
        }
      } else {
        return;
      }
    },
    async fillAuditPwd() {
      if(this.validator()){
        return;
      }
      this.addAudit();
    },
    reback() {
      this.switchForm = false;
    },
    rebackDetails() {
      this.showDetails = false;
      this.switchForm = false;
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/auditOrder/list?limit=" + val + "&page=" + this.page.currentPage,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/auditOrder/list?limit=" + this.page.pageSize + "&page=" + val,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.currentPage = val;
    },
    validator() {
      if (isBlank(this.order.userName)) {
        this.$message("审批用户名不能为空");
        return true;
      }
      if (isBlank(this.order.taskId)) {
        this.$message("审核订单ID不能为空");
        return true;
      }
      if (isBlank(this.order.approvalStatus)) {
        this.$message("审核意见不能为空");
        return true;
      }
      if (isBlank(this.order.amt)) {
        this.$message("回购金额不能为空");
        return true;
      }
      if (isBlank(this.order.requestNo)) {
        this.$message("回购单号不能为空");
        return true;
      }
      if (isBlank(this.order.orderNo)) {
        this.$message("订单号不能为空");
        return true;
      }
      if (isBlank(this.order.productName)) {
        this.$message("产品名称不能为空");
        return true;
      }

      if (this.order.smsStatus === "ACTIVE") {
        if (isBlank(this.order.smsCode)) {
          this.$message("短信验证码不能为空");
          return true;
        }
      } else {
        if (isBlank(this.order.traPwd)) {
          this.$message("审批密码不能为空");
          return true;
        }
      }
      if (isBlank(this.order.mall)) {
        this.$message("商城名称不能为空");
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
.page-container {
  position: relative;
}
.wrap-box {
  padding: 30px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
}
.form-section.form-details {
  .form-container {
    width: 100%;
    form {
      border: none;
      padding-left: 40px;
      overflow: auto;
      .el-form-item.el-form-item--medium {
        padding-right: 40px;
        width: 50%;
        float: left;
      }
    }
  }
  .panel {
    position: relative;
    .el-button {
      position: absolute;
      right: 40px;
      top: 3px;
    }
  }
}
</style>
