const translationStatus = ['PENDING', 'IN_PROGRESS', 'DONE'] as const;
export type TranslationStatus = (typeof translationStatus)[number];
