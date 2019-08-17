<template>
  <div class="footer">
    <div class="links">
      <a
        href="https://www.geekutil.com/"
        target="_blank"
      >文档</a>
      <a
        href="https://github.com/Asens/GeekAdmin"
        target="_blank"
      >
        <a-icon type="github" />
      </a>
      <a href="https://github.com/Asens/GeekAdmin">Geek Admin</a>
      <a href="https://github.com/Asens/GeekAdminFront">Geek Admin Front</a>
    </div>
    <div class="copyright">
      Copyright
      <a-icon type="copyright" /> 2019 <span>Geek Admin</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlobalFooter',
  data () {
    return {}
  }
}
</script>

<style lang="less" scoped>
.footer {
  padding: 0 16px;
  margin: 48px 0 24px;
  text-align: center;

  .links {
    margin-bottom: 8px;

    a {
      color: rgba(0, 0, 0, 0.45);

      &:hover {
        color: rgba(0, 0, 0, 0.65);
      }

      &:not(:last-child) {
        margin-right: 40px;
      }
    }
  }
  .copyright {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
  }
}
</style>
