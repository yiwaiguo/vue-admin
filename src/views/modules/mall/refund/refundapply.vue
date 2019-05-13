<template>
  <div class="page-container">
    <div class="show-box">
      <div class="query-box">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item :title="title" name="1">
            <div class="query-item">
              <el-form :label-position="labelPosition" label-width="80px" :model="q">
                <el-form-item label="订单号">
                  <el-input v-model="q.orderCode" placeholder="请输入订单号"></el-input>
                </el-form-item>
                <el-form-item label="用户姓名">
                  <el-input v-model="q.userName" placeholder="请输入用户姓名"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div class="query-item">
              <el-form :label-position="labelPosition" label-width="80px" :model="q">
                <el-form-item label="审核状态">
                  <el-select v-model="q.status" placeholder="请选择审核状态">
                    <el-option label="区域一" value="shanghai"></el-option>
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
        <el-button type="primary" @click="query">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
        <el-button v-if="hasPermission('refundapply:download')" type="primary" icon="el-icon-download" @click="download">导出</el-button>
        <el-button v-if="hasPermission('refundapply:commitApply:first')" type="danger" @click="checkup">审查</el-button>
      </div>
      <div class="tb-box">
        <el-table
          ref="dataTable"
          :data="tableData"
          :header-cell-style="rowClass"
          style="width: 100%"
          border
          :max-height="maxHeight"
          @select="select"
          @row-click="getRowData"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="index" width="40" align="center"/>
          <el-table-column type="selection" width="45" align="center"/>
          <el-table-column prop="orderCode" label="订单号" width="200" align="left"/>
          <el-table-column prop="userName" label="用户姓名" width="120" align="left"/>
          <el-table-column prop="type" label="审核类型" align="left" width="120">
            <template slot-scope="scope">
              <el-tag :type="scope.row.type | typeFilter">{{scope.row.type | formatType}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="审核状态" align="left">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | formatStatus}}</el-tag>
            </template>
          </el-table-column>
          </el-table-column>
          <el-table-column prop="verifyName" label="审核人" align="left" width="120"/>
          <el-table-column prop="orderPrice" label="订单金额" align="right" width="120"/>
          <el-table-column prop="refundTotal" label="退差价总额" align="right" width="120"/>
          <el-table-column prop="refundMoney" label="退差价额" align="right"/>
          <el-table-column prop="refundBean" :label="'退差'+keyword+'数量'" align="right" width="120"/>
          <el-table-column prop="applyTime" label="申请时间" align="center" width="200"/>
          <el-table-column prop="verifyTime" label="审核时间" align="center" width="200"/>
          <el-table-column prop="remarks" label="备注信息" align="left" width="250"/>
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

      <el-dialog title="退差价审核" :visible.sync="dialogFormVisible" width="25%" top="30vh">
        <el-form :model="form" label-position="left">
          <el-form-item label="订单号" label-width="100px">
            <el-input v-model="form.orderCode" auto-complete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="退差价额" label-width="100px">
            <el-input v-model="form.refundMoney" disabled></el-input>
          </el-form-item>
          <el-form-item :label="'退差'+keyword+'数量'" label-width="100px">
            <el-input v-model="form.refundBean" disabled></el-input>
          </el-form-item>
          <el-form-item label="退差价总额" label-width="100px">
            <el-input v-model="form.refundTotal" disabled></el-input>
          </el-form-item>
          <el-form-item label="备注信息" label-width="100px">
            <el-input type="textarea" v-model="form.remarks" disabled></el-input>
          </el-form-item>
          <el-form-item label="审核意见" label-width="100px" disabled>
            <el-radio v-model="form.status" label="1">同意</el-radio>
            <el-radio v-model="form.status" label="-1">驳回</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="warning" @click="_auditSubmit">提 交</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
      <iframe id="downloadOne" name="iframe" height="0px" width="0px"></iframe>
    </div>
  </div>
