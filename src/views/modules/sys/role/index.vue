<template>
  <div class="page-container">
    <div class="show-box" v-show="!switchForm">
      <div class="query-box">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="角色名">
            <el-input v-model="formInline.user" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="info" @click="query">查询</el-button>
            <el-button type="info" @click="clearHandle">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="btn-box">
        <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button type="primary" icon="el-icon-edit-outline" @click="update">修改</el-button>
        <el-button type="danger" icon="el-icon-delete" @click="del">删除</el-button>
      </div>
      <div class="tb-box">
        <el-table
          :data="tableData"
          style="width: 100%"
          border
          :current-row-key="CurrentRowKey"
          max-height="500"
        >
          <el-table-column type="index" width="35" align="center"></el-table-column>
          <el-table-column type="selection" width="45" align="center"></el-table-column>
          <el-table-column prop="roleId" label="角色ID" align="center"></el-table-column>
          <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
          <el-table-column prop="remark" label="备注" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 30, 50]"
          :page-size="50"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400"
          background
        ></el-pagination>
      </div>
    </div>

    <div class="form-section" v-show="switchForm">
      <div class="panel" v-html="panelTitle"></div>
      <div class="form-container">
        <el-form ref="role" :model="role" label-width="100px">
          <el-form-item label="角色名称">
            <el-input v-model="role.roleName" placeholder="角色名称"></el-input>
          </el-form-item>
          <el-form-item label="超管子账号">
            <el-checkbox-group v-model="role.roleType">
              <el-checkbox label name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="role.remark" placeholder="备注"></el-input>
          </el-form-item>
          <el-form-item label="授权">
            <ul id="menuTree" class="ztree"></ul>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确定</el-button>
            <el-button type="warning" @click="reback">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formInline: {
        user: "",
        region: ""
      },
      tableData: [],
      CurrentRowKey: "",
      currentPage: 1,
      switchForm: false,
      role: {},
      panelTitle: "新增用户",
      dealers: [
        { dealerCode: "D00", dealerId: "D00" },
        { dealerCode: "DE1", dealerId: "DE1" }
      ],
      checkAbleRoleList: [
        { roleId: 1, roleName: "aa" },
        { roleId: 2, roleName: "bb" }
      ],
      setting: {
        data: {
          simpleData: {
            enable: true,
            idKey: "orgId",
            pIdKey: "parentId"
            // rootPId: -1
          },
          key: {
            url: "nourl",
            name: "orgName"
          }
        },
        callback: {
          onClick: this.setOrg
        }
      },
      orgTree: [
        {
          id: 1000044,
          orgId: "-2",
          orgCode: "营运中心机构",
          orgName: "营运中心机构",
          orgSequence: "@4",
          dealerId: "-1",
          brokerDealerId: "-1",
          baseInfoIDCard: "",
          baseInfoIDType: "",
          baseInfoTelephone: "",
          parentId: "-2",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000045,
          orgId: "-1",
          orgCode: "unknow",
          orgName: "未知机构",
          orgSequence: "@1",
          dealerId: "-1",
          brokerDealerId: "-1",
          baseInfoIDCard: "",
          baseInfoIDType: "",
          baseInfoTelephone: "",
          parentId: "-1",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000046,
          orgId: "2",
          orgCode: "exchange",
          orgName: "默认交易商",
          orgSequence: "@3",
          dealerId: "-1",
          brokerDealerId: "-1",
          baseInfoIDCard: "",
          baseInfoIDType: "",
          baseInfoTelephone: "",
          parentId: "1",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000047,
          orgId: "4",
          orgCode: "D00",
          orgName: "D00",
          orgSequence: "348721",
          dealerId: "2",
          brokerDealerId: "3",
          baseInfoIDCard: "D00",
          baseInfoIDType: "6",
          baseInfoTelephone: "",
          parentId: "3",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000048,
          orgId: "1",
          orgCode: "root",
          orgName: "默认机构",
          orgSequence: "@2",
          dealerId: "-1",
          brokerDealerId: "-1",
          baseInfoIDCard: "",
          baseInfoIDType: "",
          baseInfoTelephone: "",
          parentId: "-1",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000049,
          orgId: "3",
          orgCode: "T00",
          orgName: "T00",
          orgSequence: "760677",
          dealerId: "2",
          brokerDealerId: "0",
          baseInfoIDCard: "T00",
          baseInfoIDType: "6",
          baseInfoTelephone: "",
          parentId: "2",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000050,
          orgId: "5",
          orgCode: "D00001",
          orgName: "D00001",
          orgSequence: "186160",
          dealerId: "2",
          brokerDealerId: "3",
          baseInfoIDCard: "D00001",
          baseInfoIDType: "6",
          baseInfoTelephone: "",
          parentId: "4",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: "2018-11-18 00:06:53",
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000051,
          orgId: "6",
          orgCode: "DEF",
          orgName: "DEF",
          orgSequence: "238412",
          dealerId: "12",
          brokerDealerId: "0",
          baseInfoIDCard: "DEF",
          baseInfoIDType: "6",
          baseInfoTelephone: "",
          parentId: "2",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000052,
          orgId: "7",
          orgCode: "DE1",
          orgName: "DE1",
          orgSequence: "560553",
          dealerId: "12",
          brokerDealerId: "13",
          baseInfoIDCard: "DE1",
          baseInfoIDType: "6",
          baseInfoTelephone: "",
          parentId: "6",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000053,
          orgId: "8",
          orgCode: "TES",
          orgName: "TES",
          orgSequence: "665812",
          dealerId: "14",
          brokerDealerId: "0",
          baseInfoIDCard: "TES",
          baseInfoIDType: "6",
          baseInfoTelephone: "",
          parentId: "2",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000054,
          orgId: "10",
          orgCode: "TES1",
          orgName: "TES1",
          orgSequence: "669192",
          dealerId: "14",
          brokerDealerId: "15",
          baseInfoIDCard: "TES1",
          baseInfoIDType: "6",
          baseInfoTelephone: "",
          parentId: "8",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000055,
          orgId: "11",
          orgCode: "BUI1",
          orgName: "BUI1",
          orgSequence: "620387",
          dealerId: "16",
          brokerDealerId: "17",
          baseInfoIDCard: "BUI1",
          baseInfoIDType: "6",
          baseInfoTelephone: "",
          parentId: "9",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000056,
          orgId: "12",
          orgCode: "BUI1000123456",
          orgName: "BUI1000123456",
          orgSequence: "280308",
          dealerId: "16",
          brokerDealerId: "17",
          baseInfoIDCard: "BUI1000123456",
          baseInfoIDType: "6",
          baseInfoTelephone: "",
          parentId: "11",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000057,
          orgId: "15",
          orgCode: "TES3",
          orgName: "TES3-测试订货分部",
          orgSequence: "994221",
          dealerId: "24",
          brokerDealerId: "0",
          baseInfoIDCard: "TES3",
          baseInfoIDType: "6",
          baseInfoTelephone: "",
          parentId: "2",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000058,
          orgId: "14",
          orgCode: "TES2",
          orgName: "TES2-测试订货分部",
          orgSequence: "170727",
          dealerId: "23",
          brokerDealerId: "0",
          baseInfoIDCard: "TES2",
          baseInfoIDType: "6",
          baseInfoTelephone: "",
          parentId: "2",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000059,
          orgId: "13",
          orgCode: "BU1",
          orgName: "BU1",
          orgSequence: "323417",
          dealerId: "16",
          brokerDealerId: "18",
          baseInfoIDCard: "BU1",
          baseInfoIDType: "6",
          baseInfoTelephone: "",
          parentId: "9",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000060,
          orgId: "9",
          orgCode: "BUI",
          orgName: "BUI",
          orgSequence: "9070",
          dealerId: "16",
          brokerDealerId: "0",
          baseInfoIDCard: "BUI",
          baseInfoIDType: "6",
          baseInfoTelephone: "",
          parentId: "2",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000061,
          orgId: "16",
          orgCode: "TE2",
          orgName: "测试区域服务商TE2",
          orgSequence: "219701",
          dealerId: "23",
          brokerDealerId: "25",
          baseInfoIDCard: "TE2",
          baseInfoIDType: "6",
          baseInfoTelephone: "",
          parentId: "14",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000062,
          orgId: "17",
          orgCode: "TE3",
          orgName: "测试区域服务商TE3",
          orgSequence: "735330",
          dealerId: "24",
          brokerDealerId: "26",
          baseInfoIDCard: "TE3",
          baseInfoIDType: "6",
          baseInfoTelephone: "",
          parentId: "15",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: "2018-07-30 11:44:44",
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000063,
          orgId: "18",
          orgCode: "TES1999999999",
          orgName: "测试",
          orgSequence: "902242",
          dealerId: "14",
          brokerDealerId: "15",
          baseInfoIDCard: "999999999",
          baseInfoIDType: "4",
          baseInfoTelephone: "",
          parentId: "10",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000064,
          orgId: "21",
          orgCode: "TE3000000001",
          orgName: "测试",
          orgSequence: "223994",
          dealerId: "24",
          brokerDealerId: "26",
          baseInfoIDCard: "00000",
          baseInfoIDType: "4",
          baseInfoTelephone: "",
          parentId: "17",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000065,
          orgId: "19",
          orgCode: "TE2000000000",
          orgName: "测试",
          orgSequence: "354310",
          dealerId: "23",
          brokerDealerId: "25",
          baseInfoIDCard: "000000000",
          baseInfoIDType: "4",
          baseInfoTelephone: "",
          parentId: "16",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000066,
          orgId: "20",
          orgCode: "TE2000000001",
          orgName: "测试2",
          orgSequence: "350944",
          dealerId: "23",
          brokerDealerId: "25",
          baseInfoIDCard: "000000001",
          baseInfoIDType: "4",
          baseInfoTelephone: "",
          parentId: "16",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-07-11 06:01:36",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        },
        {
          id: 1000067,
          orgId: "22",
          orgCode: "D00111111111",
          orgName: "123",
          orgSequence: "864991",
          dealerId: "2",
          brokerDealerId: "3",
          baseInfoIDCard: "kl;",
          baseInfoIDType: "6",
          baseInfoTelephone: "",
          parentId: "4",
          primaryKeyName: "orgId",
          intoUser: "ADMIN",
          intoTime: "2018-11-18 00:06:56",
          updUser: "ADMIN",
          updTime: null,
          remarks: null,
          subOrgCount: null,
          userCount: null,
          levelInfo: null
        }
      ]
    };
  },
  methods: {
    query() {
      let queryData = { user: this.formInline.user };
      this._fetch("/query", {
        method: "POST",
        body: queryData
      });
    },
    clearHandle() {
      this.formInline.user = "";
    },
    add() {
      this.switchForm = true;
      this.panelTitle = '新增角色';
    },
    update() {
      if (!this.CurrentRowKey) {
        this.$message("请选择一条记录");
      }
      this.panelTitle = '角色信息更改';
    },
    del() {
      if (!this.CurrentRowKey) {
        this.$message("请选择一条记录");
      }
    },
    uptDraPwd() {
      if (!this.CurrentRowKey) {
        this.$message("请选择一条记录");
      }
    },
    reset() {
      if (!this.CurrentRowKey) {
        this.$message("请选择一条记录");
      }
    },
    onSubmit() {},
    reback() {
      this.switchForm = false;
    },
    initOrgTree() {
      let ztree = $.fn.zTree.init($("#menuTree"), this.setting, this.orgTree);
      //展开所有节点
      ztree.expandAll(false);
    },
    setOrg(event, treeId, treeNode, clickFlag) {
      this.user.orgId = treeNode.orgId;
    },
    getAdminList() {
      //   this._fetch("/admin", { method: "GET" });
    },
    handleSizeChange() {},
    handleCurrentChange() {}
  },
  created() {
    this.getAdminList();
  },
  mounted() {
    this.initOrgTree();
  }
};
</script>
<style>
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
</style>

