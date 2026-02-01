
export enum GamePhase {
  LOBBY = 'LOBBY',
  REVEAL = 'REVEAL', 
  ANSWERING = 'ANSWERING', 
  VOTING_LANDING = 'VOTING_LANDING', 
  QUESTION_REVEAL_ACTUAL = 'QUESTION_REVEAL_ACTUAL', 
  ANSWERS_SUMMARY = 'ANSWERS_SUMMARY', 
  VOTING = 'VOTING',
  RESULT = 'RESULT'
}

export enum GameMode {
  WORD = 'WORD',
  QUESTION = 'QUESTION'
}

export enum PlayerRole {
  INNOCENT = 'INNOCENT',
  IMPOSTER = 'IMPOSTER'
}

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  clue?: string;
  answer?: string;
  hasSeenWord: boolean;
  votes: number;
  isEliminated: boolean;
}

export interface GameSettings {
  showCategoryToImposter: boolean;
  showHintToImposter: boolean;
}

export interface GameState {
  phase: GamePhase;
  mode: GameMode;
  players: Player[];
  secretWord: string;
  questionA: string; 
  questionB: string; 
  category: string;
  imposterHint: string;
  currentPlayerIndex: number;
  winner?: PlayerRole;
  revealingPlayerIndex: number;
  startingPlayerIndex: number;
  settings: GameSettings;
}

export interface CategoryOption {
  id: string;
  name: string;
  icon: string;
}
