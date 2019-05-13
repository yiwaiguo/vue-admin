<template>
  <div class="form-section">
    <div class="panel" v-html="panelTitle"/>
    <div class="form-container">
      <div class="query-box">
        <div class="query-item">
          <el-form :model="q" label-width="80px">
            <el-form-item label="订单号">
              <el-input v-model="q.orderNo" placeholder="请输入所属服务商"/>
            </el-form-item>
            <el-form-item :label="keyword+'类型'">
              <el-select v-model="q.type" placeholder="请选择类型">
                <el-option v-for="item in typeList" :label="item.name" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="query-item">
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
          <el-table-column prop="nickName" label="客户姓名" align="left"/>
          <el-table-column prop="type" :label="keyword+'类型'" align="left">
            <template slot-scope="scope">
              <span>{{scope.row.type | typeFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="total" label="使用数量" align="left"/>
          <el-table-column prop="date" label="时间" align="center"/>
          <el-table-column prop="orderNo" label="订单号" align="left"/>
          <el-table-column prop="orderType" label="订单类型" align="left"/>
          <el-table-column prop="skuInfo" label="产品类型" align="left"/>
          <el-table-column prop="orderMoney" label="订单金额" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.orderMoney | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="payment" label="实付金额" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.payment | rounding}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="refundDiff" :label="'全款单'+keyword+'退差价'" align="right">
            <template slot-scope="scope">
              <span>{{scope.row.refundDiff | rounding}}</span>
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
const keyword = window.localStorage.getItem("keyword");
var nextM_start =new Date(new Date(new Date().toLocaleDateString()).setMonth(new Date().getMonth()-1));
export default {
  props: ["queryTime",'id'],
  data() {
    return {
      panelTitle: keyword+"消费明细",
      keyword:keyword,
      tableData: [],
      q: {
        startTime: "",
        endTime: "",
        orderNo:'',
        type:''
      },
      typeList:[
        {value:'B010',name:'收入'},
        {value:'B001',name:'抵扣货款(全款)'},
        {value:'B002',name:'抵扣货款(预付款)'},
        {value:'B003',name:'过期扣除'},
        {value:'B004',name:'全款单'+keyword+'退全款'},
        {value:'B006',name:'全款单'+keyword+'退差价'},
        {value:'B005',name:'抽奖'},
        {value:'B101',name:'红冲'},
        {value:'B102',name:'蓝补'},
        {value:'B103',name:'核销'},
      ],
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
  filters: {
    rounding(value) {
      if(value){
        return value.toFixed(2);
      }else{
        return '0.00'
      }
    },
    typeFilter(value){
      switch(value){
        case 'B010' : return '收入';
        case 'B001' : return '抵扣货款(全款)';
        case 'B002' : return '抵扣货款(预付款)';
        case 'B003' : return '过期扣除';
        case 'B004' : return '全款单K豆退全款';
        case 'B006' : return '全款单K豆退差价';
        case 'B005' : return '抽奖';
        case 'B101' : return '红冲';
        case 'B102' : return '蓝补';
        case 'B103' : return '核销';
      }
    }
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
        "&orderNo=" + this.q.orderNo + 
        "&type=" + this.q.type + 
        "&startTime=" + this.q.startTime + 
        "&endTime=" + this.q.endTime;
      let r = await this._fetch(
        "/hxbounty/ConsumeDetail?userId="+this.id+"&limit=10&page=1" + queryParams,
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
        orderNo:"",
        type:'',
        startTime: this.value[0] + " 00:00:00",
        endTime: this.value[1] + ' 23:59:59'
      };
    },
    download() {
      const token = window.localStorage.getItem("token");
      this.q.startTime = this.value[0];
      this.q.endTime = this.value[1];
      this.url =
      "/hxbounty/download?type=ConsumeDetail&userId="+this.detailId+"?token="+
      token+
      "&orderNo="+
      this.q.orderNo+
      "&type="+
      this.q.type+
      "&startTime="+
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
        var filename=`个人${keyword}日结明细表.xls`
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
        "/hxbounty/ConsumeDetail?limit=" + val + "&page=" + this.page.currentPage,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/hxbounty/ConsumeDetail?limit=" + this.page.pageSize + "&page=" + val,
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
    width: 100%;
    .query-box {
      border-bottom: 1px solid #ddd;
      display:flex;
      .query-item {
        width:auto;
      }
    }
    .btn-box {
      padding: 10px 0 0 20px;
    }
  }
}
</style>
