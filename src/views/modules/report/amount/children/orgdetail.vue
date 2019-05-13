<template>
  <div class="form-section">
    <div class="panel" v-html="panelTitle"/>
    <div class="form-container">
      <div class="query-box">
        <el-form :inline="true" :model="q" class="demo-form-inline">
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
      <div class="btn-box">
        <el-button type="info" @click="query">查询</el-button>
        <el-button type="info" @click="clearHandle">重置</el-button>
        <el-button type="primary" @click="download">导出</el-button>
        <el-button type="primary" @click="goback">返回</el-button>
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
          <el-table-column prop="tradingDay" label="预订日" align="center"/>
          <el-table-column prop="income" label="收入总额" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.income | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="consume" label="支出总额" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.consume | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="invalid" label="失效总额" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.invalid | rounding}}</span>
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
    
  </div>
</template>
<script>
import { FormatAllDate, getTimeByType,formatDate } from "@/utils/timeUtils";
import { formatDateTime } from "@/utils";
var keyword = window.localStorage.getItem("keyword");
var nextM_start =new Date(new Date(new Date().toLocaleDateString()).setMonth(new Date().getMonth()-1));
export default {
  props:["queryTime",'id'],
  data() {
    return {
      panelTitle: "机构"+keyword+"日结明细",
      tableData: [],
      q: {
        startTime: "",
        endTime: ""
      },
      switchStatus: "", //子组件传给父组件的值
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      value: this.queryTime,
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
    };
  },
  filters:{
    rounding(value) {
      return value.toFixed(2);
    },
  },
  created() {
    this.query();
  },
  methods: {
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
      let queryParams =
        "&startTime=" + this.q.startTime + "&endTime=" + this.q.endTime;
      let r = await this._fetch(
        "/bountyDailySettlement/orgList/"+this.id+"?limit=10&page=1" + queryParams,
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
    clearHandle() {
      this.value = [formatDate(nextM_start), formatDate(new Date())];
      this.q = {
        startTime: this.value[0] + " 00:00:00",
        endTime: this.value[1] + ' 23:59:59'
      };
    },
    download(){
      const token = window.localStorage.getItem("token");
      this.q.startTime = this.value[0];
      this.q.endTime = this.value[1];
      this.url =
      "/bountyDailySettlement/download/orgList/"+this.id+"?token="+
      token+"&startTime="+
      this.q.startTime+
      "&endTime="+
      this.q.endTime+
      "&page="+
      this.page.currentPage+
      "&limit="+
      this.page.pageSize;
    fetch(this.baseURL+this.url, {
        headers: {
            'Content-type': 'application/json;charset=UTF-8',
            'token': token
        }
    }).then(res => res.blob().then(blob => {
        var filename=`机构${keyword}日结明细表.xls`
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(blob); 
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }))
    },
    goback() {
      this.switchStatus = false;
      this.$emit("goback", this.switchStatus);
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/bountyDailySettlement/orgList?limit=" + val + "&page=" + this.page.currentPage,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/bountyDailySettlement/orgList?limit=" + this.page.pageSize + "&page=" + val,
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
.form-section {
  margin: 30px;
  .form-container {
    padding-top:15px;
    width: 100%;
    .query-box {
      padding-left: 20px;
      border-bottom: 1px solid #ddd;
    }
    .btn-box {
      padding: 10px 0 0 20px;
    }
  }
}
</style>
