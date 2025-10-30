#!/bin/bash
set -e

# =============== ПАРАМЕТРЫ ======================
TARGET="${TARGET:-GO}" # Возможные значения: GO, NEST, ASP
DATE_STR="${BENCHMARK_DATE:-$(date +%Y-%m-%d)}"
PROM_URL="http://localhost:9090/api/v1/query"

BASE_PATH="../results/${TARGET,,}/get-orders/$DATE_STR"
JSON_DIR="$BASE_PATH/json/metrics"

# Создаём директории
mkdir -p "$BASE_PATH/json/summary" "$JSON_DIR" "$BASE_PATH/html"

# =============== МАППИНГ КОНТЕЙНЕРОВ ======================
case "$TARGET" in
  "GO")
    CONTAINERS=("gin.gateway" "gin.order-svc" "gin.payment-svc" "gin.user-svc")
    ;;
  "NEST")
    CONTAINERS=("nest.gateway" "nest.order-svc" "nest.payment-svc")
    ;;
  "ASP")
    CONTAINERS=("asp.gateway" "asp.order-svc" "asp.payment-svc")
    ;;
  *)
    echo "❌ Unknown TARGET: $TARGET"
    exit 1
    ;;
esac

# =============== ОСНОВНОЙ ЦИКЛ ======================
for i in {1..10}
do
  echo "🔁 Run #$i for $TARGET"

  RUN_JSON="$JSON_DIR/metrics-run-$i.json"
  TMP_FILE=$(mktemp)
  echo "[" > "$TMP_FILE"

  # Прогон теста
  k6 run \
    --summary-export="$BASE_PATH/json/result-$i.json" \
    -e REPORT_NAME="$BASE_PATH/html/result-$i.html" \
    -e REPORT_NUMBER="$i" \
    ../get-orders.test.js

  echo "📊 Collecting Prometheus metrics..."

  for idx in "${!CONTAINERS[@]}"; do
    container="${CONTAINERS[$idx]}"

    CPU=$(curl -sG "$PROM_URL" \
      --data-urlencode 'query=rate(container_cpu_usage_seconds_total{container_label_com_docker_compose_service="'"${container}"'"}[30s])*100' \
      | jq -r '.data.result[0].value[1]')

    MEM=$(curl -sG "$PROM_URL" \
      --data-urlencode 'query=container_memory_usage_bytes{container_label_com_docker_compose_service="'"${container}"'"}/(1024*1024)' \
      | jq -r '.data.result[0].value[1]')

    # Формируем JSON-объект
    printf '  { "container": "%s", "cpu_percent": %.4f, "mem_mb": %.4f }' "$container" "$CPU" "$MEM" >> "$TMP_FILE"

    # Добавляем запятую, если это не последний элемент
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
