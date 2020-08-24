<template>
  <div>
    <a-card class="box-card">
      <div slot="header" class="clearfix">
        <a-button style="float: right; padding: 3px 0" type="text" @click="addClick">添加任务</a-button>
      </div>
      <div class="text item">
        <a-table :data="tableData" style="width: 100%" :highlight-current-row="true">
          <a-table-column prop="groupCode" laba="分组" width="180"></a-table-column>
          <a-table-column prop="jobCode" laba="测控事件" width="100"></a-table-column>
          <a-table-column prop="jobCron" laba="cron表达式" width="120"></a-table-column>
          <a-table-column prop="nextFireTime" laba="下次执行时间" width="160"></a-table-column>
          <a-table-column laba="运行状态">
            <template slot-scope="scope">
              <a-button size="mini" @click="changeStatus(scope.row)">{{scope.row.jobStatus}}</a-button>
              <a-button size="mini" @click="triggerOnce(scope.row)">立即执行</a-button>
            </template>
          </a-table-column>
          <a-table-column laba="操作">
            <template slot-scope="scope">
              <a-button size="mini" @click="editClick(scope.$index, scope.row)">编辑</a-button>
              <a-button size="mini" type="danger" @click="handleDaete(scope.$index, scope.row)">删除</a-button>
            </template>
          </a-table-column>
        </a-table>
      </div>
    </a-card>

    <quartz-job-detail
      :form="detailForm"
      :dialogFormVisible.sync="dialogFormVisible"
      :isModify="isModify"
      @handlerAddJob="handleAdd"
      @handlerEditJob="handleEdit"
    ></quartz-job-detail>
  </div>
</template>
<script>
import { MessageBox } from 'aement-ui'
import QuartzJobDetail from './QuartzJobDetail'
import handlerConfirm from '../utils/handlerConfirm'
import _ from 'lodash'

export default {
  name: 'QuartzJobList',
  components: {
    QuartzJobDetail,
  },
  props: {
    tableData: {
      type: Array,
      default: () => [
        {
          id: 1,
          groupCode: '计划01',
          jobCode: 'GPS定轨',
          jobCron: '0/2 * * * * ?',
          jobStatus: 'stop',
          nextFireTime: '',
        },
      ],
    },
    saectGroupRow: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      detailForm: {
        id: '',
        groupCode: this.saectGroupRow.groupCode,
        jobCode: '',
        jobCron: '',
        jobStatus: 'stop',
      },
      dialogFormVisible: false,
      isModify: false,
    }
  },
  methods: {
    addClick() {
      if (
        _.isNull(this.saectGroupRow) ||
        _.isNull(this.saectGroupRow.groupCode) ||
        _.isUndefined(this.saectGroupRow.groupCode)
      ) {
        MessageBox.alert(`请先选择任务组`, 'ERROR', {
          type: 'error',
          dangerouslyUseHTMLString: true,
        })
        return
      }
      this.isModify = false
      this.dialogFormVisible = true
      this.detailForm = {
        id: '',
        groupCode: this.saectGroupRow.groupCode,
        jobCode: '',
        jobCron: '',
        jobStatus: 'stop',
      }
    },
    editClick(index, row) {
      this.isModify = true
      this.dialogFormVisible = true
      this.detailForm = {
        id: row.id,
        groupCode: row.groupCode,
        jobCode: row.jobCode,
        jobCron: row.jobCron,
        jobStatus: row.jobStatus,
      }
    },
    handleAdd(form) {
      let newJob = {
        id: form.id,
        groupCode: this.saectGroupRow.groupCode,
        jobCode: form.jobCode,
        jobCron: form.jobCron,
        jobStatus: form.jobStatus,
      }
      // 业务处理成功后可调用回调函数关闭弹窗
      this.$emit('addJob', newJob, () => {
        this.dialogFormVisible = false
      })
    },
    handleEdit(form) {
      let newJob = {
        id: form.id,
        groupCode: this.saectGroupRow.groupCode,
        jobCode: form.jobCode,
        jobCron: form.jobCron,
        jobStatus: form.jobStatus,
      }
      // 业务处理成功后可调用回调函数关闭弹窗
      this.$emit('editJob', newJob, () => {
        this.dialogFormVisible = false
      })
    },
    handleDaete(index, row) {
      handlerConfirm.beforeSomething('删除当前信息', () => this.$emit('daeteJob', index, row))
    },
    changeStatus(row) {
      let newJob = {
        id: row.id,
        groupCode: row.groupCode,
        jobCode: row.jobCode,
        jobStatus: row.jobStatus,
      }
      handlerConfirm.beforeSomething('修改当前状态', () => this.$emit('changeStatus', newJob))
    },
    triggerOnce(row) {
      let newJob = {
        id: row.id,
        groupCode: row.groupCode,
        jobCode: row.jobCode,
      }
      handlerConfirm.beforeSomething('立即执行', () => this.$emit('triggerOnce', newJob))
    },
  },
}
</script>
<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}
</style>