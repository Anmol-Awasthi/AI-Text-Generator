import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import loadingGif from "./assets/XDZT.gif";

function App() {
  const [promptInText, setPromptInText] = useState("");
  const [resultByAI, setResultByAI] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCopyDisabled, setIsCopyDisabled] = useState(true);
  const [justCopied, setJustCopied] = useState(false);
  const genAI = new GoogleGenerativeAI(
    "AIzaSyBWCcwESok5qve5cJB4ABIHNI6UG1X1QYk"
  );

  useEffect(() => {
    setIsCopyDisabled(resultByAI.trim() === "");
  }, [resultByAI]);

  async function run() {
    setLoading(true);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = promptInText;
    try {
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      setPromptInText("");
      setResultByAI(text);
    } catch (error) {
      console.error("Error generating content:", error);
      setResultByAI("An error occurred while generating content.");
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(resultByAI).then(() => {
      setJustCopied(true);
      setTimeout(() => {
        setJustCopied(false);
      }, 2000);
    });
  };

  return (
    <div className=" bg-slate-700 w-full">
      <div className="flex flex-col items-center justify-center border border-gray-500 rounded-lg mx-[20vw] mt-[10vh] ">
        <div className="flex justify-between w-full items-center px-4 py-2">
          <h1 className="text-white text-3xl font-bold">AI Text Generator</h1>
          <button
            id="copyButton"
            onClick={handleCopy}
            disabled={isCopyDisabled}
            className={`px-4 py-2 rounded-md ${
              isCopyDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : justCopied
                ? "bg-green-500"
                : "bg-blue-500"
            } text-white transition-colors duration-200`}
          >
            {justCopied ? "Copied!" : "Copy"}
          </button>
        </div>
        {loading ? (
          <div className="w-[95%] mt-8 mb-8 p-4 bg-[#1F2937] text-white border border-gray-500 rounded-lg h-[300px] flex items-center justify-center">
            <img
              src={loadingGif}
              alt="Loading"
              className="max-w-full max-h-full object-cover"
            />
          </div>
        ) : (
          <textarea
            className="w-[95%] mt-8 mb-8 p-4 bg-gray-800 text-white border border-gray-500 rounded-lg resize-none h-[300px]"
            value={resultByAI}
            readOnly
            placeholder="Generated text will appear here..."
          ></textarea>
        )}

        <div className="flex w-[95%] gap-4 mb-8 items-center justify-center">
          <input
            type="text"
            onChange={(e) => setPromptInText(e.target.value)}
            value={promptInText}
            className="w-full p-4 py-3 bg-gray-800 text-white border border-gray-500 rounded-lg"
            placeholder="Enter your prompt here..."
          />
          <button
            onClick={run}
            className="bg-blue-500 text-white px-4 py-3 rounded-md"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
