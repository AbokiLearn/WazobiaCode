'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import WeeklyLeaderBoard from '@/components/userProfile/WeeklyLeaderBoard';
import Image from 'next/image';

const UserProfile = () => {
  const [activeSection, setActiveSection] = useState<string>('Activity');

  const handleSectionChange = (section: String) => {
    // @ts-ignore
    setActiveSection(section);
  };

  return (
    <>
      <main className="flex flex-col md:flex-row py-12 px-4 md:px-6">
        <aside className="w-full md:w-1/4 pr-0 md:pr-6 space-y-2 bg-pastel-gray">
          <h2 className="py-2 px-4 text-lg font-bold">Profile Page</h2>
          <button
            onClick={() => handleSectionChange('Activity')}
            className="block py-2 px-4 rounded-md bg-white text-sm font-medium"
          >
            Activity
          </button>
          <button
            onClick={() => handleSectionChange('WeeklyLeaderboard')}
            className="block py-2 px-4 rounded-md bg-white text-sm font-medium"
          >
            Weekly LeaderBoard
          </button>
          <button
            onClick={() => handleSectionChange('Learning')}
            className="block py-2 px-4 rounded-md bg-white text-sm font-medium"
          >
            Learning
          </button>
          <button
            onClick={() => handleSectionChange('InProgress')}
            className="block py-2 px-4 rounded-md bg-white text-sm font-medium"
          >
            In Progress
          </button>
          <button
            onClick={() => handleSectionChange('Completed')}
            className="block py-2 px-4 rounded-md bg-white text-sm font-medium"
          >
            Completed
          </button>
          <button
            onClick={() => handleSectionChange('Settings')}
            className="block py-2 px-4 rounded-md bg-white text-sm font-medium"
          >
            Settings
          </button>
        </aside>
        <div className="w-full md:w-3/4 pl-0 md:pl-6">
          {activeSection === 'Activity' && (
            <section>
              <h1 className="text-2xl font-bold">Activity</h1>
              <LabelledpieChart className="w-full aspect-[4/3]" />
            </section>
          )}
          {activeSection === 'WeeklyLeaderboard' && <WeeklyLeaderBoard />}

          {activeSection === 'Learning' && (
            <section>
              <h1 className="text-2xl font-bold mt-12">Learning</h1>
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-bold">Your Rank</h2>
                  <StarIcon className="w-4 h-4" />
                </CardHeader>
                <CardContent>
                  <BarChart className="w-full aspect-[4/3]" />
                </CardContent>
              </Card>
            </section>
          )}

          {activeSection === 'InProgress' && (
            <section>
              <h1 className="text-2xl font-bold mt-12">In Progress</h1>
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-bold">Lecture 1</h2>
                  <p className="text-sm text-gray-500">50% Completed</p>
                </CardHeader>
                <CardContent>
                  <Image
                    alt="Lecture Image"
                    height="200"
                    src="/placeholder.svg"
                    style={{
                      aspectRatio: '200/200',
                      objectFit: 'cover',
                    }}
                    width="200"
                  />
                </CardContent>
              </Card>
            </section>
          )}

          {activeSection === 'Completed' && (
            <section>
              <h1 className="text-2xl font-bold mt-12">Completed</h1>
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-bold">Lecture 2</h2>
                </CardHeader>
                <CardContent>
                  <Image
                    alt="Lecture Image"
                    height="200"
                    src="/placeholder.svg"
                    style={{
                      aspectRatio: '200/200',
                      objectFit: 'cover',
                    }}
                    width="200"
                  />
                </CardContent>
              </Card>
            </section>
          )}

          {activeSection === 'Settings' && (
            <section>
              <h1 className="text-2xl font-bold mt-12">Settings</h1>
              <Card>
                <CardContent>
                  <form>
                    <label
                      className="block text-sm font-medium"
                      htmlFor="username"
                    >
                      Username
                    </label>
                    <input
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      id="username"
                      type="text"
                    />
                    <label
                      className="block text-sm font-medium mt-4"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      id="email"
                      type="email"
                    />
                    <Button className="mt-4" type="submit">
                      Save Changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </section>
          )}
        </div>
      </main>
    </>
  );
};

function BarChart(
  props: React.JSX.IntrinsicAttributes &
    React.ClassAttributes<HTMLDivElement> &
    React.HTMLAttributes<HTMLDivElement>,
) {
  return (
    <div {...props}>
      <ResponsiveBar
        data={[
          {
            name: 'A',
            data: 111,
          },
          {
            name: 'B',
            data: 157,
          },
          {
            name: 'C',
            data: 129,
          },
          {
            name: 'D',
            data: 187,
          },
          {
            name: 'E',
            data: 119,
          },
          {
            name: 'F',
            data: 22,
          },
          {
            name: 'G',
            data: 101,
          },
          {
            name: 'H',
            data: 83,
          },
        ]}
        keys={['data']}
        indexBy="name"
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        padding={0.3}
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'paired' }}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.2]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Name',
          legendPosition: 'middle',
          legendOffset: 45,
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Number',
          legendPosition: 'middle',
          legendOffset: -45,
          truncateTickAt: 0,
        }}
        theme={{
          tooltip: {
            container: {
              fontSize: '12px',
            },
          },
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        role="application"
        ariaLabel="A bar chart showing data"
      />
    </div>
  );
}

function LabelledpieChart(
  props: React.JSX.IntrinsicAttributes &
    React.ClassAttributes<HTMLDivElement> &
    React.HTMLAttributes<HTMLDivElement>,
) {
  return (
    <div {...props}>
      <ResponsivePie
        data={[
          {
            id: 'A',
            value: 434,
          },
          {
            id: 'B',
            value: 456,
          },
          {
            id: 'C',
            value: 150,
          },
          {
            id: 'D',
            value: 258,
          },
          {
            id: 'E',
            value: 511,
          },
        ]}
        sortByValue
        margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
        innerRadius={0.5}
        padAngle={1}
        cornerRadius={3}
        activeOuterRadiusOffset={2}
        borderWidth={1}
        borderColor={{
          from: 'color',
          modifiers: [['darker', 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor="#333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsTextColor={{
          from: 'color',
          modifiers: [['darker', 2]],
        }}
        colors={{ scheme: 'paired' }}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 50,
            itemHeight: 18,
            itemDirection: 'left-to-right',
            symbolSize: 18,
            symbolShape: 'circle',
          },
        ]}
        theme={{
          tooltip: {
            container: {
              fontSize: '12px',
            },
          },
        }}
        role="application"
      />
    </div>
  );
}

function MountainIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

function StarIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>,
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default UserProfile;
