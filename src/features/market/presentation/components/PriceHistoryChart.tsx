import { useState } from "react";
import { LayoutChangeEvent, Text, View } from "react-native";
import Svg, { Circle, Line, Polyline } from "react-native-svg";
import tw from "twrnc";

import { useAppTheme } from "../../../../core/theme/useAppTheme";
import { useThemeStyles } from "../../../../core/theme/useThemeStyles";
import { PricePoint } from "../../domain/entities/PricePoint";

type PriceHistoryChartProps = {
  points: PricePoint[];
  accessibilityLabel: string;
};

const CHART_HEIGHT = 180;
const HORIZONTAL_PADDING = 12;
const VERTICAL_PADDING = 16;

export function PriceHistoryChart({
  points,
  accessibilityLabel,
}: PriceHistoryChartProps) {
  const [chartWidth, setChartWidth] = useState(0);

  const { isDark } = useAppTheme();
  const { styles } = useThemeStyles();

  function handleLayout(event: LayoutChangeEvent) {
    const width = event.nativeEvent.layout.width;

    setChartWidth(width);
  }

  if (points.length < 2) {
    return null;
  }

  const prices = points.map((point) => point.priceUsd);

  const minimumPrice = Math.min(...prices);
  const maximumPrice = Math.max(...prices);
  const priceRange = maximumPrice - minimumPrice;
  const safePriceRange = priceRange === 0 ? 1 : priceRange;

  const drawableWidth = chartWidth - HORIZONTAL_PADDING * 2;

  const drawableHeight = CHART_HEIGHT - VERTICAL_PADDING * 2;

  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  const hasIncreased = lastPoint.priceUsd >= firstPoint.priceUsd;

  const lineColor = hasIncreased ? "#10b981" : "#ef4444";

  const gridColor = isDark ? "#404040" : "#d4d4d4";

  const coordinates =
    chartWidth > 0
      ? points.map((point, index) => {
          const x =
            HORIZONTAL_PADDING + (index / (points.length - 1)) * drawableWidth;

          const normalizedPrice =
            (point.priceUsd - minimumPrice) / safePriceRange;

          const y = VERTICAL_PADDING + (1 - normalizedPrice) * drawableHeight;

          return {
            x,
            y,
          };
        })
      : [];

  const svgPoints = coordinates.map(({ x, y }) => `${x},${y}`).join(" ");

  const lastCoordinate = coordinates[coordinates.length - 1];

  return (
    <View style={tw`w-full`} onLayout={handleLayout}>
      <View
        style={tw`
          mb-3
          flex-row
          items-center
          justify-between
        `}
      >
        <Text style={[tw`text-sm`, styles.secondaryText]}>
          $
          {minimumPrice.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        </Text>

        <Text style={[tw`text-sm`, styles.secondaryText]}>
          $
          {maximumPrice.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}
        </Text>
      </View>

      {chartWidth > 0 && lastCoordinate && (
        <>
          <Svg
            width={chartWidth}
            height={CHART_HEIGHT}
            accessible
            accessibilityLabel={accessibilityLabel}
          >
            <Line
              x1={HORIZONTAL_PADDING}
              y1={CHART_HEIGHT / 2}
              x2={chartWidth - HORIZONTAL_PADDING}
              y2={CHART_HEIGHT / 2}
              stroke={gridColor}
              strokeWidth={1}
              strokeDasharray="4 6"
            />

            <Polyline
              points={svgPoints}
              fill="none"
              stroke={lineColor}
              strokeWidth={3}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            <Circle
              cx={lastCoordinate.x}
              cy={lastCoordinate.y}
              r={4}
              fill={lineColor}
            />
          </Svg>

          <View
            style={tw`
              mt-2
              flex-row
              justify-between
            `}
          >
            <Text style={[tw`text-xs`, styles.secondaryText]}>
              {formatHour(firstPoint.timestamp)}
            </Text>

            <Text style={[tw`text-xs`, styles.secondaryText]}>
              {formatHour(lastPoint.timestamp)}
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

function formatHour(timestamp: number): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}
