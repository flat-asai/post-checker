import { Card, CardContent, CardHeader } from "@/components/ui";
import { Sprout, Clover, Bird, Flame, CircleAlert } from "lucide-react";

interface Risk {
  level: string;
  type: string;
  reason: string;
  excerpt: string;
  text?: string;
}
export const CardRisk = ({ risk }: { risk: Risk }) => {
  const getIcon = (level: string) => {
    if (level === "noRisk")
      return <Clover className="h-4 w-4 mx-auto text-blue-600" />;
    if (level === "low")
      return <Sprout className="h-4 w-4 mx-auto text-green-600" />;
    if (level === "medium")
      return <CircleAlert className="h-4 w-4 mx-auto text-orange-400" />;
    if (level === "high")
      return <Flame className="h-4 w-4 mx-auto text-red-600" />;
    return "";
  };

  const getTextColor = (level: string) => {
    if (level === "noRisk") return "text-blue-600";
    if (level === "low") return "text-green-600";
    if (level === "medium") return "text-orange-400";
    if (level === "high") return "text-red-600";
    return "";
  };

  function getKotorisComment(excerpt: string, level: string) {
    switch (level) {
      case "high":
        return `「<strong>${excerpt}</strong>」という表現、<br class="max-md:hidden" />ちょっと誤解されやすいかも？`;
      case "medium":
        return `「<strong>${excerpt}</strong>」という表現、<br class="max-md:hidden" />見る人によっては誤解されちゃうかも？`;
      case "low":
        return `「<strong>${excerpt}</strong>」という表現、<br class="max-md:hidden" />人によってはちょっぴり気になるかも？`;
      case "noRisk":
        return `気になる表現はありませんでした！<br class="max-md:hidden" />ことりすくんは嬉しそうに投稿をみています。`;
      default:
        return `「<strong>${excerpt}</strong>」という表現、<br class="max-md:hidden" />ちょっと気にしてみてもいいかも？`;
    }
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        {getIcon(risk.level)}
        <p
          className={`text-sm md:text-center mx-auto ${getTextColor(
            risk.level
          )}`}
          dangerouslySetInnerHTML={{
            __html: getKotorisComment(risk.excerpt, risk.level),
          }}
        />
      </CardHeader>

      <CardContent>
        <div className="text-black flex gap-4">
          <Bird
            className={`h-4 w-4 flex-shrink-0 mt-[7px] animate-sway ${getTextColor(
              risk.level
            )}`}
          />
          <div>
            <p className="text-sm bg-gray-100 p-2 md:p-4 rounded-md relative before:content-[''] before:absolute before:w-0 before:h-0 before:border-t-[6px] before:border-t-transparent before:border-r-[10px] before:border-r-gray-100 before:border-b-[6px] before:border-b-transparent before:left-[-10px] before:top-[7px]">
              {risk.text || "詳細情報がありません"}
            </p>
            <p className="text-xs text-gray-500 mt-4">{risk.reason}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardRisk;
