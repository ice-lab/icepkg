#![deny(clippy::all)]

mod thread_pool;
mod plugin_container;
mod transformer;

use std::{fs, path};
use thread_pool::ThreadPool;

#[macro_use]
extern crate napi_derive;

#[napi]
pub fn sum(a: i32, b: i32) -> i32 {
  let pool = ThreadPool::new(4);
  let files = vec![
    "index1.txt",
    "index2.txt",
    "index3.txt",
    "index4.txt",
    "index5.txt",
  ];

  for file in files {
    pool.execute(move || {
      let content = fs::read_to_string(path::Path::new("demos").join(file)).unwrap();
    });
  }

  a + b
}
