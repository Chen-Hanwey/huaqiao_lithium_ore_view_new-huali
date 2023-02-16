// easyPlayer H265视频截图方法
// 获取截取到的pixels
const generatePixelsFromWebgl = webGlCanvas => {
    if (!webGlCanvas) return
    const gl = webGlCanvas.getContext('webgl', { preserveDrawingBuffer: true })
    const { drawingBufferHeight: height, drawingBufferWidth: width } = gl
    const pixels = new Uint8Array(4 * width * height)
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
    return pixels
}
// 判断像素是不是空的
const judgeWetherCaptureSuccess = pixels => {
    if (!pixels) return false
    return !pixels.subarray(0, 128).every(pixel => pixel === 0) // 如果全部是0就是失败
}
// 等到下一帧绘制之前
const waitToNextFrame = () => {
    return new Promise(resolve => {
        requestAnimationFrame(resolve)
    })
}
const saveBlob = (function() {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';
    return function saveData(blob, fileName) {
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
    };
}());
const downCanvasFile = function(imgSrc, fileName) {
    let a = document.createElement("a"); // 生成一个a元素
    let event = new MouseEvent("click"); // 创建一个单击事件
    a.download = fileName || "picture"; // 设置图片名称
    a.href = imgSrc; // 将生成的URL设置为a.href属性
    a.dispatchEvent(event); // 触发a的单击事件
}
/**
 * 该方法参数可以自行修改
 * @param {easy player 实例} player
 * @param {当前播放的设备名称，只是用来命名截图得到的图片} deviceName
 */
export const setH265PlayerCover = async function(player, deviceName) {
    let MAX_CAPTURE_RETRY_COUNT = 10
    // const IMAGE_FORMAT = 'jpeg'
    const IMAGE_FORMAT = 'jpg'
    return new Promise(async (resolve, reject) => {
        const playerUI = player?.playerUI
        if (!playerUI) return reject(new Error('player ui is null'))

        let isSuccess = false
        let canvas = null

        while (MAX_CAPTURE_RETRY_COUNT > 0 && !isSuccess) {
            // 还有尝试次数并且没有成功就再次执行
            MAX_CAPTURE_RETRY_COUNT -= 1

            await waitToNextFrame()

            canvas = playerUI.querySelector('canvas')
            if (!canvas) {
                return reject(new Error('cavans is null'))
            }
            const pixels = generatePixelsFromWebgl(canvas)
            isSuccess = judgeWetherCaptureSuccess(pixels)
        }

        if (isSuccess) {
            canvas.toBlob(
                async blob => {
                    const snapFileName = `${deviceName}-${Date.now()}.${IMAGE_FORMAT}`
                    // 根据ObjectURL生成地址，下载图片
                    /* const url = URL.createObjectURL(blob)
                    const res = { url, name: snapFileName }
                    resolve(res) */
                    // document 创建 a便签，模拟点击效果，下载图片
                    saveBlob(blob, snapFileName);
                },
                `image/${IMAGE_FORMAT}`,
                0.9
            )
            // 如下方法截图更清晰
            // const snapFileName = `${deviceName}-${Date.now()}.${IMAGE_FORMAT}`;
            // let imgBase64Url = canvas.toDataURL('image/png');
            // downCanvasFile(imgBase64Url, snapFileName);
        } else {
            reject(new Error('reach max retry count'))
        }
    })
}
