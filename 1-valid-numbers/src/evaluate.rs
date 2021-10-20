extern crate colored;

use colored::*;

use crate::constants::INVALID_MESSAGE;

pub enum EvaluateResult {
  Valid,
  Invalid,
  Error,
}

// calculate validity of number
pub fn evaluate_number(str: &str) -> EvaluateResult {
  // too short
  if str.len() < 2 {
    println!(
      "{} {}",
      INVALID_MESSAGE.red().bold(),
      "Number must contain at least 2 digits".red()
    );
    return EvaluateResult::Error;
  }

  // test for all digits
  let is_numeric = str
    .chars()
    .map(|c| c.is_ascii_digit())
    // ANDing everything to make sure everything is true
    .reduce(|a, b| a && b)
    .unwrap();

  // not all digits
  if !is_numeric {
    println!("{} {}", INVALID_MESSAGE.red().bold(), "Invalid number");
    return EvaluateResult::Error;
  }

  // last 2 chars as a str
  let last2 = str.split_at(str.len() - 2).1;

  // that but a u32
  let num_last2 = last2.parse::<u32>().unwrap();

  // sum of the last 2 digits
  let sum_last2 = last2.chars().map(|s| s.to_digit(10).unwrap()).sum::<u32>();

  // sum of all the digits
  let sum_all = str.chars().map(|s| s.to_digit(10).unwrap()).sum::<u32>();

  // if sum of all the digits is equal to the last 2 digits as a number + sum of the last 2 digits
  let is_valid = sum_all == num_last2 + sum_last2;

  let formatted_result = format!(
    "{} {} {} + {}",
    sum_all.to_string(),
    if is_valid { "==" } else { "!=" },
    num_last2,
    sum_last2
  )
  .dimmed();

  // output result
  println!(
    "{}\t{} is {}",
    formatted_result,
    str.bold(),
    if is_valid {
      "valid".bold().green()
    } else {
      "invalid".bold().red()
    }
  );

  return if is_valid {
    EvaluateResult::Valid
  } else {
    EvaluateResult::Invalid
  };
}
