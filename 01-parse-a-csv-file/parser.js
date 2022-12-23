/**
 * @param {*} raw_csv : a string containing raw csv data
 * @returns a 2-dimensional array of parsed data
 */
export const parse_to_2d_array = (raw_csv) => {
  const str_delimiter = ",";

  // Create a regular expression to parse the CSV values.
  let objPattern = new RegExp(
    // Delimiters.
    "(\\" +
      str_delimiter +
      "|\\r?\\n|\\r|^)" +
      // Quoted fields.
      '(?:"([^"]*(?:""[^"]*)*)"|' +
      // Standard fields.
      '([^"\\' +
      str_delimiter +
      "\\r\\n]*))",
    "gi"
  );

  // create empty array for parsed data
  let array_data = [[]];
  let str_matched_value;

  // Create an array to hold our individual pattern
  // matching groups.
  let array_matches = objPattern.exec(raw_csv);

  // loop until there are no more matches
  while (array_matches) {
    let str_matched_delimiter = array_matches[1];

    if (str_matched_delimiter.length && str_matched_delimiter !== str_delimiter) {
      array_data.push([]);
    }

    if (array_matches[2]) {
      str_matched_value = array_matches[2].replace(new RegExp('""', "g"), '"');
    } else {
      str_matched_value = array_matches[3];
    }

    str_matched_value = str_matched_value || '';
    array_data[array_data.length - 1].push(str_matched_value);
    array_matches = objPattern.exec(raw_csv);
  }

  // The array may have a one-element array with an empty string.
  // remove it from the data array, as it will not work as intended.
  return array_data.filter(
    (item) => array_data[0].length === item.length
  );
};

/**
 * 
 * @param {*} csv_array: A 2-dimensional array of data parsed from
 *  a csv file
 * @returns an array of objects, with the header as the keys
 */
export const array_of_objects = (csv_array) => {
  // The keys are the first element of the array
  const keys = csv_array[0].slice();
  // The data is everything else
  const data = csv_array.slice(1);

  const formed_array = data.map((item) => {
    const object = {};
    keys.forEach((key, index) => (object[key] = item.at(index)));
    return object;
  });
  return formed_array;
};

/**
 * Parses a raw string to an array of objects.
 * @param {*} csv_data: raw csv string 
 * @returns an array of objects parsed from csv_data
 */
export const parse = (csv_data) => {
  const array_2d = parse_to_2d_array(csv_data);
  return array_of_objects(array_2d);
}

export default {
  parse_to_2d_array,
  array_of_objects,
  parse
}
