
'use client';

import { useState } from 'react';
import { useUser } from '@/hooks/use-user';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar as CalendarIcon, User as UserIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import type { View } from '@/app/page';

export default function ProfileView({ onNavigate }: { onNavigate: (view: View) => void }) {
  const { user, updateProfile } = useUser();
  const { toast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [gender, setGender] = useState(user?.gender);
  const [dob, setDob] = useState<Date | undefined>(user?.dob);
  const [avatar, setAvatar] = useState(user?.avatar);



  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdate = () => {
    updateProfile({ name, phone, gender, dob, avatar });
    toast({
      title: 'Profile Updated',
      description: 'Your details have been saved successfully.',
    });
    onNavigate('account');
  };



  if (!user) {
    return null; // Or a loading/error state
  }
  
  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="h-12 w-12"/>;

  return (
    <div className="bg-[#18181b] min-h-full pt-24 pb-6">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            <Avatar className="h-32 w-32 mb-4">
              <AvatarImage src={avatar} />
              <AvatarFallback className="text-5xl">{userInitial}</AvatarFallback>
            </Avatar>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-4 right-0 bg-primary text-primary-foreground rounded-full p-2 shadow-lg cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              <input id="avatar-upload" type="file" className="sr-only" accept="image/*" onChange={handleAvatarChange} />
            </label>
          </div>
        </div>

        <form className="w-full space-y-6" onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="phone">Mobile Number</Label>
              <Input type="tel" id="phone" placeholder="Enter your mobile number" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input type="email" id="email" value={user.email} disabled />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input type="text" id="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={(value: 'Male' | 'Female' | 'Other') => setGender(value)}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="dob">Date of Birth</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dob && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dob ? format(dob, "PPP") : <span>dd/mm/yyyy</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dob}
                    onSelect={setDob}
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={1950}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <Button type="submit" className="w-full">Update Details</Button>
          </form>
      </div>



      {/* Divider above footer */}
      <div className="border-t border-border w-full" />
    </div>
  );
}
