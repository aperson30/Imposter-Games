
import React, { useState, useEffect } from 'react';
import { GamePhase, GameState, Player, PlayerRole, CategoryOption, GameMode, GameSettings } from './types';
import { WORD_CATEGORIES, QUESTION_CATEGORIES, MIN_PLAYERS, MAX_PLAYERS, WORD_BANK, QUESTION_BANK, WordEntry } from './constants';

// -- Sub-Components --

const Header: React.FC = () => (
  <header className="py-6 px-4 flex flex-col items-center">
    <h1 className="text-4xl md:text-5xl font-bungee tracking-tighter text-white drop-shadow-lg text-center">
      IMPOSTER<span className="text-purple-500">.</span>IO
    </h1>
  </header>
);

const Toggle: React.FC<{ label: string; value: boolean; onChange: (v: boolean) => void }> = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-white/5">
    <span className="text-sm font-semibold text-slate-300">{label}</span>
    <button
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${value ? 'bg-purple-600' : 'bg-slate-700'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  </div>
);

const CategoryEditor: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  wordBank: Record<string, WordEntry[]>;
  questionBank: Record<string, { a: string, b: string }[]>;
  setWordBank: (b: Record<string, WordEntry[]>) => void;
  setQuestionBank: (b: Record<string, { a: string, b: string }[]>) => void;
}> = ({ isOpen, onClose, wordBank, questionBank, setWordBank, setQuestionBank }) => {
  const [activeMode, setActiveMode] = useState<GameMode>(GameMode.WORD);
  const [activeCatId, setActiveCatId] = useState<string>(WORD_CATEGORIES[0].id);
  const [newItemWord, setNewItemWord] = useState({ word: '', hint: '' });
  const [newItemQA, setNewItemQA] = useState({ a: '', b: '' });

  if (!isOpen) return null;

  const currentCategories = activeMode === GameMode.WORD ? WORD_CATEGORIES : QUESTION_CATEGORIES;
  
  const handleAdd = () => {
    if (activeMode === GameMode.WORD) {
      if (!newItemWord.word.trim()) return;
      const updated = { ...wordBank };
      const hint = newItemWord.hint.trim() || `Starts with "${newItemWord.word.charAt(0).toUpperCase()}"`;
      updated[activeCatId] = [...(updated[activeCatId] || []), { word: newItemWord.word.trim(), hint }];
      setWordBank(updated);
      setNewItemWord({ word: '', hint: '' });
    } else {
      if (!newItemQA.a.trim() || !newItemQA.b.trim()) return;
      const updated = { ...questionBank };
      updated[activeCatId] = [...(updated[activeCatId] || []), { ...newItemQA }];
      setQuestionBank(updated);
      setNewItemQA({ a: '', b: '' });
    }
  };

  const handleRemove = (index: number) => {
    if (activeMode === GameMode.WORD) {
      const updated = { ...wordBank };
      updated[activeCatId] = updated[activeCatId].filter((_, i) => i !== index);
      setWordBank(updated);
    } else {
      const updated = { ...questionBank };
      updated[activeCatId] = updated[activeCatId].filter((_, i) => i !== index);
      setQuestionBank(updated);
    }
  };

  const updateWordHint = (index: number, newHint: string) => {
    const updated = { ...wordBank };
    const items = [...updated[activeCatId]];
    items[index] = { ...items[index], hint: newHint };
    updated[activeCatId] = items;
    setWordBank(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-2xl h-[90vh] rounded-3xl flex flex-col overflow-hidden border-white/20 shadow-2xl">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/40">
          <h2 className="text-2xl font-bungee text-white">Bank Editor</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl p-2">✕</button>
        </div>

        <div className="p-6 flex flex-col gap-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="flex gap-2 p-1 bg-slate-900 rounded-xl">
            <button 
              onClick={() => { setActiveMode(GameMode.WORD); setActiveCatId(WORD_CATEGORIES[0].id); }}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeMode === GameMode.WORD ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Words & Hints
            </button>
            <button 
              onClick={() => { setActiveMode(GameMode.QUESTION); setActiveCatId(QUESTION_CATEGORIES[0].id); }}
              className={`flex-1 py-2 rounded-lg font-bold transition-all ${activeMode === GameMode.QUESTION ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Questions
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Category</label>
            <select 
              value={activeCatId} 
              onChange={(e) => setActiveCatId(e.target.value)}
              className="bg-slate-800 text-white p-3 rounded-xl border border-white/5 outline-none focus:border-blue-500"
            >
              {currentCategories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-3 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Add New {activeMode === GameMode.WORD ? 'Entry' : 'Pair'}</label>
            {activeMode === GameMode.WORD ? (
              <div className="flex flex-col gap-2">
                <input 
                  type="text" value={newItemWord.word} onChange={e => setNewItemWord({...newItemWord, word: e.target.value})}
                  placeholder="Secret Word (e.g. Candy Cane)"
                  className="bg-slate-800 p-3 rounded-xl border border-white/5 outline-none focus:border-blue-500"
                />
                <input 
                  type="text" value={newItemWord.hint} onChange={e => setNewItemWord({...newItemWord, hint: e.target.value})}
                  placeholder="Custom Hint (e.g. Holiday Treat)"
                  className="bg-slate-800 p-3 rounded-xl border border-white/5 outline-none focus:border-blue-500 text-sm"
                />
                <button onClick={handleAdd} className="bg-blue-600 p-3 rounded-xl font-bold shadow-lg shadow-blue-900/20">ADD ENTRY</button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <input 
                  type="text" value={newItemQA.a} onChange={e => setNewItemQA({...newItemQA, a: e.target.value})}
                  placeholder="Innocent Question"
                  className="bg-slate-800 p-3 rounded-xl border border-white/5 outline-none focus:border-blue-500"
                />
                <input 
                  type="text" value={newItemQA.b} onChange={e => setNewItemQA({...newItemQA, b: e.target.value})}
                  placeholder="Imposter Question"
                  className="bg-slate-800 p-3 rounded-xl border border-white/5 outline-none focus:border-blue-500"
                />
                <button onClick={handleAdd} className="bg-purple-600 p-3 rounded-xl font-bold shadow-lg shadow-purple-900/20">ADD QUESTION PAIR</button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Items</label>
              <span className="text-[10px] text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-white/5">
                {(activeMode === GameMode.WORD ? wordBank[activeCatId] : questionBank[activeCatId])?.length || 0} Items
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {(activeMode === GameMode.WORD ? (wordBank[activeCatId] || []) : (questionBank[activeCatId] || [])).map((item, idx) => (
                <div key={idx} className="flex flex-col gap-2 p-4 bg-slate-800/40 rounded-xl border border-white/5 group hover:bg-slate-800/60 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 overflow-hidden">
                      {activeMode === GameMode.WORD ? (
                        <div className="flex flex-col gap-2">
                          <span className="text-lg font-bold text-white">{(item as WordEntry).word}</span>
                          <div className="flex flex-col gap-1">
                            <label className="text-[10px] font-bold text-blue-500 uppercase">Hint</label>
                            <input 
                              type="text" 
                              value={(item as WordEntry).hint} 
                              onChange={(e) => updateWordHint(idx, e.target.value)}
                              className="bg-slate-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:border-blue-500 outline-none"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-blue-400 font-medium">A: {(item as any).a}</span>
                          <span className="text-xs text-purple-400">B: {(item as any).b}</span>
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={() => handleRemove(idx)} 
                      className="p-2 text-slate-600 hover:text-red-500 transition-all self-start"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
              {(!(activeMode === GameMode.WORD ? wordBank[activeCatId] : questionBank[activeCatId])?.length) && (
                <p className="text-center py-10 text-slate-600 italic">This category is empty. Add something!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LobbyView: React.FC<{
  players: Player[];
  selectedCategory: CategoryOption;
  gameMode: GameMode;
  settings: GameSettings;
  isLoading: boolean;
  addPlayer: () => void;
  removePlayer: (id: string) => void;
  updatePlayerName: (id: string, name: string) => void;
  setSelectedCategory: (cat: CategoryOption) => void;
  setGameMode: (mode: GameMode) => void;
  setSettings: (s: GameSettings) => void;
  startGame: () => void;
  onOpenEditor: () => void;
}> = ({ players, selectedCategory, gameMode, settings, isLoading, addPlayer, removePlayer, updatePlayerName, setSelectedCategory, setGameMode, setSettings, startGame, onOpenEditor }) => {
  const currentCategories = gameMode === GameMode.WORD ? WORD_CATEGORIES : QUESTION_CATEGORIES;

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-10">
      <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-blue-400">#</span> Game Mode
        </h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setGameMode(GameMode.WORD)}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${gameMode === GameMode.WORD ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-800 text-slate-400'}`}
          >
            Word Game
          </button>
          <button 
            onClick={() => setGameMode(GameMode.QUESTION)}
            className={`flex-1 py-3 rounded-xl font-bold transition-all ${gameMode === GameMode.QUESTION ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-slate-800 text-slate-400'}`}
          >
            Question Game
          </button>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="text-blue-400">#</span> Players
        </h2>
        <div className="grid grid-cols-1 gap-3 max-h-40 overflow-y-auto custom-scrollbar pr-2">
          {players.map((player) => (
            <div key={player.id} className="flex items-center gap-3 bg-slate-800/50 p-3 rounded-xl border border-white/5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold">
                {player.id}
              </div>
              <input 
                type="text"
                value={player.name}
                onChange={(e) => updatePlayerName(player.id, e.target.value)}
                className="bg-transparent border-b border-white/10 focus:border-blue-500 outline-none flex-1 py-1 px-2"
                placeholder={`Player ${player.id}`}
              />
              {players.length > MIN_PLAYERS && (
                <button onClick={() => removePlayer(player.id)} className="text-slate-500 hover:text-red-400 px-2">✕</button>
              )}
            </div>
          ))}
        </div>
        {players.length < MAX_PLAYERS && (
          <button onClick={addPlayer} className="w-full py-2 border-2 border-dashed border-slate-700 rounded-xl text-slate-400 hover:text-white transition-all text-sm">
            + Add Player
          </button>
        )}
      </div>

      <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-purple-400">#</span> Category
          </h2>
          <button 
            onClick={onOpenEditor}
            className="text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            <span>⚙️</span> View & Edit Banks
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto custom-scrollbar pr-2">
          {currentCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat)}
              className={`p-3 rounded-xl text-[10px] font-semibold transition-all flex items-center gap-2 border ${
                selectedCategory.id === cat.id ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-800/50 text-slate-400 border-white/5'
              }`}
            >
              <span className="text-base">{cat.icon}</span> <span className="truncate">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel p-5 rounded-3xl flex flex-col gap-3">
        <Toggle 
          label="Show Imposter the Category?" 
          value={settings.showCategoryToImposter} 
          onChange={(v) => setSettings({...settings, showCategoryToImposter: v})} 
        />
        <Toggle 
          label="Show Hint to Imposter?" 
          value={settings.showHintToImposter} 
          onChange={(v) => setSettings({...settings, showHintToImposter: v})} 
        />
      </div>

      <button
        onClick={startGame}
        disabled={isLoading}
        className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bungee text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
      >
        START GAME
      </button>
    </div>
  );
};

