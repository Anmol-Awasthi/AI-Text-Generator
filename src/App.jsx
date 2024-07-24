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
    <div className="bg-slate-700 w-full min-h-screen flex justify-center items-center p-4">
      <div className="flex flex-col items-center justify-center border border-gray-500 rounded-lg w-full max-w-3xl shadow-lg bg-slate-800">
        <div className="flex flex-row justify-between items-center w-full px-4 py-2">
          <h1 className="text-white text-xl md:text-2xl font-bold mb-2 md:mb-0">
            AI Text Generator
          </h1>
          <button
            id="copyButton"
            onClick={handleCopy}
            disabled={isCopyDisabled}
            className={`px-4 py-2 rounded-md transition-colors duration-200 ${
              isCopyDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : justCopied
                ? "bg-green-500"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {justCopied ? "Copied!" : "Copy"}
          </button>
        </div>
        {loading ? (
          <div className="w-[95%] mt-4 md:mt-8 mb-8 p-4 bg-[#1F2937] text-white border border-gray-500 rounded-lg h-[200px] md:h-[300px] flex items-center justify-center">
            <img
              src={loadingGif}
              alt="Loading"
              className="max-w-full max-h-full object-cover"
            />
          </div>
        ) : (
          <textarea
            className="w-[95%] mt-4 md:mt-8 mb-8 p-4 bg-gray-800 text-white border border-gray-500 rounded-lg resize-none h-[200px] md:h-[300px] transition-all duration-300 ease-in-out"
            value={resultByAI}
            readOnly
            placeholder="Generated text will appear here..."
          ></textarea>
        )}

        <div className="flex flex-col md:flex-row w-full md:w-[95%] gap-4 mb-8 items-center justify-center">
          <input
            type="text"
            onChange={(e) => setPromptInText(e.target.value)}
            value={promptInText}
            className="w-[95%] md:w-full p-4 py-3 bg-gray-800 text-white border border-gray-500 rounded-lg transition-all duration-300 ease-in-out"
            placeholder="Enter your prompt here..."
          />
          <button
            onClick={run}
            className="w-[50%] md:w-auto bg-blue-500 text-white px-4 py-3 rounded-md mt-2 md:mt-0 hover:bg-blue-600 transition-all duration-300 ease-in-out"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
