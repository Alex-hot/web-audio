<template>
  <div class="content">
    <canvas id="player_canvas" width="1200" height="580"></canvas>
  </div>
</template>

<script>
export default {
  props: {
    musicBuffer: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    musicBuffer: {
      handler(newVal, oldVal) {
        console.log(oldVal);
        console.log(newVal);
        this.startPlay();
      },
      deep: true,
    },
  },
  data() {
    return {
      volume: 1,
      AC: null,
      analyser: null,
      gainnode: null,
      ctx: null,
      Width: 0,
      Height: 0,
    };
  },
  mounted() {
    var AudioContext =
      window.AudioContext ||
      window.webkitAudioContext ||
      window.mozAudioContext;

    if (!AudioContext) {
      alert("您的浏览器不支持audio API，请更换浏览器（chrome、firefox）再尝试");
      return;
    }
    var AC = new AudioContext();
    this.AC = AC;
    // analyser为analysernode，具有频率的数据，用于创建数据可视化
    this.analyser = AC.createAnalyser();

    // gain为gainNode，音频的声音处理模块
    this.gainnode = AC.createGain();
    this.gainnode.gain.value = 1;
    this.initPlayer();
  },
  methods: {
    //初始化canvas
    initPlayer() {
      var canvas = document.getElementById("player_canvas");
      this.Width = canvas.width;
      this.Height = canvas.height;

      //canvas上下文对象
      this.ctx = canvas.getContext("2d");
    },
    startPlay() {
      //解析时返回
      if (this.musicBuffer.decoding) {
        return;
      }
      //播放音乐
      this.playMusic(this.musicBuffer.buffer);
    },
    playMusic(param) {
      let bufferSource = this.AC.createBufferSource();
      let source;
      bufferSource.buffer = param;
      //结束播放
      bufferSource.onended = function () {};

      //播放音频
      setTimeout(function () {
        bufferSource.start();
      }, 0);
      source = bufferSource;
      //连接analyserNode
      source.connect(this.analyser);
      //再连接到gainNode
      this.analyser.connect(this.gainnode);

      //最终输出到音频播放器
      this.gainnode.connect(this.AC.destination);

      //绘画音频图
      this.startDraw();
    },
    startDraw() {
      let that = this;
      this.analyser.fftSize = 128; //快速傅里叶变换，必须是2的N次方
      let bufferLength = this.analyser.frequencyBinCount;
      let barWidth = this.Width / bufferLength - 1; //间隔设1px
      var barHeight;
      var dataArray = new Uint8Array(bufferLength); //8位无符号定长数组

      //渲染声压条
      function renderFrame() {
        requestAnimationFrame(renderFrame); //方法托管到定时器
        that.ctx.fillStyle = "#000"; //黑色背景
        that.ctx.fillRect(0, 0, that.Width, that.Height); //画布拓展全屏,动态调整
        // //获取当前时刻的音频数据
        that.analyser.getByteFrequencyData(dataArray);
        let x = 0;
        for (var i = 0; i < bufferLength; i++) {
          var data = dataArray[i];
          var percentV = data / 255; //横向比例
          var percentH = i / bufferLength; //纵向比例
          barHeight = that.Height * percentV * 0.5;
          var r = 255 * percentV;
          var g = 255 * percentH;
          var b = 50;
          that.ctx.fillStyle = `rgb(${r},${g},${b})`;
          that.ctx.fillRect(x, that.Height - barHeight, barWidth, barHeight);
          x += barWidth + 1; //间隔1px
        }
      }
      renderFrame();
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  background: #000;
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
</style>
