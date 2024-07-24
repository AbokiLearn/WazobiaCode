'use client';

import { Pencil } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { CourseResponse } from '@/types/db/course';

// TODO: make this a form; enable editing when button toggle is clicked

export const CourseCard = ({ course }: { course: CourseResponse }) => {
  const [title, setTitle] = useState(course.title);
  const [slug, setSlug] = useState(course.slug);
  const [description, setDescription] = useState(course.description);
  const [coverImage, setCoverImage] = useState(course.cover_image);
  const [icon, setIcon] = useState(course.icon);
  const [active, setActive] = useState(course.active);

  return (
    <Card className="bg-card shadow">
      <CardContent>
        <div className="flex justify-between items-center my-2">
          <div className="flex items-center gap-2">
            <Label className="text-md font-semibold" htmlFor="course-title">
              Published
            </Label>
            <Switch
              checked={active}
              onCheckedChange={setActive}
              className="data-[state=checked]:bg-green-400 data-[state=unchecked]:bg-red-400"
              disabled
            />
          </div>
          <Button variant="ghost" className="hover:text-primary" size="icon">
            <Pencil className="w-6 h-6" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-md font-semibold" htmlFor="course-title">
              Title
            </Label>
            <Input
              id="course-title"
              placeholder="Course Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg"
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label className="text-md font-semibold" htmlFor="course-slug">
              Slug
            </Label>
            <Input
              id="course-slug"
              placeholder="course-title"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="text-lg"
              disabled
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label
              className="text-md font-semibold"
              htmlFor="course-description"
            >
              Description
            </Label>
            <Textarea
              id="course-description"
              placeholder="Course Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="text-lg"
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label className="text-md font-semibold" htmlFor="course-cover">
              Cover Image
            </Label>
            <div className="flex flex-col items-center gap-2">
              <Input
                id="course-cover-image"
                type="file"
                accept="image/*"
                disabled
              />
              <div className="h-32 w-full relative">
                <Image
                  src={coverImage}
                  alt="Cover Image"
                  className="rounded-lg object-contain"
                  fill
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-md font-semibold" htmlFor="course-icon">
              Icon
            </Label>
            <div className="flex flex-col items-center gap-2">
              <Input
                id="course-cover-image"
                type="file"
                accept="image/*"
                disabled
              />
              <div className="h-32 w-full relative">
                <Image
                  src={icon}
                  alt="Icon"
                  className="rounded-lg object-contain"
                  fill
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
