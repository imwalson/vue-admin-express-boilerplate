<template>
  <div class="app-container">
    <div class="page-main-card card">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="Advertiser name">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="Contact name"  width="220">
          <template slot-scope="scope">
            {{ scope.row.contact_name }}
          </template>
        </el-table-column>
        <el-table-column label="Email" width="250" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.contact_email }}</span>
          </template>
        </el-table-column>
        <el-table-column class-name="status-col" label="Status" width="110" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.audit_status | statusTypeFilter">{{ scope.row.audit_status | statusFilter }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="Create date" width="200">
          <template slot-scope="scope">
            <i class="el-icon-time" />
            <span>{{ scope.row.created_on }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pager.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pager.size"
          layout="total, sizes, prev, pager, next"
          :total="pager.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getAdvertiserList } from '@/api/advertiser'

export default {
  filters: {
    statusTypeFilter(status) {
      const statusMap = {
        '-2': 'gray',
        '-1': 'info',
        '0': '',
        '1': 'success',
        '2': 'danger',
      };
      return statusMap[status];
    },
    statusFilter(status) {
      const statusMap = {
        '-2': '草稿',
        '-1': '修改未同步',
        '0': '同步中',
        '1': '同步成功',
        '2': '同步失败',
      };
      return statusMap[`${status}`];
    },
  },
  data() {
    return {
      list: null,
      listLoading: true,
      keyWord: '',
      pager: {
        page: 1,
        size: 20,
        total: 0,
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true;
      const data = {
        keyWord: this.keyWord,
        pageNum: this.pager.page,
        pageSize: this.pager.size,
        source: '1', // 1.advertiser management 2.advertiser review
      };
      getAdvertiserList(data).then(res => {
        if (res.code === 1 || res.code === 0) {
          const list = res.object && res.object.data ? res.object.data : [];
          this.list = list;
          this.pager = {
            page: res.object.currentPage,
            size: res.object.recordsPerPage,
            total: res.object.totalRecords,
          };
          window.scroll(0, 0);
        } else {
          this.$message.error(res.message);
        }
        this.listLoading = false
      }).catch(err => {
        this.$message.error(err);
      })
    },
    handleSizeChange(val) {
      this.pager.size = val;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.pager.page = val;
      this.fetchData();
    }
  }
}
</script>
