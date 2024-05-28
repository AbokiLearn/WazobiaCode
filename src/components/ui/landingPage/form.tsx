'use client';

import { useState, FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function Form() {
  const states = [
    'Abia',
    'Adamawa',
    'Akwa Ibom',
    'Anambra',
    'Bauchi',
    'Bayelsa',
    'Benue',
    'Borno',
    'Cross River',
    'Delta',
    'Ebonyi',
    'Edo',
    'Ekiti',
    'Enugu',
    'FCT',
    'Gombe',
    'Imo',
    'Jigawa',
    'Kaduna',
    'Kano',
    'Katsina',
    'Kebbi',
    'Kogi',
    'Kwara',
    'Lagos',
    'Nasarawa',
    'Niger',
    'Ogun',
    'Ondo',
    'Osun',
    'Oyo',
    'Plateau',
    'Rivers',
    'Sokoto',
    'Taraba',
    'Yobe',
    'Zamfara',
  ];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    school: '',
    state: '',
    start_date: '',
    end_date: '',
    reason: '',
  });

  const handleInputChanges = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleStateChange = (value: string) => {
    setFormData({ ...formData, state: value });
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/interest-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto rounded-lg shadow-md p-4">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Interested in joining?
        </h2>
        <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
          Please fill out the form below with your contact information and we
          will get back to you as soon as possible.
        </p>
      </div>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            type="text"
            onChange={handleInputChanges}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="Enter your email"
            type="email"
            onChange={handleInputChanges}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            placeholder="Enter your phone number"
            type="tel"
            onChange={handleInputChanges}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="school">School</Label>
          <Input
            id="school"
            placeholder="Enter your school"
            type="text"
            onChange={handleInputChanges}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select onValueChange={handleStateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_date">Summer starts on</Label>
            <Input id="start_date" type="date" onChange={handleInputChanges} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">Summer ends on</Label>
            <Input id="end_date" type="date" onChange={handleInputChanges} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Joining</Label>
          <Textarea
            id="reason"
            placeholder="Tell us why you want to join"
            onChange={handleInputChanges}
          />
        </div>
        <Button className="bg-[#F97316] text-white" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
