import {ValueRange} from "./types";

export function wrapParam(param: AudioParam, range: ValueRange): AudioParam {
   Object.defineProperty(param, 'valueRange', {
       value: range,
       writable: false
   });
   return param;
}