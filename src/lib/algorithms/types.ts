export interface ComplexityEntry {
  value: string;
  note: string;
}

export interface AlgorithmInfoContent {
  explanation: {
    overview: string;
    howItWorks: string[];
    useCases: string[];
    complexity: {
      time: {
        best: ComplexityEntry;
        average: ComplexityEntry;
        worst: ComplexityEntry;
      };
      space: ComplexityEntry;
    };
  };
  code: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
  };
}