const RevealView: React.FC<{
  mode: GameMode;
  currentPlayer: Player;
  revealingPlayerIndex: number;
  totalPlayers: number;
  secretWord: string;
  questionA: string;
  questionB: string;
  category: string;
  imposterHint: string;
  settings: GameSettings;
  onDone: () => void;
}> = ({ mode, currentPlayer, revealingPlayerIndex, totalPlayers, secretWord, questionA, questionB, category, imposterHint, settings, onDone }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const isImposter = currentPlayer.role === PlayerRole.IMPOSTER;

  return (
    <div className="flex flex-col gap-8 animate-fadeIn text-center">
      <div className="glass-panel p-10 rounded-3xl flex flex-col items-center gap-6 min-h-[400px]">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold shadow-2xl">
          {currentPlayer.id}
        </div>
        <h2 className="text-2xl font-bold">Pass to {currentPlayer.name}</h2>
        <div className="w-full py-12 px-6 bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-700 relative overflow-hidden flex-1 flex items-center justify-center">
          {!isRevealed ? (
            <button onClick={() => setIsRevealed(true)} className="absolute inset-0 w-full h-full flex flex-col items-center justify-center gap-2">
              <span className="text-4xl opacity-50">👁️</span>
              <span className="font-bold text-slate-400">Tap to reveal</span>
            </button>
          ) : (
            <div className="animate-scaleIn flex flex-col items-center gap-4">
              <span className="text-sm text-slate-500 uppercase tracking-widest font-bold">
                {mode === GameMode.WORD ? 'Secret Word' : 'Your Question'}
              </span>
              <span className="text-3xl font-bungee text-white px-2">
                {mode === GameMode.WORD 
                  ? (isImposter ? "You are the Imposter" : secretWord) 
                  : (isImposter ? questionB : questionA)}
              </span>
              
              {isImposter && (
                <div className="mt-4 space-y-2">
                  {settings.showCategoryToImposter && (
                    <div className="px-4 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider">
                      Category: {category}
                    </div>
                  )}
                  {settings.showHintToImposter && (
                    <div className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-xl text-xs font-medium italic border border-purple-500/10">
                      Hint: {imposterHint}
                    </div>
                  )}
                </div>
              )}

              <button onClick={() => { setIsRevealed(false); onDone(); }} className="mt-8 px-10 py-3 bg-white text-slate-900 rounded-full font-bold">I GOT IT</button>
            </div>
          )}
        </div>
      </div>
      <p className="text-slate-500 text-sm">Player {revealingPlayerIndex + 1} of {totalPlayers}</p>
    </div>
  );
};

