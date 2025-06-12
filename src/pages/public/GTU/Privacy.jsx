import ReactMarkdown from "react-markdown";
import termsContent from "../../../assets/markdown/privacy.md?raw";
import "github-markdown-css";

export default function Privacy() {
  return (
    <div className="markdown-body">
      <ReactMarkdown>{termsContent}</ReactMarkdown>
    </div>
  );
}
