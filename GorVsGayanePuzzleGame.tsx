import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Gamepad2,
  User,
  Zap,
  Puzzle,
  Languages
} from 'lucide-react';

// --- Types ---
interface Question {
  spanish: string;
  armenian: string;
  options: string[];
}

// --- Data ---
const QUESTIONS: Question[] = [
  { spanish: "Ir", armenian: "Գնալ", options: ["Գնալ", "Ուտել", "Խոսել"] },
  { spanish: "Comer", armenian: "Ուտել", options: ["Ուտել", "Ապրել", "Խմել"] },
  { spanish: "Hablar", armenian: "Խոսել", options: ["Խոսել", "Լսել", "Գրել"] },
  { spanish: "Vivir", armenian: "Ապրել", options: ["Ապրել", "Սովորել", "Քնել"] },
  { spanish: "Hola", armenian: "Ողջույն", options: ["Ողջույն", "Ցտեսություն", "Շնորհակալություն"] },
  { spanish: "Gracias", armenian: "Շնորհակալություն", options: ["Շնորհակալություն", "Խնդրեմ", "Կներեք"] },
  { spanish: "Amigo", armenian: "Ընկեր", options: ["Ընկեր", "Թշնամի", "Հարևան"] },
  { spanish: "Escuela", armenian: "Դպրոց", options: ["Դպրոց", "Տուն", "Աշխատանք"] },
  { spanish: "Libro", armenian: "Գիրք", options: ["Գիրք", "Տետր", "Գրիչ"] },
  { spanish: "Manzana", armenian: "Խնձոր", options: ["Խնձոր", "Տանձ", "Դեղձ"] },
  { spanish: "Agua", armenian: "Ջուր", options: ["Ջուր", "Հյութ", "Գինի"] },
  { spanish: "Sol", armenian: "Արև", options: ["Արև", "Լուսին", "Աստղ"] },
  { spanish: "Luna", armenian: "Լուսին", options: ["Լուսին", "Արև", "Երկինք"] },
  { spanish: "Casa", armenian: "Տուն", options: ["Տուն", "Շենք", "Բնակարան"] },
  { spanish: "Perro", armenian: "Շուն", options: ["Շուն", "Կատու", "Ձի"] },
  { spanish: "Gato", armenian: "Կատու", options: ["Կատու", "Շուն", "Մուկ"] },
  { spanish: "Flor", armenian: "Ծաղիկ", options: ["Ծաղիկ", "Ծառ", "Խոտ"] },
  { spanish: "Mar", armenian: "Ծով", options: ["Ծով", "Գետ", "Լիճ"] },
  { spanish: "Pan", armenian: "Հաց", options: ["Հաց", "Պանիր", "Կաթ"] },
  { spanish: "Leche", armenian: "Կաթ", options: ["Կաթ", "Ջուր", "Թեյ"] }
];

const PUZZLE_SIZE = 9; // 3x3

