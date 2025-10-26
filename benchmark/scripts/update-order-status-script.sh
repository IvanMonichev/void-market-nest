#!/bin/bash

DATE_STR="${BENCHMARK_DATE:-$(date +%Y-%m-%d)}"
# BASE_PATH=".././reports/linux-sasha/asp/update-status/$DATE_STR"
BASE_PATH="../reports/ubuntu/nest/update-order-status/$DATE_STR"

# Создаём директории один раз
mkdir -p "$BASE_PATH/json"
# mkdir -p "$BASE_PATH/csv"
mkdir -p "$BASE_PATH/html"

for i in {1..10}
do
  echo "🔁 Run #$i"

  k6 run  \
    --summary-export="$BASE_PATH/json/summary-result-$i.json" \
    -e REPORT_NAME="$BASE_PATH/html/result-$i.html" \
    -e REPORT_NUMBER="$i" \
    ../update-order-status.test.js
done
