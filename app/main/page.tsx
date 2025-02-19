"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("왕초급");
  const [selectedLanguage, setSelectedLanguage] = useState("파이썬");
  const [token, setToken] = useState("");
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  // ✅ 새로고침해도 로그인 상태 유지
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setLoggedIn(true);
    }
  }, []);

  // ✅ 회원가입 API 호출
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const userData = {
      userid: formData.get("userid"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });

      const result = await response.text();
      alert(result);
      if (response.ok) {
        setSignupOpen(false);
        setLoginOpen(true);
      }
    } catch (error) {
      console.error("❌ 회원가입 오류:", error);
      alert("회원가입에 실패했습니다.");
    }
  };

  // ✅ 로그인 API 호출
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const credentials = {
      userid: formData.get("userid"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem("token", token); // ✅ 토큰 저장 (새로고침해도 유지됨)
        setToken(token);
        setLoggedIn(true);
        setLoginOpen(false);
        alert("로그인 성공!");
      } else {
        alert("로그인 실패! 아이디 또는 비밀번호를 확인하세요.");
      }
    } catch (error) {
      console.error("❌ 로그인 오류:", error);
      alert("로그인 중 오류 발생");
    }
  };

  // ✅ 로그아웃 기능
  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ 토큰 삭제
    setToken("");
    setLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col text-lg">
      {/* 헤더 */}
      <header className="w-full p-6 bg-gray-900 shadow-md flex justify-between items-center text-xl">
        <h1 className="text-5xl font-bold text-center flex-1">사이트명</h1>
        <div className="flex items-center">
          {!isLoggedIn ? (
            <div className="flex items-center">
              <button
                onClick={() => setSignupOpen(true)}
                className="mr-2 text-white"
              >
                회원가입
              </button>
              <span className="mx-2">|</span>
              <button onClick={() => setLoginOpen(true)} className="text-white">
                로그인
              </button>
            </div>
          ) : (
            <div className="relative">
              <button onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
                <img
                  src="/profile-icon.png"
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
              </button>
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 shadow-md rounded-md p-2">
                  <button
                    onClick={() => router.push("/mypage")}
                    className="block w-full text-left px-4 py-2 text-white"
                  >
                    마이페이지
                  </button>
                  <button className="block w-full text-left px-4 py-2 text-white">
                    설정
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-500"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* 문제 선택 UI */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-gray-800 p-6 rounded-md shadow-md w-full max-w-2xl">
          <h2 className="text-4xl font-bold text-center mb-4">
            난이도 및 코드 언어 선택
          </h2>
          <div className="mt-4 flex justify-center">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="border p-3 mr-4 bg-gray-700 text-white rounded-md"
            >
              <option>왕초급</option>
              <option>초급</option>
              <option>중급</option>
              <option>고급</option>
            </select>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="border p-3 bg-gray-700 text-white rounded-md"
            >
              <option>파이썬</option>
              <option>자바</option>
              <option>C언어</option>
            </select>
          </div>
          <button
            onClick={() => {
              if (!isLoggedIn) {
                alert("로그인 후 이용할 수 있습니다.");
              } else {
                router.push(
                  `/sov?level=${selectedLevel}&language=${selectedLanguage}`
                );
              }
            }}
            className="mt-6 px-8 py-3 bg-blue-500 text-white rounded-md text-lg w-full"
          >
            문제 풀러가기
          </button>
        </div>
      </main>

      {/* 로그인 팝업 */}
      {isLoginOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-md w-96 text-white relative">
            <button
              onClick={() => setLoginOpen(false)}
              className="absolute top-2 right-2 text-white text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-center">로그인</h2>
            <form onSubmit={handleLogin}>
              <input
                name="userid"
                type="text"
                placeholder="아이디"
                className="border w-full p-2 mt-2 bg-gray-800 text-white"
              />
              <input
                name="password"
                type="password"
                placeholder="비밀번호"
                className="border w-full p-2 mt-2 bg-gray-800 text-white"
              />
              <button
                type="submit"
                className="w-full mt-4 bg-blue-500 text-white"
              >
                로그인
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 회원가입 팝업 */}
      {isSignupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-md w-96 text-white relative">
            <button
              onClick={() => setSignupOpen(false)}
              className="absolute top-2 right-2 text-white text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-center">회원가입</h2>
            <form onSubmit={handleSignup}>
              <input
                name="userid"
                type="text"
                placeholder="아이디"
                className="border w-full p-2 mt-2 bg-gray-800 text-white"
              />
              <input
                name="password"
                type="password"
                placeholder="비밀번호"
                className="border w-full p-2 mt-2 bg-gray-800 text-white"
              />
              <button
                type="submit"
                className="w-full mt-4 bg-green-500 text-white"
              >
                회원가입
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
