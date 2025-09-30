use aoc_runner_derive::aoc;

fn parse(input: &str) -> Vec<Vec<char>> {
    input
        .lines()
        .map(|line| line.chars().map(|c| c).collect())
        .collect()
}

const XMAS_FORWARDS: [char; 4] = ['X', 'M', 'A', 'S'];
const XMAS_BACKWARDS: [char; 4] = ['S', 'A', 'M', 'X'];

struct WordSearch {
    word_search: Vec<Vec<char>>,
    cur_item: Option<WordSearchItem>,
    save_point: Option<WordSearchItem>,
    num_rows: usize,
    num_cols: usize,
}

struct WordSearchItem {
    row_i: usize,
    col_i: usize,
    character: char,
}

impl Clone for WordSearchItem {
    fn clone(&self) -> WordSearchItem {
        WordSearchItem {
            row_i: self.row_i,
            col_i: self.col_i,
            character: self.character,
        }
    }
}

impl Iterator for WordSearch {
    type Item = WordSearchItem;

    fn next(&mut self) -> Option<WordSearchItem> {
        if self.cur_item.is_none() {
            panic!("cannot retrieve next item; cur_item is none!");
        }

        let cur_item = self.cur_item.as_ref().unwrap();

        let mut next_col_i = cur_item.col_i + 1;
        let mut next_row_i = cur_item.row_i;

        if self.num_cols <= cur_item.col_i + 1 {
            next_col_i = 0;
            next_row_i = next_row_i + 1;
        }

        if self.num_rows <= next_row_i {
            return self.set_cur_item_none();
        }

        self.set_cur_item(next_row_i, next_col_i)
    }
}

trait WordSearchIterator: Iterator {
    fn save_point(&mut self) -> Option<WordSearchItem>;

    fn reset_save_point(&mut self);

    fn reset_save_point_to_item(&mut self, word_search_item: &Option<WordSearchItem>);

    fn right(&mut self) -> Option<WordSearchItem>;

    fn down(&mut self) -> Option<WordSearchItem>;

    fn down_right(&mut self) -> Option<WordSearchItem>;

    fn down_left(&mut self) -> Option<WordSearchItem>;
}

impl WordSearchIterator for WordSearch {
    fn save_point(&mut self) -> Option<WordSearchItem> {
        self.save_point = self.cur_item.clone();
        return self.save_point.clone();
    }

    fn reset_save_point(&mut self) {
        self.reset_save_point_to_item(&self.save_point.clone());
    }

    fn reset_save_point_to_item(&mut self, word_search_item: &Option<WordSearchItem>) {
        self.cur_item = word_search_item.clone()
    }

    fn right(&mut self) -> Option<WordSearchItem> {
        if self.cur_item.is_none() {
            return self.cur_item.clone();
        }

        let cur_item = self.cur_item.as_ref().unwrap();

        if self.num_cols <= cur_item.col_i + 1 {
            return self.set_cur_item_none();
        }

        self.set_cur_item(cur_item.row_i, cur_item.col_i + 1)
    }

    fn down(&mut self) -> Option<WordSearchItem> {
        if self.cur_item.is_none() {
            return self.cur_item.clone();
        }

        let cur_item = self.cur_item.as_ref().unwrap();

        if self.num_rows <= cur_item.row_i + 1 {
            return self.set_cur_item_none();
        }

        self.set_cur_item(cur_item.row_i + 1, cur_item.col_i)
    }

    fn down_right(&mut self) -> Option<WordSearchItem> {
        if self.cur_item.is_none() {
            return self.cur_item.clone();
        }

        let cur_item = self.cur_item.as_ref().unwrap();

        if self.num_cols <= cur_item.col_i + 1 || self.num_rows <= cur_item.row_i + 1 {
            return self.set_cur_item_none();
        }

        self.set_cur_item(cur_item.row_i + 1, cur_item.col_i + 1)
    }

    fn down_left(&mut self) -> Option<WordSearchItem> {
        if self.cur_item.is_none() {
            return self.cur_item.clone();
        }

        let cur_item = self.cur_item.as_ref().unwrap();

        if cur_item.col_i == 0 || self.num_rows <= cur_item.row_i + 1 {
            return self.set_cur_item_none();
        }

        self.set_cur_item(cur_item.row_i + 1, cur_item.col_i - 1)
    }
}

impl WordSearch {
    fn new(input: &str) -> WordSearch {
        let word_search = parse(input);
        let row_one = word_search.get(0).unwrap();

        WordSearch {
            word_search: word_search.clone(),
            cur_item: Some(WordSearchItem {
                row_i: 0,
                col_i: 0,
                character: *word_search.get(0).unwrap().get(0).unwrap(),
            }),
            save_point: None,
            num_rows: word_search.len(),
            num_cols: row_one.len(),
        }
    }

