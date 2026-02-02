'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';
import { UserProfile, CYBER_DOMAIN_LABELS, CYBER_DOMAIN_COLORS, CyberDomain } from '@/types';

interface DomainChartProps {
  user1: UserProfile;
  user2: UserProfile;
}

type ChartView = 'radar' | 'bar';

export default function DomainChart({ user1, user2 }: DomainChartProps) {
  const [chartView, setChartView] = useState<ChartView>('radar');

  // Prepare data for charts
  const domains = Object.keys(CYBER_DOMAIN_LABELS) as CyberDomain[];
  
  const radarData = domains.map(domain => ({
    domain: CYBER_DOMAIN_LABELS[domain],
    [user1.username]: user1.domainScores[domain],
    [user2.username]: user2.domainScores[domain],
    fullMark: Math.max(
      user1.domainScores[domain],
      user2.domainScores[domain],
      10
    ),
  }));

  const barData = domains
    .map(domain => ({
      domain: CYBER_DOMAIN_LABELS[domain],
      domainKey: domain,
      [user1.username]: user1.domainScores[domain],
      [user2.username]: user2.domainScores[domain],
      color: CYBER_DOMAIN_COLORS[domain],
    }))
    .sort((a, b) => {
      const totalA = Number(a[user1.username]) + Number(a[user2.username]);
      const totalB = Number(b[user1.username]) + Number(b[user2.username]);
      return totalB - totalA;
    });

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-cyber-card border border-cyber-border rounded-lg p-3 shadow-lg">
          <p className="text-white font-mono text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs font-mono" style={{ color: entry.color }}>
              {entry.name}: {entry.value} rooms
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="cyber-card p-6">
      {/* Chart Toggle */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setChartView('radar')}
          className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
            chartView === 'radar'
              ? 'bg-cyber-primary/20 border border-cyber-primary text-cyber-primary'
              : 'bg-cyber-dark border border-cyber-border text-gray-400 hover:border-gray-500'
          }`}
        >
          🎯 Radar View
        </button>
        <button
          onClick={() => setChartView('bar')}
          className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
            chartView === 'bar'
              ? 'bg-cyber-primary/20 border border-cyber-primary text-cyber-primary'
              : 'bg-cyber-dark border border-cyber-border text-gray-400 hover:border-gray-500'
          }`}
        >
          📊 Bar View
        </button>
      </div>

      {/* Charts */}
      <motion.div
        key={chartView}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="h-[400px] md:h-[500px]"
      >
        {chartView === 'radar' ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid 
                stroke="rgba(0, 255, 136, 0.1)" 
                strokeDasharray="3 3"
              />
              <PolarAngleAxis 
                dataKey="domain" 
                tick={{ 
                  fill: '#888', 
                  fontSize: 10,
                  fontFamily: 'JetBrains Mono'
                }}
                tickLine={{ stroke: 'rgba(0, 255, 136, 0.2)' }}
              />
              <PolarRadiusAxis 
                angle={90} 
                tick={{ fill: '#666', fontSize: 8 }}
                axisLine={{ stroke: 'rgba(0, 255, 136, 0.1)' }}
              />
              <Radar
                name={user1.username}
                dataKey={user1.username}
                stroke="#00d4ff"
                fill="#00d4ff"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Radar
                name={user2.username}
                dataKey={user2.username}
                stroke="#ff00ff"
                fill="#ff00ff"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  fontFamily: 'JetBrains Mono',
                  fontSize: '12px'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
            >
              <XAxis 
                type="number" 
                tick={{ fill: '#888', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                axisLine={{ stroke: 'rgba(0, 255, 136, 0.2)' }}
              />
              <YAxis 
                type="category" 
                dataKey="domain"
                tick={{ fill: '#888', fontSize: 10, fontFamily: 'JetBrains Mono' }}
                axisLine={{ stroke: 'rgba(0, 255, 136, 0.2)' }}
                width={90}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ 
                  fontFamily: 'JetBrains Mono',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey={user1.username} 
                fill="#00d4ff" 
                radius={[0, 4, 4, 0]}
                barSize={12}
              />
              <Bar 
                dataKey={user2.username} 
                fill="#ff00ff" 
                radius={[0, 4, 4, 0]}
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Domain Insights */}
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <DomainInsight 
          username={user1.username}
          domainScores={user1.domainScores}
          color="#00d4ff"
        />
        <DomainInsight 
          username={user2.username}
          domainScores={user2.domainScores}
          color="#ff00ff"
        />
      </div>
    </div>
  );
}

interface DomainInsightProps {
  username: string;
  domainScores: Record<CyberDomain, number>;
  color: string;
}

function DomainInsight({ username, domainScores, color }: DomainInsightProps) {
  const totalRooms = Object.values(domainScores).reduce((a, b) => a + b, 0);
  const sortedDomains = Object.entries(domainScores)
    .sort(([, a], [, b]) => b - a) as [CyberDomain, number][];
  
  const topDomain = sortedDomains[0];
  const activeDomains = sortedDomains.filter(([, count]) => count > 0).length;
  
  // Calculate specialization index (0-100)
  const specializationIndex = topDomain[1] / totalRooms * 100;
  
  let characterType: string;
  if (specializationIndex > 40) {
    characterType = 'Specialist';
  } else if (specializationIndex > 25) {
    characterType = 'Focused';
  } else {
    characterType = 'Versatile';
  }

  return (
    <div className="p-4 rounded-lg bg-cyber-dark/50 border border-cyber-border">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-mono text-sm text-white">{username}</span>
      </div>
      
      <div className="space-y-2 text-xs font-mono text-gray-400">
        <p>
          🎯 Top Domain: <span style={{ color }}>{CYBER_DOMAIN_LABELS[topDomain[0]]}</span> ({topDomain[1]} rooms)
        </p>
        <p>
          📊 Active in: <span className="text-white">{activeDomains}</span> / 13 domains
        </p>
        <p>
          🧬 Profile Type: <span className="text-cyber-warning">{characterType}</span>
        </p>
        <p>
          📈 Specialization: <span className="text-white">{specializationIndex.toFixed(1)}%</span> in top domain
        </p>
      </div>
    </div>
  );
}