const AnsweringView: React.FC<{
  currentPlayer: Player;
  onSubmit: (ans: string) => void;
}> = ({ currentPlayer, onSubmit }) => {
  const [ans, setAns] = useState('');
  return (
    <div className="flex flex-col gap-6 animate-fadeIn glass-panel p-8 rounded-3xl">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">{currentPlayer.name}, enter your answer:</h2>
        <p className="text-sm text-slate-400">Don't let others see!</p>
      </div>
      <textarea 
        className="w-full bg-slate-900 border border-slate-700 p-4 rounded-xl text-lg outline-none focus:border-purple-500" 
        rows={3} value={ans} onChange={e => setAns(e.target.value)} placeholder="Type your answer..."
        autoFocus
      />
      <button onClick={() => { if(ans) onSubmit(ans); }} className="w-full py-4 bg-purple-600 rounded-xl font-bold">SUBMIT ANSWER</button>
    </div>
  );
};

const VotingLandingView: React.FC<{ startingPlayer: string; onRevealResults: () => void }> = ({ startingPlayer, onRevealResults }) => (
  <div className="flex flex-col gap-6 animate-fadeIn glass-panel p-10 rounded-3xl text-center border-red-500/20 shadow-2xl shadow-red-500/5">
    <h2 className="text-3xl font-bungee text-red-500 uppercase tracking-tighter">Voting Phase</h2>
    <div className="space-y-6 text-left py-4">
      <div className="flex gap-4 items-start">
        <div className="w-8 h-8 shrink-0 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold border border-red-500/30">1</div>
        <p className="text-slate-200 text-lg"><strong>{startingPlayer}</strong> starts the round</p>
      </div>
      <div className="flex gap-4 items-start">
        <div className="w-8 h-8 shrink-0 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold border border-red-500/30">2</div>
        <p className="text-slate-200 text-lg">go clockwise group discussion</p>
      </div>
      <div className="flex gap-4 items-start">
        <div className="w-8 h-8 shrink-0 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold border border-red-500/30">3</div>
        <p className="text-slate-200 text-lg">vote time each player says a hint then yall vote</p>
      </div>
      <div className="flex gap-4 items-start">
        <div className="w-8 h-8 shrink-0 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center font-bold border border-red-500/30">4</div>
        <p className="text-slate-200 text-lg">reveal phase</p>
      </div>
    </div>
    <button 
      onClick={onRevealResults} 
      className="w-full py-5 bg-red-600 hover:bg-red-500 rounded-2xl font-bungee text-xl shadow-xl shadow-red-900/20 transition-all active:scale-95 text-white"
    >
      REVEAL RESULTS
    </button>
  </div>
);

