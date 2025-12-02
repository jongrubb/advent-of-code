use std::{
    cmp::{max, min},
    collections::HashSet,
    panic::{self, catch_unwind},
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

    fn determine_obstacle_to_start(obstacle_before: Option<&Obstacle>) -> Option<Coordinate> {
        obstacle_before.and_then(|o| {
            if o.is_obstacle {
                Some(o.coordinate)
            } else {
                o.obstacle_to_start
            }
        })
    }

    fn determine_obstacle_to_end(obstacle_after: Option<&Obstacle>) -> Option<Coordinate> {
        obstacle_after.and_then(|o| {
            if o.is_obstacle {
                Some(o.coordinate)
            } else {
                o.obstacle_to_end
            }
        })
    }

    fn remap_obstacle_to_start(
        cols_or_rows: &mut Vec<Obstacle>,
        x_or_y: usize,
        new_obstacle: Obstacle,
    ) {
        let current_obstacle = cols_or_rows.get(x_or_y);

        if (current_obstacle.is_none() && new_obstacle.is_obstacle)
            || current_obstacle.is_some_and(|o| o.is_obstacle != new_obstacle.is_obstacle)
        {
            let remapped_cooridinate =
                if current_obstacle.is_none() || current_obstacle.is_some_and(|o| !o.is_obstacle) {
                    // if the current_obstacle has not been set or current_obstacle will switch to an obstacle, use new
                    // obstacle's coordinates
                    Some(new_obstacle.coordinate)
                } else {
                    // current_obstacle is switching to empty; use current_obstacle's obstacle_to_start
                    current_obstacle.unwrap().obstacle_to_start
                };

            for i in x_or_y + 1..cols_or_rows.len() {
                let obstacle = cols_or_rows.get_mut(i).unwrap();

                obstacle.obstacle_to_start = remapped_cooridinate;

                if obstacle.is_obstacle {
                    break;
                }
            }
        }
    }

    fn remap_obstacle_to_end(
        cols_or_rows: &mut Vec<Obstacle>,
        x_or_y: usize,
        new_obstacle: Obstacle,
    ) {
        let current_obstacle = cols_or_rows.get(x_or_y);

        if (current_obstacle.is_none() && new_obstacle.is_obstacle)
            || current_obstacle.is_some_and(|o| o.is_obstacle != new_obstacle.is_obstacle)
        {
            let remapped_cooridinate =
                if current_obstacle.is_none() || current_obstacle.is_some_and(|o| !o.is_obstacle) {
                    // if the current_obstacle has not been set or current_obstacle will switch to an obstacle, use new
                    // obstacle's coordinates
                    Some(new_obstacle.coordinate)
                } else {
                    // current_obstacle is switching to empty; use current_obstacle's obstacle_to_end
                    current_obstacle.unwrap().obstacle_to_end
                };

            for i in (0..x_or_y).rev() {
                let obstacle = cols_or_rows.get_mut(i).unwrap();

                obstacle.obstacle_to_end = remapped_cooridinate;

                if obstacle.is_obstacle {
                    break;
                }
            }
        }
    }

    fn insert_obstacle(&mut self, x: XCoordinate, y: YCoordinate, is_obstacle: bool) {
        // if already exists and is_obstacle does not change.
        if self
            .rows
            .get(x)
            .is_some_and(|cols| cols.get(y).is_some_and(|o| o.is_obstacle == is_obstacle))
        {
            return;
        }

        let current_obstacle_coordinate = Coordinate { x, y };

        let cols = match self.rows.get_mut(x) {
            Some(value) => value,
            None => {
                self.rows.push(Vec::new());
                self.rows.last_mut().unwrap()
            }
        };

        let obstacle_before = cols.get(y - 1);
        let obstacle_after = cols.get(y + 1);

        let current_obstacle = Obstacle {
            coordinate: current_obstacle_coordinate,
            obstacle_to_start: Map::determine_obstacle_to_start(obstacle_before),
            obstacle_to_end: Map::determine_obstacle_to_end(obstacle_after),
            is_obstacle,
        };

        Map::remap_obstacle_to_end(cols, current_obstacle.coordinate.y, current_obstacle);
        Map::remap_obstacle_to_start(cols, current_obstacle.coordinate.y, current_obstacle);

        if y < cols.len() {
            cols.insert(y, current_obstacle);
        } else {
            cols.push(current_obstacle);
        }

        //TODO:

        let rows = match self.cols.get_mut(y) {
            Some(value) => value,
            None => {
                self.cols.push(Vec::new());
                self.cols.last_mut().unwrap()
            }
        };

        let obstacle_before = rows.get(x - 1);
        let obstacle_after = rows.get(x + 1);

        let current_obstacle = Obstacle {
            coordinate: current_obstacle_coordinate,
            obstacle_to_start: Map::determine_obstacle_to_start(obstacle_before),
            obstacle_to_end: Map::determine_obstacle_to_end(obstacle_after),
            is_obstacle,
        };

        Map::remap_obstacle_to_end(rows, current_obstacle.coordinate.x, current_obstacle);
        Map::remap_obstacle_to_start(rows, current_obstacle.coordinate.x, current_obstacle);

        if x < rows.len() {
            rows.insert(x, current_obstacle);
        } else {
            rows.push(current_obstacle);
        }
    }

    fn add_empty(&mut self, x: XCoordinate, y: YCoordinate) {
        self.insert_obstacle(x, y, false);
    }

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

    let mut gaurd_coordinate = Some(gaurd_coordinate);

    let mut coordinates_visited: HashSet<Coordinate> = HashSet::new();

    while gaurd_coordinate.is_some() {
        let current_gaurd_coordinate = gaurd_coordinate.unwrap();

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
fn part2(input: &str) -> usize {
    return 123;
}

#[cfg(test)]
mod tests {
    use super::*;

    // TODO: add tests on Map to verify that inserting works as expected
}
