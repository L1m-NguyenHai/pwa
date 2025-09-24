import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ChartComponentsProps {
  type: 'line' | 'bar' | 'pie';
  data: any[];
  config: any;
  height?: number;
}

const ChartComponents: React.FC<ChartComponentsProps> = ({ type, data, config, height = 300 }) => {
  const commonProps = {
    width: '100%',
    height,
    data,
  };

  switch (type) {
    case 'line':
      return (
        <ResponsiveContainer {...commonProps}>
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey} />
            <YAxis tickFormatter={config.yTickFormatter} />
            <Tooltip formatter={config.tooltipFormatter} />
            <Legend />
            {config.lines?.map((lineConfig: any, index: number) => (
              <Line
                key={index}
                type="monotone"
                dataKey={lineConfig.dataKey}
                stroke={lineConfig.stroke}
                name={lineConfig.name}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );

    case 'bar':
      return (
        <ResponsiveContainer {...commonProps}>
          <BarChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={config.xKey} />
            <YAxis tickFormatter={config.yTickFormatter} />
            <Tooltip formatter={config.tooltipFormatter} />
            <Bar dataKey={config.dataKey} fill={config.fill || '#3B82F6'} />
          </BarChart>
        </ResponsiveContainer>
      );

    case 'pie':
      return (
        <ResponsiveContainer {...commonProps}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={config.innerRadius || 0}
              outerRadius={config.outerRadius || 80}
              paddingAngle={config.paddingAngle || 5}
              dataKey={config.dataKey}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || config.colors?.[index % config.colors.length]} />
              ))}
            </Pie>
            <Tooltip formatter={config.tooltipFormatter} />
          </PieChart>
        </ResponsiveContainer>
      );

    default:
      return <div>Unsupported chart type</div>;
  }
};

export default ChartComponents;