const QuestionRevealActual: React.FC<{ questionA: string; onStartRound: () => void }> = ({ questionA, onStartRound }) => (
  <div className="flex flex-col gap-8 animate-fadeIn text-center glass-panel p-10 rounded-3xl">
    <h2 className="text-2xl text-slate-500 font-bold uppercase tracking-widest">The Real Question was:</h2>
    <p className="text-3xl font-bungee text-white">"{questionA}"</p>
    <button onClick={onStartRound} className="w-full py-5 bg-purple-600 rounded-2xl font-bold text-xl">START ROUND</button>
  </div>
);

const AnswersSummaryView: React.FC<{ 
  players: Player[]; 
  question: string;
  onReset: () => void;
}> = ({ players, question, onReset }) => {
  const [showImposter, setShowImposter] = useState(false);

  return (
    <div className="flex flex-col gap-6 animate-fadeIn pb-10">
      <div className="glass-panel p-6 rounded-3xl text-center border-blue-500/30">
        <h2 className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2">Actual Question</h2>
        <p className="text-xl font-bold text-white italic">"{question}"</p>
      </div>

      <div className="space-y-4">
        {players.map(p => {
          const isImposter = p.role === PlayerRole.IMPOSTER;
          const highlight = showImposter && isImposter;
          return (
            <div 
              key={p.id} 
              className={`glass-panel p-5 rounded-2xl border-2 transition-all duration-500 ${
                highlight ? 'bg-red-900/40 border-red-500 shadow-lg shadow-red-500/20' : 'border-white/5'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                  <span className={`text-lg font-bold ${highlight ? 'text-red-400' : 'text-blue-400'}`}>
                    {p.name}
                  </span>
                  {highlight && (
                    <span className="text-[10px] font-bungee text-red-500 uppercase animate-pulse">
                      Imposter
                    </span>
                  )}
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500 border border-white/5">
                  {p.id}
                </div>
              </div>
              <p className={`text-lg italic ${highlight ? 'text-white' : 'text-slate-300'}`}>"{p.answer}"</p>
            </div>
          );
        })}
      </div>

      {!showImposter ? (
        <button 
          onClick={() => setShowImposter(true)} 
          className="w-full py-5 bg-red-600 rounded-2xl font-bungee text-xl shadow-xl hover:bg-red-500 transition-all mt-4"
        >
          FIND IMPOSTER
        </button>
      ) : (
        <button 
          onClick={onReset} 
          className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bungee text-xl shadow-xl hover:scale-[1.02] transition-all mt-4"
        >
          PLAY AGAIN
        </button>
      )}
    </div>
  );
};

const ResultView: React.FC<{
  players: Player[];
  winner?: PlayerRole;
  secretWord: string;
  onReset: () => void;
}> = ({ players, winner, secretWord, onReset }) => {
  const imposter = players.find(p => p.role === PlayerRole.IMPOSTER);

  return (
    <div className="flex flex-col gap-8 animate-fadeIn text-center">
      <div className={`p-10 rounded-3xl flex flex-col items-center gap-4 bg-red-600/20 border-2 border-red-500 shadow-lg shadow-red-500/20`}>
        <h2 className={`text-3xl font-bungee uppercase text-red-400`}>
          THE IMPOSTER WAS
        </h2>
        <div className="flex flex-col items-center gap-2">
          <span className="text-3xl font-bold text-white bg-slate-800 px-4 py-1 rounded-lg border border-white/10">{imposter?.name}</span>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl">
        <p className="text-xs text-slate-500 uppercase font-bold mb-1">The secret was</p>
        <p className="text-2xl font-bungee text-purple-400">"{secretWord}"</p>
      </div>

      <button
        onClick={onReset}
        className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bungee text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
      >
        Play Again
      </button>
    </div>
  );
};

// -- Main App --

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    return {
      phase: GamePhase.LOBBY,
      mode: GameMode.WORD,
      players: [
        { id: '1', name: 'Player 1', role: PlayerRole.INNOCENT, hasSeenWord: false, votes: 0, isEliminated: false },
        { id: '2', name: 'Player 2', role: PlayerRole.INNOCENT, hasSeenWord: false, votes: 0, isEliminated: false },
        { id: '3', name: 'Player 3', role: PlayerRole.INNOCENT, hasSeenWord: false, votes: 0, isEliminated: false },
      ],
      secretWord: '',
      questionA: '',
      questionB: '',
      imposterHint: '',
      category: 'Random',
      currentPlayerIndex: 0,
      revealingPlayerIndex: 0,
      startingPlayerIndex: 0,
      settings: {
        showCategoryToImposter: false,
        showHintToImposter: false
      }
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(WORD_CATEGORIES[0]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Persistent Banks
  const [wordBank, setWordBank] = useState<Record<string, WordEntry[]>>(() => {
    const saved = localStorage.getItem('IMPOSTER_WORD_BANK');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration: convert string arrays to WordEntry objects if needed
      const migrated: Record<string, WordEntry[]> = {};
      Object.keys(parsed).forEach(cat => {
        migrated[cat] = parsed[cat].map((item: any) => {
          if (typeof item === 'string') return { word: item, hint: `Starts with "${item.charAt(0).toUpperCase()}"` };
          return item;
        });
      });
      return migrated;
    }
    return WORD_BANK;
  });

  const [questionBank, setQuestionBank] = useState<Record<string, { a: string, b: string }[]>>(() => {
    const saved = localStorage.getItem('IMPOSTER_QUESTION_BANK');
    return saved ? JSON.parse(saved) : QUESTION_BANK;
  });

  useEffect(() => {
    localStorage.setItem('IMPOSTER_WORD_BANK', JSON.stringify(wordBank));
  }, [wordBank]);

  useEffect(() => {
    localStorage.setItem('IMPOSTER_QUESTION_BANK', JSON.stringify(questionBank));
  }, [questionBank]);

  useEffect(() => {
    const list = gameState.mode === GameMode.WORD ? WORD_CATEGORIES : QUESTION_CATEGORIES;
    setSelectedCategory(list[0]);
  }, [gameState.mode]);

  const addPlayer = () => {
    if (gameState.players.length < MAX_PLAYERS) {
      const newId = (gameState.players.length + 1).toString();
      setGameState(prev => ({
        ...prev,
        players: [...prev.players, { id: newId, name: `Player ${newId}`, role: PlayerRole.INNOCENT, hasSeenWord: false, votes: 0, isEliminated: false }]
      }));
    }
  };

  const removePlayer = (id: string) => {
    if (gameState.players.length > MIN_PLAYERS) {
      setGameState(prev => ({ ...prev, players: prev.players.filter(p => p.id !== id) }));
    }
  };

  const updatePlayerName = (id: string, name: string) => {
    setGameState(prev => ({ ...prev, players: prev.players.map(p => p.id === id ? { ...p, name } : p) }));
  };

  const startGame = () => {
    const playersCopy = [...gameState.players];
    const imposterIndex = Math.floor(Math.random() * playersCopy.length);
    const startIdx = Math.floor(Math.random() * playersCopy.length);

    let word = '', qA = '', qB = '', hint = '';
    const catId = selectedCategory.id;

    if (gameState.mode === GameMode.WORD) {
      const options = wordBank[catId] || [{ word: "Apple", hint: "A red fruit" }];
      const pick = options[Math.floor(Math.random() * options.length)];
      word = pick.word;
      hint = pick.hint;
    } else {
      const options = questionBank[catId] || [{a: "Fruit?", b: "Food?"}];
      const pick = options[Math.floor(Math.random() * options.length)];
      qA = pick.a;
      qB = pick.b;
      hint = `Relates to ${selectedCategory.name}`;
    }
    
    const preparedPlayers = playersCopy.map((p, idx) => ({
      ...p,
      role: idx === imposterIndex ? PlayerRole.IMPOSTER : PlayerRole.INNOCENT,
      hasSeenWord: false,
      clue: undefined,
      answer: undefined,
      votes: 0,
      isEliminated: false
    }));

    setGameState(prev => ({
      ...prev,
      phase: GamePhase.REVEAL,
      secretWord: word,
      questionA: qA,
      questionB: qB,
      imposterHint: hint,
      category: selectedCategory.name,
      players: preparedPlayers,
      revealingPlayerIndex: 0,
      currentPlayerIndex: 0,
      startingPlayerIndex: startIdx
    }));
  };

  const onRevealDone = () => {
    const isLast = gameState.revealingPlayerIndex === gameState.players.length - 1;

    if (gameState.mode === GameMode.WORD) {
      if (isLast) {
        setGameState(prev => ({ 
          ...prev, 
          phase: GamePhase.VOTING_LANDING
        }));
      } else {
        setGameState(prev => ({ ...prev, revealingPlayerIndex: prev.revealingPlayerIndex + 1 }));
      }
    } else {
      setGameState(prev => ({ 
        ...prev, 
        phase: GamePhase.ANSWERING,
        currentPlayerIndex: prev.revealingPlayerIndex 
      }));
    }
  };

  const onAnswerSubmitted = (ans: string) => {
    const isLast = gameState.currentPlayerIndex === gameState.players.length - 1;
    setGameState(prev => {
      const players = [...prev.players];
      players[prev.currentPlayerIndex].answer = ans;
      
      if (isLast) {
        return {
          ...prev,
          players,
          phase: GamePhase.QUESTION_REVEAL_ACTUAL
        };
      } else {
        return {
          ...prev,
          players,
          phase: GamePhase.REVEAL,
          revealingPlayerIndex: prev.currentPlayerIndex + 1,
          currentPlayerIndex: prev.currentPlayerIndex + 1
        };
      }
    });
  };

  const resetGame = () => {
    setGameState(prev => ({ ...prev, phase: GamePhase.LOBBY }));
  };

  return (
    <div className="min-h-screen max-w-lg mx-auto px-4 pb-12 flex flex-col relative">
      <Header />
      <main className="flex-1 mt-4">
        {gameState.phase === GamePhase.LOBBY && (
          <LobbyView 
            players={gameState.players} 
            gameMode={gameState.mode} 
            selectedCategory={selectedCategory} 
            settings={gameState.settings}
            isLoading={isLoading}
            addPlayer={addPlayer} 
            removePlayer={removePlayer} 
            updatePlayerName={updatePlayerName} 
            setSelectedCategory={setSelectedCategory}
            setSettings={(s) => setGameState({...gameState, settings: s})}
            setGameMode={m => setGameState(p => ({ ...p, mode: m }))} 
            startGame={startGame}
            onOpenEditor={() => setIsEditorOpen(true)}
          />
        )}
        {gameState.phase === GamePhase.REVEAL && (
          <RevealView 
            mode={gameState.mode} 
            currentPlayer={gameState.players[gameState.revealingPlayerIndex]} 
            revealingPlayerIndex={gameState.revealingPlayerIndex} 
            totalPlayers={gameState.players.length} 
            secretWord={gameState.secretWord} 
            questionA={gameState.questionA} 
            questionB={gameState.questionB} 
            category={gameState.category}
            imposterHint={gameState.imposterHint}
            settings={gameState.settings}
            onDone={onRevealDone}
          />
        )}
        {gameState.phase === GamePhase.ANSWERING && (
          <AnsweringView currentPlayer={gameState.players[gameState.currentPlayerIndex]} onSubmit={onAnswerSubmitted} />
        )}
        {gameState.phase === GamePhase.VOTING_LANDING && (
          <VotingLandingView startingPlayer={gameState.players[gameState.startingPlayerIndex].name} onRevealResults={() => setGameState(p => ({...p, phase: GamePhase.RESULT}))} />
        )}
        {gameState.phase === GamePhase.QUESTION_REVEAL_ACTUAL && (
          <QuestionRevealActual questionA={gameState.questionA} onStartRound={() => setGameState(p => ({...p, phase: GamePhase.ANSWERS_SUMMARY}))} />
        )}
        {gameState.phase === GamePhase.ANSWERS_SUMMARY && (
          <AnswersSummaryView players={gameState.players} question={gameState.questionA} onReset={resetGame} />
        )}
        {gameState.phase === GamePhase.RESULT && (
          <ResultView players={gameState.players} secretWord={gameState.mode === GameMode.WORD ? gameState.secretWord : gameState.questionA} onReset={resetGame} />
        )}
      </main>

      <CategoryEditor 
        isOpen={isEditorOpen} 
        onClose={() => setIsEditorOpen(false)}
        wordBank={wordBank}
        questionBank={questionBank}
        setWordBank={setWordBank}
        setQuestionBank={setQuestionBank}
      />

      <footer className="mt-12 text-center text-slate-600 text-[10px] font-medium tracking-widest uppercase">Powered by Customizable Banks</footer>
    </div>
  );
};

export default App;
