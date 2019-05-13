<template>
  <div class="page-container">
    <div class="show-box">
      <div class="query-box">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item :title="title" name="1">
            <div class="query-item btn-item">
              <el-form>
                <el-form-item>
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    :action="uploadUrl"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                    :auto-upload="false"
                    :limit="number"
                    :on-exceed="onExceed"
                    :headers="myHeaders"
                  >
                    <el-button slot="trigger" type="primary">选取文件</el-button>
                  </el-upload>
                </el-form-item>
              </el-form>
            </div>
            <div class="query-item btn-item">
              <el-form>
                <el-form-item>
                  <el-button v-if="hasPermission('shiftorgrecord:import')" type="success" icon="el-icon-upload" @click="submitUpload">导入名单</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button v-if="hasPermission('shiftorgrecord:template:download')" type="primary" icon="el-icon-download" @click="downloadTemp">下载模板</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="query-item">
              <el-form :label-position="labelPosition" :model="q" label-width="80px">
                <el-form-item label="审核状态">
                  <el-select v-model="q.status" placeholder="请选择状态">
                    <el-option value>请选择状态</el-option>
                    <el-option
                      v-for="item in statusList"
                      :label="item.name"
                      :value="item.id"
                      :key="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-form>
            </div>
            <div class="query-item">
              <el-form :label-position="labelPosition" label-width="80px" :model="q">
                <el-form-item label="提交日期">
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
        <el-button v-if="hasPermission('shiftorgrecord:verify:list')" type="primary" @click="query">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
        <el-button v-if="hasPermission('shiftorgrecord:downVerify')" type="primary" icon="el-icon-download" @click="download">导出</el-button>
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
          <el-table-column prop="shiftId" label="shiftId" align="left" v-if="false"/>
          <el-table-column prop="id" label="id" align="left" v-if="false"/>
          <el-table-column prop="userName" label="用户姓名" align="left"/>
          <el-table-column
            prop="loginCode"
            label="登录账号"
            align="left"
            width="250"
            :show-overflow-tooltip="true"
          />
          <el-table-column prop="srcOrgCode" label="源机构编号" align="left"/>
          <el-table-column prop="tarOrgCode" label="目标机构编号" align="left"/>
          <el-table-column prop="createTime" label="提交时间" align="center"/>
          <el-table-column prop="verifyTime" label="审核时间" align="center"/>
          <el-table-column prop="status" label="审核状态" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | formatStatus}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" align="left" :show-overflow-tooltip="true"/>
          <el-table-column prop label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-if="hasPermission('shiftorgrecord:verifyBatch')" type="danger" size="mini" @click="aduitHandle(scope.$index, scope.row)">审核</el-button>
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
    <el-dialog title="转移机构审核" :visible.sync="dialogFormVisible" width="25%" top="30vh">
      <el-form :model="audit">
        <el-form-item label="审核意见" :label-width="formLabelWidth">
          <el-radio-group v-model="audit.status">
            <el-radio label="99">同意</el-radio>
            <el-radio label="-1">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注信息" :label-width="formLabelWidth">
          <el-input type="textarea" placeholder="备注信息,100字以内" v-model="audit.remark" rows="3"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="auditConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { FormatAllDate, getTimeByType, formatDate } from "@/utils/timeUtils";
