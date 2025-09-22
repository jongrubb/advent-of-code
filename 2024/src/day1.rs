use std::collections::HashMap;

use aoc_runner_derive::aoc;

fn parse_option_value(option: &Option<&str>) -> u32 {
    option
        .expect("expected value to not be empty!")
        .parse::<u32>()
        .expect("failed to parse value to u32!")
}

fn parse_input_day1(input: &str) -> (Vec<u32>, Vec<u32>) {
    let mut left_col = Vec::<u32>::new();
    let mut right_col = Vec::<u32>::new();

    input
        .lines()
        .map(|l| l.split_whitespace())
        .for_each(|mut split_line| {
            let left = parse_option_value(&split_line.next());
            let right = parse_option_value(&split_line.next());

            left_col.push(left);
            right_col.push(right);
        });

    (left_col, right_col)
}

#[aoc(day1, part1)]
fn part1(input: &str) -> u32 {
    let mut lists = parse_input_day1(input);

    process_part1(&mut lists)
}

fn process_part1(lists: &mut (Vec<u32>, Vec<u32>)) -> u32 {
    let (left_list, right_list) = lists;

    left_list.sort();
    right_list.sort();

    let mut sum = 0;

    for i in 0..left_list.len() {
        let left = *left_list.get(i).unwrap();
        let right = *right_list.get(i).unwrap();

        sum += left.abs_diff(right);
    }

    sum
}

#[aoc(day1, part2)]
fn part2(input: &str) -> u32 {
    let mut lists = parse_input_day1(input);

    process_part2(&mut lists)
}

fn process_part2(lists: &mut (Vec<u32>, Vec<u32>)) -> u32 {
    let (left_list, right_list) = lists;

    let mut right_list_count_map = HashMap::<u32, u32>::new();

    for num in right_list.iter() {
        match right_list_count_map.get(num) {
            Option::Some(count) => {
                right_list_count_map.insert(*num, count + 1);
            }
            Option::None => {
                right_list_count_map.insert(*num, 1);
            }
        };
    }

    let mut sum: u32 = 0;

    for num in left_list.iter() {
        sum += num * right_list_count_map.get(num).unwrap_or(&(0));
    }

    sum
}

#[cfg(test)]
mod tests {}
