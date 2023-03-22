const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database(`../../livesporttools-api-v2-main/example-app/history.db`);

let arr = [];

db.all(`SELECT * FROM data
WHERE now IN (
  SELECT MAX(now)
  FROM data
  GROUP BY id
) AND id IS NOT NULL AND
is_live IS NOT NULL AND
start_time <> 0 AND
score1 IS NOT NULL AND
score2 IS NOT NULL AND
draw IS NOT NULL AND
first IS NOT NULL AND
second IS NOT NULL AND
now IS NOT NULL;
`, [], function(err, rows) {
    if (err) {
        throw err;
    }
    rows.forEach(function(row) {
        arr.push(row);
        console.log(row);
    });
    // fs.writeFile('out_data.json', JSON.stringify(arr), function(err) {});
    // console.log(arr);
});

db.close();
