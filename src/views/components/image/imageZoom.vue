<template>
  <transition name="viewer-fade" append-to-body style="position:fixed;overflow: hidden;">
    <div tabindex="-1" ref="el-image-viewer__wrapper" class="el-image-viewer__wrapper" :style="{ 'z-index': viewerZIndex }">
      <div class="el-image-viewer__mask" @click.self="handleMaskClick"></div>
      <!-- CLOSE -->
      <span class="el-image-viewer__btn el-image-viewer__close" @click="hide">
        <i class="el-icon-close"></i>
      </span>
      <!-- ARROW -->
      <template v-if="!isSingle">
        <span
          class="el-image-viewer__btn el-image-viewer__prev"
          :class="{ 'is-disabled': !infinite && isFirst }"
          @click="prev">
          <i class="el-icon-arrow-left"/>
        </span>
        <span
          class="el-image-viewer__btn el-image-viewer__next"
          :class="{ 'is-disabled': !infinite && isLast }"
          @click="next">
          <i class="el-icon-arrow-right"/>
        </span>
      </template>
      <!-- ACTIONS -->
      <div class="el-image-viewer__btn el-image-viewer__actions">
        <div class="el-image-viewer__actions__inner">
          <i class="el-icon-zoom-out" @click="handleActions('zoomOut')"></i>
          <i class="el-icon-zoom-in" @click="handleActions('zoomIn')"></i>
          <i class="el-image-viewer__actions__divider"></i>
          <i :class="mode.icon" @click="toggleMode"></i>
          <i class="el-image-viewer__actions__divider"></i>
          <i class="el-icon-refresh-left" @click="handleActions('anticlocelise')"></i>
          <i class="el-icon-refresh-right" @click="handleActions('clocelise')"></i>
          <i class="el-icon-arrow-left" @click="handleActions('moveLeft')"></i>
          <i class="el-icon-arrow-right" @click="handleActions('moveRight')"></i>
        </div>
      </div>
      <!-- CANVAS -->
      <div class="el-image-viewer__canvas" >
        <img
          id="leftButton"
          v-for="(url, i) in urlList"
          v-if="i === index"
          ref="img"
          class="el-image-viewer__img"
          :key="url"
          :src="currentImg"
          :style="imgStyle"
          @load="handleImgLoad"
          @error="handleImgError"
          @mousedown="handleMouseDown"
          @touchmove="move" @touchstart="bodyTouchStart" @touchend="bodyTouchEnd">
      </div>
    </div>
  </transition>
</template>

<script>
import { on, off } from 'element-ui/src/utils/dom';
import { rafThrottle, isFirefox } from 'element-ui/src/utils/util';
import { PopupManager } from 'element-ui/src/utils/popup';

const Mode = {
  CONTAIN: {
    name: 'contain',
    icon: 'el-icon-full-screen'
  },
  ORIGINAL: {
    name: 'original',
    icon: 'el-icon-c-scale-to-original'
  }
};

const mousewheelEventName = isFirefox() ? 'DOMMouseScroll' : 'mousewheel';

