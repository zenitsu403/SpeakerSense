import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Clock, Users, MessageSquare, BarChart2, 
  Download, FileText, FileJson, FileSpreadsheet, 
  File, ChevronDown 
} from "lucide-react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const MeetingAnalytics = () => {
  const { state } = useLocation();
  const { response_data } = state;
  const [showExportMenu, setShowExportMenu] = useState(false);
  const dropdownRef = useRef(null);
  
  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Your existing export functions remain the same
  const exportToWord = () => {
    try {
      let content = `Meeting Analytics Report\n\n`;
      content += `==========================================\n`;
      content += `MEETING OVERVIEW\n`;
      content += `==========================================\n`;
      content += `Duration: ${response_data.total_duration} minutes\n`;
      content += `Participants: ${response_data.num_participants}\n`;
      content += `Segments: ${response_data.total_segments}\n`;
      content += `Engagement Score: ${response_data.engagement_score.toFixed(1)}\n\n`;

      content += `==========================================\n`;
      content += `MEETING SUMMARY\n`;
      content += `==========================================\n`;
      content += `${response_data.meeting_summary}\n\n`;

      content += `==========================================\n`;
      content += `SPEAKER SUMMARIES\n`;
      content += `==========================================\n`;
      Object.entries(response_data.speaker_summaries).forEach(([speaker, summary]) => {
        content += `${speaker.toUpperCase()}\n`;
        content += `${summary}\n\n`;
      });

      content += `==========================================\n`;
      content += `FULL TRANSCRIPTION\n`;
      content += `==========================================\n`;
      response_data.transcriptions.forEach(item => {
        content += `${item.Speaker.toUpperCase()}\n`;
        content += `${item.Transcription}\n\n`;
      });

      downloadFile(content, 'meeting-analytics.doc', 'application/msword');
      setShowExportMenu(false);
    } catch (error) {
      console.error('Error exporting to Word:', error);
      alert('Failed to export Word document. Please try again.');
    }
  };

  const exportToJSON = () => {
    try {
      const jsonContent = JSON.stringify(response_data, null, 2);
      downloadFile(jsonContent, 'meeting-analytics.json', 'application/json');
      setShowExportMenu(false);
    } catch (error) {
      console.error('Error exporting to JSON:', error);
      alert('Failed to export JSON. Please try again.');
    }
  };

  const exportToText = () => {
    try {
      let content = `Meeting Analytics Report\n\n`;
      content += `Duration: ${response_data.total_duration} minutes\n`;
      content += `Participants: ${response_data.num_participants}\n`;
      content += `Segments: ${response_data.total_segments}\n`;
      content += `Engagement Score: ${response_data.engagement_score}\n\n`;
      content += `Meeting Summary:\n${response_data.meeting_summary}\n\n`;
      content += `Speaker Summaries:\n`;
      Object.entries(response_data.speaker_summaries).forEach(([speaker, summary]) => {
        content += `${speaker}:\n${summary}\n\n`;
      });
      content += `\nTranscriptions:\n`;
      response_data.transcriptions.forEach(item => {
        content += `${item.Speaker}: ${item.Transcription}\n`;
      });
      downloadFile(content, 'meeting-analytics.txt', 'text/plain');
      setShowExportMenu(false);
    } catch (error) {
      console.error('Error exporting to Text:', error);
      alert('Failed to export Text. Please try again.');
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      let yOffset = 20;
      
      doc.setFontSize(20);
      doc.text('Meeting Analytics Report', 20, yOffset);
      yOffset += 15;
      
      doc.setFontSize(12);
      doc.text(`Duration: ${response_data.total_duration} minutes`, 20, yOffset);
      yOffset += 7;
      doc.text(`Participants: ${response_data.num_participants}`, 20, yOffset);
      yOffset += 7;
      doc.text(`Segments: ${response_data.total_segments}`, 20, yOffset);
      yOffset += 7;
      doc.text(`Engagement Score: ${response_data.engagement_score}`, 20, yOffset);
      yOffset += 15;
      
      doc.setFontSize(14);
      doc.text('Meeting Summary', 20, yOffset);
      yOffset += 7;
      doc.setFontSize(12);
      const summaryLines = doc.splitTextToSize(response_data.meeting_summary, 170);
      doc.text(summaryLines, 20, yOffset);
      yOffset += (summaryLines.length * 7) + 10;
      
      doc.setFontSize(14);
      doc.text('Speaker Summaries', 20, yOffset);
      yOffset += 10;
      
      const speakerData = Object.entries(response_data.speaker_summaries).map(([speaker, summary]) => [speaker, summary]);
      doc.autoTable({
        startY: yOffset,
        head: [['Speaker', 'Summary']],
        body: speakerData,
        margin: { left: 20 },
        maxWidth: 170
      });
      
      yOffset = doc.lastAutoTable.finalY + 15;
      
      if (yOffset > 250) {
        doc.addPage();
        yOffset = 20;
      }
      
      doc.setFontSize(14);
      doc.text('Full Transcription', 20, yOffset);
      yOffset += 10;
      
      const transcriptionData = response_data.transcriptions.map(item => [item.Speaker, item.Transcription]);
      doc.autoTable({
        startY: yOffset,
        head: [['Speaker', 'Transcription']],
        body: transcriptionData,
        margin: { left: 20 },
        maxWidth: 170
      });
      
      doc.save('meeting-analytics.pdf');
      setShowExportMenu(false);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const downloadFile = (content, fileName, contentType) => {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportOptions = [
    { label: 'Word', icon: FileSpreadsheet, onClick: exportToWord, color: 'text-blue-400' },
    { label: 'JSON', icon: FileJson, onClick: exportToJSON, color: 'text-yellow-400' },
    { label: 'Text', icon: FileText, onClick: exportToText, color: 'text-blue-400' },
    { label: 'PDF', icon: File, onClick: exportToPDF, color: 'text-red-400' },
  ];

  return (
    <div className="pt-20 min-h-screen bg-gray-900 text-gray-100">
      <div className="px-6 md:px-8 pb-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Meeting Analytics
          </h1>
          
          {/* Modern Export Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 
                       border border-gray-700 rounded-lg transition-all duration-200 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
              <ChevronDown 
                className={`w-4 h-4 transition-transform duration-200 ${
                  showExportMenu ? 'rotate-180' : ''
                }`}
              />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg bg-gray-800 border border-gray-700 
                           shadow-lg ring-1 ring-black ring-opacity-5 transform transition-all duration-200 
                           origin-top-right divide-y divide-gray-700">
                {exportOptions.map((option, index) => (
                  <button
                    key={option.label}
                    onClick={() => {
                      option.onClick();
                      setShowExportMenu(false);
                    }}
                    className={`flex items-center w-full px-4 py-3 text-sm text-gray-200 
                              hover:bg-gray-700/50 transition-colors duration-150
                              ${index === 0 ? 'rounded-t-lg' : ''} 
                              ${index === exportOptions.length - 1 ? 'rounded-b-lg' : ''}`}
                  >
                    <option.icon className={`w-4 h-4 mr-3 ${option.color}`} />
                    <span className="flex-1 text-left">Export as {option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold">Duration</h3>
            </div>
            <div className="text-3xl font-bold text-blue-400">{response_data.total_duration}</div>
            <div className="text-sm text-gray-400">minutes</div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <Users className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold">Participants</h3>
            </div>
            <div className="text-3xl font-bold text-purple-400">{response_data.num_participants}</div>
            <div className="text-sm text-gray-400">speakers detected</div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-pink-500 transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <MessageSquare className="w-6 h-6 text-pink-400" />
              <h3 className="text-lg font-semibold">Segments</h3>
            </div>
            <div className="text-3xl font-bold text-pink-400">{response_data.total_segments}</div>
            <div className="text-sm text-gray-400">conversation turns</div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-all">
            <div className="flex items-center space-x-3 mb-4">
              <BarChart2 className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold">Engagement</h3>
            </div>
            <div className="text-3xl font-bold text-green-400">{response_data.engagement_score.toFixed(1)}</div>
            <div className="text-sm text-gray-400">out of 10</div>
          </div>
        </div>

        {response_data.meeting_summary && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-gray-100">Meeting Summary</h2>
            <p className="text-gray-300 leading-relaxed">{response_data.meeting_summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(response_data.speaker_summaries).map(([speaker, summary]) => (
            <div key={speaker} className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold mb-3 text-blue-400">{speaker}</h2>
              <p className="text-gray-300 leading-relaxed">{summary}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6 text-gray-100">Full Transcription</h2>
          <div className="space-y-4">
            {response_data.transcriptions.map((item, index) => (
              <div key={index} className="border-b border-gray-700 last:border-0 pb-4 last:pb-0">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">{item.Speaker}</h3>
                <p className="text-gray-300">{item.Transcription}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingAnalytics;