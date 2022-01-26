import * as wasm from "funniversaries";

const datesArray = wasm.generate_anniversaries("2020-01-02T03:04:05.006Z");

console.log("js");
console.log(datesArray);
