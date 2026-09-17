"use client"
import dynamic from "next/dynamic";
import { Icon } from "@iconify/react/dist/iconify.js";
import CardBox from "../shared/CardBox";
import { ApexOptions } from "apexcharts";
import { MonthlyMovement } from './types'

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });


const MonthlyEarning = ({ monthlyMovements }: { monthlyMovements: MonthlyMovement[] }) => {
    const monthlyTotals = monthlyMovements.slice(-7).map((item) => item.entradas + item.salidas)
    const ChartData: ApexOptions = {
        series: [
            {
                name: 'Movimientos',
                color: "var(--color-secondary)",
                data: monthlyTotals.length > 0 ? monthlyTotals : [0],
            },
        ],
        chart: {
            id: "weekly-stats2",
            type: "area",
            height: 60,
            sparkline: {
                enabled: true,
            },
            group: 'sparklines',
            fontFamily: "inherit",
            foreColor: "#adb0bb",
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 0,
                inverseColors: false,
                opacityFrom: 0.1,
                opacityTo: 0,
                stops: [20, 180],
            },
        },

        markers: {
            size: 0,
        },
        tooltip: {
            theme: "dark",
            fixed: {
                enabled: true,
                position: "right",
            },
            x: {
                show: false,
            },
            y: {
                formatter: (val: number) => {
                    return `$${val}`;
                }
            }
        },
    };
    return (
        <>
            <CardBox className="p-0! mt-0" >
                <div className="px-6 pt-6">
                    <div className="flex items-center justify-between mb-2">
                        <h5 className="card-title mb-0">Movimientos recientes</h5>
                        <div className="text-white bg-secondary rounded-full h-11 w-11 flex items-center justify-center">
                            <Icon icon='tabler:currency-dollar' className="text-xl" />
                        </div>
                    </div>
                    <div className="grid grid-cols-12 gap-6 mb-4">
                        <div className="lg:col-span-8 md:col-span-8  col-span-8">
                            <h4 className="text-xl mb-3">{monthlyTotals.reduce((sum, value) => sum + value, 0).toLocaleString()}</h4>
                            <div className="flex items-center gap-2">
                                <span className="rounded-full p-1 bg-lighterror dark:bg-darkerror flex items-center justify-center ">
                                    <Icon icon='tabler:arrow-down-right' className="text-error" />
                                </span>
                                <p className="text-muted-foreground  mb-0">Total</p>
                                <p className="text-muted-foreground mb-0 ">unidades</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Chart
                    options={ChartData}
                    series={ChartData.series}
                    type="area"
                    height={60}
                    width={"100%"}
                />
            </CardBox>
        </>
    )
}
export { MonthlyEarning }