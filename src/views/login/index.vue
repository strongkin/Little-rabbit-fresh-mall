<template>
  <div class="xtx-login-page">
    <LoginHeader />
    <section class="login-section">
      <div class="wrapper">
        <nav>
          <a href="javascript:;" class="active">账户登录</a>
          <a href="javascript:;">扫码登录</a>
        </nav>
        <LoginForm />
      </div>
    </section>
    <LoginFooter />
    Login
  </div>
</template>
<script>
import LoginHeader from './components/login-header'
import LoginFooter from './components/login-footer'
import LoginForm from './components/login-form'
export default {
  name: 'xtx-login-page',
  components: {
    LoginHeader,
    LoginFooter,
    LoginForm
  }
}
</script>
<style scoped lang="less">
.login-section {
  background: url(@/assets/images/login-bg.png) no-repeat center / cover;
  height: 488px;
  position: relative;
  .wrapper {
    width: 380px;
    background: #fff;
    min-height: 400px;
    position: absolute;
    left: 50%;
    top: 54px;
    transform: translate3d(100px, 0, 0);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
    nav {
      height: 55px;
      border-bottom: 1px solid #f5f5f5;
      display: flex;
      padding: 0 40px;
      text-align: right;
      align-items: center;
      a {
        flex: 1;
        line-height: 1;
        display: inline-block;
        font-size: 18px;
        position: relative;
        &:first-child {
          border-right: 1px solid #f5f5f5;
          text-align: left;
        }
        &.active {
          color: var(--xtx-color);
          font-weight: bold;
        }
      }
    }
  }
}
</style>
