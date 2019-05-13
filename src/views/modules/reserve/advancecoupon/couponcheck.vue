<template>
  <div class="page-container">
    <div class="show-box" v-show="!switchForm">
      <div class="query-box">
        <el-form :inline="true" :model="q" class="demo-form-inline">
          <el-form-item label class="form-item">
            <el-input v-model.trim="q.couponNo" placeholder="请输入券批次号"/>
          </el-form-item>
          <el-form-item class="form-item">
            <el-select v-model="q.status" placeholder="请选择审核状态">
              <el-option value>请选择审核状态</el-option>
              <el-option
                v-for="item in statusList"
                :label="item.name"
                :value="item.id"
                :key="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="form-item">
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
        <el-button v-if="hasPermission('couponCheck:list')" type="primary" @click="query">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </div>
      <div class="tb-box">
        <el-table
          :data="tableData"
          :header-cell-style="rowClass"
          style="width: 100%"
          border
          max-height="500"
        >
          <el-table-column type="index" width="40" align="center"/>
          <el-table-column type="selection" width="45" align="center"/>
          <el-table-column prop="id" label="id" align="left" width="60"/>
          <el-table-column prop="couponNo" label="券批次号" align="left"/>
          <el-table-column prop="status" label="审核状态" align="left" width="120">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | formatStatus}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"/>
          <el-table-column prop="updateTime" label="审核时间" align="center"/>
          <el-table-column prop="updateUser" label="审核人" align="left" width="120"/>
          <el-table-column prop="rmk" label="审核意见" align="left"/>
          <el-table-column prop label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-if="hasPermission('couponCheck:update')" type="danger" size="mini" @click="checkup(scope.$index, scope.row)">审查</el-button>
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
      <div class="panel">
        <span>{{panelTitle}}</span>
      </div>
      <div class="form-container">
        <el-form label-position="right" label-width="160px" :model="c">
          <el-form-item label="服务商名称">
            <el-input v-model="c.dealerName" disabled></el-input>
          </el-form-item>
          <el-form-item label="券名称">
            <el-input v-model="c.couponName" disabled></el-input>
          </el-form-item>
          <el-form-item label="券状态">
            <el-radio-group v-model="c.status" disabled>
              <el-radio label="0.5">待审核</el-radio>
              <el-radio label="1">有效</el-radio>
              <el-radio label="-0.5">审核驳回</el-radio>
              <el-radio label="-1">过期失效</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="券类型">
            <el-select v-model="c.couponType" placeholder="选择券类型" disabled>
              <el-option
                v-for="item in coupons"
                :label="item.name"
                :value="item.value"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="券面额">
            <el-input v-model="c.price" disabled></el-input>
          </el-form-item>
          <el-form-item label="满多少可用">
            <el-input v-model="c.fullPrice" disabled></el-input>
          </el-form-item>
          <el-form-item label="券生效起始时间">
            <el-input v-model="c.startDate" disabled></el-input>
          </el-form-item>
          <el-form-item label="券有效截止时间">
            <el-input v-model="c.endDate" disabled></el-input>
          </el-form-item>
          <el-form-item label="券领取后有多少天失效">
            <el-input v-model="c.couponGetInvalidDay" disabled></el-input>
          </el-form-item>
          <el-form-item label="券初始化数量">
            <el-input v-model="c.couponNumber" disabled></el-input>
          </el-form-item>
          <el-form-item label="每人获取次数上限">
            <el-input v-model="c.obtainLimit" disabled></el-input>
          </el-form-item>
          <el-form-item label="券获取方式">
            <el-select v-model="c.obtainType" placeholder="选择获取方式" disabled>
              <el-option
                v-for="item in obtains"
                :label="item.name"
                :value="item.value"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发券场景">
            <el-select v-model="c.sendType" placeholder="选择发券场景" disabled>
              <el-option
                v-for="item in sends"
                :label="item.name"
                :value="item.value"
                :key="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="券限制条件">
            <el-input v-model="c.closeDate" disabled></el-input>
          </el-form-item>
          <el-form-item label="券描述信息">
            <el-input type="textarea" v-model="c.description" disabled></el-input>
          </el-form-item>
          <el-form-item label="券批次号" v-if="false">
            <el-input v-model="d.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input type="textarea" v-model="d.rmk" :disabled="!flag" placeholder="备注信息"></el-input>
          </el-form-item>
          <el-form-item label="登录密码">
            <el-input v-model="d.loginPwd" :disabled="!flag" placeholder="登录密码" type="password"></el-input>
          </el-form-item>
          <el-form-item label="支付密码">
            <el-input v-model="d.payPwd" :disabled="!flag" placeholder="支付密码" type="password"></el-input>
          </el-form-item>
          <el-form-item label="审核意见">
            <el-radio-group v-model="d.status">
              <el-radio label="1">同意</el-radio>
              <el-radio label="0.5">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div class="submit-btn">
          <el-form>
            <el-form-item class="btn">
              <el-button type="primary" @click="onSubmit" :disabled="!flag">提交</el-button>
              <el-button type="warning" @click="reback">返回</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <el-dialog title="提示" :visible.sync="auditTip" width="20%" top="30vh">
        <span>确定提交？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="auditTip = false">取 消</el-button>
          <el-button type="primary" @click="auditConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { FormatAllDate, getTimeByType, formatDate } from "@/utils/timeUtils";
