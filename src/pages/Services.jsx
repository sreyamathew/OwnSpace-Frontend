import React from 'react';
import { 
  Brain, 
  Shield, 
  TrendingUp, 
  Target, 
  BarChart3, 
  Bell,
  CheckCircle,
  ArrowRight,
  DollarSign,
  MapPin,
  Users,
  FileText
} from 'lucide-react';

const Services = () => {
  const mainServices = [
    {
      icon: Brain,
      title: 'AI-Powered Price Prediction',
      description: 'Get accurate property price forecasts using advanced machine learning algorithms trained on comprehensive market data.',
      features: [
        'Future price estimates with 95% accuracy',
        'Historical price trend analysis',
        'Market value assessment',
        'Comparative market analysis'
      ],
      color: 'blue'
    },
    {
      icon: Shield,
      title: 'Investment Risk Assessment',
      description: 'Evaluate investment risks with our comprehensive analysis system that considers multiple risk factors.',
      features: [
        'Low/Medium/High risk classification',
        'Crime rate analysis',
        'ROI potential evaluation',
        'Market demand assessment'
      ],
      color: 'green'
    },
    {
      icon: BarChart3,
      title: 'Market Trends & Analytics',
      description: 'Stay ahead with real-time market insights, growth zones identification, and trend predictions.',
      features: [
        'City/area-wise trend analysis',
        'Growth zone identification',
        'Market heatmaps',
        'Price movement tracking'
      ],
      color: 'purple'
    },
    {
      icon: Target,
      title: 'Personalized Recommendations',
      description: 'Receive tailored property suggestions based on your preferences, budget, and investment goals.',
      features: [
        'Content-based filtering',
        'Behavioral analysis',
        'Budget-based matching',
        'Location preference optimization'
      ],
      color: 'orange'
    }
  ];

  const additionalServices = [
    {
      icon: Users,
      title: 'Similar Property Suggestions',
      description: 'Discover properties with similar characteristics, pricing, and location features.',
      color: 'text-indigo-600'
    },
    {
      icon: Bell,
      title: 'Smart Alerts & Notifications',
      description: 'Get real-time alerts for price drops, new listings, and market changes.',
      color: 'text-red-600'
    },
    {
      icon: FileText,
      title: 'Comprehensive Reports',
      description: 'Download detailed reports on price predictions, risk analysis, and market trends.',
      color: 'text-teal-600'
    },
    {
      icon: MapPin,
      title: 'Hotspot Analysis',
      description: 'Identify emerging neighborhoods and high-growth potential areas.',
      color: 'text-pink-600'
    }
  ];

  const userTypes = [
    {
      title: 'For Investors',
      icon: DollarSign,
      description: 'Make data-driven investment decisions with comprehensive market intelligence.',
      benefits: [
        'ROI predictions and analysis',
        'Risk assessment tools',
        'Portfolio optimization',
        'Market timing insights'
      ]
    },
    {
      title: 'For Real Estate Agents',
      icon: Users,
      description: 'Enhance your service with AI-powered insights and professional reports.',
      benefits: [
        'Client presentation tools',
        'Market analysis reports',
        'Pricing recommendations',
        'Lead generation support'
      ]
    },
    {
      title: 'For Home Buyers',
      icon: MapPin,
      description: 'Find your perfect home with personalized recommendations and market insights.',
      benefits: [
        'Personalized property matching',
        'Neighborhood analysis',
        'Price fairness assessment',
        'Future value predictions'
      ]
    }
  ];

  const pricingPlans = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for getting started with basic property insights',
      features: [
        'Basic price predictions',
        'Limited property searches',
        'Basic market trends',
        'Email support'
      ],
      buttonText: 'Get Started',
      popular: false
    },
    {
      name: 'Professional',
      price: '$29/month',
      description: 'Ideal for serious investors and real estate professionals',
      features: [
        'Advanced AI predictions',
        'Unlimited property searches',
        'Detailed risk assessments',
        'Custom reports generation',
        'Priority support',
        'Market alerts'
      ],
      buttonText: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Tailored solutions for large organizations and agencies',
      features: [
        'All Professional features',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced analytics',
        'White-label options'
      ],
      buttonText: 'Contact Sales',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 to-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Services
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Comprehensive AI-powered real estate solutions designed to help you make 
              intelligent property investment decisions with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Core AI Services
            </h2>
            <p className="text-xl text-gray-600">
              Powered by advanced machine learning and artificial intelligence
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {mainServices.map((service, index) => {
              const Icon = service.icon;
              const colorClasses = {
                blue: 'text-blue-600 bg-blue-50',
                green: 'text-green-600 bg-green-50',
                purple: 'text-purple-600 bg-purple-50',
                orange: 'text-orange-600 bg-orange-50'
              };
              
              return (
                <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-200">
                  <div className={`w-16 h-16 ${colorClasses[service.color]} rounded-xl flex items-center justify-center mb-6`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Additional Features
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools to enhance your real estate experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-2 text-center">
                  <div className={`w-12 h-12 ${service.color} bg-opacity-10 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`h-6 w-6 ${service.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tailored for Every User
            </h2>
            <p className="text-xl text-gray-600">
              Specialized solutions for different real estate professionals and enthusiasts
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {userTypes.map((userType, index) => {
              const Icon = userType.icon;
              return (
                <div key={index} className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 hover:shadow-lg transition-all duration-200">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-xl flex items-center justify-center mb-6">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{userType.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{userType.description}</p>
                  <ul className="space-y-3">
                    {userType.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-primary-600 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600">
              Flexible pricing options to suit your needs and budget
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-2xl shadow-lg overflow-hidden ${plan.popular ? 'ring-2 ring-primary-600 transform scale-105' : ''}`}>
                {plan.popular && (
                  <div className="bg-primary-600 text-white text-center py-2 text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-primary-600 mb-4">{plan.price}</div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                    plan.popular 
                      ? 'bg-primary-600 text-white hover:bg-primary-700' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}>
                    {plan.buttonText}
                    <ArrowRight className="inline-block ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust OwnSpace for intelligent real estate decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200">
              Start Free Trial
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
