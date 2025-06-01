import React from 'react';

interface SizeChartProps {
  category: 'tshirt' | 'hoodie' | 'shorts' | 'coming-soon';
  isOpen: boolean;
  onClose: () => void;
}

const SizeChart: React.FC<SizeChartProps> = ({ category, isOpen, onClose }) => {
  if (!isOpen) return null;

  const renderSizeTable = () => {
    switch (category) {
      case 'tshirt':
        return (
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Chest (in)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Length (in)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Shoulder (in)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">S</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">36-38</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">27-28</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">17-18</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">M</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">38-40</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">28-29</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">18-19</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">L</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">40-42</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">29-30</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">19-20</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">XL</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">42-44</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">30-31</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">20-21</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">XXL</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">44-46</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">31-32</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">21-22</td>
              </tr>
            </tbody>
          </table>
        );
      case 'hoodie':
        return (
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Chest (in)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Length (in)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sleeve (in)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">S</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">38-40</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">26-27</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">24-25</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">M</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">40-42</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">27-28</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">25-26</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">L</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">42-44</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">28-29</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">26-27</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">XL</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">44-46</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">29-30</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">27-28</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">XXL</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">46-48</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">30-31</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">28-29</td>
              </tr>
            </tbody>
          </table>
        );
      case 'shorts':
        return (
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Waist (in)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Hip (in)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Length (in)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">S</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">28-30</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">36-38</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">18-19</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">M</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">30-32</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">38-40</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">19-20</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">L</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">32-34</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">40-42</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">20-21</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">XL</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">34-36</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">42-44</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">21-22</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">XXL</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">36-38</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">44-46</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">22-23</td>
              </tr>
            </tbody>
          </table>
        );
      default:
        return (
          <div className="text-center py-6 text-gray-400">
            Size chart not available for this product category.
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Size Chart</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-x-auto">
          {renderSizeTable()}
        </div>
        <div className="p-4 border-t border-gray-800">
          <h3 className="font-medium text-white mb-2">How to Measure</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            <li><span className="text-gray-300 font-medium">Chest:</span> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
            <li><span className="text-gray-300 font-medium">Waist:</span> Measure around your natural waistline, keeping the tape comfortably loose.</li>
            <li><span className="text-gray-300 font-medium">Hip:</span> Measure around the fullest part of your hips.</li>
            <li><span className="text-gray-300 font-medium">Length:</span> Measure from the highest point of the shoulder to the bottom hem.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SizeChart;