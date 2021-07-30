<template>
  <div class="content">
    <canvas id="player_canvas"></canvas>
  </div>
</template>

<script>
export default {
  data() {
    return {
      volume: 1,
    };
  },
  mounted() {
    this.initPlayer();
  },
  methods: {
    initPlayer() {
      let canvas = document.querySelector("#player_canvas");
      let ctx = canvas.getContext("2d");
      //aduioSource 音频源 bufferSource buffer源
      var aduioSource;
      var bufferSource;

      //实例化音频对象
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        alert("您的浏览器不支持audio api,请更换浏览器(chrome,firefox)再尝试");
        return;
      }
      let AC = new AudioContext();
      //音频分析节点
      var analyserNode = AC.createAnalyser();
      //音量控制节点
      var gainNode = AC.createGain();
      //设置初始值
      gainNode.gain.value = this.volume;

      //设置计时器
      this.setRAF()
    },
    setRAF(){
      return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(callback){
        setTimeout(() => {
          callback
        }, 1000/60);
      }
    }
  },
};
</script>

<style lang="less" scoped>
.content {
  background: #000;
}
#player_canvas {
  border: 1px solid red;
  width: 100%;
  height: 100%;
}
</style>
