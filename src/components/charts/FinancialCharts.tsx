
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale
} from 'chart.js';
import { Line, Bar, Pie, Doughnut, Radar, Scatter } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  data: any;
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'radar' | 'scatter';
  title: string;
  language: 'ar' | 'en';
}

export const FinancialChart: React.FC<ChartProps> = ({ data, type, title, language }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#D4AF37',
          font: {
            family: language === 'ar' ? 'Amiri' : 'Playfair Display',
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: title,
        color: '#D4AF37',
        font: {
          family: language === 'ar' ? 'Amiri' : 'Playfair Display',
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        titleColor: '#D4AF37',
        bodyColor: '#FFFFFF',
        borderColor: '#D4AF37',
        borderWidth: 1
      }
    },
    scales: type !== 'pie' && type !== 'doughnut' && type !== 'radar' ? {
      x: {
        grid: {
          color: 'rgba(212, 175, 55, 0.1)'
        },
        ticks: {
          color: '#D4AF37'
        }
      },
      y: {
        grid: {
          color: 'rgba(212, 175, 55, 0.1)'
        },
        ticks: {
          color: '#D4AF37'
        }
      }
    } : undefined
  };

  const chartComponents = {
    line: Line,
    bar: Bar,
    pie: Pie,
    doughnut: Doughnut,
    radar: Radar,
    scatter: Scatter
  };

  const ChartComponent = chartComponents[type];

  return (
    <div className="w-full h-full bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-gold/20">
      <ChartComponent data={data} options={options} />
    </div>
  );
};

// مكون لعرض النسب المالية
export const RatioGauge: React.FC<{
  value: number;
  min: number;
  max: number;
  label: string;
  language: 'ar' | 'en';
}> = ({ value, min, max, label, language }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  const getColor = () => {
    if (percentage < 33) return '#EF4444'; // أحمر
    if (percentage < 66) return '#F59E0B'; // برتقالي
    return '#10B981'; // أخضر
  };

  return (
    <div className="bg-black/50 backdrop-blur-lg rounded-xl p-4 border border-gold/20">
      <h3 className="text-gold text-sm font-semibold mb-2">{label}</h3>
      <div className="relative h-32">
        <svg className="w-full h-full" viewBox="0 0 200 100">
          {/* خلفية القوس */}
          <path
            d="M 20 80 A 60 60 0 0 1 180 80"
            fill="none"
            stroke="rgba(212, 175, 55, 0.2)"
            strokeWidth="15"
            strokeLinecap="round"
          />
          {/* قوس القيمة */}
          <path
            d="M 20 80 A 60 60 0 0 1 180 80"
            fill="none"
            stroke={getColor()}
            strokeWidth="15"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 1.6} 160`}
          />
          {/* النص */}
          <text
            x="100"
            y="70"
            textAnchor="middle"
            className="fill-gold text-3xl font-bold"
          >
            {value.toFixed(2)}
          </text>
          <text
            x="100"
            y="90"
            textAnchor="middle"
            className="fill-gold/70 text-xs"
          >
            {language === 'ar' ? `الحد الأدنى: ${min} | الحد الأقصى: ${max}` : `Min: ${min} | Max: ${max}`}
          </text>
        </svg>
      </div>
    </div>
  );
};

// مكون الجدول المالي
export const FinancialTable: React.FC<{
  data: any[];
  columns: { key: string; label: string; format?: (value: any) => string }[];
  language: 'ar' | 'en';
}> = ({ data, columns, language }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gold/20">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-gold text-left font-semibold border-b border-gold/30"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="hover:bg-gold/10 transition-colors"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-gold/80 border-b border-gold/10"
                >
                  {col.format ? col.format(row[col.key]) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default {
  FinancialChart,
  RatioGauge,
  FinancialTable
};
