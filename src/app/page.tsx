"use client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    hometown: "",
    job: "",
    student: "",
    worker: "",
    club: "",
  });
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setQuestion("");
    try {
      const res = await fetch("/api/generate-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setQuestion(data.question);
      } else {
        setError(data.error || "エラーが発生しました");
      }
    } catch {
      setError("ネットワークエラー");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 bg-background">
      <h1 className="text-2xl font-bold mb-6">エンタメ系ラジオ・パーソナライズ質問ボット</h1>
      <Card className="w-full max-w-2xl p-6 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input name="name" placeholder="名前" value={form.name} onChange={handleChange} required />
          <Input name="age" placeholder="年齢" value={form.age} onChange={handleChange} required />
          <Input name="hometown" placeholder="出身" value={form.hometown} onChange={handleChange} required />
          <Input name="job" placeholder="職業" value={form.job} onChange={handleChange} required />
          <Input name="club" placeholder="学生時代の部活" value={form.club} onChange={handleChange} required />
          <Textarea name="student" placeholder="学生時代の自分" value={form.student} onChange={handleChange} required />
          <Textarea name="worker" placeholder="社会人になってからの自分" value={form.worker} onChange={handleChange} required />
          <Button type="submit" className="mt-2" disabled={loading}>{loading ? "生成中..." : "パーソナライズ質問を生成"}</Button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </Card>
      {question && (
        <Card className="w-full max-w-4xl p-8 bg-secondary">
          <h2 className="text-lg font-semibold mb-2">パーソナライズ質問</h2>
          <p className="whitespace-pre-line">{question}</p>
        </Card>
      )}
    </div>
  );
}
