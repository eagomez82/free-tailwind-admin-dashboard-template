"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import CardBox from "../shared/CardBox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ApexOptions } from "apexcharts";
import { MonthlyMovement } from './types'

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// Strongly typed chart data
interface MonthlyChartData {
  series: ApexAxisChartSeries;
  xaxis: ApexOptions['xaxis'];
}

const monthLabels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

const baseChartOptions: ApexOptions = {
  chart: {
    toolbar: { show: false },
    type: "bar",
    fontFamily: "inherit",
    foreColor: "#7C8FAC",
    height: 310,
    stacked: true,
    width: "100%",
    offsetX: -20,
  },
  colors: ["var(--color-primary)", "var(--color-secondary)"],
  plotOptions: {
    bar: {
      horizontal: false,
      barHeight: "60%",
      columnWidth: "20%",
      borderRadius: 6,
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "all",
    },
  },
  dataLabels: { enabled: false },
  legend: { show: false },
  grid: { borderColor: "rgba(0,0,0,0.1)", strokeDashArray: 3 },
  yaxis: {
    min: 0,
    tickAmount: 5,
    labels: { formatter: (val) => `${val / 1000}k` },
  },
  tooltip: {
    theme: "dark",
    y: { formatter: (val) => `${val}` },
  },
};

const SalesOverview: React.FC<{ monthlyMovements: MonthlyMovement[] }> = ({ monthlyMovements }) => {
  const chartDataByMonth: Record<string, MonthlyChartData> = Object.fromEntries(
    Array.from(new Set(monthlyMovements.map((item) => item.year))).map((year) => {
      const yearData = monthLabels.map((_, index) => {
        const month = String(index + 1).padStart(2, '0')
        const item = monthlyMovements.find((movement) => movement.year === year && movement.month === month)
        return item ?? { entradas: 0, salidas: 0 }
      })
      return [year, {
        series: [
          { name: 'Entradas', data: yearData.map((item) => item.entradas) },
          { name: 'Salidas', data: yearData.map((item) => item.salidas) },
        ],
        xaxis: { categories: monthLabels },
      }]
    })
  )
  const years = Object.keys(chartDataByMonth)
  const selectedYear = years[years.length - 1] ?? 'Sin datos'
  const [selectedMonth, setSelectedMonth] = useState(selectedYear)
  const selectedChartData = chartDataByMonth[selectedMonth] ?? {
    series: [
      { name: 'Entradas', data: monthLabels.map(() => 0) },
      { name: 'Salidas', data: monthLabels.map(() => 0) },
    ],
    xaxis: { categories: monthLabels },
  }

  const ChartData: ApexOptions = {
    ...baseChartOptions,
    xaxis: {
      ...selectedChartData.xaxis,
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
  };

  return (
    <CardBox className="pb-0 h-full w-full">
      <div className="sm:flex items-center justify-between mb-6">
        <div>
          <h5 className="card-title">Movimientos por mes</h5>
          <p className="text-sm text-muted-foreground font-normal">
            Entradas y salidas de inventario
          </p>
        </div>
        <div className="sm:mt-0 mt-4">
          <Select
            value={selectedMonth}
            onValueChange={(val) => setSelectedMonth(val as keyof typeof chartDataByMonth)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Seleccione el año" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Chart
        options={ChartData}
        series={selectedChartData.series}
        type="bar"
        height={316}
        width="100%"
      />
    </CardBox>
  );
};

export default SalesOverview;
