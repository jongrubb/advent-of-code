use std::{
    cmp::{max, min},
    collections::HashSet,
};

use aoc_runner_derive::aoc;

type XCoordinate = usize;
type YCoordinate = usize;

#[derive(Clone, Copy)]
enum GuardDirection {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

impl GuardDirection {
    fn turn(&self) -> GuardDirection {
        match self {
            GuardDirection::UP => GuardDirection::RIGHT,
            GuardDirection::RIGHT => GuardDirection::DOWN,
            GuardDirection::DOWN => GuardDirection::LEFT,
            GuardDirection::LEFT => GuardDirection::UP,
        }
    }
}

#[derive(Clone, Copy, Hash, PartialEq, Debug)]
struct Coordinate {
    x: XCoordinate,
    y: YCoordinate,
}

impl Eq for Coordinate {}

#[derive(Clone, Copy, Debug)]
struct Obstacle {
    coordinate: Coordinate,
    obstacle_to_start: Option<Coordinate>,
    obstacle_to_end: Option<Coordinate>,
    is_obstacle: bool,
}

struct Map {
    rows: Vec<Vec<Obstacle>>,
    cols: Vec<Vec<Obstacle>>,
}

impl Map {
    fn new() -> Map {
        Map {
            rows: Vec::new(),
            cols: Vec::new(),
        }
    }

    fn determine_obstacle_to_start(last_obstacle: Option<&Obstacle>) -> Option<Coordinate> {
        last_obstacle.and_then(|last_obstacle| {
            if last_obstacle.is_obstacle {
                Some(last_obstacle.coordinate)
            } else {
                last_obstacle.obstacle_to_start
            }
        })
    }

    fn remap_obstacle_to_end(cols_or_rows: &mut Vec<Obstacle>, current_obstacle: Obstacle) {
        for i in (0..cols_or_rows.len()).rev() {
            let obstacle = cols_or_rows.get_mut(i).unwrap();

            obstacle.obstacle_to_end = Some(current_obstacle.coordinate);

            if obstacle.is_obstacle {
                break;
            }
        }
    }

    // This is a very imperfect implementation of adding a coordinate to this map. Since the input file is read left to
    // right/up to down, there are hefty assumptions made to this method in what the state of the map is in
    fn insert_obstacle(&mut self, x: XCoordinate, y: YCoordinate, is_obstacle: bool) {
        let current_obstacle_coordinate = Coordinate { x, y };

        let cols = match self.rows.get_mut(x) {
            Some(value) => value,
            None => {
                self.rows.push(Vec::new());
                self.rows.last_mut().unwrap()
            }
        };

        let last_obstacle_option = cols.last();

        let current_obstacle = Obstacle {
            coordinate: current_obstacle_coordinate,
            obstacle_to_start: Map::determine_obstacle_to_start(last_obstacle_option),
            obstacle_to_end: None,
            is_obstacle,
        };

        if is_obstacle {
            Map::remap_obstacle_to_end(cols, current_obstacle);
        }

        cols.push(current_obstacle);

        let rows = match self.cols.get_mut(y) {
            Some(value) => value,
            None => {
                self.cols.push(Vec::new());
                self.cols.last_mut().unwrap()
            }
        };

        let last_obstacle_option = rows.last();

        let current_obstacle = Obstacle {
            coordinate: current_obstacle_coordinate,
            obstacle_to_start: Map::determine_obstacle_to_start(last_obstacle_option),
            obstacle_to_end: None,
            is_obstacle,
        };

        if is_obstacle {
            Map::remap_obstacle_to_end(rows, current_obstacle);
        }

        rows.push(current_obstacle);
    }

    fn add_empty(&mut self, x: XCoordinate, y: YCoordinate) {
        self.insert_obstacle(x, y, false);
    }

    // This is a very imperfect implementation of adding a coordinate to this map. Since the input file is read left to
    // right/up to down, there are hefty assumptions made to this method in what the state of the map is in
    fn add_obstacle(&mut self, x: XCoordinate, y: YCoordinate) {
        self.insert_obstacle(x, y, true);
    }

