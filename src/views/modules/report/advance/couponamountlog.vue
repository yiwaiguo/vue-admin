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
                <el-form-item label="券批次号">
                  <el-input v-model.trim="q.couponNo" placeholder="请输入券批次号"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="query-item">
              <el-form :label-position="labelPosition" label-width="100px" :model="q">
                <el-form-item label="资金划转类型">
                  <el-select v-model="q.type" placeholder="请选择资金划转类型">
                    <el-option
                      v-for="item in couponsLogTypeList"
                      :label="item.couponsLogName"
                      :value="item.couponsLogType"
                      :key="item.couponsLogType"
                    ></el-option>
                  </el-select>
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
        <el-button v-if="hasPermission('couponsReport:couponAmountlog:list')" type="primary" @click="query">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
        <el-button v-if="hasPermission('couponsReport:couponAmountlog:download')" type="primary" icon="el-icon-download" @click="download">导出</el-button>
      </div>
      <div class="tb-box">
        <el-table
          :data="tableData"
          :header-cell-style="rowClass"
          style="width: 100%"
          border
          :max-height="maxHeight"
        >
          <el-table-column type="index" width="40" align="center"/>
          <el-table-column prop="tradingDay" label="预订日" align="left"/>
          <el-table-column prop="dealerCode" label="服务商编号" align="left"/>
          <el-table-column prop="couponNo" label="券批次号" align="left"/>
          <el-table-column prop="amChange" label="划转金额" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.amChange | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="资金划转类型" align="left">
            <template slot-scope="scope">
              <span>{{scope.row.type | formatType}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="入库时间" align="center"/>
          <el-table-column prop="completeDate" label="完成时间" align="center"/>
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
import { FormatAllDate, getTimeByType, formatDate } from "@/utils/timeUtils";
import { formatDateTime,hasPermission } from "@/utils";
var nextM_start =new Date(new Date(new Date().toLocaleDateString()).setMonth(new Date().getMonth()-1));
export default {
  data() {
    return {
      title: "查询窗口（点击收起）",
      labelPosition: "right",
      q: {
        dealerCode: "",
        couponNo: "",
        type: ""
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
      couponsLogTypeList: [
        { couponsLogType: "C001", couponsLogName: "服务商购买券" },
        { couponsLogType: "C002", couponsLogName: "券下单流水" },
        { couponsLogType: "C003", couponsLogName: "券下单剩余余额" },
        { couponsLogType: "C004", couponsLogName: "券失效划转" },
        { couponsLogType: "C005", couponsLogName: "券退款划转" }
      ],
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
        case "C001":
          return "服务商购买券";
        case "C002":
          return "券下单流水";
        case "C003":
          return "券下单剩余余额";
        case "C004":
          return "券失效划转";
        case "C005":
          return "券退款划转";
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
      if (this.validator()) {
        this.$message("查询不能超过60天");
        return;
      }
      let queryParams =
        "&dealerCode=" +
        this.q.dealerCode +
        "&couponNo=" +
        this.q.couponNo +
        "&type=" +
        this.q.type +
        "&startTime=" +
        this.q.startTime +
        "&endTime=" +
        this.q.endTime;
      let r = await this._fetch(
        "/couponsReport/couponAmountlog/list?limit=10&page=1" + queryParams,
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
        couponNo: "",
        type: "",
        startTime: this.value[0] + " 00:00:00",
        endTime: this.value[1] + " 23:59:59"
      };
    },
    download() {
      if (this.validator()) {
        this.$message("导出不能超过60天");
        return;
      }
      const token = window.localStorage.getItem("token");
      this.q.startTime = this.value[0] + " 00:00:00";
      this.q.endTime = this.value[1] + " 23:59:59";
      this.url =
        "/couponsReport/couponAmountlog/download?token=" +
        token +
        "&dealerCode=" +
        this.q.dealerCode +
        "&couponNo=" +
        this.q.couponNo +
        "&type=" +
        this.q.type +
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
          var filename = `券流水查询.xls`;
          var a = document.createElement("a");
          var url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        })
      );
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/couponsReport/couponAmountlog/list?limit=" +
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
        "/couponsReport/couponAmountlog/list?limit=" +
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

