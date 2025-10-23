#!/bin/bash

BASE_PATH="../reports/ubuntu/gp/get-orders/2025-10-23-2"

# Создаём директории один раз
mkdir -p "$BASE_PATH/json/summary"
mkdir -p "$BASE_PATH/csv"

for i in {1..2}
do
  echo "🔁 Run #$i"

  mkdir -p "$BASE_PATH/json/summary"
  mkdir -p "$BASE_PATH/csv"
  mkdir -p "$BASE_PATH/html"
  
  k6 run \
    --out json="$BASE_PATH/json/result-$i.json" \
    --summary-export="$BASE_PATH/json/summary/summary-result-$i.json" \
    --out csv="$BASE_PATH/csv/result-$i.csv" \
    -e REPORT_NAME="$BASE_PATH/html/result-$i.html" \
    -e REPORT_NUMBER="$i" \
    ../get-orders.test.js
done
