<template>
  <div class="main-container">
    <div class="controller-box">
      <input
        ref="inputs"
        style="display: none"
        type="file"
        @change="handleChange"
        multiple="true"
      />

      <div class="add-music" @click="addMusic">添加歌曲</div>
      <div class="range-box" style="display: none">
        <span>1</span>
        <input type="range" v-model="volume" :max="100" :min="1" />
        <span>100</span>
      </div>
      <div style="display: none">音量：{{ volume }}</div>
      <div class="music-box">
        <h2 class="music-title">歌曲列表</h2>
        <ul class="music-list">
          <li
            :class="[
              'music-cell',
              curIndex === index ? 'music-cell-active' : '',
            ]"
            v-for="(item, index) in musicList"
            :key="index"
            @click="handleMusicStart(item, index)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>
    <div class="content-box">
      <div class="route-box">
        <span
          v-for="(type, index) in typeList"
          :key="index"
          :class="[index === typeIndex ? 'type-active' : '']"
          @click="handleTypeChange(index)"
          >{{ type }}</span
        >
      </div>
      <div ref="showBox" class="show-box">
        <Player
          v-show="typeIndex === 0"
          :musicBuffer="musicBuffer"
          :volume="Number(volume)"
        />
        <Magic
          v-show="typeIndex === 1"
          :musicBuffer="musicBuffer"
          :volume="Number(volume)"
        />
        <ST
          v-show="typeIndex === 2"
          :clientWidth="clientWidth"
          :clientHeight="clientHeight"
          :musicBuffer="musicBuffer"
          :volume="Number(volume)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Player from "../Player";
import ST from "../ST";
import Magic from "../Magic";
export default {
  components: {
    Player,
    ST,
    Magic,
  },
  data() {
    return {
      musicList: [],
      curIndex: null,
      typeIndex: 0,
      musicBuffer: null,
      typeList: ["音频条", "声波", "BOX"],
      clientWidth: null,
      clientHeight: null,
      volume: 1,
    };
  },
  mounted() {
    this.clientWidth = this.$refs.showBox.clientWidth;
    this.clientHeight = this.$refs.showBox.clientHeight;
  },
  methods: {
    addMusic() {
      this.$refs.inputs.click();
    },
    handleChange() {
      let that = this;
      //如果用户获取音乐通过fileReader读取
      let inputDom = this.$refs.inputs;
      let originFiles = inputDom.files;
      if (originFiles.length) {
        let files = Array.prototype.slice.call(originFiles);
        files.forEach((file) => {
          var fr = new FileReader();
          fr.readAsArrayBuffer(file);
          let mdata = {
            orName: file.name.substring(0, file.name.lastIndexOf(".")),
            name: "解析中...",
            buffer: null,
            decoding: true,
          };
          this.musicList.push(mdata);
          fr.onload = function (e) {
            that.decodeBuffer(e.target.result, function (buffer) {
              let index = that.musicList.findIndex(
                (item) => item.orName === mdata.orName
              );
              let realData = {
                name: mdata.orName,
                buffer: buffer,
                decoding: false,
              };
              that.$set(that.musicList, index, realData);
            });
          };
        });
      }
    },
    decodeBuffer(arraybuffer, cb) {
      var AudioContext =
        window.AudioContext ||
        window.webkitAudioContext ||
        window.mozAudioContext;
      if (!AudioContext) {
        alert(
          "您的浏览器不支持audio API，请更换浏览器（chrome、firefox）再尝试"
        );
        return;
      }
      let AC = new AudioContext();
      AC.decodeAudioData(
        arraybuffer,
        (buffer) => {
          cb(buffer);
        },
        () => {
          alert("解析失败！");
        }
      );
    },
    handleMusicStart(obj, index) {
      this.curIndex = index;
      this.musicBuffer = obj;
    },
    handleTypeChange(index) {
      this.typeIndex = index;
    },
  },
};
</script>
<style lang="less" scoped>
.main-container {
  height: calc(100vh - 40px);
  box-shadow: 0px 0 2px 3px #cecece inset;
  display: flex;
  .controller-box {
    width: 20%;
    height: calc(100vh - 40px);
    flex-shrink: 0;
    background-color: rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    padding: 20px 0;
    .add-music {
      width: 80%;
      height: 28px;
      border-radius: 14px;
      border: 1px solid #fff;
      display: flex;
      flex-shrink: 0;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
    .range-box {
      margin-top: 20px;
    }
    .music-box {
      margin-top: 20px;
      width: 80%;
      flex: 1;
      border: 1px solid #fff;
      padding: 0 10px;
      display: flex;
      flex-direction: column;
      .music-title {
        font-size: 20px;
        padding: 10px 0;
      }
      .music-list {
        text-decoration: none;
        list-style: none;
        margin-top: 10px;
        .music-cell {
          margin-top: 5px;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.5);
          &:hover {
            color: #fff;
          }
        }
        .music-cell-active {
          color: #fff;
        }
      }
    }
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
      border: 1px solid #fff;
      align-items: center;
      color: #fff;
      span {
        list-style: none;
        text-decoration: none;
        display: flex;
        padding: 10px 30px;
        cursor: pointer;
        &:hover {
          color: #1989fa;
        }
      }
      .type-active {
        color: #1989fa;
      }
    }
    .show-box {
      flex: 1;
      border: 1px solid #fff;
      margin-top: 20px;
      width: 100%;
    }
  }
}
</style>
