<template>
  <div class="page-container">
    <div v-show="!switchForm" class="show-box">
      <div class="query-box">
        <el-form :inline="true" :model="q" class="demo-form-inline">
          <el-form-item label="券批次号">
            <el-input v-model.trim="q.couponNo" placeholder="券批次号"/>
          </el-form-item>
          <el-form-item label="券状态">
            <el-select v-model="q.status" placeholder="请选择券状态">
              <el-option value="">请选择券状态</el-option>
              <el-option
                v-for="item in statusList"
                :label="item.name"
                :value="item.value"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-box">
        <el-button v-if="hasPermission('coupon:detail:list')" type="info" @click="query">查询</el-button>
        <el-button type="info" @click="clearHandle">重置</el-button>
        <el-button v-if="hasPermission('coupon:detail:save')" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
      </div>
      <div class="tb-box">
        <el-table
          :data="tableData"
          :header-cell-style="rowClass"
          style="width: 100%"
          border
          max-height="700"
        >
          <el-table-column type="index" width="40" align="center"/>
          <el-table-column type="selection" width="45" align="center"/>
          <el-table-column prop="id" label="id" align="left" width="60px"/>
          <el-table-column prop="couponNo" label="券批次号" align="left" width="180px"/>
          <el-table-column prop="couponName" label="券名称" align="left" width="120px"/>
          <el-table-column prop="status" label="券状态" align="left" width="120px">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | formatStatus}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-show="hiddenStatus"
            prop="status"
            label="#隐藏的券状态#"
            align="center"
            v-if="false"
          />
          <el-table-column prop="couponType" label="券类型" align="left" width="120px">
            <template slot-scope="scope">
              <span>{{scope.row.couponType | formatType}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="券总额" align="right" width="100px">
            <template slot-scope="scope">
              <span>{{scope.row.totalPrice | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="券面额" align="right" width="100px"/>
          <el-table-column prop="fullPrice" label="满多少可用" align="right" width="100px"/>
          <el-table-column prop="startDate" label="券生效起始时间" align="center" width="120px"/>
          <el-table-column prop="endDate" label="券有效截止时间" align="center" width="120px"/>
          <el-table-column prop="couponNumber" label="券初始化数量" align="left" width="120px"/>
          <el-table-column prop="obtainType" label="获取方式" align="left" width="100px">
            <template slot-scope="scope">
              <el-tag type="info">{{scope.row.obtainType | formatObtain}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="obtainLimit" label="每人获取次数上限" align="left" width="80px"/>
          <el-table-column prop="sendType" label="发券场景" align="left" width="120px">
            <template slot-scope="scope">
              <el-tag type="info">{{scope.row.sendType | formatSend}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="券描述信息" align="left" width="120px"/>
          <el-table-column prop label="详情" align="center" width="500px">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="update(scope.$index, scope.row)">修改</el-button>
              <el-button
                v-if="hasPermission('coupon:detail:update')"
                type="primary"
                size="mini"
                @click="toWarehouse(scope.$index, scope.row)"
              >券仓库</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="toCouponcondition(scope.$index, scope.row)"
              >限制条件</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="_checkup(scope.$index, scope.row)"
                :disabled="scope.row.sendJudge"
              >发券</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="_auditSub(scope.$index, scope.row)"
                :disabled="scope.row.auditJudge"
              >提交审核</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog title="服务商发券" :visible.sync="dialogFormVisible" width="20%" top="30vh">
        <el-form :model="p">
          <el-form-item label="用户loginCode" label-width="120">
            <el-input
              type="textarea"
              v-model="p.loginCodes"
              placeholder="多个logincode用英文逗号隔开"
              rows="5"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="_auditSubmit">提交</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="提示"
        :visible.sync="auditTip"
        width="18%"
        top="30vh"
        :modal-append-to-body="false"
      >
        <span>确认提交审核?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="auditTip = false">取 消</el-button>
          <el-button type="primary" @click="auditConfirm">确 定</el-button>
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
        <el-form ref="form" :model="coupons" label-width="160px">
          <el-form-item label="服务商ID">
            <el-input v-model="coupons.dealerId" placeholder="服务商ID" :disabled="!isSx"/>
          </el-form-item>
          <el-form-item label="服务商名称" v-show="flag">
            <el-input v-model="coupons.dealerName" placeholder="服务商名称" disabled/>
          </el-form-item>
          <el-form-item label="券名称" :disabled="true">
            <el-input v-model="coupons.couponName" placeholder="券名称"/>
          </el-form-item>
          <el-form-item label="券状态">
            <el-radio-group v-model="coupons.status">
              <el-radio label="0.3" disabled>预待审核</el-radio>
              <el-radio label="0.5" disabled v-show="flag">待审核</el-radio>
              <el-radio label="1" disabled v-show="flag">有效</el-radio>
              <el-radio label="-0.5" disabled v-show="flag">审核驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="券类型">
            <el-select v-model="coupons.couponType" placeholder="选择券类型">
              <el-option label="全额券" value="0"/>
            </el-select>
          </el-form-item>
          <el-form-item label="券面额">
            <el-select v-model="coupons.price" placeholder="选择券面额">
              <el-option
                v-for="item in priceList"
                :label="item.value"
                :value="item.value"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="满多少可用">
            <el-input v-model="coupons.fullPrice" placeholder="满多少可用"/>
          </el-form-item>
          <el-form-item label="券生效起始时间">
            <el-date-picker
              type="date"
              placeholder="券生效起始时间"
              v-model="coupons.startDate"
              style="width: 100%;"
              :picker-options="pickerOptions0"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="券有效截止时间">
            <el-date-picker
              type="date"
              placeholder="券有效截止时间"
              v-model="coupons.endDate"
              style="width: 100%;"
              :picker-options="pickerOptions0"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="券领取后有多少天失效">
            <el-input v-model="coupons.couponGetInvalidDay" placeholder="券领取后有多少天失效"/>
          </el-form-item>
          <el-form-item label="券初始化数量">
            <el-input v-model="coupons.couponNumber" placeholder="券初始化数量"/>
          </el-form-item>
          <el-form-item label="每人获取次数上限">
            <el-input v-model="coupons.obtainLimit" placeholder="每人获取次数上限"/>
          </el-form-item>
          <el-form-item label="券获取方式">
            <el-select v-model="coupons.obtainType" placeholder="选择获取方式" :disabled="true">
              <el-option label="用户领取" value="1"/>
              <el-option label="系统发放" value="2"/>
            </el-select>
          </el-form-item>
          <el-form-item label="发券场景">
            <el-select v-model="coupons.sendType" placeholder="选择发券场景" :disabled="!isSx">
              <el-option label="实名发放" value="2"/>
              <el-option label="升级商家等级发放" value="3"/>
              <el-option label="手动发券" value="4"/>
            </el-select>
          </el-form-item>
          <el-form-item label="券描述信息">
            <el-input type="textarea" v-model="coupons.description" placeholder="券描述信息"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确定</el-button>
            <el-button type="warning" @click="reback">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div v-if="showWarehouse" class="child-page">
      <warehouse @goback="goback()" :couponNo="couponNo"></warehouse>
    </div>
    <div v-if="showLimited" class="child-page">
      <couponcondition @goback="goback2()"></couponcondition>
    </div>
  </div>
</template>
<script>
import { isBlank,hasPermission } from "@/utils";
import { FormatAllDate, getTimeByType,formatDate } from "@/utils/timeUtils";
import warehouse from "./children/warehouse";
import couponcondition from "./children/couponcondition";
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      q: {
        couponNo: "",
        status: ""
      },
      statusList: [
        { value: "-0.5", name: "审核驳回" },
        { value: "-1", name: "已过期" },
        { value: "0", name: "已失效" },
        { value: "1", name: "有效" },
        { value: "0.3", name: "预待审核" },
        { value: "0.5", name: "待审核" }
      ],
      tableData: [],
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      isAdmin: false,
      switchForm: false,
      user: {
        status: "1"
      },
      panelTitle: "",
      checkAbleRoleList: [],
      showWarehouse: false,
      showLimited: false,
      coupons: {},
      isSx: true,
      flag: false,
      priceList: [
        { value: "250" },
        { value: "500" },
        { value: "1500" },
        { value: "3000" },
        { value: "10000" },
        { value: "20000" }
      ],
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      dialogFormVisible: false,
      p: {},
      auditTip: false,
      auditData: {},
      couponNo:''
    };
  },
  components: {
    warehouse,
    couponcondition
  },
  filters: {
    rounding(value) {
      return value.toFixed(2);
    },
    statusFilter(status) {
      switch (status) {
        case "1":
          return "success";
        case "0.5":
          return "info";
        case "0.3":
          return "primary";
        case "0":
          return "danger";
        case "-1":
          return "danger";
        case "-0.5":
          return "primary";
        default:
          return "";
      }
    },
    formatStatus(status) {
      switch (status) {
        case "1":
          return "有效";
        case "0.5":
          return "待审核";
        case "0.3":
          return "预待审核";
        case "0":
          return "已失效";
        case "-1":
          return "已过期";
        case "-0.5":
          return "审核驳回";
        default:
          return "";
      }
    },
    formatType(status) {
      switch (status) {
        case "0":
          return "全额预付款券";
        case "1":
          return "服务费券";
        case "2":
          return "预付款券";
        default:
          return "-";
      }
    },
    formatObtain(status) {
      switch (status) {
        case "1":
          return "用户领取";
        case "2":
          return "系统发放";
        default:
          return "-";
      }
    },
    formatSend(status) {
      switch (status) {
        case "1":
          return "注册发放";
        case "2":
          return "实名发放";
        case "3":
          return "升级商家等级发放";
        case "4":
          return "手动发券";
        default:
          return "-";
      }
    }
  },
  created() {
    this.getDataList();
  },
  methods: {
    ...mapMutations(["setCouponNo", "setCouponNoStatus", "setSendType"]),
    hasPermission(val){
      return hasPermission(val)
    },
    async query() {
      let queryParams =
        "&couponNo=" + this.q.couponNo + "&status=" + this.q.status;
      let r = await this._fetch("/coupon/list?limit=10&page=1" + queryParams, {
        method: "GET"
      });
      if (r.code === 0) {
        this.tableData = r.page.list;
        this.page.total = r.page.totalCount;
        this.page.pageSize = r.page.pageSize;
        this.addStatus(this.tableData)
      } else {
        console.log(r.msg)
      }
    },
    clearHandle() {
      this.q = {
        couponNo: "",
        status: ""
      };
    },
    add() {
      this.isAdmin = this.adminEd == "true" ? true : false;
      this.switchForm = true;
      this.panelTitle = "新增";
      this.coupons = {
        status: "0.3",
        couponType: "",
        price: "",
        fullPrice: "",
        messageType: "2",
        obtainType: "2",
        obtainLimit: "1",
        sendType: "",
        getType: ""
      };
    },
    update(index, row) {
      var r = row.status;
      if ((r = 0 || r == -1)) return this.$message("该券已失效，无法进行修改");

      this.isAdmin = this._adminEd == "true" ? true : false;
      this.flag = true;
      this.switchForm = true;
      this.panelTitle = "修改";
      this.getInfo(row.id);
    },
    async getInfo(id) {
      let r = await this._fetch("/coupon/info/" + id + "?_=123", {
        method: "GET"
      });
      this.coupons = r.couponDetail;
      this.isSx = this.coupons.status == "1" ? false : true; //券失效后不可再启用,隐藏有效选项
      this.coupons.loginPwd = "#"; //更新时不需要密码校验
      this.coupons.payPwd = "#";
    },
    onSubmit() {
      if (this.validator()) {
        return;
      }
      var url = this.coupons.id == null ? "/coupon/save" : "/coupon/update";
      console.log(this.coupons.startDate,this.coupons.endDate)
      this.coupons.startDate = formatDate(this.coupons.startDate);
      this.coupons.endDate = formatDate(this.coupons.endDate);
      this.auditHandle(url);
    },
    async auditHandle(url) {
      let r = await this._fetch(url, {
        method: "POST",
        body: this.coupons
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.getDataList();
      } else {
        this.$message(r.msg);
      }
        this.switchForm = false;
    },
    reback() {
      this.switchForm = false;
    },
    async getDataList() {
      let r = await this._fetch("/coupon/list?limit=10&page=1", {
        method: "GET"
      });
      if (r.code === 0) {
        this.tableData = r.page.list;
        this.page.total = r.page.totalCount;
        this.page.pageSize = r.page.pageSize;
        this.addStatus(this.tableData)
      } else {
        this.$message(r.msg);
      }
    },
    addStatus(data){
      data.forEach(item => {
          if (item.status == "1" && item.sendType == "4") {
            item.sendJudge = false;
          } else {
            item.sendJudge = true;
          }
        });
        data.forEach(item => {
          if (item.status == "0.3" || item.status == "-0.5") {
            item.auditJudge = false;
          } else {
            item.auditJudge = true;
          }
        });
        return data
    },
    toWarehouse(index,row) {
      this.couponNo = row.couponNo;
      this.switchForm = true;
      this.showWarehouse = true;
    },
    toCouponcondition(index, row) {
      this.switchForm = true;
      this.showLimited = true;
      this.setCouponNo(row.couponNo);
      this.setCouponNoStatus(row.status);
      this.setSendType(row.sendType);
    },
    goback() {
      this.switchForm = false;
      this.showWarehouse = false;
    },
    goback2() {
      this.switchForm = false;
      this.showLimited = false;
    },
    _checkup(index, row) {
      //发券
      console.log(row);
      var d = new Date(row.startDate.replace(/-/g, "/")).getTime();
      var n = new Date().getTime();
      if (n - d < 0) {
        return this.$message("该券还未生效，无法发放");
      }
      this.p.couponNo = row.couponNo;
      this.p.dealerId = row.dealerId;
      this.p.loginCodes = null; //置空重新输
      this.dialogFormVisible = true;
    },
    async _auditSubmit() {
      if (isBlank(this.p.loginCodes)) {
        this.$message("服务商的loginCode不能为空");
        return true;
      }
      this.p.loginCodes = this.getSplitString(this.p.loginCodes);
      let r = await this._fetch("/coupon/grantCoupon", {
        method: "POST",
        body: this.p
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.getDataList();
        this.dialogFormVisible = false;
      } else {
        this.$message(r.msg);
      }
    },
    _auditSub(index, row) {
      this.auditTip = true;
      this.auditData.couponNo = row.couponNo;
      this.auditData.sendType = row.sendType;
      console.log(this.auditData.sendType)
    },
    async auditConfirm() {
      var sendTypeFlag = true;
      var url = "/coupon/count/" + this.auditData.couponNo;
      var url2 = "/coupon/changeStatus/" + this.auditData.couponNo;
      if (this.auditData.sendType == 3) {
        let r = await this._fetch(url + "?_=123", {
          method: "GET"
        });
        if (r) {
          sendTypeFlag = r;
        } else {
          this.$message("无有效的用户等级条件");
          return;
        }
      }

      let r = await this._fetch(url2 + "?_=123", {
        method: "GET"
      });
      if (r.code === 0) {
        this.$message('提交成功');
        this.getDataList();
        this.auditTip = false;
      } else {
        this.$message(r.msg);
        this.auditTip = false;
      }
    },
    getSplitString(str) {
      var arr = str.split(",");
      var resources = "";
      for (var i = 0; i < arr.length; i++) {
        var arr1 = arr[i].split(/\s+/);
        for (var j = 0; j < arr1.length; j++) {
          if (arr1[j].trim() != "") {
            resources += arr1[j].trim() + ",";
          }
        }
      }
      return resources;
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/coupon/list?limit=" + val + "&page=" + this.page.currentPage,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
      this.addStatus(this.tableData)
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/coupon/list?limit=" + this.page.pageSize + "&page=" + val,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.currentPage = val;
      this.addStatus(this.tableData)
    },
    validator: function() {
      var reg = /^[1-9]\d*$/;
      if (this.isAdmin) {
        if (isBlank(this.coupons.dealerId)) {
          this.$message("服务商ID不能为空");
          return true;
        }
      }
      if (isBlank(this.coupons.couponName)) {
        this.$message("券名称不能为空");
        return true;
      }
      if (isBlank(this.coupons.status)) {
        this.$message("券状态不能为空");
        return true;
      }
      if (isBlank(this.coupons.couponType)) {
        this.$message("券类型不能为空");
        return true;
      }

      if (isBlank(this.coupons.price)) {
        this.$message("券面额不能为空");
        return true;
      }
      if (!isBlank(this.coupons.price)) {
        if (!reg.test(this.coupons.price)) {
          this.$message("券面额必须是正整数");
          return true;
        }
      }

      if (isBlank(this.coupons.fullPrice)) {
        this.$message("满多少可用不能为空");
        return true;
      }
      if (!isBlank(this.coupons.fullPrice)) {
        if (!reg.test(this.coupons.fullPrice)) {
          this.$message("满多少可用必须是正整数");
          return true;
        }
      }

      if (isBlank(this.coupons.startDate)) {
        this.$message("券生效起始时间不能为空");
        return true;
      }
      if (isBlank(this.coupons.endDate)) {
        this.$message("券有效截止时间不能为空");
        return true;
      }

      if (isBlank(this.coupons.couponGetInvalidDay)) {
        this.$message("券领取后有多少天失效不能为空");
        return true;
      }

      if (!isBlank(this.coupons.couponGetInvalidDay)) {
        if (!reg.test(this.coupons.couponGetInvalidDay)) {
          this.$message("失效天数必须是正整数");
          return true;
        }
        if (reg.test(this.coupons.couponGetInvalidDay)) {
          //失效天数不能超过有效期
          var s = parseInt(this.coupons.couponGetInvalidDay);
          var s1 = FormatAllDate(this.coupons.startDate);
          var s2 = FormatAllDate(this.coupons.endDate);
          s1 = new Date(s1.replace(/-/g, "/"));
          s2 = new Date(s2.replace(/-/g, "/"));
          var days = s2.getTime() - s1.getTime();
          var time = parseInt(days / (1000 * 60 * 60 * 24)) + 1;
          if (s - time > 0) {
            this.$message("券领取后的失效天数不能大于券的有效天数");
            return true;
          }
        }
      }

      if (isBlank(this.coupons.couponNumber)) {
        this.$message("券初始化数量不能为空");
        return true;
      }
      if (!isBlank(this.coupons.couponNumber)) {
        if (!reg.test(this.coupons.couponNumber)) {
          this.$message("券初始化数量必须是正整数");
          return true;
        }
      }

      if (isBlank(this.coupons.obtainLimit)) {
        this.$message("每人获取次数上限不能为空");
        return true;
      }
      if (!isBlank(this.coupons.obtainLimit)) {
        if (!reg.test(this.coupons.obtainLimit)) {
          this.$message("每人获取次数上限必须是正整数");
          return true;
        }
        if (
          parseInt(this.coupons.obtainLimit) >
          parseInt(this.coupons.couponNumber)
        ) {
          this.$message("每人获取次数上限不能超过券初始化数量");
          return true;
        }
      }

      if (isBlank(this.coupons.sendType)) {
        this.$message("发券场景不能为空");
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
form {
  border-bottom: 1px solid #ddd;
}
.btn-box {
  padding-top: 15px;
}
.page-container {
  position: relative;
}
.child-page {
  width: 100%;
  height: 100%;
  background: #fff;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}
</style>