import { formatDateTime,hasPermission } from "@/utils";
var token = localStorage.getItem("token");
var nextM_start =new Date(new Date(new Date().toLocaleDateString()).setMonth(new Date().getMonth()-1));
export default {
  data() {
    return {
      title: "查询窗口（点击收起）",
      labelPosition: "right",
      q: {
        loginCode: "",
        tarOrgCode: "",
        srcOrgCode: "",
        status: ""
      },
      fileList: [],
      uploadUrl: this.baseURL + "/org/shiftOrg/import",
      number: 1,
      activeNames: ["1"],
      tableData: [],
      page: {
        pageSize: 50,
        total: 0,
        currentPage: 1
      },
      statusList: [
        { id: 99, name: "通过" },
        { id: 0, name: "待审核" },
        { id: -1, name: "驳回" }
      ],
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
      myHeaders: { token: token },
      dialogFormVisible: false,
      formLabelWidth: "80px",
      audit: {}
    };
  },
  filters: {
    statusFilter(value) {
      switch (value) {
        case -1:
          return "danger";
        case 0:
          return "warning";
        case 99:
          return "success";
        default:
          return "";
      }
    },
    formatStatus(value) {
      switch (value) {
        case -1:
          return "驳回";
        case 0:
          return "待审核";
        case 99:
          return "通过";
        default:
          return "-";
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
      } else {
        this.title = "查询窗口（点击展开）";
      }
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
        "&loginCode=" +
        this.q.loginCode +
        "&tarOrgCode=" +
        this.q.tarOrgCode +
        "&status=" +
        this.q.status +
        "&startTime=" +
        this.q.startTime +
        "&endTime=" +
        this.q.endTime +
        "&srcOrgCode=" +
        this.q.srcOrgCode;
      let r = await this._fetch(
        "/org/shiftOrg/verifyList?limit=50&page=1" + queryParams,
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
      this.value = [formatDate(nextM_start), formatDate(new Date())];
      this.q = {
        loginCode: "",
        tarOrgCode: "",
        srcOrgCode: "",
        status: "",
        startTime: this.value[0] + " 00:00:00",
        endTime: this.value[1] + " 23:59:59"
      };
    },
    download() {
      const token = window.localStorage.getItem("token");
      this.q.startTime = this.value[0] + " 00:00:00";
      this.q.endTime = this.value[1] + " 23:59:59";
      let queryUrl =
        "/org/shiftOrg/downVerify?type=org&token=" +
        token +
        "&startTime=" +
        this.q.startTime +
        "&endTime=" +
        this.q.endTime +
        "&status=" +
        this.q.status;
      fetch(this.baseURL + queryUrl, {
        headers: {
          "Content-type": "application/json;charset=UTF-8",
          token: token
        }
      }).then(res =>
        res.blob().then(blob => {
          var filename = `转移机构管理.xls`;
          var a = document.createElement("a");
          var url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        })
      );
    },
    downloadTemp() {
      const token = window.localStorage.getItem("token");
      let queryUrl = "/org/shiftOrg/download?token=" + token;
      fetch(this.baseURL + queryUrl, {
        headers: {
          "Content-type": "application/json;charset=UTF-8",
          token: token
        }
      }).then(res =>
        res.blob().then(blob => {
          var filename = `机构转移名单模板.xls`;
          var a = document.createElement("a");
          var url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        })
      );
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    onExceed() {
      this.$message("每次只能选择一个文件，请删除文件重选");
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    aduitHandle(index, row) {
      if (row.status !== 0) {
        this.$message("存在已审核的记录，请检查后重新审核！");
        return;
      }
      this.audit = {
        status: "",
        remark: "",
        ids: [],
        shiftIds: []
      };
      this.audit.ids.push(row.id.toString());
      this.audit.shiftIds.push(row.shiftId.toString());
      this.dialogFormVisible = true;
    },
    async auditConfirm() {
      if (!this.audit.status) {
        this.$message("请选择审核意见");
        return;
      }
      let r = await this._fetch("/org/shiftOrg/verifyBatch", {
        method: "POST",
        body: this.audit
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.query();
      } else {
        this.$message(r.msg);
      }
      this.dialogFormVisible = false;
    },
    async handleSizeChange(val) {
      let r = await this._fetch(
        "/org/shiftOrg/verifyList?limit=" +
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
        "/org/shiftOrg/verifyList?limit=" + this.page.pageSize + "&page=" + val,
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
.btn-item {
  width: 120px;
}
</style>

