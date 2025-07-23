import React from 'react';
import { 
  Target, 
  Eye, 
  Award, 
  Users, 
  TrendingUp, 
  Shield, 
  Brain,
  CheckCircle,
  Linkedin,
  Twitter
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Brain,
      title: 'Innovation',
      description: 'We leverage cutting-edge AI and ML technologies to revolutionize real estate decision-making.'
    },
    {
      icon: Shield,
      title: 'Trust',
      description: 'We build trust through transparency, accuracy, and reliable data-driven insights.'
    },
    {
      icon: Users,
      title: 'Customer-Centric',
      description: 'Our platform is designed with users at the center, ensuring intuitive and valuable experiences.'
    },
    {
      icon: TrendingUp,
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our service, from accuracy to user experience.'
    }
  ];

  const team = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      bio: 'Former real estate executive with 15+ years of experience in property investment and market analysis.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      bio: 'AI/ML expert with PhD in Computer Science, specializing in predictive analytics and machine learning.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      name: 'Michael Rodriguez',
      role: 'Head of Product',
      bio: 'Product strategist with extensive experience in fintech and proptech solutions.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      name: 'Emily Davis',
      role: 'Head of Data Science',
      bio: 'Data scientist with expertise in real estate analytics and predictive modeling.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
      social: {
        linkedin: '#',
        twitter: '#'
      }
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'OwnSpace was founded with a vision to democratize real estate intelligence.'
    },
    {
      year: '2021',
      title: 'AI Platform Launch',
      description: 'Launched our first AI-powered property price prediction model.'
    },
    {
      year: '2022',
      title: 'Risk Assessment',
      description: 'Introduced comprehensive investment risk assessment tools.'
    },
    {
      year: '2023',
      title: 'Market Expansion',
      description: 'Expanded to 50+ cities with enhanced market analysis features.'
    },
    {
      year: '2024',
      title: 'Advanced Analytics',
      description: 'Launched next-generation recommendation engine and market insights.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About OwnSpace
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing real estate decision-making through artificial intelligence,
              making property investment accessible, transparent, and profitable for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To democratize real estate intelligence by providing AI-powered insights that enable
                informed property investment decisions for investors, agents, and buyers of all levels.
                We believe everyone deserves access to sophisticated market analysis and predictive tools.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Accurate AI-powered price predictions</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Comprehensive risk assessment tools</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Personalized property recommendations</span>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
                  <Eye className="h-6 w-6" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                To become the world's leading platform for intelligent real estate decisions,
                where every property transaction is backed by data-driven insights and AI-powered
                analysis. We envision a future where real estate investment is transparent,
                accessible, and profitable for all.
              </p>
              <div className="bg-primary-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-primary-800 mb-3">Our Impact</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">10K+</div>
                    <div className="text-sm text-primary-700">Properties Analyzed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600">95%</div>
                    <div className="text-sm text-primary-700">Prediction Accuracy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg text-center hover:shadow-xl transition-all duration-200 transform hover:-translate-y-2">
                  <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              Key milestones in our mission to revolutionize real estate
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-primary-200"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-full max-w-md ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                          {milestone.year}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                      </div>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary-600 rounded-full border-4 border-white"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600">
              The experts behind OwnSpace's innovative solutions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-200 transform hover:-translate-y-2">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                  <div className="flex space-x-3">
                    <a
                      href={member.social.linkedin}
                      className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                    <a
                      href={member.social.twitter}
                      className="text-gray-400 hover:text-primary-600 transition-colors duration-200"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join Us in Revolutionizing Real Estate
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Whether you're an investor, agent, or looking for your dream home,
            OwnSpace provides the intelligence you need to make confident decisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors duration-200">
              Get Started Today
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-700 transition-all duration-200">
              Contact Our Team
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