export default {
  name: 'elImageViewer',

  props: {
    urlList: {
      type: Array,
      default: () => []
    },
    zIndex: {
      type: Number,
      default: 2000
    },
    onSwitch: {
      type: Function,
      default: () => {}
    },
    onClose: {
      type: Function,
      default: () => {}
    },
    initialIndex: {
      type: Number,
      default: 0
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    maskClosable: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      index: this.initialIndex,
      isShow: false,
      infinite: true,
      loading: false,
      mode: Mode.CONTAIN,
      transform: {
        scale1: 1,
        scale2:1,
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      },
      touchStartPointX: 0,
      touchStartPointY: 0
    };
  },
  
  computed: {
    isSingle() {
      return this.urlList.length <= 1;
    },
    isFirst() {
      return this.index === 0;
    },
    isLast() {
      return this.index === this.urlList.length - 1;
    },
    currentImg() {
      return this.urlList[this.index];
    },
    imgStyle() {
      const { scale1,scale2,scale, deg, offsetX, offsetY, enableTransition } = this.transform;
      const style = {
        transform: `translate3d(${scale1}px,${scale2}px,1px) scale(${scale}) rotate(${deg}deg)`,
        transition: enableTransition ? 'transform .3s' : '',
        'margin-left': `${offsetX}px`,
        'margin-top': `${offsetY}px`,
        position: 'absolute'
      };
      if (this.mode === Mode.CONTAIN) {
        style.maxWidth = style.maxHeight = '100%';
      }
      return style;
    },
    viewerZIndex() {
      const nextZIndex = PopupManager.nextZIndex();
      return this.zIndex > nextZIndex ? this.zIndex : nextZIndex;
    }
  },
  watch: {
    index: {
      handler: function(val) {
        this.reset();
        this.onSwitch(val);
      }
    },
    currentImg(val) {
      this.$nextTick(_ => {
        const $img = this.$refs.img[0];
        if (!$img.complete) {
          this.loading = true;
        }
      });
    }
  },
  methods: {
    bodyTouchStart: function(event) {
      // // 获得起点X坐标，初始化distance为0
      this.touchStartPointX = event.targetTouches[0].pageX;
      this.touchStartPointY = event.targetTouches[0].pageY;
      // // console.log(this.touchStartPoint);
      // this.distanceX = 0;
      // this.distanceY = 0;
    },
    bodyTouchEnd: function(event) {
        // 划动结束，重置数据
        this.touchStartPointX = 0;
        this.touchStartPointY = 0;
        
    },
           
    move:function(event){
      if (event.targetTouches.length === 1) {
        console.log('-----单指------')
        this.transform.scale1 = event.targetTouches[0].pageX - this.touchStartPointX
        this.transform.scale2 = event.targetTouches[0].pageY - this.touchStartPointY
      }
      if (event.getPointerCount() === 2) {
        console.log('-----双指------')
        var x=event.getX();
        var y=event.getY();
        var x1=event.getX(1);
        var y1=event.getY(1);
        var distance=Math.sqrt((x)*(x)+(y)*(y))
        this.transform.scale = parseFloat((distance).toFixed(3))
      } 
      
        // if(this.canDrag==true){
        //     this.x1=e.clientX;
        //     this.y1=e.clientX;

        //     let x=this.x1-this.x0;
        //     let y=this.y1-this.y0;

        //     let img=document.querySelector("#test_3 img");
        //     this.style=`left:${img.offsetLeft+x}px;top:${img.offsetTop+y}px`;
        //     this.x0=this.x1;
        //     this.y0=this.y1;
        // }
    },
   
    hide() {
      this.$emit('onClose')
      this.deviceSupportUninstall();
      this.onClose();
    },
    deviceSupportInstall() {
      this._keyDownHandler = e => {
        e.stopPropagation();
        const keyCode = e.keyCode;
        
        switch (keyCode) {
          // ESC
          case 27:
            this.hide();
            break;
          // SPACE
          case 32:
            this.toggleMode();
            break;
          // LEFT_ARROW
          case 37:
            this.prev();
            break;
          // UP_ARROW
          case 38:
            this.handleActions('zoomIn');
            break;
          // RIGHT_ARROW
          case 39:
            this.next();
            break;
          // DOWN_ARROW
          case 40:
            this.handleActions('zoomOut');
            break;
        }
      };
      this._mouseWheelHandler = rafThrottle(e => {
        const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
        console.log('--------------')
        if (delta > 0) {
          this.handleActions('zoomIn', {
            zoomRate: 0.015,
            enableTransition: false
          });
        } else {
          this.handleActions('zoomOut', {
            zoomRate: 0.015,
            enableTransition: false
          });
        }
      });
      on(document, 'keydown', this._keyDownHandler);
      on(document, mousewheelEventName, this._mouseWheelHandler);
    },
    deviceSupportUninstall() {
      off(document, 'keydown', this._keyDownHandler);
      off(document, mousewheelEventName, this._mouseWheelHandler);
      this._keyDownHandler = null;
      this._mouseWheelHandler = null;
    },
    handleImgLoad(e) {
      this.loading = false;
    },
    handleImgError(e) {
      this.loading = false;
      e.target.alt = '加载失败';
    },
    handleMouseDown(e) {
      if (this.loading || e.button !== 0) return;

      const { offsetX, offsetY } = this.transform;
      const startX = e.pageX;
      const startY = e.pageY;
      this._dragHandler = rafThrottle(ev => {
        this.transform.offsetX = offsetX + ev.pageX - startX;
        this.transform.offsetY = offsetY + ev.pageY - startY;
      });
      on(document, 'mousemove', this._dragHandler);
      on(document, 'mouseup', ev => {
        off(document, 'mousemove', this._dragHandler);
      });

      e.preventDefault();
    },
    handleMaskClick() {
      console.log('---关闭--')
      if (this.maskClosable) {
        this.hide();
      }
    },
    reset() {
      this.transform = {
        scale1: 1,
        scale2: 1,
        scale: 1,
        deg: 0,
        offsetX: 0,
        offsetY: 0,
        enableTransition: false
      };
    },
    toggleMode() {
      if (this.loading) return;

      const modeNames = Object.keys(Mode);
      const modeValues = Object.values(Mode);
      const index = modeValues.indexOf(this.mode);
      const nextIndex = (index + 1) % modeNames.length;
      this.mode = Mode[modeNames[nextIndex]];
      this.reset();
    },
    prev() {
      if (this.isFirst && !this.infinite) return;
      const len = this.urlList.length;
      this.index = (this.index - 1 + len) % len;
    },
    next() {
      if (this.isLast && !this.infinite) return;
      const len = this.urlList.length;
      this.index = (this.index + 1) % len;
    },
    handleActions(action, options = {}) {
      if (this.loading) return;
      const { zoomRate, rotateDeg, enableTransition } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        enableTransition: true,
        ...options
      };
      const { transform } = this;
      switch (action) {
        case 'zoomOut':
          if (transform.scale > 0.2) {
            transform.scale = parseFloat((transform.scale - zoomRate).toFixed(3));
          }
          break;
        case 'zoomIn':
          transform.scale = parseFloat((transform.scale + zoomRate).toFixed(3));
          break;
        case 'moveLeft':
          console.log(transform.scale1)
          if (transform.scale1 == 1) {
            transform.scale1 = -1 - 5;
          } else {
            transform.scale1 = transform.scale1 - 5
          }
          break;
        case 'moveRight':
          transform.scale1 = (transform.scale1 + 5);
          break;
        case 'clocelise':
          transform.deg += rotateDeg;
          break;
        case 'anticlocelise':
          transform.deg -= rotateDeg;
          break;
      }
      transform.enableTransition = enableTransition;
    }
  },
  mounted() {
    this.deviceSupportInstall();
    if (this.appendToBody) {
      document.body.appendChild(this.$el);
    }
    // add tabindex then wrapper can be focusable via Javascript
    // focus wrapper so arrow key can't cause inner scroll behavior underneath
    this.$refs['el-image-viewer__wrapper'].focus();
  },
  destroyed() {
    // if appendToBody is true, remove DOM node after destroy
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el);
    }
  }
};
</script>