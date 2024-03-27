pub trait loader {
  fn transform(&self, id: String, code: String, map: String) -> ();
}
