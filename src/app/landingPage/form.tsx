import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function Form() {
  return (
    <section className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Interested in Joining?</h2>
      <form className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Enter your name" type="text" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="Enter your email" type="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" placeholder="Enter your phone number" type="tel" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="school">School</Label>
          <Input id="school" placeholder="Enter your school" type="text" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input id="state" placeholder="Enter your state" type="text" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Summer starts on</Label>
            <Input id="start-date" type="date" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">Summer ends on</Label>
            <Input id="end-date" type="date" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Joining</Label>
          <Textarea id="reason" placeholder="Tell us why you want to join" />
        </div>
        <Button className="bg-[#F97316] text-white" type="submit">
          Submit
        </Button>
      </form>
    </section>
  );
}
