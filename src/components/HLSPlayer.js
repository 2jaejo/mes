import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

const HLSPlayer = ({ src }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (Hls.isSupported()) {
      const hls = new Hls({
        debug: true,  // 디버그 로그를 출력
        autoStartLoad: false,  // 로딩을 자동으로 시작
        startLevel: -1, // 초기 재생 품질을 설정
        capLevelToPlayerSize: true, // 플레이어 크기에 맞게 품질을 제한
        enableWorker: true, // 백그라운드 워커 사용
        lowLatencyMode: true, // 저지연 모드 활성화
        maxBufferLength: 10, // 최대 버퍼 길이
        backBufferLength: 10, // 백버퍼 길이 플레이어가 과거 데이터를 얼마나 오래 유지할지 설정
        liveDurationInfinity: true, // 라이브 스트림 전체 길이를 무한대로 간주
        // liveMaxLatencyDurationCount: 2, // 세그먼트 단위 더 지연되면 최신 세그먼트로 점프
        liveSyncDuration: 2, // 초 단위 더 지연되면 최신 세그먼트로 점프
        liveMaxLatencyDuration: 4, // 초 단위 최대 지연 시간
      });

      hls.loadSource(src);
      hls.attachMedia(videoRef.current);
      hls.startLoad();  // 로딩 시작

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // 자동 재생 시작 (음소거되어 있어야 대부분 브라우저에서 자동 재생 허용)
        videoRef.current.play();
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS.js Error:", data);
      });

    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = src;
    }
  }, [src]);

  return (
    <video 
      ref={videoRef}
      muted
      autoPlay
      playsInline 
      controls 
      style={{width:"100%"}}
    />
  );
};

export default HLSPlayer;
