<template>
  <div class="execution-viewer">
    <adt-search-folder
      :searchRouter="{query: {accountName: search.accountName, organizationId: search.organizationId, phoneNumber: search.phoneNumber}}"
      @on-triggerFolder="searchChange"
    >
      <template slot="always-show">
        <Col span="4" class="search-condition">
          <span>场景编码:</span>
          <Input v-model="search.accountName" clearable></Input>
        </Col>
        <Col span="4" class="search-condition line-margin">
          <span>场景名称:</span>
          <Input v-model="search.organizationId" clearable></Input>
        </Col>
        <Col span="4" class="search-condition line-margin">
          <span>服务类型:</span>
          <Input v-model="search.phoneNumber" clearable></Input>
        </Col>
        <Col span="4" class="search-condition line-margin">
          <span>运输类型:</span>
          <Input v-model="search.phoneNumber" clearable></Input>
        </Col>
      </template>
    </adt-search-folder>
  </div>
</template>

<script>
export default {
  name: "execution-viewer",
  data() {
    return {
      search: {}
    };
  },
  methods: {
    getPages(page) {
      this.page = page;
    },
    dataInit() {
      this.getData();
    },
    getData() {},
    add() {
      this.isModalShow = true;
    },
    searchChange() {},
    checkData(data, status) {
      console.log(data, status);
    }
  }
};
</script>

<style lang="scss" scoped>
span {
  // width: 120px;
  min-width: 70px;
  line-height: 30px;
}
.search-condition {
  display: flex;
}
.line-margin {
  margin-left: 30px;
}
.icon-action {
  margin: 0 10px;
}
.btn-pagina {
  display: flex;
  padding: 20px 0;
  .pagination {
    width: 50%;
    text-align: right;
    margin-right: 2%;
  }
}
</style>