export const LANGUAGES = [
  { label: 'English',              value: 'en', speechCode: 'en-US' },
  { label: 'हिन्दी (Hindi)',        value: 'hi', speechCode: 'hi-IN' },
  { label: 'Español (Spanish)',    value: 'es', speechCode: 'es-ES' },
  { label: 'Français (French)',    value: 'fr', speechCode: 'fr-FR' },
  { label: 'Deutsch (German)',     value: 'de', speechCode: 'de-DE' },
  { label: 'العربية (Arabic)',     value: 'ar', speechCode: 'ar-SA' },
  { label: '中文 (Chinese)',        value: 'zh', speechCode: 'zh-CN' },
  { label: '日本語 (Japanese)',     value: 'ja', speechCode: 'ja-JP' },
  { label: 'Português (Portuguese)', value: 'pt', speechCode: 'pt-BR' },
  { label: 'Русский (Russian)',    value: 'ru', speechCode: 'ru-RU' },
];

export const getSpeechCode = (langValue) => {
  const lang = LANGUAGES.find((l) => l.value === langValue);
  return lang?.speechCode || 'en-US';
};
