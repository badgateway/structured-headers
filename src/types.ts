export type Item = string | number | Buffer | boolean;

export type Parameters = {
  [key: string]: Item
};

export type Dictionary = {
  [key: string]: {
    value: Item | Item[],
    parameters?: Parameters
  }
};


export type ListItem = {
  value: Item | Item[],
  parameters?: Parameters
};

export type List = ListItem[];
