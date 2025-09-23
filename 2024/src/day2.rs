use std::fs::remove_dir;

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

struct ReportSafetyTestResult {
    pass: bool,
    removed_count: u8,
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

    fn at_end_of_list(&self, i: usize) -> bool {
        i == self.values.len() - 2
    }

    fn is_ascending(v1: &u16, v2: &u16) -> bool {
        *v1 > *v2
    }

    fn are_values_ascending(&self) -> ReportSafetyTestResult {
        if self.values.len() <= 1 {
            return ReportSafetyTestResult {
                pass: true,
                removed_count: 0,
            };
        }

        let mut num_times_removed = 0;

        for i in 0..self.values.len() - 1 {
            let prev = self.values.get(i - 1);
            let cur = self.values.get(i).unwrap();
            let next = self.values.get(i + 1).unwrap();

            if ReportPart2::is_ascending(cur, next) {
                if prev.is_none()
                    || prev.is_some_and(|p| ReportPart2::is_ascending(p, next))
                    || self.at_end_of_list(i)
                {
                    num_times_removed += 1;
                }

                if num_times_removed > 1 {
                    return ReportSafetyTestResult {
                        pass: false,
                        removed_count: num_times_removed,
                    };
                }
            }
        }

        return ReportSafetyTestResult {
            pass: true,
            removed_count: num_times_removed,
        };
    }

    fn is_descending(v1: &u16, v2: &u16) -> bool {
        *v1 < *v2
    }

    fn are_vales_descending(&self) -> ReportSafetyTestResult {
        if self.values.len() <= 1 {
            return ReportSafetyTestResult {
                pass: true,
                removed_count: 0,
            };
        }

        let mut num_times_removed = 0;

        for i in 0..self.values.len() - 1 {
            let prev = self.values.get(i - 1);
            let cur = self.values.get(i).unwrap();
            let next = self.values.get(i + 1).unwrap();

            if ReportPart2::is_descending(cur, next) {
                if prev.is_none()
                    || prev.is_some_and(|p| ReportPart2::is_descending(p, next))
                    || self.at_end_of_list(i)
                {
                    num_times_removed += 1;
                }

                if num_times_removed > 1 {
                    return ReportSafetyTestResult {
                        pass: false,
                        removed_count: num_times_removed,
                    };
                }
            }
        }

        return ReportSafetyTestResult {
            pass: true,
            removed_count: num_times_removed,
        };
    }

    fn is_within_range(v1: &u16, v2: &u16, min: u16, max: u16) -> bool {
        let abs_diff: u16 = (*v1).abs_diff(*v2);
        min <= abs_diff && abs_diff <= max
    }

    fn values_within_range(&self, min: u16, max: u16) -> ReportSafetyTestResult {
        if self.values.len() <= 1 {
            return ReportSafetyTestResult {
                pass: true,
                removed_count: 0,
            };
        }

        let mut num_times_removed = 0;

        for i in 0..self.values.len() - 1 {
            let prev = self.values.get(i - 1);
            let cur = self.values.get(i).unwrap();
            let next = self.values.get(i + 1).unwrap();

            if !(ReportPart2::is_within_range(cur, next, min, max)) {
                if prev.is_none()
                    || prev.is_some_and(|p| ReportPart2::is_within_range(p, next, min, max))
                    || self.at_end_of_list(i)
                {
                    num_times_removed += 1;
                }

                if num_times_removed > 1 {
                    return ReportSafetyTestResult {
                        pass: false,
                        removed_count: num_times_removed,
                    };
                }
            }
        }

        return ReportSafetyTestResult {
            pass: true,
            removed_count: num_times_removed,
        };
    }

    // integrate within range test directly into asc/desc methods instead of returning a test result
    // does not work right now because we are not verifying if we are removing the same elements.
    fn is_safe(&self) -> bool {
        let ascending_result = self.are_values_ascending();

        if ascending_result.pass {
            let within_range_result = self.values_within_range(1, 3);

            return within_range_result.pass
                && ascending_result.removed_count + within_range_result.removed_count <= 1;
        }

        let descending_result = self.are_vales_descending();

        if descending_result.pass {
            let within_range_result = self.values_within_range(1, 3);

            return within_range_result.pass
                && descending_result.removed_count + within_range_result.removed_count <= 1;
        }

        return false;
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
