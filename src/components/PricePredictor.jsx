import React, { useState } from 'react';
import { TrendingUp, Activity, Clock, Cpu } from 'lucide-react';
import { propertyAPI } from '../services/api';

const PricePredictor = ({ location, size, bhk, bath }) => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handlePredict = async () => {
        setLoading(true);
        setError(null);
        try {
            // Use just the city name for location if it's an object
            const locString = typeof location === 'object' ? location.city : location;

            const res = await propertyAPI.predictPrice({
                location: locString || 'Kochi',
                size: parseInt(size) || 1000,
                bhk: parseInt(bhk) || 2,
                bath: parseInt(bath) || 2
            });

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
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <h3 className="font-bold text-gray-800">Smart Price Estimator</h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white px-2 py-0.5 rounded-full">
                    Powered by XGBoost
                </span>
            </div>

            {!prediction && !loading && (
                <div className="text-center py-2">
                    <p className="text-sm text-gray-600 mb-4">
                        Want to see how this property compares to market trends?
                    </p>
                    <button
                        onClick={handlePredict}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-md flex items-center justify-center space-x-2"
                    >
                        <span>Analyze Market Value</span>
                    </button>
                </div>
            )}

            {loading && (
                <div className="flex flex-col items-center justify-center py-4 space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-sm font-medium text-blue-600">AI Model Analyzing Data...</p>
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-lg text-xs font-medium">
                    ⚠️ {error}
                </div>
            )}

            {prediction && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="bg-white p-4 rounded-lg shadow-inner border border-blue-50">
                        <p className="text-xs text-gray-500 uppercase font-bold mb-1">Estimated Market Price</p>
                        <div className="text-2xl font-black text-indigo-700">
                            ₹ {prediction.predicted_price.toLocaleString('en-IN')}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-2 bg-white/50 p-2 rounded border border-gray-100">
                            <Activity className="h-4 w-4 text-green-500" />
                            <div>
                                <p className="text-[10px] text-gray-500">Amenity Score</p>
                                <p className="text-sm font-bold">{prediction.augmented_features.amenitiesScore}/10</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 bg-white/50 p-2 rounded border border-gray-100">
                            <Clock className="h-4 w-4 text-orange-400" />
                            <div>
                                <p className="text-[10px] text-gray-500">Property Age</p>
                                <p className="text-sm font-bold">{prediction.augmented_features.propertyAge} Years</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setPrediction(null)}
                        className="text-xs text-blue-600 font-bold hover:underline"
                    >
                        Reset Analysis
                    </button>
                </div>
            )}
        </div>
    );
};

export default PricePredictor;
