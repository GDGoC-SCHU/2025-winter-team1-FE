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
  const [resultPopup, setResultPopup] = useState(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setSelectedLevel(searchParams.get("level") || "왕초급");
    setSelectedLanguage(searchParams.get("language") || "파이썬");
  }, [searchParams]);

  const fetchNewProblem = async () => {
    setResultPopup(null); // 팝업 닫기
    setShowCorrectAnswer(false); // 정답보기 초기화
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
    setProblem(data.problem);
    setCorrectAnswer(data.correctAnswer);
    setAnswer("");
  };
  const handleSubmit = () => {
    if (!correctAnswer) {
      alert("정답이 로드되지 않았습니다. 다시 시도해주세요.");
      return;
    }
    if (answer.trim() === correctAnswer.trim()) {
      setResultPopup("correct");
    } else {
      setResultPopup("wrong");
    }
  };

  const handleHoldProblem = () => {
    alert("문제가 보류되었습니다.");
    fetchNewProblem();
  };

  const closePopup = () => {
    setResultPopup(null);
    setShowCorrectAnswer(false); // 팝업 닫을 때 정답 보기 초기화
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      {/* 헤더 */}
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
              onClick={() => fetchNewProblem()}
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
