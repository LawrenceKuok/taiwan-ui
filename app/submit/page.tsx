"use client";

import { useState, useRef } from "react";
import { CATEGORIES } from "@/lib/registry";

type Status = "idle" | "submitting" | "success" | "error";

export default function SubmitPage() {
  const [name, setName] = useState("");
  const [zhName, setZhName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [useCase, setUseCase] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — hidden from real users
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [issueUrl, setIssueUrl] = useState<string | null>(null);
  const renderedAtRef = useRef<number>(Date.now());

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");
    setIssueUrl(null);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          zhName,
          category,
          description,
          useCase,
          contactEmail,
          website, // honeypot — must stay empty
          _t: renderedAtRef.current, // anti-bot timing check
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Submission failed.");
        return;
      }

      setStatus("success");
      if (data.mode === "github" && data.issueUrl) {
        setIssueUrl(data.issueUrl);
        setMessage(`已建立 GitHub issue #${data.issueNumber}。`);
      } else {
        setMessage(data.message || "Submission received. Thank you!");
      }
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Network error.");
    }
  }

  const inputCls =
    "w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-serif mb-2">提交元件提案</h1>
          <p className="text-[var(--muted)] text-sm">
            Submit a component · Propose a new Taiwan-specific component for the library.
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {/* Honeypot — invisible to real users via aria-hidden + off-screen positioning + autocomplete=off. Bots fill all visible fields and trip this. */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "-9999px",
              width: "1px",
              height: "1px",
              overflow: "hidden",
            }}
          >
            <label htmlFor="website-bot-trap">Website (do not fill)</label>
            <input
              id="website-bot-trap"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5">
                Component name <span className="text-red-400">*</span>
              </label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ROCTimePicker"
                maxLength={80}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5">中文名稱</label>
              <input
                value={zhName}
                onChange={(e) => setZhName(e.target.value)}
                placeholder="民國時間選擇器"
                maxLength={80}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputCls}
            >
              <option value="">-- Select category --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.key} value={cat.key}>
                  {cat.zhLabel} ({cat.key})
                </option>
              ))}
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={1000}
              placeholder="What does this component do? What Taiwan-specific problem does it solve?"
              className={`${inputCls} font-mono resize-none`}
            />
            <p className="text-[10px] text-[var(--muted)] mt-1">{description.length} / 1000</p>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5">Use case</label>
            <textarea
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
              rows={3}
              maxLength={1000}
              placeholder="When would someone reach for this? What existing workaround is painful?"
              className={`${inputCls} font-mono resize-none`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5">
              Contact email <span className="text-[var(--muted)] font-normal">(optional)</span>
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="you@example.com"
              maxLength={120}
              className={inputCls}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={status === "submitting" || !name || !description}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Submitting..." : "Submit proposal"}
            </button>
            {status !== "idle" && status !== "submitting" && (
              <span
                className={`text-xs ${
                  status === "success" ? "text-green-400" : "text-red-400"
                }`}
              >
                {message}
                {issueUrl && (
                  <>
                    {" "}
                    <a
                      href={issueUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      View issue →
                    </a>
                  </>
                )}
              </span>
            )}
          </div>
        </form>

        <p className="text-[10px] text-[var(--muted)] mt-8">
          Rate-limited to 2 submissions per minute per IP. Honeypot + timing checks active. No login required.
        </p>
      </div>
    </div>
  );
}
