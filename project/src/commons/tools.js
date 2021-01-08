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
   * 防抖方法
   * 1. 参考：https://github.com/mqyqingfeng/Blog/issues/22
   * 2. 参考：https://blog.csdn.net/qq_32678401/article/details/81779274
   * @param {Function} func 函数方法
   * @param {Number} delay 延迟时间
   * @param {Boolean} [immediate] 是否立即执行
   */
  debounce(func, delay, immediate = false) {
    let result;

    const debounced = function(...args) {
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

  /**
   * 下载文本文件至本地的方法
   * @param {String} content 文件内容
   * @param {String} filename 文件名 - 支持带扩展名(默认为 txt)
   * @param {Function} completed 下载完成后的回调函数
   */
  downloadTextFile: (content, filename = null, completed = null) => {
    if (!filename) {
      filename = 'no-name.txt';
    } else {
      filename = /\.(?:txt|text|json|config)$/i.test(filename) ? filename : filename + '.txt';
    }

    const urlObject = window.URL || window.webKitURL || window;
    const exportBlob = new Blob([content]);
    const saveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    saveLink.href = urlObject.createObjectURL(exportBlob);
    saveLink.download = filename;

    /** MouseEvent 鼠标事件构造器 */
    const ev = new MouseEvent('click', {
      bubbles: true,
      cancelable: false,
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      ctrlKey: false,
      altKey: false,
      shiftKey: false,
      metaKey: false,
      button: 0,
      relatedTarget: null,
    });
    saveLink.dispatchEvent(ev);

    typeof completed === 'function' && completed();
  },

  /**
   * 打开并读取文本文件的方法
   * @param {Function} callback 回调函数 (res: 状态, content: 内容)
   */
  openTextFile: callback => {
    const fileInput = document.createElementNS('http://www.w3.org/1999/xhtml', 'input');
    fileInput.type = 'file';
    fileInput.accept = '.txt, .text, .json, .conf, .config';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', () => {
      if (!fileInput.value) {
        console.warn('No file selected.');
        callback(false, 'no file');
        return;
      }

      const file = fileInput.files[0];
      const { type } = file;

      if (type !== 'application/json' && type !== 'application/xml' && type !== 'text/plain') {
        console.warn('Not a valid file.');
        callback(false, 'valid');
        return;
      }

      const reader = new FileReader();
      reader.onload = function(e) {
        const data = e.target.result;
        callback(true, data);
        return;
      };

      reader.readAsText(file);
    });

    fileInput.click();
  },
};

export default tools;
