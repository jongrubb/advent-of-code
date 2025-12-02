use core::num;
use std::sync::LazyLock;

use aoc_runner_derive::{aoc, aoc_generator};
use regex::Regex;

#[derive(Debug)]
enum DialDirection {
    LEFT,
    RIGHT,
}

struct DialRotation {
    direction: DialDirection,
    num_clicks: i32,
}

struct Dial {
    dial_number: i16,
}

impl Dial {
    fn new() -> Dial {
        Dial { dial_number: 50 }
    }

    fn number_full_rotations(num_clicks: i32) -> i32 {
        (num_clicks / 100).try_into().unwrap()
    }

    fn actual_num_clicks(num_clicks: i32) -> i16 {
        if num_clicks > 99 {
            return (num_clicks % 100).try_into().unwrap();
        }

        return num_clicks.try_into().unwrap();
    }

    fn rotate_left(&mut self, num_clicks: i32) {
        let actual_num_clicks = Dial::actual_num_clicks(num_clicks);

        let mut new_dial_number = self.dial_number - actual_num_clicks;

        if new_dial_number < 0 {
            new_dial_number = 100 + new_dial_number
        }

        self.dial_number = new_dial_number
    }

    fn rotate_right(&mut self, num_clicks: i32) {
        let actual_num_clicks = Dial::actual_num_clicks(num_clicks);

        let mut new_dial_number = self.dial_number + actual_num_clicks;

        if new_dial_number > 99 {
            new_dial_number = new_dial_number - 100
        }

        self.dial_number = new_dial_number
    }

    fn rotate(&mut self, dial_rotation: &DialRotation) {
        match dial_rotation.direction {
            DialDirection::LEFT => self.rotate_left(dial_rotation.num_clicks),
            DialDirection::RIGHT => self.rotate_right(dial_rotation.num_clicks),
        }
    }
}

static DIAL_REGEX: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"(?P<direction>[RL])(?P<num_clicks>\d+)").unwrap());

#[aoc_generator(day1)]
fn parse(input: &str) -> Vec<DialRotation> {
    input
        .lines()
        .map(|l| {
            let captures = DIAL_REGEX.captures(l).unwrap();
            let direction = {
                let d_str = captures.name("direction").unwrap().as_str();
                let d: DialDirection;

                if d_str == "L" {
                    d = DialDirection::LEFT
                } else {
                    d = DialDirection::RIGHT
                }

                d
            };
            let num_clicks = captures
                .name("num_clicks")
                .unwrap()
                .as_str()
                .parse::<i32>()
                .unwrap();

            DialRotation {
                direction,
                num_clicks,
            }
        })
        .collect()
}

#[aoc(day1, part1)]
fn part1(dial_rotations: &Vec<DialRotation>) -> i16 {
    let mut num_zeros = 0;
    let mut dial = Dial::new();

    dial_rotations.iter().for_each(|rotation| {
        dial.rotate(rotation);

        if dial.dial_number == 0 {
            num_zeros += 1;
        }

        println!(
            "rotation: {:?}, num_clicks: {}, final_dial: {}",
            rotation.direction, rotation.num_clicks, dial.dial_number
        );
    });

    return num_zeros;
}

#[aoc(day1, part2)]
fn part2(dial_rotations: &Vec<DialRotation>) -> i32 {
    let mut num_zeros: i32 = 0;
    let mut dial = Dial::new();

    dial_rotations.iter().for_each(|rotation| {
        let dial_number_before = dial.dial_number;
        dial.rotate(rotation);
        let dial_number_after = dial.dial_number;

        num_zeros += Dial::number_full_rotations(rotation.num_clicks);

        if dial_number_before != dial_number_after && dial_number_before != 0 {
            match rotation.direction {
                // 1 -> 99
                // 1 -> 0
                // 0 -> 99
                DialDirection::LEFT => {
                    if dial_number_before < dial_number_after || dial_number_after == 0 {
                        num_zeros += 1;
                    }
                }
                // 99 -> 1
                // 99 -> 0
                DialDirection::RIGHT => {
                    if dial_number_after < dial_number_before {
                        num_zeros += 1;
                    }
                }
            }
        }
    });

    return num_zeros;
}

// #[cfg(test)]
// mod tests {
//     use super::*;

//     #[test]
//     fn part1_example() {
//         assert_eq!(part1(&parse("<EXAMPLE>")), "<RESULT>");
//     }

//     #[test]
//     fn part2_example() {
//         assert_eq!(part2(&parse("<EXAMPLE>")), "<RESULT>");
//     }
// }
