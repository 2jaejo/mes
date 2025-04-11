import React, { } from "react";
import HLSPlayer from "../components/HLSPlayer";

function Set() {
  const streamUrl = "http://ekenzo.duckdns.org:8021/hls/stream.m3u8"; // 실제 .m3u8 파일 URL

  return (
    
    <div style={{height:"1000px"}}>
      <div style={{width:"600px"}}>
        <HLSPlayer src={streamUrl} />
      </div>
    </div>
  );
}

export default Set;
