<template>
  <div>
    <a-row>
      <a-card title="遥控看板">
        <a href="#" slot="extra">more</a>
        <a-table bordered :dataSource="dataSource" :columns="columns">
        </a-table>
      </a-card>
    </a-row>
    <a-row>
      <a-card title="语音看板">
        <a href="#" slot="extra">more</a>
        <p>card content</p>
        <p>card content</p>
        <p>card content</p>
        <p>card content</p>
        <p>card content</p>
        <p>card content</p>
      </a-card>
    </a-row>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dataSource: [
        {
          key: '0',
          time: 'Edward King 0',
          dataIndex: 'London, Park Lane no. 0'
        },
        {
          key: '1',
          time: 'Edward King 1',
          contents: 'London, Park Lane no. 1'
        }
      ],
      count: 2,
      columns: [
        {
          title: 'time',
          dataIndex: 'time',
          width: '15%',
          scopedSlots: { customRender: 'time' }
        },
        {
          title: 'contents',
          dataIndex: 'contents'
        }
      ]
    }
  },
  methods: {
  }
}
</script>
<style>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>
