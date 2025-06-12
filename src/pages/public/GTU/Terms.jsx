import ReactMarkdown from "react-markdown";
import termsContent from "../../../assets/markdown/terms.md?raw";
import "github-markdown-css";

export default function Terms() {
  return (
    <div className="markdown-body">
      <ReactMarkdown>{termsContent}</ReactMarkdown>
    </div>
  );
}
