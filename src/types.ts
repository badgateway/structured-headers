import { Token } from './token.js';
import { DisplayString } from './displaystring.js';

/**
 * Lists are arrays of zero or more members, each of which can be an Item
 * or an Inner List, both of which can be Parameterized
 */
export type List = (InnerList|Item)[];

/**
 * An Inner List is an array of zero or more Items. Both the individual Items
 * and the Inner List itself can be Parameterized.
 */
export type InnerList = [Item[], Parameters];

/**
 * Parameters are an ordered map of key-value pairs that are associated with
 * an Item or Inner List. The keys are unique within the scope of the
 * Parameters they occur within, and the values are bare items (i.e., they
 * themselves cannot be parameterized
 */
export type Parameters = Map<string, BareItem>;

/**
 * Dictionaries are ordered maps of key-value pairs, where the keys are short
 * textual strings and the values are Items or arrays of Items, both of which
 * can be Parameterized.
 *
 * There can be zero or more members, and their keys are unique in the scope
 * of the Dictionary they occur within.
 */
export type Dictionary = Map<string, Item|InnerList>;

/**
 * Another representatation of a Dictionary.
 *
 * Serialize functions also accept an Object instead of a Map for a
 * Dictionary. Parse functions will always return the Map however.
 */
export type DictionaryObject = Record<string, BareItem|Item|InnerList>;

export type BareItem = number | string | Token | ArrayBuffer | Date | boolean | DisplayString;

export type Item = [BareItem, Parameters];
