import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, RotateCcw, ChevronRight, ChevronLeft,
  FastForward, Rewind, Code2, Brain, Timer
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────
interface Algorithm {
  id: number; name: string; category: string;
  timeComplexityBest: string; timeComplexityAvg: string;
  timeComplexityWorst: string; spaceComplexity: string;
  pseudoCode: string; explanation: string;
}
interface QuizQuestion {
  id: number; questionText: string; questionType: string;
  options: string[]; correctAnswer: string; explanation: string;
}
interface AnswerSubmission {
  questionText: string; questionType: string; options: string[];
  correctAnswer: string; userResponse: string; isCorrect: boolean; explanation: string;
}

// ─── Sorting visualizer logic ────────────────────────────────────────────────
function generateBubbleSortSteps(arr: number[]): number[][] {
  const steps: number[][] = [arr.slice()];
  const a = arr.slice();
  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; }
      steps.push(a.slice());
    }
  }
  return steps;
}

function generateInsertionSortSteps(arr: number[]): number[][] {
  const steps: number[][] = [arr.slice()];
  const a = arr.slice();
  for (let i = 1; i < a.length; i++) {
    let key = a[i], j = i - 1;
    while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; }
    a[j + 1] = key;
    steps.push(a.slice());
  }
  return steps;
}

function generateSelectionSortSteps(arr: number[]): number[][] {
  const steps: number[][] = [arr.slice()];
  const a = arr.slice();
  for (let i = 0; i < a.length - 1; i++) {
    let min = i;
    for (let j = i + 1; j < a.length; j++) if (a[j] < a[min]) min = j;
    [a[i], a[min]] = [a[min], a[i]];
    steps.push(a.slice());
  }
  return steps;
}

function getSteps(name: string, arr: number[]): number[][] {
  const n = name.toLowerCase();
  if (n.includes('bubble')) return generateBubbleSortSteps(arr);
  if (n.includes('insertion')) return generateInsertionSortSteps(arr);
  if (n.includes('selection')) return generateSelectionSortSteps(arr);
  return [arr.slice()];
}

