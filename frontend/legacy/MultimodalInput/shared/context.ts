import { type FileData } from '@gradio/client';
import { getContext, setContext } from 'svelte';

const context_key = {};

export interface ContextValue {
  upload: (files: File[]) => Promise<FileData[]>;
}
export const setContextValue = (value: ContextValue) =>
  setContext(context_key, value);
export const getContextValue = () => getContext<ContextValue>(context_key);
