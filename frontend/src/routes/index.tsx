import { createFileRoute } from '@tanstack/react-router';
import { Bar, BarChart, CartesianGrid, Label as ChartLabel, LabelList, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import videosApi from '@/api/videos';
import LazyImage from '@/components/custom/lazy-image';

export const Route = createFileRoute('/')({
  component: Page,
});

const days = 90;

const chartConfig = {
  count: {
    label: 'Count',
    color: 'hsl(var(--chart-1))',
  },
  duration: {
    label: 'Duration',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const historyPieChartConfig = {
  unique: {
    label: 'Unique videos',
    color: 'hsl(var(--chart-1))',
  },
  repeat: {
    label: 'Repeat videos',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

function Page() {
  const { data } = useQuery({
    queryKey: ['user-videos', 'summary'],
    queryFn: () => videosApi.getSummary(new Date(), new Date()),
  });

  const aggregatedHistoryData = [
    {
      type: 'unique',
      count: data?.data.historySummary.reduce((acc, cur) => acc + cur.uniqueCount, 0),
      fill: 'hsl(var(--chart-1))',
    },
    {
      type: 'repeat',
      count: data?.data.historySummary.reduce((acc, cur) => acc + cur.count - cur.uniqueCount, 0),
      fill: 'hsl(var(--chart-4))',
    },
  ];

  const historyChartData = data?.data.historySummary || [];
  const historyChartDataGroupedByWeek = Object.values(
    historyChartData.reduce(
      (acc, cur) => {
        const date = new Date(cur.date);
        const startOfYearDate = new Date(date.getFullYear(), 0, 1);
        const weekNumber = Math.ceil(
          ((date.getTime() - startOfYearDate.getTime()) / 86400000 + startOfYearDate.getDay() + 1) / 7
        );
        const weekKey = `${date.getFullYear()}-W${weekNumber}`;

        if (!acc[weekKey]) {
          acc[weekKey] = {
            count: 0,
            duration: 0,
            date: weekKey,
          };
        }

        acc[weekKey].count += cur.count;
        acc[weekKey].duration += cur.duration;

        return acc;
      },
      {} as Record<string, { count: number; duration: number; date: string }>
    )
  );
  const historyChartDataGroupedByMonth = Object.values(
    historyChartData.reduce(
      (acc, cur) => {
        const date = new Date(cur.date);
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;

        if (!acc[monthKey]) {
          acc[monthKey] = {
            count: 0,
            duration: 0,
            date: monthKey,
          };
        }

        acc[monthKey].count += cur.count;
        acc[monthKey].duration += cur.duration;

        return acc;
      },
      {} as Record<string, { count: number; duration: number; date: string }>
    )
  );

  const watchLaterTotal = data?.data.watchLaterSummary.reduce((acc, cur) => acc + cur.count, 0) || 0;
  const watchLaterData = useMemo(
    () =>
      data?.data.watchLaterSummary
        .filter((cur) => (cur.count * 100) / watchLaterTotal > 1)
        .map((cur) => ({ ...cur, percent: Math.round((cur.count * 100) / watchLaterTotal) })) || [],
    [data, watchLaterTotal]
  );

  const channelTotal = data?.data.channelSummary.reduce((acc, cur) => acc + cur.count, 0) || 0;
  const channelData = useMemo(
    () =>
      data?.data.channelSummary
        .filter((cur) => (cur.count * 100) / channelTotal > 1)
        .map((cur) => ({ ...cur, percent: Math.round((cur.count * 100) / channelTotal) })) || [],
    [data, channelTotal]
  );

  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Watch History</CardTitle>
          <CardDescription>Showing watched video statistics in the last {days} days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={historyPieChartConfig} className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie data={aggregatedHistoryData} dataKey="count" nameKey="type" innerRadius={70} strokeWidth={5}>
                <ChartLabel
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-4xl font-bold">
                            {data?.data.historySummary.reduce((acc, cur) => acc + cur.count, 0).toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                            Videos
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="col-span-9">
        <Tabs defaultValue="daily">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>Watch History</div>
              <TabsList className="h-auto">
                <TabsTrigger value="daily" className="text-xs tracking-wide">
                  Daily
                </TabsTrigger>
                <TabsTrigger value="weekly" className="text-xs tracking-wide">
                  Weekly
                </TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs tracking-wide">
                  Monthly
                </TabsTrigger>
              </TabsList>
            </CardTitle>
            <CardDescription className="mt-0">Showing watched video count in the last {days} days</CardDescription>
          </CardHeader>
          <CardContent>
            <TabsContent value="daily">
              <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                <BarChart accessibilityLayer data={historyChartData}>
                  <CartesianGrid vertical={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      });
                    }}
                  />
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="weekly">
              <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                <BarChart accessibilityLayer data={historyChartDataGroupedByWeek}>
                  <CartesianGrid vertical={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      });
                    }}
                  />
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ChartContainer>
            </TabsContent>
            <TabsContent value="monthly">
              <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                <BarChart accessibilityLayer data={historyChartDataGroupedByMonth}>
                  <CartesianGrid vertical={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      });
                    }}
                  />
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                  <Bar dataKey="count" fill="var(--color-count)" />
                </BarChart>
              </ChartContainer>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <Card className="col-span-6">
        <CardHeader>
          <CardTitle>Watch History top channel</CardTitle>
          <CardDescription>{`Showing top 3 channels with most watched videos in the last ${days} days`}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex size-14 items-center justify-center rounded-full bg-foreground text-2xl font-medium text-background">
                  T
                </div>
                <div>
                  <p className="font-medium">Total</p>
                  <p className="text-sm">{channelTotal} videos</p>
                </div>
              </div>
              {channelData.map((channel, i) => {
                if (i > 2) return null;

                return (
                  <div className="flex gap-2" key={i}>
                    <LazyImage src={channel.channelAvatarUrl} className="h-14 rounded-full" />
                    <div>
                      <p className="font-medium">{channel.channelName}</p>
                      <p className="text-sm text-muted-foreground">{channel.count} videos</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
              <BarChart accessibilityLayer data={channelData} layout="vertical">
                <XAxis type="number" dataKey="count" hide />
                <YAxis dataKey="channelId" type="category" hide />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) => {
                        return payload[0]?.payload.channelName;
                      }}
                    />
                  }
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={4}>
                  <LabelList
                    position="right"
                    dataKey="percent"
                    formatter={(value: number) => value + '%'}
                    offset={4}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Not shown: channels with less than <span className="mx-1 font-medium italic">1%</span> in total count
        </CardFooter>
      </Card>

      <Card className="col-span-6">
        <CardHeader>
          <CardTitle>Watch later top channel</CardTitle>
          <CardDescription>Showing channels with most videos in watch later playlist</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex size-14 items-center justify-center rounded-full bg-foreground text-2xl font-medium text-background">
                  T
                </div>
                <div>
                  <p className="font-medium">Total</p>
                  <p className="text-sm">{watchLaterTotal} videos</p>
                </div>
              </div>
              {watchLaterData.map((channel, i) => {
                if (i > 2) return null;

                return (
                  <div className="flex gap-2" key={i}>
                    <LazyImage src={channel.channelAvatarUrl} className="h-14 rounded-full" />
                    <div>
                      <p className="font-medium">{channel.channelName}</p>
                      <p className="text-sm">{channel.count} videos</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
              <BarChart accessibilityLayer data={watchLaterData} layout="vertical">
                <XAxis type="number" dataKey="count" hide />
                <YAxis dataKey="channelId" type="category" hide />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) => {
                        return payload[0]?.payload.channelName;
                      }}
                    />
                  }
                />
                <Bar dataKey="count" fill="var(--color-count)" radius={4}>
                  <LabelList
                    position="right"
                    dataKey="percent"
                    formatter={(value: number) => value + '%'}
                    offset={4}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          Not shown: channels with less than <span className="mx-1 font-medium italic">1%</span> in total count
        </CardFooter>
      </Card>

      <Card className="col-span-6">
        <CardHeader>
          <CardTitle>Top tags</CardTitle>
          <CardDescription>Showing top 5 tags with most videos in the last {days} days</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>

      <Card className="col-span-6">
        <CardHeader>
          <CardTitle>top watched tags</CardTitle>
          <CardDescription>Showing top 3 tags with most watched videos in the last {days} days</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>

      {/* <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Watch History</CardTitle>
          <CardDescription>Showing watched video time in the last {days} days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <LineChart accessibilityLayer data={historyChartData}>
              <CartesianGrid vertical={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => formatDuration(value)} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  });
                }}
              />
              <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
              <Line dataKey="duration" type="monotone" stroke="var(--color-duration)" dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card> */}
    </div>
  );
}
