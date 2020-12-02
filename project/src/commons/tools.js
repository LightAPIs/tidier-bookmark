'use strict';

/**
 * Custom tools
 */
const tools = {
  /**
   * 防抖延时器值
   */
  debounceTimer: null,
  /**
   * 节流延时器值
   */
  throttleTimer: null,
  /**
   * 节流时间戳值
   */
  throttlePrevious: 0,

  /**
   * 防抖方法
   * 1. 参考：https://github.com/mqyqingfeng/Blog/issues/22
   * 2. 参考：https://blog.csdn.net/qq_32678401/article/details/81779274
   * @param {Function} func 函数方法
   * @param {Number} delay 延迟时间
   * @param {Boolean} [immediate] 是否立即执行
   */
  debounce(func, delay, immediate = false) {
    let result;

    let debounced = function(...args) {
      tools.debounceTimer && clearTimeout(tools.debounceTimer);
      if (immediate) {
        /** 如果已经执行过了，不再执行 */
        const callNow = !tools.debounceTimer;
        tools.debounceTimer = setTimeout(() => {
          tools.debounceTimer = null;
        }, delay);
        if (callNow) {
          // 只在 immediate 为 true 时返回函数的执行结果
          result = func.apply(this, args);
        }
      } else {
        tools.debounceTimer = setTimeout(() => {
          func.apply(this, args);
        }, delay);
      }

      return result;
    };

    debounced.cancel = function() {
      clearTimeout(tools.debounceTimer);
      tools.debounceTimer = null;
    };

    return debounced();
  },

  /**
   * 节流方法
   * - 参考：https://github.com/mqyqingfeng/Blog/issues/26
   * @param {Function} func 函数方法
   * @param {Number} delay 延迟时间
   * @param {Object} [options] 参数对象 - leading: false 表示禁用第一次执行; trailing: false 表示禁用停止触发的回调 (两者不能同时设置为 false)
   */
  throttle(func, delay, options = {}) {
    let that, result;

    let throttled = function(...args) {
      let now = Date.now();

      if (!tools.throttlePrevious && options.leading === false) {
        // 禁用第一次执行
        tools.throttlePrevious = now;
      }

      /** 下次触发 func 剩余的时间 */
      let remaining = delay - (now - tools.throttlePrevious);
      that = this;
      // 如果没有剩余的时间了或者改了系统时间
      if (remaining <= 0 || remaining > delay) {
        if (tools.throttleTimer) {
          clearTimeout(tools.throttleTimer);
          tools.throttleTimer = null;
        }
        tools.throttlePrevious = now;
        result = func.apply(that, args);
        if (!tools.throttleTimer) {
          // 垃圾回收，方便下次执行定时器
          that = args = null;
        }
      } else if (!tools.throttleTimer && options.trailing !== false) {
        tools.throttleTimer = setTimeout(() => {
          tools.throttlePrevious = options.leading === false ? 0 : Date.now();
          tools.throttleTimer = null;
          result = func.apply(that, args);
          if (!tools.throttleTimer) {
            that = args = null;
          }
        }, remaining);
      }

      return result;
    };

    throttled.cancel = function() {
      clearTimeout(tools.throttleTimer);
      tools.throttlePrevious = 0;
      tools.throttleTimer = null;
    };

    return throttled();
  },

  /**
   * 获取输入焦点(聚焦)方法
   * @param {*} el 节点
   * @param {*} binding 指令对象
   */
  focus(el, binding) {
    if (binding.value && binding.oldValue !== binding.value) {
      tools.debounce(() => {
        try {
          if (binding.value) {
            el.focus();
            el.select();
          }
        } catch (e) {
          console.error('Error in focus command.');
          console.error(e);
        }
      }, 200);
    }
  },
};

export default tools;
