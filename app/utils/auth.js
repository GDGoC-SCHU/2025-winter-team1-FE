const BASE_URL = "http://localhost:8080/api/auth"; // 백엔드 Spring Boot API 주소

export async function signup(userData) {
  try {
    const response = await fetch(`${BASE_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // CORS 문제 해결을 위해 추가
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // ✅ JSON 형식이 아닐 경우 대비
    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch (error) {
      console.error("JSON 파싱 오류:", error);
      return { message: "서버에서 올바른 응답을 받지 못했습니다." };
    }
  } catch (error) {
    console.error("회원가입 요청 실패:", error);
    return { message: "회원가입 중 오류가 발생했습니다." };
  }
}
export async function login(userData) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
    credentials: "include",
  });

  return response.json();
}
