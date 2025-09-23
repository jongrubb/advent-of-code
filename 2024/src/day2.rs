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

#[aoc(day2, part2)]
fn part2(input: &str) -> u32 {
    let mut sum = 0;

    sum
}

#[cfg(test)]
mod tests {}
