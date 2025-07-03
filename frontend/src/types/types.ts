export type Config = {
  about: string;
  settings: {
    communicationModes: {
      name: string;
      details: string;
      direktAnswer: boolean;
    }[];
    testTypes: { type: string; name: string }[];
    aiModels: { name: string; ai: string, model: string }[];
    difficultyLevels: string[];
    temperatureRange: { min: number; max: number };
    maxTokensRange: { min: number; max: number };
    testDurations: number[];
    resultOptions: { name: string; details: string }[];
  };
  info: { evaluate: string };
  errors: { evaluation_requirement: string };
};

export type Interview = {
  settings: {
    selectedCommunication: string;
    selectedTestType: string;
    selectedAI: string;
    selectedAIModel: string;
    temperature: number;
    maxTokens: number;
    testDuration: number;
    selectedResults: string[];
    candidateName: string;
    vacancyName: string;
    vacancyDescription: string;
    selectedDifficulty: string;
  };
  questions: {
    id: number;
    question: string;
    answerOptions: string[];
    type: string;
    rightAnswer: string;
    candidateAnswer: string;
    point: number;
    answer: string;
  }[];
};

