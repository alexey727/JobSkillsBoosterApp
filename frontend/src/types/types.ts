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
