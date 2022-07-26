

# HTML播放层原理
- 标准：
    - https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Live_streaming_web_audio_and_video
    - https://developer.mozilla.org/en-US/docs/Web/API/Media_Streams_API
- rtsp 监控器最直接的码流
- rtmp 针对flv格式的推流
- WebRTC
    - RTSP => H.264 + Opus / WebRTC => websocket => 浏览器
    - In this case we do not use Flash at all, and the video stream is played using means of the browser itself, without using third-party plugins. This method works both in Chrome and Firefox Android browsers, where Flash is not available. 
    - WebRTC是WEB方案最低延时
    - 延迟低于0.5秒

``` js
// 示例：通过rtsp转http支持的码流vcodec=theo and mux=ogg
// https://github.com/deepch/RTSPtoWebRTC 基于go语言
// https://streamedian.com/demo/free/ 直接通过wws转
// https://github.com/mpromonet/webrtc-streamer
```


``` js
// 示例：通过用户媒介mediaDevices，获取视频流MediaStream对象，加载至Video标签
// https://webrtc.github.io/samples/src/content/getusermedia/gum/
async function init(e) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
    e.target.disabled = true;
  } catch (e) {
    handleError(e);
  }
}

// Put variables in global scope to make them available to the browser console.
const constraints = window.constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  const video = document.querySelector('video');
  const videoTracks = stream.getVideoTracks();
  console.log('Got stream with constraints:', constraints);
  console.log(`Using video device: ${videoTracks[0].label}`);
  window.stream = stream; // make variable available to browser console
  video.srcObject = stream;
}
```

# Node库
- npm i -S fluent-ffmpeg
    - 示例：https://github.com/zszq/electron-rtsp-to-rtmp
    - 说明：可以调用ffmpeg指令，将rtsp码流转成localhost的rtmp流
- npm i -S node-media-server

# FFMPRG
- ffmpeg 转码
- ffplay 播放
- ffprobe 节点