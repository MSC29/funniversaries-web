mod utils;

use funniversaries;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(date: &str) {
    web_sys::console::log_1(&date.clone().into());
    let anniversaries = funniversaries::find_anniversaries_future(date);
    web_sys::console::log_1(&anniversaries[0].name.clone().into());
    web_sys::console::log_1(&anniversaries[0].date.to_rfc3339().clone().into());
}
