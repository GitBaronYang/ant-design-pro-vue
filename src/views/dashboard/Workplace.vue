<template>
  <page-view :title="false">
    <div slot="headerContent">
      <!-- <div class="title">enjoy <span class="welcome-text">， welcome </span></div> -->
      <div class="title">WebSocket连接状态：
        <a-progress type="circle" :percent="100" :width="30" status="exception" v-if="wsClose"/>
        <a-progress type="circle" :percent="100" :width="30" v-else/>
      </div>
      <div>攻城狮  - |  - 测试平台</div>

    </div>
    <div slot="extra">
      <a-row class="more-info">
        <a-col :span="8">
          <head-info :title="$t('dashboard.workplace.project')" content="56" :center="false" :bordered="false"/>
        </a-col>
        <a-col :span="8">
          <head-info :title="$t('dashboard.workplace.teamRank')" content="8/24" :center="false" :bordered="false"/>
        </a-col>
        <a-col :span="8">
          <head-info :title="$t('dashboard.workplace.views')" content="2,223" :center="false" />
        </a-col>
      </a-row>
    </div>

    <div>
      <a-row :gutter="24">
        <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
          <a-card
            class="project-list"
            style="margin-bottom: 24px;"
            :bordered="false"
            :body-style="{ padding: 0 }">
            <div>
              <a-list
                :grid="{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2 }"
              >
                <a-list-item >
                  <a-card title="模拟遥测发送" :bordered="false">
                    <a href="#" slot="extra">more</a>
                    <a-row>
                      <a-col :span="12">
                        <a-steps :current="currentTMStep" direction="vertical">
                          <a-step>
                            <!-- <span slot="title">Finished</span> -->
                            <template slot="title">
                              TM File
                            </template>
                            <span slot="description">上传遥测文件</span>
                          </a-step>
                          <a-step title="Finished" description="发送数据" />
                        </a-steps>
                      </a-col>
                      <a-col :span="12">
                        <a-upload
                          name="file"
                          :multiple="true"
                          action="http://127.0.0.1:9000/v1/upload_tm"
                          :headers="headers"
                          @change="handleChange"
                          v-if="currentTMStep==0"
                        >
                          <a-button>
                            <a-icon type="upload" />Click to Upload
                          </a-button>
                        </a-upload>
                        <div v-if="currentTMStep==1">
                          <a-button style="margin-right:20px" @click="previousTMStep">上一步</a-button>
                          <a-button type="primary" @click="downloadTM">发送</a-button>
                        </div>
                      </a-col>
                    </a-row>
                  </a-card>
                </a-list-item>
                <a-list-item >
                  <a-card title="模拟图像发送" :bordered="false">
                    <a href="#" slot="extra">more</a>
                    <a-row>
                      <a-col :span="12">
                        <a-steps :current="currentImageStep" direction="vertical">
                          <a-step>
                            <!-- <span slot="title">Finished</span> -->
                            <template slot="title">
                              Image
                            </template>
                            <span slot="description">上传图片文件</span>
                          </a-step>
                          <a-step title="Finished" description="发送数据" />
                        </a-steps>
                      </a-col>
                      <a-col :span="12">
                        <a-upload
                          name="image"
                          listType="picture-card"
                          class="avatar-uploader"
                          :showUploadList="false"
                          action="http://127.0.0.1:9000/v1/upload_image"
                          :beforeUpload="beforeUpload"
                          @change="handleChangeImage"
                          v-if="currentImageStep==0"
                        >
                          <img v-if="imageUrl" style="width: 100%" :src="imageUrl" alt="avatar" />
                          <div v-else>
                            <a-icon :type="loading ? 'loading' : 'plus'" />
                            <div class="ant-upload-text">Upload</div>
                          </div>
                        </a-upload>

                        <div v-if="currentImageStep==1">
                          <a-button style="margin-right:20px" @click="previousImageStep">上一步</a-button>
                          <a-button type="primary" @click="downloadImage">发送</a-button>
                        </div>
                      </a-col>
                    </a-row>
                  </a-card>
                </a-list-item>
              </a-list>
            </div>
          </a-card>

          <a-card title="模拟遥控发送 " :bordered="false" style="margin-bottom: 24px;">
            <a href="#" slot="extra">通道： {{ udplink.ip }}:{{ udplink.port }}</a>
            <a-row>
              <a-col :span="12">
                <a-steps :current="currentTCStep" direction="vertical">
                  <a-step title="UDP" description="配置UDP" />
                  <a-step title="upload" description="上传数据文件" />
                  <a-step title="Finished" description="发送数据" />
                </a-steps>
              </a-col>
              <a-col :span="12">
                <a-form
                  :form="form"
                  @submit="handleSubmit"
                  v-if="currentTCStep==0"
                >
                  <a-form-item
                    label="ip"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
                  >
                    <a-input
                      v-decorator="[
                        'ip',
                        {rules: [{ required: true, message: 'Please input your note!' }]}
                      ]"
                      pattern="(\d|[1-9]\d|1\d{2}|2[0-5][0-5])\.(\d|[1-9]\d|1\d{2}|2[0-5][0-5])\.(\d|[1-9]\d|1\d{2}|2[0-5][0-5])\.(\d|[1-9]\d|1\d{2}|2[0-5][0-5])"
                    />
                  </a-form-item>
                  <a-form-item
                    label="port"
                    :label-col="{ span: 5 }"
                    :wrapper-col="{ span: 12 }"
                  >
                    <a-input-number
                      v-decorator="[
                        'port',
                        {rules: [{ required: true, message: 'Please input your port' }]},
                      ]"
                      :min="1"
                    />
                  </a-form-item>
                  <a-form-item
                    :wrapper-col="{ span: 12, offset: 5 }"
                  >
                    <a-button
                      type="primary"
                      html-type="submit"
                    >
                      下一步
                    </a-button>
                  </a-form-item>
                </a-form>

                <div v-else-if="currentTCStep==1">
                  <a-upload
                    name="file"
                    :multiple="true"
                    action="http://127.0.0.1:9000/v1/upload_tc"
                    :headers="headers"
                    @change="handleChangeTC"
                  >
                    <a-button>
                      <a-icon type="upload" />Click to Upload
                    </a-button>
                  </a-upload>
                  <a-button style="margin-top:60px" @click="previousTCStep">上一步</a-button>
                </div>

                <div v-if="currentTCStep==2">
                  <a-button style="margin-right:20px" @click="previousTCStep">上一步</a-button>
                  <a-button type="primary" @click="uploadTC">发送</a-button>
                </div>
              </a-col>
            </a-row>
          </a-card>

        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24">
          <a-card title="话音接收" :bordered="false" style="margin-bottom: 24px;">
            <a-list>
              <a-list-item>
                <a-list-item-meta>
                  <a-avatar slot="avatar"/>
                  <div slot="title">
                    <span> item.user.nickname </span>&nbsp;
                    在&nbsp;<a href="#"> item.project.name </a>&nbsp;
                    <span> item.project.action </span>&nbsp;
                    <a href="#"> item.project.event </a>
                  </div>
                  <div slot="description"> item.time </div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
          <a-card title="遥控接收" style="margin-bottom: 24px" :bordered="false" :body-style="{ padding: 0 }">
            <div style="min-height: 400px; max-height: 400px; padding: 15px; overflow-y: scroll;">
              {{ tcMessage }}
            </div>
          </a-card>
          <a-card title="TC还回响应" :bordered="false">
            <div class="members">
              <a-row>
                <a-col :span="12">
                  <a>
                    <a-avatar size="small" />
                    <span class="member"> item.name </span>
                  </a>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import HeadInfo from '@/components/tools/HeadInfo'
