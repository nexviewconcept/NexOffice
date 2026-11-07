import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FileText, Download, Trash2, Search, Mail, MessageSquare, Eye, Plus, Building, User, Calendar, ExternalLink } from 'lucide-react';
import api from '../lib/api';
import { Modal } from '../components/ui/Modal';
import { format } from 'date-fns';

interface AcceptanceLetterItem {
  id: string;
  studentName: string;
  matricNumber: string;
  department: string;
  course?: string;
  gender: string;
  duration?: string;
  recipientAddress: string;
  signatoryName: string;
  signatoryTitle: string;
  qrCodeUrl?: string;
  dateIssued: string;
}

export default function ITLetters() {
  const [letters, setLetters] = useState<AcceptanceLetterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Smart Preset States
  const [presetType, setPresetType] = useState<'SIWES' | 'HOD' | 'CUSTOM'>('SIWES');
  const [institution, setInstitution] = useState('Umaru Musa Yar\'adua University');
  const [location, setLocation] = useState('Katsina State, Nigeria.');
  const [deptField, setDeptField] = useState('Computer Science');
  const [durationPreset, setDurationPreset] = useState<'BLANK' | 'CUSTOM'>('BLANK');
  const [customDuration, setCustomDuration] = useState('');

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      studentName: '',
      matricNumber: '',
      department: 'Computer Science',
      gender: 'MALE',
      recipientAddress: "The Coordinator,\nIndustrial Training / SIWES Unit,\nUmaru Musa Yar'adua University,\nKatsina State, Nigeria.",
      signatoryName: 'Faiza Saidu',
      signatoryTitle: 'Chief Operations Officer (COO)'
    }
  });

  const [previewLetter, setPreviewLetter] = useState<AcceptanceLetterItem | null>(null);
  const [sendEmailModal, setSendEmailModal] = useState<string | null>(null);
  const [emailTo, setEmailTo] = useState('');
  const [sendWhatsappModal, setSendWhatsappModal] = useState<string | null>(null);
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      const res = await api.get('/acceptance-letters');
      setLetters(res.data);
    } catch (err) {
      console.error('Failed to fetch letters:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to re-generate Smart Preset recipient address
  const updatePresetAddress = (type: 'SIWES' | 'HOD' | 'CUSTOM', inst: string, loc: string, dept: string) => {
    if (type === 'SIWES') {
      const text = `The Coordinator,\nIndustrial Training / SIWES Unit,\n${inst || 'Umaru Musa Yar\'adua University'},\n${loc || 'Katsina State, Nigeria.'}`;
      setValue('recipientAddress', text);
    } else if (type === 'HOD') {
      const text = `The Head of Department,\nDepartment of ${dept || 'Computer Science'},\n${inst || 'Umaru Musa Yar\'adua University'},\n${loc || 'Katsina State, Nigeria.'}`;
      setValue('recipientAddress', text);
    }
  };

  const handlePresetChange = (type: 'SIWES' | 'HOD' | 'CUSTOM') => {
    setPresetType(type);
    updatePresetAddress(type, institution, location, deptField);
  };

  const handleInstitutionChange = (val: string) => {
    setInstitution(val);
    updatePresetAddress(presetType, val, location, deptField);
  };

  const handleLocationChange = (val: string) => {
    setLocation(val);
    updatePresetAddress(presetType, institution, val, deptField);
  };

  const handleDeptChange = (val: string) => {
    setDeptField(val);
    setValue('department', val);
    if (presetType === 'HOD') {
      updatePresetAddress(presetType, institution, location, val);
    }
  };

  const handleSignatoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'Faiza Saidu') {
      setValue('signatoryName', 'Faiza Saidu');
      setValue('signatoryTitle', 'Chief Operations Officer (COO)');
    } else if (val === 'Aminu A. Saidu') {
      setValue('signatoryName', 'Aminu A. Saidu');
      setValue('signatoryTitle', 'Managing Director (MD)');
    } else if (val === 'Isiyaku Saidu') {
      setValue('signatoryName', 'Isiyaku Saidu');
      setValue('signatoryTitle', 'Chief Technology Officer (CTO)');
    } else if (val === 'Muhammad Said') {
      setValue('signatoryName', 'Muhammad Said');
      setValue('signatoryTitle', 'Chief Marketing Officer (CMO)');
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        course: data.department || data.course,
        duration: durationPreset === 'BLANK' ? 'From _____________ to _____________' : (customDuration || 'From _____________ to _____________'),
        institutionName: institution,
      };
      await api.post('/acceptance-letters', payload);
      setIsCreateModalOpen(false);
      reset();
      fetchLetters();
      alert('Acceptance letter generated successfully with QR Code!');
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || 'Failed to generate letter';
      alert(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (id: string, matric: string) => {
    try {
      const response = await api.get(`/acceptance-letters/${id}/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      const safeMatric = (matric || 'student').replace(/[\/\\?%*:|"<>]/g, '_');
      link.setAttribute('download', `Acceptance_Letter_${safeMatric}.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Failed to download PDF. Please check if backend is running.');
    }
  };

  const handleSendEmail = async (id: string) => {
    try {
      await api.post(`/acceptance-letters/${id}/email`, { email: emailTo });
      setSendEmailModal(null);
      setEmailTo('');
      alert('Letter sent via email successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to send email.');
    }
  };

  const handleSendWhatsapp = async (id: string) => {
    try {
      await api.post(`/acceptance-letters/${id}/whatsapp`, { phone: whatsappPhone });
      setSendWhatsappModal(null);
      setWhatsappPhone('');
      alert('Letter sent via WhatsApp successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to send WhatsApp message.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this acceptance letter?')) return;
    try {
      await api.delete(`/acceptance-letters/${id}`);
      fetchLetters();
    } catch (err) {
      console.error(err);
      alert('Failed to delete letter');
    }
  };

  const filteredLetters = letters.filter(l => 
    (l.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.matricNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.department || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center">
            <FileText className="w-8 h-8 mr-3 text-[#E50914]" />
            SIWES / IT Acceptance Letters
          </h1>
          <p className="text-gray-500 text-sm mt-1">Issue, generate, and verify official SIWES acceptance letters with authentic QR verification.</p>
        </div>
        <button 
          onClick={() => {
            reset({
              studentName: '',
              matricNumber: '',
              department: 'Computer Science',
              gender: 'MALE',
              recipientAddress: "The Coordinator,\nIndustrial Training / SIWES Unit,\nUmaru Musa Yar'adua University,\nKatsina State, Nigeria.",
              signatoryName: 'Faiza Saidu',
              signatoryTitle: 'Chief Operations Officer (COO)'
            });
            setPresetType('SIWES');
            setInstitution('Umaru Musa Yar\'adua University');
            setLocation('Katsina State, Nigeria.');
            setDeptField('Computer Science');
            setDurationPreset('BLANK');
            setCustomDuration('');
            setIsCreateModalOpen(true);
          }}
          className="px-4 py-2.5 bg-[#E50914] text-white rounded-xl hover:bg-red-700 font-medium inline-flex items-center shadow-sm transition-colors text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Issue New Acceptance Letter
        </button>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by student name, matric no, dept..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>
          <div className="text-xs text-gray-400 font-medium">
            Total Letters: {filteredLetters.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Date Issued</th>
                <th className="px-6 py-4 font-medium">Student Name</th>
                <th className="px-6 py-4 font-medium">Matric No</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Signatory</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading acceptance letters...</td></tr>
              ) : filteredLetters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400">
                    <FileText className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                    <p className="font-medium text-gray-500">No acceptance letters found</p>
                    <p className="text-xs text-gray-400 mt-1">Click "Issue New Acceptance Letter" to create your first letter.</p>
                  </td>
                </tr>
              ) : filteredLetters.map(letter => (
                <tr key={letter.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(letter.dateIssued), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{letter.studentName}</div>
                    <span className="text-[10px] bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-medium">
                      {letter.gender === 'FEMALE' ? 'Female' : 'Male'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 font-mono font-medium">{letter.matricNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>{letter.department}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="font-medium text-gray-900 dark:text-gray-200">{letter.signatoryName || 'Faiza Saidu'}</div>
                    <div className="text-xs text-gray-400">{letter.signatoryTitle || 'COO'}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button 
                        onClick={() => setPreviewLetter(letter)}
                        className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                        title="Preview Details & QR Code"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDownload(letter.id, letter.matricNumber)}
                        className="p-2 text-blue-600 hover:text-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors" 
                        title="Download Official PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setSendEmailModal(letter.id)}
                        className="p-2 text-green-600 hover:text-green-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/40 transition-colors" 
                        title="Send via Email"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setSendWhatsappModal(letter.id)}
                        className="p-2 text-emerald-600 hover:text-emerald-700 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors" 
                        title="Send via WhatsApp"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(letter.id)}
                        className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors" 
                        title="Delete Letter"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL WITH SMART PRESETS */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Issue SIWES / IT Acceptance Letter">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-h-[80vh] overflow-y-auto px-1 pr-2">
          
          {/* Section 1: Student Information */}
          <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
            <h3 className="text-xs uppercase font-bold text-gray-500 tracking-wider flex items-center">
              <User className="w-4 h-4 mr-1.5 text-red-500" />
              1. Student Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Student Full Name *</label>
                <input 
                  required 
                  {...register('studentName')} 
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm outline-none focus:ring-2 focus:ring-red-500" 
                  placeholder="e.g. Nasir Ishaq Maiwada" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Matric / Reg Number *</label>
                <input 
                  required 
                  {...register('matricNumber')} 
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm font-mono outline-none focus:ring-2 focus:ring-red-500" 
                  placeholder="e.g. U1/24/CSC/0572" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Department *</label>
                <input 
                  required 
                  value={deptField}
                  onChange={(e) => handleDeptChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm outline-none focus:ring-2 focus:ring-red-500" 
                  placeholder="e.g. Computer Science" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Student Gender (Pronoun) *</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <label className="flex items-center justify-center p-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-medium">
                    <input type="radio" value="MALE" {...register('gender')} className="mr-1.5 text-red-600 focus:ring-red-500" />
                    Male (his / he)
                  </label>
                  <label className="flex items-center justify-center p-2 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-xs font-medium">
                    <input type="radio" value="FEMALE" {...register('gender')} className="mr-1.5 text-red-600 focus:ring-red-500" />
                    Female (her / she)
                  </label>
                </div>
              </div>
            </div>

            {/* Duration Section */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Training Duration</label>
              <div className="flex gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setDurationPreset('BLANK')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    durationPreset === 'BLANK' 
                      ? 'bg-red-50 border-red-500 text-red-600 dark:bg-red-950 dark:border-red-700 dark:text-red-300' 
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Standard Blank Lines (From ____ to ____)
                </button>
                <button
                  type="button"
                  onClick={() => setDurationPreset('CUSTOM')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    durationPreset === 'CUSTOM' 
                      ? 'bg-red-50 border-red-500 text-red-600 dark:bg-red-950 dark:border-red-700 dark:text-red-300' 
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  Specify Dates / Text
                </button>
              </div>
              {durationPreset === 'CUSTOM' && (
                <input 
                  type="text"
                  value={customDuration}
                  onChange={(e) => setCustomDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm outline-none focus:ring-2 focus:ring-red-500" 
                  placeholder="e.g. From 20th October, 2026 to 20th April, 2027 (6 Months)" 
                />
              )}
            </div>
          </div>

          {/* Section 2: SMART RECIPIENT PRESETS */}
          <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-4">
            <h3 className="text-xs uppercase font-bold text-gray-500 tracking-wider flex items-center justify-between">
              <span className="flex items-center">
                <Building className="w-4 h-4 mr-1.5 text-red-500" />
                2. Recipient Address (Smart Presets)
              </span>
              <span className="text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded-full font-semibold">
                Auto-Formatted
              </span>
            </h3>

            {/* Smart Preset Pills */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Choose Preset Style:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetChange('SIWES')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left flex flex-col transition-all ${
                    presetType === 'SIWES'
                      ? 'bg-red-500 text-white border-red-500 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="font-bold">SIWES / IT Unit</span>
                  <span className="text-[10px] opacity-80">The Coordinator, SIWES Unit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetChange('HOD')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left flex flex-col transition-all ${
                    presetType === 'HOD'
                      ? 'bg-red-500 text-white border-red-500 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="font-bold">Head of Department</span>
                  <span className="text-[10px] opacity-80">The Head of Department (HOD)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetChange('CUSTOM')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-left flex flex-col transition-all ${
                    presetType === 'CUSTOM'
                      ? 'bg-red-500 text-white border-red-500 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="font-bold">Custom Address</span>
                  <span className="text-[10px] opacity-80">Manual address typing</span>
                </button>
              </div>
            </div>

            {/* Quick helper inputs for Institution and State */}
            {presetType !== 'CUSTOM' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Institution / University Name</label>
                  <input 
                    type="text"
                    value={institution}
                    onChange={(e) => handleInstitutionChange(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-xs outline-none focus:ring-2 focus:ring-red-500" 
                    placeholder="e.g. Umaru Musa Yar'adua University" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">State / Location</label>
                  <input 
                    type="text"
                    value={location}
                    onChange={(e) => handleLocationChange(e.target.value)}
                    className="w-full px-3 py-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-xs outline-none focus:ring-2 focus:ring-red-500" 
                    placeholder="e.g. Katsina State, Nigeria." 
                  />
                </div>
              </div>
            )}

            {/* Recipient Address Full Textarea */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Full Formatted Recipient Address *
                </label>
                <span className="text-[11px] text-gray-400">Directly editable</span>
              </div>
              <textarea 
                required 
                rows={4} 
                {...register('recipientAddress')} 
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm font-sans outline-none focus:ring-2 focus:ring-red-500" 
                placeholder="The Coordinator,&#10;Industrial Training / SIWES Unit,&#10;Umaru Musa Yar'adua University,&#10;Katsina State, Nigeria." 
              />
            </div>
          </div>

          {/* Section 3: Signatory Selection */}
          <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-3">
            <h3 className="text-xs uppercase font-bold text-gray-500 tracking-wider">
              3. Authorized Signatory
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Select Signing Officer *</label>
              <select
                onChange={handleSignatoryChange}
                defaultValue="Faiza Saidu"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="Faiza Saidu">Faiza Saidu — Chief Operations Officer (COO) [Default]</option>
                <option value="Aminu A. Saidu">Aminu A. Saidu — Managing Director (MD)</option>
                <option value="Isiyaku Saidu">Isiyaku Saidu — Chief Technology Officer (CTO)</option>
                <option value="Muhammad Said">Muhammad Said — Chief Marketing Officer (CMO)</option>
              </select>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button 
              type="button" 
              onClick={() => setIsCreateModalOpen(false)} 
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="px-5 py-2.5 bg-[#E50914] text-white rounded-xl hover:bg-red-700 disabled:opacity-50 inline-flex items-center text-sm font-medium shadow-sm transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Generating Letter...' : 'Generate Acceptance Letter'}
            </button>
          </div>
        </form>
      </Modal>

      {/* PREVIEW MODAL */}
      <Modal isOpen={!!previewLetter} onClose={() => setPreviewLetter(null)} title="Acceptance Letter Preview">
        {previewLetter && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-xl border border-gray-200 dark:border-gray-800 text-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-base">{previewLetter.studentName}</h4>
                  <p className="text-gray-500 font-mono text-xs">{previewLetter.matricNumber}</p>
                </div>
                <span className="bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400 text-xs px-2.5 py-1 rounded-full font-semibold">
                  Valid & Issued
                </span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-2 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p><strong>Department:</strong> {previewLetter.department}</p>
                {previewLetter.duration && <p><strong>Duration:</strong> {previewLetter.duration}</p>}
                <p><strong>Issued on:</strong> {format(new Date(previewLetter.dateIssued), 'MMMM d, yyyy')}</p>
                <p><strong>Signatory:</strong> {previewLetter.signatoryName} ({previewLetter.signatoryTitle})</p>
                <p className="whitespace-pre-line mt-2 text-gray-500 font-sans">
                  <strong>Addressed To:</strong><br/>{previewLetter.recipientAddress}
                </p>
              </div>

              {previewLetter.qrCodeUrl && (
                <div className="flex items-center gap-3 bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800 mt-2">
                  <img src={previewLetter.qrCodeUrl} alt="QR Code" className="w-16 h-16 rounded" />
                  <div className="text-xs">
                    <p className="font-semibold text-gray-800 dark:text-gray-200">Public Verification QR Code</p>
                    <a 
                      href={`https://nexviewconcept.com.ng/verify-letter/${previewLetter.id}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-red-600 hover:underline flex items-center mt-1"
                    >
                      Open Verification Link <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => handleDownload(previewLetter.id, previewLetter.matricNumber)}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-xs font-semibold inline-flex items-center"
              >
                <Download className="w-4 h-4 mr-1.5" /> Download PDF
              </button>
              <button 
                onClick={() => setPreviewLetter(null)} 
                className="px-4 py-2 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* EMAIL MODAL */}
      <Modal isOpen={!!sendEmailModal} onClose={() => setSendEmailModal(null)} title="Send Acceptance Letter via Email">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student or Institution Email Address *</label>
            <input 
              type="email" 
              value={emailTo} 
              onChange={e => setEmailTo(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 outline-none focus:ring-2 focus:ring-red-500" 
              placeholder="student@example.com" 
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setSendEmailModal(null)} className="px-4 py-2 border rounded-xl hover:bg-gray-50 text-sm">Cancel</button>
            <button 
              onClick={() => handleSendEmail(sendEmailModal!)} 
              disabled={!emailTo} 
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 inline-flex items-center text-sm font-medium"
            >
              <Mail className="w-4 h-4 mr-2" /> Send Email
            </button>
          </div>
        </div>
      </Modal>

      {/* WHATSAPP MODAL */}
      <Modal isOpen={!!sendWhatsappModal} onClose={() => setSendWhatsappModal(null)} title="Send Acceptance Letter via WhatsApp">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">WhatsApp Phone Number *</label>
            <input 
              type="text" 
              value={whatsappPhone} 
              onChange={e => setWhatsappPhone(e.target.value)} 
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm bg-white dark:bg-gray-900 outline-none focus:ring-2 focus:ring-red-500" 
              placeholder="e.g. 2348027683019" 
            />
            <p className="text-xs text-gray-500 mt-1">Include country code (e.g. 2348012345678 without '+')</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setSendWhatsappModal(null)} className="px-4 py-2 border rounded-xl hover:bg-gray-50 text-sm">Cancel</button>
            <button 
              onClick={() => handleSendWhatsapp(sendWhatsappModal!)} 
              disabled={!whatsappPhone} 
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-50 inline-flex items-center text-sm font-medium"
            >
              <MessageSquare className="w-4 h-4 mr-2" /> Send via WhatsApp
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
