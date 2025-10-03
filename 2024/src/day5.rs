use std::{
    collections::{HashMap, HashSet},
    hash::Hash,
};

use aoc_runner_derive::aoc;

struct PageOrderingRule {
    page_before: u16,
    page_after: u16,
}

struct PageOrderingRules {
    page_numbers_before_map: HashMap<u16, HashSet<u16>>,
    page_numbers_after_map: HashMap<u16, HashSet<u16>>,
}

impl PageOrderingRules {
    fn new() -> PageOrderingRules {
        return PageOrderingRules {
            page_numbers_before_map: HashMap::new(),
            page_numbers_after_map: HashMap::new(),
        };
    }

    fn new_and_populate(rules: &Vec<PageOrderingRule>) -> PageOrderingRules {
        let mut page_ordering_rules = PageOrderingRules::new();

        for rule in rules {
            page_ordering_rules.add(rule);
        }

        page_ordering_rules
    }

    fn add(&mut self, page_ordering_rule: &PageOrderingRule) {
        let page_numbers_before = self
            .page_numbers_before_map
            .entry(page_ordering_rule.page_after)
            .or_insert(HashSet::new());
        page_numbers_before.insert(page_ordering_rule.page_before);

        let page_numbers_after = self
            .page_numbers_after_map
            .entry(page_ordering_rule.page_before)
            .or_insert(HashSet::new());
        page_numbers_after.insert(page_ordering_rule.page_after);
    }

    fn is_page_number_before(&self, page_number_before: u16, page_number: u16) -> bool {
        self.page_numbers_before_map
            .get(&page_number)
            .is_some_and(|page_numbers_before| page_numbers_before.contains(&page_number_before))
    }

    fn page_numbers_are_before(&self, page_numbers_before: &Vec<u16>, page_number: u16) -> bool {
        page_numbers_before
            .iter()
            .find(|page_number_before| {
                !self.is_page_number_before(**page_number_before, page_number)
            })
            .is_none()
    }

    fn is_page_number_after(&self, page_number_after: u16, page_number: u16) -> bool {
        self.page_numbers_after_map
            .get(&page_number)
            .is_some_and(|page_numbers_after| page_numbers_after.contains(&page_number_after))
    }

    fn page_numbers_are_after(&self, page_numbers_after: &Vec<u16>, page_number: u16) -> bool {
        page_numbers_after
            .iter()
            .find(|page_number_after| !self.is_page_number_after(**page_number_after, page_number))
            .is_none()
    }
}

fn parse(input: &str) -> (Vec<PageOrderingRule>, Vec<Vec<u16>>) {
    let split_vec: Vec<&str> = input.split("\n\n").collect();

    let page_ordering_rules = split_vec.get(0).unwrap();

    let page_ordering_rules: Vec<PageOrderingRule> = page_ordering_rules
        .lines()
        .map(|l| {
            let parsed_page_numbers: Vec<u16> =
                l.split("|").map(|n| n.parse::<u16>().unwrap()).collect();
            let page_before = parsed_page_numbers.get(0).unwrap();
            let page_after = parsed_page_numbers.get(1).unwrap();
            PageOrderingRule {
                page_before: *page_before,
                page_after: *page_after,
            }
        })
        .collect();

    let page_orderings = split_vec.get(1).unwrap();

    let page_orderings: Vec<Vec<u16>> = page_orderings
        .lines()
        .map(|l| l.split(",").map(|n| n.parse::<u16>().unwrap()).collect())
        .collect();

    return (page_ordering_rules, page_orderings);
}

fn get_middle(numbers: &Vec<u16>) -> u16 {
    *numbers.get((numbers.len() - 1) / 2).unwrap()
}

#[aoc(day5, part1)]
fn part1(input: &str) -> u16 {
    let (rules, page_orderings) = parse(input);

    let page_ordering_rules = PageOrderingRules::new_and_populate(&rules);

    page_orderings
        .iter()
        .filter_map(|page_ordering| {
            let mut page_numbers_before: Vec<u16> = Vec::new();
            let mut page_numbers_after: Vec<u16> = page_ordering.iter().copied().collect();

            let mut are_page_numbers_in_proper_order = true;

            while !page_numbers_after.is_empty() {
                let page_number = page_numbers_after.remove(0);

                if !page_ordering_rules.page_numbers_are_before(&page_numbers_before, page_number)
                    || !page_ordering_rules.page_numbers_are_after(&page_numbers_after, page_number)
                {
                    are_page_numbers_in_proper_order = false;
                    break;
                }

                page_numbers_before.push(page_number);
            }

            are_page_numbers_in_proper_order.then_some(get_middle(page_ordering))
        })
        .sum()
}

#[aoc(day5, part2)]
fn part2(input: &str) -> String {
    todo!()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn part1_example() {
        assert_eq!(part1(&parse("<EXAMPLE>")), "<RESULT>");
    }

    #[test]
    fn part2_example() {
        assert_eq!(part2(&parse("<EXAMPLE>")), "<RESULT>");
    }
}
