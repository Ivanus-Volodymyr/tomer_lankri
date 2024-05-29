export interface Option {
  name: string;
  category: string;
  value: number | string;
  id: string;
}

export interface AutocompleteState {
  fullInputValues: Option[];
  currentInput: string;
  addFullInputValue: (fullInputValue: Option) => void;
  removeLastFullInputValue: () => void;
  setCurrentInput: (input: string) => void;
  clearLastFullInputValues: () => void;
}