// ─── Mini Interview Modal ────────────────────────────────────────────────────
const InterviewModal: React.FC<{
  questions: QuizQuestion[];
  algorithmId: number;
  onClose: () => void;
}> = ({ questions, algorithmId, onClose }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timerRef.current!);
  }, []);

  const submitMutation = useMutation({
    mutationFn: (payload: any) => axios.post('/api/quiz/submit', payload),
    onSuccess: (res) => { setResult(res.data); setSubmitted(true); clearInterval(timerRef.current!); },
  });

  const q = questions[currentIdx];

  const handleSelect = (opt: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [currentIdx]: opt }));
  };

  const handleSubmit = () => {
    const submissions: AnswerSubmission[] = questions.map((q, i) => ({
      questionText: q.questionText,
      questionType: q.questionType,
      options: q.options,
      correctAnswer: q.correctAnswer,
      userResponse: answers[i] ?? '',
      isCorrect: (answers[i] ?? '') === q.correctAnswer,
      explanation: q.explanation,
    }));
    submitMutation.mutate({ algorithmId, timeSpent: elapsed, answers: submissions });
  };

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-2xl rounded-2xl border border-dark-700 bg-dark-950 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-dark-800 px-6 py-4">
          <div className="flex items-center gap-2">
            <Brain className="text-brand-primary" size={20} />
            <h2 className="text-lg font-bold text-white">Interview Coach</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm font-mono text-gray-400">
              <Timer size={14} />
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <span className="text-sm text-gray-500">{currentIdx + 1} / {questions.length}</span>
          </div>
        </div>

        {submitted ? (
          // Result Screen
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">{(result?.accuracy ?? 0) >= 70 ? '🎉' : '😤'}</div>
            <h3 className="text-2xl font-bold text-white">{result?.score} / {result?.totalQuestions} Correct</h3>
            <p className="mt-2 text-gray-400">Accuracy: <span className="font-bold text-brand-primary">{result?.accuracy?.toFixed(1)}%</span></p>
            <div className="mt-6 flex justify-center gap-4">
              <button onClick={onClose} className="rounded-xl bg-brand-primary px-6 py-2.5 font-bold text-white hover:bg-indigo-700">
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Question */}
            <div className="px-6 py-5">
              <span className="inline-block rounded-full bg-dark-800 px-2.5 py-0.5 text-xs font-bold text-gray-400 uppercase mb-3">
                {q?.questionType}
              </span>
              <p className="text-base font-semibold text-gray-100 leading-relaxed">{q?.questionText}</p>

              {/* Options (MCQ / Dry Run) */}
              {q?.options?.length > 0 && (
                <div className="mt-5 space-y-2.5">
                  {q.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelect(opt)}
                      className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                        answers[currentIdx] === opt
                          ? 'border-brand-primary bg-brand-primary/10 text-white'
                          : 'border-dark-700 text-gray-300 hover:border-dark-600 hover:bg-dark-900'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* Open-ended answer box */}
              {q?.options?.length === 0 && (
                <textarea
                  rows={5}
                  placeholder="Write your answer / code here…"
                  value={answers[currentIdx] ?? ''}
                  onChange={e => handleSelect(e.target.value)}
                  className="mt-4 w-full rounded-xl border border-dark-700 bg-dark-900 p-4 font-mono text-sm text-gray-200 focus:border-brand-primary focus:outline-none resize-none"
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between border-t border-dark-800 px-6 py-4">
              <button
                onClick={() => setCurrentIdx(i => Math.max(0, i - 1))}
                disabled={currentIdx === 0}
                className="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white disabled:opacity-30"
              >
                <ChevronLeft size={16} /> Prev
              </button>

              {currentIdx < questions.length - 1 ? (
                <button
                  onClick={() => setCurrentIdx(i => i + 1)}
                  className="flex items-center gap-1 rounded-xl bg-dark-800 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-dark-700"
                >
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitMutation.isPending}
                  className="rounded-xl bg-brand-primary px-5 py-2 text-sm font-bold text-white hover:bg-indigo-700 shadow-glow-indigo disabled:opacity-50"
                >
                  {submitMutation.isPending ? 'Submitting…' : 'Submit Quiz'}
                </button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

// ─── Main Visualizer Page ────────────────────────────────────────────────────
const Visualizer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [arr, setArr] = useState<number[]>([64, 34, 25, 12, 22, 11, 90]);
  const [steps, setSteps] = useState<number[][]>([]);
  const [stepIdx, setStepIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [showInterview, setShowInterview] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: algo, isLoading } = useQuery<Algorithm>({
    queryKey: ['algorithm', id],
    queryFn: () => axios.get(`/api/algorithms/${id}`).then(r => r.data),
    enabled: !!id,
  });

  useEffect(() => {
    if (algo) {
      const s = getSteps(algo.name, arr);
      setSteps(s);
      setStepIdx(0);
    }
  }, [algo]);

  // Auto-play
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setStepIdx(i => {
          if (i >= steps.length - 1) {
            setPlaying(false);
            // Auto-open interview after visualizer finishes
            setTimeout(() => triggerInterview(), 600);
            return i;
          }
          return i + 1;
        });
      }, speed);
    }
    return () => clearInterval(intervalRef.current!);
  }, [playing, steps, speed]);

  const triggerInterview = async () => {
    try {
      const res = await axios.get(`/api/quiz/generate/${id}`);
      setQuestions(res.data);
      setShowInterview(true);
    } catch (e) {
      console.error('Failed to load quiz', e);
    }
  };

  const reset = () => {
    setPlaying(false);
    setStepIdx(0);
    const shuffled = [...arr].sort(() => Math.random() - 0.5).map(() => Math.floor(Math.random() * 95) + 5);
    setArr(shuffled);
    const s = getSteps(algo?.name ?? '', shuffled);
    setSteps(s);
  };

  const currentArr = steps[stepIdx] ?? arr;
  const maxVal = Math.max(...currentArr);
  const progress = steps.length > 1 ? (stepIdx / (steps.length - 1)) * 100 : 0;

  if (isLoading) return (
    <div className="flex min-h-screen flex-col bg-dark-900">
      <Navbar />
      <div className="flex flex-1 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-brand-primary border-dark-700" />
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col bg-dark-900">
      <Navbar />

      <AnimatePresence>
        {showInterview && questions.length > 0 && (
          <InterviewModal
            questions={questions}
            algorithmId={Number(id)}
            onClose={() => setShowInterview(false)}
          />
        )}
      </AnimatePresence>

      <main className="mx-auto w-full max-w-7xl px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
          <button onClick={() => navigate('/algorithms')} className="hover:text-gray-300">Algorithms</button>
          <ChevronRight size={14} />
          <span className="text-gray-200 font-semibold">{algo?.name}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Visualizer Panel */}
          <div className="col-span-2 space-y-4">
            <div className="rounded-2xl border border-dark-800 bg-dark-950 p-6">
              <div className="flex items-center justify-between mb-5">
                <h1 className="text-xl font-extrabold text-white">{algo?.name} Visualizer</h1>
                <button
                  onClick={triggerInterview}
                  className="flex items-center gap-2 rounded-xl bg-brand-accent px-4 py-2 text-sm font-bold text-white hover:opacity-90"
                >
                  <Brain size={16} /> Start Interview
                </button>
              </div>

              {/* Bar Chart */}
              <div className="flex h-48 items-end gap-1.5 rounded-xl border border-dark-800 bg-dark-900 p-4">
                {currentArr.map((val, _i) => (
                  <div
                    key={_i}
                    className="flex-1 rounded-t-sm transition-all duration-300"
                    style={{
                      height: `${(val / maxVal) * 100}%`,
                      backgroundColor: `hsl(${220 + (val / maxVal) * 80}, 80%, 60%)`,
                    }}
                    title={String(val)}
                  />
                ))}
              </div>

              {/* Array values */}
              <div className="mt-3 flex gap-1.5">
                {currentArr.map((val, vi) => (
                  <div key={vi} className="flex-1 text-center font-mono text-xs text-gray-400">
                    {val}
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-4 h-1.5 w-full rounded-full bg-dark-800">
                <div
                  className="h-full rounded-full bg-brand-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-1 text-right text-xs text-gray-600">
                Step {stepIdx + 1} / {steps.length}
              </p>

              {/* Controls */}
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => setStepIdx(0)} className="rounded-lg p-2 text-gray-400 hover:bg-dark-800 hover:text-white">
                    <Rewind size={18} />
                  </button>
                  <button onClick={() => setStepIdx(i => Math.max(0, i - 1))} className="rounded-lg p-2 text-gray-400 hover:bg-dark-800 hover:text-white">
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setPlaying(p => !p)}
                    className="rounded-xl bg-brand-primary px-4 py-2 font-bold text-white hover:bg-indigo-700 shadow-glow-indigo"
                  >
                    {playing ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                  <button onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))} className="rounded-lg p-2 text-gray-400 hover:bg-dark-800 hover:text-white">
                    <ChevronRight size={18} />
                  </button>
                  <button onClick={() => setStepIdx(steps.length - 1)} className="rounded-lg p-2 text-gray-400 hover:bg-dark-800 hover:text-white">
                    <FastForward size={18} />
                  </button>
                  <button onClick={reset} className="rounded-lg p-2 text-gray-400 hover:bg-dark-800 hover:text-white">
                    <RotateCcw size={18} />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <span>Speed</span>
                  <input
                    type="range" min={100} max={1500} step={100}
                    value={1600 - speed}
                    onChange={e => setSpeed(1600 - Number(e.target.value))}
                    className="w-24 accent-brand-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-4">
            {/* Complexity */}
            <div className="rounded-2xl border border-dark-800 bg-dark-950 p-5">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-gray-400">Complexity</h3>
              <div className="space-y-2 text-sm">
                {[
                  ['Best', algo?.timeComplexityBest, 'text-green-400'],
                  ['Average', algo?.timeComplexityAvg, 'text-yellow-400'],
                  ['Worst', algo?.timeComplexityWorst, 'text-red-400'],
                  ['Space', algo?.spaceComplexity, 'text-blue-400'],
                ].map(([label, val, cls]) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-400">{label}</span>
                    <code className={`font-mono font-bold ${cls}`}>{val}</code>
                  </div>
                ))}
              </div>
            </div>

            {/* Pseudo-code */}
            <div className="rounded-2xl border border-dark-800 bg-dark-950 p-5">
              <div className="mb-3 flex items-center gap-2">
                <Code2 size={16} className="text-brand-primary" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Pseudo Code</h3>
              </div>
              <pre className="overflow-auto rounded-xl bg-dark-900 p-4 text-xs font-mono text-gray-300 leading-5 max-h-56 whitespace-pre-wrap">
                {algo?.pseudoCode}
              </pre>
            </div>

            {/* Info */}
            <div className="rounded-2xl border border-dark-800 bg-dark-950 p-5">
              <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-gray-400">About</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{algo?.explanation}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Visualizer;