    fn set_cur_item(&mut self, next_row_i: usize, next_col_i: usize) -> Option<WordSearchItem> {
        self.cur_item = Some(WordSearchItem {
            row_i: next_row_i,
            col_i: next_col_i,
            character: self.get_char(next_row_i, next_col_i),
        });

        self.cur_item.clone()
    }

    fn set_cur_item_none(&mut self) -> Option<WordSearchItem> {
        self.cur_item = None;

        return None;
    }

    fn get_char(&self, row_i: usize, col_i: usize) -> char {
        return *self.word_search.get(row_i).unwrap().get(col_i).unwrap();
    }
}

fn found_rest_of_word(
    word_search: &mut WordSearch,
    rest_word: Vec<char>,
    get_next_item: fn(word_search: &mut WordSearch) -> Option<WordSearchItem>,
) -> bool {
    for c in rest_word {
        let item = get_next_item(word_search);

        match item {
            Some(value) if value.character == c => {
                continue;
            }
            _ => {
                return false;
            }
        };
    }

    return true;
}

fn get_count_in_all_directions(
    word_search: &mut WordSearch,
    xmas_word: [char; 4],
    word_search_item: &WordSearchItem,
) -> u8 {
    let mut count: u8 = 0;

    let [first_character, rest_word @ ..] = xmas_word;

    if word_search_item.character == first_character {
        word_search.save_point();

        if found_rest_of_word(word_search, rest_word.to_vec(), |word_search| {
            word_search.right()
        }) {
            count = count + 1;
        }

        word_search.reset_save_point();

        if found_rest_of_word(word_search, rest_word.to_vec(), |word_search| {
            word_search.down()
        }) {
            count = count + 1;
        }

        word_search.reset_save_point();

        if found_rest_of_word(word_search, rest_word.to_vec(), |word_search| {
            word_search.down_right()
        }) {
            count = count + 1;
        }

        word_search.reset_save_point();

        if found_rest_of_word(word_search, rest_word.to_vec(), |word_search| {
            word_search.down_left()
        }) {
            count = count + 1;
        }

        word_search.reset_save_point();
    }

    return count;
}

#[aoc(day4, part1)]
fn part1(input: &str) -> u32 {
    let mut word_search = WordSearch::new(input);

    let mut count: u32 = 0;

    let mut word_search_item = word_search.next();

    while word_search_item.is_some() {
        count = count
            + get_count_in_all_directions(
                &mut word_search,
                XMAS_FORWARDS,
                word_search_item.as_ref().unwrap(),
            ) as u32;
        count = count
            + get_count_in_all_directions(
                &mut word_search,
                XMAS_BACKWARDS,
                word_search_item.as_ref().unwrap(),
            ) as u32;

        word_search_item = word_search.next();
    }

    return count;
}

const MAS: [char; 3] = ['M', 'A', 'S'];
const SAM: [char; 3] = ['S', 'A', 'M'];

fn is_mas_shaped_x(word_search: &mut WordSearch, word_search_item: &WordSearchItem) -> bool {
    let [mas_first_character, mas_rest_word @ ..] = MAS;
    let [sam_first_character, sam_rest_word @ ..] = SAM;

    word_search.save_point();

    let mut found_down_right = false;

    if mas_first_character == word_search_item.character
        && found_rest_of_word(word_search, mas_rest_word.to_vec(), |word_search| {
            word_search.down_right()
        })
    {
        found_down_right = true;
    }

    word_search.reset_save_point();

    if !found_down_right
        && sam_first_character == word_search_item.character
        && found_rest_of_word(word_search, sam_rest_word.to_vec(), |word_search| {
            word_search.down_right()
        })
    {
        found_down_right = true;
    }

    word_search.reset_save_point();

    let mut found_down_left = false;

    if found_down_right {
        word_search.right();
        let down_left_item_start_option = word_search.right();

        if down_left_item_start_option.is_some() {
            let down_left_item_start = down_left_item_start_option.clone().unwrap();

            if mas_first_character == down_left_item_start.character
                && found_rest_of_word(word_search, mas_rest_word.to_vec(), |word_search| {
                    word_search.down_left()
                })
            {
                found_down_left = true;
            }

            word_search.reset_save_point_to_item(&down_left_item_start_option);

            if !found_down_left
                && sam_first_character == down_left_item_start.character
                && found_rest_of_word(word_search, sam_rest_word.to_vec(), |word_search| {
                    word_search.down_left()
                })
            {
                found_down_left = true;
            }
        }

        word_search.reset_save_point();
    }

    return found_down_right && found_down_left;
}

#[aoc(day4, part2)]
fn part2(input: &str) -> u32 {
    let mut word_search = WordSearch::new(input);

    let mut count: u32 = 0;

    let mut word_search_item = word_search.next();

    while word_search_item.is_some() {
        if is_mas_shaped_x(&mut word_search, word_search_item.as_ref().unwrap()) {
            count = count + 1;
        }

        word_search_item = word_search.next();
    }

    return count;
}

#[cfg(test)]
mod tests {}
