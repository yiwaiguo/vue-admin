<template>
  <div class="page-container">
    <div class="show-box">
      <div class="query-box">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item :title="title" name="1">
            <div class="query-item">
              <el-form :label-position="labelPosition" label-width="100px" :model="q">
                <el-form-item label="服务商编号">
                  <el-input v-model.trim="q.dealerCode" placeholder="请输入服务商编号"></el-input>
                </el-form-item>
                <el-form-item label="登录账号">
                  <el-input v-model.trim="q.loginCode" placeholder="请输入登录账号"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="query-item">
              <el-form :label-position="labelPosition" label-width="100px" :model="q">
                <el-form-item label="订单号">
                  <el-input v-model.trim="q.orderNo" placeholder="请输入订单号"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="query-item">
              <el-form :label-position="labelPosition" label-width="80px" :model="q">
                <el-form-item label="日期查询">
                  <el-date-picker
                    v-model="value"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :picker-options="pickerOptions2"
                  ></el-date-picker>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="btn-box">
        <el-button v-if="hasPermission('couponsReport:couponOrder:list')" type="primary" @click="query">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
        <el-button v-if="hasPermission('couponsReport:couponOrder:download')" type="primary" icon="el-icon-download" @click="download">导出</el-button>
      </div>
      <div class="tb-box">
        <el-table
          :data="tableData"
          :header-cell-style="rowClass"
          style="width: 100%"
          border
          :max-height="maxHeight"
          :summary-method="getSummaries"
          show-summary
        >
          <el-table-column type="index" width="50" align="center"/>
          <el-table-column prop="dealerCode" label="服务商编号" align="left"/>
          <el-table-column
            prop="loginCode"
            label="券批次号"
            align="left"
            width="250"
            :show-overflow-tooltip="true"
          />
          <el-table-column prop="couponSn" label="券序列号" align="left" width="220"/>
          <el-table-column prop="orderNo" label="订单号" align="left" width="200"/>
          <el-table-column prop="orderCloseNo" label="退订单号" align="left" width="200"/>
          <el-table-column prop="couponType" label="券类型" align="left" width="150">
            <template slot-scope="scope">
              <span>{{scope.row.couponType | formatType}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderMoney" label="订单金额" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.orderMoney | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="realUseMoney" label="券实际抵扣金额" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.realUseMoney | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="backMoney" label="券退订退还金额" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.backMoney | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderMoney" label="券下单剩余金额" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.orderMoney | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="profitClose" label="货值增加" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.profitClose | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="profitCloseSub" label="货值减少" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.profitCloseSub | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="overDueMoney" label="失效劵总额" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.overDueMoney | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="chargeOpen" label="服务费" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.chargeOpen | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="extraCharge" label="keyword" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.extraCharge | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="creDate" label="创建时间" align="center" width="200"/>
          <el-table-column prop="transferCount" label="划转次数" align="left"/>
          <el-table-column prop="transferDate" label="划转时间" align="center" width="200"/>
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
  </div>
</template>
<script>
import {
  FormatAllDate,
  getTimeByType,
  validator,
  formatDate
} from "@/utils/timeUtils";
import { formatDateTime, IsInArray,hasPermission } from "@/utils";
const keyword = window.localStorage.getItem("keyword");
var nextM_start =new Date(new Date(new Date().toLocaleDateString()).setMonth(new Date().getMonth()-1));
export default {
  data() {
    return {
      title: "查询窗口（点击收起）",
      labelPosition: "right",
      keyword: keyword,
      q: {
        dealerCode: "",
        loginCode: "",
        orderNo: ""
      },
      activeNames: ['1'],
      tableData: [],
      page: {
        pageSize: 50,
        total: 0,
        currentPage: 1
      },
      value: [formatDate(nextM_start),formatDate(new Date())],
      pickerOptions2: {
        disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6
          },
        shortcuts: [
          {
            text: "当日",
            onClick(picker) {
              const end = getTimeByType("CURRENTDAY").endTime;
              const start = getTimeByType("CURRENTDAY").startTime;
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "上日",
            onClick(picker) {
              const end = getTimeByType("YESTERODAY").endTime;
              const start = getTimeByType("YESTERODAY").startTime;
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "本周",
            onClick(picker) {
              const end = getTimeByType("CURRENTWEEK").endTime;
              const start = getTimeByType("CURRENTWEEK").startTime;
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "上周",
            onClick(picker) {
              const end = getTimeByType("PREWEEK").endTime;
              const start = getTimeByType("PREWEEK").startTime;
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "本月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              const monthStart = new Date(
                start.getFullYear(),
                start.getMonth(),
                1
              );
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [formatDate(monthStart), formatDate(end)]);
            }
          },
          {
            text: "上月",
            onClick(picker) {
              const start = new Date();
              const monthStart = new Date(
                start.getFullYear(),
                start.getMonth(),
                1
              );
              const preMS = new Date(
                start.getFullYear(),
                start.getMonth() - 1,
                1
              );
              const preME = new Date(
                monthStart.getTime() - 60 * 60 * 24 * 1000
              );
              picker.$emit("pick", [formatDate(preMS), formatDate(preME)]);
            }
          }
        ]
      },
      maxHeight: "550"
    };
  },
  filters: {
    rounding(value) {
      if (value) {
        return value.toFixed(2);
      } else {
        return "0.00";
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
          return "";
      }
    }
  },
  methods: {
    hasPermission(val){
      return hasPermission(val)
    },
    handleChange() {
      if (this.activeNames.length > 0) {
        this.title = "查询窗口（收起）";
        this.maxHeight = "550";
      } else {
        this.title = "查询窗口（点击展开）";
        this.maxHeight = "700";
      }
    },
    selectTime(value){//解决快捷选择与手动选择方法的冲突
      let newValue = value.map(item => {
        if(typeof(item) != 'string'){
          return item = formatDate(item);
        }else{
          return item
        }
      });
      return newValue
    },
    async query() {
      this.value = this.selectTime(this.value);
      this.q.startTime = this.value[0] + " 00:00:00";
      this.q.endTime = this.value[1] + ' 23:59:59';
      if (validator(this.q.startTime, this.q.endTime)) {
        this.$message("查询不能超过60天");
        return;
      }
      let queryParams =
        "&dealerCode=" +
        this.q.dealerCode +
        "&loginCode=" +
        this.q.loginCode +
        "&orderNo=" +
        this.q.orderNo +
        "&startTime=" +
        this.q.startTime +
        "&endTime=" +
        this.q.endTime +
        "&page=" +
        this.page.currentPage +
        "&limit=" +
        this.page.pageSize;
      let r = await this._fetch(
        "/couponsReport/couponOrder/list?limit=10&page=1" + queryParams,
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
      this.value = [formatDate(nextM_start),formatDate(new Date())];
      this.q = {
        dealerCode: "",
        loginCode: "",
        orderNo: "",
        startTime: this.value[0] + ' 00:00:00',
        endTime: this.value[1] + " 23:59:59"
      };
    },
    download() {
      if (this.validator()) {
        this.$message("导出不能超过60天");
        return;
      }
      const token = window.localStorage.getItem("token");
      this.q.startTime = this.value[0];
      this.q.endTime = this.value[1];
      this.url =
        "/refundapply/download?token=" +
        token +
        "&startTime=" +
        this.q.startTime +
        "&endTime=" +
        this.q.endTime +
        "&page=" +
        this.page.currentPage +
        "&limit=" +
        this.page.pageSize;
      fetch(this.baseURL + this.url, {
        headers: {
          "Content-type": "application/json;charset=UTF-8",
          token: token
        }
      }).then(res =>
        res.blob().then(blob => {
          var filename = `券订单查询.xls`;
          var a = document.createElement("a");
          var url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        })
      );
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      const pArr = [
        "orderMoney",
        "realUseMoney",
        "backMoney",
        "profitClose",
        "profitCloseSub",
        "overDueMoney",
        "chargeOpen",
        "extraCharge"
      ];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        // if (!values.every(value => isNaN(value))) {//没值或为0显示N/A
        if (IsInArray(pArr, column.property)) {
          //指定列合计
          sums[index] = values
            .reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0)
            .toFixed(2);
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/couponsReport/couponOrder/list?limit=" +
          val +
          "&page=" +
          this.page.currentPage,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/couponsReport/couponOrder/list?limit=" +
          this.page.pageSize +
          "&page=" +
          val,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.currentPage = val;
    },
    validator() {
      //查询时间不超过1个月
      this.q.startTime = this.value[0] + " 00:00:00";
      this.q.endTime = this.value[1] + " 23:59:59";
      var s1 = this.q.startTime;
      var s2 = this.q.endTime;
      if (s1 == "" || s2 == "") {
        this.$message("时间不能为空");
        return;
      }
      s1 = new Date(s1.replace(/-/g, "/"));
      s2 = new Date(s2.replace(/-/g, "/"));
      var days = s2.getTime() - s1.getTime();
      var time = parseInt(days / (1000 * 60 * 60 * 24));
      if (time > 60) {
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
.btn-box {
  padding-top: 15px;
}
</style>

