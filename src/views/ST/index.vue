<template>
  <div class="content" ref="content"></div>
</template>

<script>
import * as Three from "three";
export default {
  props: {
    musicBuffer: {
      type: Object,
      default: () => {},
    },
    clientWidth: {
      type: Number,
      default: 0,
    },
    clientHeight: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    musicBuffer: {
      handler(newVal, oldVal) {
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
      objects: [],
      camera: null,
      scene: null,
      renderer: null,
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
    this.analyser.fftSize = 1024; //快速傅里叶变换，必须是2的N次方
    // gain为gainNode，音频的声音处理模块
    this.gainnode = AC.createGain();
    this.gainnode.gain.value = 1;
    setTimeout(() => {
      this.initScene();
      this.initCamera();
      this.initRenderer();
      this.initLight();
      for (var i = 0; i < this.analyser.fftSize; i++) {
        this.objects.push(
          this.createBox({
            w: 0.1,
            h: 0.1,
            d: 0.1,
            c: parseInt(Math.random() * 166138875, 16),
            x: -100 + Math.random() * 200,
            y: -100 + Math.random() * 200,
            z: -100 + Math.random() * 200,
          })
        );
      }
      this.startDraw();

      this.windowEvents();
    });
  },
  methods: {
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
      let bufferLength = this.analyser.frequencyBinCount;
      var dataArray = new Uint8Array(bufferLength); //8位无符号定长数组
      //渲染声压条
      function renderFrame() {
        requestAnimationFrame(renderFrame); //方法托管到定时器
        that.analyser.getByteFrequencyData(dataArray);
        that.moveBox(dataArray);
        that.renderer.render(that.scene, that.camera);
      }
      renderFrame();
    },
    moveBox(dataArray) {
      for (var i = 0; i < this.objects.length; i++) {
        this.objects[i].scale.x = dataArray[i] <= 0 ? 1 : dataArray[i];
        this.objects[i].scale.y = dataArray[i] <= 0 ? 1 : dataArray[i];
        this.objects[i].scale.z = dataArray[i] <= 0 ? 1 : dataArray[i];
        this.objects[i].rotation.x += 0.01;
        this.objects[i].rotation.y += 0.02;
        this.camera.rotation.x += 0.000001;
        this.camera.rotation.y += 0.000001;
      }
    },
    initScene() {
      this.scene = new Three.Scene();
      console.log("初始化场景成功");
    },

    //初始化摄像机
    initCamera() {
      let w = this.clientWidth;
      let h = this.clientHeight;
      this.camera = new Three.PerspectiveCamera(90, w / h, 1, 1000);
      // this.camera.position.set(0, 0, 0);
      this.camera.position.set(0, 0, 0); //设置相机位置
      console.log("初始化摄像机成功!");
    },

    initRenderer() {
      let w = this.clientWidth;
      let h = this.clientHeight;
      try {
        this.renderer = new Three.WebGLRenderer();
      } catch (e) {
        alert("你的浏览器不支持WEBGL,请换最新的浏览器,推荐谷歌浏览器.");
      }
      this.renderer.setSize(w, h);
      this.$refs.content.appendChild(this.renderer.domElement);
      console.log("初始化渲染引擎成功!");
    },
    initLight() {
      let pointLight = new Three.PointLight(0xffffff, 1, 1000);
      pointLight.position.set(400, 300, 200);
      let directionalLight = new Three.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(300, 400, 50);
      this.scene.add(pointLight);
    },
    //box类
    createBox(op) {
      op = op || {};
      op.w = op.w || 1;
      op.h = op.h || 1;
      op.d = op.d || 1;
      op.c = op.c || 0xff0000;
      op.x = op.x || 0;
      op.y = op.y || 0;
      op.z = op.z || 0;
      var geometry = new Three.BoxGeometry(op.w, op.h, op.d);
      var material = new Three.MeshLambertMaterial({ color: op.c });
      var box = new Three.Mesh(geometry, material);
      box.position.set(op.x, op.y, op.z);
      this.scene.add(box);
      return box;
    },
    windowEvents() {
      //旋转镜头
      var isMouseDown = false;
      var downX = 0;
      var downY = 0;
      var downRotationY = 0;
      let that = this;
      var downRotationZ = 0;
      window.onmousedown = function (event) {
        if (event.which == 1) {
          //左击下
          isMouseDown = true;
          downX = event.pageX;
          downY = event.pageY;
          that.camera.rotation.y = downRotationY;
          that.camera.rotation.z = downRotationZ;
        }
      };
      window.onmouseup = function (event) {
        if (event.which == 1) {
          //左抬起
          isMouseDown = false;
          downRotationY = that.camera.rotation.y;
          downRotationZ = that.camera.rotation.z;
        }
      };
      window.onmousemove = function (event) {
        if (isMouseDown) {
          var offsetX = event.pageX - downX;
          var offsetY = event.pageY - downY;
          //改变镜头
          that.camera.rotation.y = downRotationY + offsetX / 500;
          that.camera.rotation.z = downRotationZ + offsetY / 500;
        }
      };
      //缩放镜头
      window.onmousewheel = function (event) {
        if (event.wheelDelta > 0) {
          //上滚动
          that.camera.position.z += 5;
        } else {
          //下滚动
          that.camera.position.z -= 5;
        }
      };
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  background: #000;
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
}
</style>
