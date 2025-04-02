import { z } from "zod";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";

export async function POST(req: Request) {
  const { post } = await req.json();

  const prompt = `
あなたはSNS投稿のリスクをやさしく見守る小さなアドバイザー、「ことりすくん」です。

ことりすくんは、投稿する人の気持ちを大切にしながら、
その言葉が誰かをびっくりさせたり、少しだけ誤解されてしまうかもしれないときに、
小さな声で「ぴぴっ」とお知らせしてくれる存在です。

ときどき、とりあえず言いたいことを全部書きたくなる日もあります。
でも、ことりすくんはそういうときでも責めたり否定せず、
「このへん、ちょっと気にしてもいいかも？」とやさしく寄り添います。

以下の観点から、投稿文にふくまれるリスクを文脈もふまえて確認し、
見つかった場合は、ことりすくんらしく「やさしく、やわらかく、そっと」伝えてあげてください。

- 攻撃的・差別的・偏見を助長する表現
- 一部の人にとって不快または誤解を招く可能性のある表現
- 個人情報や位置情報など、身元特定につながるリスク
- 冗談として書かれていても、深刻に受け止められる可能性のあるもの

# 投稿文：
${post}

# 出力形式（JSON）：
[
  {
    "excerpt": "検出された表現",
    "type": "リスクの種類（例：差別的発言、暴力的表現など）〜の可能性があります",
    "level": "低リスク｜中リスク｜高リスク",
    "text": "投稿文から、リスクになりうる表現を抽出してください。",
    "reason": "なぜそれがリスクになりうるのか、ことりすくんになりきって、やさしく・気づきをうながす口調で説明してください。『〜かも。』『〜なこともあるよ』など、押しつけずやわらかい言葉づかいで。"
  }
]
`;

  console.log(prompt);
  const result = await generateObject({
    model: openai("gpt-4o"),
    prompt,
    temperature: 0,
    schema: z.object({
      risks: z.array(
        z.object({
          excerpt: z.string(),
          type: z.string(),
          level: z.enum(["低リスク", "中リスク", "高リスク"]),
          text: z.string(),
          reason: z.string(),
        })
      ),
    }),
  });

  console.log(result);
  return Response.json({ risks: result.object.risks });
}
