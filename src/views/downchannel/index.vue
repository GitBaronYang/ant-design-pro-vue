<template>
  <div>
    <a-row>
      <a-card title="遥测（TM）">
        <a href="#" slot="extra">more</a>
        <a-row>
          <a-col :span="12">
            <a-upload
              name="file"
              :multiple="true"
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              :headers="headers"
              @change="handleChange"
            >
              <a-button>
                <a-icon type="upload" />Click to Upload
              </a-button>
            </a-upload>
          </a-col>
          <a-col :span="12">
            <a-button type="primary" @click="downloadTM">发送</a-button>
          </a-col>
        </a-row>
      </a-card>
    </a-row>
    <a-row>
      <a-card title="图像">
        <a href="#" slot="extra">more</a>
        <a-row>
          <a-col :span="12">
            <a-upload
              name="avatar"
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              :beforeUpload="beforeUpload"
              @change="handleChangeImage"
            >
              <img v-if="imageUrl" :src="imageUrl" alt="avatar" />
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
          </a-col>
          <a-col :span="12">
            <a-button type="primary">发送</a-button>
          </a-col>
        </a-row>
      </a-card>
    </a-row>
    <a-row>
      <a-card title="TC环回">
        <a href="#" slot="extra">more</a>
        <p>TC环回和上行通道TC绑定：收到TC后将TC码返回给发送方</p>
      </a-card>
    </a-row>
  </div>
</template>
<script>
import { downlink } from '@/api/down'

function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  data () {
    return {
      headers: {
        authorization: 'authorization-text'
      },
      loading: false,
      imageUrl: ''
    }
  },
  methods: {
    handleChange (info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
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
    async downloadTM () {
      const rep = await downlink.tm({})
      console.log(rep)
    }
  }
}
</script>
