<template>
  <div class="page-container">
    <div v-show="!switchForm" class="show-box">
      <div class="btn-box">
        <el-button v-if="hasPermission('sys:menu:save')" type="primary" icon="el-icon-plus" @click="add">新增</el-button>
        <el-button v-if="hasPermission('sys:menu:update')" type="primary" icon="el-icon-edit-outline" @click="update">修改</el-button>
        <el-button v-if="hasPermission('sys:menu:delete')" type="danger" icon="el-icon-delete" @click="del">删除</el-button>
      </div>
      <div class="tb-box">
        <el-table
          ref="dataTable"
          :data="tableListData"
          :row-style="toggleDisplayTr"
          border
          stripe
          class="init_table"
          max-height="700"
          :header-cell-style="rowClass"
        >
          <!-- <el-table-column type="selection" width="45" align="center"/> -->
          <el-table-column width="50" center>
            <template slot-scope="scope">
              <el-radio
                class="radio"
                v-model="radio"
                :label="scope.$index"
                @change.native="getCurrentRow(scope.row)"
              >&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column align="center" width="90" prop="menuId" label="菜单ID"/>
          <el-table-column label="权限名称" min-width="150" show-overflow-tooltip align="left">
            <template slot-scope="scope">
              <p :style="`margin-left: ${scope.row.__level * 20}px;margin-top:0;margin-bottom:0`">
                <i
                  :class="toggleFoldingClass(scope.row)"
                  class="permission_toggleFold"
                  @click="toggleFoldingStatus(scope.row)"
                />
                {{ scope.row.name }}
              </p>
            </template>
          </el-table-column>
          <el-table-column align="center" width="150" prop="parentName" label="上级菜单"/>
          <el-table-column align="center" width="80" label="图标">
            <!-- <template slot-scope="scope">
              <svg-icon :iconClass="scope.row.icon"></svg-icon>
            </template>-->
          </el-table-column>
          <el-table-column align="center" width="90" prop="type" label="类型"></el-table-column>
          <el-table-column align="center" width="90" prop="orderNum" label="排序号"/>
          <el-table-column
            align="left"
            width="200"
            prop="url"
            label="菜单URL"
            :show-overflow-tooltip="true"
          />
          <!-- <el-table-column align="center" width="90" prop="__level" label="层级"/> -->
          <!-- <el-table-column align="left" prop="__identity" label="节点标识"/> -->
          <el-table-column align="center" width="150" label="授权标识"/>
        </el-table>
      </div>
      <el-dialog title="提示" :visible.sync="delTip" width="20%" top="30vh">
        <span>确定要删除选中的记录？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="delTip = false">取 消</el-button>
          <el-button type="primary" @click="delConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <div v-show="switchForm" class="form-section">
      <div class="panel" v-html="panelTitle"/>
      <div class="form-container">
        <el-form ref="menu" :model="menu" label-width="100px">
          <el-form-item label="类型">
            <el-radio-group v-model="menu.type">
              <el-radio label="0">目录</el-radio>
              <el-radio label="1">菜单</el-radio>
              <el-radio label="2">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="菜单名称">
            <el-input v-model="menu.name" placeholder="菜单名称或按钮名称"/>
          </el-form-item>
          <el-form-item label="上级菜单">
            <el-input v-model="menu.parentName" readonly placeholder="一级菜单" @focus="showMenuTree"/>
          </el-form-item>
          <el-form-item label="菜单URL" v-if="menu.type != 2">
            <el-input v-model="menu.url" placeholder="菜单URL"/>
          </el-form-item>
          <el-form-item label="授权标识" v-if="menu.type == 1 || menu.type == 2">
            <el-input v-model="menu.perms" placeholder="多个用逗号分隔，如：user:list,user:create"/>
          </el-form-item>
          <el-form-item label="排序号" v-if="menu.type != 2">
            <el-input v-model="menu.orderNum"/>
          </el-form-item>
          <el-form-item label="图标" v-if="menu.type != 2">
            <el-input v-model="menu.icon"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确定</el-button>
            <el-button type="warning" @click="reback">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <el-dialog title="选择菜单" :visible.sync="dialogTableVisible" width="300px" height="250px">
      <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>
            <svg-icon :iconClass="node.icon"></svg-icon>
            {{ node.label }}
          </span>
        </span>
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogTableVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import data2 from "./data2";
import Vue from "vue";
import { formatMenuData,isBlank,hasPermission } from "@/utils";
export default {
  data() {
    return {
      radio: false,
      menuData: [],
      dealedData: [],
      tableListData: [],
      foldList: [],
      multipleSelection: [], // 该数组中的值 都会在列表中进行隐藏  死亡名单
      loading: true,
      switchForm: false,
      dialogTableVisible: false,
      menu: {
        type: "1"
      },
      panelTitle: "",
      defaultProps: {
        children: "children",
        label: "name"
      },
      treeData: [],
      data: {},
      delTip: false
    };
  },
  computed: {
    /** *******************************
     ** Fn: foldAllList
     ** Intro: 记录属性结构的首层节点
     ** Author: zyx
     *********************************/
    foldAllList() {
      return this.tableListData.map(x => x.__identity);
    }
  },
  created() {
    // this.dealedData = []
    this.getMenuList();
    this.getMenuTree();
  },
  methods: {
    hasPermission(val){
      return hasPermission(val)
    },
    initData() {
      this.dealedData = formatMenuData(this.menuData);
      console.log(this.dealedData)
      this.tableListData = this.formatConversion([], this.dealedData);
      // this.tableListData = this.formatConversion([], data)
      this.foldList = this.foldAllList;
    },
    add() {
      this.panelTitle = "新增菜单";
      this.switchForm = true;
      this.menu = { parentName: null, parentId: 0, type: "1", orderNum: 0 };
    },
    update() {
      if (!this.multipleSelection.menuId) {
        this.$message("请选择一条记录");
        return;
      }
      this.panelTitle = "菜单信息更改";
      this.switchForm = true;
      this.getMenuInfo();
    },
    del() {
      if (!this.multipleSelection.menuId) {
        this.$message("请选择一条记录");
        return;
      }
      this.delTip = true;
    },
    async delConfirm() {     
      let r = await this._fetch("/sys/menu/delete", {
        method: "POST",
        body: this.menu.menuId
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.getMenuList();
        this.delTip = false;
      } else {
        this.$message(r.msg);
        this.delTip = false;
      }
    },
    /** *******************************
     ** Fn: toggleFoldingStatus
     ** Intro: 切换展开 还是折叠
     ** @params: params 当前点击行的数据
     ** Author: zyx
     *********************************/
    toggleFoldingStatus(params) {
      this.foldList.includes(params.__identity)
        ? this.foldList.splice(this.foldList.indexOf(params.__identity), 1)
        : this.foldList.push(params.__identity);
    },
    /** *******************************
     ** Fn: toggleDisplayTr
     ** Intro: 该方法会对每一行数据都做判断 如果foldList 列表中的元素 也存在与当前行的 __family列表中  则该行不展示
     ** @params:
     ** Author: zyx
     *********************************/
    toggleDisplayTr({ row, index }) {
      for (let i = 0; i < this.foldList.length; i++) {
        const item = this.foldList[i];
        // 如果foldList中元素存在于 row.__family中，则该行隐藏。  如果该行的自身标识等于隐藏元素，则代表该元素就是折叠点
        if (row.__family.includes(item) && row.__identity !== item)
          return "display:none;";
      }
      return "";
    },
    /** *******************************
     ** Fn: toggleFoldingClass
     ** Intro: 如果子集长度为0，则不返回字体图标。
     ** Intro: 如果子集长度为不为0，根据foldList是否存在当前节点的标识返回相应的折叠或展开图标
     ** Intro: 关于class说明：permission_placeholder返回一个占位符，具体查看class
     ** @params: params 当前行的数据对象
     ** Author: zyx
     *********************************/
    toggleFoldingClass(params) {
      return params.Children == null
        ? "permission_placeholder"
        : this.foldList.indexOf(params.__identity) === -1
        ? "iconfont icon-liebiaoshouqi_"
        : "iconfont icon-liebiaozhankaitianjia_";
    },
    /** *******************************
     ** Fn: formatConversion
     ** Intro: 将树形接口数据扁平化
     ** @params: parent 为当前累计的数组  也是最后返回的数组
     ** @params: children 为当前节点仍需继续扁平子节点的数据
     ** @params: index 默认等于0， 用于在递归中进行累计叠加 用于层级标识
     ** @params: family 装有当前包含元素自身的所有父级 身份标识
     ** @params: elderIdentity 父级的  唯一身份标识
     ** Author: zyx
     *********************************/
    formatConversion(
      parent,
      children,
      index = 0,
      family = [],
      elderIdentity = "x"
    ) {
      // children如果长度等于0，则代表已经到了最低层
      // let page = (this.startPage - 1) * 10
      if (children.length > 0) {
        children.map((x, i) => {
          // 设置 __level 标志位 用于展示区分层级
          Vue.set(x, "__level", index);
          // 设置 __family 为家族关系 为所有父级，包含本身在内
          Vue.set(x, "__family", [...family, elderIdentity + "_" + i]);
          // 本身的唯一标识  可以理解为个人的身份证咯 一定唯一。
          Vue.set(x, "__identity", elderIdentity + "_" + i);
          parent.push(x);
          // 如果仍有子集，则进行递归
          if (x.Children && x.Children.length > 0)
            this.formatConversion(
              parent,
              x.Children,
              index + 1,
              [...family, elderIdentity + "_" + i],
              elderIdentity + "_" + i
            );
        });
      }
      return parent;
    },
    onSubmit() {
      if (this.validator()) {
        return;
      }
      var url = this.menu.menuId == null ? "/sys/menu/save" : "/sys/menu/update";
      this.addUser(url);
    },
    async addUser(url) {
      let r = await this._fetch(url, {
        method: "POST",
        body: this.menu
      });
      if (r.code === 0) {
        this.$message("操作成功");
        this.getMenuList();
        this.switchForm = false;
      } else {
        this.$message(r.msg);
      }
    },
    reback() {
      this.switchForm = false;
    },
    async getMenuList() {
      this.menuData = await this._fetch("/sys/menu/list", {
        method: "GET"
      });
      this.initData();
    },
    async getMenuTree() {
      this.data = await this._fetch("/sys/menu/select", {
        method: "GET"
      });
    },
    async getMenuInfo() {
      let r = await this._fetch(
        "/sys/menu/info/" + this.menu.menuId,
        {
          method: "GET"
        }
      );
      this.menu = r.menu;
      this.menu.type = r.menu.type.toString();
      this.data.menuList.forEach(item => {
        if (this.menu.parentId == item.menuId) {
          return this.menu.parentName = item.name;
        }
      });
      console.log(this.menu.parentName)
    },
    showMenuTree() {
      this.dialogTableVisible = true;
      this.treeData = this.transform(this.data);
    },
    handleNodeClick(data) {
      console.log(data)
      this.menu.parentName = data.name;
      this.menu.parentId = data.menuId;
    },
    // handleSelectionChange(val) {
    //   this.multipleSelection = val;
    //   this.menu.ids = [];
    //   this.multipleSelection.forEach(item => {
    //     this.menu.ids.push(item.id);
    //   });
    //   this.rowData = this.multipleSelection[0];
    //   if (this.rowData) {
    //     this.menu.id = this.rowData.id;
    //   }
    // },
    // getRowData(row) {
    //   console.log(row)
    //   this.$refs.dataTable.toggleRowSelection(row);
    //   this.menu.menuId = row.menuId;
    // },
    getCurrentRow(val) {
      this.multipleSelection = val;
      this.menu = val;
      this.menu.menuId = val.menuId;
    },
    // select(selection, row) {
    //   if (selection.length > 1) {
    //     selection.shift();
    //   }
    //   this.multipleSelection = row;
    //   this.menu = row;
    //   this.menu.menuId = row.menuId;
    // },
    // //限制全选
    // handleSelectionChange(val){
    //   if(val.length > 2){
    //     this.$message('请选择一条记录');
    //     this.$refs.dataTable.clearSelection()
    //   }
    // },
    // getRowData(row) {
    //   this.$refs.dataTable.toggleRowSelection(row);
    //   this.multipleSelection = row;
    //   this.menu = row;
    //   this.menu.menuId = row.menuId;
    // },
    transform(data) {
      var menuData = data.menuList;
      var newData = [];
      menuData.forEach(item => {
        if (item.parentId == 0) {
          item.icon = "folder";
          newData.push(item);
        }
      });
      newData.map(item => {
        item.children = [];
        menuData.forEach(obj => {
          if (obj.parentId == item.menuId) {
            obj.icon = "folder";
            item.children.push(obj);
          }
        });
      });
      newData.map(item => {
        item.children.map(obj => {
          obj.children = [];
          menuData.forEach(child => {
            if(child.parentId == obj.menuId){
              child.icon = "file";
              obj.children.push(child)
            }
          })
        })
      });
      return newData;
    },
    validator: function() {
      if (isBlank(this.menu.name)) {
        this.$message("菜单名称不能为空");
        return true;
      }

      //菜单
      if (this.menu.type === 1 && isBlank(this.menu.url)) {
        this.$message("菜单URL不能为空");
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
</style>

