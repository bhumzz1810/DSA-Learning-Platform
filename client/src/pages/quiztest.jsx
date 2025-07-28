import React, { useEffect, useState } from "react";
import axios from "axios";

const QuizPage = () => {
  const [question, setQuestion] = useState(null);
  const [attempted, setAttempted] = useState(() => {
    return parseInt(localStorage.getItem("attemptedQuestions")) || 0;
  });
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false); // Add this
  const [showModal, setShowModal] = useState(false); // For subscription modal

  const token = localStorage.getItem("token");

  // Fetch subscription status on mount
  useEffect(() => {
    async function fetchSubscriptionStatus() {
      try {
        const res = await axios.get("/api/user/subscription-status", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsSubscribed(res.data.subscribed);
      } catch (error) {
        console.error("Failed to fetch subscription status", error);
      }
    }

    fetchSubscriptionStatus();
  }, [token]);

  const fetchRandomQuestion = async () => {
    if (attempted >= 20 && !isSubscribed) {
      // Show modal when limit reached and not subscribed
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

  useEffect(() => {
    fetchRandomQuestion();
  }, []); // run once on mount

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

      setAttempted((prev) => {
        const newCount = prev + 1;
        localStorage.setItem("attemptedQuestions", newCount);
        return newCount;
      });
    } catch (err) {
      if (err.response?.status === 403) {
        alert("You’ve reached your free limit. Subscribe to unlock more questions.");
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

  // Modal JSX
  const subscriptionModal = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-auto text-center">
        <h2 className="text-xl font-bold mb-4">Subscription Required</h2>
        <p className="mb-6">
          You have reached the limit of 20 free questions. To attempt more questions, please purchase a subscription plan.
        </p>
        <button
          onClick={() => setShowModal(false)}
          className="mr-4 px-4 py-2 bg-gray-300 rounded"
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
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Subscribe Now
        </button>
      </div>
    </div>
  );

  if (loading) return <p className="p-4">Loading quiz...</p>;
  if (!question && !showModal) return <p className="p-4">No questions available</p>;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Questions Attempted: {attempted}</h1>

      {showModal ? (
        subscriptionModal
      ) : (
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
              className={`block px-4 py-2 mb-2 border rounded cursor-pointer select-none ${
                selected === opt ? "bg-blue-200 border-blue-500" : "bg-white"
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
                disabled={attempted >= 20 && !isSubscribed}
              >
                Next Question
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default QuizPage;
