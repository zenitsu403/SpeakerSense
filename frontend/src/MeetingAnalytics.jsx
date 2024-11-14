import { useLocation } from 'react-router-dom';

const MeetingAnalytics = () => {
  const { state } = useLocation();
  const { response_data } = state;
  console.log(response_data)
  return (
    <div className="meeting-analytics">
      <h1>Meeting Analytics</h1>

      <div className="analytics-overview bg-white rounded-lg shadow-lg p-8 mb-8 scrollbar-custom">
        <h2>Analytics Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <h3>Total Duration</h3>
            <div className="value">{response_data.total_duration}</div>
            <div className="unit">minutes</div>
          </div>
          <div className="card">
            <h3>Participants</h3>
            <div className="value">{response_data.num_participants}</div>
            <div className="unit">speakers detected</div>
          </div>
          <div className="card">
            <h3>Total Segments</h3>
            <div className="value">{response_data.total_segments}</div>
            <div className="unit">conversation turns</div>
          </div>
          <div className="card">
            <h3>Engagement Score</h3>
            <div className="value">{response_data.engagement_score.toFixed(1)}</div>
            <div className="unit">out of 10</div>
          </div>
        </div>
      </div>

      {response_data.meeting_summary && (
        <div className="meeting-summary bg-white rounded-lg shadow-lg p-8 mb-8 scrollbar-custom">
          <h2>Meeting Summary</h2>
          <p>{response_data.meeting_summary}</p>
        </div>
      )}

      {Object.keys(response_data.speaker_summaries).map((speaker) => (
        <div key={speaker} className="speaker-summaries bg-white rounded-lg shadow-lg p-8 mb-8 scrollbar-custom">
          <h2>{speaker}</h2>
          <p className="speaker-summary">{response_data.speaker_summaries[speaker]}</p>
        </div>
      ))}

      <div className="full-transcription bg-white rounded-lg shadow-lg p-8 mb-8 scrollbar-custom">
        <h2>Full Transcription</h2>
        {response_data.transcriptions.map((item, index) => (
          <div key={index} className="transcription-item">
            <h3>Speaker: {item.Speaker}</h3>
            <p>{item.Transcription}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingAnalytics;