<template>
  <div class="login-form">
    <div class="toggle">
      <a href="javascript:;" @click="isMsgLogin = false" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a href="javascript:;" @click="isMsgLogin = true" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>

    <div class="form">
      <Form ref="formCom" :validation-schema="formSchema" autocomplete="off">
        <template v-if="!isMsgLogin">
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-user"></i>
              <!-- <input type="text" placeholder="请输入账号" /> -->
              <Field
                v-model="form.account"
                name="account"
                type="text"
                placeholder="请输入账号"
              />
            </div>
            <ErrorMessage name="account" v-slot="{ message }">
              <div class="error" v-if="message">
                <i class="iconfont icon-warning">{{ message }}</i>
              </div>
            </ErrorMessage>
            <!-- <div class="error"><i class="iconfont icon-warning" />请输入手机号</div> -->
          </div>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-lock"></i>
              <!-- <input type="password" placeholder="请输入密码" /> -->
              <Field
                v-model="form.password"
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            <ErrorMessage name="password" v-slot="{ message }">
              <div class="error" v-if="message">
                <i class="iconfont icon-warning">{{ message }}</i>
              </div>
            </ErrorMessage>
          </div>
        </template>
        <template v-else>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-user"></i>
              <!-- <input type="text" placeholder="请输入手机号" /> -->
              <Field
                v-model="form.mobile"
                name="mobile"
                type="text"
                placeholder="请输入手机号"
              />
            </div>
            <ErrorMessage name="mobile" v-slot="{ message }">
              <div class="error" v-if="message">
                <i class="iconfont icon-warning">{{ message }}</i>
              </div>
            </ErrorMessage>
          </div>
          <div class="form-item">
            <div class="input">
              <i class="iconfont icon-code"></i>
              <!-- <input type="password" placeholder="请输入验证码" /> -->
              <Field
                v-model="form.code"
                name="code"
                type="text"
                placeholder="请输入验证码"
              />
              <span class="code" @click="send">{{
                time > 0 ? `${time}秒后发送` : '发送验证码'
              }}</span>
            </div>
            <ErrorMessage name="code" v-slot="{ message }">
              <div class="error" v-if="message">
                <i class="iconfont icon-warning">{{ message }}</i>
              </div>
            </ErrorMessage>
          </div>
        </template>
        <div class="form-item">
          <div class="agree">
            <!-- <XtxCheckbox v-model="form.isAgree" /> -->
            <Field v-model="form.isAgree" name="isAgree" as="XtxCheckbox" />
            <span>我已同意</span>
            <a href="javascript:;">《隐私条款》</a>
            <span>和</span>
            <a href="javascript:;">《服务条款》</a>
          </div>
          <ErrorMessage name="isAgree" v-slot="{ message }">
            <div class="error" v-if="message">
              <i class="iconfont icon-warning">{{ message }}</i>
            </div>
          </ErrorMessage>
        </div>
        <a @click="submit" href="javascript:;" class="btn">登录</a>
      </Form>
    </div>
    <div class="action">
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, ref, watch } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import schema from '@/utils/schema'
import Message from 'erabbit-ui/packages/components/Message'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import {
  userAccountLogin,
  userMobileLogin,
  userMobileLoginMsg
} from '@/api/user'
import { useIntervalFn } from '@vueuse/core'
export default {
  name: 'LoginForm',
  components: { Form, Field, ErrorMessage },
  setup() {
    const isMsgLogin = ref(false)
    // 表单信息对象
    const form = reactive({
      isAgree: true,
      mobile: null,
      account: null,
      password: null,
      code: null
    })
    const { account, password, mobile, code, isAgree } = schema
    const formSchema = { account, password, mobile, code, isAgree }
    const formCom = ref(null)
    watch(isAgree, () => {
      form.value = {
        isAgree: true,
        mobile: null,
        account: null,
        password: null,
        code: null
      }
      formCom.value.resetFrom()
    })
    //倒计时
    const time = ref(0)
    const { pause, resume, isActive } = useIntervalFn(
      () => {
        time.value--
        if (time.value <= 0) {
          pause()
        }
      },
      1000,
      false
    )
    const send = async () => {
      const valid = mobile(form.value.mobile)
      if (valid === true) {
        if (!isActive.value) {
          await userMobileLoginMsg(form.value.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        formCom.value.setFieldError('mobile', valid)
      }
    }
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const submit = async () => {
      const valid = await formCom.value.validate()
      console.log(valid)
      if (valid) {
        // 校验成功
        // 1. 定义API登录函数
        // 2. 判断是选的是账号登录
        // 3. 调用API进行登录
        // 4. 成功：存储用户信息,跳转首页
        // 5. 失败：错误提示
        try {
          let data = null
          if (!isMsgLogin.value) {
            data = await userAccountLogin(form)
          } else {
            // data = await userMobileLogin(form)
            data = await userMobileLogin(form)
            console.log(data)
          }
          // data = await userAccoutLogin(form.value)
          // console.log(data)
          const { id, account, nickname, avatar, token, mobile } = data.result
          store.commit('user/setProfile', {
            id,
            account,
            nickname,
            avatar,
            token,
            mobile
          })
          // 登录成功后，合并购物车操作
          await store.dispatch('cart/mergeLocalCart')
          // 跳转前
          router.push(route.query.redirectUrl || '/')
        } catch (e) {
          Message({
            type: 'error',
            text: e.response.data.message || '登陆失败'
          })
        }
      }
    }
    return { isMsgLogin, form, formSchema, formCom, submit, send, time }
  }
}
</script>
<style lang="less" scoped>
// 账号容器
.login-form {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: var(--xtx-color);
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: var(--price-color);
          }
          &.active,
          &:focus {
            border-color: var(--xtx-color);
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: var(--price-color);
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: var(--xtx-color);
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