import { Radar } from '@/components'

import { downlink, uplink } from '@/api/data-link'

function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  name: 'Workplace',
  components: {
    PageView,
    HeadInfo,
    Radar
  },
  data () {
    return {
      currentTMStep: 0,
      currentImageStep: 0,
      currentTCStep: 0,
      form: this.$form.createForm(this),
      udplink: {
        ip: '127.0.0.1',
        port: 0
      },
      headers: {
        authorization: 'authorization-text'
      },
      loading: false,
      imageUrl: '',
      ws: '',
      wsClose: false,
      tcMessage: '' // []
    }
  },
  created () {

  },
  mounted () {
    this.wsConnect()
    window.setInterval(() => {
      if (this.wsClose || this.ws === '') {
        console.log(this.wsClose)
        console.log('每隔1秒钟执行一次')
        this.wsConnect()
      }
    }, 5000)
  },
  methods: {
    handleChange (info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
        this.currentTMStep++
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
    previousTMStep () {
      this.currentTMStep--
    },

    // Image 处理部分
    handleChangeImage (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl
          this.loading = false
        })
        this.currentImageStep++
      }
    },
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      if (!isJPG) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJPG && isLt2M
    },
    previousImageStep () {
      this.currentImageStep--
    },

    // 遥控处理部分
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.udplink.ip = values.ip
          this.udplink.port = values.port
          console.log('Received values of form: ', values)
          this.currentTCStep++
        }
      })
    },
    handleChangeTC (info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
        this.currentTCStep++
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
    previousTCStep () {
      this.currentTCStep--
    },

    // websocket
    wsConnect () {
      this.ws = new WebSocket('ws://127.0.0.1:9000/v1/ping')
      // 连接打开时触发
      this.ws.onopen = () => {
        console.log('Connection open ...')
        this.ws.send('Hello WebSockets!')
        this.wsClose = false
      }
      // 接收到消息时触发
      this.ws.onmessage = evt => {
        console.log(evt)
        // this.tcMessage.push({ value: evt.data, key: evt.timeStamp })
        this.tcMessage = evt.data
      // this.msgList.push(evt.data)
      }
      this.ws.onclose = () => {
        this.wsClose = true
        console.log('Connection close !!!')
      }
    },

    // api 处理部分
    async downloadTM () {
      const rep = await downlink.tm({})
      console.log(rep)
    },
    async downloadImage () {
      const rep = await downlink.image()
      console.log(rep)
    },
    async uploadTC () {
      const rep = await uplink.tc(this.udplink)
      console.log(rep)
    }
  },
  beforeDestroy () {
    this.ws.close()
  }
}
</script>

