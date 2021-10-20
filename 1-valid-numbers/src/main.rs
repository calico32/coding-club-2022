mod constants;
mod evaluate;

extern crate colored;

use colored::*;
use rustyline::{error::ReadlineError, Editor};

use constants::*;
use evaluate::*;

// help message
fn print_help() {
  println!(
    "{}\t{}\n{}\t{}\n{}\t{}",
    "help".bold(),
    "show this message",
    "test".bold(),
    "test given numbers",
    "exit".bold(),
    "exit (ctrl + d works too)"
  )
}

// test given values

fn test_numbers() {
  for number in VALID_NUMBERS {
    println!(
      "{}",
      format!("testing number {}, expecting valid", number).dimmed()
    );
    let result = evaluate_number(number);

    match result {
      EvaluateResult::Valid => {}
      EvaluateResult::Error => {
        println!("{} {}", number, "errored".red().bold())
      }
      EvaluateResult::Invalid => {
        println!("{} {}", number, "was invalid, expected valid".red().bold())
      }
    }
  }

  for number in INVALID_NUMBERS {
    println!(
      "{}",
      format!("testing number {}, expecting to be invalid", number).dimmed()
    );
    let result = evaluate_number(number);

    match result {
      EvaluateResult::Invalid => {}
      EvaluateResult::Error => {
        println!("{} {}", number, "errored".red().bold())
      }
      EvaluateResult::Valid => {
        println!("{} {}", number, "was valid, expected invalid".red().bold())
      }
    }
  }

  println!("test complete");
}

fn main() {
  let mut rl = Editor::<()>::new();

  println!(
    "enter a number to test validity, or, type {} for help",
    "help".bold()
  );

  loop {
    let readline = rl.readline(&format!(
      "{} {} ",
      "enter a number".bright_blue().bold(),
      ">".bold()
    ));
    match readline {
      Ok(line) => {
        rl.add_history_entry(line.as_str());

        // split the line into words
        let segments = line.split_ascii_whitespace().collect::<Vec<&str>>();

        // no input
        if segments.len() == 0 {
          continue;
        }

        // too many inputs
        if segments.len() > 1 {
          // too many numbers
          println!(
            "{} {}",
            INVALID_MESSAGE.red().bold(),
            "Expected 1 number".red()
          );
          continue;
        }

        let str = segments[0];

        // test for commands
        match str {
          "help" => {
            print_help();
            continue;
          }
          "test" => {
            test_numbers();
            continue;
          }
          "exit" => {
            break;
          }

          // if nothing matches, assume it's a number and continue execution
          _ => {}
        }

        evaluate_number(str);
        continue;
      }
      // ctrl + c
      Err(ReadlineError::Interrupted) => {
        continue;
      }
      // ctrl + d
      Err(ReadlineError::Eof) => {
        break;
      }
      // other error
      Err(err) => {
        println!("Error: {:?}", err);
        break;
      }
    }
  }
}
