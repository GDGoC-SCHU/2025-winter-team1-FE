"use client";

import { useState } from "react";
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
  const router = useRouter();

  const problems: Problem[] = [
    {
      id: 1,
      level: "왕초급",
      language: "파이썬",
      status: "성공",
      problem: "문제 1 내용",
      correctAnswer: "정답 1",
    },
    {
      id: 2,
      level: "초급",
      language: "자바",
      status: "보류",
      problem: "문제 2 내용",
      correctAnswer: "정답 2",
    },
    {
      id: 3,
      level: "중급",
      language: "C언어",
      status: "성공",
      problem: "문제 3 내용",
      correctAnswer: "정답 3",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col text-lg">
      <header className="w-full p-6 bg-gray-900 shadow-md flex justify-between items-center text-xl">
        <h1 className="text-5xl font-bold text-center flex-1">사이트명</h1>
        <div className="flex items-center">
          {isLoggedIn && (
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
                    onClick={() => {
                      setLoggedIn(false);
                      router.push("/main");
                    }}
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

      {/* 성공한 문제 팝업 */}
      {selectedProblem && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-md w-96 text-white relative">
            <button
              onClick={() => setSelectedProblem(null)}
              className="absolute top-2 right-2 text-white text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-center">문제 상세</h2>
            <p className="mt-4">
              <strong>문제:</strong> {selectedProblem.problem}
            </p>
            <p className="mt-4 text-green-400">
              <strong>정답:</strong> {selectedProblem.correctAnswer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
