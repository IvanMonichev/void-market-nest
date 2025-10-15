#!/bin/bash

BASE_PATH="reports/mac/nest-2/get-order"

# Создание нужных директорий
mkdir -p "$BASE_PATH/json/summary"
mkdir -p "$BASE_PATH/csv"

for i in {1..5}
do
  echo "🔁 Run #$i"
  k6 run get-order.test.js \
    --out json="$BASE_PATH/json/result-$i.json" \
    --summary-export="$BASE_PATH/json/summary/summary-result-$i.json" \
    --out csv="$BASE_PATH/csv/result-$i.csv"
done
