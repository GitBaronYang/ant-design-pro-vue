<template>
  <div>
    <a-card class="box-card">
      <div slot="header" class="clearfix">
        <a-button style="float: right; padding: 3px 0" type="text" @click="addClick">添加分组</a-button>
      </div>
      <div class="text item">
        <a-table
          :data="tableData"
          style="width: 100%"
          :show-header="false"
          @row-click="rowSelect"
          :highlight-current-row="true"
        >
          <a-table-column>
            <template slot-scope="scope">
              <a-popover trigger="hover" placement="top">
                <p v-show="scope.row.groupDesc.length>0">说明: {{ scope.row.groupDesc }}</p>
                <span slot="reference" class="name-wrapper">{{ scope.row.groupCode }}</span>
              </a-popover>
            </template>
          </a-table-column>
          <a-table-column>
            <template slot-scope="scope">
              <a-button size="mini" type="text" @click="editClick(scope.$index, scope.row)">编辑</a-button>
              <a-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</a-button>
            </template>
          </a-table-column>
        </a-table>
      </div>
    </a-card>

    <group-detail
      :form="detailForm"
      :dialogFormVisible.sync="dialogFormVisible"
      :isModify="isModify"
      @handlerAddGroup="handleAdd"
      @handlerEditGroup="handleEdit"
    ></group-detail>
  </div>
</template>
<script>
import GroupDetail from './GroupDetail'
import handlerConfirm from '../utils/handlerConfirm'
import _ from 'lodash'

export default {
  name: 'GroupList',
  components: {
    GroupDetail,
  },
  props: {
    tableData: {
      type: Array,
      default: () => [
        {
          id: 1,
          groupCode: '组一',
          groupDesc: '组一',
        },
        {
          id: 2,
          groupCode: '组二',
          groupDesc: '组二',
        },
      ],
    },
  },
  data() {
    return {
      dialogFormVisible: false,
      detailForm: { id: '', groupCode: '', groupDesc: '' },
      isModify: false,
    }
  },
  methods: {
    addClick() {
      this.isModify = false
      this.detailForm = { id: '', groupCode: '', groupDesc: '' }
      this.dialogFormVisible = true
    },
    editClick(index, row) {
      this.isModify = true
      this.detailForm = {
        id: row.id,
        groupCode: row.groupCode,
        groupDesc: row.groupDesc,
      }
      this.dialogFormVisible = true
    },
    handleAdd(form) {
      let newGroup = {
        id: form.id,
        groupCode: form.groupCode,
        groupDesc: form.groupDesc,
      }
      this.$emit('addGroup', newGroup, () => {
        this.dialogFormVisible = false
      })
    },
    handleEdit(form) {
      let newGroup = {
        id: form.id,
        groupCode: form.groupCode,
        groupDesc: form.groupDesc,
      }
      this.$emit('editGroup', newGroup, () => {
        this.dialogFormVisible = false
      })
    },
    handleDelete(index, row) {
      handlerConfirm.beforeSomething('删除当前信息', () => this.$emit('deleteGroup', index, row))
    },
    rowSelect(row, column, event) {
      this.$emit('selectGroup', row)
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