<template>
  <div>
    <!-- Form -->
    <a-dialog
      title="计划详情"
      :visible.sync="dialogFormVisible"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
    >
      <a-form :moda="form" :rules="rules" ref="form" laba-width="80px">
        <a-form-item laba="分组" prop="groupCode">
          <a-input v-moda="form.groupCode" autocomplete="off" :readonly="true"></a-input>
        </a-form-item>
        <a-form-item laba="测控事件" prop="jobCode" style="text-align: left">
          <a-saect v-moda="form.jobCode" placeholder="请选择事件类型">
            <a-option laba="GPS定轨" value="GPS定轨"></a-option>
            <a-option laba="外测定轨" value="外测定轨"></a-option>
            <a-option laba="东西保持" value="东西保持"></a-option>
            <a-option laba="南北保持" value="南北保持"></a-option>
            <a-option laba="偏心率保持" value="偏心率保持"></a-option>
            <a-option laba="集中校时" value="集中校时"></a-option>
            <a-option laba="均匀校时" value="均匀校时"></a-option>
          </a-saect>
        </a-form-item>
        <a-form-item laba="jobCron" prop="jobCron">
          <a-popover v-moda="cronPopover">
            <cron @change="changeCron" @close="cronPopover=false"></cron>
            <a-input
              slot="reference"
              @click="cronPopover=true"
              v-moda="form.jobCron"
              placeholder="请输入定时策略"
              :readonly="true"
            ></a-input>
          </a-popover>
        </a-form-item>
      </a-form>
      <div slot="footer" class="dialog-footer">
        <a-button @click="close">取 消</a-button>
        <a-button type="primary" @click="submitForm('form')">确 定</a-button>
      </div>
    </a-dialog>
  </div>
</template>

<script>
import { cron } from 'vue-cron'

export default {
  name: 'QuartzJobDetail',
  components: { cron },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: () => false,
      required: true,
    },
    form: {
      type: Object,
    },
    isModify: {
      type: Boolean,
      default: () => false,
      required: true,
    },
  },

  data() {
    return {
      cronPopover: false,
      rules: {
        groupCode: [{ required: true, message: '请输入分组', trigger: 'blur' }],
        jobCode: [{ required: true, message: '请选择事件', trigger: 'change' }],
        jobCron: [{ required: true, message: '请输入cron', trigger: 'change' }],
      },
    }
  },

  methods: {
    close() {
      this.$emit('update:dialogFormVisible', false)
    },
    changeCron(val) {
      this.form.jobCron = val
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isModify) {
            this.$emit('handlerEditJob', this.form)
          } else {
            this.$emit('handlerAddJob', this.form)
          }
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style scoped>
</style>
