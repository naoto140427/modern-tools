"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Code2,
  ChevronLeft,
  FileJson,
  Binary,
  KeyRound,
  Copy,
  Check,
  RefreshCw
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { GlassTabs } from "@/components/shared/GlassTabs";
import { toast } from "sonner";

export default function DevLabPage() {
  const t = useTranslations("DevLab");
  const [activeTab, setActiveTab] = useState("json");
  const [inputText, setInputText] = useState("");
  const [outputResult, setOutputResult] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Password State
  const [passwordLength, setPasswordLength] = useState(16);

  // --- Actions ---
  const handleJsonAction = (action: "format" | "minify") => {
    try {
        const obj = JSON.parse(inputText);
        if (action === "format") {
            setOutputResult(JSON.stringify(obj, null, 2));
        } else {
            setOutputResult(JSON.stringify(obj));
        }
        setErrorMsg(null);
        toast.success(t('json.valid'));
    } catch (e) {
        setErrorMsg(t('json.invalid'));
        setOutputResult("");
        toast.error(t('json.invalid'));
    }
  };

  const handleBase64Action = (action: "encode" | "decode") => {
      try {
          if (action === "encode") {
              setOutputResult(btoa(unescape(encodeURIComponent(inputText))));
          } else {
              setOutputResult(decodeURIComponent(escape(atob(inputText))));
          }
          setErrorMsg(null);
      } catch (e) {
          setErrorMsg("Invalid Input");
          setOutputResult("");
      }
  };

  const generatePassword = () => {
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
      let retVal = "";
      const values = new Uint32Array(passwordLength);
      crypto.getRandomValues(values);
      for (let i = 0; i < passwordLength; i++) {
          retVal += charset[values[i] % charset.length];
      }
      setOutputResult(retVal);
      setInputText(""); // Clear input for password mode logic consistency if needed, though split view might handle differently
  };

  const copyToClipboard = () => {
      if (!outputResult) return;
      navigator.clipboard.writeText(outputResult);
      toast.success("Copied to clipboard");
  };

  const tabs = [
    { id: "json", label: t('tabs.json'), icon: <FileJson className="w-4 h-4" /> },
    { id: "base64", label: t('tabs.base64'), icon: <Binary className="w-4 h-4" /> },
    { id: "password", label: t('tabs.password'), icon: <KeyRound className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col pt-24 pb-12 px-4 sm:px-8">
      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-6xl mx-auto mb-8"
      >
         <Link href="/" className="inline-flex items-center text-sm text-neutral-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Dashboard
         </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl mx-auto space-y-8"
      >
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl font-semibold tracking-tight text-white flex items-center justify-center gap-3">
            <Code2 className="w-8 h-8 text-emerald-400" />
            {t('title')}
          </h1>
          <p className="text-lg text-neutral-400 font-light">
            {t('description')}
          </p>
        </div>

        <div className="flex justify-center mb-8">
            <GlassTabs tabs={tabs} activeTab={activeTab} onChange={(id) => { setActiveTab(id); setInputText(""); setOutputResult(""); setErrorMsg(null); }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Input / Control Area */}
            <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/10 rounded-3xl h-[500px] flex flex-col relative overflow-hidden">
                {activeTab === "password" ? (
                    <div className="flex flex-col justify-center items-center h-full space-y-12">
                         <div className="w-full max-w-sm space-y-6">
                             <div className="flex justify-between items-center text-white">
                                 <Label>{t('password.length')}</Label>
                                 <span className="font-mono text-emerald-400 text-xl">{passwordLength}</span>
                             </div>
                             <Slider
                                value={[passwordLength]}
                                onValueChange={(vals) => setPasswordLength(vals[0])}
                                min={8}
                                max={64}
                                step={1}
                                className="cursor-pointer"
                             />
                         </div>
                         <Button
                            onClick={generatePassword}
                            className="w-full max-w-sm h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-900/20 text-base font-semibold"
                         >
                            <RefreshCw className="w-5 h-5 mr-2" />
                            {t('password.generate')}
                         </Button>
                    </div>
                ) : (
                    <>
                        <Label className="text-white mb-3 pl-1">Input</Label>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-neutral-600 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono text-sm"
                            placeholder="Paste your code or text here..."
                        />
                        <div className="mt-4 flex gap-3">
                            {activeTab === "json" && (
                                <>
                                    <Button variant="secondary" onClick={() => handleJsonAction("format")} className="flex-1">
                                        {t('json.format')}
                                    </Button>
                                    <Button variant="outline" onClick={() => handleJsonAction("minify")} className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10">
                                        {t('json.minify')}
                                    </Button>
                                </>
                            )}
                            {activeTab === "base64" && (
                                <>
                                    <Button variant="secondary" onClick={() => handleBase64Action("encode")} className="flex-1">
                                        {t('base64.encode')}
                                    </Button>
                                    <Button variant="outline" onClick={() => handleBase64Action("decode")} className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10">
                                        {t('base64.decode')}
                                    </Button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </Card>

            {/* Output Area */}
            <Card className="p-6 bg-black/40 backdrop-blur-xl border-white/10 rounded-3xl h-[500px] flex flex-col relative">
                <div className="flex justify-between items-center mb-3 pl-1">
                     <Label className="text-white">Output</Label>
                     {outputResult && (
                         <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-emerald-400 hover:text-emerald-300 h-8">
                             <Copy className="w-4 h-4 mr-2" />
                             Copy
                         </Button>
                     )}
                </div>

                <div className="flex-1 bg-black/50 border border-white/5 rounded-xl p-4 relative overflow-auto">
                    {errorMsg ? (
                        <div className="text-red-400 font-mono text-sm">{errorMsg}</div>
                    ) : (
                        <pre className="text-white font-mono text-sm whitespace-pre-wrap break-all">
                            {outputResult || <span className="text-neutral-600 italic">Result will appear here...</span>}
                        </pre>
                    )}
                </div>
            </Card>
        </div>
      </motion.div>
    </div>
  );
}
