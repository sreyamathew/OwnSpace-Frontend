import React, { useState } from 'react';
import { TrendingUp, Activity, FileText, Cpu, MapPin, Maximize, Bed, Bath, Hash } from 'lucide-react';
import { propertyAPI } from '../services/api';

const SmartValuation = () => {
    const [description, setDescription] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePredict = async (e) => {
        e.preventDefault();
        if (!description.trim()) {
            setError("Please enter a property description.");
            return;
        }

        setLoading(true);
        setError(null);
        setPrediction(null);
        
        try {
            const payload = {
                description: description
            };
            
            // Using the new text-based prediction endpoint
            const res = await propertyAPI.predictTextPrice(payload);
            
            if (res.success) {
                setPrediction(res.data);
            } else {
                setError(res.message || 'Failed to get prediction');
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'ML Service connection failed';
            setError(`ML Service Error: ${errorMsg}`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center space-x-3">
                        <Cpu className="h-10 w-10 text-blue-600" />
                        <span>AI Smart Valuation</span>
                    </h1>
                    <p className="mt-4 text-lg text-gray-500">
                        Paste your property description below. Our NLP engine will extract key features and predict the market value using XGBoost.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row gap-8">
                    
                    {/* Input Form */}
                    <div className="w-full md:w-1/2 space-y-6">
                        <form onSubmit={handlePredict} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                    <FileText className="h-4 w-4 mr-2 text-blue-500" />
                                    Property Description (Unstructured Text)
                                </label>
                                <textarea
                                    name="description"
                                    rows="10"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Example: I have a 1200 sqft apartment in Kochi, 2 bedrooms, near metro, fully furnished, with 2 bathrooms and parking..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
                                />
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                    <p className="text-xs text-blue-700 leading-relaxed font-medium">
                                        💡 <span className="font-bold">Tips:</span> Include size (sqft), BHK, bathrooms, and location for better accuracy.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg flex justify-center items-center transition-all transform active:scale-95 ${
                                    loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'
                                }`}
                            >
                                {loading && (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                )}
                                {loading ? 'Analyzing Text & Running ML...' : 'Predict Property Price'}
                            </button>
                            
                            {error && (
                                <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-4 rounded-xl mt-3 flex items-start space-x-2">
                                    <span className="font-bold">Error:</span>
                                    <span>{error}</span>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Results Panel */}
                    <div className="w-full md:w-1/2 bg-gray-50 p-6 rounded-2xl border border-gray-200 relative overflow-hidden flex flex-col">
                        {!prediction && !loading ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center space-y-4">
                                <div className="p-4 bg-white rounded-full shadow-sm">
                                    <Activity className="h-12 w-12 text-gray-300" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-500">Ready for Analysis</p>
                                    <p className="text-sm mt-1">Enter your property details on the left to generate an AI-driven valuation.</p>
                                </div>
                            </div>
                        ) : loading ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-blue-600 space-y-6">
                                <div className="relative">
                                    <div className="h-20 w-20 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
                                    <Cpu className="h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="font-bold text-lg animate-pulse">Processing NLP Pipeline...</p>
                                    <p className="text-xs text-gray-500 max-w-[200px]">Extracting features, normalizing tokens, and running XGBoost inference.</p>
                                </div>
                            </div>
                        ) : prediction && (
                            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                                <div>
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Estimated Market Value</h3>
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-4xl font-extrabold text-blue-700">
                                            ₹{prediction.predicted_price.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1 font-medium">
                                        {prediction.risk_category === 'High' ? 'Confidence: Low (R² ≈ 0.70)' : 
                                         prediction.risk_category === 'Medium' ? 'Confidence: Moderate (R² ≈ 0.85)' : 
                                         'Confidence: High (R² ≈ 0.94)'}
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Investment Risk</p>
                                        <p className={`text-lg font-bold mt-1 ${
                                            prediction.risk_category === 'High' ? 'text-red-600' :
                                            prediction.risk_category === 'Medium' ? 'text-orange-500' : 'text-green-600'
                                        }`}>{prediction.risk_category || 'Low'}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">detected City</p>
                                        <p className="text-lg font-bold mt-1 text-gray-700 capitalize">{prediction.extracted_features?.location || 'Unknown'}</p>
                                    </div>
                                </div>

                                <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                                    <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3 flex items-center">
                                        <Hash className="h-3 w-3 mr-2" />
                                        Extracted Structured Data
                                    </h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="text-center">
                                            <p className="text-[10px] text-indigo-400 font-bold uppercase">Size</p>
                                            <p className="font-bold text-indigo-900">{prediction.extracted_features?.size} <span className="text-[10px]">sqft</span></p>
                                        </div>
                                        <div className="text-center border-x border-indigo-200">
                                            <p className="text-[10px] text-indigo-400 font-bold uppercase">BHK</p>
                                            <p className="font-bold text-indigo-900">{prediction.extracted_features?.bhk}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] text-indigo-400 font-bold uppercase">Bath</p>
                                            <p className="font-bold text-indigo-900">{prediction.extracted_features?.bath}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <h4 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest flex items-center">
                                        <Cpu className="h-3 w-3 mr-2 text-indigo-500" />
                                        NLP Feature Vector (TF-IDF)
                                    </h4>
                                    {prediction.text_features && prediction.text_features.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {prediction.text_features.map((val, idx) => (
                                                <div key={idx} className="bg-white text-indigo-600 text-[10px] font-mono px-2 py-1 rounded-md border border-indigo-100 shadow-sm" title={`Feature ${idx+1}`}>
                                                    {val.toFixed(3)}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic bg-gray-100 p-2 rounded">No text features extracted.</p>
                                    )}
                                    <p className="text-[10px] text-gray-400 mt-4 leading-relaxed italic">
                                        * The AI engine has parsed your natural language input into a semantic vector and extracted parameters to satisfy the XGBoost model's feature requirements.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SmartValuation;
