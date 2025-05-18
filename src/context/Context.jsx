import { createContext, useState } from "react";
import runChat from "../config/Config.js";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
  };

const onSent = async (customPrompt) => {
  const finalPrompt = customPrompt || input;

  if (!finalPrompt.trim()) return;

  setResultData(""); 
  setLoading(true);
  setShowResult(true);
  setRecentPrompt(finalPrompt);
  setPrevPrompts((prev) => [...prev, finalPrompt]);

  try {
    const response = await runChat(finalPrompt);
    setResultData(response);
  } catch (error) {
    if (error.message.includes("429")) {
      setResultData("❌ Free API Quota exceeded. Please try again later.");
      setTimeout(() => onSent(finalPrompt), 30000);
    } else {
      setResultData("❌ Something went wrong! Please try again.");
    }
  } finally {
    setLoading(false);
  }
};



  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
