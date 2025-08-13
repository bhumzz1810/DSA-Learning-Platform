import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QuizPage = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [attempted, setAttempted] = useState(0);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dashboardLoaded, setDashboardLoaded] = useState(false);

  // Timer states
  const [timeLeft, setTimeLeft] = useState(35);
  const timerRef = useRef(null);

  // Prevent double-submit instantly
  const hasSubmittedRef = useRef(false);

  const token = localStorage.getItem("token");
  const API_ROOT = (
    import.meta.env.VITE_API_URL ||
    "https://dsa-learning-platform-five.vercel.app"
  ).replace(/\/+$/, "");

  // Fetch dashboard
  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await axios.get(`${API_ROOT}/api/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const subscription = res.data.user.subscription;
        setIsSubscribed(subscription?.isActive ?? false);

        const quizAttempts = res.data.user.quizAttempts;
        const totalAttempted = quizAttempts?.[0]?.questionsAttempted || 0;
        setAttempted(totalAttempted);

        setDashboardLoaded(true);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      }
    }
    fetchDashboard();
  }, [token]);

  // Load question after dashboard ready
  useEffect(() => {
    if (dashboardLoaded) {
      fetchRandomQuestion();
    }
  }, [dashboardLoaded]);

  // Timer countdown
  useEffect(() => {
    if (!loading && !showModal && !submitted && question) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            if (!hasSubmittedRef.current) {
              handleSubmit(true);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [loading, question, submitted, showModal]);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(35);
  };

  const fetchRandomQuestion = async () => {
    if (attempted >= 20 && !isSubscribed) {
      setShowModal(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSelected(null);
    setFeedback(null);
    setShowExplanation(false);
    setSubmitted(false);
    hasSubmittedRef.current = false; // reset double-submit blocker

    try {
      const res = await axios.get(
        `/api/quiz/question/random?cb=${Date.now()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { limitReached } = res.data;
      if (limitReached) {
        setShowModal(true);
        return;
      }

      const rawQuestion = res.data.question;
      const questionText = rawQuestion.replace(/^Sample Question \d+:\s*/, "");
      setQuestion({ ...res.data, question: questionText });

      resetTimer();
    } catch (err) {
      console.error("Failed to fetch random question", err);
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (autoSubmit = false) => {
    // Prevent double submission instantly
    if (hasSubmittedRef.current) return;
    hasSubmittedRef.current = true;
    setSubmitted(true);

    const answerToSend = autoSubmit ? "__NO_ANSWER__" : selected;

    try {
      const res = await axios.post(
        "/api/quiz/submit",
        { questionId: question._id, selectedOption: answerToSend },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const isCorrect = !autoSubmit && res.data.correct;

      setFeedback(
        isCorrect
          ? "✅ Correct!"
          : autoSubmit
          ? "❌ Incorrect (Time's up!)"
          : "❌ Incorrect"
      );

      setShowExplanation(true);
      clearInterval(timerRef.current);
      setAttempted((prev) => prev + 1);
    } catch (err) {
      if (err.response?.status === 403) {
        setShowModal(true);
      } else {
        console.error(err);
      }
    }
  };

  const handleNext = () => {
    if (attempted >= 20 && !isSubscribed) {
      setShowModal(true);
      return;
    }
    fetchRandomQuestion();
  };

  const subscriptionModal = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center animate-fadeIn">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-4">
          🚫 Free Limit Reached
        </h2>
        <p className="text-gray-600 text-base leading-relaxed mb-6">
          You’ve reached your <strong>20-question free limit</strong>.
          <br />
          Upgrade your plan for unlimited learning.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={() => setShowModal(false)}
            className="px-5 py-2.5 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
          <button
            onClick={() => {
              navigate("/");
              setTimeout(() => {
                const pricingSection = document.getElementById("pricing");
                if (pricingSection) {
                  pricingSection.scrollIntoView({ behavior: "smooth" });
                }
              }, 100);
            }}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );

  if (loading && !showModal) return <p className="p-4">Loading quiz...</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        Questions Attempted: {attempted}
      </h1>

      {showModal && subscriptionModal}

      {!showModal && question ? (
        <>
          <div className="flex justify-between items-center mb-3">
            <p>{question.question}</p>
            <span className="text-lg font-bold text-red-600">
              ⏳ {timeLeft}s
            </span>
          </div>

          {question.options.map((opt, i) => (
            <div
              key={i}
              onClick={() => !submitted && setSelected(opt)}
              className={`block px-4 py-2 mb-2 border rounded cursor-pointer select-none 
                ${selected === opt ? "bg-blue-200 border-blue-500" : "bg-white"}
                ${submitted ? "cursor-not-allowed opacity-60" : ""}`}
            >
              {opt}
            </div>
          ))}

          {!showExplanation && (
            <button
              onClick={() => handleSubmit(false)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
              disabled={!selected || submitted}
            >
              Submit
            </button>
          )}

          {showExplanation && (
            <>
              <p className="mt-3 font-semibold">{feedback}</p>
              <p className="mt-2 text-sm text-gray-600">
                <strong>Explanation:</strong> {question.explanation}
              </p>
              <button
                onClick={handleNext}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              >
                Next Question
              </button>
            </>
          )}
        </>
      ) : null}
    </div>
  );
};

export default QuizPage;
