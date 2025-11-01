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
                                data: [200, 300, 400]
                            },
                            {
                                label: "Cc",
                                data: [233, 123, 543]
                            }
                        ]
                    }}
                />
            </div>
        </div>
    )
}

export default AdminDashBoard
