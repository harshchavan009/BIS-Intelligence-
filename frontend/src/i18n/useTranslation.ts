import { useAppStore } from '../store/useAppStore';
import en from './en.json';
import hi from './hi.json';

type TranslationDictionary = typeof en;

export const useTranslation = () => {
  const { language } = useAppStore();

  const t = (path: string, params?: Record<string, string | number>): string => {
    const dict = language === 'hi' ? hi : en;
    const fallback = en;

    const keys = path.split('.');
    
    let currentVal: any = dict;
    for (const key of keys) {
      if (currentVal && typeof currentVal === 'object' && key in currentVal) {
        currentVal = currentVal[key];
      } else {
        currentVal = undefined;
        break;
      }
    }

    if (currentVal === undefined) {
      // Fallback to English
      let fbVal: any = fallback;
      for (const key of keys) {
        if (fbVal && typeof fbVal === 'object' && key in fbVal) {
          fbVal = fbVal[key];
        } else {
          fbVal = undefined;
          break;
        }
      }
      currentVal = fbVal !== undefined ? fbVal : path;
    }

    if (typeof currentVal === 'string' && params) {
      return Object.entries(params).reduce((acc, [k, v]) => {
        return acc.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }, currentVal);
    }

    return typeof currentVal === 'string' ? currentVal : path;
  };

  return { t, language };
};
