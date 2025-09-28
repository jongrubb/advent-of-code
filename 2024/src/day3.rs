use aoc_runner_derive::aoc;
use regex::{CaptureMatches, Captures, Regex};
use std::sync::LazyLock;

#[aoc(day3, part1)]
fn part1(input: &str) -> u32 {
    let mut count = 0;

    let mult_regex = Regex::new(r"mul\((?<x>\d{1,3}),(?<y>\d{1,3})\)").unwrap();

    mult_regex
        .captures_iter(input)
        .map(|capture| capture.extract())
        .map(|(_, [x, y])| {
            count = count + 1;
            let x = x.parse::<u32>().unwrap();
            let y = y.parse::<u32>().unwrap();

            x * y
        })
        .sum::<u32>()
}

#[derive(Clone, Copy, PartialEq)]
enum DoDontMarkerType {
    DO,
    DONT,
}

struct DoDontMarker {
    start_position: usize,
    marker_type: DoDontMarkerType,
}

impl DoDontMarker {
    fn new(matches: Option<Captures>) -> Option<DoDontMarker> {
        if matches.is_none() {
            return None;
        }

        let captures = matches.unwrap();

        let do_match = captures.name("do");
        let dont_match = captures.name("dont");

        if do_match.is_some() {
            return Some(DoDontMarker {
                start_position: do_match.unwrap().start(),
                marker_type: DoDontMarkerType::DO,
            });
        }

        return Some(DoDontMarker {
            start_position: dont_match.unwrap().start(),
            marker_type: DoDontMarkerType::DONT,
        });
    }

    fn is_before(&self, position: &usize) -> bool {
        return self.start_position < *position;
    }

    fn is_after(&self, position: &usize) -> bool {
        return *position < self.start_position;
    }
}

impl Clone for DoDontMarker {
    fn clone(&self) -> DoDontMarker {
        DoDontMarker {
            start_position: self.start_position,
            marker_type: self.marker_type,
        }
    }
}
struct DoDontMarkerIterator<'i> {
    _input: &'i str,
    iter: CaptureMatches<'static, 'i>,
    cur_marker: Option<DoDontMarker>,
    next_marker: Option<DoDontMarker>,
}

static DO_DONT_REGEX: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"(?<do>do\(\))|(?<dont>don't\(\))").unwrap());

impl<'i> DoDontMarkerIterator<'i> {
    fn new<'i2>(input: &'i2 str) -> DoDontMarkerIterator<'i2> {
        DoDontMarkerIterator {
            _input: input,
            iter: DO_DONT_REGEX.captures_iter(input),
            cur_marker: None,
            next_marker: None,
        }
    }

    fn get_marker(&mut self, position: &usize) -> DoDontMarker {
        if self.cur_marker.is_none() {
            let first_marker = self
                .next_marker
                .get_or_insert_with(|| DoDontMarker::new(self.iter.next()).unwrap());

            if first_marker.is_before(position) {
                self.cur_marker = Some(first_marker.clone());
                self.next_marker = DoDontMarker::new(self.iter.next());
            } else {
                return DoDontMarker {
                    start_position: 0,
                    marker_type: DoDontMarkerType::DO,
                };
            }
        }

        let cur_marker = self.cur_marker.as_ref().unwrap();
        let next_marker = self.next_marker.as_ref();

        if (cur_marker.is_before(position) && next_marker.is_some_and(|nm| nm.is_after(position)))
            || next_marker.is_none()
        {
            return cur_marker.clone();
        }

        let mut next_marker = self.next_marker.as_ref().unwrap().clone();

        while next_marker.is_after(position) {
            let next_next_marker = DoDontMarker::new(self.iter.next());

            if next_next_marker.is_none() {
                self.cur_marker = Some(next_marker.clone());
                self.next_marker = None;
                return self.cur_marker.as_ref().unwrap().clone();
            }

            next_marker = next_next_marker.unwrap().clone();
        }

        self.cur_marker = Some(next_marker.clone());

        self.next_marker = DoDontMarker::new(self.iter.next());

        return self.cur_marker.as_ref().unwrap().clone();
    }
}

#[aoc(day3, part2)]
fn part2(input: &str) -> u32 {
    let mut do_dont_iter = DoDontMarkerIterator::new(input);

    let mult_regex = Regex::new(r"mul\((?<x>\d{1,3}),(?<y>\d{1,3})\)").unwrap();

    mult_regex
        .captures_iter(input)
        .map(|capture| {
            let capture_x = capture.name("x").unwrap();
            let capture_y = capture.name("y").unwrap();

            let x = capture_x.as_str().parse::<u32>().unwrap();
            let y = capture_y.as_str().parse::<u32>().unwrap();

            let position = capture_x.start();

            let do_dont_marker = do_dont_iter.get_marker(&position);

            if do_dont_marker.marker_type == DoDontMarkerType::DO {
                return x * y;
            } else {
                return 0;
            }
        })
        .sum::<u32>()
}

#[cfg(test)]
mod tests {
    use crate::day3::part1;

    #[test]
    fn test() {
        assert_eq!(
            part1(
                "xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))
            xmul(2,4)%&mul[3,7]!@^do_not_mul(5,5)+mul(32,64]then(mul(11,8)mul(8,5))"
            ),
            161 + 161
        )
    }
}
