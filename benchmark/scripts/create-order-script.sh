#!/bin/bash

BASE_PATH="../reports/ubuntu/asp/create-order/2025-10-24"

mkdir -p "$BASE_PATH/json/summary"
mkdir -p "$BASE_PATH/csv"

# Создание нужных директорий
mkdir -p "$BASE_PATH/json/summary"
mkdir -p "$BASE_PATH/csv"

for i in {1..10}
do
  echo "🔁 Run #$i"

  mkdir -p "$BASE_PATH/json/summary"
  mkdir -p "$BASE_PATH/csv"
  mkdir -p "$BASE_PATH/html"

  k6 run  \
    --out json="$BASE_PATH/json/result-$i.json" \
    --summary-export="$BASE_PATH/json/summary/summary-result-$i.json" \
    --out csv="$BASE_PATH/csv/result-$i.csv" \
    -e REPORT_NAME="$BASE_PATH/html/result-$i.html" \
    -e REPORT_NUMBER="$i" \
    ../create-order.test.js
done
