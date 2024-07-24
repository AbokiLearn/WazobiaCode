import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

const leaderboardData = [
  { rank: 1, name: "Alex Johnson", points: 1250 },
  { rank: 2, name: "Sam Lee", points: 1180 },
  { rank: 3, name: "Jordan Smith", points: 1150 },
  { rank: 4, name: "Casey Brown", points: 1100 },
  { rank: 5, name: "Taylor Wong", points: 1050 },
  { rank: 6, name: "Morgan Chen", points: 1000 },
  { rank: 7, name: "Jamie Garcia", points: 950 },
  { rank: 8, name: "Riley Patel", points: 900 },
];

interface LeaderboardRowProps {
  rank: number;
  name: string;
  points: number;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({
  rank,
  name,
  points,
}) => {
  return (
    <tr className="border-b border-gray-200">
      <td className="py-3 px-4">{rank}</td>
      <td className="py-3 px-4 flex items-center">
        <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
        {name}
      </td>
      <td className="py-3 px-4">{points}</td>
    </tr>
  );
};

export default function LeaderboardPage() {
  return (
    <div className="p-6">
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center space-x-2">
          <Trophy className="text-yellow-500" size={24} />
          <CardTitle className="text-xl font-bold">
            Weekly Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200">
                <th className="py-3 px-4">RANK</th>
                <th className="py-3 px-4">STUDENT</th>
                <th className="py-3 px-4">POINTS</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((student) => (
                <LeaderboardRow key={student.rank} {...student} />
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
