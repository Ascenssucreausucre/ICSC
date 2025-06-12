import ReactMarkdown from "react-markdown";
import termsContent from "../../../assets/markdown/cookies.md?raw";
import "github-markdown-css";

export default function Cookies() {
  return (
    <div className="markdown-body">
      <ReactMarkdown>{termsContent}</ReactMarkdown>
    </div>
  );
}
