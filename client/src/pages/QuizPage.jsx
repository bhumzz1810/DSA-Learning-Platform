import React, { useEffect, useState } from "react";
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

  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await axios.get("http://localhost:5000/api/dashboard", {
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

  useEffect(() => {
    if (dashboardLoaded) {
      fetchRandomQuestion();
    }
  }, [dashboardLoaded]);

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

    try {
      const res = await axios.get(`/api/quiz/question/random?cb=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { question, limitReached } = res.data;

      if (limitReached) {
        setShowModal(true); 
        return;
      }


      const rawQuestion = res.data.question;
      const questionText = rawQuestion.replace(/^Sample Question \d+:\s*/, "");
      setQuestion({ ...res.data, question: questionText });
    } catch (err) {
      console.error("Failed to fetch random question", err);
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selected) return;

    try {
      const res = await axios.post(
        "/api/quiz/submit",
        { questionId: question._id, selectedOption: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFeedback(res.data.correct ? "✅ Correct!" : "❌ Incorrect");
      setShowExplanation(true);
      setSubmitted(true);

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
        You’ve reached your <strong className="text-black">20-question free limit</strong>.
        <br />
        To unlock unlimited learning, please consider upgrading your plan.
      </p>

      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setShowModal(false)}
          className="px-5 py-2.5 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
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
          className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
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
      <h1 className="text-xl font-bold mb-4">Questions Attempted: {attempted}</h1>

      {showModal && subscriptionModal}

      {!showModal && question ? (
        <>
          <p className="mb-2">{question.question}</p>

          {question.options.map((opt, i) => (
            <div
              key={i}
              onClick={() => !submitted && setSelected(opt)}
              role="radio"
              aria-checked={selected === opt}
              tabIndex={0}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !submitted) {
                  setSelected(opt);
                }
              }}
              className={`block px-4 py-2 mb-2 border rounded cursor-pointer select-none ${selected === opt ? "bg-blue-200 border-blue-500" : "bg-white"
                } ${submitted ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <input
                type="radio"
                name="quiz-option"
                value={opt}
                checked={selected === opt}
                onChange={() => !submitted && setSelected(opt)}
                className="hidden"
                aria-hidden="true"
              />
              <span>{opt}</span>
            </div>
          ))}

          {!showExplanation && (
            <button
              onClick={handleSubmit}
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
