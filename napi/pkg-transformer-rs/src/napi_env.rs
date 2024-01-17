use napi;

thread_local! {
  // Safety: A single node process always share the same napi_env, so it's safe to use a thread local
  static NAPI_ENV: std::cell::RefCell<Option<napi::sys::napi_env>>  = Default::default();
}

/// Get [napi::sys::napi_env], only intended to be called on main thread.
/// # Panic
///
/// Panics if is accessed from other thread.
pub fn get_napi_env() -> napi::sys::napi_env {
  NAPI_ENV.with(|e| e.borrow().expect("NAPI ENV should be available"))
}
