<template>
  <div class="main-container">
    <div class="controller-box"></div>
    <div class="content-box">
      <div class="route-box">
        <router-link to="/player">播放器</router-link>
        <router-link to="/st">科技</router-link>
        <router-link to="/magic">魔法</router-link>
      </div>
      <div class="show-box">
        <router-view />
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
.main-container {
  height: calc(100vh - 40px);
  box-shadow: 0px 0 2px 3px #cecece inset;
  display: flex;
  .controller-box {
    width: 20%;
    height: calc(100vh - 40px);
    flex-shrink: 0;
    border: 1px solid green;
  }
  .content-box {
    flex: 1;
    height: calc(100vh - 40px);
    display: flex;
    flex-direction: column;
    padding: 30px;
    align-items: center;
    .route-box {
      display: flex;
      justify-content: center;
      height: 100px;
      width: 100%;
      flex-shrink: 0;
      border: 1px solid yellow;
      align-items: center;
      a {
        list-style: none;
        text-decoration: none;
        display: flex;
        padding: 10px 30px;
      }
    }
    .show-box {
      flex: 1;
      margin-top: 20px;
      border: 1px solid blue;
      width: 100%;
    }
  }
}
</style>
