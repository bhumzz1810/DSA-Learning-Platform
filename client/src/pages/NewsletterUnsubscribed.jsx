// src/pages/NewsletterUnsubscribed.jsx
export default function NewsletterUnsubscribed() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center p-8 text-center text-white bg-black">
      <div>
        <h1 className="text-2xl font-semibold mb-2">
          You’ve been unsubscribed
        </h1>
        <p className="text-gray-300">
          Sorry to see you go. You can resubscribe anytime.
        </p>
      </div>
    </div>
  );
}
