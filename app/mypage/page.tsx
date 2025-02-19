"use client";

import { useState, useEffect } from "react";

export default function MyPage() {
  const [userId, setUserId] = useState("");
  const [solvedProblems, setSolvedProblems] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  // ✅ 로그인된 사용자 정보 & 문제 풀이 현황 가져오기
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");
      window.location.href = "/maqin";
      return;
    }

    fetch("http://192.168.219.100:8080/api/auth/me", {
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
        setUserId(data.id);
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

    fetch("http://192.168.219.100:8080/api/auth/logout", {
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

    fetch("http://192.168.219.100:8080/api/auth/delete-user", {
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

      {/* 문제 풀이 현황 */}
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
    </div>
  );
}
