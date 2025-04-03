"use client";

import { useState, useEffect } from "react";
import {
  Textarea,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
  DialogFooter,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui";
import { CardRisk } from "@/app/_feature";
import { Bird, Loader, Milestone, Copy } from "lucide-react";
// リスクの型定義
interface Risk {
  level: string;
  type: string;
  reason: string;
  excerpt: string;
  mode: string;
  text: string;
}

export default function PostChecker() {
  const MAX_CHARS = 140;

  // 投稿内容
  const [post, setPost] = useState("");

  // 投稿ボタンの制御
  const [isValid, setIsValid] = useState(false);

  // リスク
  const [risks, setRisks] = useState<Risk[]>([]);

  // リスクチェック
  const [checked, setChecked] = useState(false);

  // ローディング
  const [isLoading, setIsLoading] = useState(false);

  // コピー
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(post);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  // 投稿内容が140文字以内かどうかをチェック
  useEffect(() => {
    setIsValid(post.length > 0 && post.length <= MAX_CHARS);
  }, [post]);

  // リスクチェック
  const checkRisks = async () => {
    setIsLoading(true);
    setChecked(true);

    const res = await fetch("/api/check-risk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post }),
    });

    const data = await res.json();
    console.log(data);
    setRisks(data.risks || []);
    setIsLoading(false);
  };

  // リスクレベルでソート: high -> medium -> low の順
  const sortedRisks = [...risks].sort((a, b) => {
    const levelOrder = { high: 0, medium: 1, low: 2 };
    return (
      levelOrder[a.level as keyof typeof levelOrder] -
      levelOrder[b.level as keyof typeof levelOrder]
    );
  });

  const handlePostButtonClick = (post: string) => {
    const encodedText = encodeURIComponent(post);
    window.open(
      `https://twitter.com/intent/tweet?text=${encodedText}`,
      "_blank"
    );
  };

  // 高リスクがあるかどうか

  const [openDialog, setOpenDialog] = useState(false);
  const hasHighRisk = risks.some((r) => r.level === "high");

  const handlePostClick = () => {
    if (hasHighRisk) {
      setOpenDialog(true);
    } else {
      handlePostButtonClick(post);
    }
  };

  const handleConfirm = () => {
    setOpenDialog(false);
    handlePostButtonClick(post);
  };

  return (
    <div className="max-w-xl mx-auto pt-4 pb-16 space-y-4 px-4">
      <Card className="w-full shadow-none">
        <CardHeader>
          <CardTitle>
            <Bird className="h-6 w-6 text-primary mx-auto mb-2" />
            <h1 className="text-lg md:text-xl font-bold text-center">
              投稿まえにちょっとだけ考える
              <br />
              ことりすくん
            </h1>
          </CardTitle>
          <p className="text-muted-foreground text-sm md:text-center mt-2">
            その言葉、伝わってるかな？
            <br />
            ことりすくんは、投稿の前に、
            <br className="max-md:hidden" />
            ちょっとだけ立ち止まるお手伝いをしています。
          </p>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="投稿内容を入力してください"
            rows={5}
            value={post}
            onChange={(e) => setPost(e.target.value)}
          />

          <div className="flex items-center justify-end gap-2 mt-1 pr-2">
            <Popover open={copied}>
              <PopoverTrigger asChild>
                <Button
                  variant="link"
                  onClick={copyToClipboard}
                  className="p-0! cursor-pointer"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top">コピーしました</PopoverContent>
            </Popover>
            <p
              className={`text-xs ${
                post.length > MAX_CHARS ? "text-red-500" : "text-gray-500"
              }`}
            >
              {post.length}/{MAX_CHARS}
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-2">
            <div className="w-full">
              <Button
                onClick={checkRisks}
                className="cursor-pointer max-md:w-full"
                variant="default"
              >
                <Milestone className="h-4 w-4" />
                ことりすくんに聞いてみる
              </Button>
            </div>
            <div className="flex items-center gap-3 ml-auto">
              <Button
                disabled={!isValid}
                variant="default"
                className={`cursor-pointer bg-black hover:bg-black/80 ${
                  hasHighRisk ? "bg-gray-400 hover:bg-gray-400" : ""
                }`}
                onClick={handlePostClick}
              >
                Xに投稿する
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">ちょっと待って！</DialogTitle>
            <DialogDescription className="mt-2 text-sm text-black text-left md:text-center leading-relaxed">
              この投稿には
              <strong className="text-red-600">誤解されやすい</strong>
              表現が含まれているかも？
            </DialogDescription>
            <DialogDescription className="mt-2 text-xs text-muted-foreground text-left md:text-center leading-relaxed">
              ことりすくんが「ほんとに投稿して大丈夫かな...？」って羽ばたいています。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col md:flex-row gap-3 mt-3">
            <Button
              variant="secondary"
              onClick={() => setOpenDialog(false)}
              className="cursor-pointer"
            >
              やっぱやめとく
            </Button>
            <Button
              variant="default"
              onClick={handleConfirm}
              className="bg-black hover:bg-black/80 cursor-pointer"
            >
              それでも投稿する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              {sortedRisks.map((risk) => (
                <CardRisk key={risk.excerpt} risk={risk} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
