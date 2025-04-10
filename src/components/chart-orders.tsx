"use client";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  orders: {
    label: "Pedidos",
    color: "#ff5e00",
  },
} satisfies ChartConfig;

interface iData {
  day: string;
  orders: number;
}

interface iChartOrders {
  day: string;
  chartData: iData[];
  countOrders: number;
}

export function ChartOrders(props: iChartOrders) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos da semana</CardTitle>
        <CardDescription>16/03 - 22/03</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={props.chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="orders" fill="#ff5e00" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Parabéns, suas vendas cresceram esses últimos dias!
        </div>
        <div className="leading-none text-muted-foreground">
          Sua loja teve um total de {props.countOrders} pedidos essa semana!
        </div>
      </CardFooter>
    </Card>
  );
}
