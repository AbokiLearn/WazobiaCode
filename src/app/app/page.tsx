import { Metadata } from 'next';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  CheckCircle,
  AlertCircle,
  Calendar,
  MessageCircle,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Student Dashboard - WaZoBiaCode Bootcamp',
  description: 'Welcome to the WaZoBiaCode Bootcamp Student Dashboard',
};

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to WaZoBiaCode Bootcamp
      </h1>

      <Alert className="mb-8">
        <CheckCircle className="h-4 w-4" />
        <AlertTitle>Registration Complete</AlertTitle>
        <AlertDescription>
          Congratulations! By accessing this page, you have successfully
          completed your registration for the WaZoBiaCode Bootcamp.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Join Telegram Channel</CardTitle>
            <CardDescription>
              Access course materials and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Course material will be delivered via this Telegram channel weekly
              during our class sessions.
            </p>
            <Button asChild>
              <a
                href="https://t.me/+emN-9IAiRgozNDIx"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join Telegram Channel
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bootcamp Schedule</CardTitle>
            <CardDescription>Mark your calendars</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-2">
              <Calendar className="mr-2" />
              <p>July 26th, 2024 - Start Date</p>
            </div>
            <p>
              Sessions run from 5-7pm Nigeria time on Fridays, Saturdays, and
              Sundays
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Register Telegram Account</CardTitle>
            <CardDescription>
              Link your website and Telegram accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside mb-4">
              <li>Send a message to @wazobiacode_bot on Telegram</li>
              <li>Use the /register command</li>
              <li>Share your phone number when prompted</li>
              <li>
                Receive an invitation to a &quot;WaZoBiaCode Lab&quot; group
                chat
              </li>
            </ol>
            <Button asChild>
              <a
                href="https://t.me/wazobiacode_bot"
                target="_blank"
                rel="noopener noreferrer"
              >
                Message Bot
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Class Interaction</CardTitle>
            <CardDescription>
              Engage with instructors during sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside mb-4">
              <li>Participate in voice calls to review material</li>
              <li>Ask questions and seek explanations from instructors</li>
              <li>Access course materials on the website or Telegram</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Alert variant="default" className="mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important Note</AlertTitle>
        <AlertDescription>
          Ensure that the phone number you provided during website registration
          matches your Telegram account for seamless integration.
        </AlertDescription>
      </Alert>
    </div>
  );
}
