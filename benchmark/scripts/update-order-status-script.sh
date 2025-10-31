#!/bin/bash
set -euo pipefail

# =============== ПАРАМЕТРЫ ======================
TARGET="${TARGET:-ASP}" # Возможные значения: GO, NEST, ASP
DATE_STR="${BENCHMARK_DATE:-$(date +%Y-%m-%d)}"
PROM_URL="http://localhost:9090/api/v1/query"

BASE_PATH="../results/${TARGET,,}/update-order-status/$DATE_STR"
JSON_DIR="$BASE_PATH/json/metrics"
SUMMARY_DIR="$BASE_PATH/json/summary"
HTML_DIR="$BASE_PATH/html"

# Создание директорий
mkdir -p "$JSON_DIR" "$SUMMARY_DIR" "$HTML_DIR"

# =============== МАППИНГ КОНТЕЙНЕРОВ ======================
case "$TARGET" in
  "GO")
    CONTAINERS=("gin.gateway" "gin.order-svc" "gin.payment-svc" "gin.user-svc")
    ;;
  "NEST")
    CONTAINERS=("nest.gateway" "nest.order-svc" "nest.payment-svc" "nest.user-svc")
    ;;
  "ASP")
    CONTAINERS=("asp.gateway" "asp.order-svc" "asp.payment-svc" "asp.users-svc")
    ;;
  *)
    echo "❌ Unknown TARGET: $TARGET"
    exit 1
    ;;
esac

# =============== ФУНКЦИЯ ЗАПРОСА ======================
fetch_prometheus_value() {
  local query="$1"
  local value

  value=$(curl -sG "$PROM_URL" --data-urlencode "query=$query" \
    | jq -r '.data.result[0].value[1] // "0"')

  if [[ -z "$value" || "$value" == "NaN" ]]; then
    echo "0"
  else
    printf "%.4f" "$value"
  fi
}

# =============== ОСНОВНОЙ ЦИКЛ ======================
for i in {1..10}; do
  echo "🔁 Run #$i for $TARGET"

  RUN_JSON="$JSON_DIR/metrics-run-$i.json"
  SUMMARY_JSON="$SUMMARY_DIR/summary-result-$i.json"
  HTML_REPORT="$HTML_DIR/result-$i.html"
  TMP_FILE=$(mktemp)

  echo "[" > "$TMP_FILE"

  # ---- Прогон теста ----
  k6 run \
    --summary-export="$SUMMARY_JSON" \
    -e REPORT_NAME="$HTML_REPORT" \
    -e REPORT_NUMBER="$i" \
    ../update-order-status.test.js

  echo "📊 Collecting Prometheus metrics..."

  for idx in "${!CONTAINERS[@]}"; do
    container="${CONTAINERS[$idx]}"

    # Средняя загрузка CPU (%) за 30 секунд
    CPU_QUERY="rate(container_cpu_usage_seconds_total{container_label_com_docker_compose_service=\"${container}\"}[30s])*100"
    CPU=$(fetch_prometheus_value "$CPU_QUERY")

    # Среднее использование памяти за 1 минуту (MB)
    MEM_QUERY="avg_over_time(container_memory_usage_bytes{container_label_com_docker_compose_service=\"${container}\"}[1m])/(1024*1024)"
    MEM=$(fetch_prometheus_value "$MEM_QUERY")

    printf '  { "container": "%s", "cpu_percent": %s, "mem_mb": %s }' \
      "$container" "$CPU" "$MEM" >> "$TMP_FILE"

    if [ $idx -lt $((${#CONTAINERS[@]} - 1)) ]; then
      echo "," >> "$TMP_FILE"
    else
      echo "" >> "$TMP_FILE"
    fi
  done

  echo "]" >> "$TMP_FILE"
  mv "$TMP_FILE" "$RUN_JSON"

  echo "✅ Saved metrics: $RUN_JSON"
done

echo "🎯 Benchmark complete. All JSON metrics saved in: $JSON_DIR"
