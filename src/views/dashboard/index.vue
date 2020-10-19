<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Name: {{ name }}</div>
    <div class="dashboard-text">Roles: {{ roles.join(',') }}</div>
    <div class="dashboard-text">Lang Test: {{ $t('test.demo') }}</div>
    <!-- Admin can see this -->
    <el-tag v-permission="['Admin']">admin</el-tag>

    <!-- Editor can see this -->
    <el-tag v-permission="['Editor']">editor</el-tag>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDashboardData } from '@/api/dashboard'
import { Message } from 'element-ui'
import permission from '@/directive/permission/index.js' // 权限判断指令

export default {
  name: 'Dashboard',
  directives: { permission },
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  },
  created() {
    // this.fetchData()
  },
  methods: {
    fetchData() {
      const params = {
        advertiserId: 'all',
        appId: 'all',
        startDate: '2020-10-09',
        endDate: '2020-10-15',
        prevStartDate: '2020-10-02',
        prevEndDate: '2020-10-08',
        pageNum: 1,
        pageSize: 10,
        field: '',
        order: '',
        os: '',
        channel: '',
        geo: '',
      };
      getDashboardData(params)
        .then(response => {
          const { data } = response;
          console.log(data);
        })
        .catch(error => {
          Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
          })
        })
    }
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