export default function GorVsGayanePuzzleBattle() {
  const [gorPieces, setGorPieces] = useState<number>(0);
  const [gayanePieces, setGayanePieces] = useState<number>(0);
  const [currentPlayer, setCurrentPlayer] = useState<'Gor' | 'Gayane'>('Gor');
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [winner, setWinner] = useState<'Gor' | 'Gayane' | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  useEffect(() => {
    setShuffledQuestions([...QUESTIONS].sort(() => Math.random() - 0.5));
  }, []);

  const handleAnswer = (option: string) => {
    if (feedback || winner) return;

    const isCorrect = option === shuffledQuestions[currentQuestionIdx].armenian;

    if (isCorrect) {
      setFeedback('correct');
      if (currentPlayer === 'Gor') {
        const newCount = gorPieces + 1;
        setGorPieces(newCount);
        if (newCount === PUZZLE_SIZE) setWinner('Gor');
      } else {
        const newCount = gayanePieces + 1;
        setGayanePieces(newCount);
        if (newCount === PUZZLE_SIZE) setWinner('Gayane');
      }
    } else {
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setCurrentPlayer(currentPlayer === 'Gor' ? 'Gayane' : 'Gor');
      setCurrentQuestionIdx((prev) => (prev + 1) % shuffledQuestions.length);
    }, 1500);
  };

  const restart = () => {
    setGorPieces(0);
    setGayanePieces(0);
    setCurrentPlayer('Gor');
    setCurrentQuestionIdx(0);
    setFeedback(null);
    setWinner(null);
    setShuffledQuestions([...QUESTIONS].sort(() => Math.random() - 0.5));
  };

  const renderPuzzle = (count: number, player: 'Gor' | 'Gayane') => {
    // Using distinct animal seeds for Gor and Gayane
    const imageUrl = player === 'Gor' 
      ? "https://picsum.photos/seed/funny_dog/600/600" 
      : "https://picsum.photos/seed/cute_cat/600/600";
    
    const isActive = currentPlayer === player;
    
    return (
      <div className={`grid grid-cols-3 gap-1.5 p-3 rounded-[2.5rem] border-4 transition-all duration-500 relative overflow-hidden aspect-square w-full max-w-[300px] ${
        isActive 
          ? 'bg-white border-blue-400 shadow-[0_20px_50px_rgba(59,130,246,0.15)] scale-105' 
          : 'bg-zinc-50 border-zinc-100 opacity-80'
      }`}>
        {[...Array(PUZZLE_SIZE)].map((_, i) => (
          <div key={i} className="relative aspect-square bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200/50">
            {i < count ? (
              <motion.img 
                initial={{ scale: 0, rotate: -45, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                src={imageUrl}
                alt="puzzle piece"
                referrerPolicy="no-referrer"
                className="absolute w-[300%] h-[300%] object-cover max-w-none"
                style={{
                  left: `-${(i % 3) * 100}%`,
                  top: `-${Math.floor(i / 3) * 100}%`
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Puzzle className="w-6 h-6 text-zinc-300 opacity-20" />
              </div>
            )}
          </div>
        ))}
        
        {/* Winner Overlay */}
        <AnimatePresence>
          {count === PUZZLE_SIZE && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 bg-emerald-500/30 flex flex-col items-center justify-center backdrop-blur-[3px] z-10"
            >
              <div className="bg-white p-6 rounded-full shadow-2xl border-4 border-yellow-400 animate-bounce">
                <Trophy className="w-16 h-16 text-yellow-400" />
              </div>
              <p className="mt-4 text-white font-black text-xl uppercase tracking-widest drop-shadow-md">ՀԱՂԹԱՆԱԿ!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  if (shuffledQuestions.length === 0) return null;

  const currentQ = shuffledQuestions[currentQuestionIdx];

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/5 to-transparent" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl w-full relative z-10">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block p-6 bg-blue-600 rounded-[2.5rem] shadow-xl border-4 border-yellow-400 mb-6">
            <Gamepad2 className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-blue-600 italic mb-2">
            Puzzle <span className="text-cyan-500">Battle</span>
          </h1>
          <p className="text-xl text-zinc-400 font-bold italic">
            Գոռ ընդդեմ Գայանեի — Ո՞վ առաջինը կհավաքի փազլը:
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          {/* Gor's Side */}
          <motion.div 
            animate={{ scale: currentPlayer === 'Gor' ? 1.05 : 0.95, opacity: currentPlayer === 'Gor' ? 1 : 0.6 }}
            className="flex flex-col items-center space-y-6"
          >
            <div className={`p-1 rounded-[3rem] border-4 ${currentPlayer === 'Gor' ? 'border-blue-500 shadow-2xl' : 'border-zinc-100 opacity-50'}`}>
              <div className="bg-blue-50 p-6 rounded-[2.8rem] text-center">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center overflow-hidden mx-auto mb-4 shadow-md">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Gor&backgroundColor=b6e3f4" alt="Gor" referrerPolicy="no-referrer" />
                </div>
                <h3 className="text-2xl font-black text-blue-600 uppercase tracking-widest">ԳՈՌ</h3>
                <p className="text-zinc-400 font-bold italic">{gorPieces} / {PUZZLE_SIZE} կտոր</p>
              </div>
            </div>
            {renderPuzzle(gorPieces, 'Gor')}
          </motion.div>

          {/* Question Center */}
          <div className="flex flex-col items-center space-y-8">
            <AnimatePresence mode="wait">
              {!winner ? (
                <motion.div 
                  key={currentQuestionIdx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-full bg-white/80 backdrop-blur-2xl rounded-[3rem] p-10 shadow-2xl border-4 border-zinc-50 text-center relative"
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 px-8 py-2 rounded-full border-4 border-white shadow-lg flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-900 fill-current" />
                    <span className="text-blue-900 font-black text-sm uppercase tracking-widest">
                      {currentPlayer === 'Gor' ? 'ԳՈՌԻ ՀԵՐԹՆ Է' : 'ԳԱՅԱՆԵԻ ՀԵՐԹՆ Է'}
                    </span>
                  </div>

                  <div className="mt-6 mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <Languages className="w-6 h-6 text-zinc-300" />
                      <p className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em]">ԹԱՐԳՄԱՆԻ՛Ր</p>
                    </div>
                    <h2 className="text-6xl font-black text-zinc-800 italic tracking-tighter mb-2">
                      {currentQ.spanish}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {currentQ.options.map((option, i) => (
                      <button
                        key={i}
                        disabled={!!feedback}
                        onClick={() => handleAnswer(option)}
                        className={`py-5 px-8 rounded-2xl border-4 transition-all text-xl font-black shadow-md ${
                          feedback === 'correct' && option === currentQ.armenian
                            ? 'bg-emerald-500 border-white text-white scale-105'
                            : feedback === 'wrong' && option !== currentQ.armenian
                            ? 'bg-red-500 border-white text-white opacity-50'
                            : 'bg-zinc-50 border-zinc-100 text-zinc-800 hover:border-blue-500 hover:text-blue-600'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {/* Feedback Overlay */}
                  <AnimatePresence>
                    {feedback && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                      >
                        <div className={`p-8 rounded-full shadow-2xl border-4 border-white ${feedback === 'correct' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                          {feedback === 'correct' ? <CheckCircle2 className="w-16 h-16 text-white" /> : <XCircle className="w-16 h-16 text-white" />}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center bg-white/80 backdrop-blur-2xl p-12 rounded-[4rem] border-4 border-zinc-50 shadow-2xl relative"
                >
                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-yellow-400 p-8 rounded-[2.5rem] border-4 border-white shadow-xl rotate-12">
                    <Trophy className="w-16 h-16 text-white" />
                  </div>
                  <h2 className="text-5xl font-black uppercase italic mb-6 mt-12 tracking-tighter text-blue-600">
                    ՀԱՂԹԱՆԱԿ!
                  </h2>
                  <p className="text-3xl font-black text-zinc-800 mb-8 uppercase tracking-widest">
                    {winner === 'Gor' ? 'ԳՈՌԸ ՀԱՂԹԵՑ' : 'ԳԱՅԱՆԵՆ ՀԱՂԹԵՑ'}
                  </p>
                  <button 
                    onClick={restart}
                    className="w-full py-6 bg-blue-600 text-white rounded-full font-black text-2xl uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg border-4 border-yellow-400 flex items-center justify-center gap-4"
                  >
                    <RotateCcw className="w-8 h-8" />
                    ՆՈՐԻՑ ԽԱՂԱԼ
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Gayane's Side */}
          <motion.div 
            animate={{ scale: currentPlayer === 'Gayane' ? 1.05 : 0.95, opacity: currentPlayer === 'Gayane' ? 1 : 0.6 }}
            className="flex flex-col items-center space-y-6"
          >
            <div className={`p-1 rounded-[3rem] border-4 ${currentPlayer === 'Gayane' ? 'border-cyan-500 shadow-2xl' : 'border-zinc-100 opacity-50'}`}>
              <div className="bg-cyan-50 p-6 rounded-[2.8rem] text-center">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-cyan-100 flex items-center justify-center overflow-hidden mx-auto mb-4 shadow-md">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Gayane&backgroundColor=c0aede" alt="Gayane" referrerPolicy="no-referrer" />
                </div>
                <h3 className="text-2xl font-black text-cyan-600 uppercase tracking-widest">ԳԱՅԱՆԵ</h3>
                <p className="text-zinc-400 font-bold italic">{gayanePieces} / {PUZZLE_SIZE} կտոր</p>
              </div>
            </div>
            {renderPuzzle(gayanePieces, 'Gayane')}
          </motion.div>
        </div>

        {/* Footer Info */}
        <div className="mt-20 flex justify-center gap-8 opacity-30">
          <Sparkles className="text-yellow-400 w-12 h-12" />
          <Star className="text-blue-500 w-12 h-12 fill-current" />
          <Sparkles className="text-cyan-500 w-12 h-12" />
        </div>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 backdrop-blur-md px-8 py-3 rounded-full border border-zinc-100 shadow-sm">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
          PUZZLE BATTLE v1.0
        </span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
        body { 
          font-family: 'Inter', sans-serif; 
          background: #ffffff;
          overflow-x: hidden;
        }
      `}} />
    </div>
  );
}
