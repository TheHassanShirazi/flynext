'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Image from 'next/image';

interface UserProfile {
  firstName: string;
  lastName: string;
  location: string;
  email: string;
  profilePic: string | null;
  phoneNumber: string;
}

export default function EditProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login'); // Redirect if no token
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setUser(data.user);
        setFirstName(data.user.firstName);
        setLastName(data.user.lastName);
        setPhoneNumber(data.user.phoneNumber);
        setEmail(data.user.email);
        if (data.user.profilePic) {
          setProfilePicPreview(`/uploads/${data.user.profilePic.fileName}`);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred fetching profile.');
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login'); // Redirect if no token
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName, phoneNumber, email }),
      });

      localStorage.setItem('firstName', firstName); // Update first name in localStorage

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile.');
      }

      router.push('http://localhost:3000'); // Redirect to dashboard after update
    } catch (err: any) {
      setError(err.message || 'An error occurred updating profile.');
    }
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    setProfilePicture(file);

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setProfilePicPreview(previewUrl);

    // Upload the profile picture
    const token = localStorage.getItem('accessToken');
    if (!token) {
      router.push('/login');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:3000/api/auth/profile-picture', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload profile picture');
      }

      const data = await response.json();
      if (data.profilePic?.fileName) {
        setProfilePicPreview(`/uploads/${data.profilePic.fileName}`);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred uploading profile picture.');
      // Reset preview if upload failed
      setProfilePicPreview(user?.profilePic ? `/uploads/${user.profilePic}` : null);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Edit Profile</h1>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-6 flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden">
                {profilePicPreview ? (
                  <Image 
                    src={profilePicPreview}
                    alt="Profile"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <label htmlFor="profile-picture" className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-6">
                Upload Photo
              </label>
              <input
                type="file"
                id="profile-picture"
                accept="image/*"
                onChange={handleProfilePictureChange}
                className="hidden"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber || ''}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </>
  );
}