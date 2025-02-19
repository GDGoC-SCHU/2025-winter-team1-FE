"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Problem {
  id: number;
  level: string;
  language: string;
  status: "성공" | "보류";
  problem: string;
  correctAnswer: string;
}

export default function MyProblems() {
  const [profileMenuOpen, setProfileMenuOpen] = useState<boolean>(false);
  const [isLoggedIn, setLoggedIn] = useState<boolean>(true);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const router = useRouter();

  // ✅ 문제 데이터 백엔드에서 불러오기
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");
      window.location.href = "/log1in";
      return;
    }

    fetch("http://192.168.219.100:8080/api/problems/my", {
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
        console.log("문제 목록:", data);
        setProblems(data);
      })
      .catch((error) => {
        console.error("문제 데이터 가져오기 실패:", error);
        alert("문제를 불러올 수 없습니다. 다시 시도해 주세요.");
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col text-lg">
      <header className="w-full p-6 bg-gray-900 shadow-md flex justify-between items-center text-xl">
        <h1 className="text-5xl font-bold text-center flex-1">사이트명</h1>
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
              <button
                onClick={() => router.push("/settings")}
                className="block w-full text-left px-4 py-2 text-white"
              >
                설정
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  router.push("/login");
                }}
                className="block w-full text-left px-4 py-2 text-red-500"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-gray-800 p-6 rounded-md shadow-md w-full max-w-2xl">
          <h2 className="text-4xl font-bold text-center mb-4">내가 푼 문제</h2>
          <table className="w-full text-left border-collapse border border-gray-700">
            <thead>
              <tr className="bg-gray-900">
                <th className="p-3 border border-gray-700">문제번호</th>
                <th className="p-3 border border-gray-700">난이도</th>
                <th className="p-3 border border-gray-700">코드 언어</th>
                <th className="p-3 border border-gray-700">성공 여부</th>
                <th className="p-3 border border-gray-700">문제 보기</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => (
                <tr key={problem.id} className="text-center">
                  <td className="p-3 border border-gray-700">{problem.id}</td>
                  <td className="p-3 border border-gray-700">
                    {problem.level}
                  </td>
                  <td className="p-3 border border-gray-700">
                    {problem.language}
                  </td>
                  <td className="p-3 border border-gray-700">
                    {problem.status}
                  </td>
                  <td className="p-3 border border-gray-700">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md"
                      onClick={() =>
                        problem.status === "보류"
                          ? router.push(`/sov?page=retry&problem=${problem.id}`)
                          : setSelectedProblem(problem)
                      }
                    >
                      문제 보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
