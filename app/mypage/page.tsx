"use client";

import { useState, useEffect } from "react";

export default function MyPage() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [schoolInfo, setSchoolInfo] = useState("");
  const [signupDate, setSignupDate] = useState("");
  const [solvedProblems, setSolvedProblems] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordOpen, setPasswordOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  // ✅ 로그인된 사용자 정보 & 문제 풀이 현황 가져오기
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");
      window.location.href = "/login";
      return;
    }

    fetch("http://192.168.219.100:8080/api/auth/me", {
      // ✅ 백엔드 포트 8080으로 변경
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            `API 오류: ${res.status} - ${
              errorData.message || "알 수 없는 오류"
            }`
          );
        }
        return res.json();
      })
      .then((data) => {
        console.log("사용자 정보:", data);
        setUsername(data.username);
        setUserId(data.id);
        setStatusMessage(data.statusMessage || "");
        setSchoolInfo(data.schoolInfo || "");
        setSignupDate(data.signupDate || "");
        setSolvedProblems(data.solvedProblems || 0);
        setTotalProblems(data.totalProblems || 0);
      })
      .catch((error) => {
        console.error("사용자 정보 가져오기 실패:", error);
        alert("사용자 정보를 불러올 수 없습니다. 다시 로그인해 주세요.");
        localStorage.removeItem("token");
        window.location.href = "/login";
      });
  }, []);
  // ✅ 로그아웃
  const handleLogout = () => {
    const token = localStorage.getItem("token");

    fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        localStorage.removeItem("token");
        alert("로그아웃되었습니다.");
        window.location.href = "/main";
      })
      .catch(() => alert("로그아웃 중 오류가 발생했습니다."));
  };

  // ✅ 회원 탈퇴
  const handleDeleteAccount = () => {
    const token = localStorage.getItem("token");

    fetch("/api/auth/delete-user", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          alert("회원 탈퇴가 완료되었습니다.");
          localStorage.removeItem("token");
          window.location.href = "/main";
        } else {
          alert("회원 탈퇴 실패. 다시 시도해주세요.");
        }
      })
      .catch(() => alert("회원 탈퇴 중 오류가 발생했습니다."));
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-5xl font-bold mb-6">사이트명</h1>

      {/* 프로필 카드 */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-md text-center">
        <div className="flex justify-center mb-4">
          <img
            src="/profile-icon.png"
            alt="Profile"
            className="w-16 h-16 rounded-full"
          />
        </div>
        <div className="text-lg font-semibold">
          {username} ({userId})
        </div>
        <div className="text-gray-400 text-sm mb-2">
          회원가입일: {signupDate}
        </div>
        <div className="text-gray-300 text-sm mb-4">
          맞춘 문제 수: {solvedProblems}문제
        </div>

        {isEditing ? (
          <>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border w-full p-2 rounded-md mb-2 text-center bg-gray-800 text-white"
            />
            <input
              type="text"
              value={statusMessage}
              onChange={(e) => setStatusMessage(e.target.value)}
              className="border w-full p-2 rounded-md mb-4 text-center bg-gray-800 text-white"
            />
            <button
              onClick={() => setIsEditing(false)}
              className="bg-green-500 text-white px-4 py-2 rounded-md w-full"
            >
              저장
            </button>
          </>
        ) : (
          <>
            <div className="text-gray-300 mb-2">{statusMessage}</div>
            <div className="text-gray-400 text-sm">{schoolInfo}</div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-700 text-white px-4 py-2 rounded-md w-full mt-4"
            >
              수정
            </button>
          </>
        )}
      </div>

      {/* ✅ 문제 풀이 현황 유지 */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-md mt-6 text-center">
        <h2 className="text-xl font-bold mb-4">문제 풀이 현황</h2>
        <p className="text-lg mb-2">
          풀은 문제: <span className="font-bold">{solvedProblems}</span>
        </p>
        <p className="text-lg mb-4">
          총 문제 수: <span className="font-bold">{totalProblems}</span>
        </p>
        <button
          onClick={() => (window.location.href = "/look")}
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
        >
          문제 보러가기
        </button>
      </div>

      {/* 로그아웃 & 회원 탈퇴 */}
      <div className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-md mt-6 text-center">
        <button
          onClick={handleLogout}
          className="bg-gray-700 text-white px-4 py-2 rounded-md w-full mb-2"
        >
          로그아웃
        </button>
        <button
          onClick={() => setDeleteOpen(true)}
          className="bg-red-500 text-white px-4 py-2 rounded-md w-full"
        >
          회원 탈퇴
        </button>
      </div>

      {/* 회원 탈퇴 팝업 */}
      {isDeleteOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-md w-96 text-white relative text-center">
            <button
              onClick={() => setDeleteOpen(false)}
              className="absolute top-2 right-2 text-white text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4">회원 탈퇴</h2>
            <p className="mb-4">
              정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="w-full bg-red-500 text-white py-2 rounded-md mb-2"
            >
              회원 탈퇴
            </button>
            <button
              onClick={() => setDeleteOpen(false)}
              className="w-full bg-gray-700 text-white py-2 rounded-md"
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
