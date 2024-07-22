'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';

import { isPossiblePhoneNumber } from 'react-phone-number-input';
import type { E164Number } from 'libphonenumber-js/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PhoneInput } from '@/components/landing-page/phone-input';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { postData } from '@/lib/client';
import { env } from '@/lib/config';
import { UserMetadata } from '@/types/auth';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phoneNumber: z
    .string()
    .refine(
      (value) => isPossiblePhoneNumber(value, 'NG'),
      'Phone number is not valid',
    ),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const CompleteProfilePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
    },
  });

  useEffect(() => {
    if (user) {
      const userMetadata = user[`${env.AUTH0_NAMESPACE}/user_metadata`] as
        | UserMetadata
        | undefined;
      setValue(
        'firstName',
        (userMetadata?.firstName as string) ||
          (user?.given_name as string) ||
          '',
      );
      setValue(
        'lastName',
        (userMetadata?.lastName as string) ||
          (user?.family_name as string) ||
          '',
      );
      setValue('phoneNumber', (userMetadata?.phoneNumber as string) || '');
    }
  }, [user, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      const response = await postData('/auth/metadata', data);

      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      } else {
        // should not happen (fallback)
        router.push('/app');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-secondary">
      <div className="mb-8">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={150}
          height={150}
          className="rounded-lg w-28 h-28"
        />
      </div>

      <Card className="bg-card rounded-lg w-[350px] md:w-[400px]">
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            Please provide the following information to complete your profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="Enter your first name"
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Enter your last name"
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field: { onChange, value, ...field } }) => (
                    <PhoneInput
                      id="phoneNumber"
                      placeholder="Enter your Nigerian phone number"
                      defaultCountry="NG"
                      countries={['NG']}
                      countrySelectProps={{ disabled: true }}
                      value={value as E164Number}
                      onChange={(v: E164Number | undefined) =>
                        onChange(v || '')
                      }
                      {...field}
                    />
                  )}
                />
                <p className="text-sm text-muted-foreground mb-2">
                  This phone number must be associated with your Telegram
                  account.
                </p>
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            </div>
            <CardFooter className="flex justify-center mt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Profile'}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteProfilePage;
