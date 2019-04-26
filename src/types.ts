export type Item = string | number | Buffer | boolean;

export type Dictionary = {
  [s: string]: Item
};

export type List = Item[];
export type ListList = List[];

export type ParameterizedIdentifier = [string, Dictionary];
export type ParameterizedList = ParameterizedIdentifier[];
