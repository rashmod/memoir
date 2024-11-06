import { createFileRoute } from '@tanstack/react-router';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label as ChartLabel,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import LazyImage from '@/components/custom/lazy-image';

import videosApi from '@/api/videos';
import formatDuration from '@/lib/format-duration';

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
      duration: data?.data.historySummary.reduce((acc, cur) => acc + cur.duration, 0),
      fill: 'hsl(var(--chart-1))',
    },
    {
      type: 'repeat',
      count: data?.data.historySummary.reduce((acc, cur) => acc + cur.count - cur.uniqueCount, 0),
      duration: data?.data.historySummary.reduce((acc, cur) => acc + cur.duration - cur.duration, 0),
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

  const [showDuration, setShowDuration] = useState(false);

  const watchLaterTotalCount = data?.data.watchLaterSummary.reduce((acc, cur) => acc + cur.count, 0) || 0;
  const watchLaterCountData = useMemo(
    () =>
      data?.data.watchLaterSummary
        .filter((cur) => (cur.count * 100) / watchLaterTotalCount > 1)
        .map((cur) => ({ ...cur, percent: Math.round((cur.count * 100) / watchLaterTotalCount) })) || [],
    [data, watchLaterTotalCount]
  );
  const watchLaterTotalDuration = data?.data.watchLaterSummary.reduce((acc, cur) => acc + cur.duration, 0) || 0;
  const watchLaterDurationData = useMemo(
    () =>
      data?.data.watchLaterSummary
        .filter((cur) => (cur.duration * 100) / watchLaterTotalDuration > 1)
        .map((cur) => ({ ...cur, percent: Math.round((cur.duration * 100) / watchLaterTotalDuration) }))
        .sort((a, b) => b.duration - a.duration) || [],
    [data, watchLaterTotalDuration]
  );

  const channelTotalCount = data?.data.channelSummary.reduce((acc, cur) => acc + cur.count, 0) || 0;
  const channelCountData = useMemo(
    () =>
      data?.data.channelSummary
        .filter((cur) => (cur.count * 100) / channelTotalCount > 1)
        .map((cur) => ({ ...cur, percent: Math.round((cur.count * 100) / channelTotalCount) })) || [],
    [data, channelTotalCount]
  );
  const channelTotalDuration = data?.data.channelSummary.reduce((acc, cur) => acc + cur.duration, 0) || 0;
  const channelDurationData = useMemo(
    () =>
      data?.data.channelSummary
        .filter((cur) => (cur.duration * 100) / channelTotalDuration > 1)
        .map((cur) => ({ ...cur, percent: Math.round((cur.duration * 100) / channelTotalDuration) }))
        .sort((a, b) => b.duration - a.duration) || [],
    [data, channelTotalDuration]
  );

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-full grid grid-cols-subgrid">
        <DatePickerWithRange className="col-span-5" />
        <div className="col-span-2 col-start-11 flex items-center gap-2">
          <Switch id="toggle-existing" checked={showDuration} onCheckedChange={setShowDuration} />
          <Label htmlFor="toggle-existing">{showDuration ? 'Show duration' : 'Show count'}</Label>
        </div>
      </div>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Watch History</CardTitle>
          <CardDescription>Showing watched video statistics in the last {days} days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={historyPieChartConfig} className="mx-auto aspect-square max-h-[250px]">
            <PieChart>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={aggregatedHistoryData}
                dataKey={showDuration ? 'duration' : 'count'}
                nameKey="type"
                innerRadius={70}
                strokeWidth={5}
              >
                <ChartLabel
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                          {showDuration ? (
                            <>
                              <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                {formatDuration(
                                  data?.data.historySummary.reduce((acc, cur) => acc + cur.duration, 0) || 0
                                )}
                              </tspan>
                              <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                hours
                              </tspan>
                            </>
                          ) : (
                            <>
                              <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-4xl font-bold">
                                {data?.data.historySummary.reduce((acc, cur) => acc + cur.count, 0).toLocaleString()}
                              </tspan>
                              <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                                Videos
                              </tspan>
                            </>
                          )}
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
                {showDuration ? (
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
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          indicator="dot"
                          formatter={(value, name) => (
                            <div className="flex gap-2">
                              <span className="font-mono">{chartConfig[name as keyof typeof chartConfig].label}</span>
                              <span>{formatDuration(value as number)}</span>
                            </div>
                          )}
                        />
                      }
                    />
                    <Line dataKey="duration" type="monotone" stroke="var(--color-duration)" dot={false} />
                  </LineChart>
                ) : (
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
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          indicator="dot"
                          formatter={(value, name) => (
                            <div className="flex gap-2">
                              <span className="font-mono">{chartConfig[name as keyof typeof chartConfig].label}</span>
                              <span>{value}</span>
                            </div>
                          )}
                        />
                      }
                    />
                    <Bar dataKey="count" fill="var(--color-count)" />
                  </BarChart>
                )}
              </ChartContainer>
            </TabsContent>
            <TabsContent value="weekly">
              <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                {showDuration ? (
                  <LineChart accessibilityLayer data={historyChartDataGroupedByWeek}>
                    <CartesianGrid vertical={false} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => formatDuration(value)} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          indicator="dot"
                          formatter={(value, name) => (
                            <div className="flex gap-2">
                              <span className="font-mono">{chartConfig[name as keyof typeof chartConfig].label}</span>
                              <span>{formatDuration(value as number)}</span>
                            </div>
                          )}
                        />
                      }
                    />
                    <Line dataKey="duration" type="monotone" stroke="var(--color-duration)" dot={false} />
                  </LineChart>
                ) : (
                  <BarChart accessibilityLayer data={historyChartDataGroupedByWeek}>
                    <CartesianGrid vertical={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          indicator="dot"
                          formatter={(value, name) => (
                            <div className="flex gap-2">
                              <span className="font-mono">{chartConfig[name as keyof typeof chartConfig].label}</span>
                              <span>{value}</span>
                            </div>
                          )}
                        />
                      }
                    />
                    <Bar dataKey="count" fill="var(--color-count)" />
                  </BarChart>
                )}
              </ChartContainer>
            </TabsContent>
            <TabsContent value="monthly">
              <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
                {showDuration ? (
                  <LineChart accessibilityLayer data={historyChartDataGroupedByMonth}>
                    <CartesianGrid vertical={false} />
                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => formatDuration(value)} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          indicator="dot"
                          formatter={(value, name) => (
                            <div className="flex gap-2">
                              <span className="font-mono">{chartConfig[name as keyof typeof chartConfig].label}</span>
                              <span>{formatDuration(value as number)}</span>
                            </div>
                          )}
                        />
                      }
                    />
                    <Line dataKey="duration" type="monotone" stroke="var(--color-duration)" dot={false} />
                  </LineChart>
                ) : (
                  <BarChart accessibilityLayer data={historyChartDataGroupedByMonth}>
                    <CartesianGrid vertical={false} />
                    <YAxis tickLine={false} axisLine={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={32} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          indicator="dot"
                          formatter={(value, name) => (
                            <div className="flex gap-2">
                              <span className="font-mono">{chartConfig[name as keyof typeof chartConfig].label}</span>
                              <span>{value}</span>
                            </div>
                          )}
                        />
                      }
                    />
                    <Bar dataKey="count" fill="var(--color-count)" />
                  </BarChart>
                )}
              </ChartContainer>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>

      <Card className="col-span-6">
        <CardHeader>
          <CardTitle>Watch History top channel</CardTitle>
          <CardDescription>
            {showDuration
              ? `Showing top 3 channels with most watched video duration in the last ${days} days`
              : `Showing top 3 channels with most watched videos in the last ${days} days`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-0">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex size-14 items-center justify-center rounded-full bg-foreground text-2xl font-medium text-background">
                  T
                </div>
                <div>
                  <p className="font-medium">Total</p>
                  <p className="text-sm text-muted-foreground">
                    {showDuration ? `${formatDuration(channelTotalDuration)} hours` : `${channelTotalCount} videos`}
                  </p>
                </div>
              </div>
              {(showDuration ? channelDurationData : channelCountData).map((channel, i) => {
                if (i > 2) return null;

                return (
                  <div className="flex gap-2" key={i}>
                    <LazyImage src={channel.channelAvatarUrl} className="h-14 rounded-full" />
                    <div>
                      <p className="font-medium">{truncateString(channel.channelName)}</p>
                      <p className="text-sm text-muted-foreground">
                        {showDuration ? `${formatDuration(channel.duration)} hours` : `${channel.count} videos`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <ChartContainer config={chartConfig} className="col-span-2 aspect-auto min-h-[250px] w-full">
              <BarChart
                accessibilityLayer
                data={showDuration ? channelDurationData : channelCountData}
                layout="vertical"
              >
                <XAxis type="number" dataKey={showDuration ? 'duration' : 'count'} hide />
                <YAxis dataKey="channelId" type="category" hide />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) => {
                        return payload[0]?.payload.channelName;
                      }}
                      formatter={(value, name) => {
                        if (showDuration) {
                          return (
                            <div className="flex gap-2">
                              <span className="font-mono">{chartConfig[name as keyof typeof chartConfig].label}</span>
                              <span>{formatDuration(value as number)} hours</span>
                            </div>
                          );
                        }
                        return (
                          <div className="flex gap-2">
                            <span className="font-mono">{chartConfig[name as keyof typeof chartConfig].label}</span>
                            <span>{value} videos</span>
                          </div>
                        );
                      }}
                    />
                  }
                />
                <Bar
                  dataKey={showDuration ? 'duration' : 'count'}
                  fill={showDuration ? 'var(--color-duration)' : 'var(--color-count)'}
                  radius={4}
                >
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
          Not shown: channels with less than <span className="mx-1 font-medium italic">1%</span> in total
          <span className="mx-1 font-medium italic">{showDuration ? 'duration' : 'count'}</span>
        </CardFooter>
      </Card>

      <Card className="col-span-6">
        <CardHeader>
          <CardTitle>Watch later top channel</CardTitle>
          <CardDescription>
            {showDuration
              ? `Showing channels with most videos added to watch later playlist in the last ${days} days`
              : `Showing channels with most videos added to watch later playlist in the last ${days} days`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-0">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex size-14 items-center justify-center rounded-full bg-foreground text-2xl font-medium text-background">
                  T
                </div>
                <div>
                  <p className="font-medium">Total</p>
                  <p className="text-sm text-muted-foreground">
                    {showDuration
                      ? `${formatDuration(watchLaterTotalDuration)} hours`
                      : `${watchLaterTotalCount} videos`}
                  </p>
                </div>
              </div>
              {(showDuration ? watchLaterDurationData : watchLaterCountData).map((channel, i) => {
                if (i > 2) return null;

                return (
                  <div className="flex gap-2" key={i}>
                    <LazyImage src={channel.channelAvatarUrl} className="h-14 rounded-full" />
                    <div>
                      <p className="font-medium">{truncateString(channel.channelName)}</p>
                      <p className="text-sm text-muted-foreground">
                        {showDuration ? `${formatDuration(channel.duration)} hours` : `${channel.count} videos`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <ChartContainer config={chartConfig} className="col-span-2 aspect-auto min-h-[250px] w-full">
              <BarChart
                accessibilityLayer
                data={showDuration ? watchLaterDurationData : watchLaterCountData}
                layout="vertical"
              >
                <XAxis type="number" dataKey={showDuration ? 'duration' : 'count'} hide />
                <YAxis dataKey="channelId" type="category" hide />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(_, payload) => {
                        return payload[0]?.payload.channelName;
                      }}
                      formatter={(value, name) => {
                        if (showDuration) {
                          return (
                            <div className="flex gap-2">
                              <span className="font-mono">{chartConfig[name as keyof typeof chartConfig].label}</span>
                              <span>{formatDuration(value as number)} hours</span>
                            </div>
                          );
                        }
                        return (
                          <div className="flex gap-2">
                            <span className="font-mono">{chartConfig[name as keyof typeof chartConfig].label}</span>
                            <span>{value} videos</span>
                          </div>
                        );
                      }}
                    />
                  }
                />
                <Bar
                  dataKey={showDuration ? 'duration' : 'count'}
                  fill={showDuration ? 'var(--color-duration)' : 'var(--color-count)'}
                  radius={4}
                >
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
          Not shown: channels with less than <span className="mx-1 font-medium italic">1%</span> in total
          <span className="mx-1 font-medium italic">{showDuration ? 'duration' : 'count'}</span>
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
    </div>
  );
}

function truncateString(string: string, maxLength = 10) {
  if (string.length <= maxLength) return string;
  return string.slice(0, maxLength) + '...';
}
