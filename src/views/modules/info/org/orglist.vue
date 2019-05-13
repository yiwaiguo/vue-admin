<template>
  <div class="org-list">
    <el-row :gutter="20">
      <el-col :span="10">
        <div style="height: 700px;overflow-y:scroll">
          <el-form>
            <el-form-item label="机构列表" label-width="100px">
              <ul id="menuTree" class="ztree"/>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="14">
        <div></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      setting: {
        data: {
          orgTree: [],
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
      }
    };
  },
  created() {
    this.getOrgTree();
  },
  methods: {
    async getOrgTree() {
      this.orgTree = await this._fetch("/org/bmorganization/list", {
        method: "GET"
      });
      this.initOrgTree();
    },
    initOrgTree() {
      const ztree = $.fn.zTree.init($("#menuTree"), this.setting, this.orgTree);
      // 展开所有节点
      ztree.expandAll(false);
    },
    //选中节点
    setOrg(event, treeId, treeNode, clickFlag) {}
  }
};
</script>
<style lang="scss" scoped>
.org-list {
  border: 2px solid #ddd;
  height: 800px;
  margin: 10px 30px;
  border-radius: 4px;
  padding: 20px 0 0 40px;
}
</style>
