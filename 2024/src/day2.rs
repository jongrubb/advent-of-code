use aoc_runner_derive::aoc;

struct ReportPart1 {
    values: Vec<u16>,
}

impl ReportPart1 {
    fn from(input: &str) -> Vec<ReportPart1> {
        input
            .lines()
            .map(|l| ReportPart1 {
                values: l
                    .split_whitespace()
                    .map(|n| n.parse::<u16>().unwrap())
                    .collect(),
            })
            .collect()
    }

    fn is_ascending(&self) -> bool {
        if self.values.len() <= 1 {
            return true;
        }

        for i in 0..self.values.len() - 1 {
            let cur = self.values.get(i).unwrap();
            let next = self.values.get(i + 1).unwrap();

            if *cur > *next {
                return false;
            }
        }

        true
    }

    fn is_descending(&self) -> bool {
        if self.values.len() <= 1 {
            return true;
        }

        for i in 0..self.values.len() - 1 {
            let cur = self.values.get(i).unwrap();
            let next = self.values.get(i + 1).unwrap();

            if *cur < *next {
                return false;
            }
        }

        true
    }

    fn values_within_range(&self, min: u16, max: u16) -> bool {
        if self.values.len() <= 1 {
            return true;
        }

        for i in 0..self.values.len() - 1 {
            let cur = self.values.get(i).unwrap();
            let next = self.values.get(i + 1).unwrap();

            let abs_diff: u16 = (*cur).abs_diff(*next);

            if !(min <= abs_diff && abs_diff <= max) {
                return false;
            }
        }

        true
    }

    fn is_safe(&self) -> bool {
        (self.is_ascending() || self.is_descending()) && self.values_within_range(1, 3)
    }
}

#[aoc(day2, part1)]
fn part1(input: &str) -> u32 {
    let reports = ReportPart1::from(input);

    reports
        .iter()
        .map(|r| r.is_safe().then(|| 1).or_else(|| Some(0)).unwrap())
        .sum()
}

struct ReportPart2 {
    values: Vec<u16>,
}

impl ReportPart2 {
    fn from(input: &str) -> Vec<ReportPart2> {
        input
            .lines()
            .map(|l| ReportPart2 {
                values: l
                    .split_whitespace()
                    .map(|n| n.parse::<u16>().unwrap())
                    .collect(),
            })
            .collect()
    }

    fn get_prev_i(item_removed: Option<usize>, i: usize) -> Option<usize> {
        match item_removed {
            Option::Some(i2) if i2 == 0 => None,
            Option::Some(i2) if i2 == (i - 1) => Some(i2 - 1),
            _ if i == 0 => None,
            _ => Some(i - 1),
        }
    }

    fn get_next_next_i(&self, i: usize) -> Option<usize> {
        if i + 2 == self.values.len() {
            None
        } else {
            Some(i + 2)
        }
    }

    fn test_values(&self, compare_values: fn(v1: &u16, v2: &u16) -> bool) -> bool {
        if self.values.len() <= 1 {
            return true;
        }

        let mut item_removed: Option<usize> = Option::None;

        for i in 0..self.values.len() - 1 {
            if item_removed.is_some_and(|item_removed_i| i == item_removed_i) {
                continue;
            }

            let prev_i = ReportPart2::get_prev_i(item_removed, i);
            let next_i = i + 1;
            let next_next_i = self.get_next_next_i(i);

            let prev = prev_i.and_then(|p_i| self.values.get(p_i));
            let cur = self.values.get(i).unwrap();
            let next = self.values.get(next_i).unwrap();
            let next_next = next_next_i.and_then(|nn_i| self.values.get(nn_i));

            if !(compare_values(cur, next) && ReportPart2::is_within_range(cur, next)) {
                if item_removed.is_some() {
                    return false;
                }

                let is_at_end_of_list = i == self.values.len() - 2;

                if is_at_end_of_list {
                    return true;
                }

                // if removing cur

                let is_previous_and_next_valid = prev.is_none()
                    || prev.is_some_and(|p| {
                        compare_values(p, next) && ReportPart2::is_within_range(p, next)
                    });
                let is_next_and_next_next_valid = next_next.is_some_and(|nn| {
                    compare_values(next, nn) && ReportPart2::is_within_range(next, nn)
                });

                if is_previous_and_next_valid && is_next_and_next_next_valid {
                    item_removed = Some(i);
                    continue;
                }

                // if removing next
                let is_cur_and_next_next_valid = next_next.is_some_and(|nn| {
                    compare_values(cur, nn) && ReportPart2::is_within_range(cur, nn)
                });

                if is_cur_and_next_next_valid {
                    item_removed = Some(i + 1);
                    continue;
                }

                return false;
            }
        }

        return true;
    }

    fn is_ascending(v1: &u16, v2: &u16) -> bool {
        *v1 < *v2
    }

    fn is_descending(v1: &u16, v2: &u16) -> bool {
        *v1 > *v2
    }

    fn is_within_range(v1: &u16, v2: &u16) -> bool {
        const MIN: u16 = 1;
        const MAX: u16 = 3;

        let abs_diff: u16 = (*v1).abs_diff(*v2);
        MIN <= abs_diff && abs_diff <= MAX
    }

    fn is_safe(&self) -> bool {
        self.test_values(ReportPart2::is_ascending) || self.test_values(ReportPart2::is_descending)
    }
}

#[aoc(day2, part2)]
fn part2(input: &str) -> u32 {
    let reports = ReportPart2::from(input);

    reports
        .iter()
        .map(|r| r.is_safe().then(|| 1).or_else(|| Some(0)).unwrap())
        .sum()
}

#[cfg(test)]
mod tests {}
