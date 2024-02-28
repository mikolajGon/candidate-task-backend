export type GuideContent = NestedStringObject;

// @ts-expect-error because we need generic record of infinite depth.
type NestedStringObject = Record<
  string,
  | string
  | number
  | NestedStringObject
  | (string | number | NestedStringObject)[]
>;
