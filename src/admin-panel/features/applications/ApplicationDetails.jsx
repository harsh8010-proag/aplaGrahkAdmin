import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Info, FileText, Edit2, Download, Check, X, Phone, MapPin } from 'lucide-react';
import Button from '../../../shared/components/Button';

export default function ApplicationDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('personal');

  // Helper for text fields to match UI
  const InputField = ({ label, value, readOnly = true }) => (
    <div className="flex flex-col">
      <label className="text-sm font-bold text-[#041A40] mb-2">{label}</label>
      <input 
        type="text" 
        value={value} 
        readOnly={readOnly}
        className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-500 font-medium focus:outline-none w-full"
      />
    </div>
  );

  return (
    <div className="w-auto lg:-mx-4 xl:-mx-8 space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 space-y-4 xl:space-y-0">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate(-1)} className="hover:opacity-70 transition-opacity">
            <ArrowLeft className="w-6 h-6 text-[#041A40]" />
          </button>
          <div>
            <div className="flex items-center space-x-4">
              <h1 className="text-[28px] font-bold text-[#041A40]">Application AAPL - 2078678</h1>
              <span className="px-3.5 py-1 bg-[#FFEDD5] text-[#F97316] rounded-full text-xs font-bold inline-flex justify-center">Pending</span>
            </div>
            <p className="text-sm font-bold text-[#041A40] mt-1">
              Aadhaar Update <span className="mx-2">|</span> Submitted On 2026 - 02 - 02
            </p>
          </div>
        </div>
        
        {/* Top Right Actions */}
        <div className="flex items-center space-x-3 w-full xl:w-auto justify-end">
          <button className="flex items-center justify-center hover:scale-105 active:scale-95 transition-transform focus:outline-none shrink-0">
            <img 
              src="/Icons/whatsapp icon.svg" 
              alt="WhatsApp" 
              className="w-10 h-10 object-contain"
            />
          </button>
          <Button icon={Download} className="text-sm px-4">Download Documents</Button>
          <button className="w-8 h-8 rounded-full bg-[#22C55E] text-white flex items-center justify-center hover:scale-110 transition-transform">
            <Check className="w-5 h-5" strokeWidth={3} />
          </button>
          <button className="w-8 h-8 rounded-full bg-[#EF4444] text-white flex items-center justify-center hover:scale-110 transition-transform">
            <X className="w-5 h-5" strokeWidth={3} />
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Main Content */}
        <div className="flex-1 space-y-6">
          {/* Tabs */}
          <div className="flex flex-wrap items-center px-4 py-2 bg-[#F8F9FA] border border-gray-100 rounded-2xl w-full space-x-2">
            <button 
              onClick={() => setActiveTab('personal')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'personal' ? 'text-[#041A40]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {activeTab === 'personal' ? (
                <div className="w-6 h-6 rounded-full bg-[#041A40] flex items-center justify-center text-white">
                  <Info className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-6 h-6 flex items-center justify-center">
                  <Info className="w-5 h-5" />
                </div>
              )}
              <span>Personal Info</span>
            </button>
            <button 
              onClick={() => setActiveTab('documents')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'documents' ? 'text-[#041A40]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {activeTab === 'documents' ? (
                <div className="w-6 h-6 rounded-full bg-[#041A40] flex items-center justify-center text-white">
                  <FileText className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-6 h-6 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
              )}
              <span>Documents</span>
            </button>
            <button 
              onClick={() => setActiveTab('corrections')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'corrections' ? 'text-[#041A40]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {activeTab === 'corrections' ? (
                <div className="w-6 h-6 rounded-full bg-[#041A40] flex items-center justify-center text-white">
                  <Edit2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-6 h-6 flex items-center justify-center">
                  <Edit2 className="w-5 h-5" />
                </div>
              )}
              <span>Corrections</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="w-full">
            {activeTab === 'personal' && (
              <div className="space-y-6">
                {/* Personal Details */}
                <div className="p-6 border border-gray-200 rounded-[20px] bg-white">
                  <h2 className="text-[#041A40] font-bold text-lg mb-6">Personal Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InputField label="Full Name" value="John Doe" />
                    <InputField label="Father Name" value="Raju" />
                    <InputField label="Mother Name" value="Meena" />
                    <InputField label="Mobile no" value="+91 8484 141 141" />
                    <InputField label="Date of Birth *" value="20-05-2006" />
                    <InputField label="Gender" value="Male" />
                  </div>
                </div>

                {/* Address Details */}
                <div className="p-6 border border-gray-200 rounded-[20px] bg-white">
                  <h2 className="text-[#041A40] font-bold text-lg mb-6">Address Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InputField label="Full address" value="Golden city center" />
                    <InputField label="State" value="Maharashtra" />
                    <InputField label="District" value="Select" />
                    <InputField label="City / Village" value="Select" />
                    <InputField label="Pin Code" value="431001" />
                  </div>
                </div>

                {/* Application Information */}
                <div className="p-6 border border-gray-200 rounded-[20px] bg-white">
                  <h2 className="text-[#041A40] font-bold text-lg mb-6">Application Information</h2>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-[#041A40] mb-2">Additional Notes ( Optional )</label>
                    <textarea 
                      readOnly
                      className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-400 font-medium focus:outline-none w-full h-32 resize-none"
                      value="I have to change my address"
                    ></textarea>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-4">
                  {[1, 2].map((doc) => (
                    <div key={doc} className="p-4 border border-gray-50 bg-[#F4F7FE] rounded-2xl flex items-start space-x-4 w-full sm:w-[320px]">
                      <div className="w-10 h-10 bg-[#E1E7F5] text-[#041A40] rounded-xl flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-[#041A40] text-sm mb-1">Aadhaar Card</p>
                        <p className="text-xs text-gray-400 mb-4">uploaded on 15 Nov 2025</p>
                        <div className="flex items-center space-x-4">
                          <button className="text-[#041A40] hover:scale-110 transition-transform focus:outline-none">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                            </svg>
                          </button>
                          <button className="w-5 h-5 rounded-full bg-[#22C55E] text-white flex items-center justify-center hover:scale-110 transition-transform">
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </button>
                          <button className="w-5 h-5 rounded-full bg-[#EF4444] text-white flex items-center justify-center hover:scale-110 transition-transform">
                            <X className="w-3 h-3" strokeWidth={3} />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600 hover:scale-110 transition-transform">
                            <Download className="w-[18px] h-[18px]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Send Message Input at bottom */}
                <div className="mt-8 relative w-full">
                  <input 
                    type="text" 
                    placeholder="Send Message"
                    className="w-full pl-4 pr-12 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-[#FF8303]"
                  />
                  <button className="absolute right-3 top-1/2 -translate-y-1/2 hover:scale-105 active:scale-95 transition-transform focus:outline-none">
                    <img 
                      src="/Icons/whatsapp icon.svg" 
                      alt="WhatsApp" 
                      className="w-8 h-8 object-contain"
                    />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'corrections' && (
              <div className="p-6 border border-gray-200 rounded-[20px] bg-white flex items-center justify-center h-64 text-gray-400 font-bold">
                No Corrections Requested
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-full xl:w-[350px] shrink-0 flex flex-col gap-6">
          {/* User Profile Card */}
          <div className="border border-gray-200 rounded-[20px] p-5 bg-white">
            <div className="flex items-center space-x-4 border-b border-gray-100 pb-4 mb-4">
              <div className="w-[50px] h-[50px] bg-[#041A40] rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                JD
              </div>
              <div>
                <h3 className="font-bold text-[#041A40] text-base">John Doe</h3>
                <p className="text-xs text-gray-400">User-23456789</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-[#FF8303] mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 font-bold mb-0.5">Contact No</p>
                  <p className="text-sm font-bold text-gray-800">+91 8585858585</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-[#FF8303] mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 font-bold mb-0.5">Address</p>
                  <p className="text-sm font-bold text-gray-800 leading-tight">
                    Golden city center ,Nashik , Maharashtra, 4310009
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Card */}
          <div className="border border-gray-200 rounded-[20px] p-5 bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#041A40]">Payment</h3>
              <span className="px-3 py-1 bg-[#FFEDD5] text-[#F97316] rounded-full text-[10px] font-bold">Pending</span>
            </div>
            <div className="bg-[#E1F5FE]/50 rounded-xl p-4 mb-4 flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-400 font-bold mb-1">Total paid</p>
                <p className="text-xl font-bold text-[#041A40]">₹199</p>
              </div>
              <p className="text-xs text-gray-400 font-bold">TXN-12345</p>
            </div>
            <div className="flex justify-between items-center px-4 py-3 border border-gray-100 rounded-xl">
              <span className="text-sm text-gray-400 font-bold">Payment Method</span>
              <span className="text-sm font-bold text-[#041A40]">UPI</span>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="border border-gray-200 rounded-[20px] p-6 bg-white">
            <h3 className="font-bold text-[#041A40] mb-6">Timeline</h3>
            <div className="space-y-6 relative">
              
              <div className="relative flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-[#22C55E] flex items-center justify-center shrink-0 z-10 border-4 border-white shadow-sm">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#041A40]">Application Submitted</p>
                  <p className="text-xs text-gray-400">20-02-2026</p>
                </div>
                {/* Connecting line */}
                <div className="absolute left-3 top-6 w-0.5 h-6 bg-[#22C55E] -translate-x-1/2 z-0"></div>
              </div>

              <div className="relative flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-white border-2 border-[#22C55E] flex items-center justify-center shrink-0 z-10 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-[#22C55E]"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#041A40]">Payment Received</p>
                  <p className="text-xs text-gray-400">20-02-2026</p>
                </div>
                {/* Connecting line */}
                <div className="absolute left-3 top-6 w-0.5 h-6 bg-gray-200 -translate-x-1/2 z-0"></div>
              </div>

              <div className="relative flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shrink-0 z-10 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#041A40]">Processed</p>
                  <p className="text-xs text-gray-400">pending</p>
                </div>
                {/* Connecting line */}
                <div className="absolute left-3 top-6 w-0.5 h-6 bg-gray-200 -translate-x-1/2 z-0"></div>
              </div>

              <div className="relative flex items-center gap-4">
                <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shrink-0 z-10 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-gray-200"></div>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#041A40]">Completed</p>
                  <p className="text-xs text-gray-400">pending</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
