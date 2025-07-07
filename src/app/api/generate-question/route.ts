import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const { name, age, hometown, job, student, worker, club } = await req.json();
  const prompt = `あなたはエンタメ系ラジオ番組のパーソナライズ質問作成AIです。以下の情報をもとに、ラジオで盛り上がるような端的で深掘りな質問を日本語で10個、箇条書きで生成してください。質問に名前は含めず、短く簡潔にしてください。\n\n年齢: ${age}\n出身: ${hometown}\n職業: ${job}\n学生時代の部活: ${club}\n学生時代の自分: ${student}\n社会人になってからの自分: ${worker}\n\n出力形式:\n• 質問1\n• 質問2\n• 質問3`;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENAI_API_KEY is not set" }, { status: 500 });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "あなたはエンタメ系ラジオ番組のパーソナライズ質問作成AIです。必ず箇条書きで複数の質問を生成してください。" },
        { role: "user", content: prompt },
      ],
      max_tokens: 500,
      temperature: 1.0,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "OpenAI API error" }, { status: 500 });
  }

  const data = await response.json();
  const question = data.choices?.[0]?.message?.content?.trim() || "質問生成に失敗しました";
  return NextResponse.json({ question });
} 