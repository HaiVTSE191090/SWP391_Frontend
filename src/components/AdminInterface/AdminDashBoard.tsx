import React from 'react'
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import { Bar } from 'react-chartjs-2'
Chart.register(CategoryScale);


const AdminDashBoard = () => {
    return (
        <div className='DashBoard'>
            <div>
                <Bar
                    data={{
                        labels: ["A", "B", "C"],
                        datasets: [
                            {
                                label: "Revenue",
                                data: [200, 320, 410, 500, 620, 710],
                            },
                            {
                                label: "Information",
                                data: [233, 123, 543, 412, 380, 460],
                            },
                            {
                                label: "Profit",
                                data: [120, 210, 300, 380, 460, 520],
                            },
                            {
                                label: "Orders",
                                data: [50, 85, 110, 150, 180, 230],
                            },
                            {
                                label: "Customers",
                                data: [40, 70, 100, 130, 160, 210],
                            },
                            {
                                label: "Expenses",
                                data: [100, 130, 160, 190, 230, 260],
                            },
                            {
                                label: "Refunds",
                                data: [8, 12, 15, 10, 9, 14],
                            },
                            {
                                label: "Growth",
                                data: [5, 9, 14, 18, 22, 27],
                            },
                            {
                                label: "Conversion Rate",
                                data: [2.5, 3.1, 3.8, 4.5, 5.2, 5.8],
                            },
                        ]
                    }}
                />
            </div>
        </div>
    )
}

export default AdminDashBoard