import { formatDateTime, isBlank,hasPermission } from "@/utils";
var nextM_start =new Date(new Date(new Date().toLocaleDateString()).setMonth(new Date().getMonth()-1));
export default {
  data() {
    return {
      labelPosition: "right",
      q: {
        couponNo: "",
        status: "",
        startTime: "",
        endTime: ""
      },
      activeNames: [],
      tableData: [],
      statusList: [
        { id: 0, name: "待审核" },
        { id: 0.5, name: "已驳回" },
        { id: 1, name: "已通过" }
      ],
      page: {
        pageSize: 10,
        total: 0,
        currentPage: 1
      },
      value: [formatDate(nextM_start), formatDate(new Date())],
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
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
      coupons: [
        { value: "0", name: "全额券" },
        { value: "1", name: "服务费券" },
        { value: "2", name: "预付款券" }
      ],
      obtains: [
        { value: "1", name: "用户领取" },
        { value: "2", name: "系统发放" }
      ],
      sends: [
        { value: "1", name: "注册发放" },
        { value: "2", name: "实名发放" },
        { value: "3", name: "升级商家等级发放" },
        { value: "4", name: "手动发券" }
      ],
      c: {},
      d: {},
      switchForm: false,
      panelTitle: "优惠券审核",
      flag: false,
      auditTip: false
    };
  },
  filters: {
    statusFilter(status) {
      switch (status) {
        case "0":
          return "info";
        case "1":
          return "success";
        case "0.5":
          return "danger";
        // case '-1' : return 'danger';
        default:
          return "info";
      }
    },
    formatStatus(status) {
      switch (status) {
        case "0":
          return "待审核";
        case "1":
          return "已通过";
        case "0.5":
          return "已驳回";
        // case '-1' : return '不通过';
        default:
          return "未知状态";
      }
    }
  },
  created() {
    this.query();
  },
  methods: {
    hasPermission(val){
      return hasPermission(val)
    },
    selectTime(value) {
      //解决快捷选择与手动选择方法的冲突
      let newValue = value.map(item => {
        if (typeof item != "string") {
          return (item = formatDate(item));
        } else {
          return item;
        }
      });
      return newValue;
    },
    async query() {
      this.value = this.selectTime(this.value);
      this.q.startTime = this.value[0] + " 00:00:00";
      this.q.endTime = this.value[1] + " 23:59:59";
      let queryParams =
        "&couponNo=" +
        this.q.couponNo +
        "&status=" +
        this.q.status +
        "&startTime=" +
        this.q.startTime +
        "&endTime=" +
        this.q.endTime;
      let r = await this._fetch(
        "/couponCheck/list?type=0&limit=10&page=1" + queryParams,
        {
          method: "GET"
        }
      );
      if (r.code === 0) {
        this.tableData = r.page.list;
        this.page.total = r.page.totalCount;
        this.page.pageSize = r.page.pageSize;
      } else {
        console.log(r.msg);
      }
    },
    reset() {
      this.value = [formatDate(nextM_start), formatDate(new Date())];
      this.q = {
        couponNo: "",
        status: "",
        startTime: this.value[0] + " 00:00:00",
        endTime: this.value[1] + " 23:59:59"
      };
    },
    async getInfo(id) {
      let r = await this._fetch("/couponCheck/info/" + id, {
        method: "GET"
      });
      if (r.code === 0) {
        this.c = r.couponDetail;
        this.d.endDate = this.c.endDate;
      } else {
        this.$message(r.msg);
      }
    },
    checkup(index, row) {
      console.log(row);
      if (row.status !== "0") {
        this.flag = false; //不可重复审核,只能查看
      } else {
        this.flag = true;
      }
      this.getInfo(row.couponNo);
      this.d.id = row.id;
      this.d.couponNo = row.couponNo;
      this.switchForm = true;
    },
    onSubmit() {
      if (this.d.status != "0") {
        if (isBlank(this.d.loginPwd)) {
          this.$message("登录密码不能为空");
          return;
        } else if (isBlank(this.d.payPwd)) {
          this.$message("支付密码不能为空");
          return;
        }
      }
      if (!this.d.status) {
        this.$message("请选择审核意见");
        return;
      }
      this.auditTip = true;
    },
    async auditConfirm() {
      console.log(this.d)
      let r = await this._fetch("/couponCheck/update", {
        method: "POST",
        body: this.d
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.query();
        this.switchForm = false;
      } else {
        this.$message(r.msg);
      }
      this.auditTip = false;
    },
    reback() {
      this.switchForm = false;
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/couponCheck/list?limit=" + val + "&page=" + this.page.currentPage,
        { method: "GET" }
      );
      this.tableData = r.page.list;
      this.page.pageSize = val;
    },
    async handleCurrentChange(val) {
      let r = await this._fetch(
        "/couponCheck/list?limit=" + this.page.pageSize + "&page=" + val,
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
.btn-box {
  padding-top: 15px;
}
form {
  border-bottom: 1px solid #ddd;
}
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
.submit-btn {
  padding: 10px 150px;
}
</style>

