import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryLabel, VictoryLegend } from 'victory';
import spinner from '../assets/loader-2_food.gif';

const CalorieGraph = () => {
    const { currentUser } = useContext(AuthContext);
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);

        if (currentUser && Array.isArray(currentUser.calorieIntake) && currentUser.calorieIntake.length > 0) {
            const today = new Date();
            const sevenDaysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
            
            const calorieData = currentUser.calorieIntake.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate >= sevenDaysAgo && itemDate <= today;
            });
    
            const caloriesByDate = calorieData.reduce((acc, item) => {
                // Use local date string to avoid time zone issues
                const itemDate = new Date(item.date);
                const formattedDate = itemDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); // Format as YYYY-MM-DD
                acc[formattedDate] = (acc[formattedDate] || 0) + item.calories;
                return acc;
            }, {});
    
            // Ensure data for each of the last 7 days
            for (let i = 0; i < 7; i++) {
                const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
                const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (!caloriesByDate[formattedDate]) {
                    caloriesByDate[formattedDate] = 0;
                }
            }
    
            const formattedData = Object.entries(caloriesByDate)
                .map(([date, calories]) => ({ date, calories }))
                .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort data by date

                
            setChartData(formattedData);
            return () => clearTimeout(timer);
            

        }
    }, [currentUser]);

    if (isLoading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <img src={spinner} alt="Loading..." />
            </div>
        );
    }

    if (!currentUser || !currentUser.calorieIntake || currentUser.calorieIntake.length === 0) {
        return (
            <div className="h-screen flex justify-center items-center">
                <p className="text-lg font-medium">No data to display</p>
            </div>
        );
    }
    

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        

    };

    const formatCalories = (calories) => {
        return calories < 1 ? 0 : calories.toFixed(0);
    };

    return (
        <div className="h-screen flex justify-center items-center">
            
            <VictoryChart domainPadding={20}>
                <VictoryAxis
                    tickFormat={(t) => formatDate(t)}
                    style={{
                        tickLabels: { fontSize: 10, padding: 5 },
                        axisLabel: { fontSize: 12, padding: 30 },
                    }}
                />
                <VictoryAxis
                    dependentAxis
                    tickFormat={(x) => formatCalories(x)}
                    style={{
                        tickLabels: { fontSize: 10, padding: 5 },
                        axisLabel: { fontSize: 12, padding: 30 },
                    }}
                />
                <VictoryBar
                    data={chartData}
                    x="date"
                    y="calories"
                    style={{
                        data: { fill: "rgb(50, 205, 50, 0.6)", stroke: "rgb(50, 205, 50, 1)", strokeWidth: 1 }
                    }}
                    labels={({ datum }) => `${datum.calories}`}
                    labelComponent={<VictoryLabel dy={-20} />}
                />
                <VictoryLegend
                    x={100} y={0}
                    title={`This is the amount you should eat: ${currentUser.BMR} kcal/day`}
                    centerTitle
                    style={{ 
                        title: { fontSize: 12, fontWeight: 'bold' },
                        labels: { fontSize: 0 }
                    }}
                />
            </VictoryChart>
        </div>
    );
};

export default CalorieGraph;