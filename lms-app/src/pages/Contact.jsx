import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const ContactPage = () => {
    const form = useRef();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        emailjs.init("d_fi4TGcu3xooXLz5");
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            const templateParams = {
                from_name: formData.name,
                from_email: formData.email,
                subject: formData.subject,
                message: formData.message
            };

            await emailjs.send(
                'service_z5fhhgm',
                'template_lg1marz',
                templateParams,
                'd_fi4TGcu3xooXLz5'
            );

            setStatus({
                type: 'success',
                message: 'Message sent successfully! We will get back to you soon.'
            });
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            console.error('Error:', error);
            setStatus({
                type: 'error',
                message: 'Failed to send message. Please try again later.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: FaEnvelope,
            title: 'Email Us',
            details: 'singhanurag1309@gmail.com',
            gradient: 'from-cyan-400 to-blue-500'
        },
        {
            icon: FaPhone,
            title: 'Call Us',
            details: '+91 9719877462',
            gradient: 'from-blue-500 to-cyan-400'
        },
        {
            icon: FaMapMarkerAlt,
            title: 'Visit Us',
            details: 'Agra, India',
            gradient: 'from-cyan-500 to-blue-400'
        }
    ];

    const inputClasses = "w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300";

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div 
                    className="text-center mb-16"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    <motion.h1 
                        className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-4"
                        whileHover={{ scale: 1.02 }}
                    >
                        Get in Touch
                    </motion.h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message 
                        and we'll respond as soon as possible.
                    </p>
                </motion.div>

                {/* Contact Info Cards */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {contactInfo.map((info, index) => (
                        <motion.div
                            key={index}
                            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50"
                            whileHover={{ 
                                scale: 1.02,
                                transition: { type: "spring", stiffness: 400 }
                            }}
                        >
                            <motion.div
                                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${info.gradient} p-3 mb-4`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                <info.icon className="w-full h-full text-white" />
                            </motion.div>
                            <h3 className="text-xl font-bold text-white mb-2">{info.title}</h3>
                            <p className="text-slate-400">{info.details}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Contact Form */}
                <motion.div 
                    className="max-w-3xl mx-auto bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    {status.type === 'success' && (
                        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400">
                            {status.message}
                        </div>
                    )}
                    {status.type === 'error' && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400">
                            {status.message}
                        </div>
                    )}
                    <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <label className="block text-slate-400 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={inputClasses}
                                    placeholder="Your name"
                                    required
                                    disabled={isSubmitting}
                                />
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <label className="block text-slate-400 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={inputClasses}
                                    placeholder="your@email.com"
                                    required
                                    disabled={isSubmitting}
                                />
                            </motion.div>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <label className="block text-slate-400 mb-2">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className={inputClasses}
                                placeholder="How can we help?"
                                required
                                disabled={isSubmitting}
                            />
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <label className="block text-slate-400 mb-2">Message</label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className={`${inputClasses} h-32 resize-none`}
                                placeholder="Your message..."
                                required
                                disabled={isSubmitting}
                            />
                        </motion.div>
                        <motion.button
                            type="submit"
                            className={`w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-medium px-6 py-3 rounded-xl
                                shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 
                                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default ContactPage;
