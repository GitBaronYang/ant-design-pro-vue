<template>
  <div>
    <!-- Form -->
    <a-dialog
      title="计划组"
      :visible.sync="dialogFormVisible"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="30%"
    >
      <a-form :model="form" :rules="rules" ref="form">
        <a-form-item label="分组代号" label-width="80px" prop="groupCode">
          <a-input v-model="form.groupCode" autocomplete="off"></a-input>
        </a-form-item>
        <a-form-item label="说明" label-width="80px">
          <a-input v-model="form.groupDesc" autocomplete="off"></a-input>
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
export default {
  name: 'GroupDetail',
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: () => false,
    },
    form: {
      type: Object,
    },
    isModify: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      rules: {
        groupCode: [
          { required: true, message: '请输入分组名称', trigger: 'blur' },
          {
            min: 3,
            max: 32,
            message: '长度在 3 到 32 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    close() {
      this.$emit('update:dialogFormVisible', false)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isModify) {
            this.$emit('handlerEditGroup', this.form)
          } else {
            this.$emit('handlerAddGroup', this.form)
          }
        } else {
          return false
        }
      })
    },
  },
}
</script>