import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaCrown, FaGraduationCap, FaRocket } from 'react-icons/fa';

const PricingPage = () => {
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [hoveredPlan, setHoveredPlan] = useState(null);

    const plans = [
        {
            name: 'Basic',
            icon: FaGraduationCap,
            price: {
                monthly: 29,
                yearly: 290
            },
            description: 'Perfect for individual learners',
            features: [
                'Access to 100+ courses',
                'Basic course materials',
                'Course completion certificates',
                'Email support',
                'Mobile app access'
            ],
            gradient: 'from-cyan-400 to-blue-500',
            shadowColor: 'cyan-500'
        },
        {
            name: 'Pro',
            icon: FaCrown,
            price: {
                monthly: 49,
                yearly: 490
            },
            description: 'Ideal for serious learners',
            features: [
                'Everything in Basic',
                'Unlimited course access',
                'Downloadable resources',
                'Priority support',
                'Group learning sessions',
                'Advanced analytics'
            ],
            popular: true,
            gradient: 'from-blue-500 to-cyan-400',
            shadowColor: 'blue-500'
        },
        {
            name: 'Enterprise',
            icon: FaRocket,
            price: {
                monthly: 99,
                yearly: 990
            },
            description: 'For teams and organizations',
            features: [
                'Everything in Pro',
                'Custom learning paths',
                'API access',
                'Dedicated success manager',
                'Team analytics',
                'SSO integration',
                'Custom branding'
            ],
            gradient: 'from-cyan-500 to-blue-400',
            shadowColor: 'cyan-400'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const planVariants = {
        hidden: { 
            opacity: 0,
            y: 20
        },
        visible: { 
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        },
        hover: {
            y: -10,
            scale: 1.02,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10
            }
        }
    };

    const switchVariants = {
        monthly: { x: 0 },
        yearly: { x: 32 }
    };

    const checkVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { type: "spring", stiffness: 300 }
        }
    };

    const calculateYearlySavings = (monthlyPrice, yearlyPrice) => {
        const yearlyTotal = monthlyPrice * 12;
        const savings = ((yearlyTotal - yearlyPrice) / yearlyTotal * 100).toFixed(0);
        return savings;
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <motion.div 
                    className="text-center mb-12"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    <motion.h1 
                        className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-4"
                        whileHover={{ scale: 1.02 }}
                    >
                        Choose Your Learning Journey
                    </motion.h1>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Unlock your potential with our flexible pricing plans. Choose the perfect plan for your learning goals.
                    </p>
                </motion.div>

                {/* Billing Toggle */}
                <motion.div 
                    className="flex justify-center items-center gap-4 mb-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-400'}`}>
                        Monthly
                    </span>
                    <motion.div 
                        className="w-16 h-8 bg-slate-800 rounded-full p-1 cursor-pointer relative"
                        onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                    >
                        <motion.div 
                            className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full absolute"
                            variants={switchVariants}
                            animate={billingCycle}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    </motion.div>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-400'}`}>
                            Yearly
                        </span>
                        {billingCycle === 'yearly' && (
                            <motion.span 
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 text-cyan-400"
                            >
                                Save up to 20%
                            </motion.span>
                        )}
                    </div>
                </motion.div>

                {/* Pricing Cards */}
                <motion.div 
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.name}
                            variants={planVariants}
                            whileHover="hover"
                            onHoverStart={() => setHoveredPlan(plan.name)}
                            onHoverEnd={() => setHoveredPlan(null)}
                            className={`relative bg-slate-800/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 p-6 ${
                                plan.popular ? 'ring-2 ring-cyan-400' : ''
                            }`}
                        >
                            {plan.popular && (
                                <motion.div 
                                    className="absolute top-0 right-0"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white text-xs px-3 py-1 rounded-bl-lg">
                                        Most Popular
                                    </div>
                                </motion.div>
                            )}

                            {/* Plan Icon */}
                            <motion.div
                                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${plan.gradient} p-3 mb-4`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                <plan.icon className="w-full h-full text-white" />
                            </motion.div>

                            {/* Plan Name & Description */}
                            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                            <p className="text-slate-400 text-sm mb-4">{plan.description}</p>

                            {/* Price */}
                            <div className="mb-6">
                                <motion.div 
                                    className="flex items-end gap-2"
                                    animate={{ 
                                        scale: hoveredPlan === plan.name ? 1.05 : 1
                                    }}
                                >
                                    <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                                        ${billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                                    </span>
                                    <span className="text-slate-400 mb-1">
                                        /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                                    </span>
                                </motion.div>
                                {billingCycle === 'yearly' && (
                                    <motion.p 
                                        className="text-sm text-cyan-400 mt-1"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        Save {calculateYearlySavings(plan.price.monthly, plan.price.yearly)}%
                                    </motion.p>
                                )}
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, idx) => (
                                    <motion.li 
                                        key={idx}
                                        className="flex items-start gap-2 text-sm text-slate-300"
                                        variants={checkVariants}
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.2 }}
                                            className={`mt-1 text-xs bg-gradient-to-r ${plan.gradient} rounded-full p-1`}
                                        >
                                            <FaCheck className="text-white" />
                                        </motion.div>
                                        {feature}
                                    </motion.li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <motion.button
                                className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r ${plan.gradient} text-white font-medium 
                                    shadow-lg shadow-${plan.shadowColor}/20 hover:shadow-${plan.shadowColor}/40 
                                    transition-all duration-300`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Get Started
                            </motion.button>
                        </motion.div>
                    ))}
                </motion.div>

                {/* FAQ Section */}
                <motion.div 
                    className="mt-20 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2 className="text-2xl font-bold text-white mb-2">Still have questions?</h2>
                    <motion.button
                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Contact our support team
                    </motion.button>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default PricingPage;
