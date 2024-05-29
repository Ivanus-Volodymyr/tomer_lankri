import { create } from "zustand";
import { AutocompleteState, Option } from "../types/autocomplete";
import { immer } from "zustand/middleware/immer";

export const useAutocompleteStore = create<AutocompleteState>()(
  immer((set) => ({
    fullInputValues: [],
    currentInput: "",
    addFullInputValue: (fullInputValue: Option) =>
      set((state) => {
        state.fullInputValues.push(fullInputValue);
      }),
    removeLastFullInputValue: () =>
      set((state) => {
        state.fullInputValues.pop();
      }),
    clearLastFullInputValues: () =>
      set((state) => {
        state.fullInputValues = [];
      }),
    setCurrentInput: (input: string) =>
      set((state) => {
        state.currentInput = input;
      }),
  })),
);
