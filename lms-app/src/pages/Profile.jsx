import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const EditProfileModal = ({ isOpen, onClose, initialData, onSubmit }) => {
    const [formData, setFormData] = useState(initialData);
    const [previewImage, setPreviewImage] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Prevent role editing
        if (name === 'role') {
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                profileImage: file
            }));
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${isOpen ? 'visible' : 'invisible'}`}>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-center mb-4">
                        <label className="relative cursor-pointer">
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleImageChange}
                            />
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-200"></div>
                                <img 
                                    src={previewImage || `http://localhost:3008${initialData.profilePicture}` || `https://ui-avatars.com/api/?name=${encodeURIComponent(initialData.name)}&background=6366f1&color=fff`} 
                                    alt="Profile" 
                                    className="relative w-32 h-32 rounded-full object-cover border-2 border-white/20"
                                />
                            </div>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70">Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name || ''} 
                            onChange={handleChange}
                            className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70">Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email || ''} 
                            onChange={handleChange}
                            className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70">Role</label>
                        <input 
                            type="text" 
                            name="role" 
                            value={formData.role || ''} 
                            disabled
                            className="mt-1 block w-full bg-white/20 border border-white/20 rounded-md py-2 px-3 text-white/50 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white/70">Bio</label>
                        <textarea 
                            name="bio" 
                            value={formData.bio || ''} 
                            onChange={handleChange}
                            className="mt-1 block w-full bg-white/10 border border-white/20 rounded-md py-2 px-3 text-white focus:ring-indigo-500 focus:border-indigo-500"
                            rows="4"
                        />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const renderProfileImage = () => {
        const imageSrc = user?.profilePicture 
            ? `http://localhost:3008${user.profilePicture}` 
            : null;

        return imageSrc ? (
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-200"></div>
                <img 
                    src={imageSrc} 
                    alt="Profile" 
                    className="relative w-32 h-32 rounded-full object-cover border-2 border-white/20"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`;
                    }}
                />
            </div>
        ) : (
            <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-200"></div>
                <div className="relative w-32 h-32 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-4xl text-white border-2 border-white/20">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
            </div>
        );
    };

    const handleProfileUpdate = async (formData) => {
        try {
            const form = new FormData();
            
            // Append text fields
            if (formData.name) form.append('name', formData.name);
            if (formData.email) form.append('email', formData.email);
            if (formData.bio) form.append('bio', formData.bio);
            
            // Append image if exists
            if (formData.profileImage instanceof File) {
                form.append('profileImage', formData.profileImage);
            }

            const response = await fetch('http://localhost:3008/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: form
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to update profile: ${errorText}`);
            }

            const data = await response.json();
            if (data.success) {
                toast.success('Profile updated successfully');
                // Update user context with new data
                updateProfile(data.data);
                setIsEditModalOpen(false);
            }
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.message || 'Failed to update profile');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center p-8">
            <div className="relative w-full max-w-xl bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
                {/* Edit Button */}
                <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </button>

                <div className="flex flex-col items-center">
                    {renderProfileImage()}
                </div>

                <div className="text-center mt-6 space-y-2">
                    <h2 className="text-3xl font-bold text-white">
                        {user?.name}
                    </h2>
                    <p className="text-white/60">{user?.email}</p>
                    <div className="inline-block px-3 py-1 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                        <p className="text-indigo-300 capitalize text-sm font-medium">
                            {user?.role}
                        </p>
                    </div>
                </div>

                {user?.bio && (
                    <div className="mt-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                        <p className="text-white/80 leading-relaxed">{user.bio}</p>
                    </div>
                )}

                <EditProfileModal 
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    initialData={user}
                    onSubmit={handleProfileUpdate}
                />
            </div>
        </div>
    );
};

export default Profile;