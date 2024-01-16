use std::sync::{Arc, Mutex};
use std::thread;
use std::sync::mpsc::{self, Receiver};

trait FnBox {
  fn call_box(self: Box<Self>);
}
impl<F: FnOnce()> FnBox for F {
  fn call_box(self: Box<F>) {
      (*self)()
  }
}

type Job = Box<dyn FnBox + Send + 'static>;

enum Message {
  NewJob(Job),
  Terminate,
}
pub struct ThreadPool {
  workers: Vec<Worker>,
  sender: mpsc::Sender<Message>,
}
impl Drop for ThreadPool {
  fn drop(&mut self) {
    for _ in &mut self.workers {
      self.sender.send(Message::Terminate).unwrap();
    }
    for worker in &mut self.workers {
      println!("Shutting down worker {}", worker.id);
      if let Some(thread) = worker.thread.take() {
        thread.join().unwrap();
      }
    }
  }
}
impl ThreadPool {
  /// Create a new ThreadPool.
  /// 
  /// The size is the number of threads in the pool.
  /// 
  /// # Panics
  /// 
  /// The `new` function will panic if the size is zero.
  pub fn new(size: usize) -> Self {
    assert!(size > 0);

    let (sender, receiver) = mpsc::channel();
    let receiver = Arc::new(Mutex::new(receiver));
    let mut workers = Vec::with_capacity(size);
    for id in 0..size {
      workers.push(Worker::new(id, Arc::clone(&receiver)))
    }

    Self {
      workers,
      sender,
    }
  }
  /// use execute(f) instead of thread::spawn to execute job
  pub fn execute<F>(&self, f: F)
    where F: FnOnce() + Send + 'static {
      let job = Box::new(f);
      self.sender.send(Message::NewJob(job)).expect("Sender execute error.");
  }
}


struct Worker {
  id: usize,
  thread: Option<thread::JoinHandle<()>>,
}
impl Worker {
  fn new(id: usize, receiver: Arc<Mutex<Receiver<Message>>>) -> Self {
    let thread = thread::spawn(move || loop {
      let message = receiver.lock().unwrap().recv().unwrap();
      match message {
        Message::NewJob(job) => {
          println!("Worker {} got a job. Executing.", id);
          job.call_box();
        }
        Message::Terminate => {
          println!("Worker {} was to terminate.", id);
          break;
        }
      }
    });

    Self {
      id,
      thread: Some(thread),
    }
  }
}