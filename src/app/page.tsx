"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bird, TriangleAlert, Loader, Milestone } from "lucide-react";

const MAX_CHARS = 140;
// リスクの型定義
interface Risk {
  level: string;
  type: string;
  reason: string;
  text: string;
}

export default function PostChecker() {
  const [post, setPost] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const [isReflecting, setIsReflecting] = useState(false);

  const [risks, setRisks] = useState<Risk[]>([]);
  const [checked, setChecked] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const checkRisks = async () => {
    setIsLoading(true);
    setIsReflecting(true);

    const res = await fetch("/api/check-risk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post }),
    });

    console.log(res);

    const data = await res.json();
    setRisks(data.risks || []);
    setChecked(true);
    setIsReflecting(false);
    setIsLoading(false);
  };

  const hasHighRisk = risks.some((r) => r.level === "高リスク");

  useEffect(() => {
    setCharCount(post.length);

    if (post.length > 0 && post.length <= MAX_CHARS) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [post]);

  return (
    <div className="max-w-xl mx-auto h-[100dvh] py-4 space-y-4">
      <Card className="w-full shadow-none">
        <CardHeader>
          <CardTitle>
            <Milestone className="h-6 w-6 text-primary mx-auto mb-2" />
            <h1 className="text-xl font-bold text-center">
              投稿まえにちょっとだけ考える
              <br />
              ことりすくん
            </h1>
          </CardTitle>
          <p className="text-muted-foreground text-sm text-center">
            その言葉、本当に届けたい気持ち、伝わってるかな？
            <br />
            このツールは、投稿の前にちょっとだけ立ち止まる時間をくれます。
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="投稿内容を入力してください"
            rows={5}
            value={post}
            onChange={(e) => setPost(e.target.value)}
            disabled={isReflecting}
          />
          <div className="flex justify-between items-center">
            <div>
              <Button
                onClick={checkRisks}
                className="cursor-pointer"
                variant="default"
              >
                <Bird className="h-4 w-4" />
                ことりすくんに聞いてみる
              </Button>
            </div>
            <div className="flex items-center gap-3">
              {charCount > 0 && (
                <div className="relative">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke={
                        charCount > MAX_CHARS
                          ? "#ef4444"
                          : charCount > MAX_CHARS * 0.8
                          ? "#f59e0b"
                          : "#3b82f6"
                      }
                      strokeWidth="2"
                      strokeDasharray={`${(charCount / MAX_CHARS) * 63} 63`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      transform="rotate(-90 12 12)"
                    />
                  </svg>
                  {charCount > MAX_CHARS * 0.8 && (
                    <span
                      className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold ${
                        charCount > MAX_CHARS
                          ? "text-red-500"
                          : "text-amber-500"
                      }`}
                    >
                      {MAX_CHARS - charCount}
                    </span>
                  )}
                </div>
              )}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  post
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  disabled={!isValid || hasHighRisk}
                  variant="default"
                  className="cursor-pointer bg-black hover:bg-black/80"
                >
                  Xに投稿する
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {checked && (
        <>
          {isLoading ? (
            <div className="flex flex-col gap-2 justify-center items-center">
              <p className="text-muted-foreground text-sm text-center">
                ことりすくんが考えています...
              </p>
              <Loader className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {risks.length === 0 ? (
                <Alert>
                  <AlertTitle>
                    ことりすくんは、特に気になるところは見つけられませんでした。
                  </AlertTitle>
                  <AlertDescription>
                    この投稿、今のところ大丈夫そうです。
                    <br />
                    ただ、もしちょっと迷っている気持ちがあるなら、その感覚も大切にしてあげてくださいね。
                  </AlertDescription>
                </Alert>
              ) : (
                risks.map((r, i) => (
                  <Alert key={i}>
                    <AlertDescription>
                      <TriangleAlert className="h-4 w-4 mx-auto" color="red" />
                      <p className="text-center mx-auto text-red-600">
                        「<strong>{r.text}</strong>」という表現は、
                        <br />
                        <span className="font-semibold">
                          ちょっと誤解されやすい表現かも？
                        </span>
                      </p>
                    </AlertDescription>
                    <AlertDescription className="text-black mt-2">
                      {r.reason}
                    </AlertDescription>
                  </Alert>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
