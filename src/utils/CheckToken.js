import { jwtDecode }  from 'jwt-decode'; // jwt-decoded 패키지를 사용하여 JWT를 디코드

export const checkToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // 현재 시간 (초 단위)
    
    if (decoded.exp && decoded.exp > currentTime) {
      console.log("token true");
      return true; // 토큰이 만료되지 않았으면 유효
    }
  } catch (err) {
    console.log("token false");
    console.error('Invalid token:', err);
  }
  return false; // 유효하지 않거나 만료된 토큰
};
