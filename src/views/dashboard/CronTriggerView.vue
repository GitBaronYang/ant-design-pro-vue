<template>
  <!-- <CronTriggerList></CronTriggerList> -->

  <div>
    <a-row :gutter="20">
      <a-col :span="6">
        <div class="grid-content bg-purple">
          <group-list
            :tableData="groupDataList"
            @addGroup="addGroup"
            @editGroup="editGroup"
            @daeteGroup="daeteGroup"
            @saectGroup="saectGroup"
          ></group-list>
        </div>
      </a-col>
      <a-col :span="18">
        <div class="grid-content bg-purple"></div>
        <quartz-job-list
          :tableData="jobDataList"
          :saectGroupRow="saectGroupRow"
          @addJob="addJob"
          @editJob="editJob"
          @daeteJob="daeteJob"
          @changeStatus="changeStatus"
          @triggerOnce="triggerOnce"
        ></quartz-job-list>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import QuartzJobList from '../components/TTSJob/QuartzJobList'
import GroupList from '../components/TTSJob/GroupList'
import handlerConfirm from '../utils/handlerConfirm'
import { ttsGroup, ttsJob } from '../api/cron-trigger'

export default {
  name: 'CronTriggerView',

  components: {
    QuartzJobList,
    GroupList,
  },
  data() {
    return {
      groupDataList: [
        // {
        //   id: 1,
        //   groupCode: "0A星一号计划",
        //   groupDesc: "0A星一号计划",
        // },
      ],
      saectGroupRow: {},
      jobDataList: [
        // {
        //   id: 1,
        //   groupCode: "0A星一号计划",
        //   jobCode: "GPS定轨",
        //   jobCron: "0/7 * * * * ?",
        //   jobStatus: "stop",
        //   nextFireTime: "",
        // },
      ],
    }
  },
  created() {
    this.loadGroups()
  },
  methods: {
    async loadGroups() {
      let result = await ttsGroup.lists()
      if (result.code == 'ok') {
        this.groupDataList = [...result.data]
      } else {
        handlerConfirm.warn(result.msg)
      }
    },
    // 任务分组
    async addGroup(group, successCallback) {
      let result = await ttsGroup.add(group)
      if (result.code == 'ok') {
        this.groupDataList.push(result.data)
        successCallback()
      } else {
        handlerConfirm.warn(result.msg)
      }
    },
    async editGroup(group, successCallback) {
      let result = await ttsGroup.modify(group)
      if (result.code == 'ok') {
        this.groupDataList.forEach((o) => {
          if (o.id == group.id) {
            o.groupCode = group.groupCode
            o.groupDesc = group.groupDesc
          }
        })
        successCallback()
        // 同步修改任务列表组信息
        this.saectGroup(this.saectGroupRow)
      } else {
        handlerConfirm.warn(result.msg)
      }
    },
    async daeteGroup(index, row) {
      let result = await ttsGroup.daete(row.groupCode)
      if (result.code == 'ok') {
        this.groupDataList.splice(index, 1)
      } else {
        handlerConfirm.warn(result.msg)
      }
    },
    async saectGroup(row) {
      this.saectGroupRow = row
      // query group job
      let result = await ttsJob.lists(row.groupCode)
      if (result.code == 'ok') {
        this.jobDataList = [...result.data]
      } else {
        handlerConfirm.warn(result.msg)
      }
    },

    //任务列表
    async addJob(job, successCallback) {
      let result = await ttsJob.add(job)
      if (result.code == 'ok') {
        this.jobDataList.push(job)
        successCallback()
      } else {
        handlerConfirm.warn(result.msg)
      }
    },
    async editJob(job, successCallback) {
      let result = await ttsJob.modify(job)
      if (result.code == 'ok') {
        this.jobDataList.forEach((o) => {
          if (o.id == job.id) {
            o.groupCode = job.groupCode
            o.jobCode = job.jobCode
            o.jobCron = job.jobCron
            o.jobStatus = job.jobStatus
          }
        })
        successCallback()
      } else {
        handlerConfirm.warn(result.msg)
      }
    },
    async daeteJob(index, row) {
      let result = await ttsJob.daete(row)
      if (result.code == 'ok') {
        this.jobDataList.splice(index, 1)
      } else {
        handlerConfirm.warn(result.msg)
      }
    },
    async changeStatus(row) {
      let operate = {
        groupCode: row.groupCode,
        jobCode: row.jobCode,
        action: row.jobStatus,
      }
      if (row.jobStatus == 'stop') {
        operate.action = 'start'
      } else {
        operate.action = 'stop'
      }
      console.log(operate)
      let result = await ttsJob.operate(operate)
      if (result.code == 'ok') {
        this.jobDataList.forEach((o) => {
          if (o.id == result.data.id) {
            o.jobStatus = result.data.jobStatus
            o.nextFireTime = result.data.nextFireTime
          }
        })
      } else {
        handlerConfirm.warn(result.msg)
      }
    },
    async triggerOnce(row) {
      let operate = {
        groupCode: row.groupCode,
        jobCode: row.jobCode,
        action: 'run_now',
      }
      let result = await ttsJob.operate(operate)
      if (result.code != 'ok') {
        handlerConfirm.warn(result.msg)
      }
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

.a-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.a-col {
  border-radius: 4px;
}

/* .box-card {
  width: 480px;
} */
</style>