</template>
<script>
import { FormatAllDate, getTimeByType,formatDate } from "@/utils/timeUtils";
import { formatDateTime,hasPermission } from '@/utils';
const keyword = window.localStorage.getItem("keyword");
var nextM_start =new Date(new Date(new Date().toLocaleDateString()).setMonth(new Date().getMonth()-1));
export default {
  data() {
    return {
      title: "查询窗口（点击收起）",
      maxHeight: "550",
      labelPosition: "right",
      keyword:keyword,
      list: {},
      q: {
        orderCode: "",
        userName: "",
        status: "",
        startTime: "",
        endTime: "",
        timeType: ""
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
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [formatDate(start), formatDate(end)]);
            }
          }
        ]
      },
      form: {},
      dialogFormVisible: false,
      multipleSelection: {},
      url:''
    };
  },
  filters:{
    typeFilter(status) {
      const statusMap = {
        '0': "info",
        '1': "info",
        '2':"info"
      };
      return statusMap[status];
    },
    formatType(status) {
      const statusMap = {
        '0': "初审",
        '1': "复审",
        '2': "三审"
      };
      return statusMap[status];
    },
    statusFilter(status) {
      const statusMap = {
        '-1': "danger",
        '0': "warning",
        '1':"info",
        '2':"info",
        '99':"success"
      };
      return statusMap[status];
    },
    formatStatus(status) {
      const statusMap = {
        '-1': "驳回",
        '0': "审核中",
        '1': "复审",
        '2': "三审",
        '99': "通过"
      };
      return statusMap[status];
    },
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
      let queryParams =
        "&orderCode=" +
        this.q.orderCode +
        "&userName=" +
        this.q.userName +
        "&status=" +
        this.q.status +
        "&startTime=" +
        this.q.startTime +
        "&endTime=" +
        this.q.endTime +
        "&timeType=" +
        this.q.timeType;
      let r = await this._fetch(
        "/refundapply/list?type=0&limit=50&page=1" + queryParams,
        {
          method: "GET"
        }
      );
      if (r.code === 0) {
        this.tableData = r.page.list;
        this.page.total = r.page.totalCount;
        this.page.pageSize = r.page.pageSize;
      } else {
        console.log(r.msg)
      }
    },
    reset() {
      this.value = [formatDate(nextM_start),formatDate(new Date())];
      this.q = {
        orderCode: "",
        userName: "",
        status: "",
        startTime: this.value[0] + " 00:00:00",
        endTime: this.value[1] + ' 23:59:59',
        timeType: ""
      };
    },
    checkup() {
      if (!this.multipleSelection.id) {
        this.$message("请选择一条记录");
        return;
      }
      if (this.multipleSelection.status != 0) {
        this.$message("不可审核");
        return;
      };
      this.form = this.multipleSelection;
      this.dialogFormVisible = true;
    },
    download(){
      const token = window.localStorage.getItem("token");
      this.q.startTime = this.value[0] + ' 00:00:00';
      this.q.endTime = this.value[1] + ' 23:59:59';
      this.url =
      "/refundapply/download?token="+
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
        var filename=`退差价审核.xls`
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(blob); 
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }))
    },
    _auditSubmit() {
      if (!this.form.status) {
        this.$message("请选择审核意见");
        return;
      }
      this.form.id = this.multipleSelection.id;
      this.form.type = this.multipleSelection.type;
      this.form.vId = this.multipleSelection.vId;
      this.submitHandle()
    },
    async submitHandle(){
      let r = await this._fetch('/refundapply/commitApplyFirst',{
        method:'POST',
        body:this.form
      });
      if(r.code === 0){
        this.$message('操作成功');
        this.dialogFormVisible = false;
        this.query()
      }else{
        this.$message(r.msg)
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
        "/refundapply/list?limit=" + val + "&page=" + this.page.currentPage,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/refundapply/list?limit=" + this.page.pageSize + "&page=" + val,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.currentPage = val;
    },
    rowClass() {
      return "text-align:center";
    }
  },
  created(){
    this.query()
  }
};
</script>
<style lang="scss" scoped>
.btn-box {
  padding-top: 15px;
}
</style>