    fn get_coordinate_infront_of_obstacle(
        &self,
        x: XCoordinate,
        y: YCoordinate,
        direction: GuardDirection,
    ) -> Option<Coordinate> {
        match direction {
            GuardDirection::UP => {
                let current_obstacle = self.cols.get(y).unwrap().get(x).unwrap();
                current_obstacle
                    .obstacle_to_start
                    .and_then(|c| Some(Coordinate { x: c.x + 1, y: c.y }))
            }
            GuardDirection::DOWN => {
                let current_obstacle = self.cols.get(y).unwrap().get(x).unwrap();
                current_obstacle
                    .obstacle_to_end
                    .and_then(|c| Some(Coordinate { x: c.x - 1, y: c.y }))
            }
            GuardDirection::LEFT => {
                let current_obstacle = self.rows.get(x).unwrap().get(y).unwrap();
                current_obstacle
                    .obstacle_to_start
                    .and_then(|c| Some(Coordinate { x: c.x, y: c.y + 1 }))
            }
            GuardDirection::RIGHT => {
                let current_obstacle = self.rows.get(x).unwrap().get(y).unwrap();
                current_obstacle
                    .obstacle_to_end
                    .and_then(|c| Some(Coordinate { x: c.x, y: c.y - 1 }))
            }
        }
    }
}

fn parse(input: &str) -> (Map, Coordinate, GuardDirection) {
    let mut map = Map::new();
    let mut guard_coordinate: Option<Coordinate> = None;

    input.lines().enumerate().for_each(|(x, line)| {
        line.split("")
            .filter(|c| !c.is_empty())
            .enumerate()
            .for_each(|(y, c)| {
                if c == "#" {
                    map.add_obstacle(x, y);
                } else if c == "^" {
                    guard_coordinate = Some(Coordinate { x, y });
                    map.add_empty(x, y);
                } else {
                    map.add_empty(x, y);
                }
            });
    });

    return (map, guard_coordinate.unwrap(), GuardDirection::UP);
}

#[aoc(day6, part1)]
fn part1(input: &str) -> usize {
    let (map, gaurd_coordinate, mut gaurd_direction) = parse(input);

    println!();

    let mut gaurd_coordinate = Some(gaurd_coordinate);

    let mut coordinates_visited: HashSet<Coordinate> = HashSet::new();

    while gaurd_coordinate.is_some() {
        let current_gaurd_coordinate = gaurd_coordinate.unwrap();

        println!(
            "({}, {})",
            current_gaurd_coordinate.x, current_gaurd_coordinate.y
        );

        let next_gaurd_coordinate_opional = map.get_coordinate_infront_of_obstacle(
            current_gaurd_coordinate.x,
            current_gaurd_coordinate.y,
            gaurd_direction,
        );

        let next_gaurd_coordinate = match gaurd_direction {
            GuardDirection::UP => next_gaurd_coordinate_opional.unwrap_or_else(|| Coordinate {
                x: 0,
                y: current_gaurd_coordinate.y,
            }),
            GuardDirection::DOWN => next_gaurd_coordinate_opional.unwrap_or_else(|| Coordinate {
                x: map.rows.len() - 1,
                y: current_gaurd_coordinate.y,
            }),
            GuardDirection::LEFT => next_gaurd_coordinate_opional.unwrap_or_else(|| Coordinate {
                x: current_gaurd_coordinate.x,
                y: 0,
            }),
            GuardDirection::RIGHT => next_gaurd_coordinate_opional.unwrap_or_else(|| Coordinate {
                x: current_gaurd_coordinate.x,
                y: map.cols.len(),
            }),
        };

        if current_gaurd_coordinate.x == next_gaurd_coordinate.x {
            for y in min(current_gaurd_coordinate.y, next_gaurd_coordinate.y)
                ..max(current_gaurd_coordinate.y, next_gaurd_coordinate.y) + 1
            {
                coordinates_visited.insert(Coordinate {
                    x: current_gaurd_coordinate.x,
                    y: y,
                });
            }
        } else {
            for x in min(current_gaurd_coordinate.x, next_gaurd_coordinate.x)
                ..max(current_gaurd_coordinate.x, next_gaurd_coordinate.x) + 1
            {
                coordinates_visited.insert(Coordinate {
                    x: x,
                    y: current_gaurd_coordinate.y,
                });
            }
        }

        gaurd_coordinate = next_gaurd_coordinate_opional;
        gaurd_direction = gaurd_direction.turn();
    }

    return coordinates_visited.len();
}

#[aoc(day6, part2)]
fn part2(input: &str) -> String {
    todo!()
}

#[cfg(test)]
mod tests {
    use super::*;
}
