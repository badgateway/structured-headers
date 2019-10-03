export type Item = string | number | Buffer | boolean;

export type Dictionary = {
  [s: string]: Item
};


export type ListItem = {
  value: Item | Item[],
  parameters: Dictionary
};

export type List = ListItem[];