<style lang="less" scoped>
  .project-list {

    .card-title {
      font-size: 0;

      a {
        color: rgba(0, 0, 0, 0.85);
        margin-left: 12px;
        line-height: 24px;
        height: 24px;
        display: inline-block;
        vertical-align: top;
        font-size: 14px;

        &:hover {
          color: #1890ff;
        }
      }
    }
    .card-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
    .project-item {
      display: flex;
      margin-top: 8px;
      overflow: hidden;
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      a {
        color: rgba(0, 0, 0, 0.45);
        display: inline-block;
        flex: 1 1 0;

        &:hover {
          color: #1890ff;
        }
      }
      .datetime {
        color: rgba(0, 0, 0, 0.25);
        flex: 0 0 auto;
        float: right;
      }
    }
    .ant-card-meta-description {
      color: rgba(0, 0, 0, 0.45);
      height: 44px;
      line-height: 22px;
      overflow: hidden;
    }
  }

  .item-group {
    padding: 20px 0 8px 24px;
    font-size: 0;
    a {
      color: rgba(0, 0, 0, 0.65);
      display: inline-block;
      font-size: 14px;
      margin-bottom: 13px;
      width: 25%;
    }
  }

  .members {
    a {
      display: block;
      margin: 12px 0;
      line-height: 24px;
      height: 24px;
      .member {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        line-height: 24px;
        max-width: 100px;
        vertical-align: top;
        margin-left: 12px;
        transition: all 0.3s;
        display: inline-block;
      }
      &:hover {
        span {
          color: #1890ff;
        }
      }
    }
  }

  .mobile {

    .project-list {

      .project-card-grid {
        width: 100%;
      }
    }

    .more-info {
      border: 0;
      padding-top: 16px;
      margin: 16px 0 16px;
    }

    .headerContent .title .welcome-text {
      display: none;
    }
  }

</style>
