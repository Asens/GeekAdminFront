<template>
  <div class="account-settings-info-view">
    <a-row :gutter="16">
      <a-col :md="24" :lg="16">
        <a-form :form="form" layout="vertical">
          <a-form-item
            label="id"
            style="display: none"
          >
            <a-input type="hidden" v-decorator="['id']" />
          </a-form-item>
          <a-form-item
            label="用户名"
          >
            <span style="margin-top: 5px;font-size: 1.1rem">{{ user.username }}</span>
          </a-form-item>
          <a-form-item
            label="昵称"
          >
            <a-input placeholder="给自己起个名字" v-decorator="['name',{rules: [{min: 2,max:20, message: '昵称最小长度2,最大长度20'},{pattern: /^[0-9a-zA-Z\u4E00-\u9FA5]+$/, message: '昵称包含不支持的字符'}] }]"/>
          </a-form-item>
          <a-form-item
            label="头像"
          >
            <a-upload
              name="file"
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              action="/api/oss/upload"
              :beforeUpload="beforeUpload"
              @change="handleChange"
            >
              <img v-if="user.avatar" :src="user.avatar" alt="avatar" style="width: 120px;height: 120px"/>
              <div v-else>
                <a-icon :type="loading ? 'loading' : 'plus'" />
                <div class="ant-upload-text">Upload</div>
              </div>
            </a-upload>
            <a-input type="hidden" v-decorator="['avatar']" />
          </a-form-item>
          <a-form-item
            label="手机号"
            :required="false"
          >
            <a-input v-decorator="['phone',{rules: [{pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号'}] }]"/>
          </a-form-item>

          <a-form-item>
            <a-button @click="save">保存</a-button>
          </a-form-item>
        </a-form>

      </a-col>

    </a-row>

    <avatar-modal ref="modal">

    </avatar-modal>
  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import { centerInfo, saveUser } from '@/api/user'

export default {
  components: {
    AvatarModal
  },
  data () {
    return {
      loading: false,
      // cropper
      preview: {},
      form: this.$form.createForm(this),
      user: {},
      option: {
        img: '',
        info: true,
        size: 1,
        outputType: 'jpeg',
        canScale: false,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 180,
        autoCropHeight: 180,
        fixedBox: true,
        // 开启宽度和高度比例
        fixed: true,
        fixedNumber: [1, 1],
        form: this.$form.createForm(this)
      }
    }
  },
  methods: {
    save () {
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
          saveUser(values).then(res => {
            if (res.status === 'success') {
              this.$message.success('保存成功')
            } else {
              this.$notification.error({
                message: '保存失败',
                description: res.message
              })
            }
          })
        }
      })
    },
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        this.user.avatar = info.file.response.data
        this.form.setFieldsValue({
          avatar: info.file.response.data
        })
        this.loading = false
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
    }
  },
  mounted () {
    centerInfo().then(res => {
      if (res.status === 'success') {
        const user = res.data
        this.option.img = user.avatar
        this.user = user
        console.log('user :' + JSON.stringify(user))
        this.form.setFieldsValue({
          name: user.name,
          id: user.id,
          phone: user.phone,
          avatar: user.avatar
        })
      }
    })
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-wrapper {
    height: 200px;
    width: 100%;
  }

  .ant-upload-preview {
    position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;

    .upload-icon {
      position: absolute;
      top: 0;
      right: 10px;
      font-size: 1.4rem;
      padding: 0.5rem;
      background: rgba(222, 221, 221, 0.7);
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
    }
    .mask {
      opacity: 0;
      position: absolute;
      background: rgba(0, 0, 0, 0.4);
      cursor: pointer;
      transition: opacity 0.4s;

      &:hover {
        opacity: 1;
      }

      i {
        font-size: 2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-left: -1rem;
        margin-top: -1rem;
        color: #d6d6d6;
      }
    }

    img, .mask {
      width: 100%;
      max-width: 180px;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }

    .avatar-uploader > .ant-upload {
      width: 128px;
      height: 128px;
    }
    .ant-upload-select-picture-card i {
      font-size: 32px;
      color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
      margin-top: 8px;
      color: #666;
    }
  }
</style>
