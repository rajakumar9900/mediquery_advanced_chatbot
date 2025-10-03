import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Braille conversion mapping
const brailleMap: { [key: string]: string } = {
  a: "⠁",
  b: "⠃",
  c: "⠉",
  d: "⠙",
  e: "⠑",
  f: "⠋",
  g: "⠛",
  h: "⠓",
  i: "⠊",
  j: "⠚",
  k: "⠅",
  l: "⠇",
  m: "⠍",
  n: "⠝",
  o: "⠕",
  p: "⠏",
  q: "⠟",
  r: "⠗",
  s: "⠎",
  t: "⠞",
  u: "⠥",
  v: "⠧",
  w: "⠺",
  x: "⠭",
  y: "⠽",
  z: "⠵",
  A: "⠁",
  B: "⠃",
  C: "⠉",
  D: "⠙",
  E: "⠑",
  F: "⠋",
  G: "⠛",
  H: "⠓",
  I: "⠊",
  J: "⠚",
  K: "⠅",
  L: "⠇",
  M: "⠍",
  N: "⠝",
  O: "⠕",
  P: "⠏",
  Q: "⠟",
  R: "⠗",
  S: "⠎",
  T: "⠞",
  U: "⠥",
  V: "⠧",
  W: "⠺",
  X: "⠭",
  Y: "⠽",
  Z: "⠵",
  "0": "⠚",
  "1": "⠁",
  "2": "⠃",
  "3": "⠉",
  "4": "⠙",
  "5": "⠑",
  "6": "⠋",
  "7": "⠛",
  "8": "⠓",
  "9": "⠊",
  " ": "⠀",
  ".": "⠲",
  ",": "⠂",
  "?": "⠦",
  "!": "⠖",
  ":": "⠒",
  ";": "⠆",
  "-": "⠤",
  "(": "⠶",
  ")": "⠶",
  '"': "⠦",
  "'": "⠄",
  "&": "⠯",
  "=": "⠿",
  "+": "⠬",
  "*": "⠡",
  "%": "⠩",
  $: "⠈",
  "@": "⠈",
  "#": "⠼",
  "^": "⠘",
  "~": "⠸",
  "`": "⠠",
  "|": "⠸",
  "\\": "⠳",
  "/": "⠌",
  "<": "⠣",
  ">": "⠜",
  "{": "⠷",
  "}": "⠾",
  "[": "⠪",
  "]": "⠻",
  _: "⠸",
};

export default function Chat() {
  const [inputText, setInputText] = useState("");
  const [brailleText, setBrailleText] = useState("");
  const navigate = useNavigate();

  const convertToBraille = () => {
    let converted = "";
    for (let i = 0; i < inputText.length; i++) {
      const char = inputText[i];
      if (brailleMap[char]) {
        converted += brailleMap[char];
      } else {
        // For unknown characters, keep them as is
        converted += char;
      }
    }
    setBrailleText(converted);
  };

  const clearText = () => {
    setInputText("");
    setBrailleText("");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(brailleText);
      alert("Braille text copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy text: ", err);
      alert("Failed to copy text to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Text to Braille Converter
            </h1>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
          <p className="text-gray-600">
            Convert your text into Braille characters for accessibility
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-black rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Enter Text
              </h2>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your text here..."
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={convertToBraille}
                  disabled={!inputText.trim()}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Convert to Braille
                </button>
                <button
                  onClick={clearText}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Character Count */}
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Characters:</span>{" "}
                {inputText.length}
              </p>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Braille Output
                </h2>
                {brailleText && (
                  <button
                    onClick={copyToClipboard}
                    className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Copy
                  </button>
                )}
              </div>
              <div className="min-h-64 p-4 border border-gray-300 rounded-lg bg-gray-50">
                {brailleText ? (
                  <div className="text-2xl leading-relaxed font-mono text-gray-800 break-all">
                    {brailleText}
                  </div>
                ) : (
                  <div className="text-gray-500 italic text-center py-8">
                    Converted Braille text will appear here...
                  </div>
                )}
              </div>
            </div>

            {/* Braille Info */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 mb-2">
                About Braille
              </h3>
              <p className="text-sm text-yellow-700">
                Braille is a tactile writing system used by people who are
                visually impaired. Each character is represented by a pattern of
                raised dots.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
