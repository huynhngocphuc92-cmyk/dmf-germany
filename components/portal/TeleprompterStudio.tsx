"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Video,
  VideoOff,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  Loader2,
  CheckCircle2,
  Eye,
  CircleDot,
  Square,
  Download,
  UploadCloud,
  Mic,
  MicOff,
  Award,
} from "lucide-react";
import type { InterviewQAItem } from "@/lib/portal/types";

// Minimal browser SpeechRecognition interface for TypeScript
interface BrowserSpeechRecognitionEvent {
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      0: { transcript: string };
    };
  };
}

interface BrowserSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface TeleprompterStudioProps {
  scriptDe: string;
  onScriptChange: (val: string) => void;
  videoUrl: string;
  onVideoUrlChange: (val: string) => void;
  qaList: InterviewQAItem[];
  aiEnabled: boolean;
  isGeneratingAi: boolean;
  onGenerateAiKit: () => void;
  onSave: () => void;
  isSaving: boolean;
  onUploadRecordedVideo?: (videoBlob: Blob) => Promise<void>;
  onEvaluateAnswer?: (questionId: string, studentAnswerDe: string) => Promise<void>;
}

export function TeleprompterStudio({
  scriptDe,
  onScriptChange,
  videoUrl,
  onVideoUrlChange,
  qaList,
  aiEnabled,
  isGeneratingAi,
  onGenerateAiKit,
  onSave,
  isSaving,
  onUploadRecordedVideo,
  onEvaluateAnswer,
}: TeleprompterStudioProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  // Camera & Teleprompter states
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isPromptScrolling, setIsPromptScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState<number>(1);
  const [fontSize, setFontSize] = useState<number>(20);

  // WebRTC Recording states
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedPreviewUrl, setRecordedPreviewUrl] = useState<string | null>(null);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  // Voice Interview Q&A states
  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>(() =>
    Object.fromEntries(qaList.map((q) => [q.id, q.studentAnswerDe || ""]))
  );
  const [listeningQuestionId, setListeningQuestionId] = useState<string | null>(null);
  const [evaluatingQuestionId, setEvaluatingQuestionId] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  // Sync draftAnswers when qaList updates
  useEffect(() => {
    setDraftAnswers((prev) => {
      const next = { ...prev };
      for (const q of qaList) {
        if (next[q.id] === undefined && q.studentAnswerDe) {
          next[q.id] = q.studentAnswerDe;
        }
      }
      return next;
    });
  }, [qaList]);

  // Teleprompter auto-scroll loop
  useEffect(() => {
    if (!isPromptScrolling) return;
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop += scrollSpeed;
      }
    }, 50);
    return () => clearInterval(interval);
  }, [isPromptScrolling, scrollSpeed]);

  // Recording timer loop
  useEffect(() => {
    if (!isRecording) return;
    const timer = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  // Cleanup camera and speech recognition on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const formatTimer = (sec: number) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const toggleCamera = async () => {
    if (cameraActive) {
      if (isRecording) {
        stopRecording();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setCameraActive(false);
      return;
    }

    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch {
      // Fallback to video-only if mic permission denied
      try {
        const videoOnlyStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
        streamRef.current = videoOnlyStream;
        if (videoRef.current) {
          videoRef.current.srcObject = videoOnlyStream;
        }
        setCameraActive(true);
      } catch {
        setCameraError(
          "Không thể mở Camera/Micro. Vui lòng cấp quyền truy cập Camera & Micro trên trình duyệt."
        );
      }
    }
  };

  const startRecordingWithCountdown = async () => {
    if (!cameraActive || !streamRef.current) {
      await toggleCamera();
    }
    if (!streamRef.current) return;

    setRecordedBlob(null);
    if (recordedPreviewUrl) {
      URL.revokeObjectURL(recordedPreviewUrl);
      setRecordedPreviewUrl(null);
    }

    // 3-2-1 Countdown
    for (const c of [3, 2, 1]) {
      setCountdown(c);
      await new Promise((r) => setTimeout(r, 900));
    }
    setCountdown(null);

    try {
      recordedChunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
        ? "video/webm;codecs=vp9,opus"
        : MediaRecorder.isTypeSupported("video/webm")
          ? "video/webm"
          : "";

      const recorder = mimeType
        ? new MediaRecorder(streamRef.current, { mimeType })
        : new MediaRecorder(streamRef.current);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: recorder.mimeType || "video/webm",
        });
        setRecordedBlob(blob);
        setRecordedPreviewUrl(URL.createObjectURL(blob));
      };

      mediaRecorderRef.current = recorder;
      recorder.start(500);
      setRecordingSeconds(0);
      setIsRecording(true);

      // Auto-reset & start Teleprompter scrolling!
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
      setIsPromptScrolling(true);
    } catch {
      setCameraError("Trình duyệt hiện tại không hỗ trợ ghi hình trực tiếp (MediaRecorder).");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setIsPromptScrolling(false);
  };

  const handleUploadRecordedBlob = async () => {
    if (!recordedBlob || !onUploadRecordedVideo) return;
    setIsUploadingVideo(true);
    try {
      await onUploadRecordedVideo(recordedBlob);
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const resetPrompter = () => {
    setIsPromptScrolling(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  };

  const speakGermanText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\[Pause\]/gi, " ... ");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "de-DE";
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  };

  const toggleGermanSpeechRecognition = (questionId: string) => {
    setSpeechError(null);
    if (listeningQuestionId === questionId) {
      recognitionRef.current?.stop();
      setListeningQuestionId(null);
      return;
    }

    if (listeningQuestionId && recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const win = window as unknown as {
      SpeechRecognition?: new () => BrowserSpeechRecognition;
      webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
    };
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRec) {
      setSpeechError(
        "Trình duyệt này không hỗ trợ nhận diện giọng nói trực tiếp. Vui lòng dùng Chrome/Edge hoặc gõ câu trả lời tiếng Đức vào ô bên dưới để AI chấm điểm."
      );
      return;
    }

    const recognition = new SpeechRec();
    recognition.lang = "de-DE";
    recognition.continuous = true;
    recognition.interimResults = true;

    const initialText = draftAnswers[questionId] ? draftAnswers[questionId] + " " : "";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setDraftAnswers((prev) => ({
        ...prev,
        [questionId]: (initialText + transcript).trimStart(),
      }));
    };

    recognition.onerror = () => {
      setListeningQuestionId(null);
    };

    recognition.onend = () => {
      setListeningQuestionId(null);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListeningQuestionId(questionId);
  };

  const handleEvaluateClick = async (questionId: string) => {
    if (!onEvaluateAnswer) return;
    setEvaluatingQuestionId(questionId);
    try {
      await onEvaluateAnswer(questionId, draftAnswers[questionId] || "");
    } finally {
      setEvaluatingQuestionId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
              WebRTC Video Studio &amp; AI Voice Vorstellungsgespräch
            </Badge>
          </div>
          <h2 className="text-xl font-bold">
            Phòng Quay Video Giới Thiệu (Selbstvorstellung) &amp; Luyện Phỏng Vấn Giọng Nói AI
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl">
            1. Bấm <strong>Quay Video 60–90s</strong> để ghi hình trực tiếp khi chữ Teleprompter
            chạy ngang tầm mắt camera. <br />
            2. Bấm <strong>Mic trả lời bằng tiếng Đức</strong> ở phần câu hỏi bên dưới để Giám khảo
            AI chấm điểm Ngữ pháp B1/B2, Nội dung &amp; Văn hoá ứng xử Đức (Siezen).
          </p>
        </div>

        <Button
          type="button"
          onClick={onGenerateAiKit}
          disabled={isGeneratingAi}
          className="bg-emerald-500 hover:bg-emerald-600 text-white shrink-0"
        >
          {isGeneratingAi ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang soạn kịch bản...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              {aiEnabled
                ? "AI Soạn Kịch bản 60s & Câu hỏi theo ngành"
                : "Mở khoá AI Soạn Kịch bản & Phỏng vấn"}
            </>
          )}
        </Button>
      </div>

      {/* Teleprompter & WebRTC Video Recorder Studio */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left: Teleprompter + Camera Mirror + WebRTC Recorder */}
        <div className="lg:col-span-7 bg-slate-950 text-white rounded-2xl overflow-hidden border border-slate-800 shadow-lg flex flex-col">
          {/* Top Teleprompter Bar */}
          <div className="bg-slate-900/95 border-b border-emerald-500/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <Eye className="w-4 h-4" />
                TELEPROMPTER NGANG TẦM CAMERA (Nhìn vào đây khi quay)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="h-7 text-xs"
                  onClick={() => setIsPromptScrolling(!isPromptScrolling)}
                >
                  {isPromptScrolling ? (
                    <>
                      <Pause className="w-3.5 h-3.5 mr-1" /> Tạm dừng
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 mr-1" /> Chạy chữ
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-slate-300 hover:text-white"
                  onClick={resetPrompter}
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" /> Về đầu
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 text-xs text-emerald-300 hover:text-emerald-200"
                  onClick={() => speakGermanText(scriptDe)}
                  title="Nghe phát âm mẫu tiếng Đức"
                >
                  <Volume2 className="w-3.5 h-3.5 mr-1" /> Nghe mẫu
                </Button>
              </div>
            </div>

            {/* Scrolling Script Box */}
            <div
              ref={scrollContainerRef}
              style={{ fontSize: `${fontSize}px` }}
              className="h-44 overflow-y-auto rounded-xl bg-black/70 p-4 leading-relaxed font-medium text-amber-100 border border-slate-800 scroll-smooth"
            >
              {scriptDe ? (
                scriptDe.split("\n").map((line, i) => (
                  <p key={i} className="mb-3">
                    {line.split(/(\[Pause\])/gi).map((part, j) =>
                      part.toLowerCase() === "[pause]" ? (
                        <span
                          key={j}
                          className="inline-block mx-1.5 px-2 py-0.5 text-xs rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 align-middle"
                        >
                          ⏱ Nghỉ lấy hơi
                        </span>
                      ) : (
                        <span key={j}>{part}</span>
                      )
                    )}
                  </p>
                ))
              ) : (
                <p className="text-sm text-slate-400">
                  Chưa có kịch bản. Bấm nút &ldquo;AI Soạn Kịch bản 60s&rdquo; hoặc tự nhập kịch bản
                  ở cột bên phải.
                </p>
              )}
            </div>

            {/* Speed & Font Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-3 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span>Tốc độ chạy:</span>
                {[0.6, 1, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setScrollSpeed(spd)}
                    className={`px-2 py-0.5 rounded ${
                      scrollSpeed === spd
                        ? "bg-emerald-600 text-white font-semibold"
                        : "bg-slate-800 hover:bg-slate-700"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span>Cỡ chữ:</span>
                {[16, 20, 24].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setFontSize(sz)}
                    className={`px-2 py-0.5 rounded ${
                      fontSize === sz
                        ? "bg-emerald-600 text-white font-semibold"
                        : "bg-slate-800 hover:bg-slate-700"
                    }`}
                  >
                    {sz}px
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Camera Framing Mirror & Live WebRTC Recorder */}
          <div className="relative aspect-video bg-slate-900 flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover scale-x-[-1] ${
                cameraActive ? "block" : "hidden"
              }`}
            />

            {/* 3-2-1 Countdown Overlay */}
            {countdown !== null && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-20">
                <span className="text-7xl font-extrabold text-emerald-400 animate-ping">
                  {countdown}
                </span>
                <p className="text-sm text-white mt-4 font-semibold">
                  Chuẩn bị mỉm cười &amp; nhìn thẳng vào ống kính...
                </p>
              </div>
            )}

            {/* Live Recording Status Indicator */}
            {isRecording && (
              <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                REC {formatTimer(recordingSeconds)} / 01:30
              </div>
            )}

            {/* Framing Guide Overlay */}
            {cameraActive && !countdown && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-44 h-56 rounded-full border-2 border-dashed border-emerald-400/50 mb-6" />
                <span className="text-[11px] bg-black/60 text-emerald-300 px-3 py-1 rounded-full">
                  Khung căn chỉnh chuẩn Đức (Vai thẳng, mắt nhìn thẳng camera)
                </span>
              </div>
            )}

            {!cameraActive && (
              <div className="text-center p-6 space-y-3">
                <Video className="w-10 h-10 text-slate-500 mx-auto" />
                <p className="text-sm text-slate-300 font-medium">
                  Phòng Ghi Hình Trực Tiếp (WebRTC Video &amp; Audio Recorder)
                </p>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Bật Camera &amp; Micro để quay trực tiếp video giới thiệu 60–90 giây đồng bộ với
                  chữ chạy trên Teleprompter.
                </p>
                <Button type="button" variant="secondary" size="sm" onClick={toggleCamera}>
                  <Video className="w-4 h-4 mr-2" />
                  Bật Camera &amp; Micro
                </Button>
                {cameraError && <p className="text-xs text-amber-400 mt-2">{cameraError}</p>}
              </div>
            )}

            {/* Recording Control Bar at Bottom of Video */}
            {cameraActive && (
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 z-10">
                {!isRecording ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={startRecordingWithCountdown}
                    disabled={countdown !== null}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg"
                  >
                    <CircleDot className="w-4 h-4 mr-1.5" />
                    Bắt đầu Quay Video (3-2-1)
                  </Button>
                ) : (
                  <Button
                    type="button"
                    size="sm"
                    onClick={stopRecording}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-lg"
                  >
                    <Square className="w-4 h-4 mr-1.5 fill-current" />
                    Dừng Quay ({formatTimer(recordingSeconds)})
                  </Button>
                )}

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={toggleCamera}
                  className="bg-slate-900/80 hover:bg-slate-800 text-slate-200"
                >
                  <VideoOff className="w-4 h-4 mr-1.5" />
                  Tắt Camera
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Recorded Video Playback + Script Editor + Link Submission */}
        <div className="lg:col-span-5 space-y-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          {/* Recorded Video Playback Box (Appears immediately after recording!) */}
          {recordedPreviewUrl && (
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900">
                  🎬 Bản quay vừa thực hiện ({formatTimer(recordingSeconds)})
                </span>
                <Badge className="bg-emerald-600 text-white text-[10px]">Sẵn sàng tải lên</Badge>
              </div>
              <video
                src={recordedPreviewUrl}
                controls
                className="w-full aspect-video rounded-lg bg-black"
              />
              <div className="grid sm:grid-cols-2 gap-2">
                <a
                  href={recordedPreviewUrl}
                  download={`DMF-Selbstvorstellung-${Date.now()}.webm`}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-800"
                >
                  <Download className="w-3.5 h-3.5" />
                  Tải Video về máy
                </a>
                {onUploadRecordedVideo && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleUploadRecordedBlob}
                    disabled={isUploadingVideo}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                  >
                    {isUploadingVideo ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        Đang tải lên...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
                        Gắn trực tiếp vào Hồ sơ
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900 block">
              1. Kịch bản tự giới thiệu (Selbstvorstellungstext – 60 đến 90 giây)
            </label>
            <p className="text-xs text-slate-500">
              Dùng ký hiệu <code className="bg-slate-100 px-1 rounded">[Pause]</code> ở những chỗ
              cần nghỉ lấy hơi. Khi bấm <strong>Bắt đầu Quay Video</strong>, kịch bản này sẽ tự động
              cuộn trên Teleprompter.
            </p>
            <Textarea
              rows={8}
              value={scriptDe}
              onChange={(e) => onScriptChange(e.target.value)}
              placeholder="Guten Tag, mein Name ist..."
              className="text-sm font-mono leading-relaxed"
            />
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-sm font-bold text-slate-900 block">
              2. Đường dẫn Video giới thiệu chính thức (YouTube Unlisted / Storage URL)
            </label>
            <p className="text-xs text-slate-500">
              Tự động điền khi bạn bấm &ldquo;Gắn trực tiếp vào Hồ sơ&rdquo; hoặc dán link YouTube
              Unlisted vào đây.
            </p>
            <Input
              type="url"
              value={videoUrl}
              onChange={(e) => onVideoUrlChange(e.target.value)}
              placeholder="https://youtu.be/... hoặc link Storage"
            />
          </div>

          <Button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Lưu Kịch bản &amp; Link Video Giới Thiệu
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ====================================================================
          AI VOICE VORSTELLUNGSGESPRÄCH SIMULATOR & EVALUATOR
      ==================================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                Luyện Phỏng Vấn Giọng Nói &amp; Chấm Điểm AI (AI Voice Vorstellungsgespräch Coach)
              </h3>
              <Badge variant="outline" className="border-emerald-300 text-emerald-700 text-xs">
                Speech-to-Text de-DE + AI Rubric
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Bấm nút <strong>🎙️ Trả lời bằng giọng nói tiếng Đức</strong> để nói trực tiếp qua Mic
              (hoặc gõ câu trả lời), sau đó bấm <strong>✨ AI Chấm điểm</strong> để nhận điểm số và
              bản sửa lỗi ngữ pháp B1/B2!
            </p>
          </div>
        </div>

        {speechError && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            ⚠️ {speechError}
          </div>
        )}

        {qaList.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
            <p className="text-sm text-slate-600 mb-3">
              Chưa có bộ câu hỏi phỏng vấn cá nhân hoá cho ngành nghề của bạn.
            </p>
            <Button type="button" variant="outline" size="sm" onClick={onGenerateAiKit}>
              <Sparkles className="w-4 h-4 mr-2 text-emerald-600" />
              Tạo Bộ Câu Hỏi Vorstellungsgespräch Ngay
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">
            {qaList.map((item, index) => {
              const isListening = listeningQuestionId === item.id;
              const isEvaluating = evaluatingQuestionId === item.id;
              const answerVal = draftAnswers[item.id] ?? item.studentAnswerDe ?? "";
              const ev = item.evaluation;

              return (
                <div
                  key={item.id || index}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                          Frage #{index + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                          {item.questionDe}
                        </h4>
                        <p className="text-xs text-slate-500 italic">{item.questionVn}</p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => speakGermanText(item.questionDe)}
                        className="shrink-0 h-8 px-2.5"
                        title="Nghe câu hỏi từ nhà tuyển dụng Đức"
                      >
                        <Volume2 className="w-4 h-4 text-emerald-600 mr-1" />
                        <span className="text-xs">Nghe hỏi</span>
                      </Button>
                    </div>

                    {/* Collapsible / Reference Sample Answer */}
                    <details className="group rounded-lg bg-white border border-slate-200 p-3 text-xs">
                      <summary className="font-semibold text-slate-700 cursor-pointer flex items-center justify-between">
                        <span>📖 Xem câu trả lời mẫu B1/B2 (Musterantwort tham khảo)</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            speakGermanText(item.sampleAnswerDe);
                          }}
                          className="text-emerald-600 hover:underline text-[11px]"
                        >
                          🔊 Nghe mẫu
                        </button>
                      </summary>
                      <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                        <p className="font-medium text-slate-900">„{item.sampleAnswerDe}“</p>
                        <p className="text-slate-500">🇻🇳 {item.sampleAnswerVn}</p>
                        {item.pronunciationTip && (
                          <p className="text-emerald-700 pt-1">💡 {item.pronunciationTip}</p>
                        )}
                      </div>
                    </details>

                    {/* Student Voice / Text Answer Box */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between gap-2">
                        <label className="text-xs font-bold text-slate-800">
                          Câu trả lời của bạn bằng tiếng Đức (Ihre Antwort):
                        </label>
                        <Button
                          type="button"
                          size="sm"
                          variant={isListening ? "destructive" : "outline"}
                          onClick={() => toggleGermanSpeechRecognition(item.id)}
                          className="h-7 text-xs"
                        >
                          {isListening ? (
                            <>
                              <MicOff className="w-3.5 h-3.5 mr-1 animate-pulse" />
                              Đang nghe tiếng Đức... (Bấm để dừng)
                            </>
                          ) : (
                            <>
                              <Mic className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                              Bấm Mic nói tiếng Đức
                            </>
                          )}
                        </Button>
                      </div>

                      <Textarea
                        rows={3}
                        value={answerVal}
                        onChange={(e) =>
                          setDraftAnswers((prev) => ({ ...prev, [item.id]: e.target.value }))
                        }
                        placeholder="Bấm nút Mic ở trên và nói bằng tiếng Đức, hoặc gõ câu trả lời của bạn vào đây..."
                        className="bg-white text-xs"
                      />

                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleEvaluateClick(item.id)}
                        disabled={isEvaluating || !answerVal.trim()}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                      >
                        {isEvaluating ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                            Giám khảo AI đang chấm điểm...
                          </>
                        ) : (
                          <>
                            <Award className="w-3.5 h-3.5 mr-1.5" />
                            AI Chấm Điểm Ngữ Pháp, Nội Dung &amp; Sửa Lỗi
                          </>
                        )}
                      </Button>
                    </div>

                    {/* AI Evaluation Scorecard */}
                    {ev && (
                      <div className="p-4 rounded-xl bg-white border-2 border-emerald-200 space-y-3 text-xs shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <Award className="w-4 h-4 text-emerald-600" />
                            Kết quả chấm điểm Vorstellungsgespräch
                          </span>
                          <Badge className="bg-emerald-600 text-white font-bold">
                            Tổng: {ev.overallScore}/100
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                            <span className="text-[10px] text-slate-500 block">Ngữ pháp</span>
                            <strong className="text-slate-900">{ev.grammatikScore}/100</strong>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                            <span className="text-[10px] text-slate-500 block">Nội dung</span>
                            <strong className="text-slate-900">{ev.inhaltScore}/100</strong>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                            <span className="text-[10px] text-slate-500 block">Văn hoá/Siezen</span>
                            <strong className="text-slate-900">{ev.kulturScore}/100</strong>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <p className="text-slate-700">
                            🇻🇳 <strong>Nhận xét:</strong> {ev.feedbackVn}
                          </p>
                          <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-emerald-900">
                                ✓ Câu của bạn sau khi sửa chuẩn ngữ pháp Đức:
                              </span>
                              <button
                                type="button"
                                onClick={() => speakGermanText(ev.correctedGerman)}
                                className="text-[11px] text-emerald-700 underline"
                              >
                                🔊 Nghe
                              </button>
                            </div>
                            <p className="text-slate-900 font-medium mt-0.5">
                              „{ev.correctedGerman}“
                            </p>
                          </div>
                          {ev.upgradedB2VersionDe && (
                            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-700">
                                  🚀 Cách diễn đạt nâng cấp B1+/B2 ghi điểm cao:
                                </span>
                                <button
                                  type="button"
                                  onClick={() => speakGermanText(ev.upgradedB2VersionDe)}
                                  className="text-[11px] text-emerald-700 underline"
                                >
                                  🔊 Nghe
                                </button>
                              </div>
                              <p className="text-slate-800 italic mt-0.5">
                                „{ev.upgradedB2VersionDe}“
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
