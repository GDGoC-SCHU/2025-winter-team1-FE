"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function ProblemPage() {
  const searchParams = useSearchParams();
  const [selectedLevel, setSelectedLevel] = useState(
    searchParams.get("level") || "왕초급"
  );
  const [selectedLanguage, setSelectedLanguage] = useState(
    searchParams.get("language") || "파이썬"
  );
  const [isLoggedIn, setLoggedIn] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [problem, setProblem] = useState("이곳에 문제가 표시됩니다.");
  const [answer, setAnswer] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("정답 예제");
  const [resultPopup, setResultPopup] = useState<"correct" | "wrong" | null>(
    null
  );
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const router = useRouter();
  const userId = "testUser"; // 실제 로그인 사용자의 ID 사용 필요

  useEffect(() => {
    setSelectedLevel(searchParams.get("level") || "왕초급");
    setSelectedLanguage(searchParams.get("language") || "파이썬");
  }, [searchParams]);

  // 문제 불러오기
  const fetchNewProblem = async () => {
    setResultPopup(null);
    setShowCorrectAnswer(false);
    try {
      const response = await fetch("/api/generate-problem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          level: selectedLevel,
          language: selectedLanguage,
        }),
      });
      const data = await response.json();
      setProblem(data.problem || "문제를 불러오지 못했습니다.");
      setCorrectAnswer(data.correctAnswer || "");
      setAnswer("");
    } catch (error) {
      console.error("문제를 불러오는 중 오류 발생:", error);
      alert("문제를 불러오는 중 오류가 발생했습니다.");
    }
  };

  // 문제 제출 시 결과 저장
  const handleSubmit = async () => {
    if (!correctAnswer) {
      alert("정답이 로드되지 않았습니다. 다시 시도해주세요.");
      return;
    }
    const isCorrect = answer.trim() === correctAnswer.trim();
    setResultPopup(isCorrect ? "correct" : "wrong");

    try {
      await fetch("/api/save-problem-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problem,
          answer,
          correctAnswer,
          status: isCorrect ? "correct" : "wrong",
          userId,
        }),
      });
    } catch (error) {
      console.error("문제 결과 저장 중 오류 발생:", error);
    }
  };

  // 문제 보류 시 결과 저장
  const handleHoldProblem = async () => {
    alert("문제가 보류되었습니다.");
    try {
      await fetch("/api/save-problem-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problem,
          answer: "",
          correctAnswer,
          status: "hold",
          userId,
        }),
      });
    } catch (error) {
      console.error("문제 보류 저장 중 오류 발생:", error);
    }
    fetchNewProblem();
  };

  const closePopup = () => {
    setResultPopup(null);
    setShowCorrectAnswer(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col text-lg">
      {/* 헤더 영역 */}
      <header className="w-full p-6 bg-gray-900 shadow-md flex justify-between items-center text-xl">
        <h1 className="text-5xl font-bold text-center flex-1">사이트명</h1>
        <div className="flex items-center">
          {isLoggedIn ? (
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
          ) : (
            <div className="flex items-center">
              <button
                onClick={() => alert("로그인이 필요합니다.")}
                className="mr-2 text-white"
              >
                회원가입
              </button>
              <span className="mx-2">|</span>
              <button
                onClick={() => alert("로그인이 필요합니다.")}
                className="text-white"
              >
                로그인
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="bg-gray-900 p-6 rounded-lg shadow-md w-full max-w-2xl text-center">
          <h2 className="text-2xl font-bold mb-4">문제</h2>
          <div className="bg-gray-800 p-6 rounded-md text-left">
            <p className="text-gray-300">{problem}</p>
          </div>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="border p-3 w-full bg-gray-700 text-white rounded-md mt-4"
            placeholder="정답을 입력하세요"
          />
          <button
            onClick={handleSubmit}
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-md text-lg w-full"
          >
            제출하기
          </button>
        </div>
      </main>

      {resultPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-md w-96 text-white text-center relative flex flex-col space-y-4">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-white text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold">
              {resultPopup === "correct" ? "정답입니다! 🎉" : "틀렸습니다! ❌"}
            </h2>
            {resultPopup === "wrong" && (
              <>
                <button
                  onClick={() => setShowCorrectAnswer(!showCorrectAnswer)}
                  className="bg-gray-700 p-2 rounded-md"
                >
                  정답 보기
                </button>
                {showCorrectAnswer && (
                  <p className="mt-4 text-green-400">정답: {correctAnswer}</p>
                )}
              </>
            )}
            <button
              onClick={() => router.push("/main")}
              className="bg-purple-500 p-2 rounded-md"
            >
              메인으로 가기
            </button>
            {resultPopup === "wrong" && (
              <button
                onClick={handleHoldProblem}
                className="bg-yellow-500 p-2 rounded-md"
              >
                보류하기
              </button>
            )}
            <button
              onClick={fetchNewProblem}
              className="bg-blue-500 p-2 rounded-md"
            >
              다른 문제 풀기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
