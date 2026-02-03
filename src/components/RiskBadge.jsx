import React from 'react';
import { AlertTriangle, ShieldCheck, AlertCircle, Info } from 'lucide-react';

const RiskBadge = ({ category, score, explanation, showExplanation = true }) => {
    const getRiskDetails = (cat) => {
        switch (cat?.toUpperCase()) {
            case 'LOW':
                return {
                    color: 'bg-green-100 text-green-800 border-green-200',
                    icon: <ShieldCheck className="h-4 w-4" />,
                    label: 'Low Risk'
                };
            case 'MEDIUM':
                return {
                    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    icon: <Info className="h-4 w-4" />,
                    label: 'Medium Risk'
                };
            case 'HIGH':
                return {
                    color: 'bg-red-100 text-red-800 border-red-200',
                    icon: <AlertTriangle className="h-4 w-4" />,
                    label: 'High Risk'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800 border-gray-200',
                    icon: <AlertCircle className="h-4 w-4" />,
                    label: 'Risk Unknown'
                };
        };
    };

    const { color, icon, label } = getRiskDetails(category);

    return (
        <div className="flex flex-col space-y-1">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold border ${color}`}>
                {icon}
                <span>{label} {score !== undefined && `(${score})`}</span>
            </div>
            {showExplanation && explanation && (
                <p className="text-xs text-gray-500 mt-1 italic">
                    {explanation}
                </p>
            )}
        </div>
    );
};

export default RiskBadge;
